#!/usr/bin/env python
"""
Check markdown files for broken links.

Usage (from repo root):
tools/check-external-links.py [folder/to/check/]

If [folder/to/check] is omitted, check ./docs/

Prints a report of broken links. In the default mode, checks external links in
Markdown files only. Pass --live to test against a local Redocly dev server,
which checks *all* links, including anchors and markdoc tags; assumes the 
server is already up and running on localhost:4000.

Requires: beautifulsoup4, markdown, requests
For live mode, selenium and Chrome are also required.

Links & sites that often report false-positives can be added to broken-links.txt
to have the link checker skip them.
"""

import argparse
import json
import logging
import os
import re
from time import time, sleep

import requests
from requests.adapters import HTTPAdapter, Retry
from markdown import markdown
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import StaleElementReferenceException, NoSuchElementException

CHECK_IN_INTERVAL = 30 # Seconds before printing *something* as a keep-alive
DEFAULT_SKIP_PATHS = [
    ".git",
    "node_modules",
    ".venv",
    ".claude",
    "__pycache__",
    "_snippets",
    "_code-samples", # Debatably, we might want to link-check the READMEs here
    "_api-examples",
    "_sources",
]
MAX_RETRIES = 1 # Times to retry if a link doesn't work
TIMEOUT_SECONDS = 8 # Seconds before giving up on a link
RECHECK_INTERVAL = 60*60*24*7 # Seconds before re-checking a link
CACHE_WRITE_INTERVAL = 60 # Save cache after this many seconds even if ongoing
SAME_HOST_DELAY = 0.5 # Seconds to wait before calling the same host again
DEFAULT_CACHE_FILE = "link-cache.json"
CACHE_FILE_FOLDER = "tools" # Check this folder for cache file
KNOWN_BROKEN_LINKS_FILE = "broken-links.txt" # List of links that work "normally" but report false-positives in this link checker
BROKEN_LINKS_REPORT_FILE = "broken-links-report.md" # Generated only when broken links are found
USER_AGENT = "xrpl-dev-portal-link-checker/0.1" # Identify self to websites
REDOCLY_DEV_BASE = "http://localhost:4000/"
UNMATCHED_REFLINK_REGEX = re.compile(r"(\[[^\]]+)?\]\[(\w| )*\]")

logger = logging.getLogger(__name__)
logger.addHandler(logging.StreamHandler())
logger.propagate = False

class LinkChecker:
    def __init__(self, topdir,
            skip_paths = DEFAULT_SKIP_PATHS,
            cache_file = DEFAULT_CACHE_FILE,
            known_broken = KNOWN_BROKEN_LINKS_FILE,
            live = False
        ):
        self.topdir = topdir
        self.skip_paths = skip_paths
        self.last_checkin = time()
        self.last_cache_update = 0
        self.live = live
        self.setup_sessions()
        self.init_cache(cache_file)
        self.init_known_broken(known_broken)

    def init_cache(self, cache_file: str):
        self.anchor_cache = {}
        if not cache_file:
            logger.debug("No cache file, not loading anything.")
            self.cache = {}
            return

        # Default to tools/link-cache.json whether the script is run from repo
        # top or from within tools
        if cache_file == DEFAULT_CACHE_FILE and os.path.basename(os.getcwd()) != CACHE_FILE_FOLDER:
            cache_file = os.path.join(CACHE_FILE_FOLDER, cache_file)
        self.cache_file = cache_file

        try:
            with open(cache_file) as f:
                self.cache = json.load(f)
        except Exception as e:
            logger.warning(f"Unable to load cache file {cache_file}")
            self.cache = {}
        # Invalidate cache entries if last check failed or last success was
        # more than RECHECK_INTERVAL ago
        invalidate_keys = []
        for href, result in self.cache.items():
            was_good, time_checked = result
            if not was_good or time() - time_checked > RECHECK_INTERVAL:
                invalidate_keys.append(href)
            if self.trim_trackers(href) != href:
                # Probably a cached entry including tracking parameters from
                # before changing what tracking parameters get removed
                invalidate_keys.append(href)
        for href in invalidate_keys:
            del self.cache[href]
        logger.debug(f"Removed {len(invalidate_keys)} items from cache")

        self.last_cache_update = time()

    def write_cache(self):
        if not self.cache_file:
            return
        with open(self.cache_file, "w") as f:
            json.dump(self.cache, f)
        self.last_cache_update = time()

    def setup_sessions(self):
        retries = Retry(total=MAX_RETRIES, backoff_factor=1, status_forcelist=[ 502, 503, 504 ])
        self.s = requests.Session()
        self.s.mount("https://", HTTPAdapter(max_retries=retries))
        self.h = requests.Session()
        self.h.mount("http://", HTTPAdapter(max_retries=retries))
        self.h.headers.update({"User-Agent": USER_AGENT})
        self.s.headers.update({"User-Agent": USER_AGENT})
        self.last_host_called = None

        if self.live:
            options = webdriver.ChromeOptions()
            options.add_argument("--headless=new")
            self.chrome = webdriver.Chrome(options=options)
            # Make a second one so we can check for anchors without resetting
            # all the references we have in the page the link comes from
            self.chrome2 = webdriver.Chrome(options=options)

    def init_known_broken(self, known_broken):
        self.exact_known_broken = []
        self.wildcard_known_broken = []

        if known_broken == KNOWN_BROKEN_LINKS_FILE and os.path.basename(os.getcwd()) != CACHE_FILE_FOLDER:
            known_broken = os.path.join(CACHE_FILE_FOLDER, known_broken)
        try:
            with open(known_broken) as f:
                kb_text = f.read()
        except (FileNotFoundError):
            logger.warning("No known broken links file; proceeding without.")
            return

        for line in kb_text.split("\n"):
            line = line.strip()
            if not line or line[:1] == "#":
                continue
            if line[-1:] == "*":
                self.wildcard_known_broken.append(line[:-1])
            else:
                self.exact_known_broken.append(line)

    def checkin(self, current_ref: str):
        """
        Print output periodically so you know the job is still running, and
        save the cache file if it needs updating.
        """
        if time() - self.last_checkin > CHECK_IN_INTERVAL:
             print(f"... still working ({current_ref}) ...")
             self.last_checkin = time()
        if time() - self.last_cache_update > CACHE_WRITE_INTERVAL:
            self.write_cache()

    def walk(self):
        logger.info(f"Checking files in {os.path.abspath(self.topdir)}")
        externalCache = []
        broken_links = []
        total_links_checked = 0
        last_checkin = time()
        for dirpath, dirnames, filenames in os.walk(self.topdir):
            self.checkin(f"dir: {dirpath}")
            if dirpath in self.skip_paths:
                logger.debug(f"Skipping ignored path {dirpath}")
                continue
            for fname in filenames:
                self.checkin(f"file: {fname}")
                in_file = os.path.join(dirpath, fname)

                if in_file.endswith(".md"):
                    if self.live:
                        newly_checked, newly_broken = self.check_file_live(in_file)
                    else:
                        newly_checked, newly_broken = self.check_file(in_file)
                    broken_links += newly_broken
                    total_links_checked += newly_checked
                if in_file.endswith(".page.tsx") and self.live:
                    newly_checked, newly_broken = self.check_file_live(in_file)
                    broken_links += newly_broken
                    total_links_checked += newly_checked
        self.report(broken_links, total_links_checked)

    def check_file(self, in_file: str):
        """
        Given a specific .md file, look for external links in it and check them.
        Returns how many were checked and a list of tuples where each member is
        a (file,link) pair representing a broken link.

        Note that this does not parse Markdoc including partials so it can't
        handle the full context of the Redocly parser but those *usually* won't
        be needed for external links.
        """
        logger.info(f"Checking file {in_file}")
        with open(in_file, 'r', encoding="utf-8") as f:
            html = markdown(f.read())
        soup = BeautifulSoup(html, "html.parser")
        links = soup.find_all("a")
        broken = []
        num_checked = 0
        for link in links:
            self.checkin(f"link: {link}")
            if "href" not in link.attrs:
                # probably an <a name> type anchor, skip
                continue
            if (link["href"].startswith("https://") or
                link["href"].startswith("http://")):
                was_checked, was_good = self.check_link(link["href"])
                num_checked += was_checked
                if not was_good:
                    broken.append( (in_file, link["href"]) )
        return num_checked, broken
    
    def check_file_live(self, in_file: str):
        """
        Given a specific .md file, fetch it from the Redocly dev server and
        check for links in it.
        """
        suffixes = ["/index.md", ".md", "/index.page.tsx", ".page.tsx"] # order matters
        for suffix in suffixes:
            if in_file.endswith(suffix):
                path = in_file[:-len(suffix)]
                break
        else:
            logger.warning(f"Not checking path that's not an md or page.tsx file: {in_file}")
            return (0, [])
        url = REDOCLY_DEV_BASE + path
        code = self.fetch(url)
        if code < 200 or code >= 400:
            logger.warning(f"Failed to get page from dev server for file {in_file}")
            return 0, []

        broken = []
        num_checked = 0
        logger.info(f"Checking path {path}")
        self.chrome.get(REDOCLY_DEV_BASE+path)
        # sleep(0.2) # give it a moment in case hydration fails or something
        rootlayout = self.chrome.find_element(By.CSS_SELECTOR, '[data-component-name="layouts/RootLayout"]')
        try:
            links = rootlayout.find_elements(By.CSS_SELECTOR, "a")
            pagetext = rootlayout.text
            hrefs = [link.get_attribute("href") for link in links]
        except StaleElementReferenceException:
            # This can happen when hydration fails or the page is updated
            # asynchronously, for example by fetching amendment status.
            # Try again and hopefully it works this time.
            sleep(0.2)
            rootlayout = self.chrome.find_element(By.CSS_SELECTOR, '[data-component-name="layouts/RootLayout"]')
            pagetext = rootlayout.text
            links = rootlayout.find_elements(By.CSS_SELECTOR, "a")
            hrefs = [link.get_attribute("href") for link in links]
        for href in hrefs:
            self.checkin(f"link: {href}")
            if not href:
                # Probably a name anchor something, skip
                continue
            if href.startswith(REDOCLY_DEV_BASE):
                was_checked, was_good = self.check_dev_link(href)
                num_checked += was_checked
                if not was_good:
                    broken.append( (in_file, href) )
            elif href.startswith("http://") or href.startswith("https://"):
                was_checked, was_good = self.check_link(href)
                num_checked += was_checked
                if not was_good:
                    broken.append( (in_file, href) )
        broken_reflinks = self.check_for_unparsed_reflinks(pagetext)
        for brl in broken_reflinks:
            broken.append( (in_file, brl) )
        return num_checked, broken
    
    def check_for_unparsed_reflinks(self, text: str):
        unparsed_links = []
        matches = UNMATCHED_REFLINK_REGEX.finditer(text)
        for m in matches:
            logger.warning(f"... ... Unparsed reference link: {m.group(0)}")
            unparsed_links.append(m.group(0))
        return unparsed_links

    def is_known_broken(self, href: str):
        if href in self.exact_known_broken:
            return True
        for pattern in self.wildcard_known_broken:
            if href.startswith(pattern):
                return True
        return False

    def fetch(self, href: str):
        """
        Get status code of a URL, using saved sessions & retries, automatically
        failing over from HTTP HEAD to HTTP GET and adding a slight delay to
        avoid hammering the same host repeatedly.
        """
        proto,predicate = href.split("//",1)
        host = predicate.split("/", 1)[0]
        if host == self.last_host_called:
            sleep(SAME_HOST_DELAY)
        self.last_host_called = host

        if href.startswith("http://"):
            sess = self.h
        else:
            sess = self.s

        try:
            code = sess.head(href, timeout=TIMEOUT_SECONDS).status_code
        except Exception as e:
            logger.debug(f"Error getting {href}: {e}")
            try:
                code = sess.get(href, timeout=TIMEOUT_SECONDS).status_code
            except Exception as e2:
                logger.debug(f"Error getting {href}: {e2}")
                code = 500

        return code

    def trim_trackers(self, href: str):
        if "?__hstc=" in href:
            return href[:href.find("?__hstc=")]
        return href

    def check_link(self, href: str):
        href = self.trim_trackers(href)
        if href in self.cache.keys():
            logger.debug(f"... Skipping (cached): {href}")
            was_good, time_checked = self.cache[href]
            return (1, was_good)
        if self.is_known_broken(href):
            logger.debug(f"... Skipping (known broken): {href}")
            return (0, True)
        logger.info(f"... Testing link {href}")
        code = self.fetch(href)
        if code < 200 or code >= 400:
            logger.warning(f"... Broken link to {href}")
            self.cache[href] = (False, time())
            return (1, False)
        logger.info("... ... success.")
        self.cache[href] = (True, time())
        return (1, True)
    
    def check_dev_link(self, href: str):
        """
        Check a local dev link; if it has an anchor, use the Chrome driver to 
        check for the presence of an element with a matching ID, otherwise fall
        back to just checking that the page exists.
        """
        if self.is_known_broken(href):
            logger.debug(f"... Skipping (known broken): {href}")
            return (0, True)
        if "#" in href and href.split("#",1)[1].strip():
            if href in self.anchor_cache.keys():
                return (1, self.anchor_cache[href])
            id = href.split("#",1)[1].strip()
            # Use the selenium driver to check for the exact anchor
            self.chrome2.get(href)
            sleep(0.3) # delay to give it time for hydration failures
            try:
                el = self.chrome2.find_element(By.ID, id)
            except NoSuchElementException:
                el = None
            if el:
                self.anchor_cache[href] = True
                return (1, True)
            else:
                self.anchor_cache[href] = False
                return (1, False)
        return self.check_link(href)

    def report(self, broken_links: list, total_links_checked: int):
        print("---------------------------------------------------------------")
        print(f"{len(broken_links)} broken links found among {total_links_checked} total links.")
        last_printed_in_file = None
        for in_file, href in broken_links:
            if in_file != last_printed_in_file:
                print("File:", in_file)
                last_printed_in_file = in_file
            print("  Link:", href)

        if broken_links:
            self.write_broken_links_report(broken_links, total_links_checked)

    def write_broken_links_report(self, broken_links: list, total_links_checked: int):
        """
        Write a Markdown report of broken links to BROKEN_LINKS_REPORT_FILE,
        grouped by the file that contained each link. Only called when at
        least one broken link was found.
        """
        by_file = {}
        for in_file, href in broken_links:
            by_file.setdefault(in_file, []).append(href)

        lines = []
        lines.append("# Broken links report")
        lines.append("")
        lines.append(
            f"**{len(broken_links)} broken link(s) found** in {len(by_file)} file(s) "
            f"(out of {total_links_checked} total links checked)."
        )
        lines.append("")

        for in_file in sorted(by_file):
            lines.append(f"### `{in_file}`")
            for href in by_file[in_file]:
                lines.append(f"- {href}")
            lines.append("")

        # Mirror cache-file path resolution: tools/<name> when run from repo root,
        # bare <name> when already cd'd into tools/.
        out_path = BROKEN_LINKS_REPORT_FILE
        if os.path.basename(os.getcwd()) != CACHE_FILE_FOLDER:
            out_path = os.path.join(CACHE_FILE_FOLDER, out_path)

        with open(out_path, "w") as f:
            f.write("\n".join(lines))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="XRPL Dev Portal link checker")
    noisiness = parser.add_mutually_exclusive_group(required=False)
    noisiness.add_argument("--quiet", "-q", action="store_true",
            help="Suppress informational status messages")
    noisiness.add_argument("--debug", "-d", action="store_true",
            help="Print debug-level log messages")
    parser.add_argument("--live", "-l", action="store_true", 
            help="Use a Selenium-powered browser session to get rendered docs")
    parser.add_argument("path", type=str, nargs="?", default="docs/",
            help="Check *.md files in this directory (including subdirs)")

    cli_args = parser.parse_args()
    if cli_args.quiet:
        logger.setLevel(logging.WARNING)
    elif cli_args.debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    l = LinkChecker(cli_args.path, live=cli_args.live)
    try:
        l.walk()
    except (KeyboardInterrupt) as e:
        l.write_cache()


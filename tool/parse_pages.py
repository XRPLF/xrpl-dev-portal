#!/usr/bin/env python3

################################################################################
# ripple-dev-portal doc parser
#
# Generate the html for all the Ripple Dev  Portal files from a template
################################################################################

DEFAULT_CONFIG_FILE = "devportal-config.yml"

import os
import re
import yaml
import argparse
import logging

# Necessary to copy static files to the output dir
from distutils.dir_util import copy_tree

# Necessary for prince
import subprocess

# Used to fetch markdown sources from GitHub repos
import requests

# Various content and template processing stuff
from jinja2 import Environment, FileSystemLoader
from markdown import markdown
from bs4 import BeautifulSoup

# Watchdog stuff
import time
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

# The log level is configurable at runtime (see __main__ below)
logger = logging.getLogger()


def load_config(config_file=DEFAULT_CONFIG_FILE):
    """Reload config from a YAML file."""
    global config
    logger.info("loading config file %s..." % config_file)
    with open(config_file, "r") as f:
        config = yaml.load(f)
        assert(config["targets"])
        assert(config["pages"])
        assert(config["pdf_template"])
        assert(config["default_template"])
        assert(config["content_path"])
        assert(config["out_path"])
        assert(config["temporary_files_path"])
        assert(config["template_static_path"])
        assert(config["content_static_path"])
        if "prince_executable" not in config or not config["prince_executable"]:
            config["prince_executable"] = "prince" # A reasonable default


def remove_doctoc(md):
    """Strip out doctoc Table of Contents for RippleAPI"""
    DOCTOC_START = "<!-- START doctoc generated TOC please keep comment here to allow auto update -->"
    DOCTOC_END = "<!-- END doctoc generated TOC please keep comment here to allow auto update -->"
    
    doctoc_start_i = md.find(DOCTOC_START)
    doctoc_end_i = md.find(DOCTOC_END)
    if doctoc_start_i != -1 and doctoc_end_i != -1:
        logger.info("... stripping doctoc...")
        md = md[:doctoc_start_i]+md[doctoc_end_i+len(DOCTOC_END):]
    return md


def enable_multicode(html):
    """Uncomment multicode tab divs"""
    MC_START_REGEX = re.compile("<!-- *<div class='multicode'[^>]*> *-->")
    MC_END_REGEX = re.compile("<!-- *</div> *-->")
    
    logger.info("... enabling multicode tabs...")
    
    html = re.sub(MC_START_REGEX, "<div class='multicode'>", html)
    html = re.sub(MC_END_REGEX, "</div>", html)
    return html


def standardize_header_ids(soup):
    """replace underscores with dashes in h1,h2,etc. for backwards compatibility"""
    logger.info("... standardizing headers...")
    headers = soup.find_all(name=re.compile("h[0-9]"), id=True)
    for h in headers:
        if "_" in h["id"]:
            h["id"] = h["id"].replace("_", "-")


def buttonize_try_it(soup):
    """make links ending in > render like buttons"""
    logger.info("... buttonizing try-it links...")
    buttonlinks = soup.find_all("a", string=re.compile(">$"))
    for link in buttonlinks:
        if "class" in link.attrs:
            link["class"].append("button")
        else:
            link["class"] = "button"


def markdown_in_div_elements(md):
    """Python markdown requires markdown="1" on HTML block elements
       that contain markdown. AND there's a bug where if you use
       markdown.extensions.extra, it replaces code fences in HTML
       block elements with garbled text."""
    def add_markdown_class(m):
        if m.group(0).find("markdown=") == -1:
            return m.group(1) + ' markdown="1">'
        else:
            return m.group(0)

    logger.info("... adding markdown class to embedded divs...")
    md = re.sub(r"(<div[^>]*)>", add_markdown_class, md)
    return md
    

def substitute_links_for_target(soup, target):
    """Replaces local-html-links with appropriate substitutions
       for the given target"""
    logger.info("... modifying links for target", target["name"])
    if not pages:
        pages = get_pages()

    links = soup.find_all("a", href=re.compile(r"^[^.]+\.html"))
    for link in links:
        for page in pages:
            if target["name"] in page:
                #There's a replacement link for this env
                local_url = page["html"]
                target_url = page[target["name"]]
                if link["href"][:len(local_url)] == local_url:
                    link["href"] = link["href"].replace(local_url,
                                                        target_url)

def get_target(target):
    """Get a target by name, or return the default target object.
       We can't use default args in function defs because the default is 
       set at runtime based on config"""
    if target == None:
        return config["targets"][0]
    
    if type(target) == str:
        try:
            return next(t for t in config["targets"] if t["name"] == target)
        except StopIteration:
            logger.critical("Unknown target: %s" % target)
            exit(1)
    
    if "name" in target:
        # Eh, it's probably a target, just return it
        return target

def parse_markdown(md, target=None, pages=None):
    """Take a markdown string and output HTML for that content"""
    target = get_target(target)

    # Mostly unnecessary as long as the multicode divs are commented out
##    markdown_in_div_elements(md)

    # RippleAPI doc file has an extra table-of-contents at the start
    md = remove_doctoc(md)

    # Actually parse the markdown
    logger.info("... parsing markdown...")
    html = markdown(md, extensions=["markdown.extensions.extra",
                                    "markdown.extensions.toc"])

    # If target uses multicode tabs, uncomment the divs now
    if target["multicode_tabs"]:
        html = enable_multicode(html)

    # At this point, HTML manipulations are easier on a soup than a string
    soup = BeautifulSoup(html, "html.parser")
    
    # Mostly necessary for compatibility with legacy content
    standardize_header_ids(soup)

    #buttonize links ending in >
    buttonize_try_it(soup)

    # Replace links for live site
    if target["name"] != config["targets"][0]["name"]:
        substitute_links_for_target(soup, target)

    logging.info("... re-rendering HTML from soup...")
    html2 = str(soup)
    return html2


def githubify_markdown(md, target=None, pages=None):
    """Github-friendly markdown has absolute links, no md in divs"""
    MARKDOWN_LINK_REGEX = re.compile(
        r"(\[([^\]]+)\]\(([^:)]+)\)|\[([^\]]+)\]:\s*(\S+)$)", re.MULTILINE)
    
    target = get_target(target)
    if not pages:
        pages = get_pages(target["name"])

    class MDLink:
        """A markdown link, either a reference link or inline link"""
        def __init__(self, fullmatch, label, url, label2, url2):
            self.fullmatch = fullmatch
            if label:
                self.label = label
                self.url = url
                self.is_reflink = False
            elif label2:
                self.label = label2
                self.url = url2
                self.is_reflink = True

        def to_markdown(self):
            """Re-represent self as a link in markdown syntax"""
            s = "[" + self.label + "]"
            if self.is_reflink:
                s += ": " + self.url
            else:
                s += "(" + self.url + ")"
            return s

    links = [MDLink(*m) for m in MARKDOWN_LINK_REGEX.findall(md)]

    for link in links:
        for page in pages:
            if target["name"] in page:
                #There's a replacement link for this
                local_url = page["html"]
                target_url = page[target["name"]]
                if link.url[:len(local_url)] == local_url:
                    link.url = link.url.replace(local_url, target_url)
                    md = md.replace(link.fullmatch, link.to_markdown())

    return md


def get_pages(target=None):
    """Read pages from config and return an object, optionally filtered
       to just the pages that this target cares about"""

    pages = config["pages"]

    if target["name"]:
        #filter pages that aren't part of this target
        def should_include(page, target_name):
            #If no target list specified, then include in all targets
            if "targets" not in page:
                return True
            if target_name in page["targets"]:
                return True
            else:
                return False
        pages = [page for page in pages
                 if should_include(page, target["name"])]
    return pages


def get_categories(pages):
    """Produce an ordered, de-duplicated list of categories from 
       the page list"""
    categories = []
    for page in pages:
        if "category" in page and page["category"] not in categories:
            categories.append(page["category"])
    logger.info("categories: %s" % categories)
    return categories


def read_markdown_local(filename, pp_env, target=None):
    """Read in a markdown file and pre-process any templating lang in it,
       returning the parsed contents."""
    target = get_target(target)
    pages = get_pages(target)
    logging.info("reading markdown from file: %s" % filename)
    md_raw = pp_env.get_template(filename)
    return md_raw.render(target=target, pages=pages)


def read_markdown_remote(url):
    """Fetch a remote markdown file and return its contents"""
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        raise requests.RequestException("Status code for page was not 200")


def get_markdown_for_page(md_where, pp_env=None, target=None):
    """Read/Fetch and pre-process markdown file"""
    target = get_target(target)
    if "http:" in md_where or "https:" in md_where:
        return read_markdown_remote(md_where)
    else:
        return read_markdown_local(md_where, pp_env, target)


def copy_static_files(template_static=True, content_static=True, out_path=None):
    """Copy static files to the output directory."""
    if out_path == None:
        out_path = config["out_path"]
    
    
    if template_static:
        template_static_src = config["template_static_path"]
        template_static_dst = os.path.join(out_path, 
                                       os.path.basename(template_static_src))
        copy_tree(template_static_src, template_static_dst)
    
    if content_static:
        content_static_src = config["content_static_path"]
        content_static_dst = os.path.join(out_path, 
                                           os.path.basename(content_static_src))
        copy_tree(content_static_src, content_static_dst)


def render_pages(target=None, for_pdf=False):
    """Parse and render all pages in target, writing files to out_path."""
    target = get_target(target)
    pages = get_pages(target)
    categories = get_categories(pages)

    env = Environment(loader=FileSystemLoader(os.path.curdir))
    env.lstrip_blocks = True
    env.trim_blocks = True
    
    if for_pdf:
        logging.info("reading pdf template...")
        default_template = env.get_template(config["pdf_template"])
    else:
        logging.info("reading default template...")
        default_template = env.get_template(config["default_template"])

    pp_env = Environment(loader=FileSystemLoader(config["content_path"]))
    #Example: if we want to add custom functions to the md files
    #pp_env.globals['foo'] = lambda x: "FOO %s"%x

    for currentpage in pages:
        if "md" in currentpage:
            # Read and parse the markdown
            
            try:
                md_content = get_markdown_for_page(currentpage["md"],
                                                   pp_env=pp_env,
                                                   target=target)
            except Exception as e:
                print("Skipping page", currentpage["name"], 
                      "due to error fetching contents:", e)
                continue
            
            html_content = parse_markdown(md_content, target, pages)
        else:
            html_content = ""
        
        if "template" in currentpage:
            # Use a template other than the default one
            template = env.get_template(currentpage["template"])
            out_html = template.render(currentpage=currentpage,
                                       categories=categories,
                                       pages=pages,
                                       content=html_content)
        else:
            out_html = default_template.render(currentpage=currentpage,
                                               categories=categories,
                                               pages=pages,
                                               content=html_content)
        
        if for_pdf:
            out_path = config["temporary_files_path"]
        else:
            out_path = config["out_path"]
        fileout = os.path.join(out_path, currentpage["html"])
        if not os.path.isdir(out_path):
            logging.info("creating build folder %s" % out_path)
            os.makedirs(out_path)
        with open(fileout, "w") as f:
            logging.info("writing to file: %s..." % fileout)
            f.write(out_html)


def watch(pdf_file, target):
    """Look for changed files and re-generate HTML (and optionally 
       PDF whenever there's an update. Runs until interrupted."""
    target = get_target(target)

    class UpdaterHandler(PatternMatchingEventHandler):
        """Updates to pattern-matched files means rendering."""
        def on_any_event(self, event):
            logging.info("got event!")
            if pdf_file:
                make_pdf(pdf_file, target=target)
            else:
                render_pages(target)
            logging.info("done rendering")

    patterns = ["*template-*.html",
                "*.md",
                "*code_samples/*"]

    event_handler = UpdaterHandler(patterns=patterns)
    observer = Observer()
    observer.schedule(event_handler, config["template_path"], recursive=True)
    observer.schedule(event_handler, config["content_path"], recursive=True)
    observer.start()
    # The above starts an observing thread,
    #   so the main thread can just wait
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


def make_pdf(outfile, target=None):
    """Use prince to convert several HTML files into a PDF"""
    logging.info("rendering PDF-able versions of pages...")
    target = get_target(target)
    render_pages(target=target, for_pdf=True)

    temp_files_path = config["temporary_files_path"]
    
    # Prince will need the static files, so copy them over
    copy_static_files(out_path=temp_files_path)

    # Start preparing the prince command
    args = [config["prince_executable"], '-o', outfile]
    # Each HTML output file in the target is another arg to prince
    pages = get_pages(target)
    args += [os.path.join(temp_files_path, p["html"]) for p in pages]
    
    logger.info("generating PDF: running %s..." % " ".join(args))
    prince_resp = subprocess.check_output(args, universal_newlines=True)
    print(prince_resp)


def githubify(md_file_name, target=None):
    """Wrapper - make the markdown resemble GitHub flavor"""
    target = get_target(target)
    
    filein = os.path.join(CONTENT_PATH, md_file_name)
    with open(filein, "r") as f:
        md = f.read()
    pages = get_pages()
    
    rendered_md = githubify_markdown(md, target=target, pages=pages)
    
    if not os.path.isdir(out_path):
        logging.info("creating build folder %s" % out_path)
        os.makedirs(out_path)
    
    fileout = os.path.join(config["out_path"], md_file_name)
    with open(fileout, "w") as f:
        f.write(rendered_md)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Generate static site from markdown and templates.')
    parser.add_argument("--watch", "-w", action="store_true",
                        help="Watch for changes and re-generate output."+\
                             "This runs until force-quit.")
    parser.add_argument("--pdf", type=str,
                        help="Output a PDF to this file. Requires Prince.")
    parser.add_argument("--githubify", "-g", type=str,
                        help="Output md prepared for GitHub")
    parser.add_argument("--target", "-t", type=str,
                        help="Build for the specified target.")
    parser.add_argument("--out_dir", "-o", type=str,
                        help="Output to this folder (overrides config file)")
    parser.add_argument("--quiet", "-q", action="store_true",
                        help="Suppress status messages")
    parser.add_argument("--config", "-c", type=str,
                        help="Specify path to an alternate config file.")
    parser.add_argument("--copy_static", "-s", action="store_true",
                        help="Copy static files to the out dir",
                        default=False)
    cli_args = parser.parse_args()
    
    if not cli_args.quiet:
        logging.basicConfig(level=logging.INFO)
    
    if cli_args.config:
        load_config(cli_args.config)
    else:
        load_config()

    if cli_args.out_dir:
        config["out_path"] = cli_args.out_dir

    if cli_args.githubify:
        githubify(cli_args.githubify, cli_args.target)
        if cli_args.copy_static:
            copy_static(template_static=False, content_static=True)
        exit(0)

    if cli_args.pdf:
        if cli_args.pdf[-4:] != ".pdf":
            exit("PDF filename must end in .pdf")
        logging.info("making a pdf...")
        make_pdf(cli_args.pdf)
        logging.info("pdf done")

    else:
        logging.info("rendering pages...")
        render_pages(target=cli_args.target)
        logging.info("done rendering")
    
        if cli_args.copy_static:
            logging.info("copying static pages...")
            copy_static_files()

    if cli_args.watch:
        logging.info("watching for changes...")
        watch(cli_args.pdf, cli_args.target)


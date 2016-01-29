#!/usr/bin/env python3

################################################################################
# ripple-dev-portal doc parser
#
# Generate the html for all the Ripple Dev  Portal files from a template
# Optionally pre-compile them to HTML (using pandoc & a custom filter)
################################################################################

import os
import re
import json
import argparse

##Necessary for prince
import subprocess

#Fetch markdown sources from another repo
import requests

#Used for processing and pre/post-processing of markdown
from jinja2 import Environment, FileSystemLoader
from markdown import markdown
from bs4 import BeautifulSoup

#Watchdog stuff
import time
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler


DOC_TEMPLATE_FILE = "template-doc.html"
PDF_TEMPLATE_FILE = "template-forpdf.html"
PAGE_MANIFEST_FILE = "pages.json"
BUILD_PATH = ".."
CONTENT_PATH = "../content"
#BUTTONIZE_FILTER = "buttonize.py"
PRINCE_PAGE_MANIFEST_FILE = "/tmp/devportal-pages.txt"

PDF_TARGET = "pdf"
DEFAULT_TARGET = "local"
MULTICODE_TAB_TARGETS = ["local", "ripple.com"]


MC_START_REGEX = re.compile("<!-- *<div class='multicode'[^>]*> *-->")
MC_END_REGEX = re.compile("<!-- *</div> *-->")
DOCTOC_START = "<!-- START doctoc generated TOC please keep comment here to allow auto update -->"
DOCTOC_END = "<!-- END doctoc generated TOC please keep comment here to allow auto update -->"

def parse_markdown(md, target=DEFAULT_TARGET, pages=None):
    """Take a markdown string and output HTML for that content"""
    ## Python markdown requires markdown="1" on HTML block elements
    ##     that contain markdown. AND there's a bug where if you use
    ##     markdown.extensions.extra, it replaces code fences in HTML
    ##     block elements with garbled text
#    print("adding markdown class to embedded divs...")
#    def add_markdown_class(m):
#        if m.group(0).find("markdown=") == -1:
#            return m.group(1) + ' markdown="1">'
#        else:
#            return m.group(0)
#
#    md = re.sub("(<div[^>]*)>", add_markdown_class, md)
#    print("done")

    #Strip out doctoc Table of Contents for RippleAPI
    doctoc_start_i = md.find(DOCTOC_START)
    doctoc_end_i = md.find(DOCTOC_END)
    if doctoc_start_i != -1 and doctoc_end_i != -1:
        md = md[:doctoc_start_i]+md[doctoc_end_i+len(DOCTOC_END):]

    #the actual markdown parsing is the easy part
    print("parsing markdown...")
    html = markdown(md, extensions=["markdown.extensions.extra",
                                    "markdown.extensions.toc"])
    print("done")

    #if target uses multicode tabs, uncomment the divs
    if target in MULTICODE_TAB_TARGETS:
        print("enabling multicode tabs...")
        html = re.sub(MC_START_REGEX, "<div class='multicode'>", html)
        html = re.sub(MC_END_REGEX, "</div>", html)
        print("done")

    #replace underscores with dashes in h1,h2,etc. for Flatdoc compatibility
    print("tweaking header IDs...")
    soup = BeautifulSoup(html, "html.parser")
    headers = soup.find_all(name=re.compile("h[0-9]"), id=True)
    for h in headers:
        if "_" in h["id"]:
            h["id"] = h["id"].replace("_", "-")
    print("done")

    #buttonize links ending in >
    print("buttonizing try-it links...")
    buttonlinks = soup.find_all("a", string=re.compile(">$"))
    for link in buttonlinks:
        if "class" in link.attrs:
            link["class"].append("button")
        else:
            link["class"] = "button"
    print("done")

    #Replace links for live site
    if target != DEFAULT_TARGET:
        print("modifying links for target", target)
        if not pages:
            pages = get_pages()

        links = soup.find_all("a", href=re.compile(r"^[^.]+\.html"))
        for link in links:
            for page in pages:
                if target in page:
                    #There's a replacement link for this env
                    local_url = page["html"]
                    target_url = page[target]
                    if link["href"][:len(local_url)] == local_url:
                        link["href"] = link["href"].replace(local_url,
                                                            target_url)
        print("done")

    print("re-rendering HTML")
    html2 = str(soup)
    print("done")
    return html2

MARKDOWN_LINK_REGEX = re.compile(r"(\[([^\]]+)\]\(([^:)]+)\)|\[([^\]]+)\]:\s*(\S+)$)", re.MULTILINE)
def githubify_markdown(md, target=DEFAULT_TARGET, pages=None):
    """Github-friendly markdown has absolute links, no md in divs"""
    if not pages:
        pages = get_pages()

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
            if target in page:
                #There's a replacement link for this
                local_url = page["html"]
                target_url = page[target]
                if link.url[:len(local_url)] == local_url:
                    link.url = link.url.replace(local_url, target_url)
                    md = md.replace(link.fullmatch, link.to_markdown())

    return md

def get_pages(target=None):
    """Read pages.json and return an object, optionally filtered
       to just the pages that this target cares about"""
    with open(PAGE_MANIFEST_FILE) as f:
        pages = json.load(f)

    if target:
        #filter pages that aren't part of this target
        def should_include(page, target):
            if "targets" not in page:
                return True
            if target in page["targets"]:
                return True
            else:
                return False
        pages = [page for page in pages
                 if should_include(page, target)]
    return pages

def render_pages(precompiled, target=DEFAULT_TARGET):
    """The main work function. Reads pages.json, runs the pre-parser,
       runs the markdown parser, and writes the resulting 
       HTML files and maybe PDF."""
    pages = get_pages(target)
    categories = []#ordered, de-duplicated list
    for page in pages:
        if "category" in page and page["category"] not in categories:
            categories.append(page["category"])
    print("categories:", categories)

    env = Environment(loader=FileSystemLoader(os.path.curdir))
    env.lstrip_blocks = True
    env.trim_blocks = True

    pp_env = Environment(loader=FileSystemLoader(CONTENT_PATH))
    #Example: if we want to add custom functions to the md files
    #pp_env.globals['foo'] = lambda x: "FOO %s"%x

    for currentpage in pages:

        if "md" in currentpage:
            # Documentation file

            print("reading template file...")

            doc_template = env.get_template(DOC_TEMPLATE_FILE)
            if target == PDF_TARGET:
                doc_template = env.get_template(PDF_TEMPLATE_FILE)
            print("done")


            if precompiled:
                if "http:" in currentpage["md"] or "https:" in currentpage["md"]:
                    # No pre-processing for remote pages
                    print("fetching remote page",
                          currentpage["name"])
                    try:
                        response = requests.get(currentpage["md"])
                        if response.status_code == 200:
                            md_in = response.text
                        else:
                            raise requests.RequestException("Status code for page was not 200")
                    except:
                        print("Skipping page",
                              currentpage["name"],
                              "due to error fetching contents")
                        continue
                    print("done")

                else:
                    # Read markdown as a template
                    print("pre-processing markdown file",
                          currentpage["md"])
                    md_raw = pp_env.get_template(currentpage["md"])
                    md_in = md_raw.render(target=target,
                                          pages=pages)

                print("parsing markdown for", currentpage["name"])
                doc_html = parse_markdown(md_in, target, pages)
                print("done")

                print("rendering page", currentpage["name"], "...")
                out_html = doc_template.render(
                    currentpage=currentpage,
                    categories=categories,
                    pages=pages,
                    content=doc_html,
                    precompiled=precompiled)
                print("done")

            else:
                print("compiling skipped")

                print("rendering page", currentpage["name"], "...")
                out_html = doc_template.render(
                    currentpage=currentpage,
                    categories=categories,
                    pages=pages,
                    content="",
                    precompiled=precompiled)
                print("done")

        else:
            # Not a documentation page
            print("reading template file...")
            template = env.get_template(currentpage["template"])
            print("done")


            print("rendering page", currentpage["name"], "...")
            out_html = template.render(currentpage=currentpage,
                                       categories=categories,
                                       pages=pages)
            print("done")


        fileout = os.path.join(BUILD_PATH, currentpage["html"])
        if not os.path.isdir(BUILD_PATH):
            print("creating build folder", BUILD_PATH)
            os.makedirs(BUILD_PATH)
        with open(fileout, "w") as f:
            print("writing to file:", fileout, "...")
            f.write(out_html)
            print("done")


def watch(pre_parse, pdf, target):
    """Look for changed files and re-generate HTML (and optionally 
       PDF whenever there's an update. Runs until interrupted."""
    path = ".."
    class UpdaterHandler(PatternMatchingEventHandler):
        """Updates to pattern-matched files means rendering."""
        def on_any_event(self, event):
            print("got event!")
            if pdf:
                make_pdf(pdf)
            render_pages(pre_parse, target)
            print("done rendering")

    patterns = ["*tool/pages.json", "*tool/template-*.html"]
    if pre_parse:
        #md only prompts HTML change if pre-parsed
        patterns.append("*content/*.md")
        patterns.append("*content/code_samples/*")
    event_handler = UpdaterHandler(patterns=patterns)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    # The above starts an observing thread,
    #   so the main thread can just wait
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

def make_pdf(outfile):
    """Use prince to convert several HTML files into a PDF"""
    print("rendering PDF-able versions of pages...")
    render_pages(precompiled=True, target=PDF_TARGET)
    print("done")

    args = ['prince', '-o', outfile]
    pages = get_pages(PDF_TARGET)
    args += ["../"+p["html"] for p in pages]
    print("generating PDF: running ", " ".join(args), "...")
    prince_resp = subprocess.check_output(args, universal_newlines=True)
    print(prince_resp)


def githubify(md_file_name, target=DEFAULT_TARGET):
    """Wrapper - make the markdown resemble GitHub flavor"""
    filein = os.path.join(CONTENT_PATH, md_file_name)
    with open(filein, "r") as f:
        md = f.read()
    pages = get_pages()
    print(githubify_markdown(md, target=target, pages=pages))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Generate static site from markdown and templates.')
    parser.add_argument("-f", "--flatdoc", action="store_true",
                        help="Use Flatdoc instead of parsing pages")
    parser.add_argument("-w", "--watch", action="store_true",
                        help="Watch for changes and re-generate the files. This runs until force-quit.")
    parser.add_argument("--pdf", type=str,
                        help="Generate a PDF, too. Requires Prince.")
    parser.add_argument("-g", "--githubify", type=str,
                        help="Output md prepared for GitHub")
    parser.add_argument("--target", "-t", type=str,
                        default=DEFAULT_TARGET)
    cli_args = parser.parse_args()
    pre_parse = not cli_args.flatdoc

    if cli_args.githubify:
        githubify(cli_args.githubify, cli_args.target)
        exit(0)

    if cli_args.pdf:
        if cli_args.pdf[-4:] != ".pdf":
            exit("PDF filename must end in .pdf")
        print("making a pdf...")
        make_pdf(cli_args.pdf)
        print("pdf done")

    #Not an accident that we go on to re-gen files in non-PDF format
    print("rendering pages now")
    render_pages(precompiled=pre_parse, target=cli_args.target)
    print("all done")

    if cli_args.watch:
        print("watching for changes...")
        watch(pre_parse, cli_args.pdf, cli_args.target)


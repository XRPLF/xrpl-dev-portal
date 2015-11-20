#!/usr/bin/env python3

################################################################################
# ripple-dev-portal doc parser
#
# Generate the html for all the Ripple Dev  Portal files from a template
# Optionally pre-compile them to HTML (using pandoc & a custom filter)
################################################################################

from jinja2 import Environment, FileSystemLoader
import os, sys, re
import json
import argparse

##Necessary for pandoc, prince
import subprocess

#Python markdown works instead of pandoc
from markdown import markdown
from bs4 import BeautifulSoup

#Watchdog stuff
import time#, logging
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
MULTICODE_TAB_TARGETS = ["local","ripple.com"]


MC_START_REGEX = re.compile("<!-- *<div class='multicode'[^>]*> *-->")
MC_END_REGEX = re.compile("<!-- *</div> *-->")

def parse_markdown(md, target=DEFAULT_TARGET, pages=None):
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
            h["id"] = h["id"].replace("_","-")
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
        print("modifying links for target",target)
        if not pages:
            pages = get_pages()
        
        links = soup.find_all("a",href=re.compile("^[^.]+\.html"))
        for link in links:
            for page in pages:
                if target in page:
                    #There's a replacement link for this env
                    if page["html"] in link["href"]:
                        link["href"] = link["href"].replace(page["html"],
                                                            page[target])
        print("done")
    
    print("re-rendering HTML")
    html2 = str(soup)
    print("done")
    return html2
    
def get_pages(target=None):
    print("reading page manifest...")
    with open(PAGE_MANIFEST_FILE) as f:
        pages = json.load(f)
    
    if target:
    #filter pages that aren't part of this target
        pages = [page for page in pages
                 if "targets" not in page or target in page["targets"]
                ]
    print("done")
    return pages

def render_pages(precompiled, target=DEFAULT_TARGET):
    pages = get_pages(target)
    categories = []#ordered, de-duplicated list
    for page in pages:
        if "category" in page and page["category"] not in categories:
            categories.append(page["category"])
    print("categories:",categories)
    
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
                filein = os.path.join(CONTENT_PATH, currentpage["md"])
                
                ## Old: read markdown from file
                #with open(filein) as f:
                    #md_in = f.read()
                ## New: read markdown as a template
                print("pre-processing markdown file",currentpage["md"])
                md_raw = pp_env.get_template(currentpage["md"])
                md_in = md_raw.render(target=target,pages=pages)
                
                print("parsing markdown for", currentpage["name"])
                doc_html = parse_markdown(md_in, target, pages)
                
#                ## Old Pandoc markdown parsing way
#                args = ['pandoc', filein, '-F', BUTTONIZE_FILTER, '-t', 'html']
#                print("compiling: running ", " ".join(args),"...")
#                doc_html = subprocess.check_output(args, universal_newlines=True)
                print("done")
                
                print("rendering page",currentpage["name"],"...")
                out_html = doc_template.render(currentpage=currentpage,
                                               categories=categories,
                                               pages=pages, 
                                               content=doc_html,        
                                               precompiled=precompiled)
                print("done")
            
            else:
                print("compiling skipped")
                
                print("rendering page",currentpage["name"],"...")
                out_html = doc_template.render(currentpage=currentpage, 
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
            
            
            print("rendering page",currentpage["name"],"...")
            out_html = template.render(currentpage=currentpage,
                                       categories=categories,
                                       pages=pages)
            print("done")
            
        
        fileout = os.path.join(BUILD_PATH, currentpage["html"])
        if (not os.path.isdir(BUILD_PATH)):
            print("creating build folder",BUILD_PATH)
            os.makedirs(BUILD_PATH)
        with open(fileout, "w") as f:
            print("writing to file:",fileout,"...")
            f.write(out_html)
            print("done")


def watch(pre_parse, pdf, target):
    path = ".."
    class UpdaterHandler(PatternMatchingEventHandler):
        def on_any_event(self, event):
            print("got event!")
            if pdf:
                make_pdf(pdf)
            render_pages(pre_parse, target)
            print("done rendering")
    
    patterns = ["*tool/pages.json","*tool/template-*.html"]
    if pre_parse:
        #md only prompts HTML change if pre-parsed
        patterns.append("*content/*.md",)
    event_handler = UpdaterHandler(patterns=patterns)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    #The above starts an observing thread, so the main thread can just wait
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

def make_pdf(outfile):
    print("rendering PDF-able versions of pages...")
    render_pages(precompiled=True, target=PDF_TARGET)
    print("done")
    
    args = ['prince', '-o', outfile]
    pages = get_pages(PDF_TARGET)
    args += ["../"+p["html"] for p in pages]
    print("generating PDF: running ", " ".join(args),"...")
    prince_resp = subprocess.check_output(args, universal_newlines=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
            description='Generate static site from markdown and templates.')
    parser.add_argument("-p", "--pre_parse", action="store_true",
                       help="Parse markdown; otherwise, use Flatdoc")
    parser.add_argument("-w","--watch", action="store_true",
                       help="Watch for changes and re-generate the files. This runs until force-quit.")
    parser.add_argument("--pdf", type=str, 
            help="Generate a PDF, too. Requires Prince.")
    parser.add_argument("--target", "-t", type=str, default=DEFAULT_TARGET)
    args = parser.parse_args()
    
    if args.pdf:
        if args.pdf[-4:] != ".pdf":
            exit("PDF filename must end in .pdf")
        print("making a pdf...")
        make_pdf(args.pdf)
        print("pdf done")
    
    #Not an accident that we go on to re-gen files in non-PDF format
    print("rendering pages now")
    render_pages(precompiled=args.pre_parse, target=args.target)
    print("all done")
    
    if args.watch:
        print("watching for changes...")
        watch(args.pre_parse, args.pdf, args.target)
    

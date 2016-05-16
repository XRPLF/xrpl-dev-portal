#!/usr/bin/env python3

################################################################################
# Dactyl - a tool for heroic epics of documentation
#
# Generates a website from Markdown and Jinja templates, with filtering
# along the way.
################################################################################

DEFAULT_CONFIG_FILE = "dactyl-config.yml"

import os
import re
import yaml
import argparse
import logging

# Necessary to copy static files to the output dir
from distutils.dir_util import copy_tree

# Used to import filters.
from importlib import import_module

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

# These fields are special, and pages don't inherit them directly
RESERVED_KEYS_TARGET = [
    "name",
    "display_name",
    "filters",
    "image_subs",
]
filters = {}
def load_config(config_file=DEFAULT_CONFIG_FILE):
    """Reload config from a YAML file."""
    global config, filters
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

        # Figure out which filters we need and import them
        filternames = set()
        for target in config["targets"]:
            if "filters" in target:
                filternames.update(target["filters"])
        for page in config["pages"]:
            if "filters" in page:
                filternames.update(page["filters"])
        for filter_name in filternames:
            filters[filter_name] = import_module("filter_"+filter_name)



def substitute_links_for_target(soup, target):
    """Replaces local-html-links with appropriate substitutions
       for the given target, and images likewise"""
    target = get_target(target)

    logger.info("... modifying links for target: %s" % target["name"])
    # We actually want to get all pages, even the ones that aren't built as
    # part of this target, in case those pages have replacement links.
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

    if "image_subs" in target:
        images = soup.find_all("img")
        for img in images:
            local_path = img["src"]
            if local_path in target["image_subs"]:
                logger.info("... replacing image path '%s' with '%s'" %
                            (local_path, target["image_subs"][local_path]))
                img["src"] = target["image_subs"][local_path]

        image_links = soup.find_all("a",
                href=re.compile(r"^[^.]+\.(png|jpg|jpeg|gif|svg)"))
        for img_link in image_links:
            local_path = img_link["href"]
            if local_path in target["image_subs"]:
                logger.info("... replacing image link '%s' with '%s'" %
                            (local_path, target["image_subs"][local_path]))
                img_link["href"] = target["image_subs"][local_path]


def substitute_parameter_links(link_parameter, currentpage, target):
    """Some templates have links in page parameters. Do link substitution for
       the target on one of those parameters."""
    target = get_target(target)
    # We actually want to get all pages, even the ones that aren't built as
    # part of this target, in case those pages have replacement links.
    pages = get_pages()

    if link_parameter in currentpage:
        linked_page = next(p for p in pages
            if p["html"] == currentpage[link_parameter])
        if target["name"] in linked_page:
            #there's a link substitution available
            currentpage[link_parameter] = linked_page[target["name"]]
        ## We could warn here, but it would frequently be a false alarm
        # else:
        #     logging.warning("No substitution for %s[%s] for this target" %
        #                     (currentpage["html"],link_parameter))

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

def get_filters_for_page(page, target=None):
    ffp = set()
    target = get_target(target)
    if "filters" in target:
        ffp.update(target["filters"])
    if "filters" in page:
        ffp.update(page["filters"])
    return ffp

def parse_markdown(page, target=None, pages=None):
    """Take a markdown string and output HTML for that content"""
    target = get_target(target)
    logging.info("Preparing page %s" % page["name"])

    # Preprocess Markdown using this Jinja environment
    pp_env = setup_pp_env()

    # We'll apply these filters to the page
    page_filters = get_filters_for_page(page, target)

    md = get_markdown_for_page(page["md"], pp_env=pp_env, target=target)

    # Apply markdown-based filters here
    for filter_name in page_filters:
        if "filter_markdown" in dir(filters[filter_name]):
            logging.info("... applying markdown filter %s" % filter_name)
            md = filters[filter_name].filter_markdown(md, target=target, page=page)

    # Actually parse the markdown
    logger.info("... parsing markdown...")
    html = markdown(md, extensions=["markdown.extensions.extra",
                                    "markdown.extensions.toc"])

    # Apply raw-HTML-string-based filters here
    for filter_name in page_filters:
        if "filter_html" in dir(filters[filter_name]):
            logging.info("... applying HTML filter %s" % filter_name)
            html = filters[filter_name].filter_html(html, target=target, page=page)

    # Some filters would rather operate on a soup than a string.
    # May as well parse once and re-serialize once.
    soup = BeautifulSoup(html, "html.parser")

    # Apply soup-based filters here
    for filter_name in page_filters:
        if "filter_soup" in dir(filters[filter_name]):
            logging.info("... applying soup filter %s" % filter_name)
            filters[filter_name].filter_soup(soup, target=target, page=page)
            # ^ the soup filters apply to the same object, passed by reference

    # Replace links for any non-default target
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

    target = get_target(target)
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

    # Pages should inherit non-reserved keys from the target
    for p in pages:
        for key,val in target.items():
            if key in RESERVED_KEYS_TARGET:
                continue
            elif key not in p:
                p[key] = val
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

def setup_pp_env():
    pp_env = Environment(loader=FileSystemLoader(config["content_path"]))
    #Example: if we want to add custom functions to the md files
    #pp_env.globals['foo'] = lambda x: "FOO %s"%x
    return pp_env

def setup_html_env():
    env = Environment(loader=FileSystemLoader(config["template_path"]))
    env.lstrip_blocks = True
    env.trim_blocks = True
    return env

def toc_from_headers(html_string):
    """make a table of contents from headers"""
    soup = BeautifulSoup(html_string, "html.parser")
    headers = soup.find_all(name=re.compile("h[1-3]"), id=True)
    toc_s = ""
    for h in headers:
        if h.name == "h1":
            toc_level = "level-1"
        elif h.name == "h2":
            toc_level = "level-2"
        else:
            toc_level = "level-3"

        new_a = soup.new_tag("a", href="#"+h["id"])
        if h.string:
            new_a.string = h.string
        else:
            new_a.string = " ".join(h.strings)
        new_li = soup.new_tag("li")
        new_li["class"] = toc_level
        new_li.append(new_a)

        toc_s += str(new_li)+"\n"

    return str(toc_s)

def render_pages(target=None, for_pdf=False, bypass_errors=False):
    """Parse and render all pages in target, writing files to out_path."""
    target = get_target(target)
    pages = get_pages(target)
    categories = get_categories(pages)

    # Insert generated HTML into templates using this Jinja environment
    env = setup_html_env()

    if for_pdf:
        if "pdf_template" in target:
            logging.debug("reading pdf template %s from target..." % target["pdf_template"])
            default_template = env.get_template(target["pdf_template"])
        else:
            logging.debug("reading default pdf template %s..." % config["pdf_template"])
            default_template = env.get_template(config["pdf_template"])
    else:
        if "template" in target:
            logging.debug("reading HTML template %s from target..." % target["template"])
            default_template = env.get_template(target["template"])
        else:
            logging.debug("reading default HTML template %s..." % config["default_template"])
            default_template = env.get_template(config["default_template"])

    for currentpage in pages:
        if "md" in currentpage:
            # Read and parse the markdown

            try:
                html_content = parse_markdown(currentpage, target=target,
                                              pages=pages)

            except Exception as e:
                if bypass_errors:
                    logging.warning( ("Skipping page %s " +
                          "due to error fetching contents: %s") %
                           (currentpage["name"], e) )
                    continue
                else:
                    exit("Error when fetching page %s: %s" %
                         (currentpage["name"], e) )
        else:
            html_content = ""

        if "sidebar" in currentpage and currentpage["sidebar"] == "toc":
            sidebar_content = toc_from_headers(html_content)
        else:
            sidebar_content = None

        # Prepare some parameters for rendering
        substitute_parameter_links("doc_page", currentpage, target)
        current_time = time.strftime("%B %d, %Y")

        # Figure out which template to use
        if "template" in currentpage and not for_pdf:
            logging.info("using template %s from page" % currentpage["template"])
            use_template = env.get_template(currentpage["template"])
        elif "pdf_template" in currentpage and for_pdf:
            logging.info("using pdf_template %s from page" % currentpage["pdf_template"])
            use_template = env.get_template(currentpage["pdf_template"])
        else:
            use_template = default_template

        # Render the content into the appropriate template
        out_html = use_template.render(currentpage=currentpage,
                                           categories=categories,
                                           pages=pages,
                                           content=html_content,
                                           target=target,
                                           current_time=current_time,
                                           sidebar_content=sidebar_content)


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
            # bypass_errors=True because Watch shouldn't
            #  just die if a file is temporarily not found
            if pdf_file:
                make_pdf(pdf_file, target=target, bypass_errors=True)
            else:
                render_pages(target, bypass_errors=True)
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


def make_pdf(outfile, target=None, bypass_errors=False):
    """Use prince to convert several HTML files into a PDF"""
    logging.info("rendering PDF-able versions of pages...")
    target = get_target(target)
    render_pages(target=target, for_pdf=True, bypass_errors=bypass_errors)

    temp_files_path = config["temporary_files_path"]

    # Prince will need the static files, so copy them over
    copy_static_files(out_path=temp_files_path)

    # Make sure the path we're going to write the PDF to exists
    if not os.path.isdir(config["out_path"]):
        logging.info("creating build folder %s" % config["out_path"])
        os.makedirs(config["out_path"])

    # Start preparing the prince command
    args = [config["prince_executable"], '--javascript', '-o', outfile]
    # Each HTML output file in the target is another arg to prince
    pages = get_pages(target)
    args += [os.path.join(temp_files_path, p["html"]) for p in pages]

    logger.info("generating PDF: running %s..." % " ".join(args))
    prince_resp = subprocess.check_output(args, universal_newlines=True)
    print(prince_resp)


def githubify(md_file_name, target=None):
    """Wrapper - make the markdown resemble GitHub flavor"""
    target = get_target(target)

#    filein = os.path.join(config["content_path"], md_file_name)
#    logging.info("opening source md file %s"%filein)
#    with open(filein, "r") as f:
#        md = f.read()
    pages = get_pages()
    logging.info("getting markdown for page %s" % md_file_name)
    md = get_markdown_for_page(md_file_name,
                               pp_env=setup_pp_env(),
                               target=target)

    logging.info("githubifying markdown...")
    rendered_md = githubify_markdown(md, target=target, pages=pages)

    if not os.path.isdir(config["out_path"]):
        logging.info("creating build folder %s" % config["out_path"])
        os.makedirs(config["out_path"])

    fileout = os.path.join(config["out_path"], md_file_name)
    logging.info("writing generated file to path: %s"%fileout)
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
    parser.add_argument("--bypass_errors", "-b", action="store_true",
                        help="Continue building if some contents not found")
    parser.add_argument("--config", "-c", type=str,
                        help="Specify path to an alternate config file.")
    parser.add_argument("--copy_static", "-s", action="store_true",
                        help="Copy static files to the out dir",
                        default=False)
    parser.add_argument("--list_targets_only", "-l", action="store_true",
                        help="Don't build anything, just display list of "+
                        "known targets from the config file.")
    cli_args = parser.parse_args()

    if not cli_args.quiet:
        logging.basicConfig(level=logging.INFO)

    if cli_args.config:
        load_config(cli_args.config)
    else:
        load_config()

    if cli_args.list_targets_only:
        for t in config["targets"]:
            if "display_name" in t:
                display_name = t["display_name"]
            else:
                display_name = ""
            print("%s\t\t%s" % (t["name"], display_name))

        #print(" ".join([t["name"] for t in config["targets"]]))
        exit(0)

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
        pdf_path = os.path.join(config["out_path"], cli_args.pdf)
        make_pdf(pdf_path, target=cli_args.target,
                 bypass_errors=cli_args.bypass_errors)
        logging.info("pdf done")

    else:
        logging.info("rendering pages...")
        render_pages(target=cli_args.target,
                     bypass_errors=cli_args.bypass_errors)
        logging.info("done rendering")

        if cli_args.copy_static:
            logging.info("copying static pages...")
            copy_static_files()

    if cli_args.watch:
        logging.info("watching for changes...")
        if cli_args.pdf:
            pdf_path = os.path.join(config["out_path"], cli_args.pdf)
            watch(pdf_path, cli_args.target)
        else:
            watch(None, cli_args.target)

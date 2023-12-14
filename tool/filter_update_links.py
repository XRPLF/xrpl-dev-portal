###############################################################################
## Update Links: tool to help change abc.html links to relative links to the md
## source file for the same file.
###############################################################################
import re
import os.path

import ruamel.yaml
yaml = ruamel.yaml.YAML()

from bs4 import BeautifulSoup
from markdown import markdown

LOCAL_HTML_LINK = re.compile(r"^(?P<fname>[a-z0-9_-]+\.html)(?P<query>\?[A-Za-z0-9_.%&=-]+)?(?P<anchor>#[a-z_\w%-]+)?$")

with open("tool/non_md_links.yaml") as f:
    NON_MD_LINKS = yaml.load(f)

UNMATCHED_REFLINK = re.compile(r"\[([^\]]+)?\]\[(\w| )*\]")
REFLINK_DEF = re.compile(r'^\[(?P<label>[^\]]+)\]: (?P<link>.*)$')

REPLACE_IN_PLACE = True # False: only print changes, don't apply. True: open and rewrite files.
COMMON_LINKS_FILE = "content/_snippets/common-links.md"
DONE_SNIPPETS = False

# copy-pasted from md_dactyl_to_redocly because imports are weird
def should_include(fname):
    """
    Return True if the given file/folder name should be checked.
    Otherwise return False.
    """
    if fname == "node_modules":
        return False
    if ".git" in fname:
        return False
    return True

def list_mds(content_dir):
    all_mds = []
    for dirpath, dirnames, filenames in os.walk(content_dir, topdown=True):
        dirnames[:] = [d for d in dirnames if should_include(d)]
        filenames[:] = [f for f in filenames if should_include(f)]
        for filename in filenames:
            if filename[-3:] == ".md":
                #all_mds.append(os.path.relpath(os.path.join(dirpath,filename), content_dir))
                all_mds.append(os.path.join(dirpath,filename))
    return all_mds

def find_page(html, pages):
    for page in pages:
        if page["html"] == html:
            # Follow redirects first
            if page.get("redirect_url", None) and page["redirect_url"][:8] != "https://":
                # Follow the redirect to get the proper replacement page
                return find_page(page["redirect_url"], pages)
            else:
                return page
    return None

def list_replacements(pg_srcpath, soup, pages, logger, link_subs={}):
    with open("tool/autosubs_cheatsheet.yml") as f:
        AUTOSUBS = yaml.load(f)

    links = soup.find_all("a", href=True)
    find_replace_list = []

    for match in links:
        rawlink = match["href"]
        m = LOCAL_HTML_LINK.match(rawlink)
        if m:
            link = m.group("fname")
            query = m.group("query") or ""
            anchor = m.group("anchor") or ""
            linked_page = find_page(link, pages)
            link_sub = link_subs.get(rawlink, None)
            if link_sub:
                logger.debug("%s needs link substitution: '%s'→'%s'"%(pg_srcpath, rawlink, link_sub))
            if not linked_page:
                logger.warning("Link to missing page "+link)
            elif link in NON_MD_LINKS.keys():
                abs_path = NON_MD_LINKS[link]
                logger.debug("Old link: "+link+query+anchor)
                logger.debug("New link: "+abs_path+query+anchor)
                # actually only replace (link) so we hopefully don't mess up e.g. frontmatter
                old_link = "(%s%s%s)"%(link, query, anchor)
                link_repl = "(%s%s%s)"%(abs_path, query, anchor)
                find_replace_list.append( (old_link, link_repl) )
            elif not linked_page.get("md", ""):
                logger.warning("Link to page with no known new link: "+m.group(0))
            else:
                linked_md =  linked_page["md"]

                # Fix for links from translated→untranslated
                # (The paths *should* be as if from the English version of the file)
                relpath_start = pg_srcpath
                if "@i18n" in pg_srcpath and "@i18n" not in linked_md:
                    relpath_start = "/".join(pg_srcpath.split("/")[2:]) # hacky way to trim off "@i18n/{lang}"
                rel_path = os.path.relpath(linked_md, start=relpath_start)
                logger.debug("Old link: "+link+query+anchor)
                logger.debug("New link: "+rel_path+query+anchor)
                # actually only replace (link) so we hopefully don't mess up e.g. frontmatter
                old_link = "(%s%s%s)"%(link, query, anchor)
                new_link = "(%s%s%s)"%(rel_path, query, anchor)
                find_replace_list.append( (old_link, new_link) )
                # also replace "[Link def]: path.html" in case this was a reference link
                reflink_def_link = "]: %s%s%s\n" % (link, query, anchor)
                reflink_def_repl = "]: %s%s%s\n" % (rel_path, query, anchor)
                find_replace_list.append( (reflink_def_link, reflink_def_repl) )

    # # reference links too
    # for s in soup.strings:
    #     matches = re.finditer(UNMATCHED_REFLINK, s)
    #     for m in matches:
    #         if m:
    #             if m.group(2):
    #                 # it's a [text][ref] style link
    #                 old_ref = m.group(2)
    #                 linktext = m.group(1)
    #             else:
    #                 # probably a [textref][] style link
    #                 old_ref = m.group(1)
    #                 linktext = old_ref

    #             link = AUTOSUBS.get(old_ref, "")
    #             if "#" in link:
    #                 link, anchor = link.split("#", 1)
    #                 anchor = "#"+anchor
    #             else:
    #                 anchor = ""

    #             if LOCAL_HTML_LINK.match(link):
    #                 linked_page = find_page(link, pages)
    #                 if not linked_page:
    #                     logger.warning("Autolink to missing page "+link)
    #                 elif not linked_page.get("md", ""):
    #                     logger.warning("Autolink to page with no md source "+link)
    #                 else:
    #                     rel_path = os.path.relpath(linked_page["md"], start=pg_srcpath)
    #                     repl_str = "[%s](%s%s)" % (linktext, rel_path, anchor)
    #                     logger.debug("Old link: "+m.group(0))
    #                     logger.debug("New link: "+repl_str)
    #                     find_replace_list.append( (m.group(0), repl_str) )
    #             elif link:
    #                 # probably a link to a full URL
    #                 repl_str = "[%s](%s%s)" % (linktext, link, anchor)
    #                 logger.debug("Old link: "+m.group(0))
    #                 logger.debug("New link: "+repl_str)
    #                 find_replace_list.append( (m.group(0), repl_str) )
    #             else:
    #                 logger.warning("Unsure what to do with unmatched reflink "+m.group(0))
    return find_replace_list

def do_replacements(fpath, find_replace_list):
    #print("%s: Replacing %d links"%(fpath, len(find_replace_list)))
    with open(fpath, "r") as f:
        contents = f.read()
    for old, new in find_replace_list:
        contents = contents.replace(old, new)
    with open(fpath, "w") as f:
        f.write(contents)

def filter_soup(soup, currentpage={}, config={}, pages=[], logger=None, target={}, **kwargs):
    # Nop unless you do dactyl_build --vars '{"do_link_replacement":true}'
    if not currentpage.get("do_link_replacement", False):
        return
    
    global DONE_SNIPPETS
    if not DONE_SNIPPETS:
        replace_snippet_links(pages, target, logger)
        DONE_SNIPPETS = True

    if not currentpage.get("md", ""):
        logger.debug("Skipping non-md page "+currentpage["html"])
        return
    
    link_subs = target.get("legacy_link_subs", {})#Temp testing handling link substitutions
    find_replace_list = list_replacements(os.path.dirname(currentpage["md"]), soup, pages, logger, link_subs=link_subs)

    if REPLACE_IN_PLACE and find_replace_list:
        fpath = os.path.join(config["content_path"], currentpage["md"])
        do_replacements(fpath, find_replace_list)


def replace_snippet_links(pages, target, logger):
    all_snippets = list_mds("content/_snippets")
    for snip in all_snippets:
        if snip == COMMON_LINKS_FILE: # special case for this one file. Use absolute links instead of relative.
            update_common_links(pages, target, logger)
            continue
        with open(snip, "r") as f:
            md = f.read()
        md = markdown(md, extensions=["markdown.extensions.extra"])
        soup = BeautifulSoup(md, "html.parser")

        snip_path = os.path.relpath(os.path.dirname(snip), start="content")

        find_replace_list = list_replacements(snip_path, soup, pages, logger)

        if REPLACE_IN_PLACE and find_replace_list:
            do_replacements(snip, find_replace_list)

def update_common_links(pages, target, logger):
    with open(COMMON_LINKS_FILE) as f:
        common_links_md = f.read()
    
    find_replace_list = []
    for m in re.finditer(REFLINK_DEF, common_links_md):
        rawlink = m.group("link")
        m = LOCAL_HTML_LINK.match(rawlink)
        if m:
            linked_page = find_page(link, pages)
            if not linked_page:
                logger.warning("Common links has autolink to missing page "+link)
                continue
            elif link in NON_MD_LINKS.keys():
                abs_path = NON_MD_LINKS[link]
                find_replace_list.append( (m.group(0), "[%s]: %s"%(m.group(label), abs_path)) )
            elif "md" in linked_page.keys():
                abs_path = linked_page.get("md")
                find_replace_list.append( (m.group(0), "[%s]: %s"%(m.group(label), abs_path)) )
            else:
                logger.warning("Common link with no known new link: "+m.group(0))

    do_replacements(COMMON_LINKS_FILE, find_replace_list)

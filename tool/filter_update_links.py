###############################################################################
## Update Links: tool to help change abc.html links to relative links to the md
## source file for the same file.
###############################################################################
import re
import os.path

import ruamel.yaml
yaml = ruamel.yaml.YAML()
with open("tool/autosubs_cheatsheet.yml") as f:
    AUTOSUBS = yaml.load(f)

LOCAL_HTML_LINK = re.compile(r"^(?P<fname>[a-z_-]+\.html)(?P<anchor>#[a-z_-]+)?$")
UNMATCHED_REFLINK = re.compile(r"\[([^\]]+)?\]\[(\w| )*\]")

REPLACE_IN_PLACE = True # False: only print changes, don't apply. True: open and rewrite files.

def find_page(html, pages):
    for page in pages:
        if page["html"] == html:
            return page
    return None

def filter_soup(soup, currentpage={}, config={}, pages=[], logger=None, **kwargs):
    if not currentpage.get("md", ""):
        logger.debug("Skipping non-md page "+currentpage["html"])
        return
    links = soup.find_all("a", href=True)
    #if links:
    #    print("Source file:", currentpage["md"])

    find_replace_list = []
    pg_srcpath = os.path.dirname(currentpage["md"])

    for match in links:
        rawlink = match["href"]
        m = LOCAL_HTML_LINK.match(rawlink)
        if m:
            link = m.group("fname")
            anchor = m.group("anchor") or ""
            linked_page = find_page(link, pages)
            if not linked_page:
                logger.warning("Link to missing page "+link)
            elif not linked_page.get("md", ""):
                logger.info("Link to page with no md source "+link)
            else:
                rel_path = os.path.relpath(linked_page["md"], start=pg_srcpath)
                #TODO: do some actual substitution here if it seems promising
                print("Old link:", link+anchor)
                print("New link:", rel_path+anchor)
                # actually only replace (link) so we hopefully don't mess up e.g. frontmatter
                link = "(%s%s)"%(link,anchor)
                rel_path = "(%s%s)"%(rel_path, anchor)
                find_replace_list.append( (link, rel_path) )

    # reference links too
    for s in soup.strings:
        matches = re.finditer(UNMATCHED_REFLINK, s)
        for m in matches:
            if m:
                if m.group(2):
                    # it's a [text][ref] style link, probs
                    old_ref = m.group(2)
                    linktext = m.group(1)
                else:
                    # probs [textref][] style link
                    old_ref = m.group(1)
                    linktext = old_ref

                link = AUTOSUBS.get(old_ref, "")

                if LOCAL_HTML_LINK.match(link):
                    linked_page = find_page(link, pages)
                    if not linked_page:
                        logger.warning("Autolink to missing page "+link)
                    elif not linked_page.get("md", ""):
                        logger.info("Autolink to page with no md source "+link)
                    else:
                        rel_path = os.path.relpath(linked_page["md"], start=pg_srcpath)
                        repl_str = "[%s](%s)" % (linktext, rel_path)
                        print("Old link:", m.group(0))
                        print("New link:", repl_str)
                        find_replace_list.append( (m.group(0), repl_str) )
                elif link:
                    # probably a link to a full URL
                    repl_str = "[%s](%s)" % (linktext, link)
                    print("Old link:", m.group(0))
                    print("New link:", repl_str)
                    find_replace_list.append( (m.group(0), repl_str) )



    if REPLACE_IN_PLACE and find_replace_list:
        print("%s: Replacing %d links"%(currentpage["md"], len(find_replace_list)))
        fpath = os.path.join(config["content_path"], currentpage["md"])
        with open(fpath, "r") as f:
            contents = f.read()
        for old, new in find_replace_list:
            contents = contents.replace(old, new)
        with open(fpath, "w") as f:
            f.write(contents)




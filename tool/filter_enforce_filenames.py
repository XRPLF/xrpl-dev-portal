################################################################################
## Enforce Filenames                                                          ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2023                                          ##
## License: MIT https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE  ##
##                                                                            ##
## Print errors and optionally fail out if an md page's filename does not     ##
## closely match its title.                                                   ##
################################################################################

import os.path
import re
import ruamel.yaml
yaml = ruamel.yaml.YAML()
yaml.default_flow_style=False
yaml.indent(mapping=4, sequence=4, offset=2) ## For some reason this doesn't work?

# only walk the overall page hierarchy once
has_walked = False
DOCS_TOP = None
# TODO: generalize the "DOCS_TOP" thing and remove assumption it uses docs.html

def textof(el):
    if not el:
        # TODO: maybe raise error?
        return ""
    return " ".join(el.stripped_strings)

def idify(utext):
    utext = re.sub(r'[^\w\s-]', '', utext).strip().lower()
    utext = re.sub(r'[\s-]+', '-', utext)
    return utext

def normalized_match(filename, heading, loose=False):
    """
    Return True if the normalized versions of a filename and a heading match,
    False otherwise.
    If loose==True, allow some leeway like omitting 'and' and 'the'
    """
    if filename[-3:] == ".md":
        filename = filename[:-3]

    fn_norm = idify(filename)
    h1_norm = idify(heading)

    if fn_norm == h1_norm:
        return True
    elif not loose:
        return False

    ignored_tokens = ("and", "the", "of")
    fn_tokens = [t for t in fn_norm.split("-") if t not in ignored_tokens]
    h1_tokens = [t for t in h1_norm.split("-") if t not in ignored_tokens]
    if fn_tokens == h1_tokens:
        return True
    else: return False

def get_hierarchy(page, pages, logger):
    global DOCS_TOP
    crumbs = [page]
    while crumbs[0] != DOCS_TOP:
        for p in pages:
            if p["html"] == crumbs[0]["parent"]:
                crumbs.insert(0, p)
                break
        else:
            logger.warning("Couldn't find parent '%s' of %s"%(page["parent"], page["html"]))
            break
    return crumbs[1:]

def compare_nav_and_fs_hierarchy(page, pages, logger):
    crumbs = get_hierarchy(page, pages, logger)
    crumbs = [idify(c["name"]) for c in crumbs]
    #TODO: either fix the protocol reference thing or generalize the magic string into an "allowed aliases" feature
    crumbs = [("protocol-reference" if c == "xrp-ledger-protocol-reference" else c) for c in crumbs]
    expected_path = "/".join(crumbs) + ".md"
    actual_path = page["md"]

    if expected_path != actual_path:
        path_parts = actual_path.split("/")
        if len(path_parts) >=2 and path_parts[-2]+".md" == path_parts[-1]:
            expected_path2 = "/".join(crumbs+[crumbs[-1]]) + ".md"
            if actual_path == expected_path2:
                logger.debug("Mismatched path {actual_path} is OK (follows 'topic/topic.md' convention)".format(actual_path=actual_path))
                return

        # Switch to the commented out print statement to get
        # tab-separated values you can paste into a spreadsheet:
        # print(expected_path, "\t", actual_path)
        logger.warning("""File path doesn't match the recommendation based on navigation.
    Expected: {expected_path}
      Actual: {actual_path}""".format(expected_path=expected_path, actual_path=actual_path))

def filter_soup(soup, currentpage={}, config={}, pages=[], logger=None, **kwargs):
    # To build a Redocly sidebar and quit, run dactyl_build --vars '{"export-redocly-sidebar": true}'
    if currentpage.get("export-redocly-sidebar", False):
        redocly_sidebar(pages)

    if "md" not in currentpage.keys() or currentpage.get("lang") != "en":
        return

    # assign docs top page (once) for purposes of figuring out hierarchy
    global DOCS_TOP
    if DOCS_TOP is None:
        for p in pages:
            if p["html"] == "docs.html":
                DOCS_TOP = p

    if DOCS_TOP["is_ancestor_of"](currentpage["html"]):
        compare_nav_and_fs_hierarchy(currentpage, pages, logger)
    # else:
    #     logger.warning("Skipping hierarchy check (not part of Docs tree)")

    page_path, page_filename = os.path.split(currentpage["md"])

    page_h1 = textof(soup.find("h1"))
    if not page_h1:
        print("File doesn't have an h1 title:", page_filename)
        return

    # TODO: allow configuration of loose/strict matching
    if not normalized_match(page_filename, page_h1, loose=True):
        logger.warning("Filename/Title Mismatch: '{page_filename}' vs '{page_h1}'".format(page_filename=page_filename, page_h1=page_h1))

def page_mapping(pages):
    mapping = {}
    no_md_pages = []
    for page in pages:
        if page.get("template", "") == "pagetype-redirect.html.jinja":
            continue
        if page["html"][:8] == "https://":
            continue
        if "md" in page.keys():
            mapping[page["html"]] = page["md"]
        else:
            no_md_pages.append(page["html"])
    s = ""
    for html, md in mapping.items():
        s += html + "\t" + md + "\n"
    s += "\n"
    for html in no_md_pages:
        s += html + "\n"
    return s

def redocly_entry_for(page, pages):
    """
    Potentially recursive method for getting a sidebar entry in Redocly format from a (parsed) Dactyl page item.
    """
    si = {}
    if not page.get("md", ""):
        if page.get("children", []):
            si["group"] = page.get("name", "no name?")
        else:
            si["label"] = page.get("name", "no name?")

    if page["html"][:8] == "https://":
        # Not a markdown source, just an external link
        si["href"] = page["html"]
        si["external"] = True

    if page.get("md", ""):
        # Normal md source file
        si["page"] = page["md"]

    if page.get("children", []):
        si["expanded"] = False
        si["items"] = [redocly_entry_for(child, pages) for child in page["children"]]

    return si


def redocly_sidebar(pages, starting_point="index.html"):
    sidebar = []
    for page in pages:
        if page.get("nav_omit", False):
            # TODO: these are mostly redirects, but need to handle the ones that aren't
            continue
        if page.get("parent", "") == "index.html":
            sidebar.append(redocly_entry_for(page, pages))
    with open("content/sidebars.yaml", "w") as f:
        yaml.dump(sidebar, f)
    exit()

export = {
    "page_mapping": page_mapping
}

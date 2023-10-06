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

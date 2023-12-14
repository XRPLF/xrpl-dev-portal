################################################################################
## Redocly Sidebar                                                            ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2023                                          ##
## License: MIT https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE  ##
##                                                                            ##
## Export a a sidebars.yaml file in Redocly format based on a Dactyl target.  ##
################################################################################

import os.path
import ruamel.yaml
yaml = ruamel.yaml.YAML()
yaml.default_flow_style=False
yaml.width = 9999
yaml.indent(mapping=4, sequence=4, offset=2)

with open("tool/non_md_links.yaml") as f:
    NON_MD_LINKS = yaml.load(f)

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

def filter_soup(soup, currentpage={}, config={}, pages=[], logger=None, **kwargs):
    if not currentpage.get("do_redocly_sidebar", False):
        return
    redocly_sidebar(pages, logger=logger)
    exit()

def redocly_entry_for(page, pages):
    """
    Potentially recursive method for getting a sidebar entry in Redocly format from a (parsed) Dactyl page item.
    """
    si = {}
    if page.get("md", ""):
        # Normal md source file
        si["page"] = page["md"]

    if page.get("children", []) and not page.get("md", ""): # Checked twice, but first here so that "group" is the first key if necessary
        si["group"] = page.get("name", "no name?")

    elif page["html"][:8] == "https://":
        # Not a markdown source, just an external link
        si["label"] = page.get("name", "no name?")
        si["href"] = page["html"]
        si["external"] = True

    elif not page.get("md", ""):
        si["label"] = page.get("name", "no name?")

    if page.get("children", []):
        si["expanded"] = False
        si["items"] = [redocly_entry_for(child, pages) for child in page["children"]]

    return si

def add_redirect_for(page, pages, redirects, logger):
    if page["html"][:8] == "https://" or page["html"] in redirects.keys():
        # external link or redirect already defined, no-op
        return
    
    redir = page.get("redirect_url")
    if redir:
        if redir[:8] == "https://":
            # Redirect to an external link
            redirects[page["html"]] = {"to": redir, "type": 301}
            return
        # Else, follow the redirect for new path
        to_page = find_page(redir, pages)
        if not to_page:
            logger.warning("Mismatched redirect: "+redir)
            return
        md = to_page.get("md")
    else:
        md = page.get("md")
    
    if not md:
        logger.warning("Unclear where to redirect page to: %s"%page["html"])
        return
    if md[-8:] == "index.md":
        new_path = "/"+md[:-8]
    else:
        new_path = "/"+md[:-3]
    redirects[page["html"]] = {"to": new_path, "type": 301}

def redocly_sidebar(pages, starting_point="index.html", logger=None):
    sidebar = []
    redirects = {k:{"to": v, "type": 301} for k,v in NON_MD_LINKS.items()}
    for page in pages:
        add_redirect_for(page, pages, redirects, logger)
        if page.get("nav_omit", False) or page.get("template", "") == "pagetype-redirect.html.jinja":
            # TODO: these are mostly redirects, but need to handle the ones that aren't
            continue
        if page.get("parent", "") == "index.html":
            sidebar.append(redocly_entry_for(page, pages))
    with open("content/sidebars.yaml", "w") as f:
        yaml.dump(sidebar, f)
    with open("content/redirects.yaml", "w") as f:
        yaml.dump(redirects, f)

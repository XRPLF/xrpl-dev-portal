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

def filter_soup(soup, currentpage={}, config={}, pages=[], logger=None, **kwargs):
    if not currentpage.get("do_redocly_sidebar", False):
        return
    redocly_sidebar(pages)
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

def redocly_sidebar(pages, starting_point="index.html"):
    sidebar = []
    for page in pages:
        if page.get("nav_omit", False) or page.get("template", "") == "pagetype-redirect.html.jinja":
            # TODO: these are mostly redirects, but need to handle the ones that aren't
            continue
        if page.get("parent", "") == "index.html":
            sidebar.append(redocly_entry_for(page, pages))
    with open("content/sidebars.yaml", "w") as f:
        yaml.dump(sidebar, f)

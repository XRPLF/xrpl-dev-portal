################################################################################
## XRefs: Intelligent Crossreferences filter                                  ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2017                                          ##
##                                                                            ##
## Looks for syntax matching the following format:                            ##
##     [optional text](XREF: some-link.html#fragment)                         ##
## and interprets it as cross-references. If some-link.html is a file in the  ##
## current target it becomes a normal hyperlink. If the link text is [] (that ##
## is, blank) it gets replaced with the title of the page.                    ##
## (Note: we can't look up section titles as that would require parsing the   ##
## cross-referenced page and could lead to an infinite recursion loop if two  ##
## pages cross-ferenced each other.)                                          ##
##   If the file isn't part of the current target but is part of another      ##
## target, it becomes a non-hyperlink cross reference to the page in the      ##
## first target that DOES have it. For example:                               ##
##      "Some Link Title" in _A Target Containing Some Link_                  ##
################################################################################
import re
from logging import warning

# match anything starting with XREF:/xref:, split by the # if there is one
# dropping any excess whitespace
xref_regex = re.compile(r"^\s*xref:\s*(?P<xref_file>[^#]+)(?P<xref_frag>#\S+)?\s*?$", re.I)

def find_file_in_target(fname, targetname, config):
    if fname[-3:] == ".md":
        # look by markdown file first
        for page in config["pages"]:
            if "md" not in page:
                continue
            elif ("/" in fname and page["md"] == fname # try to match md file by exact path
                    and targetname in page.get("targets",[]) # the page appears in this target
                    and page.get("html","") ): # and finally, the page has an html filename
                return page
            elif ( page["md"].split("/")[-1] == fname # match md filename in any directory
                    and targetname in page.get("targets",[])
                    and page.get("html","") ):
                return page

    for page in config["pages"]:
        if "html" not in page:
            continue
        elif page["html"] != fname:
            continue
        if targetname in page["targets"]:
            return page
    else:
        return False

def find_file_in_any_target(fname, config):
    if fname[-3:] == ".md":
        #print("finding in any target by md")
        # look by markdown file first
        for page in config["pages"]:
            if "md" not in page:
                continue
            elif ("/" in fname and page["md"] == fname # try to match md file by exact path
                   and page.get("targets",[]) # page must appear in some target
                   and page.get("html","") ): # and page must have an html filename
                return page
            elif ( page["md"].split("/")[-1] == fname # match md filename in any folder
                   and page.get("targets",[])
                   and page.get("html","") ):
                return page

    # look by HTML file if it didn't end in .md or if we didn't find it yet
    for page in config["pages"]:
        if "html" not in page:
            continue
        elif page["html"] == fname and page["targets"]:
            #page has to have "some" target(s) for it to be worthwhile
            return page
    else:
        return False

def lookup_display_name(targetname, config):
    for t in config["targets"]:
        if "name" in t and t["name"] == targetname:
            display_name = "%s %s %s %s %s" % (
                t.get("display_name", ""),
                t.get("product", ""),
                t.get("version", ""),
                t.get("guide", ""),
                t.get("subtitle", "")
            )
            if display_name.strip():
                return display_name
            else:
                warning("Target has no display_name/product/version/guide: %s" % targetname)
                return targetname
    else:
        warning("Target not found: %s" % targetname)
        return targetname

def filter_soup(soup, target={"name":""}, page=None, config={"pages":[]}):
    """Look for cross-references and replace them with not-hyperlinks if they
       don't exist in the current target."""

    xrefs = soup.find_all(href=xref_regex)
    #print("Crossreferences:", xrefs)
    #print("Target pages:", target["pages"])

    for xref in xrefs:
        m = xref_regex.match(xref.attrs["href"])
        xref_file = m.group("xref_file")
        xref_frag = m.group("xref_frag") or ""

        xref_page = find_file_in_target(xref_file, target["name"], config)
        if xref_page == False:
            # Cross-referenced page isn't part of this target
            xref_page = find_file_in_any_target(xref_file, config)
            if not xref_page:
                raise KeyError(("xref to missing file: '%s'. Maybe it's not in the Dactyl config file?")%xref_file)
            xref_target_shortname = xref_page["targets"][0]

            ref_target = lookup_display_name(xref_target_shortname, config)

            link_label = " ".join([s for s in xref.stripped_strings])
            # If a link label wasn't provided, generate one from the page name
            if not link_label.strip():
                link_label = xref_page["name"]
            link_label = link_label.strip()

            # "Link Label" in _Target Display Name_
            span = soup.new_tag("span")
            span.attrs["class"] = "dactyl_xref"
            span.string = '"%s" in the ' % link_label
            em = soup.new_tag("em")
            em.string = ref_target
            span.append(em)
            xref.replace_with(span)

        else:
            # The xref is on-target
            # First fix the hyperlink. Use the HTML (in case of link-by-md):
            xref.attrs["href"] = xref_page["html"]+xref_frag
            # If this link's label is only whitespace, fix it
            if not [s for s in xref.stripped_strings]:
                #print("replacing label for xref", xref)
                #print("stripped_strings was", [s for s in xref.stripped_strings])
                xref.string = xref_page["name"]

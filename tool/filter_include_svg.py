################################################################################
## SVG Diagram Includer                                                       ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2020                                          ##
## License: MIT https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE  ##
##                                                                            ##
## Includes a particular SVG diagram inline while also making it a link to    ##
## the raw diagram (so people can click to view it zoomed in).                ##
################################################################################

from bs4 import BeautifulSoup

def uniqify_urls(soup, attr, slug):
    """
    Change url(#some-id) references by prefixing the slug to the unique ID.
    """
    els = soup.find_all(attrs={attr: True})
    for el in els:
        if "url(#" in el[attr]:
            el[attr] = el[attr].replace("url(#", "url(#"+slug)


def include_svg(filename, alt_text="(diagram)", classes=""):
    # TODO: try/except, retriable error
    with open(filename, "r", encoding="utf-8") as f:
        svgtext = f.read()
    soup = BeautifulSoup(svgtext, "xml") #lxml required

    # Fix height
    soup.svg["height"] = "100%"

    # Make IDs unique.
    # Without this step, multiple diagrams in one page can clash on IDs
    #  resulting in using the wrong clip paths for diagrams beyond the first,
    #  which can cut off the edges of the diagrams.
    slug = filename.replace(" ","_")+"__"
    els_with_ids = soup.svg.find_all(id=True)
    for el in els_with_ids:
        el["id"] = slug+el["id"]

    # Change clip-path URLs to use the unique IDs
    uniqify_urls(soup.svg, "clip-path", slug)
    uniqify_urls(soup.svg, "fill", slug)
    uniqify_urls(soup.svg, "style", slug)
    uniqify_urls(soup.svg, "mask", slug)
    #TODO: add any other attributes that may contain url(#id) values.


    a = soup.new_tag("a")
    a["href"]=filename
    a["title"]=alt_text
    soup.svg.wrap(a)
    fig = soup.a.wrap(soup.new_tag("figure"))
    if classes:
        fig["class"] = classes
    # wrap in a block-level tag to prevent md parsing in the diagram text
    return str(soup.figure)

export = {
    "include_svg": include_svg
}

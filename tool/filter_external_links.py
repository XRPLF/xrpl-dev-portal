################################################
## External Link Marker
## Author: Rome Reginelli
## Copyright: Ripple Labs, 2019
##
## Finds external links and changes them to:
## - open in a new tab (target="_blank")
## - end with an "external link" icon
##      (FontAwesome required)
################################################

import re

def filter_soup(soup, **kwargs):
    """
    Adds an external link marker to external links
    and makes them open in new tabs.
    """

    extern_regex = re.compile(r"^https?://")

    links = soup.find_all("a", href=True)
    for link in links:
        if extern_regex.match(link["href"]):
            link["target"] = "_blank"
            ex_link_marker = soup.new_tag("i", attrs={
                    "class":"fa fa-external-link",
                    "aria-hidden": "true"})
            link.append(" ")
            link.append(ex_link_marker)
            oldclass = link.get('class',[])
            if type(oldclass) == str:
                oldclass = [oldclass]
            link['class'] = oldclass + ['external-link']

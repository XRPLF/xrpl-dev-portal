################################################################################
## Multicode Tabs 2 filter                                                    ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Finds multicode tab sections and turns them into properly-formatted        ##
## HTML syntax to use with minitabs jQuery                                    ##
################################################################################
import re
import logging

MC_START_REGEX = re.compile(r"<!--\s*MULTICODE_BLOCK_START\s*-->")
MC_END_REGEX = re.compile(r"<!--\s*MULTICODE_BLOCK_END\s*-->")

def filter_html(html, mode="html", **kwargs):
    """
    Turn multicode comments into a div (after markdown inside is parsed). You
    can use this div for styling even in PDF format. Doesn't apply to Markdown
    since most parsers won't parse markdown inside HTML blocks.
    """

    if mode == "md":
        return html

    html = re.sub(MC_START_REGEX, "<div class='multicode'>", html)
    html = re.sub(MC_END_REGEX, "</div>", html)
    return html

def filter_soup(soup, mode="html", **kwargs):
    """Turn a multicode block into the correct syntax for minitabs, but only
       in the HTML version."""
    if mode != "html":
        return

    multicodes = soup.find_all(class_="multicode")
    index1 = 0
    for cb_area in multicodes:
        cb_area["id"] = "code-%d" % index1

        codetabs_ul = soup.new_tag("ul")
        codetabs_ul["class"] = "codetabs"
        cb_area.insert(0,codetabs_ul)

        pres = cb_area.find_all(class_="codehilite")
        index2 = 0
        for pre in pres:
            #make a unique ID for this code sample
            linkid = "code-%d-%d" % (index1, index2)

            #wrap this code sample in an ID'd div
            code_sample_wrapper = soup.new_tag("div", id=linkid)
            code_sample_wrapper["style"] = "position: static;"
            pre.wrap(code_sample_wrapper)

            #add a link to the tabs ul
            linkback = soup.new_tag("a", href=("#%s" % linkid))
            linkback_li = soup.new_tag("li")
            
            linkback_li.append(linkback)
            codetabs_ul.append(linkback_li)

            #find the text label for this sample
            prev_p = code_sample_wrapper.find_previous_sibling("p")
            try:
                label = "".join(prev_p.em.strings)
            except AttributeError:
                label = "Code Sample %d-%d" % (index1, index2)
            linkback.string = label
            #add class with name of tab label
            label_class = label.replace(" ","").replace("-","").lower()
            linkback["class"] = label_class
            code_sample_wrapper["class"] = "code_sample " + label_class
            prev_p.decompose()

            index2 += 1

        index1 += 1
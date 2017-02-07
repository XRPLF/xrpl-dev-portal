################################################################################
## Callouts filter                                                            ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Looks for sections starting **Note:** or **Caution:** and gives them CSS   ##
## classes like "callout note" so they can be styled accordinglyselfselfself. ##
################################################################################
import re

CALLOUT_CLASS_MAPPING = {
    "note": "devportal-callout note",
    "warning": "devportal-callout warning",
    "caution": "devportal-callout caution",
    "tip": "devportal-callout tip",
}

def filter_soup(soup, target=None, page=None, config=None):
    """replace underscores with dashes in h1,h2,etc. for backwards compatibility"""
    callout_intro = re.compile(r"(Note|Warning|Tip|Caution):?$", re.I)
    callouts = soup.find_all(name=["strong","em"], string=callout_intro)
    for c in callouts:
        if not c.previous_sibling: #This callout starts a block
            callout_type = c.string.replace(":","").lower()
            if callout_type in CALLOUT_CLASS_MAPPING:
                c.parent["class"] = CALLOUT_CLASS_MAPPING[callout_type]
            #c.parent["class"] = "callout %s" % callout_type

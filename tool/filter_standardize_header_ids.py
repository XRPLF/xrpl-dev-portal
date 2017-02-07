################################################################################
## Standardize header IDs                                                     ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Replaces underscores with dashes in h1,h2,... element IDs. This provides   ##
## compatibility with some other flavors of markdown that generate HTML IDs   ##
## differently.                                                               ##
################################################################################
import re

def filter_soup(soup, target=None, page=None, config=None):
    """replace underscores with dashes in h1,h2,etc. for backwards compatibility"""
    headers = soup.find_all(name=re.compile("h[0-9]"), id=True)
    for h in headers:
        if "_" in h["id"]:
            h["id"] = h["id"].replace("_", "-")

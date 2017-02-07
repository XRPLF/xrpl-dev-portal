################################################################################
## Badges filter                                                              ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Looks for links with the title text "BADGE" and makes them into badges.    ##
## The alt text must be in the form of <badgelefthalf>:<badgerighthalf> and   ##
## the left half can't contain a colon.                                       ##
################################################################################
import re
import logging
from urllib.parse import quote as urlescape

BADGE_REGEX = re.compile("BADGE_(BRIGHTGREEN|GREEN|YELLOWGREEN|YELLOW|ORANGE|RED|LIGHTGREY|BLUE|[0-9A-Fa-f]{6})")

def filter_soup(soup, target=None, page=None, config=None):
    """replace underscores with dashes in h1,h2,etc. for backwards compatibility"""

    badge_links = soup.find_all(name="a", title=BADGE_REGEX)

    for b in badge_links:
        badge_label = b.string
        if not badge_label:
            badge_label = "".join(b.strings)
        if not badge_label:
            logging.warning("Badge link with no string: %s" % b)
            continue
        if ":" not in badge_label:
            logging.warning("Badge link specified with no ':' in link: %s" % b.string)
            continue

        badge_color = BADGE_REGEX.match(b["title"]).group(1).lower()
        badge_left, badge_right = [urlescape(s.strip()).replace("-","--")
                                   for s in badge_label.split(":", 1)]
        badge_url = "https://img.shields.io/badge/%s-%s-%s.svg" % (
                    badge_left, badge_right, badge_color)

        img = soup.new_tag("img", src=badge_url, alt=badge_label)
        img["class"]="dactyl_badge"
        b.clear()
        b.append(img)
        b["title"] = badge_label
        if not b["href"]:
            del b["href"]

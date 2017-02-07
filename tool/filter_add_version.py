################################################################################
## Add version to markdown filter                                             ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Adds a message to the beginning of a file with a version number, based on  ##
## the URL of the remotely-fetched markdown.                                  ##
################################################################################
import re
import logging

def filter_markdown(md, target=None, page=None, config=None):
    """Finds the version number and adds it to the start of the page."""
    version_regex = r"https://raw.githubusercontent.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/([A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+)/.+\.md"

    try:
        version_match = re.match(version_regex, page["md"])
    except (TypeError, KeyError):
        logging.warning("couldn't get MD path from page %s" % page)
        return md

    try:
        github_owner = version_match.group(1)
        github_project = version_match.group(2)
        vnum = version_match.group(3)
        url = "https://github.com/%s/%s/releases/%s" % (github_owner, github_project, vnum)
        md = ("<p style='margin-top: 1em; font-style: italic'>Updated for <a href='%s' title='view on GitHub'>version %s</a></p>"%(url, vnum))+md
    except AttributeError:
        logging.warning("version regex didn't match: %s" % version_match)

    return md

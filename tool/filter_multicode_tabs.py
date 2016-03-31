################################################################################
## Multicode Tabs filter                                                      ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Finds and un-comments divs with the multicode class, for use with JS that  ##
## turns the contents of those divs into tabs.                                ##
## It's necessary to have them as comments so the markdown inside the div     ##
## gets processed correctly.                                                  ##
################################################################################
import re

def filter_html(html, target=None, page=None):
    """Uncomment multicode tab divs"""
    MC_START_REGEX = re.compile("<!-- *<div class=['\"]multicode['\"][^>]*> *-->")
    MC_END_REGEX = re.compile("<!-- *</div> *-->")

    html = re.sub(MC_START_REGEX, "<div class='multicode'>", html)
    html = re.sub(MC_END_REGEX, "</div>", html)
    return html

################################################################################
## Use Case Filter                                                            ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2019                                          ##
##                                                                            ##
## Nests a comment-delineated section into a use-case-steps div so it can be  ##
## styled properly.                                                           ##
################################################################################

import re

START_REGEX = re.compile(r"<!--\s*USE_CASE_STEPS_START\s*-->")
START_REPL = '<div class="use-case-steps">'
END_REGEX = re.compile(r"<!--\s*USE_CASE_STEPS_END\s*-->")
END_REPL = '</div><!--/.use-case-steps-->'

def filter_html(html, mode="html", **kwargs):
    """
    Turn multicode comments into a div (after markdown inside is parsed). You
    can use this div for styling even in PDF format. Doesn't apply to Markdown
    since most parsers won't parse markdown inside HTML blocks.
    """

    if mode == "md":
        return html

    html = re.sub(START_REGEX, START_REPL, html, count=1)
    if re.search(END_REGEX, html):
        html = re.sub(END_REGEX, "", html)
    else:
        html = html+"\n"+END_REPL+"\n"

    return html

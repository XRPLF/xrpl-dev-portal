################################################################################
## Remove doctoc filter                                                       ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2016                                          ##
##                                                                            ##
## Removes an automatically-generated "doctoc" table of contents, as          ##
## delineated by HTML comments, from the markdown source.                     ##
################################################################################


def filter_markdown(md, target=None, page=None, config=None):
    """Strip out doctoc Table of Contents for RippleAPI"""
    DOCTOC_START = "<!-- START doctoc generated TOC please keep comment here to allow auto update -->"
    DOCTOC_END = "<!-- END doctoc generated TOC please keep comment here to allow auto update -->"

    doctoc_start_i = md.find(DOCTOC_START)
    doctoc_end_i = md.find(DOCTOC_END)
    if doctoc_start_i != -1 and doctoc_end_i != -1:
        md = md[:doctoc_start_i]+md[doctoc_end_i+len(DOCTOC_END):]
    return md

################################################
## Amendment Flask Marker
## Author: Rome Reginelli
## Copyright: Ripple Labs, 2019
##
## Uses the
## - end with an "external link" icon
##      (FontAwesome required)
################################################

import os.path

STATUSES = {
    ":not_enabled:": "template-status_not_enabled.html",
    ":enabled:": "template-status_enabled.html",
}


def filter_markdown(md, config={}, **kwargs):
    for needle, src_file in STATUSES.items():
        with open(os.path.join(config["template_path"], src_file)) as f:
            replacement = f.read().strip()
        md = md.replace(needle, replacement)
    return md

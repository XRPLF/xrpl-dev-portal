################################################################################
## Code Sample Functions                                                      ##
## Author: Rome Reginelli                                                     ##
## Copyright: Ripple Labs, Inc. 2021                                          ##
## License: MIT https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE  ##
##                                                                            ##
## Find code samples in the repository contents and figure out metadata about ##
## them automatically.                                                        ##
################################################################################

import os
import re
from bs4 import BeautifulSoup
from markdown import markdown

cs_dir = "content/_code-samples/" #TODO: make a configurable field
skip_dirs = [
    "node_modules",
    ".git",
    "__pycache__"
]
words_to_caps = [
    "xrp",
]

def to_title_case(s):
    """
    Convert a folder name string to title case, for code samples that don't have
    a README file. The input string is expected to be in kebab-case or snake_case.
    """
    words = re.split(r"_|[^\w']", s)
    words = [w.upper() if w in words_to_caps else w.title() for w in words if w] #remove empty splits
    return " ".join(words).replace("'S", "'s").replace(" A ", " a ")

def all_code_samples():
    cses = []

    for dirpath, dirnames, filenames in os.walk(cs_dir):
        if dirpath == cs_dir:
            continue
        # limit depth to just the code samples and language folders
        depth = dirpath.count(os.sep) - cs_dir.count(os.sep) + 1
        if depth > 1:
            continue
        for sd in skip_dirs:
            if sd in dirnames:
                dirnames.remove(sd)

        cs = {
            "path": dirpath,
            "langs": dirnames,
        }

        if "README.md" in filenames:
            with open(os.path.join(dirpath, "README.md"), "r") as f:
                md = f.read()
            md = markdown(md)
            soup = BeautifulSoup(md, "html.parser")
            h = soup.find(["h1", "h2", "h3"]) # get first header in the file
            if h:
                cs["title"] = h.get_text()
            else:
                cs["title"] = to_title_case(os.path.basename(dirpath))
            p = soup.find("p") # first paragraph defines the blurb
            cs["description"] = p.get_text()

        else:
            cs["title"] = to_title_case(os.path.basename(dirpath))
            cs["description"] = ""
        cs["href"] = dirpath
        cses.append(cs)

    return cses

export = {
    "all_code_samples": all_code_samples,
}

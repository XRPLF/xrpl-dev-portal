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
from markdown import markdown

cs_dir = "content/_code-samples/" #TODO: make a configurable field
skip_dirs = [
    "node_modules",
    ".git",
    "__pycache__"
]

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
            cs["description"] = markdown(md)
        else:
            cs["description"] = os.path.basename(dirpath)
        cses.append(cs)

    return cses

export = {
    "all_code_samples": all_code_samples,
}

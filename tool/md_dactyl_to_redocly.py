#!/usr/bin/env python
###############################################################################
## Markdown files: Dactyl (Jinja) to Redocly (Markdoc) syntax converter
## Author: mDuo13
## License: MIT
##
## Searches md files in the content dir for specific syntax and converts it to
## a format that should work under Redocly.
##
## 1) includes → partials
## 2) github_fork / github_branch variables
## 3) owner / account reserve variables
## 4) include_code() macro → code-snippet component
## 5) category template → child pages component
## 6) include_svg() macro?? TBD
###############################################################################

## include_macro notes:
#   {{ }} → {% /%}
#   include_code("path/to/file", ...) → code-snippet file="/path/to/file" ...
#   , → 
#   start_with → from
#   end_before → before

import os
import os.path
import re
import ruamel.yaml
yaml = ruamel.yaml.YAML(typ="safe")

INCLUDE_CODE_REGEX = re.compile(r'\{\{ *include_code\( *"(?P<fname>[^"]+)"[, ]*(start_with="(?P<start_with>[^"]+)"[, ]*|end_before="(?P<end_before>[^"]+)"[, ]*|language="(?P<language>[^"]+)"[, ]*)* *\) *\}\}')


def should_include(fname):
    """
    Return True if the given file/folder name should be checked.
    Otherwise return False.
    """
    if fname == "node_modules":
        return False
    if fname[:1] == "_":
        return False
    if ".git" in fname:
        return False
    return True


def list_mds(content_dir):
    all_mds = []
    for dirpath, dirnames, filenames in os.walk(content_dir, topdown=True):
        dirnames[:] = [d for d in dirnames if should_include(d)]
        filenames[:] = [f for f in filenames if should_include(f)]
        for filename in filenames:
            if filename[-3:] == ".md":
                #all_mds.append(os.path.relpath(os.path.join(dirpath,filename), content_dir))
                all_mds.append(os.path.join(dirpath,filename))
    return all_mds

def main():
    all_mds = list_mds("content")
    for fname in all_mds:
        with open(fname) as f:
            ftext = f.read()
        ftext2 = ftext
        for m in re.finditer(INCLUDE_CODE_REGEX, ftext):
            raw_string = m.group(0)
            repl_string = '{% code-snippet file="/'+m.group("fname")+'" '
            if m.group("start_with"):
                repl_string += 'from="'+m.group("start_with")+'" '
            if m.group("end_before"):
                repl_string += 'before="'+m.group("end_before")+'" '
            if m.group("language"):
                repl_string += 'language="'+m.group("language")+'" '
            repl_string += '/%}'
            ftext2 = ftext2.replace(raw_string, repl_string)
        if ftext2 != ftext:
            print("replacing include_code in", fname)
            with open(fname, "w") as f:
                f.write(ftext2)

main()
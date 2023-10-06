#!/usr/bin/env python

import os
import os.path
import ruamel.yaml
yaml = ruamel.yaml.YAML(typ="safe")

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
                all_mds.append(os.path.relpath(os.path.join(dirpath,filename), content_dir))
    return all_mds

def list_mds_in_dactyl_config(config_file):
    with open(config_file, "r", encoding="utf-8") as f:
        cfg = yaml.load(f)

    # Config can contain the same file multiple times (e.g. variants across targets). De-dupe.
    all_mds = list(set(pg["md"] for pg in cfg["pages"] if "md" in pg.keys()))
    return all_mds

def report_mismatches(fs_mds, cfg_mds):
    """
    Print a list of paths that aren't present in one or the other list
    """
    fs_mds.sort()
    cfg_mds.sort()

    total_files = len(fs_mds)
    total_pages = len(cfg_mds)

    f_i = 0
    p_i = 0
    while f_i < total_files and p_i < total_pages:
        fname = fs_mds[f_i]
        pname = cfg_mds[p_i]

        if fname == pname:
            # print("Match:", fname)
            f_i += 1
            p_i += 1

        elif fname < pname:
            print("Missing from config:", fname)
            f_i += 1

        elif fname > pname:
            print("Missing from filesystem:", pname)
            p_i += 1

        else:
            print("Unexpected case:", fname, pname)


if __name__ == "__main__":
    fs_mds = list_mds("./content/")
    cfg_mds = list_mds_in_dactyl_config("dactyl-config.yml")
    report_mismatches(fs_mds, cfg_mds)

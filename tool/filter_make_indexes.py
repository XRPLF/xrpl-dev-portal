## Tool for one-time creation of index.md files for dactyl-config entries that
## represent auto-generated index pages.

import sys
import re
import ruamel.yaml
import os, os.path
yaml = ruamel.yaml.YAML()

with open("dactyl-config.yml") as f:
    raw_config = yaml.load(f)

BASE_DIRS = ["content", "@i18n", "ja"]

class DumpString:
    def __init__(self, s=""):
        self.s = s
    def write(self, something):
        if type(something) == bytes:
            something = something.decode()
        self.s += something
    def __repr__(self):
        return self.s

def raw_config_for(page, target):
    for raw_page in raw_config["pages"]:
        if raw_page.get("html", "") == page["html"] and target in raw_page.get("targets", []):
            return raw_page

# def get_hierarchy(page, pages, logger, top_page):
#     crumbs = [page]
#     while crumbs[0] != top_page:
#         for p in pages:
#             if p["html"] == crumbs[0]["parent"]:
#                 crumbs.insert(0, p)
#                 break
#         else:
#             logger.warning("Couldn't find parent '%s' of %s"%(page["parent"], page["html"]))
#             break
#     return crumbs[1:]

def idify(utext):
    utext = re.sub(r'[^\w\s-]', '', utext).strip().lower()
    utext = re.sub(r'[\s-]+', '-', utext)
    return utext

def index_path_for(ja_page, pages):
    for page in pages:
        if page["html"] == ja_page["html"] and "en" in page["targets"]:
            return page["md"] # might throw an error, we'll find out

def filter_soup(soup, currentpage={}, config={}, pages=[], logger=None, **kwargs):
    # for p in pages:
    #     if p["html"] == "docs.html":
    #         top_page = p
    #         break
    # else:
    #     exit("Couldn't find docs top")
    top_page = pages[0]

    for page in pages:
        t = page.get("template", "")
        if t != "pagetype-category.html.jinja" or page.get("md", ""):
            continue
        #crumbs = get_hierarchy(page, pages, logger, top_page)[1:]
        #crumb_slugs = BASE_DIRS + [idify(c["name"]) for c in crumbs] + ["index.md"]
        #index_path = "/".join(crumb_slugs)

        index_path  = os.path.join(*BASE_DIRS, index_path_for(page, config["pages"]))
        #print(index_path)
        simple_entry = {"md": index_path}

        page_props = raw_config_for(page, "ja")
        #print("page_props:", page_props)

        simple_entry["targets"] = page_props["targets"]
        del page_props["targets"]

        title = page_props["name"]
        del page_props["name"]

        if "blurb" in page_props:
            blurb = page_props["blurb"]
            del page_props["blurb"]
        else:
            blurb = ""

        se_str = DumpString()
        yaml.dump(simple_entry, se_str)
        print(se_str)

        fcontents = DumpString("---\n")
        frontmatter = yaml.dump(page_props, fcontents)
        fcontents = str(fcontents) + "---\n# " + title + "\n" + blurb

        # os.makedirs(os.path.split(index_path)[0], exist_ok=True)
        # with open(index_path, "w") as f:
        #     f.write(str(fcontents))
        #print(fcontents)
        #print("\n\n\n")

    exit()

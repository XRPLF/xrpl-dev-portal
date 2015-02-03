#!/usr/bin/env python3

################################################################################
# ripple-dev-portal doc parser
#
# Generate the html for all the Ripple Dev  Portal files from a template
# Optionally pre-compile them to HTML (using pandoc & a custom filter)
################################################################################

from jinja2 import Environment, FileSystemLoader
import json
import subprocess
import os
import sys

DOC_TEMPLATE_FILE = "template-doc.html"
PAGE_MANIFEST_FILE = "pages.json"
BUILD_PATH = ".."
CONTENT_PATH = "../content"
BUTTONIZE_FILTER = "buttonize.py"

def render_pages(precompiled):
    print("reading page manifest...")
    with open(PAGE_MANIFEST_FILE) as f:
        pages = json.load(f)
    print("done")
    
    env = Environment(loader=FileSystemLoader(os.path.curdir))
    env.lstrip_blocks = True
    env.trim_blocks = True

    for currentpage in pages:
    
        if "md" in currentpage:
            # Documentation file
    
            print("reading template file...")
            
#            with open(DOC_TEMPLATE_FILE) as f:
#                template_text = f.read()
#            doc_template = Template(template_text)
            doc_template = env.get_template(DOC_TEMPLATE_FILE)
            print("done")
            
    
            if precompiled:
                filein = os.path.join(CONTENT_PATH, currentpage["md"])
                args = ['pandoc', filein, '-F', BUTTONIZE_FILTER, '-t', 'html']
                print("compiling: running ", " ".join(args),"...")
                pandoc_html = subprocess.check_output(args, universal_newlines=True)
                print("done")
                
                print("rendering page",currentpage,"...")
                out_html = doc_template.render(currentpage=currentpage, pages=pages, 
                                               content=pandoc_html, precompiled=precompiled)
                print("done")
            
            else:
                print("compiling skipped")
                
                print("rendering page",currentpage,"...")
                out_html = doc_template.render(currentpage=currentpage, pages=pages, 
                                               content="", precompiled=precompiled)
                print("done")
        
        else:
            # Not a documentation page
            print("reading template file...")
#            with open(currentpage["template"]) as f:
#                template_text = f.read()
#            template = Template(template_text)
            template = env.get_template(currentpage["template"])
            print("done")
            
            
            print("rendering page",currentpage,"...")
            out_html = template.render(currentpage=currentpage, pages=pages)
            print("done")
            
        
        fileout = os.path.join(BUILD_PATH, currentpage["html"])
        if (not os.path.isdir(BUILD_PATH)):
            print("creating build folder",BUILD_PATH)
            os.makedirs(BUILD_PATH)
        with open(fileout, "w") as f:
            print("writing to file:",fileout,"...")
            f.write(out_html)
            print("done")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        exit("usage: %s [compile]" % sys.argv[0])
    elif len(sys.argv) <= 1:
        render_pages(False)
    elif sys.argv[1].lower() == "true":
        render_pages(True)
    elif sys.argv[1].lower() == "false":
        render_pages(False)
    else:
        exit("argument 1 must be 'true' or 'false'")

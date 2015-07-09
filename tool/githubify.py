#!/bin/env python3
"""
Convert between Dev-Portal-ready markdown and Github-ready markdown. Has two modes:
Normal - Convert from Dev Portal format to Github:
    * Comments out divs that the dev portal uses to generate tabs, so that Github parses the markdown inside
    * Replaces local relative links with absolute links to ripple.com
Reverse - Convert from Github format to Dev Portal:
    * Uncomments multicode divs
    * Replaces absolute links with local ones that will work even offline.
    
Usage: githubify.py ripplerest_api.md > readme.md

You may still want to do some manual editing (for example, to add Travis status icons to your readme)
"""

import sys

def convert_page(text, reverse):
    replacements = {
        "<div class='multicode'>": "<!-- <div class='multicode'> -->",
        "</div>": "<!-- </div> -->",
        "(rest-api-tool.html": "(https://ripple.com/build/rest-tool",
        "(transactions.html": "(https://ripple.com/build/transactions",
        "(rippled-apis.html": "(https://ripple.com/build/rippled-apis",
        "(charts-api-tool.html": "(https://ripple.com/build/charts-api-tool/",
        }
    
    for (k,v) in replacements.items():
        if reverse:
            text = text.replace(v,k)
        else:
            text = text.replace(k,v)
        
    return text
    
if __name__ == "__main__":
    if len(sys.argv) < 2 or len(sys.argv) > 3:
        exit("usage: %s infile [reverse]" % sys.argv[0])
    
    if len(sys.argv) == 3 and sys.argv[2].lower() == "reverse":
        reverse = True
    else:
        reverse = False
    
    with open(sys.argv[1]) as f:
        text = f.read()
        text = convert_page(text, reverse)
        print(text)


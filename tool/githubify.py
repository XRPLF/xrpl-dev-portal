#!/bin/env python3

import sys

def convert_page(text):
    replacements = {
        "<div class='multicode'>": "<!-- <div class='multicode'> -->",
        "</div>": "<!-- </div> -->",
        "(rest-api-tool.html": "(https://ripple.com/build/rest-tool",
        "(transactions.html": "(https://ripple.com/build/transactions",
        "(rippled-apis.html": "(https://ripple.com/build/rippled-apis",
        }
    
    for (k,v) in replacements.items():
        text = text.replace(k,v)
        
    return text
    
if __name__ == "__main__":
    if len(sys.argv) != 2:
        exit("usage: %s infile" % sys.argv[0])
    
    with open(sys.argv[1]) as f:
        text = f.read()
        text = convert_page(text)
        print(text)


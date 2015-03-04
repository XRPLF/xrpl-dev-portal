#!/bin/env python

"""
Tool to parse a markdown file for WebSocket examples,
reformat those examples as JSON-RPC, and test them against
a public WebSocket server.
"""

from __future__ import print_function
import re, json
import sys
import warnings
if sys.version_info[:2] <= (2,7):
    import httplib
else:
    import http.client as httplib

WS_REGEX = r"\*WebSocket\*\s*```\s*(?P<json>\{[^`]*\})\s*```"

def ws2rpc(s):    
    ws_j = json.loads(s)
    
    if "command" not in ws_j:
        #apparently not a WebSocket request after all?
        warnings.warn("Incorrect match? "+s)
        return ""
    
    rpc_j = {"params":[{}]}
    for key,val in ws_j.items():
        if key == "id":
            continue
        elif key == "command":
            rpc_j["method"] = val
        else:
            rpc_j["params"][0][key] = val
            
    return json.dumps(rpc_j, sort_keys=True, indent=4, separators=(',', ': '))
    

if __name__ == "__main__":
    
    if len(sys.argv) != 2:
        exit("Usage: %s inputfile" % sys.argv[0])
    
    f = open(sys.argv[1], 'r')
    matches = re.findall(WS_REGEX, f.read())
    f.close()
    
    for s in matches:
        js = ws2rpc(s)
        if js:
            print("Request:\n*JSON-RPC*\n```\n"+js+"\n```\n\n")
            
            conn = httplib.HTTPConnection("s1.ripple.com", 51234)
            conn.request("POST", "/", js)
            response = conn.getresponse()
            
            s = response.read()
            
            try:
                #parse & pretty-print response JSON if valid
                response_json = json.loads(s.decode("utf-8"))
                s = json.dumps(response_json, sort_keys=True, indent=4, separators=(',', ': '))
            except ValueError:
                #invalid JSON; leave response as-is
                pass
        
            print("Response:\n*JSON-RPC*\n```\n%s %s\n%s```\n\n" % (
                    response.status, response.reason, s) )

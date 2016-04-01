#!/bin/env python

"""
Tool to parse a markdown file for WebSocket examples,
reformat those examples as JSON-RPC, and test them against
a public WebSocket server.
"""

from __future__ import print_function
import re, json, sys, warnings, argparse

if sys.version_info[:2] <= (2,7):
    import httplib
    #gotta define this
    class FileNotFoundError(IOError):
        pass
else:
    import http.client as httplib

RIPPLED_RPC_HOST = "s1.ripple.com"
RIPPLED_RPC_PORT = 51234

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

def do_JSONRPC(req, host, port):
    conn = httplib.HTTPConnection(host, port)
    conn.request("POST", "/", js)
    response = conn.getresponse()

    s = response.read()
    header = "%s %s" % (response.status, response.reason)
    return (header, s)


def find_ws_in_markdown(md_text):
    WS_REGEX = r"\*WebSocket\*\s*```\s*(?P<json>\{[^`]*\})\s*```"
    matches = re.findall(WS_REGEX, md_text)
    return matches

def print_md_for_request(json_rpc_text):

    print("""Request:
*JSON-RPC*

```
%s
```

""" % json_rpc_text)

def print_md_for_response(json_rpc_text):
    header, response_body = do_JSONRPC(js, args.rippled_host, args.rippled_port)

    try:
        #parse & pretty-print response JSON if valid
        response_json = json.loads(response_body.decode("utf-8"))
        response_body = json.dumps(response_json, sort_keys=True,
                                    indent=4, separators=(',', ': '))
    except ValueError:
        #invalid JSON; leave response as-is
        pass

    print("""Response:
*JSON-RPC*

```
%s
%s
```""" % (header, response_body) )

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert WebSocket examples to JSON-RPC with responses from the live rippled network")
    parser.add_argument("inputfile")
    parser.add_argument("--offline", action="store_true", help="don't connect to the network to generate responses", default=False)
    parser.add_argument("--json", "-j", action="store_true", help="assume input file is raw JSON in websocket format", default=False)
    parser.add_argument("--rippled_host", help="hostname of a rippled server to use", type=str, default=RIPPLED_RPC_HOST)
    parser.add_argument("--rippled_port", help="port number of a rippled server to use", type=int, default=RIPPLED_RPC_PORT)

    args = parser.parse_args()

    with open(args.inputfile, "r") as f:
        f_text = f.read()

    if args.json:
        js = ws2rpc(f_text)
        print_md_for_request(js)

        if not args.offline:
            print_md_for_response(js)

    else:
        matches = find_ws_in_markdown(f_text)
        for s in matches:
            js = ws2rpc(s)
            print_md_for_request(js)

            if not args.offline:
                print_md_for_response(js)

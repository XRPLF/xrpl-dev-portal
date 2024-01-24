---
html: print.html
parent: status-and-debugging-methods.html
seo:
    description: Get information about internal subsystems.
labels:
  - Core Server
---
# print
[[Source]](https://github.com/XRPLF/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/Print.cpp "Source")

The `print` command returns the current status of various internal subsystems, including peers, the ledger cleaner, and the resource manager.

*The `print` method is an [admin method](../index.md) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "print_req_1",
    "command": "print"
}
```
{% /tab %}

{% tab label="Commandline" %}
```
rippled print
```
{% /tab %}

{% /tabs %}

The request includes no parameters.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "app" : {
         "ledgercleaner" : {
            "status" : "idle"
         },
         "peers" : {
            "peerfinder" : {
               "bootcache" : {
                  "entries" : 109
               },
               "config" : {
                  "auto_connect" : "true",
                  "features" : "",
                  "max_peers" : 21,
                  "out_peers" : 10,
                  "port" : 51235,
                  "want_incoming" : "true"
               },
               "counts" : {
                  "accept" : 0,
                  "close" : 0,
                  "cluster" : "0",
                  "connect" : 0,
                  "fixed" : "0",
                  "in" : "0/11",
                  "out" : "10/10",
                  "total" : "10"
               },
               "fixed" : 0,
               "livecache" : {
                  "entries" : [
                     {
                        "address" : "23.239.3.247:51235",
                        "expires" : "30000000000 nanoseconds",
                        "hops" : 2
                     },
                     {
                        "address" : "192.170.145.88:51235",
                        "expires" : "30000000000 nanoseconds",
                        "hops" : 1
                     },
                     {
                        "address" : "198.204.238.130:51235",
                        "expires" : "26000024558 nanoseconds",
                        "hops" : 1
                     },
                     {
                        "address" : "203.127.12.115:51235",
                        "expires" : "26000024558 nanoseconds",
                        "hops" : 2
                     },
                     {
                        "address" : "212.83.147.67:51235",
                        "expires" : "26000024558 nanoseconds",
                        "hops" : 2
                     }
                  ],
                  "hist" : "0, 10, 74, 10, 0, 0, 0, 0",
                  "size" : "94"
               },
               "peers" : [
                  {
                     "local_address" : "10.1.10.78:48923",
                     "remote_address" : "52.24.43.83:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:50004",
                     "remote_address" : "52.26.205.197:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:37019",
                     "remote_address" : "168.1.60.132:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:38775",
                     "remote_address" : "192.170.145.88:51235",
                     "state" : "active"
                  },
                  {
                     "local_address" : "10.1.10.78:34793",
                     "remote_address" : "198.204.238.130:51235",
                     "state" : "active"
                  }
               ]
            }
         },
         "resource" : {
            "admin" : [
               {
                  "balance" : 0,
                  "count" : 1,
                  "name" : "\"127.0.0.1\""
               }
            ],
            "inactive" : [],
            "inbound" : [],
            "outbound" : [
               {
                  "balance" : 23,
                  "count" : 1,
                  "name" : "93.190.138.234:51235"
               },
               {
                  "balance" : 35,
                  "count" : 1,
                  "name" : "198.204.238.130:51235"
               },
               {
                  "balance" : 31,
                  "count" : 1,
                  "name" : "52.26.205.197:51235"
               },
               {
                  "balance" : 32,
                  "count" : 1,
                  "name" : "54.186.73.52:51235"
               },
               {
                  "balance" : 15,
                  "count" : 1,
                  "name" : "72.251.233.164:51235"
               }
            ]
         },
         "server" : {
            "active" : "2",
            "hist" : "16",
            "history" : [
               {
                  "bytes_in" : "214",
                  "bytes_out" : "11688",
                  "elapsed" : "0 seconds",
                  "id" : "16",
                  "requests" : 1,
                  "when" : "2015-Jun-16 16:33:50"
               },
               {
                  "bytes_in" : "214",
                  "bytes_out" : "11431",
                  "elapsed" : "0 seconds",
                  "id" : "15",
                  "requests" : 1,
                  "when" : "2015-Jun-16 16:11:59"
               },
               {
                  "bytes_in" : "227",
                  "bytes_out" : "337",
                  "elapsed" : "0 seconds",
                  "id" : "3",
                  "requests" : 1,
                  "when" : "2015-Jun-16 14:57:23"
               },
               {
                  "bytes_in" : "214",
                  "bytes_out" : "2917",
                  "elapsed" : "0 seconds",
                  "id" : "2",
                  "requests" : 1,
                  "when" : "2015-Jun-16 12:39:29"
               },
               {
                  "bytes_in" : "220",
                  "bytes_out" : "1426",
                  "elapsed" : "0 seconds",
                  "id" : "1",
                  "requests" : 1,
                  "when" : "2015-Jun-16 12:39:13"
               }
            ]
         },
         "validators" : {}
      },
      "status" : "success"
   }
}

```
{% /tab %}

{% /tabs %}

The response follows the [standard format][]. Additional fields in the result depend on the internal state of the `rippled` server. The results of this command are subject to change without notice.

### Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/_snippets/common-links.md" /%}

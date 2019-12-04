# fetch_info
[[Source]](https://github.com/ripple/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/FetchInfo.cpp "Source")

The `fetch_info` command returns information about objects that this server is currently fetching from the network, and how many peers have that information. It can also be used to reset current fetches.

_The `fetch_info` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 91,
    "command": "fetch_info",
    "clear": false
}
```

*JSON-RPC*

```
{
    "method": "fetch_info",
    "params": [
        {
            "clear": false
        }
    ]
}
```

*Commandline*

```
#Syntax: fetch_info [clear]
rippled fetch_info
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field` | Type    | Description                                              |
|:--------|:--------|:---------------------------------------------------------|
| `clear` | Boolean | If `true`, reset current fetches. Otherwise, only get status of fetches in progress. |

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
{
   "result" : {
      "info" : {
         "348928" : {
            "hash" : "C26D432B06F84861BCACD7942EDC3FE0B2E1DEB966A9E516A0FD275A375C2010",
            "have_header" : true,
            "have_state" : false,
            "have_transactions" : true,
            "needed_state_hashes" : [
               "BF8DC6B1E10D1D3565BF0649075D22EBFD34F751AFCC0E53E81D74786BC88922",
               "34E37A71CB51A12C73A435250E6A6349F7884C7EEBA6B88FA31F0244E967E88F",
               "BFB7D3008A7D61FD6A0538D1C2E70CFB94CE8DC66606319C372F278A48629765",
               "41C0C61D701FB1EA586F0EF1FC7A91FEC476D979589DA60507F05C13F7C21975",
               "6DDE8840A2C3C7FF05E5FFEE4D06408694C16A8357338FE0C4581DC3D8A00BBA",
               "6C69D833B582C849917806FA009518832BB50E900E43716FD7CC1966428DD0CF",
               "1EDC020CFC4AF19B625C52E20B66D6AE672821CCC461E8A9C457A3B2955657F7",
               "FC0616A66A2B0589CA513F3341D4EA51E782C4601E5072308478E3CC19264640",
               "19FC607B5DE1B64681A676EC1ED5507B9555B0E098CD9D898320297DE1A64033",
               "5E128D3FC990074E35687387A14AA12D9FD287E5AB57CB9B2FD83DE635DF5CA9",
               "DE72820F3981770F2AA8770BC233B80661F1A452819D8529008875FF8DED87A9",
               "3ACB84BEE2C45556351FF60FD787D235C9CF5623FB8A35B01446B773598E7CC0",
               "0DD3A8DF69874148057F1F2BF305442FF2E89A76A08B4CC8C051E2ED69B874F3",
               "4AE9A9C4F12A5BD0355037DA40A0B145420A2168A9FEDE43E643BD13062F8ECE",
               "08CBF8CFFEC207F5AC4E4F24BC447011FD8C79D25B344281FBFB4732D7058ED4",
               "779B2577C5C4BAED6657421448EA506BBF50F86BE363E0924127C4EA17A58BBE"
            ],
            "peers" : 2,
            "timeouts" : 0
         }
      },
      "status" : "success"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "info" : {
         "348928" : {
            "hash" : "C26D432B06F84861BCACD7942EDC3FE0B2E1DEB966A9E516A0FD275A375C2010",
            "have_header" : true,
            "have_state" : false,
            "have_transactions" : true,
            "needed_state_hashes" : [
               "BF8DC6B1E10D1D3565BF0649075D22EBFD34F751AFCC0E53E81D74786BC88922",
               "34E37A71CB51A12C73A435250E6A6349F7884C7EEBA6B88FA31F0244E967E88F",
               "BFB7D3008A7D61FD6A0538D1C2E70CFB94CE8DC66606319C372F278A48629765",
               "41C0C61D701FB1EA586F0EF1FC7A91FEC476D979589DA60507F05C13F7C21975",
               "6DDE8840A2C3C7FF05E5FFEE4D06408694C16A8357338FE0C4581DC3D8A00BBA",
               "6C69D833B582C849917806FA009518832BB50E900E43716FD7CC1966428DD0CF",
               "1EDC020CFC4AF19B625C52E20B66D6AE672821CCC461E8A9C457A3B2955657F7",
               "FC0616A66A2B0589CA513F3341D4EA51E782C4601E5072308478E3CC19264640",
               "19FC607B5DE1B64681A676EC1ED5507B9555B0E098CD9D898320297DE1A64033",
               "5E128D3FC990074E35687387A14AA12D9FD287E5AB57CB9B2FD83DE635DF5CA9",
               "DE72820F3981770F2AA8770BC233B80661F1A452819D8529008875FF8DED87A9",
               "3ACB84BEE2C45556351FF60FD787D235C9CF5623FB8A35B01446B773598E7CC0",
               "0DD3A8DF69874148057F1F2BF305442FF2E89A76A08B4CC8C051E2ED69B874F3",
               "4AE9A9C4F12A5BD0355037DA40A0B145420A2168A9FEDE43E643BD13062F8ECE",
               "08CBF8CFFEC207F5AC4E4F24BC447011FD8C79D25B344281FBFB4732D7058ED4",
               "779B2577C5C4BAED6657421448EA506BBF50F86BE363E0924127C4EA17A58BBE"
            ],
            "peers" : 2,
            "timeouts" : 0
         }
      },
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `info`  | Object | Map of objects being fetched and the status of that object being fetched. A ledger being fetched may be identified by its [ledger index][]; ledgers and other objects being fetched may also be identified by their hashes. |

The fields describing a fetch in progress are subject to change without notice. The following fields may be included:

| `Field`               | Type                    | Description                |
|:----------------------|:------------------------|:---------------------------|
| `hash`                | String                  | The hash of the item being fetched. |
| `have_header`         | Boolean                 | For a ledger, whether this server has already obtained the ledger's header section. |
| `have_transactions`   | Boolean                 | For a ledger, whether this server has already obtained the transaction section of that ledger. |
| `needed_state_hashes` | Array of (Hash) Strings | The hash values of state objects still needed from this item. If more than 16 are needed, the response contains only the first 16. |
| `peers`               | Number                  | The number of peers who have this item available. |
| `timeouts`            | Number                  | The number of times that fetching this item has resulted in a timeout (2.5 seconds). |

### Possible Errors

* Any of the [universal error types][].

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

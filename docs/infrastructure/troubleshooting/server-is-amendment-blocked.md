---
html: server-is-amendment-blocked.html
parent: troubleshoot-the-rippled-server.html
seo:
    description: Troubleshoot a server that can't implement amendment changes.
labels:
  - Core Server
---
# rippled Server is Amendment Blocked

Servers which are amendment blocked can't determine the validity of a ledger, submit or process transactions, or participate in the consensus process.

One of the first signs that your `rippled` server is [amendment blocked](../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers) is an `amendmentBlocked` error that is returned when you submit a transaction. Here's an example `amendmentBlocked` error:

```json
{
   "result":{
      "error":"amendmentBlocked",
      "error_code":14,
      "error_message":"Amendment blocked, need upgrade.",
      "request":{
         "command":"submit",
         "tx_blob":"479H0KQ4LUUXIHL48WCVN0C9VD7HWSX0MG1UPYNXK6PI9HLGBU2U10K3HPFJSROFEG5VD749WDPHWSHXXO72BOSY2G8TWUDOJNLRTR9LTT8PSOB9NNZ485EY2RD9D80FLDFRBVMP1RKMELILD7I922D6TBCAZK30CSV6KDEDUMYABE0XB9EH8C4LE98LMU91I9ZV2APETJD4AYFEN0VNMIT1XQ122Y2OOXO45GJ737HHM5XX88RY7CXHVWJ5JJ7NYW6T1EEBW9UE0NLB2497YBP9V1XVAEK8JJYVRVW0L03ZDXFY8BBHP6UBU7ZNR0JU9GJQPNHG0DK86S4LLYDN0BTCF4KWV2J4DEB6DAX4BDLNPT87MM75G70DFE9W0R6HRNWCH0X075WHAXPSH7S3CSNXPPA6PDO6UA1RCCZOVZ99H7968Q37HACMD8EZ8SU81V4KNRXM46N520S4FVZNSJHA"
      },
      "status":"error"
   }
}
```

The following `rippled` log message also indicates that your server is amendment blocked:

```
2018-Feb-12 19:38:30 LedgerMaster:ERR One or more unsupported amendments activated: server blocked.
```

You can verify that your `rippled` server is amendment blocked using the `server_info` command. In the response, look for `result.info.amendment_blocked`. If `amendment_blocked` is set to `true`, your server is amendment blocked.

**Example JSON-RPC Response:**

```json
{
    "result": {
        "info": {
            "amendment_blocked": true,
            "build_version": "0.80.1",
            "complete_ledgers": "6658438-6658596",
            "hostid": "ip-10-30-96-212.us-west-2.compute.internal",
            "io_latency_ms": 1,
            "last_close": {
                "converge_time_s": 2,
                "proposers": 10
            },
...
        },
        "status": "success"
    }
}
```


## Unblock Servers

The easiest solution is to update to the latest version of `rippled`, but depending on the scenario, you may want to update to an older version with the amendment blocking your server.

**Warning:** If the newest `rippled` version provides security or other urgent fixes, you should upgrade to the newest version as soon as possible.

To determine if you can unblock your `rippled` server by upgrading to a version older than the newest version, find out which features are blocking your server and then look up the `rippled` version that supports the blocking features.

To find out which features are blocking your `rippled` server, use the [`feature`](../../references/http-websocket-apis/admin-api-methods/status-and-debugging-methods/feature.md) admin command. Look for features that have:

```
"enabled" : true
"supported" : false
```

These values mean the amendment is required in the latest ledger, but your server doesn't support the implementation.

**Example JSON-RPC Response:**

```json
{
    "result": {
        "features": {
            "07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104": {
                "enabled": true,
                "name": "Escrow",
                "supported": true,
                "vetoed": false
            },
            "08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647": {
                "enabled": true,
                "name": "PayChan",
                "supported": true,
                "vetoed": false
            },
            "1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146": {
                "enabled": false,
                "name": "CryptoConditions",
                "supported": true,
                "vetoed": false
            },
            "157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            },
...
            "F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064": {
                "enabled": true,
                "supported": false,
                "vetoed": false
            }
        },
        "status": "success"
    }
}
```

In this example, conflicts with the following features are causing your `rippled` server to be amendment blocked:

* `157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1`

* `67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172`

* `F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064`

To look up which `rippled` version supports these features, see [Known Amendments](/resources/known-amendments.md).

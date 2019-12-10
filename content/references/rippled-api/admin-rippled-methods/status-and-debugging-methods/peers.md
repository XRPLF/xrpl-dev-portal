# peers
[[Source]](https://github.com/ripple/rippled/blob/52f298f150fc1530d201d3140c80d3eaf781cb5f/src/ripple/rpc/handlers/Peers.cpp "Source")

The `peers` command returns a list of all other `rippled` servers currently connected to this one over the [Peer Protocol](peer-protocol.html), including information on their connection and sync status.

*The `peers` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 2,
    "command": "peers"
}
```

*Commandline*

```
rippled peers
```

<!-- MULTICODE_BLOCK_END -->

The request includes no additional parameters.

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": "peers_example",
  "result": {
    "cluster": {},
    "peers": [
      {
        "address": "5.189.239.203:51235",
        "complete_ledgers": "51813132 - 51815132",
        "ledger": "99A1E29C9F235DCCBB087F85F11756BECA606A756C22AB826AB1F319C470C3E3",
        "load": 157,
        "metrics": {
          "avg_bps_recv": "10255",
          "avg_bps_sent": "2015",
          "total_bytes_recv": "356809",
          "total_bytes_sent": "74208"
        },
        "public_key": "n94ht2A9aBoARRhk1rwypZNVXJDiMN4qzs1Bd5KsQaSnN3WVy8Tw",
        "uptime": 2,
        "version": "rippled-1.4.0"
      },
      {
        "address": "[::ffff:50.22.123.222]:51235",
        "complete_ledgers": "32570 - 51815131",
        "ledger": "99A1E29C9F235DCCBB087F85F11756BECA606A756C22AB826AB1F319C470C3E3",
        "load": 219,
        "metrics": {
          "avg_bps_recv": "7223",
          "avg_bps_sent": "6742",
          "total_bytes_recv": "593148",
          "total_bytes_sent": "204540"
        },
        "public_key": "n9LbkoB9ReSbaA9SGL317fm6CvjLcFG8hGoierLYfwiCDsEXHcP3",
        "uptime": 3,
        "version": "rippled-1.3.1"
      },
      {
        "address": "51.89.153.154:51235",
        "complete_ledgers": "51814130 - 51815130",
        "ledger": "808800914218F5622ED5F639BC0EEDF9530E47C6F81CD1EB3866FA1496F62B9C",
        "load": 27,
        "metrics": {
          "avg_bps_recv": "172748",
          "avg_bps_sent": "7355",
          "total_bytes_recv": "5455031",
          "total_bytes_sent": "234276"
        },
        "public_key": "n944vHEtDhPm4Bd9rPowZMJduR9XrpxKS9AKHFfcJtKRVAdhfFfD",
        "uptime": 8,
        "version": "rippled-1.4.0"
      },
      {
        "address": "192.151.157.20:51235",
        "complete_ledgers": "51813128 - 51815128",
        "latency": 8000,
        "load": 70,
        "metrics": {
          "avg_bps_recv": "463258",
          "avg_bps_sent": "21954",
          "total_bytes_recv": "13910029",
          "total_bytes_sent": "678908"
        },
        "public_key": "n9JbUWaFZDi1UxFexJXf1D9dRpn8UK6pTNwRxBCjEvLEwQa384uP",
        "uptime": 19,
        "version": "rippled-1.3.1"
      },
      {
        "address": "[::ffff:94.237.45.66]:51235",
        "complete_ledgers": "51815004 - 51815131",
        "ledger": "99A1E29C9F235DCCBB087F85F11756BECA606A756C22AB826AB1F319C470C3E3",
        "load": 202,
        "metrics": {
          "avg_bps_recv": "18258",
          "avg_bps_sent": "1903",
          "total_bytes_recv": "1184272",
          "total_bytes_sent": "65101"
        },
        "public_key": "n9Lg83FYh8YDivG9TcgXhq5Y3PwunmRqVfvibd19Ko9uu3DtqLBM",
        "uptime": 2,
        "version": "rippled-1.3.1"
      },
      {
        "address": "[::ffff:149.56.21.37]:51235",
        "complete_ledgers": "51478129 - 51815129",
        "ledger": "462FA0B34723C12EBE4DC9974B397D6A21D4F1770DE3CD584D4E33DBC83FC247",
        "load": 182,
        "metrics": {
          "avg_bps_recv": "132648",
          "avg_bps_sent": "13935",
          "total_bytes_recv": "3983628",
          "total_bytes_sent": "433757"
        },
        "public_key": "n94Dutms7xoSgWjbjYftDJGXvc5jaeYZq3J7o1Jwo35dZAyuzNWT",
        "uptime": 14,
        "version": "rippled-1.3.1"
      },
      {
        "address": "77.117.40.191:51235",
        "complete_ledgers": "51812267 - 51815071",
        "latency": 30555,
        "ledger": "0562C7A1898196FDC60B8DB1838961BFBA6B9304B1510E6030B32A4FB38400FB",
        "load": 3783,
        "metrics": {
          "avg_bps_recv": "495673",
          "avg_bps_sent": "57527",
          "total_bytes_recv": "17137378",
          "total_bytes_sent": "4140188"
        },
        "public_key": "n9LELaTdzKwfzhvHZKKrD3ZEJtWABSg4ocAT4dz5Vg5JgAVGwVdd",
        "uptime": 73,
        "version": "rippled-1.4.0"
      },
      {
        "address": "[::ffff:94.237.49.50]:51235",
        "complete_ledgers": "51815002 - 51815130",
        "latency": 8000,
        "ledger": "C6030B52471F8076F88A90C6FC2B2998794B32023FAC69FF573437D6D1470961",
        "load": 1563,
        "metrics": {
          "avg_bps_recv": "215539",
          "avg_bps_sent": "25705",
          "total_bytes_recv": "23134383",
          "total_bytes_sent": "2738880"
        },
        "public_key": "n9MLzBWq7WNM2sdpRKY2Tr3EJfxwSwsnDEpxU3auGJHgvq3Bit6S",
        "uptime": 112,
        "version": "rippled-1.3.1"
      }
    ]
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```
{
   "result" : {
      "cluster" : {},
      "peers" : [
         {
            "address" : "50.22.123.222:51235",
            "complete_ledgers" : "32570 - 51815097",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 7,
            "metrics" : {
               "avg_bps_recv" : "1152",
               "avg_bps_sent" : "332",
               "total_bytes_recv" : "96601",
               "total_bytes_sent" : "45322"
            },
            "public_key" : "n9LbkoB9ReSbaA9SGL317fm6CvjLcFG8hGoierLYfwiCDsEXHcP3",
            "uptime" : 1,
            "version" : "rippled-1.3.1"
         },
         {
            "address" : "212.83.147.67:51235",
            "complete_ledgers" : "51815014 - 51815040",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 1,
            "metrics" : {
               "avg_bps_recv" : "0",
               "avg_bps_sent" : "1490",
               "total_bytes_recv" : "18348",
               "total_bytes_sent" : "46013"
            },
            "public_key" : "n94s5V53w1g4HdEdHdUU1FVrqHTVDbcb7bt44ib9JcM3c281LoDr",
            "sanity" : "unknown",
            "uptime" : 2,
            "version" : "rippled-1.3.1"
         },
         {
            "address" : "158.69.24.50:51235",
            "complete_ledgers" : "51478098 - 51815098",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 55,
            "metrics" : {
               "avg_bps_recv" : "88080",
               "avg_bps_sent" : "2703",
               "total_bytes_recv" : "2786780",
               "total_bytes_sent" : "89368"
            },
            "public_key" : "n9KfEhmmdxmjJdpbpRHGJ9ezoNzdyUepA11cT71jmq1fMDsZAcSh",
            "uptime" : 3,
            "version" : "rippled-1.3.1"
         },
         {
            "address" : "[::ffff:174.64.99.193]:51235",
            "complete_ledgers" : "51813091 - 51815091",
            "latency" : 16000,
            "ledger" : "CF72319DC762355C92BDD29E4CE066CEB03FF2A077A511D586B9FD7B74F55D94",
            "load" : 325,
            "metrics" : {
               "avg_bps_recv" : "19012",
               "avg_bps_sent" : "52053",
               "total_bytes_recv" : "586809",
               "total_bytes_sent" : "1678192"
            },
            "public_key" : "n9MH4Xu8FYPPoUFs679NQp7F6epFznM7x6bF4sAJWQvKkPBUHgd3",
            "uptime" : 26,
            "version" : "rippled-1.4.0-b8"
         },
         {
            "address" : "[::ffff:94.237.45.66]:51235",
            "complete_ledgers" : "51814966 - 51815093",
            "latency" : 8773,
            "ledger" : "61CF015A709122917B001367EE81E5E0D56E485A0BCAB53785A1CB830E0F9589",
            "load" : 3522,
            "metrics" : {
               "avg_bps_recv" : "368875",
               "avg_bps_sent" : "59308",
               "total_bytes_recv" : "11558753",
               "total_bytes_sent" : "2257872"
            },
            "public_key" : "n9Lg83FYh8YDivG9TcgXhq5Y3PwunmRqVfvibd19Ko9uu3DtqLBM",
            "uptime" : 37,
            "version" : "rippled-1.3.1"
         }
      ],
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
      "cluster" : {},
      "peers" : [
         {
            "address" : "50.22.123.222:51235",
            "complete_ledgers" : "32570 - 51815097",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 7,
            "metrics" : {
               "avg_bps_recv" : "1152",
               "avg_bps_sent" : "332",
               "total_bytes_recv" : "96601",
               "total_bytes_sent" : "45322"
            },
            "public_key" : "n9LbkoB9ReSbaA9SGL317fm6CvjLcFG8hGoierLYfwiCDsEXHcP3",
            "uptime" : 1,
            "version" : "rippled-1.3.1"
         },
         {
            "address" : "212.83.147.67:51235",
            "complete_ledgers" : "51815014 - 51815040",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 1,
            "metrics" : {
               "avg_bps_recv" : "0",
               "avg_bps_sent" : "1490",
               "total_bytes_recv" : "18348",
               "total_bytes_sent" : "46013"
            },
            "public_key" : "n94s5V53w1g4HdEdHdUU1FVrqHTVDbcb7bt44ib9JcM3c281LoDr",
            "sanity" : "unknown",
            "uptime" : 2,
            "version" : "rippled-1.3.1"
         },
         {
            "address" : "158.69.24.50:51235",
            "complete_ledgers" : "51478098 - 51815098",
            "ledger" : "223DB74FE021AB1A4AA9E1CC588E0DBCC3FC7C080B93C01C30C246D89F951EA2",
            "load" : 55,
            "metrics" : {
               "avg_bps_recv" : "88080",
               "avg_bps_sent" : "2703",
               "total_bytes_recv" : "2786780",
               "total_bytes_sent" : "89368"
            },
            "public_key" : "n9KfEhmmdxmjJdpbpRHGJ9ezoNzdyUepA11cT71jmq1fMDsZAcSh",
            "uptime" : 3,
            "version" : "rippled-1.3.1"
         },
         {
            "address" : "[::ffff:174.64.99.193]:51235",
            "complete_ledgers" : "51813091 - 51815091",
            "latency" : 16000,
            "ledger" : "CF72319DC762355C92BDD29E4CE066CEB03FF2A077A511D586B9FD7B74F55D94",
            "load" : 325,
            "metrics" : {
               "avg_bps_recv" : "19012",
               "avg_bps_sent" : "52053",
               "total_bytes_recv" : "586809",
               "total_bytes_sent" : "1678192"
            },
            "public_key" : "n9MH4Xu8FYPPoUFs679NQp7F6epFznM7x6bF4sAJWQvKkPBUHgd3",
            "uptime" : 26,
            "version" : "rippled-1.4.0-b8"
         },
         {
            "address" : "[::ffff:94.237.45.66]:51235",
            "complete_ledgers" : "51814966 - 51815093",
            "latency" : 8773,
            "ledger" : "61CF015A709122917B001367EE81E5E0D56E485A0BCAB53785A1CB830E0F9589",
            "load" : 3522,
            "metrics" : {
               "avg_bps_recv" : "368875",
               "avg_bps_sent" : "59308",
               "total_bytes_recv" : "11558753",
               "total_bytes_sent" : "2257872"
            },
            "public_key" : "n9Lg83FYh8YDivG9TcgXhq5Y3PwunmRqVfvibd19Ko9uu3DtqLBM",
            "uptime" : 37,
            "version" : "rippled-1.3.1"
         }
      ],
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing a JSON object with the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `cluster` | Object | Summary of other `rippled` servers in the same cluster, if [configured as a cluster](clustering.html). [New in: rippled 0.30.1][] |
| `peers`   | Array  | Array of peer objects.                                  |

Each field of the `cluster` object is the public key of that `rippled` server's identifying key pair. (This is the same value that that server returns as `pubkey_node` in the [server_info method][].) The contents of that field are an object with the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `tag`   | String | The display name for this cluster member as defined in the config file. |
| `fee`   | Number | _(May be omitted)_ The load multiplier this cluster member is applying to the [transaction cost](transaction-cost.html) |
| `age`   | Number | The number of seconds since the last cluster report from this cluster member. |

Each member of the `peers` array is a peer object with the following fields:

| `Field`            | Type    | Description                                   |
|:-------------------|:--------|:----------------------------------------------|
| `address`          | String  | The IP address and port where this peer is connected |
| `cluster`          | Boolean | _(May be omitted)_ If `true`, the current server and the peer server are part of the same `rippled` cluster. |
| `name`             | String  | _(May be omitted)_ If the peer is part of the same cluster, this is the display name for that server as defined in the config file. |
| `complete_ledgers` | String  | Range expression indicating the [ledger indexes][ledger index] of the ledger versions the peer `rippled` server has available |
| `inbound`          | Boolean | _(May be omitted)_ If `true`, the peer is connecting to the local server. |
| `latency`          | Number  | The network latency to the peer (in milliseconds) |
| `ledger`           | String  | The identifying [hash][Hash] of the peer's most recently closed ledger |
| `load`             | Number  | A measure of the amount of load the peer server is putting on the local server. Larger numbers indicate more load. (The units by which load is measured are not formally defined.) |
| `protocol`         | String  | _(May be omitted)_ The protocol version that the peer is using, if not the same as the local server. |
| `metrics`          | Object  | Details on the amount of data sent to and received from this peer. See the description of the `metrics` object below for details. [New in: rippled 1.4.0][] |
| `public_key`       | String  | _(May be omitted)_ A public key that can be used to verify the integrity of the peer's messages. This is not the same key that is used for validations, but it follows the same format. |
| `sanity`           | String  | _(May be omitted)_ Whether this peer is following the same rules and ledger history as the current server. A value of `insane` probably indicates that the peer is part of a [parallel network](parallel-networks.html). The value `unknown` indicates that the current server is unsure whether the peer is compatible. <!-- STYLE_OVERRIDE: insane --> |
| `status`           | String  | _(May be omitted)_ The most recent status message from the peer. Could be `connecting`, `connected`, `monitoring`, `validating`, or `shutting`. |
| `uptime`           | Number  | The number of seconds that your `rippled` server has been continuously connected to this peer. [New in: rippled 0.30.1][] |
| `version`          | string  | _(May be omitted)_ The `rippled` version number of the peer server |

The `metrics` object contains the following fields:

| `Field`            | Type    | Description                                   |
|:-------------------|:--------|:----------------------------------------------|
| `avg_bps_recv`     | String  | The average bytes per second of data received from this peer. |
| `avg_bps_sent`     | String  | The average bytes per second of data sent to this peer. |
| `total_bytes_recv` | String  | The total number of bytes of data received from this peer. |
| `total_bytes_sent` | String  | The total number of bytes of data sent to this peer. |

**Note:** All of the fields in the `metrics` object are 64-bit unsigned integers serialized to string format so that they do not lose precision in JSON encoding/decoding.

### Possible Errors

* Any of the [universal error types][].

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

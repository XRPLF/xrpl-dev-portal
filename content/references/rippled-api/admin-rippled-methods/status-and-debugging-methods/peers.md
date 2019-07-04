# peers
[[Source]<br>](https://github.com/ripple/rippled/blob/52f298f150fc1530d201d3140c80d3eaf781cb5f/src/ripple/rpc/handlers/Peers.cpp "Source")

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
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "cluster": {},
    "peers": [
      {
        "address": "184.172.237.226:51235",
        "complete_ledgers": "14534883 - 18828973",
        "latency": 117,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 54,
        "public_key": "n9KNYm52mgcUQ7R2RA4kyw9Nk1yc6S35PaiuyqjYsy6UjhCXpw12",
        "uptime": 55036,
        "version": "rippled-0.30.0-hf1"
      },
      {
        "address": "54.186.248.91:51235",
        "complete_ledgers": "18827949 - 18828973",
        "latency": 91,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 62,
        "public_key": "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
        "uptime": 83814,
        "version": "rippled-0.30.1"
      },
      {
        "address": "54.84.21.230:51235",
        "complete_ledgers": "18827949 - 18828973",
        "latency": 202,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 60,
        "public_key": "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
        "uptime": 99625,
        "version": "rippled-0.30.1"
      },
      {
        "address": "72.251.233.162:51235",
        "complete_ledgers": "18827949 - 18828973",
        "latency": 36,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 66,
        "public_key": "n9M8RSk6hrvXZKFQ6CxPbJsjt73xW1xsnjn7G69VAMbE2j4sBQNQ",
        "uptime": 99619,
        "version": "rippled-0.30.1"
      },
      {
        "address": "162.217.98.136:51235",
        "complete_ledgers": "32570 - 18828973",
        "latency": 118,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 69,
        "public_key": "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
        "uptime": 99625,
        "version": "rippled-0.30.1"
      },
      {
        "address": "72.251.233.163:51235",
        "complete_ledgers": "18827949 - 18828973",
        "latency": 51,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 61,
        "public_key": "n94ne2Z5dX8qcJNa8cPtAbtn21gEaCoEduS8TwdGAhi1iLfCUMDm",
        "uptime": 99625,
        "version": "rippled-0.30.1"
      },
      {
        "address": "54.186.73.52:51235",
        "complete_ledgers": "18827949 - 18828973",
        "latency": 72,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 60,
        "public_key": "n9JySgyBVcQKvyDoeRKg7s2Mm6ZcFHk22vUZb3o1HSosWxcj9xPt",
        "uptime": 99625,
        "version": "rippled-0.30.1"
      },
      {
        "address": "72.251.233.165:51235",
        "complete_ledgers": "18827949 - 18828973",
        "latency": 40,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 63,
        "public_key": "n9M77Uc9CSaSFZqt5V7sxPR4kFwbha7hwUFBD5v5kZt2SQjBeoDs",
        "uptime": 99625,
        "version": "rippled-0.30.1"
      },
      {
        "address": "72.251.232.173:51235",
        "complete_ledgers": "32570 - 18828973",
        "latency": 40,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 71,
        "public_key": "n9JveA1hHDGjZECaYC7KM4JP8NXXzNXAxixbzcLTGnrsFZsA9AD1",
        "uptime": 99625,
        "version": "rippled-0.31.0-b6"
      },
      {
        "address": "98.167.120.212:51235",
        "complete_ledgers": "18828845 - 18828973",
        "latency": 99,
        "ledger": "50A2577CE6EB8A92847C443BDA45F5C5F0A22B9C6F4B47DBA0C12BDA75001D01",
        "load": 60,
        "public_key": "n9LDBRoqPYY7RdkNXbX1dqZXVtUKcSqzs2CZPhTH7ymA9X7Xzmpj",
        "uptime": 99625,
        "version": "rippled-0.30.1-rc4"
      }
    ]
  }
}
```

*JSON-RPC*

```
{
   "result" : {
      "cluster" : {},
      "peers" : [
         {
            "address" : "184.172.237.226:51235",
            "complete_ledgers" : "14535005 - 18828957",
            "latency" : 114,
            "ledger" : "80FCB89BC5B90D2B9C2CE33786738809796F04FB9CB1E5EEE768DD9A9C399FB0",
            "load" : 47,
            "public_key" : "n9KNYm52mgcUQ7R2RA4kyw9Nk1yc6S35PaiuyqjYsy6UjhCXpw12",
            "uptime" : 54976,
            "version" : "rippled-0.30.0-hf1"
         },
         {
            "address" : "54.186.248.91:51235",
            "complete_ledgers" : "18827934 - 18828958",
            "latency" : 68,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 56,
            "public_key" : "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
            "uptime" : 83754,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "54.84.21.230:51235",
            "complete_ledgers" : "18827934 - 18828958",
            "latency" : 135,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 54,
            "public_key" : "n9KJb7NMxGySRcjCqh69xEPMUhwJx22qntYYXsnUqYgjsJhNoW7g",
            "uptime" : 99565,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "72.251.233.162:51235",
            "complete_ledgers" : "18827934 - 18828958",
            "latency" : 24,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 61,
            "public_key" : "n9M8RSk6hrvXZKFQ6CxPbJsjt73xW1xsnjn7G69VAMbE2j4sBQNQ",
            "uptime" : 99560,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "162.217.98.136:51235",
            "complete_ledgers" : "32570 - 18828958",
            "latency" : 88,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 55,
            "public_key" : "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
            "uptime" : 99566,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "72.251.233.163:51235",
            "complete_ledgers" : "18827934 - 18828958",
            "latency" : 24,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 56,
            "public_key" : "n94ne2Z5dX8qcJNa8cPtAbtn21gEaCoEduS8TwdGAhi1iLfCUMDm",
            "uptime" : 99566,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "54.186.73.52:51235",
            "complete_ledgers" : "18827934 - 18828958",
            "latency" : 51,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 56,
            "public_key" : "n9JySgyBVcQKvyDoeRKg7s2Mm6ZcFHk22vUZb3o1HSosWxcj9xPt",
            "uptime" : 99566,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "72.251.233.165:51235",
            "complete_ledgers" : "18827934 - 18828958",
            "latency" : 25,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 56,
            "public_key" : "n9M77Uc9CSaSFZqt5V7sxPR4kFwbha7hwUFBD5v5kZt2SQjBeoDs",
            "uptime" : 99566,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "72.251.232.173:51235",
            "complete_ledgers" : "32570 - 18828958",
            "latency" : 24,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 81,
            "public_key" : "n9JveA1hHDGjZECaYC7KM4JP8NXXzNXAxixbzcLTGnrsFZsA9AD1",
            "uptime" : 99566,
            "version" : "rippled-0.31.0-b6"
         },
         {
            "address" : "98.167.120.212:51235",
            "complete_ledgers" : "18828830 - 18828957",
            "latency" : 137,
            "ledger" : "9447480E351221123B1A454356435A66C188D9794B0197A060637E19F074B421",
            "load" : 54,
            "public_key" : "n9LDBRoqPYY7RdkNXbX1dqZXVtUKcSqzs2CZPhTH7ymA9X7Xzmpj",
            "uptime" : 99566,
            "version" : "rippled-0.30.1-rc4"
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
            "address" : "72.251.232.173:51235",
            "complete_ledgers" : "32570 - 18851276",
            "latency" : 22,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 20,
            "public_key" : "n9JveA1hHDGjZECaYC7KM4JP8NXXzNXAxixbzcLTGnrsFZsA9AD1",
            "uptime" : 26,
            "version" : "rippled-0.31.0-b6"
         },
         {
            "address" : "169.53.155.36:51235",
            "complete_ledgers" : "12920801 - 18851275",
            "latency" : 127,
            "load" : 16,
            "public_key" : "n9L42gouyppsmsMXXUdByXnVDUZv1eu6KLZUWUkNHsukzv3pr7po",
            "uptime" : 18,
            "version" : "rippled-0.30.0-hf1"
         },
         {
            "address" : "169.53.155.44:51235",
            "complete_ledgers" : "12920779 - 18851276",
            "latency" : 20,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 49,
            "public_key" : "n94BpoEqEf1PxpAv3Bmyy2WoKHyeMpHPH4tcj6P9NW98zdzEyRhi",
            "uptime" : 50,
            "version" : "rippled-0.30.0-hf1"
         },
         {
            "address" : "192.170.145.77:51235",
            "complete_ledgers" : "32570 - 18851277",
            "latency" : 145,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 29,
            "public_key" : "n9LwcmtjDAJQz4u8DZCMGQ9GXHuMEV4Cf8KpPL9NgqAV2puxdYc2",
            "uptime" : 51,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "162.217.98.136:51235",
            "complete_ledgers" : "32570 - 18851277",
            "latency" : 83,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 30,
            "public_key" : "n944PcXEoZaiEHnwFD92xA4bxsS7jjYb27WcdDQwkHYyk1MWTEsX",
            "uptime" : 50,
            "version" : "rippled-0.30.1"
         },
         {
            "address" : "184.172.237.241:51235",
            "complete_ledgers" : "14153089 - 18851277",
            "latency" : 104,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 29,
            "public_key" : "n9L3LdCTVYUhCKtQtxiHrQ5ocNXVqZFiEJpF5pX9DXahYLrvi5R7",
            "uptime" : 51,
            "version" : "rippled-0.30.0-hf1"
         },
         {
            "address" : "99.110.49.91:51301",
            "complete_ledgers" : "32570 - 18851277",
            "latency" : 152,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 55,
            "public_key" : "n9LGv3xKVqhxq6vcTfmJZhxyhjywsZbvJvpFbZRXzzz5uQ64xTLy",
            "uptime" : 51,
            "version" : "rippled-0.31.0-b6"
         },
         {
            "address" : "169.53.155.45:51235",
            "complete_ledgers" : "12920779 - 18851277",
            "latency" : 15,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 30,
            "public_key" : "n9MRiHyMk43YpqATWeT8Zyu4HJq1btb5oNKmnHTkLJKQg9LQQq3v",
            "uptime" : 51,
            "version" : "rippled-0.30.0-hf1"
         },
         {
            "address" : "54.186.248.91:51235",
            "complete_ledgers" : "18850253 - 18851277",
            "latency" : 63,
            "ledger" : "592C723DDBB1C5119F0D8288894060C83C8C2975A061D7C9971427D6798098F5",
            "load" : 36,
            "public_key" : "n9MT5EjnV912KGuBUqPs4tpdhzMPGcnDBrTuWkD9sWQHJ1kDcUcz",
            "uptime" : 51,
            "version" : "rippled-0.30.1"
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

Each field of the `cluster` object is the public key of that `rippled` server's identifying keypair. (This is the same value that that server returns as `pubkey_node` in the [server_info method][].) The contents of that field are an object with the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `tag`   | String | The display name for this cluster member as defined in the config file. |
| `fee`   | Number | (May be omitted) The load multiplier this cluster member is applying to the [transaction cost](transaction-cost.html) |
| `age`   | Number | The number of seconds since the last cluster report from this cluster member. |

Each member of the `peers` array is a peer object with the following fields:

| `Field`            | Type    | Description                                   |
|:-------------------|:--------|:----------------------------------------------|
| `address`          | String  | The IP address and port where this peer is connected |
| `cluster`          | Boolean | (May be omitted) If `true`, the current server and the peer server are part of the same `rippled` cluster. |
| `name`             | String  | (May be omitted) If the peer is part of the same cluster, this is the display name for that server as defined in the config file. |
| `complete_ledgers` | String  | Range expression indicating the sequence numbers of the ledger versions the peer `rippled` has available |
| `inbound`          | Boolean | (May be omitted) If `true`, the peer is connecting to the local server. |
| `latency`          | Number  | The network latency to the peer (in milliseconds) |
| `ledger`           | String  | The hash of the peer's most recently closed ledger |
| `load`             | Number  | A measure of the amount of load the peer server is putting on the local server. Larger numbers indicate more load. (The units by which load is measured are not formally defined.) |
| `protocol`         | String  | (May be omitted) The protocol version that the peer is using, if not the same as the local server. |
| `public_key`       | String  | (May be omitted) A public key that can be used to verify the integrity of the peer's messages. This is not the same key that is used for validations, but it follows the same format. |
| `sanity`           | String  | (May be omitted) Whether this peer is following the same rules and ledger sequence as the current server. A value of `insane` probably indicates that the peer is part of a parallel network. The value `unknown` indicates that the current server is unsure whether the peer is compatible. <!-- STYLE_OVERRIDE: insane --> |
| `status`           | String  | (May be omitted) The most recent status message from the peer. Could be `connecting`, `connected`, `monitoring`, `validating`, or `shutting`. |
| `uptime`           | Number  | The number of seconds that your `rippled` server has been continuously connected to this peer. [New in: rippled 0.30.1][] |
| `version`          | string  | (May be omitted) The `rippled` version number of the peer server |

### Possible Errors

* Any of the [universal error types][].

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

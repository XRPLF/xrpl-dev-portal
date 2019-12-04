# ledger_request
[[Source]](https://github.com/ripple/rippled/blob/e980e69eca9ea843d200773eb1f43abe3848f1a0/src/ripple/rpc/handlers/LedgerRequest.cpp "Source")

The `ledger_request` command tells server to fetch a specific ledger version from its connected peers. This only works if one of the server's immediately-connected peers has that ledger. You may need to run the command several times to completely fetch a ledger.

*The `ledger_request` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 102,
    "command": "ledger_request",
    "ledger_index": 13800000
}
```

*Commandline*

```
rippled ledger_request 13800000
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`        | Type   | Description                                        |
|:---------------|:-------|:---------------------------------------------------|
| `ledger_index` | Number | _(Optional)_ Retrieve the specified ledger by its [Ledger Index][]. |
| `ledger_hash`  | String | _(Optional)_ Retrieve the specified ledger by its identifying [Hash][]. |

You must provide either `ledger_index` or `ledger_hash` but not both.

### Response Format

The response follows the [standard format][]. However, the request returns a failure response if it does not have the specified ledger _even if it successfully instructed the `rippled` server to start retrieving the ledger_.

**Note:** To retrieve a ledger, the rippled server must have a direct peer with that ledger in its history. If none of the peers have the requested ledger, you can use the [connect method][] or the `fixed_ips` section of the config file to add Ripple's full-history server at `s2.ripple.com` and then make the `ledger_request` request again.

A failure response indicates the status of fetching the ledger. A successful response contains the information for the ledger in a similar format to the [ledger method][].

<!-- MULTICODE_BLOCK_START -->

*Commandline (failure)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "acquiring" : {
         "hash" : "01DDD89B6605E20338B8EEB8EB2B0E0DD2F685A2B164F3790C4D634B5734CC26",
         "have_header" : false,
         "peers" : 2,
         "timeouts" : 0
      },
      "error" : "lgrNotFound",
      "error_code" : 20,
      "error_message" : "acquiring ledger containing requested index",
      "request" : {
         "command" : "ledger_request",
         "ledger_index" : 18851277
      },
      "status" : "error"
   }
}
```

*Commandline (in-progress)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "hash" : "EB68B5B4F6F06BF59B6D7532BCB98BB98E2F10C2435D895217AA0AA7E910FBD5",
      "have_header" : true,
      "have_state" : false,
      "have_transactions" : false,
      "needed_state_hashes" : [
         "C46F7B9E795135447AF24BAF999AB8FC1612A997F6EAAF8B784C226FF0BD8E25",
         "E48F528E4FC2A1DC492C6264B27B420E2285B2A3ECF3A253DB480DA5BFB7F858",
         "B62CD0B2E1277F78BC279FA037F3F747587299B60D23A551C3F63DD137DC0CF8",
         "30014C55701FB8426E496A47B297BEC9E8F5BFA47763CC22DBD9024CC81D39DD",
         "7EB59A853913898FCEA7B701637F33B1054BD36C32A0B910B612EFB9CDFF6334",
         "07ECAD3066D62583883979A2FADAADC8F7D89FA07375843C8A47452639AB2421",
         "97A87E5246AF78463485CB27E08D561E22AAF33D5E2F08FE2FACAE0D05CB5478",
         "50A0525E238629B32324C9F59B4ECBEFE3C21DC726DB9AB3B6758BD1838DFF68",
         "8C541B1ED47C9282E2A28F0B7F3DDFADF06644CAB71B15A3E67D04C5FAFE9BF4",
         "2C6CC536C778D8C0F601E35DA7DD9888C288897E4F603E76357CE2F47E8A7A9F",
         "309E78DEC67D5725476A59E114850556CC693FB6D92092997ADE97E3EFF473CC",
         "8EFF61B6A636AF6B4314CAC0C08F4FED0759E1F782178A822EDE98275E5E4B10",
         "9535645E5D249AC0B6126005B79BB981CBA00286E00154D20A3BCF65743EA3CA",
         "69F5D6FCB41D1E6CEA5ADD42CBD194086B45E957D497DF7AEE62ADAD485660CE",
         "07E93A95DBB0B8A00925DE0DF6D27E41CACC77EF75055A89815006109D82EAD3",
         "7FDF25F660235DCAD649676E3E6729DF920A9B0B4B6A3B090A3C64D7BDE2FB20"
      ],
      "needed_transaction_hashes" : [
         "BA914854F2F5EDFCBD6E3E0B168E5D4CD0FC92927BEE408C6BD38D4F52505A34",
         "AE3A2DB537B01EB33BB3A677242DE52C9AE0A64BD9222EE55E52855276E7EA2A",
         "E145F737B255D93769673CBA6DEBA4F6AC7387A309DAACC72EA5B07ECF03C215",
         "073A118552AA60E1D3C6BE6F65E4AFA01C582D9C41CCC2887244C19D9BFA7741",
         "562DB8580CD3FE19AF5CEA61C2858C10091151B924DBF2AEB7CBB8722E683204",
         "437C0D1C2391057079E9539CF028823D29E6437A965284F6E54CEBF1D25C5D56",
         "1F069486AF5533883609E5C8DB907E97273D9A782DF26F5E5811F1C42ED63A3D",
         "CAA6B7DA68EBA71254C218C81A9EA029A179694BDD0D75A49FB03A7D57BCEE49"
      ],
      "peers" : 6,
      "status" : "success",
      "timeouts" : 1
   }
}
```

*Commandline (success)*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "ledger" : {
         "accepted" : true,
         "account_hash" : "84EBB27D9510AD5B9A3A328201921B3FD418D4A349E85D3DC69E33C7B506407F",
         "close_time" : 486691300,
         "close_time_human" : "2015-Jun-04 00:01:40",
         "close_time_resolution" : 10,
         "closed" : true,
         "hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
         "ledger_hash" : "DCF5D723ECEE1EF56D2B0024CD9BDFF2D8E3DC211BD2B9460165922564ACD863",
         "ledger_index" : "13840000",
         "parent_hash" : "8A3F6FBC62C11DE4538D969F9C7966234635FE6CEB1133DDC37220978F8100A9",
         "seqNum" : "13840000",
         "totalCoins" : "99999022883526403",
         "total_coins" : "99999022883526403",
         "transaction_hash" : "3D759EF3AF1AE2F78716A8CCB2460C3030F82687E54206E883703372B9E1770C"
      },
      "ledger_index" : 13840000,
      "status" : "success"
   }
}

```

<!-- MULTICODE_BLOCK_END -->

The three possible response formats are as follows:

1. When returning a `lgrNotFound` error, the response has a field, `acquiring` with a [Ledger Request Object](#ledger-request-object) indicating the progress of fetching the ledger from the peer-to-peer network.
2. When the response shows the server is currently fetching the ledger, the body of the result is a [Ledger Request Object](#ledger-request-object) indicating the progress of fetching the ledger from the peer-to-peer network.
3. When the ledger is fully available, the response is a representation of the [ledger header](ledger-header.html).

### Ledger Request Object

When the server is in the progress of fetching a ledger, but has not yet finished, the `rippled` server returns a ledger request object indicating its progress towards fetching the ledger. This object has the following fields:

| `Field`                     | Type             | Description                 |
|:----------------------------|:-----------------|:----------------------------|
| `hash`                      | String           | (May be omitted) The [Hash][] of the requested ledger, if the server knows it. |
| `have_header`               | Boolean          | Whether the server has the header section of the requested ledger. |
| `have_state`                | Boolean          | (May be omitted) Whether the server has the [account-state section](ledgers.html#tree-format) of the requested ledger. |
| `have_transactions`         | Boolean          | (May be omitted) Whether the server has the transaction section of the requested ledger. |
| `needed_state_hashes`       | Array of Strings | (May be omitted) Up to 16 hashes of objects in the [state tree](ledgers.html#tree-format) that the server still needs to retrieve. |
| `needed_transaction_hashes` | Array of Strings | (May be omitted) Up to 16 hashes of objects in the transaction tree that the server still needs to retrieve. |
| `peers`                     | Number           | How many peers the server is querying to find this ledger. |
| `timeouts`                  | Number           | Number of times fetching this ledger has timed out so far. |

### Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing. This error can also occur if you specify a ledger index equal or higher than the current in-progress ledger.
* `lgrNotFound` - If the ledger is not yet available. This indicates that the server has started fetching the ledger, although it may fail if none of its connected peers have the requested ledger. (Previously, this error used the code `ledgerNotFound` instead.) [Updated in: rippled 0.30.1][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

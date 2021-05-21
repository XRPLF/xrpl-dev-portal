---
html: response-formatting.html
parent: api-conventions.html
blurb: Standard response format, with examples, for the WebSocket, JSON-RPC, and Commandline interfaces.
---
# Response Formatting

Responses from the `rippled` APIs is formatted slightly differently based on whether the method is called with the WebSocket, JSON-RPC, or Commandline interfaces. The Commandline and JSON-RPC interfaces use the same format because the Commandline interface calls JSON-RPC.

The fields of a successful response include:

| `Field`         | Type     | Description                                     |
|:----------------|:---------|:------------------------------------------------|
| `id`            | (Varies) | (WebSocket only) ID provided in the request that prompted this response |
| `status`        | String   | (WebSocket only) The value `success` indicates the request was successfully received and understood by the server. |
| `result.status` | String   | (JSON-RPC and Commandline) The value `success` indicates the request was successfully received and understood by the server. |
| `type`          | String   | (WebSocket only) The value `response` indicates a successful response to a command. [Asynchronous notifications](subscribe.html) use a different value such as `ledgerClosed` or `transaction`. |
| `result`        | Object   | The result of the query; contents vary depending on the command. |
| `warning`       | String   | _(May be omitted)_ If this field is provided, the value is the string `load`. This means the client is approaching the [rate limiting](rate-limiting.html) threshold where the server will disconnect this client. |
| `warnings`      | Array    | _(May be omitted)_ If this field is provided, it contains one or more **Warnings Objects** with important warnings. For details, see [API Warnings](#api-warnings). [New in: rippled 1.5.0][] |
| `forwarded`     | Boolean  | _(May be omitted)_ If `true`, this request and response have been forwarded from a [Reporting Mode][] server to a P2P Mode server (and back) because the request requires data that is not available in Reporting Mode. The default is `false`. |


## Example Successful Response

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
      "Balance": "27389517749",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 18,
      "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
      "PreviousTxnLgrSeq": 6592159,
      "Sequence": 1400,
      "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
    },
    "ledger_index": 6760970
  }
}
```

*JSON-RPC*

```json
HTTP Status: 200 OK

{
    "result": {
        "account_data": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "ledger_index": 6761012,
        "status": "success"
    }
}
```
*Commandline*

```json
{
    "result": {
        "account_data": {
            "Account": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
            "Balance": "27389517749",
            "Flags": 0,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 18,
            "PreviousTxnID": "B6B410172C0B65575D89E464AF5B99937CC568822929ABF87DA75CBD11911932",
            "PreviousTxnLgrSeq": 6592159,
            "Sequence": 1400,
            "index": "4F83A2CF7E70F77F79A307E6A472BFC2585B806A70833CCD1C26105BAE0D6E05"
        },
        "ledger_index": 6761012,
        "status": "success"
    }
}
```

<!-- MULTICODE_BLOCK_END -->


## API Warnings

When the response contains a `warnings` array, each member of the array represents a separate warning from the server. Each such **Warning Object** contains the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `id`      | Number | A unique numeric code for this warning message.         |
| `message` | String | A human-readable string describing the cause of this message. Do not write software that relies the contents of this message; use the `id` (and `details`, if applicable) to identify the warning instead. |
| `details` | Object | _(May be omitted)_ Additional information about this warning. The contents vary depending on the type of warning. |

The following reference describes all possible warnings.

### 1001. Unsupported amendments have reached majority

Example warning:

```json
"warnings" : [
  {
    "details" : {
      "expected_date" : 864030,
      "expected_date_UTC" : "2000-Jan-11 00:00:30.0000000 UTC"
    },
    "id" : 1001,
    "message" : "One or more unsupported amendments have reached majority. Upgrade to the latest version before they are activated to avoid being amendment blocked."
  }
]
```

This warning indicates that the one or more [amendments](amendments.html) to the XRP Ledger protocol are scheduled to become enabled, but the current server does not have an implementation for those amendments. If those amendments become enabled, the current server will become [amendment blocked](amendments.html#amendment-blocked), so you should [upgrade to the latest `rippled` version](install-rippled.html) as soon as possible.

The server only sends this warning if the client is [connected as an admin](get-started-using-http-websocket-apis.html#admin-access).

This warning includes a `details` field with the following fields:

| Field               | Value  | Description                                   |
|:--------------------|:-------|:----------------------------------------------|
| `expected_date`     | Number | The time that the first unsupported amendment is expected to become enabled, in [seconds since the Ripple Epoch][]. |
| `expected_date_UTC` | String | The timestamp, in UTC, when the first unsupported amendment is expected to become enabled. |

Due to the variation in ledger close times, these times are approximate. It is also possible that the amendment fails to maintain support from >80% of validators until the specified time, and does not become enabled at the expected time. The server will not become amendment blocked so long as the unsupported amendments do not become enabled.


### 1002. This server is amendment blocked

Example warning:

```json
"warnings" : [
  {
    "id" : 1002,
    "message" : "This server is amendment blocked, and must be updated to be able to stay in sync with the network."
  }
]
```

This warning indicates that the server is [amendment blocked](amendments.html#amendment-blocked) and can no longer remain synced with the XRP Ledger.

The server administrator must [upgrade `rippled`](install-rippled.html) to a version that supports the activated amendments.

### 1003. This is a reporting server
[New in: rippled 1.7.0][]

Example warning:

```json
"warnings" : [
  {
    "id" : 1003,
    "message" : "This is a reporting server. The default behavior of a reporting server is to only return validated data. If you are looking for not yet validated data, include \"ledger_index : current\" in your request, which will cause this server to forward the request to a p2p node. If the forward is successful the response will include \"forwarded\" : \"true\""
  }
]
```

This warning indicates that the server answering the request is running [Reporting Mode][]. Certain API methods are not available or behave differently because Reporting Mode does not connect to the peer-to-peer network and does not track ledger data that has not yet been validated.

It is generally safe to ignore this warning.

**Caution:** If you request ledger data without explicitly [specifying a ledger version][Specifying Ledgers], Reporting Mode uses the latest validated ledger by default instead of the current in-progress ledger.


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
    - [Amendments](amendments.html)
        - [Known Amendments](known-amendments.html)
- **Tutorials:**
    - [Get Started with XRP Ledger APIs](get-started-using-http-websocket-apis.html)
    - [Install and Update `rippled`](install-rippled.html)
- **References:**
    - [feature method][]
    - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

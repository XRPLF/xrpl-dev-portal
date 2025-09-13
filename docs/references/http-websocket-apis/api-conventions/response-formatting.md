---
seo:
    description: Standard response format, with examples, for the WebSocket, JSON-RPC, and Commandline interfaces.
---
# Response Formatting

Responses are formatted slightly differently based on whether the method is called with the WebSocket, JSON-RPC, or Commandline interfaces. The Commandline and JSON-RPC interfaces use the same format because the Commandline interface calls JSON-RPC.

The fields of a successful response include:

{% tabs %}
{% tab label="WebSocket" %}
| Field           | Type     | Required? | Description |
|:----------------|:---------|:----------|-------------|
| `status`        | String   | Yes       | The value `success` indicates the request was successfully received and understood by the server. Some [client libraries](../../client-libraries.md) omit this field on success. |
| `type`          | String   | Yes       | The value `response` indicates a direct response to an API request. [Asynchronous notifications](../public-api-methods/subscription-methods/subscribe.md) use a different value such as `ledgerClosed` or `transaction`. |
| `result`        | Object   | Yes       | The result of the query; contents vary depending on the API method. |
| `id`            | (Varies) | No        | Arbitrary ID provided by the request that prompted this response. Omitted if the request didn't specify an ID. |
| `warning`       | String   | No        | If this field is provided, the value is the string `load`. This means the client is approaching the [rate limiting](rate-limiting.md) threshold where the server will disconnect this client. <!-- STYLE_OVERRIDE: will --> |
| `warnings`      | Array    | No        | If this field is provided, it contains one or more **Warnings Objects** with important warnings. For details, see [API Warnings](#api-warnings). |
| `forwarded`     | Boolean  | No        | If `true`, this request and response have been forwarded from a Clio server to a P2P Mode server (and back) because the request requires data that is not available from Clio. The default is `false`. |
{% /tab %}
{% tab label="JSON-RPC" %}
| Field           | Type     | Required? | Description |
|:----------------|:---------|:----------|-------------|
| `result`        | Object   | Yes       | The result of the query; contents vary depending on the command. |
| `result.status` | String   | Yes       | The value `success` indicates the request was successfully received and understood by the server. Some [client libraries](../../client-libraries.md) omit this field on success. |
| `warning`       | String   | No        | If this field is provided, the value is the string `load`. This means the client is approaching the [rate limiting](rate-limiting.md) threshold where the server will disconnect this client. <!-- STYLE_OVERRIDE: will --> |
| `warnings`      | Array    | No        | If this field is provided, it contains one or more **Warnings Objects** with important warnings. For details, see [API Warnings](#api-warnings). |
| `forwarded`     | Boolean  | No        | If `true`, this request and response have been forwarded from a Clio server to a P2P Mode server (and back) because the request requires data that is not available from Clio. The default is `false`. |
{% /tab %}
{% /tabs %}


## Example Successful Response

{% tabs %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% tab label="Commandline" %}
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
{% /tab %}

{% /tabs %}


## API Warnings

When the response contains a `warnings` array, each member of the array represents a separate warning from the server. Each such **Warning Object** contains the following fields:

| Field     | Type   | Description                                             |
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

This warning indicates that the one or more [amendments](../../../concepts/networks-and-servers/amendments.md) to the XRP Ledger protocol are scheduled to become enabled, but the current server does not have an implementation for those amendments. If those amendments become enabled, the current server will become [amendment blocked](../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers), so you should [upgrade to the latest `rippled` version](../../../infrastructure/installation/index.md) as soon as possible. <!-- STYLE_OVERRIDE: will -->

The server only sends this warning if the client is [connected as an admin](../../../tutorials/http-websocket-apis/build-apps/get-started.md#admin-access).

This warning includes a `details` field with the following fields:

| Field               | Type   | Description                                   |
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

This warning indicates that the server is [amendment blocked](../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers) and can no longer remain synced with the XRP Ledger.

The server administrator must [upgrade `rippled`](../../../infrastructure/installation/index.md) to a version that supports the activated amendments.

### 2001. This is a clio server

Example warning:

```json
"warnings": [
  {
    "id": 2001,
    "message": "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request"
  }
]
```

This warning indicates that the server answering the request a Clio server, which does not have direct access to the peer-to-peer network. Certain API methods behave differently or may have additional information, and requests that require non-validated data are forwarded to a peer-to-peer server.

It is generally safe to ignore this warning.

{% admonition type="warning" name="Caution" %}If you request ledger data without explicitly [specifying a ledger version][Specifying Ledgers], Clio uses the latest validated ledger by default instead of the current in-progress ledger.{% /admonition %}


## See Also

- [Request Formatting](request-formatting.md)
- [Error Formatting](error-formatting.md) for unsuccessful API responses.
- **Concepts:**
    - [The `rippled` Server](../../../concepts/networks-and-servers/index.md)
    - [Consensus](../../../concepts/consensus-protocol/index.md)
    - [Amendments](../../../concepts/networks-and-servers/amendments.md)
        - [Known Amendments](/resources/known-amendments.md)
- **Tutorials:**
    - [Get Started with XRP Ledger APIs](../../../tutorials/http-websocket-apis/build-apps/get-started.md)
    - [Install and Update `rippled`](../../../infrastructure/installation/index.md)
- **References:**
    - [feature method][]
    - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

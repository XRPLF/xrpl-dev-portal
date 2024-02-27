---
html: tx.html
parent: transaction-methods.html
seo:
    description: Retrieve info about a transaction from all the ledgers on hand.
labels:
  - Transaction Sending
  - Payments
---
# tx

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Tx.cpp "Source")

The `tx` method retrieves information on a single [transaction](../../../protocol/transactions/index.md), by its [identifying hash][] or its [CTID](../../api-conventions/ctid.md).

## Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket (Hash)" %}
```json
{
  "id": 1,
  "command": "tx",
  "transaction": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
  "binary": false
}
```
{% /tab %}

{% tab label="WebSocket (CTID)" %}
```json
{
  "id": "CTID example",
  "command": "tx",
  "ctid": "C005523E00000000",
  "binary": false
}
```
{% /tab %}

{% tab label="JSON-RPC (Hash)" %}
```json
{
    "method": "tx",
    "params": [
        {
            "transaction": "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
            "binary": false
        }
    ]
}
```
{% /tab %}

{% tab label="JSON-RPC (CTID)" %}
```json
{
    "method": "tx",
    "params": [
        {
            "ctid": "C005523E00000000",
            "binary": false
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: tx transaction [binary]
rippled tx C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9 false
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#tx)

The request includes the following parameters:

| Field         | Type    | Required? | Description                            |
|:--------------|:--------|:----------|----------------------------------------|
| `ctid`        | String  | No        | The [compact transaction identifier](../../api-conventions/ctid.md) of the transaction to look up. Must use uppercase hexadecimal only. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}New in: rippled 1.12.0{% /badge %} _(Not supported in Clio v2.0 and earlier)_ |
| `transaction` | String  | No        | The 256-bit hash of the transaction to look up, as hexadecimal. |
| `binary`      | Boolean | No        | If `true`, return transaction data and metadata as binary [serialized](../../../protocol/binary-format.md) to hexadecimal strings. If `false`, return transaction data and metadata as JSON. The default is `false`. |
| `min_ledger`  | Number  | No        | Use this with `max_ledger` to specify a range of up to 1000 [ledger indexes][ledger index], starting with this ledger (inclusive). If the server [cannot find the transaction](#not-found-response), it confirms whether it was able to search all the ledgers in this range. |
| `max_ledger`  | Number  | No        | Use this with `min_ledger` to specify a range of up to 1000 [ledger indexes][ledger index], ending with this ledger (inclusive). If the server [cannot find the transaction](#not-found-response), it confirms whether it was able to search all the ledgers in the requested range. |

You must provide _either_ `ctid` or `transaction`, but not both.

**Caution:** This command may successfully find the transaction even if it is included in a ledger _outside_ the range of `min_ledger` to `max_ledger`.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket (Hash)" %}
{% code-snippet file="/_api-examples/tx/ws-response-hash.json" language="json" /%}
{% /tab %}

{% tab label="WebSocket (CTID)" %}
{% code-snippet file="/_api-examples/tx/ws-response-ctid.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC (Hash)" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response-hash.json" language="json" /%}
{% /tab %}

{% tab label="JSON-RPC (CTID)" %}
{% code-snippet file="/_api-examples/tx/jsonrpc-response-ctid.json" language="json" /%}
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
      "Fee" : "12",
      "Flags" : 0,
      "LastLedgerSequence" : 56865248,
      "OfferSequence" : 5037708,
      "Sequence" : 5037710,
      "SigningPubKey" : "03B51A3EDF70E4098DA7FB053A01C5A6A0A163A30ED1445F14F87C7C3295FCB3BE",
      "TakerGets" : "15000000000",
      "TakerPays" : {
         "currency" : "CNY",
         "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
         "value" : "20160.75"
      },
      "TransactionType" : "OfferCreate",
      "TxnSignature" : "3045022100A5023A0E64923616FCDB6D664F569644C7C9D1895772F986CD6B981B515B02A00220530C973E9A8395BC6FE2484948D2751F6B030FC7FB8575D1BFB406368AD554D9",
      "date" : 648248020,
      "hash" : "C53ECF838647FA5A4C780377025FEC7999AB4182590510CA461444B207AB74A9",
      "inLedger" : 56865245,
      "ledger_index" : 56865245,
      "meta" : {
         "AffectedNodes" : [
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "ExchangeRate" : "4F04C66806CF7400",
                     "Flags" : 0,
                     "RootIndex" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
                     "TakerGetsCurrency" : "0000000000000000000000000000000000000000",
                     "TakerGetsIssuer" : "0000000000000000000000000000000000000000",
                     "TakerPaysCurrency" : "000000000000000000000000434E590000000000",
                     "TakerPaysIssuer" : "CED6E99370D5C00EF4EBF72567DA99F5661BFB3A"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "Balance" : "10404767991",
                     "Flags" : 0,
                     "OwnerCount" : 3,
                     "Sequence" : 5037711
                  },
                  "LedgerEntryType" : "AccountRoot",
                  "LedgerIndex" : "1DECD9844E95FFBA273F1B94BA0BF2564DDF69F2804497A6D7837B52050174A2",
                  "PreviousFields" : {
                     "Balance" : "10404768003",
                     "Sequence" : 5037710
                  },
                  "PreviousTxnID" : "4DC47B246B5EB9CCE92ABA8C482479E3BF1F946CABBEF74CA4DE36521D5F9008",
                  "PreviousTxnLgrSeq" : 56865244
               }
            },
            {
               "DeletedNode" : {
                  "FinalFields" : {
                     "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "BookDirectory" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
                     "BookNode" : "0000000000000000",
                     "Flags" : 0,
                     "OwnerNode" : "0000000000000000",
                     "PreviousTxnID" : "8F5FF57B404827F12BDA7561876A13C3E3B3095CBF75334DBFB5F227391A660C",
                     "PreviousTxnLgrSeq" : 56865244,
                     "Sequence" : 5037708,
                     "TakerGets" : "15000000000",
                     "TakerPays" : {
                        "currency" : "CNY",
                        "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                        "value" : "20160.75"
                     }
                  },
                  "LedgerEntryType" : "Offer",
                  "LedgerIndex" : "26AAE6CA8D29E28A47C92ADF22D5D96A0216F0551E16936856DDC8CB1AAEE93B"
               }
            },
            {
               "ModifiedNode" : {
                  "FinalFields" : {
                     "Flags" : 0,
                     "IndexNext" : "0000000000000000",
                     "IndexPrevious" : "0000000000000000",
                     "Owner" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "RootIndex" : "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
                  },
                  "LedgerEntryType" : "DirectoryNode",
                  "LedgerIndex" : "47FAF5D102D8CE655574F440CDB97AC67C5A11068BB3759E87C2B9745EE94548"
               }
            },
            {
               "CreatedNode" : {
                  "LedgerEntryType" : "Offer",
                  "LedgerIndex" : "8BAEE3C7DE04A568E96007420FA11ABD0BC9AE44D35932BB5640E9C3FB46BC9B",
                  "NewFields" : {
                     "Account" : "rhhh49pFH96roGyuC4E5P4CHaNjS1k8gzM",
                     "BookDirectory" : "02BAAC1E67C1CE0E96F0FA2E8061020536CEDD043FEB0FF54F04C66806CF7400",
                     "Sequence" : 5037710,
                     "TakerGets" : "15000000000",
                     "TakerPays" : {
                        "currency" : "CNY",
                        "issuer" : "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y",
                        "value" : "20160.75"
                     }
                  }
               }
            }
         ],
         "TransactionIndex" : 0,
         "TransactionResult" : "tesSUCCESS"
      },
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the fields of the [Transaction object](../../../protocol/transactions/index.md) as well as the following additional fields:

| `Field`        | Type                             | Description              |
|:---------------|:---------------------------------|:-------------------------|
| `ctid`         | String                           | The transaction's [compact transaction identifier](../../api-conventions/ctid.md). {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.12.0" %}New in: rippled 1.12.0{% /badge %} _(Not supported in Clio v2.0 and earlier.)_ |
| `date`         | Number                           | The [close time](../../../../concepts/ledgers/ledger-close-times.md) of the ledger in which the transaction was applied, in [seconds since the Ripple Epoch][]. |
| `hash`         | String                           | The unique [identifying hash][] of the transaction |
| `inLedger`     | Number                           | _(Deprecated)_ Alias for `ledger_index`. |
| `ledger_index` | Number                           | The [ledger index][] of the ledger that includes this transaction. |
| `meta`         | Object (JSON) or String (binary) | [Transaction metadata](../../../protocol/transactions/metadata.md), which describes the results of the transaction. |
| `validated`    | Boolean                          | If `true`, this data comes from a validated ledger version; if omitted or set to `false`, this data is not final. |
| (Various)      | (Various)                        | Other fields from the [Transaction object](../../../protocol/transactions/index.md) |


### Not Found Response

If the server does not find the transaction, it returns a `txnNotFound` error, which could mean two things:

- The transaction has not been included in any ledger version, and has not been executed.
- The transaction was included in a ledger version that the server does not have available.

This means that a `txnNotFound` on its own is not enough to know the [final outcome of a transaction](../../../../concepts/transactions/finality-of-results/index.md).

To further narrow down the possibilities, you can provide a range of ledgers to search using the `min_ledger` and `max_ledger` fields in the request. If you provide **both** of those fields, the `txnNotFound` response includes the following field:

| Field          | Type      | Description                              |
|:---------------|:----------|:-----------------------------------------|
| `searched_all` | Boolean   | _(Omitted unless the request provided `min_ledger` and `max_ledger`)_ If `true`, the server was able to search all of the specified ledger versions, and the transaction was in none of them. If `false`, the server did not have all of the specified ledger versions available, so it is not sure if one of them might contain the transaction. |

An example of a `txnNotFound` response that fully searched a requested range of ledgers:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "error": "txnNotFound",
  "error_code": 29,
  "error_message": "Transaction not found.",
  "id": 1,
  "request": {
    "binary": false,
    "command": "tx",
    "id": 1,
    "max_ledger": 54368673,
    "min_ledger": 54368573,
    "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
  },
  "searched_all": true,
  "status": "error",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "error": "txnNotFound",
    "error_code": 29,
    "error_message": "Transaction not found.",
    "request": {
      "binary": false,
      "command": "tx",
      "max_ledger": 54368673,
      "min_ledger": 54368573,
      "transaction": "E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7"
    },
    "searched_all": true,
    "status": "error"
  }
}
```
{% /tab %}

{% /tabs %}

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `txnNotFound` - Either the transaction does not exist, or it was part of an ledger version that `rippled` does not have available.
* `excessiveLgrRange` - The `min_ledger` and `max_ledger` fields of the request are more than 1000 apart.
* `invalidLgrRange` - The specified `min_ledger` is larger than the `max_ledger`, or one of those parameters is not a valid ledger index.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

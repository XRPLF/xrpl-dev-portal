---
html: account_info.html
parent: account-methods.html
blurb: Get basic data about an account.
labels:
  - Accounts
  - XRP
---
# account_info
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/AccountInfo.cpp "Source")

The `account_info` command retrieves information about an account, its activity, and its XRP balance. All information retrieved is relative to a particular version of the ledger.

## Request Format

An example of an account_info request:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "account_info",
  "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
  "ledger_index": "current",
  "queue": true
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "account_info",
    "params": [
        {
            "account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "ledger_index": "current",
            "queue": true
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: account_info account [ledger_index|ledger_hash]
rippled account_info rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn validated
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#account_info)

The request contains the following parameters:

| `Field`        | Type                 | Required? | Description |
|:---------------|:---------------------|:----------|-------------|
| `account`      | String - [Address](../../../protocol/data-types/basic-data-types.md#addresses) | Yes       | The account to look up. [Updated in: rippled 1.11.0](https://github.com/XRPLF/rippled/releases/tag/1.11.0 "BADGE_BLUE") |
| `ledger_hash`  | String               | No        | A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers](../../../protocol/data-types/basic-data-types.md#specifying-ledgers)) |
| `ledger_index` | Number or String     | No        | The [ledger index](../../../protocol/data-types/basic-data-types.md#ledger-index) of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers](../../../protocol/data-types/basic-data-types.md#specifying-ledgers)) |
| `queue`        | Boolean              | No        | If `true`, return stats about [queued transactions](../../../../concepts/transactions/transaction-queue.md) sent by this account. Can only be used when querying for the data from the current open ledger. Not available from servers in [Reporting Mode](../../../../concepts/networks-and-servers/rippled-server-modes.md#reporting-mode). |
| `signer_lists` | Boolean              | No        | If `true`, return any [SignerList objects](../../../protocol/ledger-data/ledger-entry-types/signerlist.md) associated with this account. |

The following fields are deprecated and should not be provided: `ident`, `ledger`, `strict`.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 5,
    "status": "success",
    "type": "response",
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "validated": false
    }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "account_data": {
            "Account": "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
            "Balance": "999999999960",
            "Flags": 8388608,
            "LedgerEntryType": "AccountRoot",
            "OwnerCount": 0,
            "PreviousTxnID": "4294BEBE5B569A18C0A2702387C9B1E7146DC3A5850C1E87204951C6FDAA4C42",
            "PreviousTxnLgrSeq": 3,
            "Sequence": 6,
            "index": "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
        },
        "ledger_current_index": 4,
        "queue_data": {
            "auth_change_queued": true,
            "highest_sequence": 10,
            "lowest_sequence": 6,
            "max_spend_drops_total": "500",
            "transactions": [
                {
                    "auth_change": false,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 6
                },
                ... (trimmed for length) ...
                {
                    "LastLedgerSequence": 10,
                    "auth_change": true,
                    "fee": "100",
                    "fee_level": "2560",
                    "max_spend_drops": "100",
                    "seq": 10
                }
            ],
            "txn_count": 5
        },
        "status": "success",
        "validated": false
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "account_data" : {
         "Account" : "rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn",
         "Balance" : "9986",
         "Flags" : 1114112,
         "LedgerEntryType" : "AccountRoot",
         "OwnerCount" : 0,
         "PreviousTxnID" : "0705FE3F52057924C288296EF0EBF668E0C1A3646FBA8FAF9B73DCC0A797B4B2",
         "PreviousTxnLgrSeq" : 51948740,
         "RegularKey" : "rhLkGGNZdjSpnHJw4XAFw1Jy7PD8TqxoET",
         "Sequence" : 192220,
         "index" : "92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F"
      },
      "ledger_hash" : "8169428EDF7F046F817CE44F5F1DF23AD9FAEFFA2CBA7645C3254D66AA79B46E",
      "ledger_index" : 56843712,
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format](../../api-conventions/response-formatting.md), with the result containing the requested account, its data, and a ledger to which it applies, as the following fields:

| `Field`                | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `account_data`         | Object  | The [AccountRoot ledger object](../../../protocol/ledger-data/ledger-entry-types/accountroot.md) with this account's information, as stored in the ledger. |
| `account_flags`        | Object  | The account's flag statuses (see below), based on the `Flags` field of the account. [New in: rippled 1.11.0](https://github.com/XRPLF/rippled/releases/tag/1.11.0 "BADGE_BLUE") |
| `signer_lists`         | Array   | _(Omitted unless the request specified `signer_lists` and at least one SignerList is associated with the account.)_ Array of [SignerList ledger objects](../../../protocol/ledger-data/ledger-entry-types/signerlist.md) associated with this account for [Multi-Signing](../../../../concepts/accounts/multi-signing.md). Since an account can own at most one SignerList, this array must have exactly one member if it is present. **Quirk:** In [API version 1](https://github.com/xrplf/rippled/blob/develop/API-CHANGELOG.md#v1-account_info-response), this field is nested under `account_data`. For this method, [Clio](https://github.com/XRPLF/clio) implements the API version 2 behavior where is field is **not** nested under `account_data`. |
| `ledger_current_index` | Integer | _(Omitted if `ledger_index` is provided instead)_ The [ledger index](../../../protocol/data-types/basic-data-types.md#ledger-index) of the current in-progress ledger, which was used when retrieving this information. |
| `ledger_index`         | Integer | _(Omitted if `ledger_current_index` is provided instead)_ The [ledger index](../../../protocol/data-types/basic-data-types.md#ledger-index) of the ledger version used when retrieving this information. The information does not contain any changes from ledger versions newer than this one. |
| `queue_data`           | Object  | _(Omitted unless `queue` specified as `true` and querying the current open ledger.)_ Information about [queued transactions](../../../../concepts/transactions/transaction-cost.md#queued-transactions) sent by this account. This information describes the state of the local `rippled` server, which may be different from other servers in the [peer-to-peer XRP Ledger network](../../../../concepts/networks-and-servers/peer-protocol.md). Some fields may be omitted because the values are calculated "lazily" by the queuing mechanism. |
| `validated`            | Boolean | True if this data is from a validated ledger version; if omitted or set to false, this data is not final. [New in: rippled 0.26.0](https://github.com/XRPLF/rippled/releases/tag/0.26.0 "BADGE_BLUE") |

The `account_flags` field contains the following nested fields:

| `Field`                | Type    | Description                               |
|:-----------------------|:--------|:------------------------------------------|
| `defaultRipple`        | Boolean | If `true`, the account allows [rippling](../../../../concepts/tokens/fungible-tokens/rippling.md) on its trust lines by default. |
| `depositAuth`          | Boolean | If `true`, the account is using [Deposit Authorization](../../../../concepts/accounts/depositauth.md) and does not accept any payments from unknown parties. |
| `disableMasterKey`     | Boolean | If `true`, the account's [master key pair](../../../../concepts/accounts/cryptographic-keys.md) is disabled. |
| `disallowIncomingCheck` | Boolean | If `true`, the account does not allow others to send [Checks](../../../../concepts/payment-types/checks.md) to it. _(Requires the [DisallowIncoming amendment](../../../../resources/known-amendments.md#disallowincoming))_ |
| `disallowIncomingNFTokenOffer` | Boolean | If `true`, the account does not allow others to make [NFT buy or sell offers](../../../../concepts/tokens/nfts/trading.md) to it. _(Requires the [DisallowIncoming amendment](../../../../resources/known-amendments.md#disallowincoming))_ |
| `disallowIncomingPayChan` | Boolean | If `true`, the account does not allow others to make [Payment Channels](../../../../concepts/payment-types/payment-channels.md) to it. _(Requires the [DisallowIncoming amendment](../../../../resources/known-amendments.md#disallowincoming))_ |
| `disallowIncomingTrustline` | Boolean | If `true`, the account does not allow others to make [trust lines](../../../../concepts/tokens/fungible-tokens/index.md) to it. _(Requires the [DisallowIncoming amendment](../../../../resources/known-amendments.md#disallowincoming))_ |
| `disallowIncomingXRP`  | Boolean | If `true`, the account does not want to receive XRP from others. (This is advisory, and not enforced at a protocol level.) |
| `globalFreeze`         | Boolean | If `true`, all tokens issued by the account are currently frozen. |
| `noFreeze`             | Boolean | If `true`, the account has permanently given up the abilities to freeze individual trust lines or end a global freeze. See [No Freeze](../../../../concepts/tokens/fungible-tokens/freezes.md#no-freeze) for details. |
| `passwordSpent`        | Boolean | If `false`, the account can send a special [key reset transaction](../../../../concepts/transactions/transaction-cost.md#key-reset-transaction) with a transaction cost of 0. The protocol turns this flag on and off automatically; it is not controlled by a user-facing setting. |
| `requireAuthorization` | Boolean | If `true`, the account is using [Authorized Trust Lines](../../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md) to limit who can hold the tokens it issues. |
| `requireDestinationTag` | Boolean | If `true`, the account [requires a destination tag](../../../../tutorials/manage-account-settings/require-destination-tags.md) on all payments it receives. |

The `queue_data` field, if present, contains the following nested fields:

| `Field`                 | Type    | Description                              |
|:------------------------|:--------|:-----------------------------------------|
| `txn_count`             | Integer | Number of queued transactions from this address. |
| `auth_change_queued`    | Boolean | (May be omitted) Whether a transaction in the queue changes this address's [ways of authorizing transactions](../../../../concepts/transactions/index.md#authorizing-transactions). If `true`, this address can queue no further transactions until that transaction has been executed or dropped from the queue. |
| `lowest_sequence`       | Integer | (May be omitted) The lowest [Sequence Number](../../../protocol/data-types/basic-data-types.md#account-sequence) among transactions queued by this address. |
| `highest_sequence`      | Integer | (May be omitted) The highest [Sequence Number](../../../protocol/data-types/basic-data-types.md#account-sequence) among transactions queued by this address. |
| `max_spend_drops_total` | String  | (May be omitted) Integer amount of [drops of XRP](../../../protocol/data-types/basic-data-types.md#specifying-currency-amounts) that could be debited from this address if every transaction in the queue consumes the maximum amount of XRP possible. |
| `transactions`          | Array   | (May be omitted) Information about each queued transaction from this address. |

Each object in the `transactions` array of `queue_data`, if present, may contain any or all of the following fields:

| `Field`           | Type    | Description                                    |
|:------------------|:--------|:-----------------------------------------------|
| `auth_change`     | Boolean | Whether this transaction changes this address's [ways of authorizing transactions](../../../../concepts/transactions/index.md#authorizing-transactions). |
| `fee`             | String  | The [Transaction Cost](../../../../concepts/transactions/transaction-cost.md) of this transaction, in [drops of XRP](../../../protocol/data-types/basic-data-types.md#specifying-currency-amounts). |
| `fee_level`       | String  | The transaction cost of this transaction, relative to the minimum cost for this type of transaction, in [fee levels][]. |
| `max_spend_drops` | String  | The maximum amount of [XRP, in drops](../../../protocol/data-types/basic-data-types.md#specifying-currency-amounts), this transaction could send or destroy. |
| `seq`             | Integer | The [Sequence Number](../../../protocol/data-types/basic-data-types.md#account-sequence) of this transaction.   |

## Possible Errors

* Any of the [universal error types](../../api-conventions/error-formatting.md#universal-errors).
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing. For example, the request specified `queue` as `true` but specified a `ledger_index` that is not the current open ledger.
* `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

[fee levels]: ../../../../concepts/transactions/transaction-cost.md#fee-levels

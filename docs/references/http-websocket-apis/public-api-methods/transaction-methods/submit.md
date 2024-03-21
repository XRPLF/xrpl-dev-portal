---
html: submit.html
parent: transaction-methods.html
seo:
    description: Send a transaction to the network.
labels:
  - Transaction Sending
  - Payments
---
# submit
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Submit.cpp "Source")

The `submit` method applies a [transaction](../../../protocol/transactions/index.md) and sends it to the network to be confirmed and included in future ledgers.

This command has two modes:

* Submit-only mode takes a signed, serialized transaction as a binary blob, and submits it to the network as-is. Since signed transaction objects are immutable, no part of the transaction can be modified or automatically filled in after submission.
* Sign-and-submit mode takes a JSON-formatted Transaction object, completes and signs the transaction in the same manner as the [sign method][], and then submits the signed transaction. We recommend only using this mode for testing and development.

To send a transaction as robustly as possible, you should construct and [sign][sign method] it in advance, persist it somewhere that you can access even after a power outage, then `submit` it as a `tx_blob`. After submission, monitor the network with the [tx method][] command to see if the transaction was successfully applied; if a restart or other problem occurs, you can safely re-submit the `tx_blob` transaction: it won't be applied twice since it has the same sequence number as the old transaction.

## Submit-Only Mode

A submit-only request includes the following parameters:

| `Field`     | Type    | Required? | Description                                          |
|:------------|:--------|:----------|:-----------------------------------------------------|
| `tx_blob`   | String  | Yes       | Hex representation of the signed transaction to submit. This can be a [multi-signed transaction](../../../../concepts/accounts/multi-signing.md). |
| `fail_hard` | Boolean | No        | If `true`, and the transaction fails locally, do not retry or relay the transaction to other servers. The default is `false`. |

### Request Format

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 3,
    "command": "submit",
    "tx_blob": "1200002280000000240000001E61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000B732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210095D23D8AF107DF50651F266259CC7139D0CD0C64ABBA3A958156352A0D95A21E02207FCF9B77D7510380E49FF250C21B57169E14E9B4ACFD314CEDC79DDD0A38B8A681144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "submit",
    "params": [
        {
            "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: submit tx_blob
submit 1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#submit)


## Sign-and-Submit Mode

This mode signs a transaction and immediately submits it. This mode is intended to be used for testing. You cannot use this mode for [multi-signed transactions](../../../../concepts/accounts/multi-signing.md).

_By default, sign-and-submit mode is [admin-only](../../admin-api-methods/index.md)._ It can be used as a public method if the server has [enabled public signing](../../../../infrastructure/configuration/enable-public-signing.md).

You can provide the secret key used to sign the transaction in the following ways:

* Provide a `secret` value and omit the `key_type` field. This value can be formatted as an XRP Ledger [base58][] seed, RFC-1751, hexadecimal, or as a string passphrase. (secp256k1 keys only)
* Provide a `key_type` value and exactly one of `seed`, `seed_hex`, or `passphrase`. Omit the `secret` field. (Not supported by the commandline syntax.)

The request includes the following parameters:

| `Field`        | Type    | Description                                       |
|:---------------|:--------|:--------------------------------------------------|
| `tx_json`      | Object  | [Transaction definition](../../../protocol/transactions/index.md) in JSON format, optionally omitting any auto-fillable fields. |
| `secret`       | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. Cannot be used with `key_type`, `seed`, `seed_hex`, or `passphrase`. |
| `seed`         | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Must be in the XRP Ledger's [base58][] format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed_hex`, or `passphrase`. |
| `seed_hex`     | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Must be in hexadecimal format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `passphrase`. |
| `passphrase`   | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it, as a string passphrase. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `seed_hex`. |
| `key_type`     | String  | _(Optional)_ Type of cryptographic key provided in this request. Valid types are `secp256k1` or `ed25519`. Defaults to `secp256k1`. Cannot be used with `secret`. **Caution:** Ed25519 support is experimental. |
| `fail_hard`    | Boolean | _(Optional)_ If `true`, and the transaction fails locally, do not retry or relay the transaction to other servers. The default is `false`. {% badge href="https://github.com/XRPLF/rippled/releases/tag/1.5.0" %}Updated in: rippled 1.5.0{% /badge %} |
| `offline`      | Boolean | _(Optional)_ If `true`, when constructing the transaction, do not try to automatically fill in or validate values. The default is `false`. |
| `build_path`   | Boolean | _(Optional)_ If this field is provided, the server [auto-fills](../../../protocol/transactions/common-fields.md#auto-fillable-fields) the `Paths` field of a [Payment transaction][] before signing. You must omit this field if the transaction is a [direct XRP payment](../../../../concepts/payment-types/direct-xrp-payments.md) or if it is not a Payment-type transaction. **Caution:** The server looks for the presence or absence of this field, not its value. This behavior may change. ([Issue #3272](https://github.com/XRPLF/rippled/issues/3272)) |
| `fee_mult_max` | Integer | _(Optional)_ Sign-and-submit fails with the error `rpcHIGH_FEE` if the [auto-filled `Fee` value](../../../protocol/transactions/common-fields.md#auto-fillable-fields) would be greater than the [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#special-transaction-costs) × `fee_mult_max` ÷ `fee_div_max`. This field has no effect if you explicitly specify the `Fee` field of the transaction. The default is `10`. |
| `fee_div_max`  | Integer | _(Optional)_ Sign-and-submit fails with the error `rpcHIGH_FEE` if the [auto-filled `Fee` value](../../../protocol/transactions/common-fields.md#auto-fillable-fields) would be greater than the [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#special-transaction-costs) × `fee_mult_max` ÷ `fee_div_max`. This field has no effect if you explicitly specify the `Fee` field of the transaction. The default is `1`. |

See the [sign method][] for detailed information on how the server automatically fills in certain fields.

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "submit",
  "tx_json" : {
      "TransactionType" : "Payment",
      "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Amount" : {
         "currency" : "USD",
         "value" : "1",
         "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
      }
   },
   "secret" : "s████████████████████████████",
   "offline": false,
   "fee_mult_max": 1000
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "submit",
    "params": [
        {
            "offline": false,
            "secret": "s████████████████████████████",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Amount": {
                    "currency": "USD",
                    "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                    "value": "1"
                },
                "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
                "TransactionType": "Payment"
            },
            "fee_mult_max": 1000
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: submit secret json [offline]
rippled submit s████████████████████████████ '{"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Amount": { "currency": "USD", "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "value": "1" }, "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "TransactionType": "Payment", "Fee": "10000"}'
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#submit)

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "accepted" : true,
    "account_sequence_available" : 362,
    "account_sequence_next" : 362,
    "applied" : true,
    "broadcast" : true,
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
    "kept" : true,
    "open_ledger_cost": "10",
    "queued" : false,
    "tx_blob": "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F858081144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
    "tx_json": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "Amount": {
        "currency": "USD",
        "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "value": "1"
      },
      "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "Fee": "10000",
      "Flags": 2147483648,
      "Sequence": 360,
      "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
      "TransactionType": "Payment",
      "TxnSignature": "304402200E5C2DD81FDF0BE9AB2A8D797885ED49E804DBF28E806604D878756410CA98B102203349581946B0DDA06B36B35DBC20EDA27552C1F167BCF5C6ECFF49C6A46F8580",
      "hash": "4D5D90890F8D49519E4151938601EF3D0B30B16CD6A519D9C99102C9FA77F7E0"
    },
    "validated_ledger_index" : 21184416
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "result": {
        "accepted" : true,
        "account_sequence_available" : 362,
        "account_sequence_next" : 362,
        "applied" : true,
        "broadcast" : true,
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "kept" : true,
        "open_ledger_cost": "10",
        "queued" : false,
        "tx_blob": "1200002280000000240000016961D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100A7CCD11455E47547FF617D5BFC15D120D9053DFD0536B044F10CA3631CD609E502203B61DEE4AC027C5743A1B56AF568D1E2B8E79BB9E9E14744AC87F38375C3C2F181144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Amount": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "1"
            },
            "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Fee": "10000",
            "Flags": 2147483648,
            "Sequence": 361,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "Payment",
            "TxnSignature": "3045022100A7CCD11455E47547FF617D5BFC15D120D9053DFD0536B044F10CA3631CD609E502203B61DEE4AC027C5743A1B56AF568D1E2B8E79BB9E9E14744AC87F38375C3C2F1",
            "hash": "5B31A7518DC304D5327B4887CD1F7DC2C38D5F684170097020C7C9758B973847"
        }
    },
    "validated_ledger_index" : 21184416
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
    "result": {
        "accepted" : true,
        "account_sequence_available" : 362,
        "account_sequence_next" : 362,
        "applied" : true,
        "broadcast" : true,
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
        "kept" : true,
        "open_ledger_cost": "10",
        "queued" : false,
        "tx_blob": "1200002280000000240000016961D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100A7CCD11455E47547FF617D5BFC15D120D9053DFD0536B044F10CA3631CD609E502203B61DEE4AC027C5743A1B56AF568D1E2B8E79BB9E9E14744AC87F38375C3C2F181144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
        "tx_json": {
            "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "Amount": {
                "currency": "USD",
                "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "value": "1"
            },
            "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "Fee": "10000",
            "Flags": 2147483648,
            "Sequence": 361,
            "SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
            "TransactionType": "Payment",
            "TxnSignature": "3045022100A7CCD11455E47547FF617D5BFC15D120D9053DFD0536B044F10CA3631CD609E502203B61DEE4AC027C5743A1B56AF568D1E2B8E79BB9E9E14744AC87F38375C3C2F1",
            "hash": "5B31A7518DC304D5327B4887CD1F7DC2C38D5F684170097020C7C9758B973847"
        }
    },
    "validated_ledger_index" : 21184416
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                 | Type    | Description                              |
|:------------------------|:--------|:-----------------------------------------|
| `engine_result`         | String  | Text [result code](../../../protocol/transactions/transaction-results/index.md) indicating the preliminary result of the transaction, for example `tesSUCCESS` |
| `engine_result_code`    | Integer | Numeric version of the [result code](../../../protocol/transactions/transaction-results/index.md). **Not recommended.** |
| `engine_result_message` | String  | Human-readable explanation of the transaction's preliminary result |
| `tx_blob`               | String  | The complete transaction in hex string format |
| `tx_json`               | Object  | The complete transaction in JSON format  |
| `accepted`              | Boolean | _(Omitted in sign-and-submit mode)_ The value `true` indicates that the transaction was applied, queued, broadcast, or kept for later. The value `false` indicates that none of those happened, so the transaction cannot possibly succeed as long as you do not submit it again and have not already submitted it another time. |
| `account_sequence_available` | Number | _(Omitted in sign-and-submit mode)_ The next [Sequence Number][] available for the sending account after all pending and [queued](../../../../concepts/transactions/transaction-queue.md) transactions. |
| `account_sequence_next` | number  | _(Omitted in sign-and-submit mode)_ The next [Sequence Number][] for the sending account after all transactions that have been provisionally applied, but not transactions in the [queue](../../../../concepts/transactions/transaction-queue.md). |
| `applied`               | Boolean | _(Omitted in sign-and-submit mode)_ The value `true` indicates that this transaction was applied to the open ledger. In this case, the transaction is likely, but not guaranteed, to be validated in the next ledger version. |
| `broadcast`             | Boolean | _(Omitted in sign-and-submit mode)_ The value `true` indicates this transaction was broadcast to peer servers in the peer-to-peer XRP Ledger network. (Note: if the server has no peers, such as in [stand-alone mode][], the server uses the value `true` for cases where it _would_ have broadcast the transaction.) The value `false` indicates the transaction was not broadcast to any other servers. |
| `kept`                  | Boolean | _(Omitted in sign-and-submit mode)_ The value `true` indicates that the transaction was kept to be retried later. |
| `queued`                | Boolean | _(Omitted in sign-and-submit mode)_ The value `true` indicates the transaction was put in the [Transaction Queue](../../../../concepts/transactions/transaction-queue.md), which means it is likely to be included in a future ledger version. |
| `open_ledger_cost`      | String  | _(Omitted in sign-and-submit mode)_ The current [open ledger cost](../../../../concepts/transactions/transaction-cost.md#open-ledger-cost) before processing this transaction. Transactions with a lower cost are likely to be [queued](../../../../concepts/transactions/transaction-queue.md). |
| `validated_ledger_index` | Integer  | _(Omitted in sign-and-submit mode)_ The [ledger index][] of the newest validated ledger at the time of submission. This provides a lower bound on the ledger versions that the transaction can appear in as a result of this request. (The transaction could only have been validated in this ledger version or earlier if it had already been submitted before.) |

**Warning:** Even if the WebSocket response has `"status":"success"`, indicating that the command was successfully received, that does _not_ indicate that the transaction executed successfully. Many situations can prevent a transaction from processing successfully, such as a lack of trust lines connecting the two accounts in a payment, or changes in the state of the ledger since the time the transaction was constructed. Even if nothing is wrong, it may take several seconds to close and validate the ledger version that includes the transaction. See the [full list of transaction responses](../../../protocol/transactions/transaction-results/index.md) for details, and do not consider the transaction's results final until they appear in a validated ledger version.

**Caution:** If this command results in an error message, the message can contain the secret key from the request. (This can only happen in sign-and-submit mode.) Make sure that these errors are not visible to others.

* Do not write an error including your secret key to a log file that can be seen by multiple people.
* Do not paste an error including your secret key to a public place for debugging.
* Do not display an error message including your secret key on a website, even by accident.


## Possible Errors

* Any of the [universal error types][].
* `amendmentBlocked` - The transaction cannot be submitted to the network because the `rippled` server is [amendment blocked](../../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers).
* `highFee` - The `fee_mult_max` parameter was specified, but the server's current fee multiplier exceeds the specified one. (Sign-and-Submit mode only)
* `internalJson` - An internal error occurred when serializing the transaction to JSON. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `internalSubmit` - An internal error occurred when submitting the transaction. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `internalTransaction` - An internal error occurred when processing the transaction. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `invalidTransaction` - The transaction is malformed or otherwise invalid.
* `noPath` - The transaction did not include paths, and the server was unable to find a path by which this payment can occur. (Sign-and-Submit mode only)
* `tooBusy` - The transaction did not include paths, but the server is too busy to do pathfinding right now. Does not occur if you are connected as an admin. (Sign-and-Submit mode only)
* `notSupported` - Signing is not supported by this server (Sign-and-Submit mode only.) If you are the server admin, you can still access signing when connected [as an admin](../../admin-api-methods/index.md), or you could [enable public signing](../../../../infrastructure/configuration/enable-public-signing.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}

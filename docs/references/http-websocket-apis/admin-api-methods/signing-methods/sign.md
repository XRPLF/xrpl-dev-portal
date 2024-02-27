---
html: sign.html # watch for clashes w/ this filename
parent: signing-methods.html
seo:
    description: Cryptographically sign a transaction.
labels:
  - Transaction Sending
---
# sign
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/SignHandler.cpp "Source")

The `sign` method takes a [transaction in JSON format](../../../protocol/transactions/index.md) and a [seed value](../../../../concepts/accounts/cryptographic-keys.md), and returns a signed binary representation of the transaction. To contribute one signature to a [multi-signed transaction](../../../../concepts/accounts/multi-signing.md), use the [sign_for method][] instead.

{% partial file="/docs/_snippets/public-signing-note.md" /%}


**Caution:** Unless you run the `rippled` server yourself, you should do local signing using a [client library](../../../client-libraries.md) instead of using this command. For more information, see [Set Up Secure Signing](../../../../concepts/transactions/secure-signing.md).

## Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "command": "sign",
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
    "method": "sign",
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
#Syntax: sign secret tx_json [offline]
rippled sign s████████████████████████████ '{"TransactionType": "Payment", "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "Amount": { "currency": "USD", "value": "1", "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn" }, "Sequence": 360, "Fee": "10000"}' offline
```
{% /tab %}

{% /tabs %}

To sign a transaction, you must provide a secret key that can [authorize the transaction](../../../../concepts/transactions/index.md#authorizing-transactions). Typically you provide a seed value that the server derives the secret key from. You can do this in a few ways:

* Provide the seed in the `secret` field and omit the `key_type` field. This value can be formatted as an XRP Ledger [base58][] seed, RFC-1751, hexadecimal, or as a string passphrase. (secp256k1 keys only)
* Provide a `key_type` value and exactly one of `seed`, `seed_hex`, or `passphrase`. Omit the `secret` field. (Not supported by the commandline syntax.)

The request includes the following parameters:

| `Field`        | Type    | Description                                       |
|:---------------|:--------|:--------------------------------------------------|
| `tx_json`      | Object  | [Transaction definition](../../../protocol/transactions/index.md) in JSON format |
| `secret`       | String  | _(Optional)_ The secret seed of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. Cannot be used with `key_type`, `seed`, `seed_hex`, or `passphrase`. |
| `seed`         | String  | _(Optional)_ The secret seed of the account supplying the transaction, used to sign it. Must be in the XRP Ledger's [base58][] format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed_hex`, or `passphrase`. |
| `seed_hex`     | String  | _(Optional)_ The secret seed of the account supplying the transaction, used to sign it. Must be in hexadecimal format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `passphrase`. |
| `passphrase`   | String  | _(Optional)_ The secret seed of the account supplying the transaction, used to sign it, as a string passphrase. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `seed_hex`. |
| `key_type`     | String  | _(Optional)_ The [signing algorithm](../../../../concepts/accounts/cryptographic-keys.md#signing-algorithms) of the cryptographic key pair provided. Valid types are `secp256k1` or `ed25519`. Defaults to `secp256k1`. Cannot be used with `secret`. |
| `offline`      | Boolean | _(Optional)_ If `true`, when constructing the transaction, do not try to [automatically fill](#auto-fillable-fields) any transaction details. The default is `false`. |
| `build_path`   | Boolean | _(Optional)_ If this field is provided, the server [auto-fills](../../../protocol/transactions/common-fields.md#auto-fillable-fields) the `Paths` field of a [Payment transaction][] before signing. You must omit this field if the transaction is a [direct XRP payment](../../../../concepts/payment-types/direct-xrp-payments.md) or if it is not a Payment-type transaction. **Caution:** The server looks for the presence or absence of this field, not its value. This behavior may change. ([Issue #3272](https://github.com/XRPLF/rippled/issues/3272)) |
| `fee_mult_max` | Integer | _(Optional)_ Signing fails with the error `rpcHIGH_FEE` if the [auto-filled `Fee` value](../../../protocol/transactions/common-fields.md#auto-fillable-fields) would be greater than the [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#special-transaction-costs) × `fee_mult_max` ÷ `fee_div_max`. This field has no effect if you explicitly specify the `Fee` field of the transaction. The default is `10`. |
| `fee_div_max`  | Integer | _(Optional)_ Signing fails with the error `rpcHIGH_FEE` if the [auto-filled `Fee` value](../../../protocol/transactions/common-fields.md#auto-fillable-fields) would be greater than the [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#special-transaction-costs) × `fee_mult_max` ÷ `fee_div_max`. This field has no effect if you explicitly specify the `Fee` field of the transaction. The default is `1`. |

### Auto-Fillable Fields

The server automatically tries to fill in certain fields in `tx_json` (the [Transaction object](../../../protocol/transactions/index.md)) automatically if you omit them. The server provides the following fields before signing, unless the request specified `offline` as `true`:

* `Sequence` - The server automatically uses the next Sequence number from the sender's account information.
    * **Caution:** The next sequence number for the account is not incremented until this transaction is applied. If you sign multiple transactions without submitting and waiting for the response to each one, you must manually provide the correct sequence numbers for each transaction after the first.
* `Fee` - If you omit the `Fee` parameter, the server tries to fill in an appropriate transaction cost automatically. On the production XRP Ledger, this fails with `rpcHIGH_FEE` unless you provide an appropriate `fee_mult_max` value.
    * The `fee_mult_max` and `fee_div_max` parameters limit how high the automatically-provided transaction cost can be, in terms of the load-scaling multiplier that gets applied to the [reference transaction cost](../../../../concepts/transactions/transaction-cost.md#reference-transaction-cost). The default settings return an error if the automatically-provided value would use greater than a 10× multiplier. However, the production XRP Ledger [typically has a 1000× load multiplier](../../../../concepts/transactions/transaction-cost.md#current-transaction-cost).
    * The commandline syntax does not support `fee_mult_max` and `fee_div_max`. For the production XRP Ledger, you must provide a `Fee` value.
    * **Caution:** A malicious server can specify an excessively high transaction cost, ignoring the values of `fee_mult_max` and `fee_div_max`.
* `Paths` - For Payment-type transactions (excluding XRP-to-XRP transfers), the Paths field can be automatically filled, as if you used the [ripple_path_find method][]. Only filled if `build_path` is provided.

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 2,
  "status": "success",
  "type": "response",
  "result": {
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
    }
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "status": "success",
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
        }
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success",
      "tx_blob" : "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210094D24C795CFFA8E46FE338AF63421DA5CE5E171ED56F8E4CE70FFABA15D3CFA2022063994C52BF0393C8157EBFFCDE6A7E7EDC7B16A462CA53214F64CC8FCBB5E54A81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Amount" : {
            "currency" : "USD",
            "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "value" : "1"
         },
         "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
         "Fee" : "10000",
         "Flags" : 2147483648,
         "Sequence" : 360,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "Payment",
         "TxnSignature" : "304502210094D24C795CFFA8E46FE338AF63421DA5CE5E171ED56F8E4CE70FFABA15D3CFA2022063994C52BF0393C8157EBFFCDE6A7E7EDC7B16A462CA53214F64CC8FCBB5E54A",
         "hash" : "DE80DA6FF9F93FE4CE87C99441F403E0290E35867FF48382204CB89975BF343E"
      }
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `tx_blob` | String | Binary representation of the fully-qualified, signed transaction, as hex |
| `tx_json` | Object | JSON specification of the [complete transaction](../../../protocol/transactions/index.md) as signed, including any fields that were automatically filled in |

**Caution:** If this command results in an error messages, the message can contain a secret value provided in the request. Make sure that these errors are not visible to others.

* Do not write this error to a log file that can be seen by multiple people.
* Do not paste this error to a public place for debugging.
* Do not display the error message on a website, even by accident.

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `highFee` - The current load-based multiplier to the transaction cost exceeds the limit for an automatically-provided transaction cost. Either specify a higher `fee_mult_max` (at least 1000) in the request or manually provide a value in the `Fee` field of the `tx_json`.
* `tooBusy` - The transaction did not include paths, but the server is too busy to do pathfinding right now. Does not occur if you are connected as an admin.
* `noPath` - The transaction did not include paths, and the server was unable to find a path by which this payment can occur.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

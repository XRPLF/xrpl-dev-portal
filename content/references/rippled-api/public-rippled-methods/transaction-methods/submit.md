# submit
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Submit.cpp "Source")

The `submit` method applies a [transaction](transaction-formats.html) and sends it to the network to be confirmed and included in future ledgers.

This command has two modes:

* Submit-only mode takes a signed, serialized transaction as a binary blob, and submits it to the network as-is. Since signed transaction objects are immutable, no part of the transaction can be modified or automatically filled in after submission.
* Sign-and-submit mode takes a JSON-formatted Transaction object, completes and signs the transaction in the same manner as the [sign method][], and then submits the signed transaction. We recommend only using this mode for testing and development.

To send a transaction as robustly as possible, you should construct and [sign][sign method] it in advance, persist it somewhere that you can access even after a power outage, then `submit` it as a `tx_blob`. After submission, monitor the network with the [tx method][] command to see if the transaction was successfully applied; if a restart or other problem occurs, you can safely re-submit the `tx_blob` transaction: it won't be applied twice since it has the same sequence number as the old transaction.

## Submit-Only Mode

A submit-only request includes the following parameters:

| `Field`     | Type    | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
| `tx_blob`   | String  | Hex representation of the signed transaction to submit. This can be a [multi-signed transaction](multi-signing.html). |
| `fail_hard` | Boolean | (Optional, defaults to false) If true, and the transaction fails locally, do not retry or relay the transaction to other servers |

### Request Format

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 3,
    "command": "submit",
    "tx_blob": "1200002280000000240000001E61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000B732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210095D23D8AF107DF50651F266259CC7139D0CD0C64ABBA3A958156352A0D95A21E02207FCF9B77D7510380E49FF250C21B57169E14E9B4ACFD314CEDC79DDD0A38B8A681144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
}
```

*JSON-RPC*

```
{
    "method": "submit",
    "params": [
        {
            "tx_blob": "1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754"
        }
    ]
}
```

*Commandline*

```
#Syntax: submit tx_blob
submit 1200002280000000240000000361D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA968400000000000000A732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100D184EB4AE5956FF600E7536EE459345C7BBCF097A84CC61A93B9AF7197EDB98702201CEA8009B7BEEBAA2AACC0359B41C427C1C5B550A4CA4B80CF2174AF2D6D5DCE81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#submit)


## Sign-and-Submit Mode

This mode signs a transaction and immediately submits it. This mode is intended to be used for testing. You cannot use this mode for [multi-signed transactions](multi-signing.html).

_By default, sign-and-submit mode is [admin-only](admin-rippled-methods.html)._ It can be used as a public method if the server has [enabled public signing](enable-public-signing.html).

You can provide the secret key used to sign the transaction in the following ways:

* Provide a `secret` value and omit the `key_type` field. This value can be formatted as an XRP Ledger [base58][] seed, RFC-1751, hexadecimal, or as a string passphrase. (secp256k1 keys only)
* Provide a `key_type` value and exactly one of `seed`, `seed_hex`, or `passphrase`. Omit the `secret` field. (Not supported by the commandline syntax.)

The request includes the following parameters:

| `Field`        | Type    | Description                                       |
|:---------------|:--------|:--------------------------------------------------|
| `tx_json`      | Object  | [Transaction definition](transaction-formats.html) in JSON format, optionally omitting any auto-fillable fields. |
| `secret`       | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Do not send your secret to untrusted servers or through unsecured network connections. Cannot be used with `key_type`, `seed`, `seed_hex`, or `passphrase`. |
| `seed`         | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Must be in the XRP Ledger's [base58][] format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed_hex`, or `passphrase`. |
| `seed_hex`     | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it. Must be in hexadecimal format. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `passphrase`. |
| `passphrase`   | String  | _(Optional)_ Secret key of the account supplying the transaction, used to sign it, as a string passphrase. If provided, you must also specify the `key_type`. Cannot be used with `secret`, `seed`, or `seed_hex`. |
| `key_type`     | String  | _(Optional)_ Type of cryptographic key provided in this request. Valid types are `secp256k1` or `ed25519`. Defaults to `secp256k1`. Cannot be used with `secret`. **Caution:** Ed25519 support is experimental. |
| `fail_hard`    | Boolean | (Optional, defaults to false) If true, and the transaction fails locally, do not retry or relay the transaction to other servers |
| `offline`      | Boolean | (Optional, defaults to false) If true, when constructing the transaction, do not try to automatically fill in or validate values. |
| `build_path`   | Boolean | _(Optional)_ If provided for a Payment-type transaction, automatically fill in the `Paths` field before signing. You must omit this field if the transaction is a direct XRP-to-XRP transfer. **Caution:** The server looks for the presence or absence of this field, not its value. This behavior may change. |
| `fee_mult_max` | Integer | (Optional, defaults to 10, recommended value 1000) If the `Fee` parameter is omitted, this field limits the automatically-provided `Fee` value so that it is less than or equal to the long-term base transaction cost times this value. |
| `fee_div_max`  | Integer | (Optional, defaults to 1) Used with `fee_mult_max` to create a fractional multiplier for the limit. Specifically, the server multiplies its base [transaction cost](transaction-cost.html) by `fee_mult_max`, then divides by this value (rounding down to an integer) to get a limit. If the automatically-provided `Fee` value would be over the limit, the submit command fails. [New in: rippled 0.30.1][] |

See the [sign method][] for detailed information on how the server automatically fills in certain fields.

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
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

*JSON-RPC*

```
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

*Commandline*

```
#Syntax: submit secret json [offline]
rippled submit s████████████████████████████ '{"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "Amount": { "currency": "USD", "issuer": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "value": "1" }, "Destination": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX", "TransactionType": "Payment", "Fee": "10000"}'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#submit)

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
  "id": 1,
  "status": "success",
  "type": "response",
  "result": {
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
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

*JSON-RPC*

```
{
    "result": {
        "engine_result": "tesSUCCESS",
        "engine_result_code": 0,
        "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
        "status": "success",
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
    }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "1200002280000000240000016A61D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100FBBF74057359EC31C3647AD3B33D8954730E9879C35034374858A76B7CFA643102200EAA08C61071396E9CF0987FBEA16CF113CBD8068AA221214D165F151285EECD81144B4E9C06F24296074F7BC48F92A97916C6DC5EA983143E9D4A2B8AA0780F682D136F7A56D6724EF53754",
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
         "Sequence" : 362,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "Payment",
         "TxnSignature" : "3045022100FBBF74057359EC31C3647AD3B33D8954730E9879C35034374858A76B7CFA643102200EAA08C61071396E9CF0987FBEA16CF113CBD8068AA221214D165F151285EECD",
         "hash" : "CB98A6FA1FAC47F9FCC6A233EB46F8F9AF59CC69BD69AE6D06F298F6FF52162A"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                 | Type    | Description                              |
|:------------------------|:--------|:-----------------------------------------|
| `engine_result`         | String  | Code indicating the preliminary result of the transaction, for example `tesSUCCESS` |
| `engine_result_code`    | Integer | Numeric code indicating the preliminary result of the transaction, directly correlated to `engine_result` |
| `engine_result_message` | String  | Human-readable explanation of the transaction's preliminary result |
| `tx_blob`               | String  | The complete transaction in hex string format |
| `tx_json`               | Object  | The complete transaction in JSON format  |

**Caution:** Even if the WebSocket response has `"status":"success"`, indicating that the command was successfully received, that does _not_ indicate that the transaction executed successfully. Many situations can prevent a transaction from processing successfully, such as a lack of trust lines connecting the two accounts in a payment, or changes in the state of the ledger since the time the transaction was constructed. Even if nothing is wrong, it may take several seconds to close and validate the ledger version that includes the transaction. See the [full list of transaction responses](transaction-results.html) for details, and do not consider the transaction's results final until they appear in a validated ledger version.

**Caution:** If this command results in an error messages, the message can contain the secret key from the request. (This is not a problem if the request contained a signed tx_blob instead.) Make sure that these errors are not visible to others.

* Do not write an error including your secret key to a log file that can be seen by multiple people.
* Do not paste an error including your secret key to a public place for debugging.
* Do not display an error message including your secret key on a website, even by accident.


## Possible Errors

* Any of the [universal error types][].
* `amendmentBlocked` - The transaction cannot be submitted to the network because the `rippled` server is [amendment blocked](amendments.html#amendment-blocked).
* `highFee` - The `fee_mult_max` parameter was specified, but the server's current fee multiplier exceeds the specified one. (Sign-and-Submit mode only)
* `internalJson` - An internal error occurred when serializing the transaction to JSON. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `internalSubmit` - An internal error occurred when submitting the transaction. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `internalTransaction` - An internal error occurred when processing the transaction. This could be caused by many aspects of the transaction, including a bad signature or some fields being malformed.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `invalidTransaction` - The transaction is malformed or otherwise invalid.
* `noPath` - The transaction did not include paths, and the server was unable to find a path by which this payment can occur. (Sign-and-Submit mode only)
* `tooBusy` - The transaction did not include paths, but the server is too busy to do pathfinding right now. Does not occur if you are connected as an admin. (Sign-and-Submit mode only)


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}

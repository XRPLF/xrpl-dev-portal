# Require Destination Tags

The `RequireDest` setting (`requireDestinationTag` in RippleAPI) is designed to prevent customers from sending [payments](payment-types.html) to your address if they forgot the [destination tag](source-and-destination-tags.html) that identifies whom to credit for the payment. When enabled, the XRP Ledger rejects any payment to your address if it does not specify a destination tag.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an [AccountSet transaction][] to enable the `RequireDest` flag:

Request:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```json
POST http://localhost:5005/
Content-Type: application/json

{
    "method": "submit",
    "params": [
        {
            "secret": "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9",
            "tx_json": {
                "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
                "Fee": "15000",
                "Flags": 0,
                "SetFlag": 1,
                "TransactionType": "AccountSet"
            }
        }
    ]
}
```

{% include '_snippets/secret-key-warning.md' %}
<!--{#_ #}-->

<!-- MULTICODE_BLOCK_END -->

Response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```json
200 OK

{
   "result" : {
      "deprecated" : "Signing support in the 'submit' command has been deprecated and will be removed in a future version of the server. Please migrate to a standalone signing tool.",
      "engine_result" : "tesSUCCESS",
      "engine_result_code" : 0,
      "engine_result_message" : "The transaction was applied. Only final in a validated ledger.",
      "status" : "success",
      "tx_blob" : "12000322000000002400000179202100000001684000000000003A98732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7446304402201C430B4C29D0A0AB94286AE55FB9981B00F84C7985AF4BD44570782C5E0C5E290220363B68B81580231B32176F8C477B822ECB9EC673B84237BEF15BE6F59108B97D81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
      "tx_json" : {
         "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
         "Fee" : "15000",
         "Flags" : 0,
         "Sequence" : 377,
         "SetFlag" : 1,
         "SigningPubKey" : "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
         "TransactionType" : "AccountSet",
         "TxnSignature" : "304402201C430B4C29D0A0AB94286AE55FB9981B00F84C7985AF4BD44570782C5E0C5E290220363B68B81580231B32176F8C477B822ECB9EC673B84237BEF15BE6F59108B97D",
         "hash" : "3F2B233907BE9EC51AE1C822EC0B6BB0965EFD2400B218BE988DDA9529F53CA4"
      }
   }
}
```

<!-- MULTICODE_BLOCK_END -->


## See Also

- **Concepts:**
    - [Accounts](accounts.html)
    - [Source and Destination Tags](source-and-destination-tags.html)
    - [Transaction Cost](transaction-cost.html)
    - [Payment Types](payment-types.html)
- **Tutorials:**
    - [XRP Ledger Businesses](xrp-ledger-businesses.html)
- **References:**
    - [account_info method][]
    - [AccountSet transaction][]
    - [AccountRoot Flags](accountroot.html#accountroot-flags)




<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

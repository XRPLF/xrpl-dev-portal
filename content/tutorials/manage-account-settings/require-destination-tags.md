# Require Destination Tags

The `RequireDest` setting (`requireDestinationTag` in RippleAPI) is designed to prevent customers from sending payments to your address if they forgot the [destination tag](source-and-destination-tags.html) that identifies who should be credited for the payment. When enabled, the XRP Ledger rejects any payment to your address that does not specify a destination tag.

The following is an example of using a locally-hosted `rippled`'s [submit method][] to send an AccountSet transaction to enable the `RequireDest` flag:

Request:

```
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

Response:

```
200 OK
{
	"result": {
		"engine_result": "tesSUCCESS",
		"engine_result_code": 0,
		"engine_result_message": "The transaction was applied. Only final in a validated ledger.",
		"status": "success",
		"tx_blob": "12000322000000002400000161202100000003684000000000003A98732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB74473045022100CD9A87890ADFAC49B8F69EDEC4A0DB99C86667883D7579289B06DAA4B81BF87E02207AC3FEEA518060AB2B538D330614D2594F432901F7C011D7EB92F74383E5340F81144B4E9C06F24296074F7BC48F92A97916C6DC5EA9",
		"tx_json": {
			"Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
			"Fee": "15000",
			"Flags": 0,
			"Sequence": 353,
			"SetFlag": 3,
			"SigningPubKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB",
			"TransactionType": "AccountSet",
			"TxnSignature": "3045022100CD9A87890ADFAC49B8F69EDEC4A0DB99C86667883D7579289B06DAA4B81BF87E02207AC3FEEA518060AB2B538D330614D2594F432901F7C011D7EB92F74383E5340F",
			"hash": "59025DD6C9848679BA433448A1DD95833F2F4B64B03E214D074C7A5B6E3E3E70"
		}
	}
}
```

## See Also

- [Source and Destination Tags](source-and-destination-tags.html)
- [XRP Ledger Businesses](xrp-ledger-businesses.html)
- [Payment Types](payment-types.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

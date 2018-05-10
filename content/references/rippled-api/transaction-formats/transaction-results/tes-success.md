# tes Success

The code `tesSUCCESS` is the only code that indicates a transaction succeeded. This does not always mean it accomplished what you expected it to do. (For example, an [OfferCancel][] can "succeed" even if there is no offer for it to cancel.) The `tesSUCCESS` result uses the numerical value 0.

| Code       | Explanation                                                     |
|:-----------|:----------------------------------------------------------------|
| `tesSUCCESS` | The transaction was applied and forwarded to other servers. If this appears in a validated ledger, then the transaction's success is final. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

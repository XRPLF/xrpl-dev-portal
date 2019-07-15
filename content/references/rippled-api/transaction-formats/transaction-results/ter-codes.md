# ter Codes

These codes indicate that the transaction failed, but it could apply successfully in the future, usually if some other hypothetical transaction applies first. They have numerical values in the range -99 to -1. The exact code for any given error is subject to change, so don't rely on it.

**Caution:** Transactions with `ter` codes are not applied the current ledger and cannot cause any changes to the XRP Ledger state. However, a transaction that provisionally failed may still succeed or fail with a different code after being automatically reapplied. For more information, see [Finality of Results](finality-of-results.html) and [Reliable Transaction Submission](reliable-transaction-submission.html).

| Code             | Explanation                                               |
|:-----------------|:----------------------------------------------------------|
| `terFUNDS_SPENT`  | **DEPRECATED.**                                           |
| `terINSUF_FEE_B` | The account sending the transaction does not have enough XRP to pay the `Fee` specified in the transaction. |
| `terLAST`          | Used internally only. This code should never be returned. |
| `terNO_ACCOUNT`   | The address sending the transaction is not funded in the ledger (yet). |
| `terNO_AUTH`      | The transaction would involve adding currency issued by an account with `lsfRequireAuth` enabled to a trust line that is not authorized. For example, you placed an offer to buy a currency you aren't authorized to hold. |
| `terNO_LINE`      | Used internally only. This code should never be returned. |
| `terNO_RIPPLE`    | Used internally only. This code should never be returned. |
| `terOWNERS`        | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](accountset.html#accountset-flags) flag if it has any trust lines or available offers. |
| `terPRE_SEQ`      | The `Sequence` number of the current transaction is higher than the current sequence number of the account sending the transaction. |
| `terRETRY`         | Unspecified retriable error.                              |
| `terQUEUED`        | The transaction met the load-scaled [transaction cost](transaction-cost.html) but did not meet the open ledger requirement, so the transaction has been queued for a future ledger. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

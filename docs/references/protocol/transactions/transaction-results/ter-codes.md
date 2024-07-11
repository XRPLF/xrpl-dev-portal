---
html: ter-codes.html
parent: transaction-results.html
seo:
    description: ter codes indicate that the transaction has not been applied yet, but it could apply successfully in the future - for example, if some other transaction applies first.
labels:
  - Transaction Sending
---
# ter Codes

These codes indicate that the transaction has not been [applied](../../../../concepts/consensus-protocol/index.md) yet, and generally will be automatically retried by the server that returned the result code. The transaction could apply successfully in the future; for example, if a certain other transaction applies first. These codes have numerical values in the range -99 to -1, but the exact code for any given error is subject to change, so don't rely on it.

{% admonition type="info" name="Note" %}
Transactions with `ter` codes have not been applied to the current ledger and have not yet changed the XRP Ledger state. A transaction that provisionally got a `ter` result may still succeed or fail with a different code after being automatically applied later. For more information, see [Finality of Results](../../../../concepts/transactions/finality-of-results/index.md) and [Reliable Transaction Submission](../../../../concepts/transactions/reliable-transaction-submission.md).
{% /admonition %}

| Code             | Explanation                                               |
|:-----------------|:----------------------------------------------------------|
| `terFUNDS_SPENT` | **DEPRECATED.**                                           |
| `terINSUF_FEE_B` | The account sending the transaction does not have enough XRP to pay the `Fee` specified in the transaction. |
| `terLAST`        | Used internally only. This code should never be returned. |
| `terNO_ACCOUNT`  | The address sending the transaction is not funded in the ledger (yet). |
| `terNO_AMM`      | The AMM-related transaction specifies an asset pair that does not currently have an AMM instance. _(Added by the [AMM amendment][])_ |
| `terNO_AUTH`     | The transaction would involve adding currency issued by an account with `lsfRequireAuth` enabled to a trust line that is not authorized. For example, you placed an offer to buy a currency you aren't authorized to hold. |
| `terNO_LINE`     | Used internally only. This code should never be returned. |
| `terNO_RIPPLE`   | The transaction can't succeed because of [rippling settings](/docs/concepts/tokens/fungible-tokens/rippling/). For example, the transaction tried to create an AMM even though the issuer of at least one of the tokens has not enabled the Default Ripple flag. |
| `terOWNERS`      | The transaction requires that account sending it has a nonzero "owners count", so the transaction cannot succeed. For example, an account cannot enable the [`lsfRequireAuth`](../types/accountset.md#accountset-flags) flag if it has any trust lines or available offers. |
| `terPRE_SEQ`     | The `Sequence` number of the current transaction is higher than the current sequence number of the account sending the transaction. |
| `terPRE_TICKET`  | The transaction attempted to use a [Ticket](../../../../concepts/accounts/tickets.md), but the specified `TicketSequence` number does not exist in the ledger. However, the Ticket could still be created by another transaction. |
| `terQUEUED`      | The transaction met the load-scaled [transaction cost](../../../../concepts/transactions/transaction-cost.md) but did not meet the open ledger requirement, so the transaction has been queued for a future ledger. |
| `terRETRY`       | Unspecified retriable error.                              |
| `terSUBMITTED`   | Transaction has been submitted, but not yet applied.      |

{% raw-partial file="/docs/_snippets/common-links.md" /%}

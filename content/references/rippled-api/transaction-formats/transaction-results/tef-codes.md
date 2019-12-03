# tef Codes

These codes indicate that the transaction failed and was not included in a ledger, but the transaction could have succeeded in some theoretical ledger. Typically this means that the transaction can no longer succeed in any future ledger. They have numerical values in the range -199 to -100. The exact code for any given error is subject to change, so don't rely on it.

**Caution:** Transactions with `tef` codes are not applied to ledgers and cannot cause any changes to the XRP Ledger state. However, a transaction that provisionally failed may still succeed or fail with a different code after being reapplied. For more information, see [Finality of Results](finality-of-results.html) and [Reliable Transaction Submission](reliable-transaction-submission.html).

| Code                   | Explanation                                         |
|:-----------------------|:----------------------------------------------------|
| `tefALREADY`             | The same exact transaction has already been applied. |
| `tefBAD_ADD_AUTH`      | **DEPRECATED.**                                     |
| `tefBAD_AUTH`           | The key used to sign this account is not authorized to modify this account. (It could be authorized if the account had the same key set as the [Regular Key](cryptographic-keys.html).) |
| `tefBAD_AUTH_MASTER`   | The single signature provided to authorize this transaction does not match the master key, but no regular key is associated with this address. |
| `tefBAD_LEDGER`         | While processing the transaction, the ledger was discovered in an unexpected state. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| `tefBAD_QUORUM`         | The transaction was [multi-signed](multi-signing.html), but the total weights of all included signatures did not meet the quorum. |
| `tefBAD_SIGNATURE`      | The transaction was [multi-signed](multi-signing.html), but contained a signature for an address not part of a SignerList associated with the sending account. |
| `tefCREATED`             | **DEPRECATED.**                                     |
| `tefEXCEPTION`           | While processing the transaction, the server entered an unexpected state. This may be caused by unexpected inputs, for example if the binary data for the transaction is grossly malformed. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| `tefFAILURE`             | Unspecified failure in applying the transaction.    |
| `tefINTERNAL`            | When trying to apply the transaction, the server entered an unexpected state. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues) to get it fixed. |
| `tefINVARIANT_FAILED`   | An invariant check failed when trying to claim the [transaction cost](transaction-cost.html). Requires the [EnforceInvariants amendment][]. If you can reproduce this error, please [report an issue](https://github.com/ripple/rippled/issues). |
| `tefMASTER_DISABLED`    | The transaction was signed with the account's master key, but the account has the `lsfDisableMaster` field set. |
| `tefMAX_LEDGER`         | The transaction included a [`LastLedgerSequence`](reliable-transaction-submission.html#lastledgersequence) parameter, but the current ledger's sequence number is already higher than the specified value. |
| `tefNO_AUTH_REQUIRED`  | The [TrustSet transaction][] tried to mark a trustline as authorized, but the `lsfRequireAuth` flag is not enabled for the corresponding account, so authorization is not necessary. |
| `tefNOT_MULTI_SIGNING` | The transaction was [multi-signed](multi-signing.html), but the sending account has no SignerList defined. |
| `tefPAST_SEQ`           | The sequence number of the transaction is lower than the current sequence number of the account sending the transaction. |
| `tefTOO_BIG`            | The transaction would affect too many objects in the ledger. For example, this was an [AccountDelete transaction][] but the account to be deleted owns over 1000 objects in the ledger. |
| `tefWRONG_PRIOR`        | The transaction contained an `AccountTxnID` field (or the deprecated `PreviousTxnID` field), but the transaction specified there does not match the account's previous transaction. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

# Transaction Results

[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/TER.h "Source")

The `rippled` server summarizes transaction results with result codes, which appear in fields such as `engine_result` and `meta.TransactionResult`. These codes are grouped into several categories of with different prefixes:

| Category              | Prefix                  | Description                |
|:----------------------|:------------------------|:---------------------------|
| Claimed cost only     | [tec](tec-codes.html)   | The transaction did not achieve its intended purpose, but the [transaction cost](transaction-cost.html) was destroyed. This result is only final in a validated ledger. |
| Failure               | [tef](tef-codes.html)   | The transaction cannot be applied to the server's current (in-progress) ledger or any later one. It may have already been applied, or the condition of the ledger makes it impossible to apply in the future. |
| Local error           | [tel](tel-codes.html)   | The `rippled` server had an error due to local conditions, such as high load. You may get a different response if you resubmit to a different server or at a different time. |
| Malformed transaction | [tem](tem-codes.html)   | The transaction was not valid, due to improper syntax, conflicting options, a bad signature, or something else. |
| Retry                 | [ter](ter-codes.html)   | The transaction could not be applied, but it could apply successfully in a future ledger. |
| Success               | [tes](tes-success.html) | (Not an error) The transaction succeeded. This result only final in a validated ledger. |

The `rippled` server automatically retries failed transactions. It is important not to assume that a transaction has completely failed based on a tentative failure result. A transaction may later succeed unless its success or failure is [final](finality-of-results.html).

**Warning:** Transactions' provisional result codes may differ than their final result. Transactions that provisionally succeeded may eventually fail and transactions that provisionally failed may eventually succeed. Transactions that provisionally failed may also eventually fail with a different code. See [finality of results](finality-of-results.html) for how to know when a transaction's result is final.

The distinction between a local error (`tel`) and a malformed transaction (`tem`) is a matter of protocol-level rules. For example, the protocol sets no limit on the maximum number of paths that can be included in a transaction. However, a server may define a finite limit of paths it can process. If two different servers are configured differently, then one of them may return a `tel` error for a transaction with many paths, while the other server could successfully process the transaction. If enough servers are able to process the transaction that it survives consensus, then it can still be included in a validated ledger.

By contrast, a `tem` error implies that no server anywhere can apply the transaction, regardless of settings. Either the transaction breaks the rules of the protocol, it is unacceptably ambiguous, or it is completely nonsensical. The only way a malformed transaction could become valid is through changes in the protocol; for example, if a new feature is adopted, then transactions using that feature could be considered malformed by servers that are running older software which predates that feature.


## Immediate Response

The response from the [submit method][] contains a provisional result from the `rippled` server indicating what happened during local processing of the transaction.

The response from `submit` contains the following fields:

| Field                   | Value          | Description                       |
|:------------------------|:---------------|:----------------------------------|
| `engine_result`          | String         | A code that categorizes the result, such as `tecPATH_DRY` |
| `engine_result_code`    | Signed Integer | A number that corresponds to the `engine_result`, although exact values are subject to change. |
| `engine_result_message` | String         | A human-readable message explaining what happened. This message is intended for developers to diagnose problems, and is subject to change without notice. |

If nothing went wrong when submitting and applying the transaction locally, the response looks like this:

```js
    "engine_result": "tesSUCCESS",
    "engine_result_code": 0,
    "engine_result_message": "The transaction was applied. Only final in a validated ledger."
```

**Note:** A successful result at this stage does not indicate that the transaction has completely succeeded; only that it was successfully applied to the provisional version of the ledger kept by the local server. Failed results at this stage are also provisional and may change. See [Finality of Results](finality-of-results.html) for details.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

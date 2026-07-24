---
seo:
    description: Merge your inbox balance into the spending balance for confidential transfers.
labels:
  - Multi-Purpose Tokens, MPTs
  - Tokens
  - Confidential Transfers
requiredAmendment: ConfidentialTransfer
---
# ConfidentialMPTMergeInbox
{% source-link path="src/libxrpl/tx/transactors/token/ConfidentialMPTMergeInbox.cpp" /%}

Merge your confidential _inbox_ balance into your _spending_ balance. This moves all funds from the inbox balance into the spending balance and resets the inbox to encrypted zero, ensuring that proofs reference only stable spending balances.

{% admonition type="info" name="Note" %}
Even if the inbox is already empty (contains encrypted zero), this transaction is valid and succeeds.
{% /admonition %}

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTMergeInbox",
  "Account": "rUserAccount...",
  "MPTokenIssuanceID": "610F33B8EBF7EC795F822A454FB852156AEFE50BE0CB8326338A81CD74801864",
  "Fee": "12",
  "Sequence": 2470665,
  "Flags": 2147483648
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:----------- |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `temDISABLED`           | The ConfidentialTransfer amendment is not enabled. |
| `temMALFORMED`          | The account submitting the transaction is the Issuer. |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance` or the user's `MPToken` object does not exist. |
| `tecNO_PERMISSION`      | The issuance does not have the **Can Hold Confidential Balance** flag enabled, or the user's `MPToken` object has not been initialized (missing `ConfidentialBalanceInbox` or `ConfidentialBalanceSpending`). |
| `tefINTERNAL`           | A system invariant failure where the issuer attempts to merge. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}

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
  "Account": "rUUeVf9zJWfg7mxNCLhEXm9mfmeHBGb9w3",
  "MPTokenIssuanceID": "003CE807D39D78123FFBDD9401BEC038D88BD328AC353B9C",
  "Fee": "10",
  "Sequence": 3991569
}
```

{% tx-example txid="BDD9869C13D8BB3B3A0216100B92AE97634BA1B5505A2C6B4327EBF6EA9DCF6F" server="devnet" /%}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:----------- |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `tecLOCKED`             | The MPT is locked for the account, or the issuance is globally locked. |
| `tecNO_AUTH`            | The issuance requires authorization and the account's `MPToken` is not authorized. |
| `tecNO_PERMISSION`      | The transaction lacks the required permissions. Common causes include:<br>- The issuance does not have the **Can Hold Confidential Balance** flag enabled.<br>- The account's `MPToken` is missing the `ConfidentialBalanceInbox`, `ConfidentialBalanceSpending`, or `HolderEncryptionKey` field. |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance` or the account's `MPToken` does not exist. |
| `temDISABLED`           | The `ConfidentialTransfer` amendment is not enabled. |
| `temMALFORMED`          | The `Account` is the issuer of the `MPTokenIssuanceID`. |

## See Also

- [MPToken entry][]
- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

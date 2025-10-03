---
seo:
    description: Repair corruptions to the XRP ledger's state data.
labels:
    - Utilities
    - Troubleshooting
---
# LedgerStateFix
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/LedgerStateFix.cpp "Source")

Repair a specific corruption affecting on-ledger data. This transaction type has a different mode for each type of error state or corruption it can fix.

{% amendment-disclaimer name="fixNFTokenPageLinks" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
   "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
   "Fee" : "2000000",
   "LedgerFixType" : 1,
   "Owner" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
   "Sequence" : 2,
   "TransactionType" : "LedgerStateFix"
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field           | JSON Type            | [Internal Type][] | Required? | Description |
|:----------------|:---------------------|:------------------|:----------|:------------|
| `LedgerFixType` | Number               | UInt16            | Yes       | The type of fix to apply. See [LedgerFixType](#ledgerfixtype) for possible values. Currently the only type is `1`, which fixes the NFToken directory for a single account. |
| `Owner`         | String - [Address][] | AccountID         | No        | _(Required if `LedgerFixType` is `1`.)_ The account that owns the NFToken directory to fix. Does not need any relationship to the sender of the transaction. |


## LedgerFixType

`LedgerStateFix` transactions are targeted solutions for rare and specific issues. They can only be used to fix a specific type of ledger corruption, described below.

### Type 1

Corrupt NFT directories resulting from these conditions:

- At least two NFToken pages were in the directory.
- The next-to-last page was completely full, holding 32 NFTokens.
- The last page of the directory contained only one NFToken.
- A transaction removed the last remaining token from the last page, causing the directory to delete the page.

When these conditions were met, the NFToken directory didn't properly update page links, causing holes in the directory when new last pages were created for additional NFTokens.

The [fixNFTokenPageLinks amendment][] prevents new instances of this type of ledger corruption from happening.


## Special Transaction Cost

The `LedgerStateFix` transaction is rare and potentially compute intensive, so the transaction must pay a special [transaction cost][] equal to at least the [owner reserve](../../../../concepts/accounts/reserves.md) for one item (currently {% $env.PUBLIC_OWNER_RESERVE %}).

The transaction cost always applies when a transaction is included in a validated ledger, even if the transaction fails. (See [Error Cases](#error-cases).) To greatly reduce the chances of paying the high transaction cost if the transaction fails, [submit the transaction](../../../http-websocket-apis/public-api-methods/transaction-methods/submit.md) with `fail_hard` enabled.


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                   | Description |
|:-----------------------------|:------------|
| `tecFAILED_PROCESSING`       | The transaction failed to apply the fix. For example, the transaction attempted to repair an NFT directory that was not broken. |
| `tecOBJECT_NOT_FOUND`        | A ledger entry specified in the transaction does not exist. For example, the transaction tried to repair the NFT directory of an account that does not hold any NFTs. |
| `tefINVALID_LEDGER_FIX_TYPE` | The [`LedgerFixType`](#ledgerfixtype) value specified in the transaction is not valid. Currently, the only valid type is `1`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}

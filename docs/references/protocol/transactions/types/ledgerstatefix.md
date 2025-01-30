---
seo:
    description: Repair corruptions to the XRP ledger.
labels:
  - Utilities
  - Troubleshooting
---
# LedgerStateFix
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/LedgerStateFix.cpp "Source")

_(Added by the [fixNFTokenPageLinks amendment][])_

`LedgerStateFix` is a general purpose transaction used to fix specific issues affecting the XRP ledger. You submit the transaction with the `LedgerFixType` value set to indicate the particular  error state to correct.

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

| Field | Data Type  | Required? | Description |
|:------|:-----------|:----------|:------------|
| `LedgerFixType` | uint16 | Required | Currently the only type is _1_, which fixes the NFToken directory for a single account. |
| `Owner` | STAccount | Optional | Required if `LedgerFixType` == _1_, the account ID that owns the NFToken directory that needs fixing. Need not have any relationship to Account. |


## LedgerFixType

`LedgerStateFix` transactions are targeted solutions for rare and specific issues. They can't be used to fix ledger issues outside of the described types below:

### Type 1

Corrupt NFT directories resulting from these conditions:

- At least two NFToken pages were in the directory.
- The next-to-last page was completely full, holding 32 NFTokens.
- The last page of the directory contained only one NFToken.
- A transaction removed the last remaining token from the last page, causing the directory to delete the page.

When these conditions were met, the NFToken directory didn't properly update page links, causing holes in the directory when new last pages were created for additional NFTokens.

The [`fixNFTokenPageLinks` amendment][] fixed new instances of this ledger issue by adding invariant checks.


## LedgerStateFix Flags

Transactions of the `LedgerStateFix` type can support additional values in the `Flags` field. Currently, there are no flags defined. A future `LedgerFixType` might require flag settings.


## Special Transaction Cost

The `LedgerStateFix` transaction is rare and potentially compute intensive. The minimum fee is the same as the fee for an [`AccountDelete`][] transaction. If the transaction fails with a tec code, the fee is still charged.


## Error Cases

Potential errors are those that can occur for all transactions.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
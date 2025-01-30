---
seo:
    description: Repair corruptions to the XRP ledger.
labels:
  - Utilities, troubleshooting
---
# LedgerStateFix
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/LedgerStateFix.cpp "Source")


`LedgerStateFix` is a general purpose transaction used to fix specific issues affecting the XRP ledger. You submit the transaction with the `LedgerFixType` value set to indicate the particular  error state to correct.

## Example {% $frontmatter.seo.title %} JSON

```json
{
   "Account" : "<Signer and fee payer>",
   "Fee" : "2000000",
   "LedgerFixType" : 1,
   "Owner" : "<Account with corrupted NFTokenPage directory",
   "Sequence" : <n>,
   "SigningPubKey" : "<Account's public key>",
   "TransactionType" : "LedgerStateFix",
   "TxnSignature" : "<Signature>",
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field | Data Type  | Required? | Description |
|:------|:-----------|:----------|:------------|
| `TransactionType` | uint16 | Required | Identifies this as a `LedgerStateFix` transaction. |
| `Account` | STAccount | Required | Identifies the account signing and submitting the transaction as well as paying the Fee. |
| `Fee` | STAmount | Required | This transaction is rare and potentially compute intensive. The minimum fee is the same as the fee for an AccountDelete transaction. If the transaction fails with a tec code, the fee is still charged. |
| `Flags` | uint32 | Optional | Not needed for `LedgerFixType` == _1_. Reserved for a future type of ledger fix. |
| `LedgerFixType` | uint16 | Required | Currently the only type is _1_, which fixes the NFToken directory for a single account. |
| `Owner` | STAccount | Optional | Required if `LedgerFixType` == _1_, the account ID that owns the NFToken directory that needs fixing. Need not have any relationship to Account. |

## LedgerStateFix Flags

Transactions of the LedgerStateFix type can support additional values in the `Flags` field. Currently, there are no flags defined. A future `LedgerFixType` might require flag settings.

## Error Cases

Potential errors are those that can occur for all transactions. {% $frontmatter.seo.title %}. 

## LedgerStateFix Types

`LedgerStateFix` might sound like a general panacea for all your ledger's ills, but in practice it is a targeted solution for very rare, known, and specific issues.

### Type 1

There are two different transactions that introduced corruptions to NFT directories. In both cases, the following conditions were met:

- There were at least two NFToken pages in the directory.
- The next-to-last page was completely full, holding 32 NFTokens.
- The very last page of the directory contained only one NFToken.
- The transaction removed the last remaining token from the last page.

When these conditions were met, the last NFToken page was removed and the next-to-last page was left as the final page in the directory.

That would be fine, except the NFToken directory has an expectation that the last page has a specific index. The page with that index was just deleted. When an NFToken is added to the directory, and that token has a high enough value that it doesn't belong on the current last page, then a new last page is created that has no links to the previous page, creating a hole in the middle of the list.

The `fixNFTokenPageLinks` amendment modifies the NFToken page, coalescing code to notice when the very last page of the directory would be removed. In that case, it moves all of the contents of the next lower page into the last page and deletes the next-to-last page. It then fixes up the links.

New invariant checks also validate aspects of the links on pages, so a similar corruption returns a tecINVARIANT_FAILED transaction result. That will prevent this specific type of corruption going forward.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
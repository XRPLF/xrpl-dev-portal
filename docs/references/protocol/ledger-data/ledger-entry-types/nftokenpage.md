---
html: nftokenpage.html
parent: ledger-entry-types.html
seo:
    description: Ledger structure for recording NFTokens.
labels:
 - Non-fungible Tokens, NFTs
---
# NFTokenPage

The `NFTokenPage` object represents a collection of [NFTs](../../../../concepts/tokens/nfts/index.md) owned by the same account. An account can have multiple `NFTokenPage` entries, which form a doubly linked list.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "LedgerEntryType": "NFTokenPage",
  "PreviousPageMin":
    "8A244DD75DAF4AC1EEF7D99253A7B83D2297818B2297818B70E264D2000002F2",
  "NextPageMin":
    "8A244DD75DAF4AC1EEF7D99253A7B83D2297818B2297818BE223B0AE0000010B",
  "PreviousTxnID":
    "95C8761B22894E328646F7A70035E9DFBECC90EDD83E43B7B973F626D21A0822",
  "PreviousTxnLgrSeq":
    42891441,
  "NFTokens": [
    {
      "NFToken": {
        "NFTokenID":
          "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
      }
    },
    /* potentially more objects */
  ]
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field Name          | JSON Type | [Internal Type][] | Required? | Description |
|:--------------------|:----------|:------------------|:----------|:------------|
| `LedgerEntryType`   | String    | UInt16            | Yes       | The value `0x0050`, mapped to the string `NFTokenPage`, indicates that this is a page containing `NFToken` objects.|
| `NextPageMin`       | String    | Hash256           | No        | The locator of the next page, if any. Details about this field and how it should be used are outlined below. |
| `NFTokens`          | Array     | Array             | Yes       | The collection of `NFToken` objects contained in this NFTokenPage object. This specification places an upper bound of 32 NFToken objects per page. Objects are sorted from low to high with the `NFTokenID` used as the sorting parameter.|
| `PreviousPageMin`   | String    | Hash256           | No        | The locator of the previous page, if any. Details about this field and how it should be used are outlined below. |
| `PreviousTxnID`     | String    | Hash256           | No        | Identifies the transaction ID of the transaction that most recently modified this NFTokenPage object. |
| `PreviousTxnLgrSeq` | Number    | UInt32            | No        | The sequence of the ledger that contains the transaction that most recently modified this NFTokenPage object.|


### NFTokenPage ID Format

`NFTokenPage` identifiers are constructed to allow a more efficient paging structure, ideally suited for `NFToken` objects.

The identifier of an `NFTokenPage` is derived by concatenating the 160-bit `AccountID` of the owner of the page, followed by a 96 bit value that indicates whether a particular `NFTokenID` can be contained in this page.

More specifically, a `NFToken` with the `NFTokenID` value `A` can be included in a page with `NFTokenPage` ID `B` if and only if `low96(A) >= low96(B)`.

This uses a function `low96(x)` which returns the low 96 bits of a 256-bit value, For example, applying the `low96` function to the `NFTokenID` of `000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65` returns the value `42540EE208C3098E00000D65`.

This design allows for efficient lookups of individual `NFToken` objects without needing to check each `NFTokenPage` in a list.


### Finding NFTokens

To find a specific `NFToken`, you need to know its `NFTokenID` and current owner. Compute the `NFTokenPage` ID as described above. Search for a ledger entry whose identifier is less than or equal to that value. If that entry does not exist or is not an `NFTokenPage`, that account does not own that `NFToken`.


### Adding NFTokens

To add an `NFToken`, find the `NFTokenPage` it should be in (using the same technique as searching for an `NFToken` object) and add it to that page. If the `NFTokenPage` is already full, find the previous and next pages (if any) and balance those three pages, inserting a new `NFTokenPage` as needed.


### Removing NFTokens

Removing `NFToken` objects works like adding them. If the number of `NFToken` objects in the page goes below a certain threshold, the ledger combines the page with a previous or next page if possible.


## {% $frontmatter.seo.title %} Reserve

Each `NFTokenPage` counts as one item towards its owner's [owner reserve](../../../../concepts/accounts/reserves.md#owner-reserves). Burning or trading away enough NFTs to remove the page frees up the reserve.

Since each page can hold up to 32 entries, the _effective_ reserve cost per NFT can be as low as _R_/32 where _R_ is the incremental owner reserve for one item.

### The reserve in practice

Because of the way splitting and combining pages works, the actual number of `NFToken` objects per page is somewhat unpredictable and depends on the actual `NFTokenID` values involved. In practice, after minting or receiving a large number of NFTs, each page can have as few as 16 items, or as many as 32, with the typical case being around 24 `NFToken` objects per page.

Currently, the reserve per item is 2 XRP. The table below shows how much the **total owner reserve** is for various numbers of NFTs owned under various scenarios:

| NFTs Owned  | Best Case | Typical | Worst Case |
|:------------|:----------|:--------|:-----------|
| 32 or fewer | 2 XRP     | 2 XRP   | 2 XRP      |
| 50          | 4 XRP     | 6 XRP   | 8 XRP      |
| 200         | 14 XRP    | 18 XRP  | 26 XRP     |
| 1000        | 64 XRP    | 84 XRP  | 126 XRP    |

These numbers are estimates; the actual numbers may vary.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

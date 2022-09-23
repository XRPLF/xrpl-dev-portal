---
html: nftokenpage.html
parent: ledger-object-types.html
blurb: Ledger structure for recording NFTokens.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFTokenPage
{% include '_snippets/nfts-disclaimer.md' %}

The `NFTokenPage` object represents a collection of `NFToken` objects owned by the same account. An account can have multiple `NFTokenPage` ledger objects, which form a doubly linked list.

## Example {{currentpage.name}} JSON

```json
{
  "LedgerEntryType": "NFTokenPage",
  "PreviousTokenPage":
    "598EDFD7CF73460FB8C695d6a9397E907378C8A841F7204C793DCBEF5406",
  "PreviousTokenNext":
    "598EDFD7CF73460FB8C695d6a9397E9073781BA3B78198904F659AAA252A",
  "PreviousTxnID":
    "95C8761B22894E328646F7A70035E9DFBECC90EDD83E43B7B973F626D21A0822",
  "PreviousTxnLgrSeq":
    42891441,
  "NFTokens": [
    {
      "NFTokenID":
          "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
    },
    /* potentially more objects */
  ]
}
```



In the interest of minimizing the size of a page and optimizing storage, the `Owner` field is not present, since it is encoded as part of the object's ledger identifier.


## {{currentpage.name}} Fields

An `NFTokenPage` object can have the following required and optional fields:


| Field Name          | JSON Type | [Internal Type][] | Required? | Description |
|:--------------------|:----------|:------------------|:----------|:------------|
| `LedgerEntryType`   | string    | UInt16            | Yes       | Identifies the type of ledger object. The reserved ledger entry type is 0x0050.|
| `NextPageMin`       | string    | Hash256           | No        | The locator of the next page, if any. Details about this field and how it should be used are outlined below, after the construction of the NFTokenPageID is explained.|
| `NFTokens`          | object    | TOKEN             | Yes       | The collection of NFToken objects contained in this NFTokenPage object. This specification places an upper bound of 32 NFToken objects per page. Objects should be stored in sorted order, from low to high with the TokenID used as the sorting parameter.|
| `PreviousPageMin`   | string    | Hash256           | No        | The locator of the previous page, if any. Details about this field and how it should be used are outlined below, after the construction of the NFTokenPageID is explained.|
| `PreviousTxnID`     | string    | HASH256           | No        | Identifies the transaction ID of the transaction that most recently modified this NFTokenPage object.|
| `PreviousTxnLgrSeq` | number    | UInt32            | No        | The sequence of the ledger that contains the transaction that most recently modified this NFTokenPage object.|


### TokenPage ID Format

`NFTokenPage` identifiers are constructed so as to specifically allow for the adoption of a more efficient paging structure, ideally suited for `NFTokens`.

The identifier of an `NFTokenPage` is derived by concatenating the 160-bit `AccountID` of the owner of the page, followed by a 96 bit value that indicates whether a particular `NFTokenID` can be contained in this page.

More specifically, and assuming that the function `low96(x)` returns the low 96 bits of a 256-bit value, an NFT with `NFTokenID` `A` can be included in a page with `NFTokenPageID` `B` if and only if `low96(A) >= low96(B)`.

For example, applying the `low96` function to the NFT described before, which had an ID of `000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65` the function `low96` would return `42540EE208C3098E00000D65`.

This curious construct exploits the structure of the SHAMap to allow for efficient lookups of individual `NFToken` objects without requiring iteration of the doubly-linked list of `NFTokenPages`.


### Searching for an `NFToken` object

To search for a specific `NFToken`, compute the `NFTokenPageID` using the account of the owner and the `NFTokenID` of the token, as described above. Search for a ledger entry where the identifier is less than or equal to that value. If that entry does not exist or is not an `NFTokenPage`, the `NFToken` is not held by the given account.


### Adding an `NFToken` object

You add an `NFToken` object by finding the `NFTokenPage` it should be in (using the same technique as searching for an `NFToken` object) and adding it to that page. If the page overflows after you add the `NFToken`, find the `next` and `previous` pages (if any) and balance those three pages, inserting a new page as needed.


### Removing an `NFToken` object

An `NFToken` can be removed by using the same approach. If the number of `NFTokens` in the page goes below a certain threshold, the server attempts to consolidate the page with a previous or subsequent page to recover the reserve.


### Reserve for `NFTokenPage` object

Each `NFTokenPage` costs an incremental reserve to the owner account. This specification allows up to 32 `NFToken` entries per page, which means that for accounts that hold multiple NFTs the _effective_ reserve cost per NFT can be as low as _R_/32 where _R_ is the incremental reserve.


### The reserve in practice

The value of the incremental reserve is, as of this writing, 2 XRP. The table below shows what the _effective_ reserve per token is, if a given page contains 1, 8, 16 and 32 NFTs.


| Incremental Reserve | 1 NFToken | 8 NFTokens | 16 NFTokens | 32 NFTokens | 64 NFTokens |
|:--------------------|:----------|:-----------|:------------|:------------|:------------|
| 5 XRP               | 5 XRP     | 0.625 XRP  | 0.3125 XRP  | 0.15625 XRP | 0.07812 XRP |
| 2 XRP               | 2 XRP     | 0.25 XRP   | 0.125 XRP   | 0.0625 XRP  | 0.03125 XRP |
| 1 XRP               | 1 XRP     | 0.125 XRP  | 0.0625 XRP  | 0.03125 XRP | 0.01562 XRP |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

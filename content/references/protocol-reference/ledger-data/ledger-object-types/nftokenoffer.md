---
html: nftokenoffer.html
parent: ledger-object-types.html
blurb: Create offers to buy or sell NFTs.
labels:
 - Non-fungible Tokens, NFTs
---
# NFTokenOffer

Tokens that have the `lsfTransferable` flag set can be transferred among participants using offers. The `NFTokenOffer` object represents an offer to buy, sell or transfer an `NFToken` object. The owner of a `NFToken` can use `NFTokenCreateOffer` to start a transaction.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Example {{currentpage.name}} JSON

```json
{
    "Amount": "1000000",
    "Flags": 1,
    "LedgerEntryType": "NFTokenOffer",
    "NFTokenID": "00081B5825A08C22787716FA031B432EBBC1B101BB54875F0002D2A400000000",
    "NFTokenOfferNode": "0",
    "Owner": "rhRxL3MNvuKEjWjL7TBbZSDacb8PmzAd7m",
    "OwnerNode": "17",
    "PreviousTxnID": "BFA9BE27383FA315651E26FDE1FA30815C5A5D0544EE10EC33D3E92532993769",
    "PreviousTxnLgrSeq": 75443565,
    "index": "AEBABA4FAC212BF28E0F9A9C3788A47B085557EC5D1429E7A8266FB859C863B3"
}
```


### NFTokenOffer Fields

| Name                |JSON Type         | [Internal Type][] | Required?   | Description |
|:--------------------|:-----------------|:------------------|:------------|:-----------|
| `Amount`            | [Currency Amount][] | AMOUNT            | Yes         | Amount expected or offered for the NFToken. If the token has the `lsfOnlyXRP` flag set, the amount must be specified in XRP. Sell offers that specify assets other than XRP must specify a non-zero amount. Sell offers that specify XRP can be 'free' (that is, the Amount field can be equal to `"0"`). |
| `Destination`       | string           | AccountID         | No          | The AccountID for which this offer is intended. If present, only that account can accept the offer. |
| `Expiration`        | number           | UInt32            | No          | The time after which the offer is no longer active. The value is the number of seconds since the Ripple Epoch. |
| `Flags`             | number           | UInt32            | Yes         | A set of flags associated with this object, used to specify various options or settings. Flags are listed in the table below. |
| `LedgerEntryType`   | string           | UInt16            | Yes         | The value `0x0074`, mapped to the string `NFTokenOffer`, indicates that this is an offer to trade a `NFToken`. |
| `NFTokenID`         | string           | Hash256           | Yes         | The `NFTokenID` of the NFToken object referenced by this offer. |
| `NFTokenOfferNode`  | string           | UInt64            | No          | Internal bookkeeping, indicating the page inside the token buy or sell offer directory, as appropriate, where this token is being tracked. This field allows the efficient deletion of offers. |
| `Owner`             | string           | AccountID         | Yes         | Owner of the account that is creating and owns the offer. Only the current Owner of an NFToken can create an offer to sell an NFToken, but any account can create an offer to buy an NFToken. |
| `OwnerNode`         | string           | UInt64            | No          | Internal bookkeeping, indicating the page inside the owner directory where this token is being tracked. This field allows the efficient deletion of offers. |
| `PreviousTxnID`     | string           | Hash256           | Yes         | Identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | number           | UInt32            | Yes         | Index of the ledger that contains the transaction that most recently modified this object. |



#### NFTokenOffer Flags

| Flag Name        | Hex Value    | Decimal Value | Description |
|------------------|--------------|---------------|-------------|
| `lsfSellNFToken` | `0x00000001` | 1             | If enabled, the offer is a sell offer. Otherwise, the offer is a buy offer. |

## NFTokenOffer Transactions

Unlike [Offers for fungible tokens](offers.html), a `NFTokenOffer` is not stored in an order book and is never automatically matched or executed. A buyer must _explicitly_ choose to accept an `NFTokenOffer` that offers to buy a `NFToken`. Similarly, a seller must _explicitly_ choose to accept a specific `NFTokenOffer` that offers to buy a `NFToken` object that they own.

The transactions for `NFToken` trading are:

- [NFTokenCreateOffer][]
- [NFTokenCancelOffer][]
- [NFTokenAcceptOffer][]


### Locating NFTokenOffer objects

Each `NFToken` has two [directories](directorynode.html): one contains offers to buy the token and the other contains offers to sell the token. Marketplaces or other client applications can use these directories to find and display offers to trade `NFToken` objects to users or even automatically match them and accept them.


### NFTokenOffer Reserve

Each `NFTokenOffer` object costs the account placing the offer one incremental reserve. As of this writing the incremental reserve is 2 XRP. The reserve can be recovered by cancelling the offer.


### NFTokenOffer ID Format

The unique ID (`NFTokenOfferID`) of a `NFTokenOffer` object is the result of the following values concatenated in order:

* The `NFTokenOffer` space key, `0x0074`;
* The `AccountID` of the account placing the offer; and
* The `Sequence` (or `Ticket`) of the `NFTokenCreateOffer` transaction that created the `NFTokenOffer`.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

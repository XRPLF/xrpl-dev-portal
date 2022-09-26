---
html: nftokenoffer.html
parent: ledger-object-types.html
blurb: Create offers to buy or sell NFTs.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---
# NFTokenOffer
{% include '_snippets/nfts-disclaimer.md' %}

Tokens that have the `lsfTransferable` flag set can be transferred among participants using offers. The `NFTokenOffer` object represents an offer to buy, sell or transfer an `NFToken` object. The owner of a `NFToken` can use `NFTokenCreateOffer` to start a transaction.


### `NFTokenOfferID` Format

The unique ID (`NFTokenOfferID`) of the `NFTokenOffer` object is the result of the following values concatenated in order:



* The `NFTokenOffer` space key, `0x0074`;
* The `AccountID` of the account placing the offer; and
* The `Sequence` (or `Ticket`) of the `NFTokenCreateOffer` transaction that will create the `NFTokenOffer`.


### `NFTokenOffer` Fields

| Name                |JSON Type         | [Internal Type][] | Required?   | Description |
|:--------------------|:-----------------|:------------------|:------------|:-----------|
| `Amount`            | object or string | AMOUNT            | Yes         | Amount expected or offered for the NFToken. If the token has the `lsfOnlyXRP` flag set, the amount must be specified in XRP. Sell offers that specify assets other than XRP must specify a non-zero amount. Sell offers that specify XRP can be 'free' (that is, the Amount field can be equal to `"0"`). |
| `Destination`       | string           | AccountID         | No          | The AccountID for which this offer is intended. If present, only that account can accept the offer. |
| `Expiration`        | number           | UInt32            | No          | The time after which the offer is no longer active. The value is the number of seconds since the Ripple Epoch. |
| `Flags`             | number           | UInt32            | Yes         | A set of flags associated with this object, used to specify various options or settings. Flags are listed in the table below. |
| `LedgerEntryType`   | string           | UInt16            | Yes         | The type of ledger object (0x0074). |
| `NFTokenID`         | string           | Hash256           | Yes         | NFTokenID of the NFToken object referenced by this offer. |
| `NFTokenOfferNode`  | string           | UInt64            | No          | Internal bookkeeping, indicating the page inside the token buy or sell offer directory, as appropriate, where this token is being tracked. This field allows the efficient deletion of offers. |
| `Owner`             | string           | AccountID         | Yes         | Owner of the account that is creating and owns the offer. Only the current Owner of an NFToken can create an offer to sell an NFToken, but any account can create an offer to buy an NFToken. |
| `OwnerNode`         | string           | UInt64            | No          | Internal bookkeeping, indicating the page inside the owner directory where this token is being tracked. This field allows the efficient deletion of offers. |
| `PreviousTxnID`     | string           | Hash256           | Yes         | Identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | number           | UInt32            | Yes         | Index of the ledger that contains the transaction that most recently modified this object. |



#### NFTokenOffer Flags


|Flag Name|Flag Value|Description|
|---|---|---|
| `lsfSellNFToken `| `0x00000001` | If enabled, the offer is a sell offer. Otherwise, the offer is a buy offer. |

## `NFTokenOffer` Transactions

Token offers on XRPL are stored sorted by quality in an order book and automatically matched by an on-ledger mechanism. An `NFTokenOffer` is not stored in an order book and is never automatically matched or executed.

A buyer must _explicitly_ choose to accept an `NFTokenOffer` that offers to buy an `NFToken`. Similarly, a seller must _explicitly_ choose to accept a specific `NFTokenOffer` that offers to buy an `NFToken` object that they own.

There are three defined transactions:



1. `NFTokenCreateOffer`


2. `NFTokenCancelOffer`


3. `NFTokenAcceptOffer`


### Locating `NFTokenOffer` objects

Each token has two directories. One contains offers to buy the token and the other containing offers to sell the token. This makes it easy to find `NFTokenOffer` for a particular token. It is expected that off-ledger systems will be used to retrieve, present, communicate and effectuate the creation, enumeration, acceptance or cancellation of offers. For example, a marketplace may offer intuitive web- or app-based interfaces for users.


### `NFTokenOffer` Reserve

Each `NFTokenOffer` object costs the account placing the offer one incremental reserve. As of this writing the incremental reserve is 5 XRP. The reserve can be recovered by cancelling the offer.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

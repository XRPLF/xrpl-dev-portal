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


<table>
  <tr>
   <td><strong>Field Name</strong>
   </td>
   <td><strong>Required?</strong>
   </td>
   <td><strong>JSON Type</strong>
   </td>
   <td><strong>Internal Type</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>Owner</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>AccountID
   </td>
   <td><code>Owner</code> of the account that is creating and owns the offer. Only the current <code>Owner</code> of an <code>NFToken</code> can create an offer to sell an <code>NFToken</code>, but any account can create an offer to buy an <code>NFToken</code>.
   </td>
  </tr>
  <tr>
   <td><code>LedgerEntryType</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UInt16
   </td>
   <td>The type of ledger object (<code>0x0074</code>).
   </td>
  </tr>
  <tr>
   <td><code>PreviousTxnID</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>Hash256
   </td>
   <td>Identifying hash of the transaction that most recently modified this object.
   </td>
  </tr>
  <tr>
   <td><code>PreviousTxnLgrSeq</code>
   </td>
   <td>Yes
   </td>
   <td>number
   </td>
   <td>UInt32
   </td>
   <td>Index of the ledger that contains the transaction that most recently modified this object.
   </td>
  </tr>
  <tr>
   <td><code>NFTokenID</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>Hash256
   </td>
   <td><code>NFTokenID</code> of the <code>NFToken</code> object referenced by this offer.
   </td>
  </tr>
  <tr>
   <td><code>Amount</code>
   </td>
   <td>Yes
   </td>
   <td>object or string
   </td>
   <td>AMOUNT
   </td>
   <td>Amount expected or offered for the <code>NFToken</code>. If the token has the <code>lsfOnlyXRP</code> flag set, the amount must be specified in XRP.
<p>
Sell offers that specify assets other than XRP must specify a non-zero amount. Sell offers that specify XRP can be 'free' (that is, the <code>Amount</code> field can be equal to <code>"0"</code>).
   </td>
  </tr>
  <tr>
   <td><code>Expiration</code>
   </td>
   <td>No
   </td>
   <td>number
   </td>
   <td>UInt32
   </td>
   <td>The time after which the offer is no longer active. The value is the number of seconds since the <a href="https://xrpl.org/basic-data-types.html#specifying-time">Ripple Epoch</a>.
   </td>
  </tr>
  <tr>
   <td><code>Destination</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>AccountID
   </td>
   <td>The <code>AccountID</code> for which this offer is intended. If present, only that account can accept the offer.
   </td>
  </tr>
  <tr>
   <td><code>OwnerNode</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>UInt64
   </td>
   <td>Internal bookkeeping, indicating the page inside the owner directory where this token is being tracked. This field allows the efficient deletion of offers.
   </td>
  </tr>
  <tr>
   <td><code>NFTokenOfferNode</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>UInt64
   </td>
   <td>Internal bookkeeping, indicating the page inside the token buy or sell offer directory, as appropriate, where this token is being tracked. This field allows the efficient deletion of offers.
   </td>
  </tr>
  <tr>
   <td><code>Flags</code>
   </td>
   <td>Yes
   </td>
   <td>number
   </td>
   <td>UInt32
   </td>
   <td>A set of flags associated with this object, used to specify various options or settings. Flags are listed in the table below.
   </td>
  </tr>
</table>



#### NFTokenOffer Flags


<table>
  <tr>
   <td><strong>Flag Name</strong>
   </td>
   <td><strong>Flag Value</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>lsfSellNFToken</code>
   </td>
   <td><code>0x00000001</code>
   </td>
   <td>If set, the offer is a sell offer. Otherwise, the offer is a buy offer.
   </td>
  </tr>
</table>

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

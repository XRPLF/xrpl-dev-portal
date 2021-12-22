---
html: nftokenoffer.html
parent: nft-concepts.html
blurb: Create offers to buy or sell NFTs.
filters:
 - include_code
labels:
 - Non-fungible Tokens, NFTs
status: not_enabled
---
# The `NFTokenOffer` Ledger Entry
{% include '_snippets/nfts-disclaimer.md' %}

Tokens that have the `lsfTransferable` flag set can be transferred among participants using offers.


## The `NFTokenOffer` ledger entry

The `NFTokenOffer` ledger entry represents an offer to buy, sell or transfer an `NFToken` object. The owner of a `NFToken` can use `NFTokenCreateOffer` to start a transaction.


### `NFTokenOfferID` Format

The unique ID (`NFTokenOfferID)` of the `NFTokenOffer` object is the result of the following values concatenated in order:



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
   <td>UINT16
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
   <td>UINT32
   </td>
   <td>Index of the ledger that contains the transaction that most recently modified this object.
   </td>
  </tr>
  <tr>
   <td><code>TokenID</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UINT256
   </td>
   <td><code>TokenID</code> of the <code>NFToken</code> object referenced by this offer.
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
   <td>UINT32
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
   <td>Account ID
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
   <td>UINT64
   </td>
   <td>Internal bookkeeping, indicating the page inside the owner directory where this token is being tracked. This field allows the efficient deletion of offers.
   </td>
  </tr>
  <tr>
   <td><code>OfferNode</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>UINT64
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
   <td>UINT32
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
   <td><code>lsfBuyToken</code>
   </td>
   <td><code>0x00000001</code>
   </td>
   <td>If set, the offer is a buy offer. Otherwise, the offer is a sell offer.
   </td>
  </tr>
  <tr>
   <td><code>lsfAuthorized</code>
   </td>
   <td><code>0x00000002</code>
   </td>
   <td>If set, the offer has been approved by the issuer. This flag can only be set by the <code>Issuer</code> of the token or an account authorized by the issuer (for example, the <code>MintAccount</code> listed in the account root of the <code>Issuer</code>) and only if the token has the flag indicating that authorization is required.
   </td>
  </tr>
</table>
## `NFTokenOffer` Transactions

Token offers on XRPL are stored sorted by quality in an order book and automatically matched by an on-ledger mechanism. An `NFTokenOffer` is not stored in an order book and is never automatically matched or executed.

A buyer must _explicitly_ choose to accept an `NFTokenOffer` that offers to buy an `NFToken`. Similarly, a seller must _explicitly_ choose to accept a specific `NFTokenOffer` that offers to buy an `NFToken` object that they own.


### Locating `NFTokenOffer` objects

Each token has two directories. One contains offers to buy the token and the other containing offers to sell the token. This makes it easy to find `NFTokenOffer` for a particular token. It is expected that off-ledger systems will be used to retrieve, present, communicate and effectuate the creation, enumeration, acceptance or cancellation of offers. For example, a marketplace may offer intuitive web- or app-based interfaces for users.


### `NFTokenOffer` Reserve

Each `NFTokenOffer` object costs the account placing the offer one incremental reserve. As of this writing the incremental reserve is 5 XRP. The reserve can be recovered by cancelling the offer.


### `NFTokenOffer` Transactions

There are three defined transactions:



1. `NFTokenCreateOffer`


2. `NFTokenCancelOffer`


3. `NFTokenAcceptOffer`
All three transactions have the generic set of transaction fields.


### `NFTokenCreateOffer` transaction

The `NFTokenCreateOffer` transaction creates either a new _Sell_ offer for an `NFToken` owned by the account executing the transaction, or a new _Buy_ offer for an `NFToken` owned by another account.

Each offer costs one incremental reserve.


#### `NFTokenCreateOffer` Fields


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
   <td><code>TransactionType</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UINT16
   </td>
   <td>Indicates the new transaction type <code>NFTokenCreateOffer</code>. The integer identifier is <code>27</code>.
   </td>
  </tr>
  <tr>
   <td><code>Account</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>AccountID
   </td>
   <td>Indicates the <code>AccountID</code> of the account that initiated the transaction.
   </td>
  </tr>
  <tr>
   <td><code>Owner</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>Account ID
   </td>
   <td>Indicates the <code>AccountID</code> of the account that owns the corresponding <code>NFToken</code>.
<ul>

<li>
If the offer is to buy a token, this field must be present and it must be different than <code>Account</code> (since an offer to buy a token one already holds is meaningless).

<li>If the offer is to sell a token, this field must not be present, as the owner is, implicitly, the same as <code>Account</code> (since an offer to sell a token one doesn't already hold is meaningless).
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><code>TokenID</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>Hash256
   </td>
   <td>Identifies the <code>TokenID</code> of the <code>NFToken</code> object that the offer references.
   </td>
  </tr>
  <tr>
   <td><code>Amount</code>
   </td>
   <td>Yes
   </td>
   <td>Currency Amount
   </td>
   <td>AMOUNT
   </td>
   <td>Indicates the amount expected or offered for the <code>Token</code>.
<p>
The amount must be non-zero, except where this is an offer to sell and the asset is XRP; then, it is legal to specify an amount of zero, which means that the current owner of the token is giving it away, gratis, either to anyone at all, or to the account identified by the <code>Destination</code> field.
   </td>
  </tr>
  <tr>
   <td><code>Expiration</code>
   </td>
   <td>No
   </td>
   <td>number
   </td>
   <td>UINT32
   </td>
   <td>Indicates the time after which the offer will no longer be valid. The value is the number of seconds since the <a href="https://xrpl.org/basic-data-types.html#specifying-time">Ripple Epoch</a>.
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
   <td>If present, indicates that this offer may only be accepted by the specified account. Attempts by other accounts to accept this offer MUST fail.
<p>
If succesful, <code>NFTokenCreateOffer</code> transaction results in the creation of <code>NFTokenOffer</code> object.
   </td>
  </tr>
  <tr>
   <td><code>Flags</code>
   </td>
   <td>Yes
   </td>
   <td>number
   </td>
   <td>UINT32
   </td>
   <td>A set of flags that specifies options or controls the behavior of the transaction. The flag is defined in the table below.
   </td>
  </tr>
</table>



#### `NFTokenCreateOffer` Flags


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
   <td><code>tfSellToken</code>
   </td>
   <td><code>0x00000001</code>
   </td>
   <td>If set, indicates that the offer is a sell offer. Otherwise, it is a buy offer.
   </td>
  </tr>
</table>


Note that the `Flags` field includes both transaction-specific and generic flags; all currently valid generics flags (for example, `tfFullyCanonicalSig`) are applicable, but not listed here.

The transactor does not allow unknown flags to be set.


## `NFTokenCancelOffer` transaction

The `NFTokenCancelOffer` transaction can be used to cancel existing token offers created using `NFTokenCreateOffer`.


### Permissions

An existing offer, represented by an `NFTokenOffer` object, can be cancelled by:



* The account that originally created the `NFTokenOffer`.
* The account in the `Destination` field of the `NFTokenOffer`, if one is present.
* The issuer of the token identified by the `TokenUID` field in the `NFTokenOffer` object, if the token has the `lsfIssuerCanCancelOffers` flag set.
* Any account, if the `NFTokenOffer` specifies an expiration time and the close time of the parent ledger in which the `NFTokenCancelOffer` is included is greater than the expiration time.

This transaction removes the listed `NFTokenOffer` object from the ledger, if present, and adjusts the reserve requirements accordingly. It is not an error if the `NFTokenOffer` cannot be found: if that is the case, the transaction should complete successfully.


### `NFTokenCancelOffer` Fields

An `NFTokenCancelOffer` object can have the following required and optional fields:


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
   <td><code>TransactionType</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UINT16
   </td>
   <td><code>NFTokenCancelOffer</code> transaction type . The integer identifier is <code>28</code>.
   </td>
  </tr>
  <tr>
   <td><code>TokenIDs</code>
   </td>
   <td>Yes
   </td>
   <td>array
   </td>
   <td>VECTOR256
   </td>
   <td>An array of <code>TokenID</code> objects, each identifying the <code>NFTokenOffer</code> object that should be cancelled by this transaction.
<p>
It is an error if an entry in this list points to an object that is not an <code>NFTokenOffer</code> object. It is not an error if an entry in this list points to an object that does not exist.
   </td>
  </tr>
</table>



## `NFTokenAcceptOffer` transaction

The `NFTokenAcceptOffer` transaction is used to accept offers to `buy` or `sell` an `NFToken`. It can either:



* Allow one offer to be accepted. This is called _direct_ mode.
* Allow two distinct offers, one offering to buy a given `NFToken` and the other offering to sell the same `NFToken`, to be accepted in an atomic fashion. This is called _brokered_ mode.


### Brokered vs. Direct Mode

The mode in which the transaction operates depends on the presence of the `SellOffer` and `BuyOffer` fields of the transaction:


<table>
  <tr>
   <td><strong><code>SellOffer</code></strong>
   </td>
   <td><strong><code>BuyOffer</code></strong>
   </td>
   <td><strong>Mode</strong>
   </td>
  </tr>
  <tr>
   <td>✔️
   </td>
   <td>✔️
   </td>
   <td>Brokered
   </td>
  </tr>
  <tr>
   <td>✔️
   </td>
   <td><B>X</B>
   </td>
   <td>Direct
   </td>
  </tr>
  <tr>
   <td><B>X</B>
   </td>
   <td>✔️
   </td>
   <td>Direct
   </td>
  </tr>
</table>


If neither of those fields is specified, the transaction is malformed and produces a `tem` class error.

The semantics of brokered mode are slightly different than one in direct mode: The account executing the transaction functions as a broker, bringing the two offers together and causing them to be matched, but does not acquire ownership of the involved NFT, which will, if the transaction is successful, be transferred directly from the seller to the buyer.


### Execution Details


#### Direct Mode

In direct mode, `NFTokenAcceptOffer` transaction fails if:



* The `NFTokenOffer` against which `NFTokenAcceptOffer` transaction is placed is an offer to `buy `the `NFToken` and the account executing the `NFTokenAcceptOffer` is not, at the time of execution, the current owner of the corresponding `NFToken`.
* The `NFTokenOffer` against which `NFTokenAcceptOffer` transaction is placed is an offer to `sell `the `NFToken` and was placed by an account which is not, at the time of execution, the current owner of the `NFToken`
* The `NFTokenOffer` against which `NFTokenAcceptOffer` transaction is placed is an offer to `sell `the `NFToken` and was placed by an account which is not, at the time of execution, the `Account` in the recipient field of the `NFTokenOffer`, if there exist one.
* The `NFTokenOffer` against which `NFTokenAcceptOffer` transaction is placed specifies an `expiration` time and the close time field of the parent of the ledger in which the transaction would be included has already passed.
* The `NFTokenOffer` against which `NFTokenAcceptOffer` transaction is placed to buy or sell the `NFToken `is owned by the account executing the `NFTokenAcceptOffer`.

A side-effect of such failures is the removal of the `NFTokenOffer` object and the refund of the incremental reserve as if the offer had been cancelled. This necessitates the use of an appropriate `tec` class error.

If the transaction is executed successfully then:

* The relevant `NFTtoken` changes ownership, meaning that the token is removed from the `NFTokenPage` of the existing `owner` and added to the `NFTokenPage` of the new `owner`.
* Funds are transferred from the buyer to the seller, as specified in the `NFTokenOffer`. If the corresponding `NFToken` offer specifies a `TransferRate`, then the `issuer` receives the specified percentage, with the balance going to the seller of the `NFToken`.


#### Brokered Mode

In brokered mode, the `NFTokenAcceptOffer` transaction fails if:



* The `buy` `NFTokenOffer` against which the  `NFTokenAcceptOffer` transaction is placed is owned by the account executing the transaction.
* The `sell` `NFTokenOffer` against which the `NFTokenAcceptOffer` transaction is placed is owned by the account executing the transaction.
* The account that placed the offer to sell the `NFToken` is not, at the time of execution, the current owner of the corresponding `NFToken`.
* Either offer (`buy` or `sell`) specifies an `expiration` time and the close time field of the parent of the ledger in which the transaction would be included has already passed.


### Fields


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
   <td><code>TransactionType</code>
   </td>
   <td>Yes
   </td>
   <td>string
   </td>
   <td>UINT16
   </td>
   <td>Transaction type <code>NFTokenAcceptOffer</code>. The sequence number of a previous <code>NFTokenCreateOffer</code> transaction. The integer identifier is <code>29</code>.
   </td>
  </tr>
  <tr>
   <td><code>SellOffer</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>UINT256
   </td>
   <td>Identifies the <code>NFTokenOffer</code> that offers to sell the <code>NFToken</code>.
<p>
In direct mode this field is optional, but you must specify either the <code>SellOffer</code> or the <code>BuyOffer</code>. In brokered mode, you must specify both the <code>SellOffer</code> and the <code>BuyOffer</code>.
   </td>
  </tr>
  <tr>
   <td><code>BuyOffer</code>
   </td>
   <td>No
   </td>
   <td>string
   </td>
   <td>UINT256
   </td>
   <td>Identifies the <code>NFTokenOffer</code> that offers to buy the <code>NFToken</code>.
<p>
In direct mode, this field is optional, but you must specify either the <code>SellOffer</code> or the <code>BuyOffer</code>. In brokered mode, you must specify both the <code>SellOffer</code> and the <code>BuyOffer</code>.
   </td>
  </tr>
  <tr>
   <td><code>BrokerFee</code>
   </td>
   <td>no
   </td>
   <td>object or string
   </td>
   <td>Amount
   </td>
   <td>This field is only valid in brokered mode, and specifies the amount that the broker keeps as part of their fee for bringing the two offers together; the remaining amount is sent to the seller of the <code>NFToken</code> being bought. If specified, the fee must be such that, prior to accounting for the transfer fee charged by the issuer, the amount that the seller would receive is at least as much as the amount indicated in the sell offer.
   </td>
  </tr>
</table>


This functionality is intended to allow the `owner` of an `NFToken` to offer their token for sale to a third party broker, who may then attempt to sell the `NFToken` on for a larger amount, without the broker having to own the `NFToken` or custody funds.

If both offers are for the same asset, it is possible that the order in which funds are transferred might cause a transaction that would succeed to fail due to an apparent lack of funds. To ensure deterministic transaction execution and maximize the chances of successful execution, the account attempting to buy the `NFToken` is debited first. Funds due to the broker are credited _before_ crediting the seller.

In brokered mode, The offers referenced by `BuyOffer` and `SellOffer` must both specify the same `TokenID`; that is, both must be for the same `NFToken`.

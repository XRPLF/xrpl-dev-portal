# Transactions #

A *Transaction* is the only way to modify the Ripple Ledger. There are several different types of transactions that perform different actions:

* [Payment - Send funds from one account to another](#payment)
* [AccountSet - Set options on an account](#accountset)
* [SetRegularKey - Set an account's regular key](#setregularkey)
* [OfferCreate - Submit an order to exchange currency](#offercreate)
* [OfferCancel - Withdraw a currency-exchange order](#offercancel)
* [TrustSet - Add or modify a trust line](#trustset)

Every transaction has the same basic fields, and each type adds a few additional fields that are relevant to that type of transaction. Transactions can exist in a signed or unsigned state, but only signed transactions can be submitted to the network and included in ledgers. You can either:

* Construct and sign a transaction yourself before submitting it, or
* Construct a transaction and submit it, along with your account secret, to a `rippled` server to sign and submit all at once. (Transmitting your account secret is dangerous, so you should only do this from within a trusted and/or encrypted sub-net.)

Multi-signature transactions are [in development](https://wiki.ripple.com/Multisign).

Additionally, there are *Psuedo-Transactions* that are not created and submitted in the usual way, but may appear in ledgers:

* Feature - Adopt a new feature in the network
* Fee - Adjust the minimum transaction fee or account reserve

## All Transactions ##

Every transaction has a the same set of fundamental properties:

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| Account | String | Account | The unique address of the account that initiated the transaction |
| [Fee](#transaction-fees) | String | Amount | Amount of XRP in drops to be destroyed as a fee for redistributing this transaction to the network. |
| Flags | Unsigned Integer | UInt32 | (Optional) Set of bit-flags for this transaction |
| [LastLedgerSequence](#lastledgersequence) | Number | UInt32 | (Optional, but strongly recommended) Highest ledger sequence number that a transaction can appear in. |
| [Memos](#memos) | Array of Objects | Array | (Optional) Additional arbitrary information used to identify this transaction. |
| [PreviousTxnID](#previoustxnid) | String | Hash256 | (Optional) Hash value identifying a transaction. If the transaction immediately prior this one by sequence number does not match the provided hash, this transaction is considered invalid. |
| [Sequence](#canceling-or-skipping-a-transaction) | Unsigned Integer | UInt32 | The sequence number, relative to the initiating account, of this transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the last-valided transaction from the same account. |
| SigningPubKey | String | PubKey | (Omitted until signed) Hex representation of the public key that corresponds to the private key used to sign this transaction. |
| SourceTag | Unsigned Integer | UInt32 | (Optional) Arbitrary integer used to identify the reason for this payment, or the hosted wallet on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| TransactionType | String | UInt16 | The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, and `AccountSet`. |
| TxnSignature | String | VariableLength | (Omitted until signed) The signature that verifies this transaction as originating from the account it says it is from |

### Transaction Fees ###

The `Fee` field specifies an amount, in drops of XRP, that must be deducted from the sender's balance in order to relay any transaction through the network. This is a measure to protect against spam and DDoS attacks weighing down the whole network. You can specify any amount in the `Fee` field when you create a transaction. If your transaction makes it into a validated leger (whether or not it achieves its intended purpose), then the deducted XRP is destroyed forever.

Each rippled server decides on the minimum fee to require, which is at least the global base transaction fee, and increases based on the individual server's current load. If a transaction's fee is not high enough, then the server does not relay the transaction to other servers. (*Exception:* If you send a transaction to your own server over an admin connection, it relays the transaction even under high load, so long as the fee meets the global base.)

Even if some servers have too much load to propagate a transaction, the transaction can still make it into a validated ledger as long as a large enough percentage of validating servers receive it, so the global base fee is generally enough to submit a transaction. If many servers in the network are under high load all at once (for example, due to a DDoS or a global event of some sort) then you must either set the fee higher or wait for the load to decrease. 

For more information, see the [Transaction Fee wiki article](https://wiki.ripple.com/Transaction_Fee).

### Canceling or Skipping a Transaction ###

An important and intentional feature of the Ripple Network is that a transaction is final as soon as it has been incorporated in a validated ledger. 

However, if a transaction has not yet been included in a validated ledger, you can effectively cancel it by rendering it invalid. Typically, this means sending another transaction with the same `Sequence` value from the same account. If you do not want to perform the same transaction again, you can perform an [AccountSet](#accountset) transaction with no options. 

For example, if you attempted to submit 3 transactions with sequence numbers 11, 12, and 13, but transaction 11 gets lost somehow or does not have a high enough [transaction fee](#transaction-fees) to be propagated to the network, then you can cancel transaction 11 by submitting an AccountSet transaction with no options and sequence number 11. This does nothing (except destroying the transaction fee for the new transaction 11), but it allows transactions 12 and 13 to become valid.

This approach is preferable to renumbering and resubmitting transactions 12 and 13, because it prevents transactions from being effectively duplicated under different sequence numbers.

In this way, an AccountSet transaction with no options is the canonical "no-op" transaction.

### LastLedgerSequence ###

We strongly recommend that you specify the `LastLedgerSequence` parameter on every transaction. Provide a value of about 3 higher than [the most recent ledger index](rippled-apis.html#ledger) to ensure that your transaction is either validated or rejected within a matter of seconds. 

Without the `LastLedgerSequence` parameter, there is a particular situation that can occur and cause your transaction to be stuck in an undesirable state where it is neither validated nor rejected for a long time. Specifically, if the global base [transaction fee](#transaction-fees) increases after you send a transaction, your transaction may not get propagated enough to be included in a validated ledger, but you would have to pay the (increased) fee in order to send another transaction canceling it. Later, if the transaction fee decreases again, the transaction may become viable again. The `LastLedgerSequence` places a hard upper limit on how long the transaction can wait to be validated or rejected.

### PreviousTxnID ###

The `PreviousTxnID` field lets you chain your transactions together, so that a current transaction is not valid unless the previous one is also valid and completed as expected.

One situation in which this is useful is if you have a primary system for submitting transactions and a passive backup system. If the passive backup system becomes disconnected from the primary, but the primary is not fully dead, and they both begin operating at the same time, you could potentially encounter serious problems like some transactions sending twice and others not at all. Chaining your transactions together with `PreviousTxnID` ensures that, even if both systems are active, only one of them can submit valid transactions at a time.

### Memos ###

The Memos field allows for arbitrary messaging data that can accompany the transaction. It is presented as an array of objects, where each object has the following fields:

| Field | Type | Description |
|-------|------|-------------|
| MemoType | String | Arbitrary descriptor of the memo's format. We recommend using MIME types. |
| MemoData | (Variable) | Any data representing the memo's content. |
| (...) | (Variable) | Arbitrary additional fields such as `Account`, `RegularKey`, etc. that can be used to support features such as encryption. |

The memos field is currently limited to no more than 1KB in size.

### Flags ###

The Flags field allows for additional boolean options regarding the behavior of a transaction. They are represented as binary values that can be bitwise-or added to set multiple flags at once.

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the `TransactionType` field when setting and reading flags.

The only flag that applies globally to all transactions is as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfFullyCanonicalSig | 0x80000000 | 2147483648 | Require a fully-canonical signature, to protect a transaction from [transaction malleability](https://wiki.ripple.com/Transaction_Malleability) exploits. |



## Payment ##

A Payment transaction represents a transfer of value from one account to another. (Depending on the path taken, additional exchanges of value may occur atomically to facilitate the payment.)

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| Amount | String (XRP)<br/>Object (Otherwise) | Amount | The amount of currency sent as part of this transaction. (See [Specifying Currency Amounts](rippled-apis.html#specifying-currency-amounts)) |
| Destination | String | Account | The unique address of the account receiving the payment. |
| DestinationTag | Unsigned Integer | UInt32 | (Optional) Arbitrary tag that identifies the reason for the payment to the destination, or the hosted wallet to make a payment to. |
| InvoiceID | String | Hash256 | (Optional) Arbitrary 256-bit hash representing a specific reason or identifier for this payment. |
| Paths | Array of path arrays | PathSet | (Optional, but recommended) Array of [payment paths](https://ripple.com/wiki/Payment_paths) to be used for this transaction. If omitted, the paths are chosen by the server. |
| SendMax | String/Object | Amount | Highest amount of currency this transaction is allowed to cost; this is to compensate for [slippage](http://en.wikipedia.org/wiki/Slippage_%28finance%29). (See [Specifying Currency Amounts](rippled-apis.html#specifying-currency-amounts)) |

### Paths ###

The `Paths` field is a set of different paths along which the payment can be made. A single transaction can potentially follow multiple paths, for example if the transaction exchanges currency using several different offers in order to achieve the best rate. The source and destination (that is, the endpoints of the path) are omitted from the path array because they are part of the transaction definition.

You can get suggestions of paths from rippled servers using the [`path_find`](#path-find) or [`ripple_path_find`](#ripple-path-find) commands. We recommend always including looking up the paths and including them as part of the transaction, because there are no guarantees on how expensive the paths the server finds will be at the time of submission. (Although `rippled` is designed to search for the cheapest paths possible, it may not always find them. Untrustworthy `rippled` instances could also be modified to change this behavior for profit.)

An empty `Paths` array indicates a direct transfer: either because the sending and receiving accounts are directly linked by a trust line in the currency being transferred, or because the transaction is sending XRP.

### Payment Flags ###

Transactions of the Payment type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfNoDirectRipple | 0x00010000 | 65536 | Do not use a direct path, if available. This is intended to force the transaction to take arbitrage opportunities. Most clients will not need this. |
| tfPartialPayment | 0x00020000 | 131072 | Instead of deducting transfer and exchange fees from the sending account's balance, reduce the received amount by the fee amounts. This is useful for refunding payments. Note, the transaction fee is still subtracted from the sender's account. |



## AccountSet ##

An AccountSet transaction modifies the properties of an account object in the global ledger.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| [ClearFlag](#account-set-flags) | Unsigned Integer | UInt32 | (Optional) Unique identifier of a flag to disable for this account. |
| [Domain](#domain) | String | VariableLength | (Optional) The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase. |
| EmailHash | String | Hash128 | (Optional) Hash of an email address to be used for generating an avatar image. Conventionally, clients use [Gravatar](http://en.gravatar.com/site/implement/hash/) to display this image. |
| MessageKey | String | PubKey | (Optional) Public key for sending encrypted messages to this account. Conventionally, it should be a secp256k1 key, the same encryption that is used by the rest of Ripple |
| [SetFlag](#account-set-flags) | Unsigned Integer | UInt32 | (Optional) Unique identifier of a flag to enable for this account. |
| [TransferRate](#transferrate) | Unsigned Integer | UInt32 | (Optional) The fee to charge when users transfer this account's issuances, represented as billionths of a unit. Use `0` to set no fee. |
| WalletLocator | String | Hash256 | (Optional) Not used. |
| WalletSize | Unsigned Integer | UInt32 | (Optional) Not used. |

If none of these options are provided, then the AccountSet transaction has no effect (beyond destroying the transaction fee). See [Canceling or Skipping a Transaction](#canceling-or-skipping-a-transaction) for more details.

### Domain ###

The `Domain` field is represented as the hex string of the lowercase ASCII of the domain. For example, the domain *example.com* would be represented as `"6578616d706c652e636f6d"`.

Client applications can use the [ripple.txt](https://ripple.com/wiki/Ripple.txt) file hosted by the domain to confirm that the account is actually operated by that domain.

### Account Set Flags ###

There are several options which can be either enabled or disabled for an account. Account Options are represented by different types of flags depending on the situation:

* The `AccountSet` transaction type has several "AccountSet Flags" (prefixed *asf*) that can enable an option when passed as the `SetFlag` parameter, or disable an option when passed as the `ClearFlag` parameter.
* The `AccountSet` transaction type has several **DEPRECATED** transaction flags (prefixed *tf*) that can be used to enable or disable specific account options when passed in the `Flags` parameter. This style is deprecated, and new account options will not have new corresponding transaction flags.
* The `AccountRoot` ledger node type has several ledger-specific-flags (prefixed *lsf*) which represent the state of particular account options within a particular ledger. Naturally, the values apply until a later ledger version changes them.

The preferred way to enable and disable Account Flags is using the `SetFlag` and `ClearFlag` parameters of an AccountSet transaction. AccountSet flags have names that begin with *asf*.

All flags are off by default.

The available AccountSet flags are:

| Flag Name | Decimal Value | Description | Corresponding Ledger Flag |
|-----------|---------------|-------------|---------------------------|
| asfRequireDest | 1 | Require a destination tag to send transactions to this account. | lsfRequireDestTag |
| asfRequireAuth | 2 | Require authorization for users to extend trust to this account. (This prevents users unknown to a gateway from holding funds issued by that gateway.) | lsfRequireAuth |
| asfDisallowXRP | 3 | XRP should not be sent to this account. (Enforced by client applications, not by `rippled`) | lsfDisallowXRP |
| asfDisableMaster | 4 | Disallow use of the master key <span class='draft-comment'>(Are there exceptions to this?)</span> | lsfDisableMaster |
| asfAccountTxnID | 5 | Enable/disable <span class='draft-comment'>transaction tracking (??!)</span> | <span class='draft-comment'>???</span> |
| asfNoFreeze | 6 | Set to permanently give up the ability to freeze individual trust lines. This flag can never be cleared. | lsfNoFreeze |
| asfGlobalFreeze | 7 | Freeze/Unfreeze all assets issued by this account | lsfGlobalFreeze |

The following [Transaction flags](#flags), specific to the AccountSet transaction type, are **DEPRECATED**: *tfRequireDestTag*, *tfOptionalDestTag*, *tfRequireAuth*, *tfOptionalAuth*, *tfDisallowXRP*, *tfAllowXRP*.

#### Blocking Incoming Transactions ####

Incoming transactions with unclear purposes may be an inconvenience for some gateways, which would have to identify whether a mistake was made, and then potentially refund accounts or adjust balances depending on the mistake. The `asfRequireDest` and `asfDisallowXRP` flags are intended to protect users from accidentally sending funds to a gateway in a way that is unclear about the reason the funds were sent.

For example, a destination tag is typically used to identify which hosted balance should be credited when the gateway receives a payment. If the destination tag is omitted, it may be unclear which account should be credited, creating a need for refunds, among other problems. By using the `asfRequireDest` tag, the gateway (or any account) can ensure that every incoming payment has a destination tag, which makes it harder to send an ambiguous payment by accident.

Accounts can protect against unwanted incoming payments for non-XRP currencies simply by not creating trust lines in those currencies. Since XRP does not require trust, the `asfDisallowXRP` flag is used to discourage users from sending XRP to an account. However, this flag is not enforced in `rippled` because it could potentially cause accounts to become unusable. (If an account did not have enough XRP to meet the reserve and make a transaction that disabled the flag, the account would never be able to send another transaction.) Instead, client applications should disallow or discourage XRP payments to accounts with the `asfDisallowXRP` flag enabled.

### TransferRate ###

TransferRate allows issuing gateways to charge users for sending funds to other users of the same gateway. It adds a fee, specified in billionths of a unit (for all non-XRP currencies) that applies when a user pays another user in the currency issued by this account. The fee "disappears" from the balances on the ledger, becoming the property of the issuing gateway. The value cannot be less than 1000000000. (Less than that would indicate giving away money for sending transactions, which is exploitable.) You can specify 0 as a shortcut for 1000000000, meaning no fee.

For example, if HighFeeGateway issues USD and sets the `TransferRate` to 120000000 and Norman wants to send Arthur $100 of USD issued by HighFeeGateway, Norman would have to spend $120 in order for Arthur to receive $100. The other $20 would no longer be tracked on the Ripple Ledger, and would become the property of HighFeeGateway instead.



## SetRegularKey ##

[[Source]<br>](https://github.com/ripple/rippled/blob/develop/src/ripple/module/app/transactors/SetRegularKey.cpp "Source")

A SetRegularKey transaction changes the regular key used by the account to sign future transactions.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| RegularKey | String | PubKey | <span class='draft-comment'>(Optional?)</span> Public key of a new keypair to use as the regular key to this account, as a base-58-encoded string; or the value `0` to remove the existing regular key. |

Instead of using an account's master key to sign transactions, you can set an alternate key pair, called the "Regular Key". As long as the public key for this key pair is set in the `RegularKey` field of an account this way, then the secret of the Regular Key pair can be used to sign transactions. (The master secret can still be used, too.) 

A Regular Key pair can be changed, but a Master Key pair is an intrinsic part of the account's identity (the address is derived from the master public key) so the Master Key cannot be changed. Therefore, using a Regular Key whenever possible is beneficial to security.

When the Regular Key is compromised, you can use the this transaction type to change it. As a special feature, each account is allowed to perform SetRegularKey transaction *without* a transaction fee exactly one time ever. To do so, submit a SetRegularKey transaction with a `Fee` value of 0, signed by the account's master key. (This way, you can potentially take back your account even if an attacker has already used up all the account's spare XRP.) <span class='draft-comment'>(Note: confirm that this is still exactly how that works.)</span>



## OfferCreate ##

An OfferCreate transaction is effectively a [limit order](http://en.wikipedia.org/wiki/limit_order). It defines an intent to exchange currencies, and typically creates an Offer node in the global ledger. Offers can be partially fulfilled.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| [Expiration](#expiration) | Unsigned Integer | UInt32 | (Optional) Time after which the offer is no longer active, in seconds since the Ripple Epoch. |
| OfferSequence | Unsigned Integer | UInt32 | (Optional) The sequence number of a previous OfferCreate transaction. If specified, cancel any offer node in the ledger that was created by that transaction. |
| TakerGets | Object (Non-XRP), or <br/>String (XRP) | Amount | The amount and type of currency being provided by the offer creator. |
| TakerPays | Object (Non-XRP), or <br/>String (XRP) | Amount | The amount and type of currency being requested by the offer creator. |

### Lifecycle of an Offer ###

When an OfferCreate transaction is processed, it automatically consumes matching offers to the extent possible. (These matching offers may even provide a better exchange rate than specified in the offer; if so, the offer creator could pay less than the full `TakerGets` amount in order to receive the entire `TakerPays` amount.) If that does not completely fulfill the `TakerPays` amount, then the offer becomes a passive offer node in the ledger. (You can use [OfferCreate Flags](#offercreate-flags) to modify this behavior.)

An offer in the ledger can be fulfilled either by additional OfferCreate transactions that match up with the existing offers, or by [Payments](#payment) that use the offer to connect the payment path. Offers can be partially fulfilled and partially funded.

<span class='draft-comment'>Offer fulfillment ignores trust limits and creates a trust lines with a zero limit as necessary. If an insufficient reserve from the offer maker is available to create the line, the offer is considered unfunded. (Explanation needed)</span>

You can create an Offer so long as you have at least some <span class='draft-comment'>(details needed)</span> of the currency specified by the `TakerGets` parameter of the offer. Any amount of that currency you have, up to the `TakerGets` amount, will be sold until the `TakerPays` amount is satisfied. An offer cannot place anyone in debt.

It is possible for an offer to become temporarily *unfunded*:

* The creator no longer has any of the `TakerGets` currency.
  * The offer will become funded again when the creator obtains more of that currency.
* If the currency required to fund the offer is held in a [frozen trust line](https://wiki.ripple.com/Freeze).
  * The offer will become funded again when the trust line is no longer frozen.

An offer becomes *permanently* inactive when any of the following happen:

* It becomes fully claimed by a Payment or a matching OfferCreate transaction.
* The Expiration date included in the offer is prior to the most recently-closed ledger. (See [Expiration](#expiration).)
* A subsequent OfferCancel or OfferCreate transaction explicitly cancels the offer.
* <span class='draft-comment'>The creator of the offer places a new offer that crosses it (categorically? or just if the two offers cancel out? Does tfPassive matter?)</span>
* <span class='draft-comment'>Unfunded offers are deleted when encountered during transaction processing. (Even if they might become funded later?)</span>

### Offer Preference ###

Existing offers are grouped by "quality", which is measured as the ratio between `TakerGets` and `TakerPays`. Offers with a higher quality are taken preferentially. (That is, the person accepting the offer receives as much as possible for the amount of currency they pay out.) Offers with the same quality are taken on the basis of which offer was placed in the earliest ledger version.

When offers of the same quality are placed in the same ledger version, the "canonical order" of the transactions, as agreed by consensus, determines which is taken first. <span class='draft-comment'>(Confirm what determines canonical order. This behavior has to be well-defined so that independent servers can remain in sync.)</span>

### Expiration ###

Since transactions can take time to propagate and confirm, the timestamp of a ledger is used to determine offer validity. An offer only expires when its Expiration time occurs prior to the most-recently validated ledger. In other words, an offer with an `Expiration` field is still considered "active" if its expiration time is later than the timestamp of the most-recently validated ledger, regardless of what your local clock says.

You can determine the final disposition of an offer with an `Expiration` as soon as you see a fully-validated ledger with a close time equal to or greater than the expiration time.

*Note:* Since only new transactions can modify the ledger, an expired offer can remain on the ledger after it becomes inactive. The offer is treated as unfunded and has no effect, but it can continue to appear in results (for example, from the [ledger_entry](rippled-apis.html#ledger-entry) command). Later on, the expired offer can get finally deleted as a result of another transaction (such as another OfferCreate) if the server encounters it while processing.

### OfferCreate Flags ###

Transactions of the OfferCreate type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfPassive | 0x00010000 | 65536 | If enabled, the offer will go straight to being a node in the ledger, without trying to consume matching offers first. |
| tfImmediateOrCancel | 0x00020000 | 131072 | Treat the offer as an [Immediate or Cancel order](http://en.wikipedia.org/wiki/Immediate_or_cancel). If enabled, the offer will never become a ledger node: it only attempts to match existing offers in the ledger. |
| tfFillOrKill | 0x00040000 | 262144 | Treat the offer as a [Fill or Kill order](http://en.wikipedia.org/wiki/Fill_or_kill). Only attempt to match existing offers in the ledger, and only do so if the entire `TakerPays` quantity can be obtained. |
| tfSell | 0x00080000 | 524288 | Exchange the entire `TakerGets` amount, even if it means obtaining more than the `TakerPays` amount in exchange. |

<span class='draft-comment'>(Some combinations of these are disallowed, right? For example, tfPassive vs. tfImmediateOrCancel seem mutually exclusive.)</span>

## OfferCancel ##

An OfferCancel transaction removes an Offer node from the global ledger.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| OfferSequence | Unsigned Integer | UInt32 | The sequence number of the offer to cancel. |

*Tip:* To remove an old offer and replace it with a new one, you can use an [OfferCreate](#offercreate) transaction with an `OfferSequence` parameter, instead of using OfferCancel.

The OfferCancel method returns [tesSUCCESS](https://ripple.com/wiki/Transaction_errors) even if it did not find an offer with the matching sequence number.


## TrustSet ##

Create or modify a trust line linking two accounts.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| LimitAmount | Object | Amount | The maximum amount of currency, issued by the other party, that that the account is willing to hold. |
| QualityIn | Unsigned Integer | UInt32 | (Optional) <span class='draft-comment'>% fee for incoming value on this line, represented as an integer over 1,000,000,000</span> |
| QualityOut | Unsigned Integer | UInt32 | (Optional) <span class='draft-comment'>% fee for outgoing value on this line, represented as an integer over 1,000,000,000</span> |

<span class='draft-comment'>(Where do you specify which account you're extending trust to? In the LimitAmount object?</span>

### Trust Limits ###

All balances on the Ripple Network, except for XRP, represent money owed in the real world. The account that issues those funds in Ripple (identified by the `issuer` field of the currency object) is responsible for paying money back, outside of the Ripple Network, when users redeem their Ripple balances by returning them to the issuing account. 

Since a computer program cannot force the gateway to keep its promise and not default in real life, trust lines represent a way of configuring how much you are willing to trust the issuing account to hold on your behalf. Since a large, reputable issuing gateway is more likely to be able to pay you back than, say, your broke roommate, you can set different limits on each trust line, to indicate the maximum amount you are willing to let the issuing account "owe" you (off the network) for the funds that you hold on the network. In the case that the issuing account defaults or goes out of business, you can lose up to that much money because the balances you hold in the Ripple Network can no longer be exchanged for equivalent balances off the network.

A trust line with a limit of 0 is equivalent to no trust line.

### Quality ###

<span class='draft-comment'>(TODO)</span>

### TrustSet Flags ###

Transactions of the TrustSet type support additional values in the [`Flags` field](#flags), as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|-----------|-----------|---------------|-------------|
| tfSetAuth | 0x00010000 | 65536 | Authorize the other party to hold issuances from this account. (No effect unless using the [*asfRequireAuth* AccountSet flag](#accountset-flags).) Cannot be unset. |
| tfSetNoRipple | 0x00020000 | 131072 | Blocks rippling between two trustlines of the same currency, if this flag is set on both. |
| tfClearNoRipple | 0x00040000 | 262144 | Clears the No-Rippling flag. |
| tfSetFreeze | 0x00100000 | 1048572 | [Freeze](https://wiki.ripple.com/Freeze) the trustline.
| tfClearFreeze | 0x00200000 | 2097152 | Unfreeze the trustline. |

### High Account, Low Account ###

Trust lines are conceptualized as one-directional lines controlled by a single party; however, for optimization purposes, they are represented in the ledger as a single trust two-way trust line. Each account that is a party to a trust line is arbitrarily deemed either the "High" or "Low" account (depending on which one has higher the numerical representation of their account address). Flags and values generally apply to one or the other side of the trust line. <span class='draft-comment'>(This section should probably be rewritten or removed. It doesn't feel useful right now. Maybe more relevant in the ledger format page?)</span>

# Pseudo-Transactions #

Pseudo-Transactions are never submitted by users, nor propagated through the network. Instead, a server may choose to inject them in a proposed ledger directly. If enough servers inject an equivalent pseudo-transaction for it to pass consensus, then it becomes included in the ledger, and appears in ledger data thereafter.

Some of the fields that are mandatory for normal transactions do not make sense for psuedo-transactions. In those cases, the pseudo-transaction has the following default values:

| Field | Default Value |
|-------|---------------|
| Account | [ACCOUNT_ZERO](https://wiki.ripple.com/Accounts#ACCOUNT_ZERO) |
| Sequence | 0 |
| Fee | 0 |
| SigningPubKey | "" |
| Signature | "" |

## Amendment ##

A new feature. <span class='draft-comment'>Not implemented?</span>

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| Amendment | N/A | Hash256 | A unique identifier for the new feature or rule change to be applied. |

<span class='draft-comment'>(Supposedly there's a several-weeks-long waiting period before an Amendment applies. How is that determined? Based on closed ledger time, presumably?)</span>

<span class='draft-comment'>(TODO)</span>

## Fee ##

A change in transaction or account fees. This is typically in response to changes in the load on the network.

| Field | JSON Type | [Internal Type](https://wiki.ripple.com/Binary_Format) | Description |
|-------|-----------|---------------|-------------|
| BaseFee | <span class='draft-comment'>String (quoted integer?)</span> | UInt64 | The charge, in drops, for the reference transaction |
| ReferenceFeeUnits | <span class='draft-comment'>Unsigned Integer?</span> | UInt32 | The cost, in fee units, of the reference transaction |
| ReserveBase | <span class='draft-comment'>Unsigned Integer?</span> | UInt32 | The base reserve, in drops |
| ReserveIncrement | <span class='draft-comment'>Unsigned Integer?</span> |UInt32 | The incremental reserve, in drops |

<span class='draft-comment'>(TODO)</span>

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
* Construct a transaction and submit it, along with your signature, to a `rippled` server to sign and submit all at once. (Transmitting your account secret is dangerous, so you should only do this from within a trusted and/or encrypted sub-net.)

Multi-signature transactions are [in development](https://wiki.ripple.com/Multisign).

Additionally, there are *Psuedo-Transactions* that are not created and submitted in the usual way, but may appear in ledgers:

* Feature - Adopt a new feature in the network
* Fee - Adjust the minimum transaction fee or account reserve

## All Transactions ##

Every transaction has a the same set of fundamental properties:

| Field | JSON Type | Internal Type | Description |
|-------|-----------|---------------|-------------|
| Account | String | Account | The unique address of the account that initiated the transaction |
| Fee | String | Amount of XRP in drops to be destroyed from the sendering account's balance as a fee for redistributing this transaction to the network. (See [Transaction Fees](https://ripple.com/wiki/Transaction_Fee) |
| Flags | Unsigned Integer | (Optional) Set of bit-flags for this transaction |
| LastLedgerSequence | Number | (Optional, but strongly recommended) Highest ledger sequence number that a transaction can appear in. If this is specified, and the transaction is not included by the time the specified ledger sequence number is closed and validated, then the transaction is considered to have failed and will no longer be valid. |
| Memos | Array of Objects | (Optional) Additional arbitrary information used to identify this transaction. See [Memos](#memos) for more details. |
| PreviousTxnID | String | (Optional) Hash value identifying a transaction. If the transaction immediately prior this one by sequence number does not match the provided hash, this transaction is considered invalid. |
| Sequence | Unsigned Integer | The sequence number, relative to the initiating account, of this transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the last-valided transaction from the same account. |
| SigningPubKey | String | (Omitted until signed) Hex representation of the public key that corresponds to the private key used to sign this transaction. |
| SourceTag | Unsigned Integer | (Optional) Arbitrary integer used to identify the reason for this payment, or the hosted wallet on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| TransactionType | String | The type of transaction. Valid types include: `Payment`, `OfferCreate`, `OfferCancel`, `TrustSet`, and `AccountSet`. |
| TxnSignature | String | (Omitted until signed) The signature that verifies this transaction as originating from the account it says it is from |

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
| <span class='draft-comment'>(Unnamed?)</span> | 0x80000000 | 2147483648 | Require a fully-canonical signature, to protect a transaction from [transaction malleability](https://wiki.ripple.com/Transaction_Malleability) exploits. |



## Payment ##

| Field | Type | Description |
|-------|------|-------------|
| Amount | String (XRP)<br/>Object (Otherwise) | The amount of currency sent as part of this transaction. (See [Specifying Currency Amounts](rippled-apis.html#specifying-currency-amounts)) |
| Destination | String | The unique address of the account receiving the payment. |
| DestinationTag | Unsigned Integer | (Optional) Arbitrary tag that identifies the reason for the payment to the destination, or the hosted wallet to make a payment to. |
| InvoiceID | String | (Optional) Arbitrary 256-bit hash representing a specific reason or identifier for this payment. |
| Paths | Array of path arrays | (Optional, but recommended) Array of [payment paths](https://ripple.com/wiki/Payment_paths) to be used for this transaction. If omitted, the paths are chosen by the server. |
| SendMax | String/Object |  Highest amount of currency this transaction is allowed to cost; this is to compensate for [slippage](http://en.wikipedia.org/wiki/Slippage_%28finance%29). (See [Specifying Currency Amounts](rippled-apis.html#specifying-currency-amounts)) |

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

| Field | Type | Description |
|-------|------|-------------|
| ClearFlag | Unsigned Integer | (Optional) Unique identifier of a flag to disable for this account. |
| Domain | String | (Optional) The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase. |
| EmailHash | String | (Optional) Hash of an email address to be used for generating an avatar image. Conventionally, clients use [Gravatar](http://en.gravatar.com/site/implement/hash/) to display this image. |
| MessageKey | String | (Optional) Public key for sending encrypted messages to this account. Conventionally, it should be a secp256k1 key, the same encryption that is used by the rest of Ripple |
| SetFlag | Unsigned Integer | (Optional) Unique identifier of a flag to enable for this account. |
| TransferRate | Unsigned Integer | (Optional) The fee to charge when users transfer this account's issuances, represented as billionths of a unit. Use `0` to set no fee. |
| WalletLocator | String | (Optional) Not used. |
| WalletSize | Unsigned Integer | (Optional) Not used. |

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
| asfRequireDest | 1 | Requires a destination tag to send transactions to this account. | lsfRequireDestTag |
| asfRequireAuth | 2 | Requires authorization for users to extend trust to this account. (This prevents users unknown to a gateway from holding funds issued by that gateway.) | lsfRequireAuth |
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

| Field | Type | Description |
|-------|------|-------------|
| RegularKey | String | Public key of a new keypair to use as the regular key to this account, as a base-58-encoded string; or the value `0` to remove the existing regular key. |

Instead of using an account's master key to sign transactions, you can set an alternate key pair, called the "Regular Key". As long as the public key for this key pair is set in the `RegularKey` field of an account this way, then the secret of the Regular Key pair can be used to sign transactions. (The master secret can still be used, too.) 

A Regular Key pair can be changed, but a Master Key pair is an intrinsic part of the account's identity (the address is derived from the master public key) so the Master Key cannot be changed. Therefore, using a Regular Key whenever possible is beneficial to security.

When the Regular Key is compromised, you can use the this transaction type to change it. As a special feature, each account is allowed to perform SetRegularKey transaction *without* a transaction fee exactly one time ever. To do so, submit a SetRegularKey transaction with a `Fee` value of 0, signed by the account's master key. (This way, you can potentially take back your account even if an attacker has already used up all the account's spare XRP.) <span class='draft-comment'>(Note: confirm that this is still exactly how that works.)</span>



## OfferCreate ##

<span class='draft-comment'>(TODO)</span>

## OfferCancel ##

<span class='draft-comment'>(TODO)</span>

## TrustSet ##

<span class='draft-comment'>(TODO)</span>

## Feature ##

<span class='draft-comment'>(TODO)</span>

## Fee ##

<span class='draft-comment'>(TODO)</span>

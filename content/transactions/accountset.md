## AccountSet

[[Source]<br>](https://github.com/ripple/rippled/blob/f65cea66ef99b1de149c02c15f06de6c61abf360/src/ripple/app/transactors/SetAccount.cpp "Source")

An AccountSet transaction modifies the properties of an [account in the XRP Ledger](reference-ledger-format.html#accountroot).

Example AccountSet:

```
{
    "TransactionType": "AccountSet",
    "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Sequence": 5,
    "Domain": "6578616D706C652E636F6D",
    "SetFlag": 5,
    "MessageKey": "rQD4SqHJtDxn5DDL7xNnojNa3vxS1Jx5gv"
}
```

| Field                          | JSON Type        | [Internal Type][] | Description |
|:-------------------------------|:-----------------|:------------------|:-----|
| [ClearFlag](#accountset-flags) | Unsigned Integer | UInt32            | _(Optional)_ Unique identifier of a flag to disable for this account. |
| [Domain](#domain)              | String           | VariableLength    | _(Optional)_ The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase. |
| EmailHash                      | String           | Hash128           | _(Optional)_ Hash of an email address to be used for generating an avatar image. Conventionally, clients use [Gravatar](http://en.gravatar.com/site/implement/hash/) to display this image. |
| MessageKey                     | String           | PubKey            | _(Optional)_ Public key for sending encrypted messages to this account. |
| [SetFlag](#accountset-flags)   | Unsigned Integer | UInt32            | _(Optional)_ Integer flag to enable for this account. |
| [TransferRate](#transferrate)  | Unsigned Integer | UInt32            | _(Optional)_ The fee to charge when users transfer this account's issued currencies, represented as billionths of a unit. Cannot be more than `2000000000` or less than `1000000000`, except for the special case `0` meaning no fee. |
| [TickSize](#ticksize)          | Unsigned Integer | UInt8             | _(Optional)_ Tick size to use for offers involving a currency issued by this address. The exchange rates of those offers is rounded to this many significant digits. Valid values are `3` to `15` inclusive, or `0` to disable. _(Requires the [TickSize amendment](reference-amendments.html#ticksize).)_ |
| WalletLocator                  | String           | Hash256           | _(Optional)_ Not used. |
| WalletSize                     | Unsigned Integer | UInt32            | _(Optional)_ Not used. |

If none of these options are provided, then the AccountSet transaction has no effect (beyond destroying the transaction cost). See [Canceling or Skipping a Transaction](#canceling-or-skipping-a-transaction) for more details.

### Domain

The `Domain` field is represented as the hex string of the lowercase ASCII of the domain. For example, the domain *example.com* would be represented as `"6578616D706C652E636F6D"`.

To remove the `Domain` field from an account, send an AccountSet with the Domain set to an empty string.

Client applications can use the [ripple.txt](https://wiki.ripple.com/Ripple.txt) file hosted by the domain to confirm that the account is actually operated by that domain.

### AccountSet Flags

There are several options which can be either enabled or disabled for an account. Account options are represented by different types of flags depending on the situation:

* The `AccountSet` transaction type has several "AccountSet Flags" (prefixed **asf**) that can enable an option when passed as the `SetFlag` parameter, or disable an option when passed as the `ClearFlag` parameter.
* The `AccountSet` transaction type has several transaction flags (prefixed **tf**) that can be used to enable or disable specific account options when passed in the `Flags` parameter. This style is discouraged. New account options do not have corresponding transaction (tf) flags.
* The `AccountRoot` ledger object type has several ledger-specific-flags (prefixed **lsf**) which represent the state of particular account options within a particular ledger. These settings apply until a transaction changes them.

The preferred way to enable and disable Account Flags is using the `SetFlag` and `ClearFlag` parameters of an AccountSet transaction. AccountSet flags have names that begin with **asf**.

All flags are disabled by default.

The available AccountSet flags are:

| Flag Name        | Decimal Value | Corresponding Ledger Flag | Description   |
|:-----------------|:--------------|:--------------------------|:--------------|
| asfAccountTxnID  | 5             | (None)                    | Track the ID of this account's most recent transaction. Required for [AccountTxnID](#accounttxnid) |
| asfDefaultRipple | 8             | lsfDefaultRipple          | Enable [rippling](concept-noripple.html) on this account's trust lines by default. [New in: rippled 0.27.3][] |
| asfDepositAuth   | 9             | lsfDepositAuth            | Enable [Deposit Authorization](concept-depositauth.html) on this account. _(Requires the [DepositAuth amendment](reference-amendments.html#depositauth).)_ |
| asfDisableMaster | 4             | lsfDisableMaster          | Disallow use of the master key. Can only be enabled if the account has configured another way to sign transactions, such as a [Regular Key](#setregularkey) or a [Signer List](#signerlistset). |
| asfDisallowXRP   | 3             | lsfDisallowXRP            | XRP should not be sent to this account. (Enforced by client applications, not by `rippled`) |
| asfGlobalFreeze  | 7             | lsfGlobalFreeze           | [Freeze](concept-freeze.html) all assets issued by this account. |
| asfNoFreeze      | 6             | lsfNoFreeze               | Permanently give up the ability to [freeze individual trust lines or disable Global Freeze](concept-freeze.html). This flag can never be disabled after being enabled. |
| asfRequireAuth   | 2             | lsfRequireAuth            | Require authorization for users to hold balances issued by this address. Can only be enabled if the address has no trust lines connected to it. |
| asfRequireDest   | 1             | lsfRequireDestTag         | Require a destination tag to send transactions to this account. |

To enable the `asfDisableMaster` or `asfNoFreeze` flags, you must [authorize the transaction](concept-transactions.html#authorizing-transactions) by signing it with the master key. You cannot use a regular key or a multi-signature. [New in: rippled 0.28.0][]

The following [Transaction flags](#flags), specific to the AccountSet transaction type, serve the same purpose, but are discouraged:

| Flag Name         | Hex Value  | Decimal Value | Replaced by AccountSet Flag |
|:------------------|:-----------|:--------------|:----------------------------|
| tfRequireDestTag  | 0x00010000 | 65536         | asfRequireDest (SetFlag)    |
| tfOptionalDestTag | 0x00020000 | 131072        | asfRequireDest (ClearFlag)  |
| tfRequireAuth     | 0x00040000 | 262144        | asfRequireAuth (SetFlag)    |
| tfOptionalAuth    | 0x00080000 | 524288        | asfRequireAuth (ClearFlag)  |
| tfDisallowXRP     | 0x00100000 | 1048576       | asfDisallowXRP (SetFlag)    |
| tfAllowXRP        | 0x00200000 | 2097152       | asfDisallowXRP (ClearFlag)  |

**Caution:** The numeric values of `tf` and `asf` flags in transactions do not match up with the values they set in the accounts "at rest" in the ledger. To read the flags of an account in the ledger, see [`AccountRoot` flags](reference-ledger-format.html#accountroot-flags).


#### Blocking Incoming Transactions

Incoming transactions with unclear purposes may be an inconvenience for financial institutions, who would have to recognize when a customer made a mistake, and then potentially refund accounts or adjust balances depending on the mistake. The `asfRequireDest` and `asfDisallowXRP` flags are intended to protect users from accidentally sending funds in a way that is unclear about the reason the funds were sent.

For example, a destination tag is typically used to identify which hosted balance should be credited when a financial institution receives a payment. If the destination tag is omitted, it may be unclear which account should be credited, creating a need for refunds, among other problems. By using the `asfRequireDest` tag, you can ensure that every incoming payment has a destination tag, which makes it harder for others to send you an ambiguous payment by accident.

You can protect against unwanted incoming payments for non-XRP currencies by not creating trust lines in those currencies. Since XRP does not require trust, the `asfDisallowXRP` flag is used to discourage users from sending XRP to an account. However, this flag is not enforced in `rippled` because it could potentially cause accounts to become unusable. (If an account did not have enough XRP to send a transaction that disabled the flag, the account would be completely unusable.) Instead, client applications should disallow or discourage XRP payments to accounts with the `asfDisallowXRP` flag enabled.

### TransferRate

The TransferRate field specifies a fee to charge whenever counterparties transfer the currency you issue. See [Transfer Fees](concept-transfer-fees.html) for more information.

In `rippled`'s WebSocket and JSON-RPC APIs, the TransferRate is represented as an integer, the amount that must be sent for 1 billion units to arrive. For example, a 20% transfer fee is represented as the value `1200000000`.  The value cannot be less than 1000000000. (Less than that would indicate giving away money for sending transactions, which is exploitable.) You can specify 0 as a shortcut for 1000000000, meaning no fee.

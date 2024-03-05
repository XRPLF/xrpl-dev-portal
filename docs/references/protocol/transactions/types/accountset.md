---
html: accountset.html
parent: transaction-types.html
seo:
    description: Set options on an account.
labels:
  - Accounts
---
# AccountSet

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/SetAccount.cpp "Source")

An AccountSet transaction modifies the properties of an [account in the XRP Ledger](../../ledger-data/ledger-entry-types/accountroot.md).

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "AccountSet",
    "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Sequence": 5,
    "Domain": "6578616D706C652E636F6D",
    "SetFlag": 5,
    "MessageKey": "03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB"
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_AccountSet%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22327FD263132A4D08170E1B01FE1BB2E21D0126CE58165C97A9173CA9551BCD70%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| [`ClearFlag`](#accountset-flags) | Number | UInt32      | _(Optional)_ Unique identifier of a flag to disable for this account. |
| [`Domain`](#domain) | String        | Blob              | _(Optional)_ The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase. [Cannot be more than 256 bytes in length.](https://github.com/XRPLF/rippled/blob/55dc7a252e08a0b02cd5aa39e9b4777af3eafe77/src/ripple/app/tx/impl/SetAccount.h#L34) |
| `EmailHash`      | String           | Hash128           | _(Optional)_ An arbitrary 128-bit value. Conventionally, clients treat this as the md5 hash of an email address to use for displaying a [Gravatar](http://en.gravatar.com/site/implement/hash/) image. |
| `MessageKey`     | String           | Blob              | _(Optional)_ Public key for sending encrypted messages to this account. To set the key, it must be exactly 33 bytes, with the first byte indicating the key type: `0x02` or `0x03` for secp256k1 keys, `0xED` for Ed25519 keys. To remove the key, use an empty value. |
| `NFTokenMinter`  | String           | Blob              | _(Optional)_ Another account that can [mint NFTokens for you](../../../../tutorials/javascript/nfts/assign-an-authorized-minter.md). _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| [`SetFlag`](#accountset-flags) | Number | UInt32        | _(Optional)_ Integer flag to enable for this account. |
| [`TransferRate`](#transferrate) | Number | UInt32       | _(Optional)_ The fee to charge when users transfer this account's tokens, represented as billionths of a unit. Cannot be more than `2000000000` or less than `1000000000`, except for the special case `0` meaning no fee. |
| [`TickSize`](../../../../concepts/tokens/decentralized-exchange/ticksize.md) | Number | UInt8            | _(Optional)_ Tick size to use for offers involving a currency issued by this address. The exchange rates of those offers is rounded to this many significant digits. Valid values are `3` to `15` inclusive, or `0` to disable. _(Added by the [TickSize amendment][])_ |
| `WalletLocator`    | String           | Hash256           | _(Optional)_ An arbitrary 256-bit value. If specified, the value is stored as part of the account but has no inherent meaning or requirements. |
| `WalletSize`       | Number           | UInt32            | _(Optional)_ Not used. This field is valid in AccountSet transactions but does nothing. |

If none of these options are provided, then the AccountSet transaction has no effect (beyond destroying the transaction cost). See [Cancel or Skip a Transaction](../../../../concepts/transactions/finality-of-results/canceling-a-transaction.md) for more details.

## Domain

The `Domain` field is represented as the hex string of the lowercase ASCII of the domain. For example, the domain *example.com* would be represented as `"6578616D706C652E636F6D"`.

To remove the `Domain` field from an account, send an AccountSet with the Domain set to an empty string.

You can put any domain in your account's `Domain` field. To prove that an account and domain belong to the same person or business, you need a "two-way link":

- Accounts you own should have a domain you own in the `Domain` field.
- At that domain, host an [xrp-ledger.toml file](../../../xrp-ledger-toml.md) listing accounts you own, and optionally other information about how you use the XRP Ledger.

## AccountSet Flags

There are several options which can be either enabled or disabled for an account. Account options are represented by different types of flags depending on the situation:

* The `AccountSet` transaction type has several "AccountSet Flags" (prefixed **`asf`**) that can enable an option when passed as the `SetFlag` parameter, or disable an option when passed as the `ClearFlag` parameter. Newer options have only this style of flag. You can enable up to one `asf` flag per transaction, and disable up to one `asf` flag per transaction.
* The `AccountSet` transaction type has several transaction flags (prefixed **`tf`**) that can be used to enable or disable specific account options when passed in the `Flags` parameter. You can enable and disable a combination of settings in one transaction using multiple `tf` flags, but not all settings have `tf` flags.
* The `AccountRoot` ledger object type has several ledger-state-flags (prefixed **`lsf`**) which represent the state of particular account options within a particular ledger. These settings apply until a transaction changes them.

To enable or disable Account Flags, use the `SetFlag` and `ClearFlag` parameters of an AccountSet transaction. AccountSet flags have names that begin with **`asf`**.

All flags are disabled by default.

The available AccountSet flags are:

| Flag Name                         | Decimal Value | Corresponding Ledger Flag         | Description   |
|:----------------------------------|:--------------|:----------------------------------|:--------------|
| `asfAccountTxnID`                 | 5             | (None)                            | Track the ID of this account's most recent transaction. Required for [`AccountTxnID`](../common-fields.md#accounttxnid) |
| `asfAllowTrustLineClawback`                | 16            | `lsfAllowTrustlineClawback`       | Allow account to claw back tokens it has issued. _(Requires the Clawback amendment.)_ Can only be set if the account has an empty owner directory (no trust lines, offers, escrows, payment channels, checks, or signer lists). After you set this flag, it cannot be reverted. The account permanently gains the ability to claw back issued assets on trust lines. |
| `asfAuthorizedNFTokenMinter`      | 10            | (None)                            | Enable to allow another account to mint non-fungible tokens (NFTokens) on this account's behalf. Specify the authorized account in the `NFTokenMinter` field of the [AccountRoot](../../ledger-data/ledger-entry-types/accountroot.md) object. To remove an authorized minter, enable this flag and omit the `NFTokenMinter` field. _(Added by the [NonFungibleTokensV1_1 amendment][].)_ |
| `asfDefaultRipple`                | 8             | `lsfDefaultRipple`                | Enable [rippling](../../../../concepts/tokens/fungible-tokens/rippling.md) on this account's trust lines by default. |
| `asfDepositAuth`                  | 9             | `lsfDepositAuth`                  | Enable [Deposit Authorization](../../../../concepts/accounts/depositauth.md) on this account. _(Added by the [DepositAuth amendment][].)_ |
| `asfDisableMaster`                | 4             | `lsfDisableMaster`                | Disallow use of the master key pair. Can only be enabled if the account has configured another way to sign transactions, such as a [Regular Key](../../../../concepts/accounts/cryptographic-keys.md) or a [Signer List](../../../../concepts/accounts/multi-signing.md). |
| `asfDisallowIncomingCheck`        | 13            | `lsfDisallowIncomingCheck`        | Block incoming Checks. _(Requires the [DisallowIncoming amendment][].)_ |
| `asfDisallowIncomingNFTokenOffer` | 12            | `lsfDisallowIncomingNFTokenOffer` | Block incoming NFTokenOffers. _(Requires the [DisallowIncoming amendment][].)_ |
| `asfDisallowIncomingPayChan`      | 14            | `lsfDisallowIncomingPayChan`      | Block incoming Payment Channels. _(Requires the [DisallowIncoming amendment][].)_ |
| `asfDisallowIncomingTrustline`    | 15            | `lsfDisallowIncomingTrustline`    | Block incoming trust lines. _(Requires the [DisallowIncoming amendment][].)_ |
| `asfDisallowXRP`                  | 3             | `lsfDisallowXRP`                  | XRP should not be sent to this account. (Advisory; not enforced by the XRP Ledger protocol.) |
| `asfGlobalFreeze`                 | 7             | `lsfGlobalFreeze`                 | [Freeze](../../../../concepts/tokens/fungible-tokens/freezes.md) all assets issued by this account. |
| `asfNoFreeze`                     | 6             | `lsfNoFreeze`                     | Permanently give up the ability to [freeze individual trust lines or disable Global Freeze](../../../../concepts/tokens/fungible-tokens/freezes.md). This flag can never be disabled after being enabled. |
| `asfRequireAuth`                  | 2             | `lsfRequireAuth`                  | Require authorization for users to hold balances issued by this address. Can only be enabled if the address has no trust lines connected to it. |
| `asfRequireDest`                  | 1             | `lsfRequireDestTag`               | Require a destination tag to send transactions to this account. |

To enable the `asfDisableMaster` or `asfNoFreeze` flags, you must [authorize the transaction](../../../../concepts/transactions/index.md#authorizing-transactions) by signing it with the master key pair. You cannot use a regular key pair or a multi-signature. You can disable `asfDisableMaster` (that is, re-enable the master key pair) using a regular key pair or multi-signature.

The following [Transaction flags](../common-fields.md#flags-field) (`tf` flags), specific to the AccountSet transaction type, serve the same purpose. Due to limited space, some settings do not have associated `tf` flags, and new `tf` flags are not being added to the `AccountSet` transaction type. You can use a combination of `tf` and `asf` flags to enable multiple settings with a single transaction.

| Flag Name           | Hex Value    | Decimal Value | Replaced by AccountSet Flag |
|:--------------------|:-------------|:--------------|:----------------------------|
| `tfRequireDestTag`  | `0x00010000` | 65536         | `asfRequireDest` (`SetFlag`)    |
| `tfOptionalDestTag` | `0x00020000` | 131072        | `asfRequireDest` (`ClearFlag`)  |
| `tfRequireAuth`     | `0x00040000` | 262144        | `asfRequireAuth` (`SetFlag`)    |
| `tfOptionalAuth`    | `0x00080000` | 524288        | `asfRequireAuth` (`ClearFlag`)  |
| `tfDisallowXRP`     | `0x00100000` | 1048576       | `asfDisallowXRP` (`SetFlag`)    |
| `tfAllowXRP`        | `0x00200000` | 2097152       | `asfDisallowXRP` (`ClearFlag`)  |

**Caution:** The numeric values of `tf` and `asf` flags in transactions do not match up with the values they set in the accounts "at rest" in the ledger. To read the flags of an account in the ledger, see [`AccountRoot` flags](../../ledger-data/ledger-entry-types/accountroot.md#accountroot-flags).


### Blocking Incoming Transactions

<!-- This concept info should be moved to another topic after the IA.v2 migration. -->

Incoming transactions with unclear purposes may be an inconvenience for financial institutions, who would have to recognize when a customer made a mistake, and then potentially refund accounts or adjust balances depending on the mistake. The `asfRequireDest` and `asfDisallowXRP` flags are intended to protect users from accidentally sending funds in a way that is unclear about the reason the funds were sent.

For example, a destination tag is typically used to identify which hosted balance should be credited when a financial institution receives a payment. If the destination tag is omitted, it may be unclear which account should be credited, creating a need for refunds, among other problems. By using the `asfRequireDest` tag, you can ensure that every incoming payment has a destination tag, which makes it harder for others to send you an ambiguous payment by accident.

You can protect against unwanted incoming payments for non-XRP currencies by not creating trust lines in those currencies. Since XRP does not require trust, the `asfDisallowXRP` flag is used to discourage users from sending XRP to an account. However, this flag is not enforced in the XRP Ledger protocol because it could potentially cause accounts to become unusable if they run out of XRP. Instead, client applications should disallow or discourage XRP payments to accounts with the `asfDisallowXRP` flag enabled.

If you want to block _all_ incoming payments, you can enable [Deposit Authorization](../../../../concepts/accounts/depositauth.md). This prevents any transaction from sending money to you, even XRP, unless your account is below the [reserve requirement](../../../../concepts/accounts/reserves.md).

If the [DisallowIncoming amendment][] is enabled, you also have the option to block all incoming Checks, NFTokenOffers, Payment Channels, and trust lines. It is generally harmless to be on the receiving end of these objects, but they can block you from deleting your account and it can be confusing to have objects you didn't expect mixed in with the list of objects you created. To block incoming objects, use one or more of these account flags:

- `asfDisallowIncomingCheck` - for Check objects
- `asfDisallowIncomingNFTOffer` - for NFTokenOffer objects
- `asfDisallowIncomingPayChan` - for PayChannel objects
- `asfDisallowIncomingTrustline` - for RippleState (trust line) objects

When a transaction would create one of these ledger entries, if the destination account has the corresponding flag enabled, the transaction fails with the result code `tecNO_PERMISSION`. Unlike Deposit Authorization, these settings do not prevent you from receiving payments in general. Also, enabling this setting doesn't stop you from creating these types of objects yourself (unless the destination of your transaction is also using the setting, of course).


## TransferRate

The `TransferRate` field specifies a fee to charge whenever counterparties transfer the currency you issue.

In the HTTP and WebSocket APIs, the transfer fee is represented as an integer, the amount that must be sent for 1 billion units to arrive. For example, a 20% transfer fee is represented as the value `1200000000`.  The value cannot be less than 1000000000. (Less than that would indicate giving away money for sending transactions, which is exploitable.) You can specify `0` as a shortcut for `1000000000`, meaning no fee.

See [Transfer Fees](../../../../concepts/tokens/transfer-fees.md) for more information.

## NFTokenMinter

To remove an authorized minter, set `ClearFlag` to 10 (`asfAuthorizedNFTokenMinter`) and omit the `NFTokenMinter` field.

<!-- SPELLING_IGNORE: TransferRate -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}

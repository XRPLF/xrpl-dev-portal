---
html: accountroot.html
parent: ledger-object-types.html
blurb: The settings, XRP balance, and other metadata for one account.
labels:
  - Accounts
  - XRP
---
# AccountRoot
[[Source]](https://github.com/xrplf/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L27 "Source")

An `AccountRoot` ledger entry type describes a single [account](accounts.html), its settings, and XRP balance.

## Example {{currentpage.name}} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "AccountTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
    "Balance": "148446663",
    "Domain": "6D64756F31332E636F6D",
    "EmailHash": "98B4375E1D753E5B91627516F6D70977",
    "Flags": 8388608,
    "LedgerEntryType": "AccountRoot",
    "MessageKey": "0000000000000000000000070000000300",
    "OwnerCount": 3,
    "PreviousTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
    "PreviousTxnLgrSeq": 14091160,
    "Sequence": 336,
    "TransferRate": 1004999999,
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
}
```

## {{currentpage.name}} Fields

An `AccountRoot` object has the following fields:

| Field                         | JSON Type | [Internal Type][] | Required? | Description  |
|:------------------------------|:----------|:------------------|:----------|:-------------|
| `Account`                     | String    | AccountID         | Yes       | The identifying (classic) address of this [account](accounts.html). |
| `AccountTxnID`                | String    | Hash256           | No        | The identifying hash of the transaction most recently sent by this account. This field must be enabled to use the [`AccountTxnID` transaction field](transaction-common-fields.html#accounttxnid). To enable it, send an [AccountSet transaction with the `asfAccountTxnID` flag enabled](accountset.html#accountset-flags). |
| `Balance`                     | String    | Amount            | No        | The account's current [XRP balance in drops][XRP, in drops], represented as a string. |
| `BurnedNFTokens`              | Number    | UInt32            | No        | How many total of this account's issued [non-fungible tokens](non-fungible-tokens.html) have been burned. This number is always equal or less than `MintedNFTokens`. |
| `Domain`                      | String    | Blob              | No        | A domain associated with this account. In JSON, this is the hexadecimal for the ASCII representation of the domain. [Cannot be more than 256 bytes in length.](https://github.com/xrplf/rippled/blob/55dc7a252e08a0b02cd5aa39e9b4777af3eafe77/src/ripple/app/tx/impl/SetAccount.h#L34) |
| `EmailHash`                   | String    | Hash128           | No        | The md5 hash of an email address. Clients can use this to look up an avatar through services such as [Gravatar](https://en.gravatar.com/). |
| [`Flags`](#accountroot-flags) | Number    | UInt32            | Yes       | A bit-map of boolean flags enabled for this account. |
| `LedgerEntryType`             | String    | UInt16            | Yes       | The value `0x0061`, mapped to the string `AccountRoot`, indicates that this is an AccountRoot object. |
| `MessageKey`                  | String    | Blob              | No        | A public key that may be used to send encrypted messages to this account. In JSON, uses hexadecimal. Must be exactly 33 bytes, with the first byte indicating the key type: `0x02` or `0x03` for secp256k1 keys, `0xED` for Ed25519 keys. |
| `MintedNFTokens`              | Number    | UInt32            | No        | How many total [non-fungible tokens](non-fungible-tokens.html) have been minted by and on behalf of this account. _(Added by the [NonFungibleTokensV1_1 amendment][])_ |
| `NFTokenMinter`               | String    | AccountID         | No        | Another account that can mint [non-fungible tokens](non-fungible-tokens.html) on behalf of this account. _(Added by the [NonFungibleTokensV1_1 amendment][])_ |
| `OwnerCount`                  | Number    | UInt32            | Yes       | The number of objects this account owns in the ledger, which contributes to its owner reserve. |
| `PreviousTxnID`               | String    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq`           | Number    | UInt32            | Yes       |The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `RegularKey`                  | String    | AccountID         | No        | The address of a [key pair](cryptographic-keys.html) that can be used to sign transactions for this account instead of the master key. Use a [SetRegularKey transaction][] to change this value. |
| `Sequence`                    | Number    | UInt32            | Yes       | The [sequence number](basic-data-types.html#account-sequence) of the next valid transaction for this account. |
| `TicketCount`                 | Number    | UInt32            | No        | How many [Tickets](tickets.html) this account owns in the ledger. This is updated automatically to ensure that the account stays within the hard limit of 250 Tickets at a time. This field is omitted if the account has zero Tickets. _(Added by the [TicketBatch amendment][].)_ |
| `TickSize`                    | Number    | UInt8             | No        | How many significant digits to use for exchange rates of Offers involving currencies issued by this address. Valid values are `3` to `15`, inclusive. _(Added by the [TickSize amendment][].)_ |
| `TransferRate`                | Number    | UInt32            | No        | A [transfer fee](transfer-fees.html) to charge other users for sending currency issued by this account to each other. |
| `WalletLocator`               | String    | Hash256           | No        | An arbitrary 256-bit value that users can set. |
| `WalletSize`                  | Number    | UInt32            | No        | Unused. (The code supports this field but there is no way to set it.) |


## AccountRoot Flags

There are several options which can be either enabled or disabled for an account. These options can be changed with an [AccountSet transaction][]. In the ledger, flags are represented as binary values that can be combined with bitwise-or operations. The bit values for the flags in the ledger are different than the values used to enable or disable those flags in a transaction. Ledger flags have names that begin with **`lsf`**.

AccountRoot objects can have the following flag values:

| Flag Name                         | Hex Value    | Decimal Value | Corresponding [AccountSet Flag](accountset.html#accountset-flags) | Description |
|-----------------------------------|--------------|-------------------|-----------------------------------|----|
| `lsfAMM` :not_enabled:            | `0x02000000` | 33554432          | (None)                            | This account is an Automated Market Maker instance. :not_enabled: |
| `lsfDefaultRipple`                | `0x00800000` | 8388608           | `asfDefaultRipple`                | Enable [rippling](rippling.html) on this addresses's trust lines by default. Required for issuing addresses; discouraged for others. |
| `lsfDepositAuth`                  | `0x01000000` | 16777216          | `asfDepositAuth`                  | This account has [DepositAuth](depositauth.html) enabled, meaning it can only receive funds from transactions it sends, and from [preauthorized](depositauth.html#preauthorization) accounts. _(Added by the [DepositAuth amendment][])_ |
| `lsfDisableMaster`                | `0x00100000` | 1048576           | `asfDisableMaster`                | Disallows use of the master key to sign transactions for this account. |
| `lsfDisallowIncomingCheck`        | `0x08000000` | 134217728         | `asfDisallowIncomingCheck`        | This account blocks incoming Checks. _(Requires the [DisallowIncoming amendment][] :not_enabled:.)_ |
| `lsfDisallowIncomingNFTokenOffer` | `0x04000000` | 67108864          | `asfDisallowIncomingNFTokenOffer` | This account blocks incoming NFTokenOffers. _(Requires the [DisallowIncoming amendment][] :not_enabled:.)_ |
| `lsfDisallowIncomingPayChan`      | `0x10000000` | 268435456         | `asfDisallowIncomingPayChan`      | This account blocks incoming Payment Channels. _(Requires the [DisallowIncoming amendment][] :not_enabled:.)_ |
| `lsfDisallowIncomingTrustline`    | `0x20000000` | 536870912         | `asfDisallowIncomingTrustline`    | This account blocks incoming trust lines. _(Requires the [DisallowIncoming amendment][] :not_enabled:.)_ |
| `lsfDisallowXRP`                  | `0x00080000` | 524288            | `asfDisallowXRP`                  | Client applications should not send XRP to this account. (Advisory; not enforced by the protocol.) |
| `lsfGlobalFreeze`                 | `0x00400000` | 4194304           | `asfGlobalFreeze`                 | All assets issued by this account are frozen. |
| `lsfNoFreeze`                     | `0x00200000` | 2097152           | `asfNoFreeze`                     | This account cannot freeze trust lines connected to it. Once enabled, cannot be disabled. |
| `lsfPasswordSpent`                | `0x00010000` | 65536             | (None)                            | This account has used its free SetRegularKey transaction. |
| `lsfRequireAuth`                  | `0x00040000` | 262144            | `asfRequireAuth`                  | This account must individually approve other users for those users to hold this account's tokens. |
| `lsfRequireDestTag`               | `0x00020000` | 131072            | `asfRequireDest`                  | Requires incoming payments to specify a Destination Tag. |


## Special AMM AccountRoot Objects

{% include '_snippets/amm-disclaimer.md' %}

[Automated Market Makers](automated-market-makers.html) (AMMs) use an AccountRoot object to issue their LP Tokens and hold the assets in the AMM pool, and an [AMM object][] for tracking some of the details of the AMM. The address of an AMM's AccountRoot is randomized so that users cannot identify and fund the address in advance of the AMM being created. Unlike normal accounts, AMM AccountRoot objects are created with the following settings:

- `lsfAMM` **enabled**. This indicates that the AccountRoot is part of an AMM and is not a regular account.
- `lsfDisableMaster` **enabled** and no other means of authorizing transactions. This ensures no one can control the account directly, and it cannot send transactions.
- `lsfRequireAuth` **enabled** and no accounts preauthorized. This ensures that the only way to add money to the AMM Account is using the [AMMDeposit transaction][].
- `lsfDefaultRipple` **enabled**. This ensures that users can send and trade the AMM's LP Tokens among themselves.

These special accounts are not subject to the [reserve requirement](reserves.html) but they can hold XRP if it is one of the two assets in the AMM's pool.

In most other ways, these accounts function like ordinary accounts; the LP Tokens they issue behave like other [tokens](tokens.html) except that those tokens can also be used in AMM-related transactions. You can check an AMM's balances and the history of transactions that affected it the same way you would with a regular account.


## AccountRoot ID Format

The ID of an AccountRoot object is the [SHA-512Half][] of the following values, concatenated in order:

* The Account space key (`0x0061`)
* The AccountID of the account

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

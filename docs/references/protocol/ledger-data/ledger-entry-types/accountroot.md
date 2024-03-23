---
html: accountroot.html
parent: ledger-entry-types.html
seo:
    description: The settings, XRP balance, and other metadata for one account.
labels:
  - Accounts
  - XRP
---
# AccountRoot
[[Source]](https://github.com/XRPLF/rippled/blob/264280edd79b7f764536e02459f33f66a59c0531/src/ripple/protocol/impl/LedgerFormats.cpp#L36-L60 "Source")

An `AccountRoot` ledger entry type describes a single [account](../../../../concepts/accounts/index.md), its settings, and XRP balance.

## Example {% $frontmatter.seo.title %} JSON

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

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field                         | JSON Type | [Internal Type][] | Required? | Description  |
|:------------------------------|:----------|:------------------|:----------|:-------------|
| `Account`                     | String    | AccountID         | Yes       | The identifying (classic) address of this [account](../../../../concepts/accounts/index.md). |
| `AccountTxnID`                | String    | Hash256           | No        | The identifying hash of the transaction most recently sent by this account. This field must be enabled to use the [`AccountTxnID` transaction field](../../transactions/common-fields.md#accounttxnid). To enable it, send an [AccountSet transaction with the `asfAccountTxnID` flag enabled](../../transactions/types/accountset.md#accountset-flags). |
| `AMMID`                       | String    | Hash256           | No        | _(Requires the [AMM amendment][])_ The ledger entry ID of the corresponding AMM ledger entry. Set during account creation; cannot be modified. If present, indicates that this is a special AMM AccountRoot; always omitted on non-AMM accounts. |
| `Balance`                     | String    | Amount            | No        | The account's current [XRP balance in drops][XRP, in drops], represented as a string. |
| `BurnedNFTokens`              | Number    | UInt32            | No        | How many total of this account's issued [non-fungible tokens](../../../../concepts/tokens/nfts/index.md) have been burned. This number is always equal or less than `MintedNFTokens`. |
| `Domain`                      | String    | Blob              | No        | A domain associated with this account. In JSON, this is the hexadecimal for the ASCII representation of the domain. [Cannot be more than 256 bytes in length.](https://github.com/xrplf/rippled/blob/55dc7a252e08a0b02cd5aa39e9b4777af3eafe77/src/ripple/app/tx/impl/SetAccount.h#L34) |
| `EmailHash`                   | String    | Hash128           | No        | The md5 hash of an email address. Clients can use this to look up an avatar through services such as [Gravatar](https://en.gravatar.com/). |
| `FirstNFTokenSequence`        | Number    | UInt32            | No        | The account's [Sequence Number][] at the time it minted its first [non-fungible-token](../../../../concepts/tokens/nfts/index.md). _(Added by the [fixNFTokenRemint amendment][])_ |
| `LedgerEntryType`             | String    | UInt16            | Yes       | The value `0x0061`, mapped to the string `AccountRoot`, indicates that this is an AccountRoot object. |
| `MessageKey`                  | String    | Blob              | No        | A public key that may be used to send encrypted messages to this account. In JSON, uses hexadecimal. Must be exactly 33 bytes, with the first byte indicating the key type: `0x02` or `0x03` for secp256k1 keys, `0xED` for Ed25519 keys. |
| `MintedNFTokens`              | Number    | UInt32            | No        | How many total [non-fungible tokens](../../../../concepts/tokens/nfts/index.md) have been minted by and on behalf of this account. _(Added by the [NonFungibleTokensV1_1 amendment][])_ |
| `NFTokenMinter`               | String    | AccountID         | No        | Another account that can mint [non-fungible tokens](../../../../concepts/tokens/nfts/index.md) on behalf of this account. _(Added by the [NonFungibleTokensV1_1 amendment][])_ |
| `OwnerCount`                  | Number    | UInt32            | Yes       | The number of objects this account owns in the ledger, which contributes to its owner reserve. |
| `PreviousTxnID`               | String    | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq`           | Number    | UInt32            | Yes       |The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `RegularKey`                  | String    | AccountID         | No        | The address of a [key pair](../../../../concepts/accounts/cryptographic-keys.md) that can be used to sign transactions for this account instead of the master key. Use a [SetRegularKey transaction][] to change this value. |
| `Sequence`                    | Number    | UInt32            | Yes       | The [sequence number](../../data-types/basic-data-types.md#account-sequence) of the next valid transaction for this account. |
| `TicketCount`                 | Number    | UInt32            | No        | How many [Tickets](../../../../concepts/accounts/tickets.md) this account owns in the ledger. This is updated automatically to ensure that the account stays within the hard limit of 250 Tickets at a time. This field is omitted if the account has zero Tickets. _(Added by the [TicketBatch amendment][].)_ |
| `TickSize`                    | Number    | UInt8             | No        | How many significant digits to use for exchange rates of Offers involving currencies issued by this address. Valid values are `3` to `15`, inclusive. _(Added by the [TickSize amendment][].)_ |
| `TransferRate`                | Number    | UInt32            | No        | A [transfer fee](../../../../concepts/tokens/transfer-fees.md) to charge other users for sending currency issued by this account to each other. |
| `WalletLocator`               | String    | Hash256           | No        | An arbitrary 256-bit value that users can set. |
| `WalletSize`                  | Number    | UInt32            | No        | Unused. (The code supports this field but there is no way to set it.) |

## Special AMM AccountRoot Entries

_(Requires the [AMM amendment][])_

Automated Market Makers use an AccountRoot ledger entry to issue their LP Tokens and hold the assets in the AMM pool, and an [AMM ledger entry](amm.md) for tracking some of the details of the AMM. The address of an AMM's AccountRoot is randomized so that users cannot identify and fund the address in advance of the AMM being created. Unlike normal accounts, AMM AccountRoot objects are created with the following settings:

- `lsfDisableMaster` **enabled** and no means of authorizing transactions. This ensures no one can control the account directly, and it cannot send transactions.
- `lsfDepositAuth` **enabled** and no accounts preauthorized. This ensures that the only way to add money to the AMM Account is using the [AMMDeposit transaction][].
- `lsfDefaultRipple` **enabled**. This ensures that users can send and trade the AMM's LP Tokens among themselves.

In addition, the following special rules apply to an AMM's AccountRoot entry:

- It is not subject to the [reserve requirement](../../../../concepts/accounts/reserves.md). It can hold XRP only if XRP is one of the two assets in the AMM's pool.
- It cannot be the destination of Checks, Escrows, or Payment Channels. Any transactions that would create such entries instead fail with the result code `tecNO_PERMISSION`.
- Users cannot create trust lines to it for anything other than the AMM's LP Tokens. Transactions that would create such trust lines instead fail with result code `tecNO_PERMISSION`. (The AMM does have two trust lines to hold the tokens in its pool, or one trust line if the other asset in its pool is XRP.)
- If the [Clawback amendment][] is also enabled, the issuer cannot clawback funds from an AMM.

Other than those exceptions, these accounts are like ordinary accounts; the LP Tokens they issue behave like other [tokens](https://xrpl.org/tokens.html) except that those tokens can also be used in AMM-related transactions. You can check an AMM's balances and the history of transactions that affected it the same way you would with a regular account.

## AccountRoot Flags

Many AccountRoot flags correspond to options you can change with an [AccountSet transaction][]. However, the bit values used in the ledger are different than the values used to enable or disable those flags in a transaction. Ledger flags have names that begin with **`lsf`**.

AccountRoot objects can have the following flags combined in the `Flags` field:

| Flag Name                         | Hex Value    | Decimal Value | Corresponding [AccountSet Flag](../../transactions/types/accountset.md#accountset-flags) | Description |
|-----------------------------------|--------------|-------------------|-----------------------------------|----|
| `lsfAllowTrustLineClawback`       | `0x80000000` | 2147483648        | `asfAllowTrustLineClawback`       | Enable [Clawback](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md) for this account. _(Requires the [Clawback amendment][].)_ |
| `lsfDefaultRipple`                | `0x00800000` | 8388608           | `asfDefaultRipple`                | Enable [rippling](../../../../concepts/tokens/fungible-tokens/rippling.md) on this addresses's trust lines by default. Required for issuing addresses; discouraged for others. |
| `lsfDepositAuth`                  | `0x01000000` | 16777216          | `asfDepositAuth`                  | This account has [DepositAuth](../../../../concepts/accounts/depositauth.md) enabled, meaning it can only receive funds from transactions it sends, and from [preauthorized](../../../../concepts/accounts/depositauth.md#preauthorization) accounts. _(Added by the [DepositAuth amendment][])_ |
| `lsfDisableMaster`                | `0x00100000` | 1048576           | `asfDisableMaster`                | Disallows use of the master key to sign transactions for this account. |
| `lsfDisallowIncomingCheck`        | `0x08000000` | 134217728         | `asfDisallowIncomingCheck`        | This account blocks incoming Checks. _(Added by the [DisallowIncoming amendment][].)_ |
| `lsfDisallowIncomingNFTokenOffer` | `0x04000000` | 67108864          | `asfDisallowIncomingNFTokenOffer` | This account blocks incoming NFTokenOffers. _(Added by the [DisallowIncoming amendment][].)_ |
| `lsfDisallowIncomingPayChan`      | `0x10000000` | 268435456         | `asfDisallowIncomingPayChan`      | This account blocks incoming Payment Channels. _(Added by the [DisallowIncoming amendment][].)_ |
| `lsfDisallowIncomingTrustline`    | `0x20000000` | 536870912         | `asfDisallowIncomingTrustline`    | This account blocks incoming trust lines. _(Added by the [DisallowIncoming amendment][].)_ |
| `lsfDisallowXRP`                  | `0x00080000` | 524288            | `asfDisallowXRP`                  | Client applications should not send XRP to this account. (Advisory; not enforced by the protocol.) |
| `lsfGlobalFreeze`                 | `0x00400000` | 4194304           | `asfGlobalFreeze`                 | All assets issued by this account are frozen. |
| `lsfNoFreeze`                     | `0x00200000` | 2097152           | `asfNoFreeze`                     | This account cannot freeze trust lines connected to it. Once enabled, cannot be disabled. |
| `lsfPasswordSpent`                | `0x00010000` | 65536             | (None)                            | This account has used its free SetRegularKey transaction. |
| `lsfRequireAuth`                  | `0x00040000` | 262144            | `asfRequireAuth`                  | This account must individually approve other users for those users to hold this account's tokens. |
| `lsfRequireDestTag`               | `0x00020000` | 131072            | `asfRequireDest`                  | Requires incoming payments to specify a Destination Tag. |

## {% $frontmatter.seo.title %} Reserve

The [reserve](../../../../concepts/accounts/reserves.md) for an AccountRoot entry is the base reserve, currently {% $env.PUBLIC_BASE_RESERVE %}, except in the case of a special AMM AccountRoot.

This XRP cannot be sent to others but it can be burned as part of the [transaction cost][].

## {% $frontmatter.seo.title %} ID Format

The ID of an AccountRoot entry is the [SHA-512Half][] of the following values, concatenated in order:

* The Account space key (`0x0061`)
* The AccountID of the account

{% raw-partial file="/docs/_snippets/common-links.md" /%}

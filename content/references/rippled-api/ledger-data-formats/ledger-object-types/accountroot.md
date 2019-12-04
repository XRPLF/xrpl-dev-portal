# AccountRoot
[[Source]](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L27 "Source")

The `AccountRoot` object type describes a single [account](accounts.html), its settings, and XRP balance.

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

The `AccountRoot` object has the following fields:

| Field                         | JSON Type | [Internal Type][] | Description  |
|:------------------------------|:----------|:------------------|:-------------|
| `LedgerEntryType`             | String    | UInt16            | The value `0x0061`, mapped to the string `AccountRoot`, indicates that this is an AccountRoot object. |
| `Account`                     | String    | AccountID         | The identifying address of this account, such as rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn. |
| `Balance`                     | String    | Amount            | The account's current [XRP balance in drops][XRP, in drops], represented as a string. |
| [`Flags`](#accountroot-flags) | Number    | UInt32            | A bit-map of boolean flags enabled for this account. |
| `OwnerCount`                  | Number    | UInt32            | The number of objects this account owns in the ledger, which contributes to its owner reserve. |
| `PreviousTxnID`               | String    | Hash256           | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq`           | Number    | UInt32            | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |
| `Sequence`                    | Number    | UInt32            | The sequence number of the next valid transaction for this account. (Each account starts with Sequence = 1 and increases each time a transaction is made.) |
| `AccountTxnID`                | String    | Hash256           | _(Optional)_ The identifying hash of the transaction most recently sent by this account. This field must be enabled to use the [AccountTxnID transaction field](transaction-common-fields.html#accounttxnid). To enable it, send an [AccountSet transaction with the asfAccountTxnID flag enabled](accountset.html#accountset-flags). |
| `Domain`                      | String    | VariableLength    | _(Optional)_ A domain associated with this account. In JSON, this is the hexadecimal for the ASCII representation of the domain. |
| `EmailHash`                   | String    | Hash128           | _(Optional)_ The md5 hash of an email address. Clients can use this to look up an avatar through services such as [Gravatar](https://en.gravatar.com/). |
| `MessageKey`                  | String    | VariableLength    | _(Optional)_ A public key that may be used to send encrypted messages to this account. In JSON, uses hexadecimal. No more than 33 bytes. |
| `RegularKey`                  | String    | AccountID         | _(Optional)_ The address of a [key pair](cryptographic-keys.html) that can be used to sign transactions for this account instead of the master key. Use a [SetRegularKey transaction][] to change this value. |
| `TickSize`                    | Number    | UInt8             | _(Optional)_ How many significant digits to use for exchange rates of Offers involving currencies issued by this address. Valid values are `3` to `15`, inclusive. _(Requires the [TickSize amendment][].)_ |
| `TransferRate`                | Number    | UInt32            | _(Optional)_ A [transfer fee](https://ripple.com/knowledge_center/transfer-fees/) to charge other users for sending currency issued by this account to each other. |
| `WalletLocator`               | String    | Hash256           | _(Optional)_ **DEPRECATED**. Do not use. |
| `WalletSize`                  | Number    | UInt32            | _(Optional)_ **DEPRECATED**. Do not use. |

## AccountRoot Flags

There are several options which can be either enabled or disabled for an account. These options can be changed with an [AccountSet transaction][]. In the ledger, flags are represented as binary values that can be combined with bitwise-or operations. The bit values for the flags in the ledger are different than the values used to enable or disable those flags in a transaction. Ledger flags have names that begin with _lsf_.

AccountRoot objects can have the following flag values:

| Flag Name | Hex Value | Decimal Value | Description | Corresponding [AccountSet Flag](accountset.html#accountset-flags) |
|-----------|-----------|---------------|-------------|-------------------------------|
| lsfDefaultRipple | 0x00800000 | 8388608 | Enable [rippling](rippling.html) on this addresses's trust lines by default. Required for issuing addresses; discouraged for others. | asfDefaultRipple |
| lsfDepositAuth | 0x01000000 | 16777216 | This account can only receive funds from transactions it sends, and from [preauthorized](depositauth.html#preauthorization) accounts. (It has [DepositAuth](depositauth.html) enabled.) | asfDepositAuth |
| lsfDisableMaster | 0x00100000 | 1048576 | Disallows use of the master key to sign transactions for this account. | asfDisableMaster |
| lsfDisallowXRP | 0x00080000 | 524288 | Client applications should not send XRP to this account. Not enforced by `rippled`. | asfDisallowXRP |
| lsfGlobalFreeze | 0x00400000 | 4194304 | All assets issued by this address are frozen. | asfGlobalFreeze |
| lsfNoFreeze | 0x00200000 | 2097152 | This address cannot freeze trust lines connected to it. Once enabled, cannot be disabled. | asfNoFreeze |
| lsfPasswordSpent | 0x00010000 | 65536 | The account has used its free SetRegularKey transaction. | (None) |
| lsfRequireAuth | 0x00040000 | 262144 | This account must individually approve other users for those users to hold this account's issuances. | asfRequireAuth |
| lsfRequireDestTag | 0x00020000 | 131072 | Requires incoming payments to specify a Destination Tag. | asfRequireDest |

## AccountRoot ID Format

The ID of an AccountRoot object is the [SHA-512Half][] of the following values, concatenated in order:

* The Account space key (`0x0061`)
* The AccountID of the account

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

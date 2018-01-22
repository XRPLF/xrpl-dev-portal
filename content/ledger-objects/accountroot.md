## AccountRoot
[[Source]<br>](https://github.com/ripple/rippled/blob/5d2d88209f1732a0f8d592012094e345cbe3e675/src/ripple/protocol/impl/LedgerFormats.cpp#L27 "Source")

The `AccountRoot` object type describes a single _account_ object. Example `AccountRoot` object:

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

The `AccountRoot` object has the following fields:

| Field           | JSON Type | [Internal Type][] | Description |
|-----------------|-----------|---------------|-------------|
| `LedgerEntryType` | String | UInt16 | The value `0x0061`, mapped to the string `AccountRoot`, indicates that this object is an AccountRoot object. |
| `Account`         | String | AccountID | The identifying address of this account, such as rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn. |
| [Flags](#accountroot-flags) | Number | UInt32 | A bit-map of boolean flags enabled for this account. |
| `Sequence`        | Number | UInt32 | The sequence number of the next valid transaction for this account. (Each account starts with Sequence = 1 and increases each time a transaction is made.) |
| `Balance`         | String | Amount | The account's current [XRP balance in drops][XRP, in drops], represented as a string. |
| `OwnerCount`      | Number | UInt32 | The number of objects this account owns in the ledger, which contributes to its owner reserve. |
| `PreviousTxnID`   | String | Hash256 | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number | UInt32 | The [index of the ledger](#ledger-index) that contains the transaction that most recently modified this object. |
| `AccountTxnID`    | String | Hash256 | (Optional) The identifying hash of the transaction most recently submitted by this account. |
| `RegularKey`      | String | AccountID | (Optional) The address of a keypair that can be used to sign transactions for this account instead of the master key. Use a [SetRegularKey transaction][] to change this value. |
| `EmailHash`       | String | Hash128 | (Optional) The md5 hash of an email address. Clients can use this to look up an avatar through services such as [Gravatar](https://en.gravatar.com/). |
| `WalletLocator`   | String | Hash256 | (Optional) **DEPRECATED**. Do not use. |
| `WalletSize`      | Number | UInt32  | (Optional) **DEPRECATED**. Do not use. |
| `MessageKey`      | String | VariableLength  | (Optional) A public key that may be used to send encrypted messages to this account. In JSON, uses hexadecimal. No more than 33 bytes. |
| `TickSize`        | Number | UInt8   | (Optional) How many significant digits to use for exchange rates of Offers involving currencies issued by this address. Valid values are `3` to `15`, inclusive. _(Requires the [TickSize amendment](reference-amendments.html#ticksize).)_ |
| `TransferRate`    | Number | UInt32  | (Optional) A [transfer fee](https://ripple.com/knowledge_center/transfer-fees/) to charge other users for sending currency issued by this account to each other. |
| `Domain`          | String | VariableLength | (Optional) A domain associated with this account. In JSON, this is the hexadecimal for the ASCII representation of the domain. |

### AccountRoot Flags

There are several options which can be either enabled or disabled for an account. These options can be changed with an [AccountSet transaction][]. In the ledger, flags are represented as binary values that can be combined with bitwise-or operations. The bit values for the flags in the ledger are different than the values used to enable or disable those flags in a transaction. Ledger flags have names that begin with _lsf_.

AccountRoot objects can have the following flag values:

| Flag Name | Hex Value | Decimal Value | Description | Corresponding [AccountSet Flag](reference-transaction-format.html#accountset-flags) |
|-----------|-----------|---------------|-------------|-------------------------------|
| lsfPasswordSpent | 0x00010000 | 65536 | Indicates that the account has used its free SetRegularKey transaction. | (None) |
| lsfRequireDestTag | 0x00020000 | 131072 | Requires incoming payments to specify a Destination Tag. | asfRequireDest |
| lsfRequireAuth | 0x00040000 | 262144 | This account must individually approve other users for those users to hold this account's issuances. | asfRequireAuth |
| lsfDisallowXRP | 0x00080000 | 524288 | Client applications should not send XRP to this account. Not enforced by `rippled`. | asfDisallowXRP |
| lsfDisableMaster | 0x00100000 | 1048576 | Disallows use of the master key to sign transactions for this account. | asfDisableMaster |
| lsfNoFreeze | 0x00200000 | 2097152 | This address cannot freeze trust lines connected to it. Once enabled, cannot be disabled. | asfNoFreeze |
| lsfGlobalFreeze | 0x00400000 | 4194304 |　All assets issued by this address are frozen. | asfGlobalFreeze |
| lsfDefaultRipple | 0x00800000 | 8388608 | Enable [rippling](concept-noripple.html) on this addresses's trust lines by default. Required for issuing addresses; discouraged for others. | asfDefaultRipple |

### AccountRoot ID Format

The ID of an AccountRoot object is the [SHA-512Half](#sha512half) of the following values put together:

* The Account space key (`0x0061`)
* The AccountID of the account

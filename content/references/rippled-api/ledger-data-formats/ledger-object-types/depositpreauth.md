# DepositPreauth
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L172-L178 "Source")

A `DepositPreauth` object tracks a preauthorization from one account to another. [DepositPreauth transactions][] create these objects.

This has no effect on processing of transactions unless the account that provided the preauthorization requires [Deposit Authorization](depositauth.html). In that case, the account that was preauthorized can send payments and other transactions directly to the account that provided the preauthorization. Preauthorizations are one-directional, and have no effect on payments going the opposite direction.

## Example {{currentpage.name}} JSON

```json
{
  "LedgerEntryType" : "DepositPreauth",
  "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "Authorize" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Flags" : 0,
  "OwnerNode" : "0000000000000000",
  "PreviousTxnID" : "3E8964D5A86B3CD6B9ECB33310D4E073D64C865A5B866200AD2B7E29F8326702",
  "PreviousTxnLgrSeq" : 7,
  "index" : "4A255038CC3ADCC1A9C91509279B59908251728D0DAADB248FFE297D0F7E068C"
}
```

## {{currentpage.name}} Fields

A `DepositPreauth` object has the following fields:

| Field               | JSON Type        | [Internal Type][] | Description     |
|:--------------------|:-----------------|:------------------|:----------------|
| `LedgerEntryType`   | String           | UInt16            | The value `0x0070`, mapped to the string `DepositPreauth`, indicates that this is a DepositPreauth object. |
| `Account` | String           | Account           | The account that granted the preauthorization. (The destination of the preauthorized payments.) |
| `Authorize` | String | Account | The account that received the preauthorization. (The sender of the preauthorized payments.) |
| `Flags`             | Number           | UInt32            |  A bit-map of boolean flags. No flags are defined for DepositPreauth objects, so this value is always `0`. |
| `OwnerNode`         | String           | UInt64            | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String           | Hash256           | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number           | UInt32            | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |


## DepositPreauth ID Format

The ID of a `DepositPreauth` object is the [SHA-512Half][] of the following values, concatenated in order:

* The DepositPreauth space key (`0x0070`)
* The AccountID of the owner of this object (the sender of the [DepositPreauth transaction][] that created this object; in other words, the one that granted the preauthorization)
* The AccountID of the preauthorized account (the `Authorized` field of the [DepositPreauth transaction][] that created this object; in other words, the one that received the preauthorization)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

---
html: depositpreauth-object.html #depositpreauth.html is taken by the tx type
parent: ledger-entry-types.html
seo:
    description: A record of preauthorization for sending payments to an account that requires authorization.
labels:
  - Security
---
# DepositPreauth
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/protocol/impl/LedgerFormats.cpp#L172-L178 "Source")

A `DepositPreauth` entry tracks a preauthorization from one account to another. [DepositPreauth transactions][] create these entries.

This has no effect on processing of transactions unless the account that provided the preauthorization requires [Deposit Authorization](../../../../concepts/accounts/depositauth.md). In that case, the account that was preauthorized can send payments and other transactions directly to the account that provided the preauthorization. Preauthorizations are one-directional, and have no effect on payments going the opposite direction.

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "LedgerEntryType": "DepositPreauth",
  "Account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "Authorize": "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Flags": 0,
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "3E8964D5A86B3CD6B9ECB33310D4E073D64C865A5B866200AD2B7E29F8326702",
  "PreviousTxnLgrSeq": 7,
  "index": "4A255038CC3ADCC1A9C91509279B59908251728D0DAADB248FFE297D0F7E068C"
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field               | JSON Type        | [Internal Type][] | Required? | Description     |
|:--------------------|:-----------------|:------------------|:----------|:----------------|
| `Account`           | String           | Account           | Yes       | The account that granted the preauthorization. (The destination of the preauthorized payments.) |
| `Authorize`         | String           | Account           | Yes       | The account that received the preauthorization. (The sender of the preauthorized payments.) |
| `LedgerEntryType`   | String           | UInt16            | Yes       | The value `0x0070`, mapped to the string `DepositPreauth`, indicates that this is a DepositPreauth object. |
| `OwnerNode`         | String           | UInt64            | Yes       | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String           | Hash256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number           | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |


## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.

## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the account that granted preauthorization, as long as the entry is in the ledger. Unauthorizing the counterparty frees up the reserve.

## DepositPreauth ID Format

The ID of a `DepositPreauth` object is the [SHA-512Half][] of the following values, concatenated in order:

* The DepositPreauth space key (`0x0070`)
* The AccountID of the owner of this object (the sender of the [DepositPreauth transaction][] that created this object; in other words, the one that granted the preauthorization)
* The AccountID of the preauthorized account (the `Authorized` field of the [DepositPreauth transaction][] that created this object; in other words, the one that received the preauthorization)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

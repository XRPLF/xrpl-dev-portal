---
seo:
    description: A record of preauthorization for sending payments to an account that requires authorization.
labels:
  - Security
---
# DepositPreauth
[[Source]](https://github.com/XRPLF/rippled/blob/f64cf9187affd69650907d0d92e097eb29693945/include/xrpl/protocol/detail/ledger_entries.macro#L246-L253 "Source")

A `DepositPreauth` entry tracks a preauthorization from one account. You can create a preauthorization by sending a [DepositPreauth transaction][], but it has no effect unless you are using [Deposit Authorization](../../../../concepts/accounts/depositauth.md).

A preauthorization allows specific others to send money directly to you even if you have Deposit Authorization enabled. Preauthorizations are one-directional, and have no effect on payments going the opposite direction.

You can preauthorize a specific _account_ or a _set of credentials_. In the case of a set of credentials, any account that has a matching set of credentials on-ledger can send you money. _(Credential preauthorization requires the [Credentials amendment][]. {% not-enabled /%})_

## Example {% $frontmatter.seo.title %} JSON

{% tabs %}

{% tab label="Single account preauthorization" %}
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
{% /tab %}

{% tab label="Credential preauthorization" %}
```json
{
  "LedgerEntryType": "DepositPreauth",
  "Account": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "AuthorizeCredentials": [{
    "Credential": {
      "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "CredentialType": "6D795F63726564656E7469616C"
    }
  }],
  "Flags": 0,
  "OwnerNode": "0000000000000000",
  "PreviousTxnID": "FD2A4E9E317C7FEF112D22ADEB9E2C6DC3C2AB6E2AD96A50B76EBB9DEB39EA77",
  "PreviousTxnLgrSeq": 7,
  "index": "F2B8550ADF60FD268157262C1C54E1D1014BDEA361CE848B6F48556348327E5F"
}
```
{% /tab %}
{% /tabs %}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field               | JSON Type         | [Internal Type][] | Required? | Description |
|:--------------------|:------------------|:------------------|:----------|:------------|
| `Account`           | String            | Account           | Yes       | The account that granted the preauthorization. (The destination of the preauthorized payments.) |
| `Authorize`         | String            | Account           | No        | The account that received the preauthorization. (The sender of the preauthorized payments.) |
| `AuthorizeCredentials` | Array          | Array             | No        | The set of credentials that received preauthorization. (Any account with these credentials is preauthorized.) This array has a minimum length of 1 and a maximum length of 8 credentials. |
| `LedgerEntryType`   | String            | UInt16            | Yes       | The value `0x0070`, mapped to the string `DepositPreauth`, indicates that this is a DepositPreauth object. |
| `OwnerNode`         | String            | UInt64            | Yes       | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. **Note:** The object does not contain a direct link to the owner directory containing it, since that value can be derived from the `Account`. |
| `PreviousTxnID`     | String - [Hash][] | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | Number            | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this object. |

Each entry must have _either_ the `Authorize` field or the `AuthorizeCredentials` field, but not both.

### Authorized Credential Objects

If the entry has an `AuthorizeCredentials` field, each member of that array is an inner object, identifying one credential to require, with the following format:

| Field            | JSON Type            | [Internal Type][] | Required? | Description     |
|:-----------------|:---------------------|:------------------|:----------|:----------------|
| `Issuer`         | String - [Address][] | AccountID         | Yes       | The issuer of the credential. |
| `CredentialType` | String - Hexadecimal | Blob              | Yes       | The credential type of the credential. |

To be preauthorized, an account must hold all the specified credentials.

## {% $frontmatter.seo.title %} Flags

There are no flags defined for {% code-page-name /%} entries.

## {% $frontmatter.seo.title %} Reserve

{% code-page-name /%} entries count as one item towards the owner reserve of the account that granted preauthorization, as long as the entry is in the ledger. Unauthorizing the counterparty frees up the reserve.

## DepositPreauth ID Format

There are two formats for the ID of a `DepositPreauth` entry, depending on whether it authorizes an individual account or a set of credentials.

### Individual Account Preauthorization

In this case, the ID is the [SHA-512Half][] of the following values, concatenated in order:

* The DepositPreauth space key (`0x0070`)
* The AccountID of the owner of this object (the sender of the [DepositPreauth transaction][] that created this object; in other words, the one that granted the preauthorization)
* The AccountID in the `Authorize` field

### Credential Preauthorization

In this case, the ID is the [SHA-512Half][] of the following values, concatenated in order:

* The Credential Preauth space key (`0x0050`)
* The AccountID of the owner of this object (the sender of the [DepositPreauth transaction][] that created this object; in other words, the one that granted the preauthorization)
* The contents of the `AuthorizeCredentials` field.

{% amendment-disclaimer name="Credentials" /%}

## See Also

- **Transactions**
  - [DepositPreauth transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

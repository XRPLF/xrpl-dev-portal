---
seo:
    description: A credential, which can be used to preauthorize payments or gain access to specific permissioned domains.
status: not_enabled
---
# Credential

A `Credential` entry represents a [credential](../../../../concepts/decentralized-storage/credentials.md), which contains an attestation about a _subject_ account from a _credential issuer_ account. The meaning of the attestation is defined by the issuer.

{% amendment-disclaimer name="Credentials" /%}

## Example Credential JSON

```json
{
    "LedgerEntryType": "Credential",
    "Flags": 65536,
    "Subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "IssuerNode": "0000000000000000",
    "CredentialType": "6D795F63726564656E7469616C",
    "PreviousTxnID": "8089451B193AAD110ACED3D62BE79BB523658545E6EE8B7BB0BE573FED9BCBFB",
    "PreviousTxnLgrSeq": 234644,
    "SubjectNode": "0000000000000000",
    "index": "A738A1E6E8505E1FC77BBB9FEF84FF9A9C609F2739E0F9573CDD6367100A0AA9"
}
```

<!-- TODO: update to a real example -->

## Credential Fields

In addition to the [common fields](../common-fields.md), {% code-page-name /%} entries have the following fields:

| Field               | JSON Type            | [Internal Type][] | Required? | Description     |
|:--------------------|:---------------------|:------------------|:----------|:----------------|
| `CredentialType`    | String - Hexadecimal | Blob              | Yes       | Arbitrary data defining the type of credential this entry represents. The minimum length is 1 byte and the maximum length is 64 bytes. |
| `Expiration`        | Number               | UInt32            | No        | Time after which the credential is expired, in [seconds since the Ripple Epoch][].
| `Issuer`            | String - [Address][] | AccountID         | Yes       | The account that issued this credential. |
| `IssuerNode`        | String               | UInt64            | Yes       | A hint indicating which page of the issuer's directory links to this entry, in case the directory consists of multiple pages. |
| `PreviousTxnID`     | String - [Hash][]    | UInt256           | Yes       | The identifying hash of the transaction that most recently modified this entry. |
| `PreviousTxnLgrSeq` | Number               | UInt32            | Yes       | The [index of the ledger][Ledger Index] that contains the transaction that most recently modified this entry. |
| `Subject`           | String - [Address][] | AccountID         | Yes       | The account that this credential is for. |
| `SubjectNode`       | String               | UInt64            | Yes       | A hint indicating which page of the subject's owner directory links to this entry, in case the directory consists of multiple pages. |
| `URI`               | String - Hexadecimal | Blob              | No        | Arbitrary additional data about the credential, for example a URL where a W3C-formatted Verifiable Credential can be retrieved. |

## Credential Flags

Credential entries can have the following flags combined in the `Flags` field:

| Flag Name     | Hex Value    | Decimal Value | Description |
|---------------|--------------|---------------|-------------|
| `lsfAccepted` | `0x00010000` | 65536         | If enabled, the subject of the credential has accepted the credential. Otherwise, the issuer created the credential but the subject has not yet accepted it, meaning it is not yet valid. |

## Credential Reserve

A credential entry counts as one item towards the owner reserve of the subject account, if the subject has accepted the credential. Otherwise, a credential entry counts as one item toward the reserve of the issuer account.

## Credential ID Format

The unique ID of a Credential entry is the SHA-512Half hash of the following values concatenated in order:

* The `Credential` space key (`0x0044`);
* The `Subject` field's value;
* The `Issuer` field's value; and
* The `CredentialType` field's value.

## See Also

- **Transactions:**
  - [CredentialAccept transaction][]
  - [CredentialCreate transaction][]
  - [CredentialDelete transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

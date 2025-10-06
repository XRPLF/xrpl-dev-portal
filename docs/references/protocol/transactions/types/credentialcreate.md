---
seo:
    description: Provisionally issue a credential to a subject account.
---
# CredentialCreate
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Credentials.cpp "Source")

Provisionally issue a [credential](../../../../concepts/decentralized-storage/credentials.md) in the ledger. The credential is not valid until the subject of the credential accepts it with a [CredentialAccept transaction][].

{% amendment-disclaimer name="Credentials" /%}

## Example CredentialCreate JSON

```json
{
    "TransactionType" : "CredentialCreate",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "CredentialType": "6D795F63726564656E7469616C",
    "Fee": "10",
    "Flags": 0,
    "Sequence": 234200
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

In addition to the [common fields][], CredentialCreate transactions use the following fields:

| Field            | JSON Type            | [Internal Type][] | Required? | Description |
|:-----------------|:---------------------|:------------------|:----------|:------------|
| `Subject`        | String - [Address][] | AccountID         | Yes       | The subject of the credential. |
| `CredentialType` | String - Hexadecimal | Blob              | Yes       | Arbitrary data defining the type of credential this entry represents. The minimum length is 1 byte and the maximum length is 64 bytes. |
| `Expiration`     | Number               | UInt32            | No        | Time after which this credential expires, in [seconds since the Ripple Epoch][]. |
| `URI`            | String - Hexadecimal | Blob              | No        | Arbitrary additional data about the credential, such as the URL where users can look up an associated Verifiable Credential document. If present, the minimum length is 1 byte and the maximum is 256 bytes. |

The `Account` field (the sender) of the transaction is the issuer of the credential. It is possible for the issuer and the subject to be the same account.

## Error Cases

Besides errors that can occur for all transactions, CredentialCreate transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code | Description |
|:-----------|:------------|
| `tecDUPLICATE` | A credential with the same subject, issuer, and credential type already exists in the ledger. |
| `tecEXPIRED` | The credential's expiration time is in the past. |
| `tecNO_TARGET` | The account specified in the `Subject` field is not a funded account in the ledger. |
| `temDISABLED` | The related amendment is not enabled. |
| `temINVALID_ACCOUNT_ID` | The provided `Subject` field is invalid. For example, it contains [ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#special-addresses). |
| `temINVALID_FLAG` | The transaction includes a [Flag](../common-fields.md#flags-field) that does not exist, or includes a contradictory combination of flags. {% amendment-disclaimer name="fixInvalidTxFlags" /%} |

## See Also

- [Credential entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
seo:
    description: Remove a credential from the ledger, effectively revoking it.
---
# CredentialDelete
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Credentials.cpp "Source")

Remove a [credential](../../../../concepts/decentralized-storage/credentials.md) from the ledger, effectively revoking it. Users may also want to delete an unwanted credential to reduce their [reserve requirement](../../../../concepts/accounts/reserves.md).

{% amendment-disclaimer name="Credentials" /%}

## Example CredentialDelete JSON

```json
{
    "TransactionType" : "CredentialDelete",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Subject": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "CredentialType": "6D795F63726564656E7469616C",
    "Fee": "10",
    "Flags": 0,
    "Sequence": 234203
}
```

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

In addition to the [common fields][], CredentialDelete transactions use the following fields:

| Field            | JSON Type            | [Internal Type][] | Required? | Description |
|:-----------------|:---------------------|:------------------|:----------|:------------|
| `CredentialType` | String - Hexadecimal | Blob              | Yes       | Arbitrary data defining the type of credential to delete. The minimum length is 1 byte and the maximum length is 256 bytes. |
| `Subject`        | String - [Address][] | AccountID         | No        | The subject of the credential to delete. If omitted, use the `Account` (sender of the transaction) as the subject of the credential. |
| `Issuer`         | String - [Address][] | AccountID         | No        | The issuer of the credential to delete. If omitted, use the `Account` (sender of the transaction) as the issuer of the credential. |

You must provide the `Subject` field, `Issuer` field, or both.

This transaction looks for a [Credential ledger entry](../../ledger-data/ledger-entry-types/credential.md) with the specified subject, issuer, and credential type, and deletes that entry if the sender of the transaction has permission to. The holder or issuer of a credential can delete it at any time. If the credential is expired, anyone can delete it.


## Error Cases

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | The related amendment is not enabled. |
| `temINVALID_ACCOUNT_ID` | A provided `Subject` or `Issuer` field is invalid. For example, it contains [ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#special-addresses). |
| `tecNO_PERMISSION` | The sender is neither the issuer nor subject of the credential, and the credential is not expired. |
| `tecNO_ENTRY` | The specified credential does not exist in the ledger. |
| `temINVALID_FLAG` | The transaction includes a [Flag](../common-fields.md#flags-field) that does not exist, or includes a contradictory combination of flags. {% amendment-disclaimer name="fixInvalidTxFlags" /%} |

## See Also

- [Credential entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

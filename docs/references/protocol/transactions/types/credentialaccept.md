---
seo:
    description: Accept a credential provisionally issued to your account.
labels:
    - Decentralized Storage
requiredAmendment: Credentials
txIcon: finish
---
# CredentialAccept
{% source-link path="src/libxrpl/tx/transactors/credentials/CredentialAccept.cpp" /%}

Accept a [credential](../../../../concepts/decentralized-storage/credentials.md), which makes the credential valid. Only the subject of the credential can do this.

{% amendment-disclaimer name="Credentials" /%}

## Example CredentialAccept JSON

```json
{
    "TransactionType": "CredentialAccept",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "CredentialType": "6D795F63726564656E7469616C"
}
```

{% tx-example txid="D594C7AFAEE554770C441502D4F88E63B97F8D16D6579CDE7A91658AC2044D2C" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field            | JSON Type        | [Internal Type][] | Required? | Description |
|:-----------------|:-----------------|:------------------|:----------|:------------|
| `Issuer`         | String - [Address][] | AccountID     | Yes       | The address of the issuer that created the credential. |
| `CredentialType` | String           | Blob              | Yes       | Arbitrary data defining the type of credential. The minimum size is 1 byte and the maximum is 64 bytes. |

The `Account` field (the sender of this transaction) must be the subject of the credential.

The combination of `Account`, `Issuer`, and `CredentialType` must match a `Credential` ledger entry that exists in the ledger and has not already been accepted; otherwise, the transaction fails.

## Error Cases

| Error Code | Description |
|:-----------|:------------|
| `tecDUPLICATE` | The specified credential has already been accepted. |
| `tecEXPIRED` | The specified credential has an expiration time in the past. (In this case, the transaction also deletes the expired credentials from the ledger.) |
| `tecNO_ENTRY` | The credential uniquely identified by the `Account`, `Issuer`, and `CredentialType` fields of the transaction does not exist in the ledger. |
| `temDISABLED` | The related amendment is not enabled. |
| `temINVALID_ACCOUNT_ID` | The provided `Issuer` field is invalid. For example, it contains [ACCOUNT_ZERO](../../../../concepts/accounts/addresses.md#special-addresses). |
| `temINVALID_FLAG` | The transaction includes a [Flag](../common-fields.md#flags-field) that does not exist, or includes a contradictory combination of flags. {% amendment-disclaimer name="fixInvalidTxFlags" /%} |

## See Also

- [Credential entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
seo:
    description: Send MPT tokens to another account while keeping the transfer amount hidden.
labels:
  - Multi-Purpose Tokens, MPTs
  - Tokens
  - Confidential Transfers
requiredAmendment: ConfidentialTransfer
---
# ConfidentialMPTSend
{% source-link path="src/libxrpl/tx/transactors/token/ConfidentialMPTSend.cpp" /%}

Send MPT tokens to another account while keeping the transfer amount hidden. The transferred amount is credited to the receiver's confidential inbox balance to avoid proof staleness. The receiver can later merge these funds into the spending balance via the [ConfidentialMPTMergeInbox transaction][].

Confidential sends are subject to the same authorization requirements as standard MPT Payments, including Deposit Authorization and Credentials.

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTSend",
  "Account": "rpYwWZWo2bwbtGTTsx8UorTCQoAKVPkvfk",
  "Destination": "rUUeVf9zJWfg7mxNCLhEXm9mfmeHBGb9w3",
  "MPTokenIssuanceID": "003CE807D39D78123FFBDD9401BEC038D88BD328AC353B9C",
  "SenderEncryptedAmount": "02CA70B73153F851DA1CB367E985D8B8F1E4C53753BFD27B93C2489A2E2C622F350399F5F14184F0FA88A34F3FF27379BB129CAA431E23264F8917A682AAF97CA628",
  "DestinationEncryptedAmount": "02CA70B73153F851DA1CB367E985D8B8F1E4C53753BFD27B93C2489A2E2C622F35025F7386F0A0A96E8E49477CA5FFA5D28BC5ED7CC5CFB8DD57921DD536EDE3F935",
  "IssuerEncryptedAmount": "02CA70B73153F851DA1CB367E985D8B8F1E4C53753BFD27B93C2489A2E2C622F35039A2C434AE796AD521CBFF0B47AD1B7FA9F1820D058E6A3AAF8A5555B100E01B0",
  "ZKProof": "98B7B9DEF9F82424DC9C6F6901CF4E6A04802C1F270C0E5E0AE0C6541519ACA955A924CF8D04A5F1FAB4D59C8198F3E3ED5601F38271CCED7CBD1D29C56645C94B82BFAF7D43D47DFF3970D64762E6859DD9466451EFF5D909A6A0CA4E84636CEEAC47BA71F8304491645DDA8A93E9474A7382E43486557C7FA3448EBE8C1C3954C515A8DFDE689908113F3B9524435C2B91B18DAB2B0CAFEC977E4D56C49134C9CF2D5034393A5A6551893D7C203E0897A01BE4A7AF3648C71163CF598AA8EA02DEF43B6C9136EFE6E9FB447875C45EEA173EA3A166EA7D762459DBD8E58D6354025A31B9DB3CD45610EFCD9A72C690BB5AF497EB48DA8DEEB1A417B941B73387F1025C85FE023C72D49580042B00C059F5ACCEEDEC5021C25CE3524CC892952ED6CF0337B560678A2FADA6E93F4A66ECB00B77734E98EAAAB615707F6B2990CE6B79130252E54DD6A1C1D06DF1A0A033E71A8D06119900295443830BF5F342C2BD5494A10242B6CDFBA3D6BB096991DB2DE317AADA569084182422D9221E5E9E486FBAD13E03CD026422D3285C4309CC68944ACFE9EEFED1CAC24979E2B1F4F478214B87111D02EA66BA2142DFC9A59B68DAD4F68D856522C8E5C0725097D91894EB6491818756032DDAD6B5803C8B2EE20D28F5D607757B8B0E6E7A4A9FCD4792DD0C4C62770D9002F860997B9EC3B18FB6F2A787C12E7959BFCF3FD4CD4FD699E74C821CD821B838025A2C56CA2AE262AF11947C092FEA2531A83588803A508018E8AA941BEF0089C003C487F14DC5762E5DDD32EB912D12177D931E1F00471AB2468ECEA86C48E42F8803B65D358C0E2622F20F815D7DD2B06C8507A24AE2667467A9F9F25FF3CF4D142A02015A18C5616030B3384AA46614999917418E5B8239390DEDDBDCC9D0F26F35BB02580573FC2747283E5FFC1FEDE25AA0C3B83644DE8706DC9DC5EC3F84567D48730317123626B6E15D9A0454F7FDB9509776B5E78266AF9D6CA2DF10C1915FE4917603F476EE34708E8FCBDB60354983CADDD710DC74819E1A3D59D9F1F7F8A3AEBF7302B3DC1FDE8B2279F47CC5C124511AF7D6494ECA67933E1B31367F69A5F1FC6362CF543DC2A922BA99532C475688B19E5C153A2F6F05F2C3F43FDEDF95C1AACB39DA3B9BA4EC157A884D94707486CCA15F33DB06A6653832F9156D78CDE38648027F0DB4E7691E529412544725E5308B082BF44B63A0E26A47FB4C69F439286AE85A0ECD8AF7A3707FBCE97FD8E08D17BFAE6493290A0EDA5889E220936654DF428B57BA5DED9B655F7A4665CEF8289BE16688E53814F827583FBB5FE961545143",
  "AmountCommitment": "03226CC36FE3F69AD585ABA4A5739533A6C00B914F6BDEF8088B6DFFDB7018EED8",
  "BalanceCommitment": "02CF7E8DFE5F45D51E2EBC8A03A727D30FE2F55B8323C33CDFF2BE3D0A0E9524B6",
  "Fee": "10",
  "Sequence": 3991566
}
```

{% tx-example txid="E1B7B71FFAB203741ACD889777668EA6D0C15421F2616ADC54DC1DD758697043" server="devnet" /%}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `AmountCommitment`        | String    | Blob              | Yes       | A cryptographic commitment to the amount being transferred. |
| `AuditorEncryptedAmount`  | String    | Blob              | No        | A ciphertext for the auditor. Required if `AuditorEncryptionKey` is present on the issuance. |
| `BalanceCommitment`       | String    | Blob              | Yes       | A cryptographic commitment to the user's confidential spending balance. |
| `CredentialIDs`           | Array     | Vector256         | No        | An array of Credential IDs. If present, the transaction can only succeed if the sender is authorized by credentials that match these IDs. |
| `Destination`             | String    | AccountID         | Yes       | The receiver's account. |
| `DestinationEncryptedAmount` | String | Blob              | Yes       | A ciphertext credited to the receiver's inbox balance. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | A ciphertext used to update the issuer mirror balance. |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The identifier of the MPT issuance being transferred. |
| `SenderEncryptedAmount`   | String    | Blob              | Yes       | A ciphertext used to homomorphically debit the sender's spending balance. |
| `ZKProof`                 | String    | Blob              | Yes       | A 946-byte proof bundle containing a compact Send sigma proof and an aggregated Bulletproof range proof. See [Proof Structure](#proof-structure) for details. |

## Proof Structure

The `ZKProof` field contains a 946-byte bundle made up of two parts:

- A **compact Send sigma proof (192 bytes)** which simultaneously verifies:

  - **Ciphertext consistency:** All encrypted copies of the transfer amount (sender, receiver, issuer, and optional auditor) encrypt the same value.
  - **Amount linkage:** The `AmountCommitment` commits to the same transfer amount as the ciphertexts.
  - **Balance linkage:** The `BalanceCommitment` encodes the same spending balance as the sender's on-ledger encrypted balance.

- An **aggregated Bulletproof range proof (754 bytes)** which verifies that both the transfer amount and the remaining balance are non-negative.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `tecBAD_CREDENTIALS`    | A credential in `CredentialIDs` does not exist, does not belong to the sender, or has not been accepted. |
| `tecBAD_PROOF`          | The Zero-Knowledge Proof verification failed. The provided `ZKProof` fails the compact sigma or range proof check, which can happen if it was generated with an outdated `ConfidentialBalanceVersion`. |
| `tecDST_TAG_NEEDED`     | The `Destination` account requires a destination tag, but the transaction does not include a `DestinationTag`. |
| `tecEXPIRED`            | A credential in `CredentialIDs` has expired. |
| `tecLOCKED`             | The MPT is locked for the sender or the `Destination` account, or the issuance is globally locked. |
| `tecNO_AUTH`            | The issuance does not have the **Can Transfer** flag enabled, or the issuance requires authorization and the sender's or destination's `MPToken` is not authorized. |
| `tecNO_PERMISSION`      | The transaction lacks the required permissions. Common causes include:<br>- The issuance does not have the **Can Hold Confidential Balance** flag enabled, or it has `AuditorEncryptionKey` set but the transaction omits `AuditorEncryptedAmount` (or the reverse).<br>- The sender's or destination's `MPToken` is missing the `HolderEncryptionKey` or the required confidential balance fields.<br>- The `Destination` account has Deposit Authorization enabled and the sender is neither preauthorized nor presenting valid matching credentials in `CredentialIDs`. |
| `tecNO_TARGET`          | The `Destination` account does not exist. |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance`, the sender's `MPToken`, or the destination's `MPToken` does not exist. |
| `temBAD_CIPHERTEXT`     | One or more encrypted amount fields (`SenderEncryptedAmount`, `DestinationEncryptedAmount`, `IssuerEncryptedAmount`, or `AuditorEncryptedAmount`) has an incorrect length or represents an invalid elliptic curve point. |
| `temDISABLED`           | The transaction requires logic that is disabled. Common causes include:<br>- The `ConfidentialTransfer` amendment is not enabled.<br>- The transaction includes `CredentialIDs`, but the `Credentials` amendment is not enabled. |
| `temMALFORMED`          | The transaction is malformed. Common causes include:<br>- The `Account` or the `Destination` is the issuer of the `MPTokenIssuanceID`, or the `Account` and `Destination` are the same.<br>- The `ZKProof` length is not 946 bytes, or `AmountCommitment` or `BalanceCommitment` is not a valid compressed EC point.<br>- `CredentialIDs` is empty, exceeds the maximum size, or contains duplicates. |

## See Also

- [MPToken entry][]
- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

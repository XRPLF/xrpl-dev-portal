---
seo:
    description: Convert a confidential MPT balance into a public one.
labels:
  - Multi-Purpose Tokens, MPTs
  - Tokens
  - Confidential Transfers
requiredAmendment: ConfidentialTransfer
---
# ConfidentialMPTConvertBack
{% source-link path="src/libxrpl/tx/transactors/token/ConfidentialMPTConvertBack.cpp" /%}

Convert your confidential MPT balance back to a public balance. This debits the confidential spending balance and credits the public balance with the plaintext amount. For the issuer's _second account_, this returns confidential supply to the issuer account reserve.

{% admonition type="info" name="Note" %}
Only the spending balance can be converted back. Amounts in the inbox must first be merged into the spending balance using the [ConfidentialMPTMergeInbox transaction][].
{% /admonition %}

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTConvertBack",
  "Account": "rUserAccount...",
  "MPTokenIssuanceID": "610F33...",
  "MPTAmount": "500",
  "HolderEncryptedAmount": "AD3F...",
  "IssuerEncryptedAmount": "BC2E...",
  "AuditorEncryptedAmount": "C1A9...",
  "BlindingFactor": "12AB...",
  "ZKProof": "ABCD...",
  "BalanceCommitment": "038A...",
  "Fee": "12",
  "Sequence": 2470665,
  "Flags": 2147483648
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |
| `MPTAmount`               | String    | UInt64            | Yes       | The plaintext amount to credit to the public balance. |
| `HolderEncryptedAmount`   | String    | Blob              | Yes       | 66-byte Ciphertext to be subtracted from the holder's `ConfidentialBalanceSpending`. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | 66-byte Ciphertext to be subtracted from the issuer's mirror balance. |
| `AuditorEncryptedAmount`  | String    | Blob              | No        | 66-byte Ciphertext for the auditor. Required if `AuditorEncryptionKey` is present on the issuance. |
| `BlindingFactor`          | String    | UInt256           | Yes       | The 32-byte scalar value used to encrypt the amount. Used by validators to verify the ciphertexts match the plaintext `MPTAmount`. |
| `BalanceCommitment`       | String    | Blob              | Yes       | A 33-byte cryptographic commitment to the user's confidential spending balance. |
| `ZKProof`                 | String    | Blob              | Yes       | An 816-byte proof bundle containing a compact ConvertBack sigma proof and a single Bulletproof range proof. See [Proof Structure](#proof-structure) for details. |

## Proof Structure

The `ZKProof` field contains an 816-byte bundle made up of two parts:

- A **compact ConvertBack sigma proof (128 bytes)** that verifies the holder owns the spending balance and that the `BalanceCommitment` is correctly derived from it.

- A **single Bulletproof range proof (688 bytes)** that verifies that the remaining balance after withdrawal is non-negative.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `temDISABLED`           | The ConfidentialTransfer amendment is not enabled. |
| `temMALFORMED`          | The account is the Issuer, or the `BlindingFactor` is not exactly 32 bytes. |
| `temBAD_CIPHERTEXT`     | Ciphertext lengths or formats are invalid. |
| `temBAD_AMOUNT`         | `MPTAmount` is zero or greater than the maximum allowable supply. |
| `tecOBJECT_NOT_FOUND`   | The `MPToken` or `MPTokenIssuance` does not exist. |
| `tecNO_PERMISSION`      | One of the following occurred:<ul><li>The issuance does not have the **Can Hold Confidential Balance** flag.</li><li>The user's `MPToken` is missing the `ConfidentialBalanceSpending` or `HolderEncryptionKey` fields.</li><li>The issuance has `AuditorEncryptionKey` set but the transaction does not include `AuditorEncryptedAmount`.</li></ul> |
| `tecINSUFFICIENT_FUNDS` | The global `ConfidentialOutstandingAmount` is less than the requested `MPTAmount`, or the user's confidential balance is insufficient. |
| `tecBAD_PROOF`          | One of the following occurred:<ul><li>The `BlindingFactor` fails to verify the integrity of the ciphertexts.</li><li>The provided `ZKProof` fails the compact sigma or range proof check.</li></ul> |
| `tecLOCKED`             | The MPT asset is locked for the account, or the asset is globally locked. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}

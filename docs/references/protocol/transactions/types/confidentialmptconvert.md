---
seo:
    description: Convert a public MPT balance to a confidential one.
labels:
  - Multi-Purpose Tokens, MPTs
  - Tokens
  - Confidential Transfers
requiredAmendment: ConfidentialTransfer
---
# ConfidentialMPTConvert
{% source-link path="src/libxrpl/tx/transactors/token/ConfidentialMPTConvert.cpp" /%}

Convert your public MPT balance to an encrypted confidential balance. The converted amount is credited to your confidential inbox balance, requiring an explicit [ConfidentialMPTMergeInbox transaction][] to merge it into your spending balance before use.

This transaction also serves as the opt-in mechanism for confidential transfer participation. By executing it, including with a zero-amount conversion, your `HolderEncryptionKey` is recorded on your `MPToken` object, enabling you to receive and manage confidential funds. Issuers can convert tokens through a separate holder account that they control, which participates as a regular holder with no special privileges.

{% admonition type="info" name="Note" %}
This transaction converts only your **own** balance. To send confidential tokens to another account, first convert your balance, then use [ConfidentialMPTSend transaction][].
{% /admonition %}

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTConvert",
  "Account": "rBob...",
  "MPTokenIssuanceID": "610F33...",
  "MPTAmount": "1000",
  "HolderEncryptionKey": "038d...",
  "HolderEncryptedAmount": "AD3F...",
  "IssuerEncryptedAmount": "BC2E...",
  "BlindingFactor": "EE21...",
  "ZKProof": "ABCD...",
  "Fee": "12",
  "Sequence": 2470665,
  "Flags": 2147483648
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance being converted. |
| `MPTAmount`               | String    | UInt64            | Yes       | The public plaintext amount to convert into a confidential balance. Must be non-negative. |
| `HolderEncryptionKey`     | String    | Blob              | No        | The holder's ElGamal public key for confidential balances. Required when enabling confidential transfers for the first time. Forbidden if a key is already registered. |
| `HolderEncryptedAmount`   | String    | Blob              | Yes       | 66-byte ElGamal ciphertext credited to the holder's inbox balance. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | 66-byte ElGamal ciphertext credited to the issuer's mirror balance. |
| `AuditorEncryptedAmount`  | String    | Blob              | No        | A 66-byte ElGamal Ciphertext for the auditor. Required if `AuditorEncryptionKey` is present on the issuance. |
| `BlindingFactor`          | String    | UInt256           | Yes       | The 32-byte scalar value used to encrypt the amount. Used by validators to verify the ciphertexts match the plaintext `MPTAmount`. |
| `ZKProof`                 | String    | Blob              | No        | A Schnorr Proof of Knowledge. Required only when `HolderEncryptionKey` is present. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `temDISABLED`           | The ConfidentialTransfer amendment is not enabled. |
| `temMALFORMED`          | The transaction is malformed for one of the following reasons:<ul><li>`HolderEncryptionKey` is provided but `ZKProof` is not.</li><li>`HolderEncryptionKey` is not provided but `ZKProof` is.</li><li>`HolderEncryptionKey` length is not exactly 33 bytes.</li><li>`BlindingFactor` length is not 32 bytes.</li><li>`ZKProof` length is not 64 bytes.</li></ul> |
| `temBAD_AMOUNT`         | The `MPTAmount` is less than 0 or exceeds the maximum allowable MPT amount. |
| `temBAD_CIPHERTEXT`     | One or more encrypted amount fields (`HolderEncryptedAmount`, `IssuerEncryptedAmount`, or `AuditorEncryptedAmount`) have incorrect length or represent an invalid elliptic curve point. |
| `tecNO_PERMISSION`      | The issuance has `AuditorEncryptionKey` set, but the transaction does not include `AuditorEncryptedAmount`. |
| `tecDUPLICATE`          | A public key is provided in the transaction, but the account already has a registered key. |
| `tecINSUFFICIENT_FUNDS` | The holder does not have sufficient public MPT balance to cover the MPTAmount. |
| `tecBAD_PROOF`          | The ZKP verification failed for one of the following reasons:<ul><li>The `BlindingFactor` fails to reconstruct the provided ciphertexts given the plaintext `MPTAmount`.</li><li>The Schnorr ZKP fails to verify the holder's knowledge of the secret key.</li></ul> |

{% raw-partial file="/docs/_snippets/common-links.md" /%}

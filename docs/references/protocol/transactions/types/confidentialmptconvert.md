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
This transaction converts only your **own** balance. To send confidential tokens to another account, first convert your balance, then use the [ConfidentialMPTSend transaction][].
{% /admonition %}

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTConvert",
  "Account": "rhdqgMJT8JwqqBJuYU7cAxD7CGX1DeqC7m",
  "MPTokenIssuanceID": "003CE81F85A1B66910DD3571C42D38A9F5A8EF78F3C8E2C0",
  "MPTAmount": "10000",
  "HolderEncryptionKey": "0254C80DB095006FC85744E37329E0ABEB69D43276A619C022C1BA7C9F96FB9763",
  "HolderEncryptedAmount": "024FAC979851DFF67543179FE35994ABDD4E08187FC356BEA2CAB7738B15E7FECD03743577C284F0A47231996E35CC7FB72D432706021E63FDE490387FFA3833E965",
  "IssuerEncryptedAmount": "024FAC979851DFF67543179FE35994ABDD4E08187FC356BEA2CAB7738B15E7FECD035D06971DA9492A6787CCA92879B311699B2277BDC4493BB99B1728A6076BDEE4",
  "BlindingFactor": "4F2228BB35CF43764A87D4A81314CF3E4BF3E3428F42F8B51E1A3699BB299AE5",
  "ZKProof": "3CC549CC0D2641212C055E60F2D35F5F9130591AFA5FA612A234B43255EC8112A5F8EE7379B82D009B4094B94764B830BE97D68AD57C5DEB4702C16DE92B8AF1",
  "Fee": "10",
  "Sequence": 3991588
}
```

{% tx-example txid="3910DAFE024C7799BB7ADA5C0045A6FC9A9FF3E6ED3518C0A15C5A5044DC18E6" server="devnet" /%}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `AuditorEncryptedAmount`  | String    | Blob              | No        | A 66-byte ElGamal Ciphertext for the auditor. Required if `AuditorEncryptionKey` is present on the issuance. |
| `BlindingFactor`          | String    | UInt256           | Yes       | The 32-byte scalar value used to encrypt the amount. Used by validators to verify the ciphertexts match the plaintext `MPTAmount`. |
| `HolderEncryptedAmount`   | String    | Blob              | Yes       | A 66-byte ElGamal ciphertext credited to the holder's inbox balance. |
| `HolderEncryptionKey`     | String    | Blob              | No        | The holder's ElGamal public key for confidential balances. Required when enabling confidential transfers for the first time. Forbidden if a key is already registered. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | A 66-byte ElGamal ciphertext credited to the issuer's mirror balance. |
| `MPTAmount`               | String    | UInt64            | Yes       | The public plaintext amount to convert into a confidential balance. |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance being converted. |
| `ZKProof`                 | String    | Blob              | No        | A Schnorr Proof of Knowledge. Required only when `HolderEncryptionKey` is present. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `tecBAD_PROOF`          | The Zero-Knowledge Proof verification failed. Common causes include:<br>- The `BlindingFactor` fails to reconstruct the provided ciphertexts given the plaintext `MPTAmount`.<br>- The Schnorr proof fails to verify the holder's knowledge of the secret key. |
| `tecDUPLICATE`          | The transaction provides a `HolderEncryptionKey`, but the account already has a registered key. |
| `tecINSUFFICIENT_FUNDS` | The account's public MPT balance is less than the requested `MPTAmount`. |
| `tecLOCKED`             | The MPT is locked for the account, or the issuance is globally locked. |
| `tecNO_AUTH`            | The issuance requires authorization and the account's `MPToken` is not authorized. |
| `tecNO_PERMISSION`      | The transaction lacks the required permissions. Common causes include:<br>- The issuance does not have the **Can Hold Confidential Balance** flag enabled.<br>- The issuance has `AuditorEncryptionKey` set but the transaction omits `AuditorEncryptedAmount` (or the reverse). |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance` or the account's `MPToken` does not exist. |
| `temBAD_AMOUNT`         | The `MPTAmount` exceeds the maximum allowable MPT amount. |
| `temBAD_CIPHERTEXT`     | One or more encrypted amount fields (`HolderEncryptedAmount`, `IssuerEncryptedAmount`, or `AuditorEncryptedAmount`) has an incorrect length or represents an invalid elliptic curve point. |
| `temDISABLED`           | The `ConfidentialTransfer` amendment is not enabled. |
| `temMALFORMED`          | The transaction is malformed. Common causes include:<br>- The `Account` is the issuer of the `MPTokenIssuanceID`.<br>- `HolderEncryptionKey` is provided but `ZKProof` is not.<br>- The `ZKProof` length is not 64 bytes. |

## See Also

- [MPToken entry][]
- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

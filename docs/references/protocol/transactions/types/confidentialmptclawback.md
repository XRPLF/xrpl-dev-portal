---
seo:
    description: Claw back a holder's entire confidential balance, removing it from circulation.
labels:
  - Multi-Purpose Tokens, MPTs
  - Tokens
  - Confidential Transfers
requiredAmendment: ConfidentialTransfer
---
# ConfidentialMPTClawback
{% source-link path="src/libxrpl/tx/transactors/token/ConfidentialMPTClawback.cpp" /%}

Claw back a holder's _entire_ confidential balance (inbox and spending), removing it from circulation.

Unlike a regular [Clawback](../../../../concepts/tokens/fungible-tokens/clawing-back-tokens.md), confidential balances are encrypted, so the issuer must provide the plaintext total amount to claw back and a Zero-Knowledge Proof (ZKP) validating the amount.

{% admonition type="danger" name="Caution" %}
Issuers should **lock** the MPT issuance for the holder before submitting this transaction to ensure state consistency during proof verification. See [Confidential Clawback](../../../../concepts/tokens/fungible-tokens/confidential-transfers.md#confidential-clawback).
{% /admonition %}

{% amendment-disclaimer name="ConfidentialTransfer" /%}

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "ConfidentialMPTClawback",
  "Account": "rDB2bV1SRJcJEvJjhi7H5NUxwRpF4o3Ain",
  "Holder": "rhdqgMJT8JwqqBJuYU7cAxD7CGX1DeqC7m",
  "MPTokenIssuanceID": "003CE81F85A1B66910DD3571C42D38A9F5A8EF78F3C8E2C0",
  "MPTAmount": "10000",
  "ZKProof": "E4A57C2D220860067BF61BE8DA18C4A920B90998C4B7D53C0EF0D1EB27D6E7DD51CDC8BA598F60C861C708C629930F8B91704CC9135AB22088C74FBCB888850A",
  "Fee": "10",
  "Sequence": 3991586
}
```

{% tx-example txid="371BD1CEE530C458E382B476BE303B4BA130293DA24D929CEB000E8363039AFC" server="devnet" /%}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `Holder`                  | String    | AccountID         | Yes       | The account from which funds are being clawed back. |
| `MPTAmount`               | String    | UInt64            | Yes       | The plaintext total amount being removed. |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |
| `ZKProof`                 | String    | Blob              | Yes       | A 64-byte compact Clawback sigma proof that proves the issuer's on-ledger balance mirror (`IssuerEncryptedBalance`) decrypts to the plaintext total amount (`MPTAmount`) being clawed back. |

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `tecBAD_PROOF`          | The Zero-Knowledge Proof verification failed. The proof does not show that the `IssuerEncryptedBalance` (the mirror balance) encrypts the plaintext `MPTAmount`. |
| `tecINSUFFICIENT_FUNDS` | The issuance's `ConfidentialOutstandingAmount` or total `OutstandingAmount` is less than the requested `MPTAmount`. |
| `tecNO_PERMISSION`      | The transaction lacks the required permissions. Common causes include:<br>- The issuance does not have the **Can Clawback** or **Can Hold Confidential Balance** flag enabled.<br>- The issuance is missing the `IssuerEncryptionKey` field.<br>- The holder's `MPToken` is missing the `IssuerEncryptedBalance` or `HolderEncryptionKey` field, meaning the holder never opted in to confidential transfers. |
| `tecNO_TARGET`          | The `Holder` account does not exist. |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance` or the holder's `MPToken` does not exist. |
| `temBAD_AMOUNT`         | The `MPTAmount` is zero or exceeds the maximum allowable MPT amount. |
| `temDISABLED`           | The `ConfidentialTransfer` amendment is not enabled. |
| `temMALFORMED`          | The transaction is malformed. Common causes include:<br>- The `Account` is not the issuer of the `MPTokenIssuanceID`.<br>- The `Account` and the `Holder` are the same.<br>- The `ZKProof` length is not 64 bytes. |

## See Also

- [MPToken entry][]
- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

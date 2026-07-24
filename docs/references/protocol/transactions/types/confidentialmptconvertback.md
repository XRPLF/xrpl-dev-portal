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
  "Account": "rEw98xHU9KvZwKUZpXF9pWAum98dzbMb5N",
  "MPTokenIssuanceID": "003CE562586390F0CB47C7EB3A42740AEFDC9A1E0B5CA1AC",
  "MPTAmount": "3000",
  "HolderEncryptedAmount": "03838E58829AFA0778AAF1C3A4452F26ACB7090D71856D99A744BA5E2F184379890333409E592066D1B869876B1C551664CA588DAB3F73598A481E1DC507D7F80E59",
  "IssuerEncryptedAmount": "03838E58829AFA0778AAF1C3A4452F26ACB7090D71856D99A744BA5E2F1843798903762CDD3C8261D9362DE29B7BFB1399A7BB85607C42513D45110234012E074CFD",
  "BlindingFactor": "6FE59620FCA03CE87F921AE5885DA2ECC570AEA139F10733ACA4C865847EAF3C",
  "ZKProof": "F07DC879D4A0F13613A4C0BD28EF7571F5B88B2BDD1ED37B862F2087386661EC1072268927066290745F0BE3638AD38235948F20A9AA8913637650086576D960F5563565847E27F2ABD4258CCD4ED23D0D8B79757CBF6F049EEF660B073695AC1DFC14BEB3CB0B7E44B326199FBFDF45614FCBA8B774430AC6A7B680DBF16774033F18126DAF1B0DE9C4940510155A11EE6B8105223CE739BE8281926AB47FBF6E033F796FAE4B4159AAA57BEDE7F11F77A5297199C957FC92CBF81562476167AC0503711277291F939EBE13403AF4BDCD9F7F48925A6E455A7902E8AB2774A88FFF1C03B42E97AF26D13F3B07B6C7CC527E21A125BFDFA38D1E6660D0D0272E4280DAE90396B83D6A0D9FBF49D77495657961C342532EE9BD2A4D618376DD2A7D7D470C83037646688CE4A29A13E16EEDDC221D8180EE2191E88679CB56A4DCB396974BBBEE02DC9D2AFC7440B847E40E05DFB6FA16A51A560647CCEE5817BD86365A16D2356A028E3FD1A7A75A629964BEE5F66436F2A29A8BBD9386D327A32A2167297B26D83703BF343BB5AD9C760642CDE34C4AA981A6318333813C9BCED84F72D954151BBB6E03E35A5413D3DD4073458F0BAE7CF780BEF0E156AEC8FBE823357C44454E9EC5AA0378DE4758868925D6140E730F14C0519A9525B1C8F550EE6DE8C993AF0B5C781D034F66FC57384EB9DCDE4ADBD724E4B870E39034C4911BD5B970FA1B4E0C9FEFAD03AFBC5771914B2D172F6FAA694D63030506A9733FB162791316D9E605EFAC8AF902370ED58A99C7DDF6B731C0F61C8DFA35DD85E9F610876C79404EE086E49475A203AAE2DF7DF0C302953A718E0B8A7CC285ED76C97C40D95FCFA6EF886694DBBD7E030796C16087DA96F867F8D1FE0DD461B153FE9B8A2E6AA7D81980E7115D23A2BBCAEF73E4408A49D852C0E6CBD88AA5F4B2654CC34B310E571A257E8D459E926C3DF3A3FD5F8E1CE64F24AA8B83314F16D5DD10120DA7153DB746A15AC8E15793ABB4CD285B43CFF728C966BE1A2BDEDD8CAA5B4210D5E8A24C3E6CEB4105DE297FEDAEC3B8A9D25F0ADA0757D45D9C55319402B5CFCB0AB94060952BCE7F14E3D8F673B59594CD568F58B681853C4C00A55B4F946E0E3B85406DE78CE52DD7B6",
  "BalanceCommitment": "021AE9AACEA7CD9F58F735A6DBD671BF7824EF1E7A99731EBDE88502638F9D737F",
  "Fee": "10",
  "Sequence": 3990889
}
```

{% tx-example txid="A3392C62D6CF629F32DA9F493F68FB4DE31152AD03AF489908867132B0CF5789" server="devnet" /%}

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field                     | JSON Type | [Internal Type][] | Required? | Description |
|:------------------------- |:--------- |:----------------- |:--------- |:------------|
| `AuditorEncryptedAmount`  | String    | Blob              | No        | A 66-byte Ciphertext for the auditor. Required if `AuditorEncryptionKey` is present on the issuance. |
| `BalanceCommitment`       | String    | Blob              | Yes       | A 33-byte cryptographic commitment to the user's confidential spending balance. |
| `BlindingFactor`          | String    | UInt256           | Yes       | The 32-byte scalar value used to encrypt the amount. Used by validators to verify the ciphertexts match the plaintext `MPTAmount`. |
| `HolderEncryptedAmount`   | String    | Blob              | Yes       | A 66-byte Ciphertext to be subtracted from the holder's `ConfidentialBalanceSpending`. |
| `IssuerEncryptedAmount`   | String    | Blob              | Yes       | A 66-byte Ciphertext to be subtracted from the issuer's mirror balance. |
| `MPTAmount`               | String    | UInt64            | Yes       | The plaintext amount to credit to the public balance. |
| `MPTokenIssuanceID`       | String    | UInt192           | Yes       | The unique identifier for the MPT issuance. |
| `ZKProof`                 | String    | Blob              | Yes       | An 816-byte proof bundle containing a compact ConvertBack sigma proof and a single Bulletproof range proof. See [Proof Structure](#proof-structure) for details. |

## Proof Structure

The `ZKProof` field contains an 816-byte bundle made up of two parts:

- A **compact ConvertBack sigma proof (128 bytes)** that verifies the holder owns the spending balance and that the `BalanceCommitment` is correctly derived from it.

- A **single Bulletproof range proof (688 bytes)** that verifies that the remaining balance after withdrawal is non-negative.

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code              | Description |
|:----------------------- |:----------- |
| `tecBAD_PROOF`          | The Zero-Knowledge Proof verification failed. Common causes include:<br>- The `BlindingFactor` fails to verify the integrity of the ciphertexts.<br>- The provided `ZKProof` fails the compact sigma or range proof check.<br>- The account's confidential spending balance is less than the requested `MPTAmount`, so the range proof of the remaining balance fails. |
| `tecINSUFFICIENT_FUNDS` | The issuance's `ConfidentialOutstandingAmount` is less than the requested `MPTAmount`. |
| `tecLOCKED`             | The MPT is locked for the account, or the issuance is globally locked. |
| `tecNO_AUTH`            | The issuance requires authorization and the account's `MPToken` is not authorized. |
| `tecNO_PERMISSION`      | The transaction lacks the required permissions. Common causes include:<br>- The issuance does not have the **Can Hold Confidential Balance** flag enabled.<br>- The account's `MPToken` is missing the `ConfidentialBalanceSpending` or `HolderEncryptionKey` field.<br>- The issuance has `AuditorEncryptionKey` set but the transaction omits `AuditorEncryptedAmount` (or the reverse). |
| `tecOBJECT_NOT_FOUND`   | The `MPTokenIssuance` or the account's `MPToken` does not exist. |
| `temBAD_AMOUNT`         | The `MPTAmount` is zero or exceeds the maximum allowable MPT amount. |
| `temBAD_CIPHERTEXT`     | One or more encrypted amount fields (`HolderEncryptedAmount`, `IssuerEncryptedAmount`, or `AuditorEncryptedAmount`) has an incorrect length or represents an invalid elliptic curve point. |
| `temDISABLED`           | The `ConfidentialTransfer` amendment is not enabled. |
| `temMALFORMED`          | The transaction is malformed. Common causes include:<br>- The `Account` is the issuer of the `MPTokenIssuanceID`.<br>- `BalanceCommitment` is not a valid 33-byte compressed elliptic curve point.<br>- The `ZKProof` length is not 816 bytes. |

## See Also

- [MPToken entry][]
- [MPTokenIssuance entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

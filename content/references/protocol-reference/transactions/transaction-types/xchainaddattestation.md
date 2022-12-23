---
html: xchainaddattestation.html 
parent: transaction-types.html
blurb: Submit a proof (attestation) to the destination chain that an event that happened on the source chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAddAttestation

The `XChainAddAddestation` transaction is submitted on the destination chain, by the witness server or anyone with access to the signatures from the witness server. It is a proof that an event (essentially just a locking/burning of funds) happened on the source chain.

When enough witnesses have submitted their proofs on the destination chain that an event has occurred, the funds will be released to the destination account in the XChainCommit transaction, if specified. Otherwise, the claim ID owner must submit an XChainClaim transaction to determine where the funds will go on the destination chain.

## Example {{currentpage.name}} JSON


```json
{
  "TransactionType": "XChainAddAttestation",
  "Account": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "XChainAttestationBatch": {
    "XChainBridge": {
      "IssuingChainDoor": "rKeSSvHvaMZJp9ykaxutVwkhZgWuWMLnQt",
      "IssuingChainIssue": "XRP",
      "LockingChainDoor": "rJvExveLEL4jNDEeLKCVdxaSCN9cEBnEQC",
      "LockingChainIssue": "XRP"
    },
    "XChainClaimAttestationBatch" : [
      {
        "XChainClaimAttestationBatchElement" : {
          "Account" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount" : "100000000",
          "AttestationSignerAccount" : "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Destination" : "r9A8UyNpW3X46FUc6P7JZqgn6WgAPjBwPg",
          "PublicKey" : "03DAB289CA36FF377F3F4304C7A7203FDE5EDCBFC209F430F6A4355361425526D0",
          "Signature" : "616263",
          "WasLockingChainSend" : 1,
          "XChainClaimID" : "0000000000000000"
        }
      }
    ],
    "XChainCreateAccountAttestationBatch": [
      {
        "XChainCreateAccountAttestationBatchElement": {
          "Account": "rnJmYAiqEVngtnb5ckRroXLtCbWC7CRUBx",
          "Amount": "1000000000",
          "AttestationSignerAccount": "rEziJZmeZzsJvGVUmpUTey7qxQLKYxaK9f",
          "Destination": "rKT9gDkaedAosiHyHZTjyZs2HvXpzuiGmC",
          "PublicKey": "03ADB44CA8E56F78A0096825E5667C450ABD5C24C34E027BC1AAF7E5BD114CB5B5",
          "Signature": "3044022036C8B90F85E8073C465F00625248A72D4714600F98EBBADBAD3B7ED226109A3A02204C5A0AE12D169CF790F66541F3DB59C289E0D9CA7511FDFE352BB601F667A26",
          "SignatureReward": "1000000",
          "WasLockingChainSend": 1,
          "XChainAccountCreateCount": "0000000000000001"
        }
      }
    ]
  }
}
```

{% include '_snippets/tx-fields-intro.md' %}

| Field         | JSON Type           | [Internal Type][] | Description        |
|:--------------|:--------------------|:------------------|:-------------------|
| `Account` | String | AccountID | _Required_ The account submitting the proof. |
| `XChainBridge`| String | Object | _Required_ The bridge that the transaction is transferred across. |
| `XChainClaimAttestationBatchElement` | String | Object | A single proof that a `XChainCommit` transaction occurred on the source chain. These can be batched. |
| `XChainCreateAccountAttestationBatchElement` | String | Object | A single proof that a `XChainCreateAccountCommit` transaction occurred on the source chain. These can be batched. |


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

---
seo:
    description: Deliver escrowed funds to the intended recipient.
labels:
    - Escrow
---
# EscrowFinish
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Escrow.cpp "Source")

Deliver funds from an [escrow](../../../../concepts/payment-types/escrow.md) to the recipient.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowFinish",
    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "OfferSequence": 7,
    "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
    "Fulfillment": "A0028000"
}
```

{% tx-example txid="317081AF188CDD4DBE55C418F41A90EC3B959CDB3B76105E0CBE6B7A0F56C5F7" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field           | JSON Type            | [Internal Type][] | Required? | Description |
|:----------------|:---------------------|:------------------|:----------|:------------|
| `Owner`         | String - [Address][] | AccountID         | Yes       | The source account that funded the escrow. |
| `OfferSequence` | Number               | UInt32            | Yes       | Transaction sequence of [EscrowCreate transaction][] that created the escrow to finish. |
| `Condition`     | String - Hexadecimal | Blob              | No        | The (previously-supplied) [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1) of the escrow. |
| `CredentialIDs` | Array of Strings     | Vector256         | No        | Set of Credentials to authorize a deposit made by this transaction. Each member of the array must be the ledger entry ID of a Credential entry in the ledger. For details, see [Credential IDs](./payment.md#credential-ids). |
| `Fulfillment`   | String - Hexadecmial | Blob              | No        | The [PREIMAGE-SHA-256 crypto-condition fulfillment](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1.4) matching the escrow's `Condition`. |

Any account may submit an EscrowFinish transaction.

- If the escrow has a `FinishAfter` time, you cannot execute it before this time. Specifically, if the corresponding [EscrowCreate transaction][] specified a `FinishAfter` time that is after the close time of the most recently-closed ledger, the EscrowFinish transaction fails.
- If the escrow has a `Condition`, you cannot execute it unless you provide a matching `Fulfillment` for the condition.
- You cannot execute an escrow after it has expired. Specifically, if the corresponding [EscrowCreate transaction][] specified a `CancelAfter` time that is before the close time of the most recently-closed ledger, the EscrowFinish transaction fails.

{% admonition type="info" name="Note" %}The minimum [transaction cost](../../../../concepts/transactions/transaction-cost.md) to submit an EscrowFinish transaction increases if it contains a fulfillment. If the transaction has no fulfillment, the transaction cost is the standard ledger base fee, typically 10 drops. If the transaction contains a fulfillment, the transaction cost is 330 [drops of XRP][] plus another 10 drops for every 16 bytes in size of the preimage. Should the validators vote to increase or lower the base fee, the cost per 16 bytes is adjusted accordingly.{% /admonition %}

In [non-production networks](../../../../concepts/networks-and-servers/parallel-networks.md), it may be possible [to delete](../../../../concepts/accounts/deleting-accounts.md) the destination account of a pending escrow. In this case, an attempt to finish the escrow fails with the result `tecNO_TARGET`, but the escrow object remains unless it has expired normally. If another payment re-creates the destination account, the escrow can be finished successfully. The destination account of an escrow can only be deleted if the escrow was created before the [fix1523 amendment](/resources/known-amendments.md#fix1523) became enabled. No such escrows exist in the production XRP Ledger, so this edge case is not possible on the production XRP Ledger. This edge case is also not possible in test networks that enable both fix1523 and Escrow amendments at the same time, which is the default when you [start a new genesis ledger](../../../../infrastructure/testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md).

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code                | Description |
|:------------------------- |:------------|
| `tecNO_AUTH`              | The transaction failed because authorization requirements were not met. For example, the issuer requires authorization and the destination is not authorized. |
| `tecNO_LINE`              | The destination account does not have a trust line with the issuer. For Trust Line Tokens only. |
| `tecNO_ENTRY`             | The destination account does not hold the MPT. |
| `tecINSUFFICIENT_RESERVE` | Unable to create a trust line or MPToken due to lack of reserves. |
| `tecFROZEN` | The token is deep frozen (Trust Line Tokens) or locked (for MPTs). |

## See Also

- [Escrow entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

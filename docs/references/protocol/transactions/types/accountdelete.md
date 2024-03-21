---
html: accountdelete.html
parent: transaction-types.html
seo:
    description: Delete an account.
labels:
  - Accounts
---
# AccountDelete

[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/DeleteAccount.cpp "Source")

_Added by the [DeletableAccounts amendment](/resources/known-amendments.md#deletableaccounts)_

An AccountDelete transaction deletes an [account](../../ledger-data/ledger-entry-types/accountroot.md) and any objects it owns in the XRP Ledger, if possible, sending the account's remaining XRP to a specified destination account. See [Deleting Accounts](../../../../concepts/accounts/deleting-accounts.md) for the requirements to delete an account.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "AccountDelete",
    "Account": "rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm",
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "DestinationTag": 13,
    "Fee": "2000000",
    "Sequence": 2470665,
    "Flags": 2147483648
}
```

[Query example transaction. >](/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_AccountDelete%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%221AF19BF9717DA0B05A3BFC5007873E7743BA54C0311CCCCC60776AAEAC5C4635%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| `Destination`    |  String - [Address][] | AccountID    | The address of an account to receive any leftover XRP after deleting the sending account. Must be a funded account in the ledger, and must not be the sending account. |
| `DestinationTag` | Number           | UInt32            | _(Optional)_ Arbitrary [destination tag](../../../../concepts/transactions/source-and-destination-tags.md) that identifies a hosted recipient or other information for the recipient of the deleted account's leftover XRP. |

## Special Transaction Cost

As an additional deterrent against ledger spam, the AccountDelete transaction requires a much higher than usual [transaction cost](../../../../concepts/transactions/transaction-cost.md): instead of the standard minimum of 0.00001 XRP, AccountDelete must destroy at least the owner reserve amount, currently 2 XRP. This discourages excessive creation of new accounts because the [reserve requirement](../../../../concepts/accounts/reserves.md) cannot be fully recouped by deleting the account.

The transaction cost always applies when a transaction is included in a validated ledger, even if the transaction fails to delete the account. (See [Error Cases](#error-cases).) To greatly reduce the chances of paying the high transaction cost if the account cannot be deleted, [submit the transaction](../../../http-websocket-apis/public-api-methods/transaction-methods/submit.md) with `fail_hard` enabled.


## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](../transaction-results/index.md):

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | Occurs if the [DeletableAccounts amendment](/resources/known-amendments.md#deletableaccounts) is not enabled. |
| `temDST_IS_SRC` | Occurs if the `Destination` matches the sender of the transaction (`Account` field). |
| `tecDST_TAG_NEEDED` | Occurs if the `Destination` account requires a [destination tag](../../../../concepts/transactions/source-and-destination-tags.md), but the `DestinationTag` field was not provided. |
| `tecNO_DST` | Occurs if the `Destination` account is not a funded account in the ledger. |
| `tecNO_PERMISSION` | Occurs if the `Destination` account requires [deposit authorization](../../../../concepts/accounts/depositauth.md) and the sender is not preauthorized. |
| `tecTOO_SOON` | Occurs if the sender's `Sequence` number is too high. The transaction's `Sequence` number plus 256 must be less than the current [Ledger Index][]. This prevents replay of old transactions if this account is resurrected after it is deleted. |
| `tecHAS_OBLIGATIONS` | Occurs if the account to be deleted is connected to objects that cannot be deleted in the ledger. (This includes objects created by other accounts, such as [escrows](../../../../concepts/payment-types/escrow.md) and for example [NFT's minted](nftokenmint.md), [even if owned by another account](https://github.com/XRPLF/rippled/blob/develop/src/ripple/app/tx/impl/DeleteAccount.cpp#L197).) |
| `tefTOO_BIG` | Occurs if the sending account is linked to more than 1000 objects in the ledger. The transaction could succeed on retry if some of those objects were deleted separately first. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}

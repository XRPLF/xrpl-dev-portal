# AccountDelete

[[Source]](https://github.com/ripple/rippled/blob/develop/src/ripple/app/tx/impl/DeleteAccount.cpp "Source")

_Added by the [DeletableAccounts amendment](known-amendments.html#deletableaccounts)_

An AccountDelete transaction deletes an [account](accountroot.html) and any objects it owns in the XRP Ledger, if possible, sending the account's remaining XRP to a specified destination account. See [Deletion of Accounts](accounts.html#deletion-of-accounts) for the requirements to delete an account.

## Example {{currentpage.name}} JSON

```json
{
    "TransactionType": "AccountDelete",
    "Account": "rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm",
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    "DestinationTag": 13,
    "Fee": "5000000",
    "Sequence": 2470665,
    "Flags": 2147483648
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| `Destination`    |  String - [Address][] | AccountID    | The address of an account to receive any leftover XRP after deleting the sending account. Must be a funded account in the ledger, and must not be the sending account. |
| `DestinationTag` | Number           | UInt32            | _(Optional)_ Arbitrary [destination tag](source-and-destination-tags.html) that identifies a hosted recipient or other information for the recipient of the deleted account's leftover XRP. |

## Special Transaction Cost

As an additional deterrent against ledger spam, the AccountDelete transaction requires a much higher than usual [transaction cost](transaction-cost.html): instead of the standard minimum of 0.00001 XRP, AccountDelete must destroy at least the owner reserve amount, currently 5 XRP. This discourages excessive creation of new accounts because the [reserve requirement](reserves.html) cannot be fully recouped by deleting the account.

The transaction cost always applies when a transaction is included in a validated ledger, even if the transaction fails to delete the account. (See [Error Cases](#error-cases).) To greatly reduce the chances of paying the high transaction cost if the account cannot be deleted, [submit the transaction](submit.html) with `fail_hard` enabled.


## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | Occurs if the [DeletableAccounts amendment](known-amendments.html#deletableaccounts) is not enabled. |
| `temDST_IS_SRC` | Occurs if the `Destination` matches the sender of the transaction (`Account` field). |
| `tecDST_TAG_NEEDED` | Occurs if the `Destination` account requires a [destination tag](source-and-destination-tags.html), but the `DestinationTag` field was not provided. |
| `tecNO_DST` | Occurs if the `Destination` account is not a funded account in the ledger. |
| `tecNO_PERMISSION` | Occurs if the `Destination` account requires [deposit authorization](depositauth.html) and the sender is not preauthorized. |
| `tecTOO_SOON` | Occurs if the sender's `Sequence` number is too high. The transaction's `Sequence` number plus 256 must be less than the current [Ledger Index][]. |
| `tecHAS_OBLIGATIONS` | Occurs if the account to be deleted is connected to objects that cannot be deleted in the ledger. (This includes objects created by other accounts, such as [escrows](escrow.html).) |
| `tefTOO_BIG` | Occurs if the sending account is linked to more than 1000 objects in the ledger. The transaction could succeed on retry if some of those objects were deleted separately first. |


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

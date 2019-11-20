# AccountDelete

[[Source]](https://github.com/ripple/rippled/blob/develop/src/ripple/app/tx/impl/DeleteAccount.cpp "Source")

_Requires the [DeletableAccounts amendment](known-amendments.html#deletableaccounts) :not_enabled:_

An AccountDelete transaction deletes an [account from the XRP Ledger](accountroot.html) if possible, sending its XRP to a specified destination account. See [Deletion of Accounts](accounts.html#deletion-of-accounts) for the requirements to delete an account.

## Example {{currentpage.name}} JSON

```json
{
    "TransactionType": "AccountDelete",
    "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    ... TODO
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field            | JSON Type        | [Internal Type][] | Description        |
|:-----------------|:-----------------|:------------------|:-------------------|
| `Destination`    |  String - [Address][] | Account      | The address of an account to receive any leftover XRP after deleting the sending account. Must be a funded account in the ledger, and must not be the sending account. |
| `DestinationTag` | Number           | UInt32            | _(Optional)_ Arbitrary [destination tag](source-and-destination-tags.html) that identifies the a hosted recipient or other information to the recipient of the deleted account's leftover XRP. |

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

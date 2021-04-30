---
html: signerlistset.html
parent: transaction-types.html
blurb: Add, remove, or modify an account's multi-signing list.
---
# SignerListSet
[[Source]](https://github.com/ripple/rippled/blob/ef511282709a6a0721b504c6b7703f9de3eecf38/src/ripple/app/tx/impl/SetSignerList.cpp "Source")

The SignerListSet transaction creates, replaces, or removes a list of signers that can be used to [multi-sign](multi-signing.html) a transaction. This transaction type was introduced by the [MultiSign amendment][]. [New in: rippled 0.31.0][]

## Example {{currentpage.name}} JSON

```json
{
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "SignerQuorum": 3,
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "SignerWeight": 2
            }
        },
        {
            "SignerEntry": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "SignerWeight": 1
            }
        },
        {
            "SignerEntry": {
                "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
                "SignerWeight": 1
            }
        }
    ]
}
```

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field         | JSON Type | [Internal Type][] | Description                  |
|:--------------|:----------|:------------------|:-----------------------------|
| `SignerQuorum`  | Number    | UInt32            | A target number for the signer weights. A multi-signature from this list is valid only if the sum weights of the signatures provided is greater than or equal to this value. To delete a signer list, use the value `0`. |
| `SignerEntries` | Array     | Array             | (Omitted when deleting) Array of [`SignerEntry` objects](signerlist.html#signer-entry-object), indicating the addresses and weights of signers in this list. This signer list must have at least 1 member and no more than 8 members. No address may appear more than once in the list, nor may the `Account` submitting the transaction appear in the list. |

A successful SignerListSet transaction replaces the account's [`SignerList` object](signerlist.html) in the ledger, or adds one if it did not exist before. An account may not have more than one signer list. To delete a signer list, you must set `SignerQuorum` to `0` _and_ omit the `SignerEntries` field. Otherwise, the transaction fails with the error [`temMALFORMED`](tem-codes.html). A transaction to delete a signer list is considered successful even if there was no signer list to delete.

You cannot create a signer list such that the `SignerQuorum` could never be met. The `SignerQuorum` must be greater than 0 but less than or equal to the sum of the `SignerWeight` values in the list. Otherwise, the transaction fails with the error [`temMALFORMED`](tem-codes.html).

You can create, update, or remove a signer list using the master key, regular key, or the current signer list, if those methods of signing transactions are available.

You cannot remove the last method of signing transactions from an account. If an account's master key is disabled (the account has the [`lsfDisableMaster` flag](accountroot.html#accountroot-flags) enabled) and the account does not have a [Regular Key](cryptographic-keys.html) configured, then you cannot delete the signer list from the account. Instead, the transaction fails with the error [`tecNO_ALTERNATIVE_KEY`](tec-codes.html).

With the [MultiSignReserve amendment][] enabled, creating or replacing a signer list enables the `lsfOneOwnerCount` flag on the [SignerList object](signerlist.html). When this flag is enabled, the XRP Ledger is able to lower the [`OwnerCount`](accountroot.html#accountroot-fields) and [owner reserve](reserves.html#owner-reserves) for the signer list. For more information, see [SignerList Flags](signerlist.html#signerlist-flags).

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

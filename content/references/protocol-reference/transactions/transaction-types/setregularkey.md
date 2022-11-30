---
html: setregularkey.html
parent: transaction-types.html
blurb: Add, remove, or modify an account's regular key pair.
labels:
  - Security
---
# SetRegularKey

[[Source]](https://github.com/ripple/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

A `SetRegularKey` transaction assigns, changes, or removes the regular key pair associated with an account.

You can protect your account by assigning a regular key pair to it and using it instead of the master key pair to sign transactions whenever possible. If your regular key pair is compromised, but your master key pair is not, you can use a `SetRegularKey` transaction to regain control of your account.

## Example {{currentpage.name}} JSON

```json
{
    "Flags": 0,
    "TransactionType": "SetRegularKey",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "RegularKey": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

[Query example transaction. >](websocket-api-tool.html?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_SetRegularKey%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%226AA6F6EAAAB56E65F7F738A9A2A8A7525439D65BA990E9BA08F6F4B1C2D349B4%22%2C%22binary%22%3Afalse%7D)

{% include '_snippets/tx-fields-intro.md' %}
<!--{# fix md highlighting_ #}-->

| Field        | JSON Type | [Internal Type][] | Description                   |
|:-------------|:----------|:------------------|:------------------------------|
| `RegularKey` | String    | AccountID         | _(Optional)_ A base-58-encoded [Address][] that indicates the regular key pair to be assigned to the account. If omitted, removes any existing regular key pair from the account. Must not match the master key pair for the address. |

## See Also

For more information about regular and master key pairs, see [Cryptographic Keys](cryptographic-keys.html).

For a tutorial on assigning a regular key pair to an account, see [Working with a Regular Key Pair](assign-a-regular-key-pair.html).

For even greater security, you can use [multi-signing](multi-signing.html), but multi-signing requires additional XRP for the [transaction cost][] and [reserve](reserves.html).

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

## SetRegularKey

[[Source]<br>](https://github.com/ripple/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

A `SetRegularKey` transaction assigns, changes, or removes the regular key associated with an account.

You can protect your account by assigning a regular key to it and using it instead of the master key to sign transactions whenever possible. If your regular key is compromised, but your master key is not, you can use a `SetRegularKey` transaction to regain control of your account.

For more information about regular and master keys, see [Understanding Master and Regular Keys](concept-keys.html).

For a tutorial on assigning a regular key to an account, see [Working with Regular Keys](tutorial-regular-keys.html).

For even greater security, you can use [multi-signing](#multi-signing), but multi-signing requires additional XRP for the [transaction cost](concept-transaction-cost.html) and [reserve](concept-reserves.html).

```
{
    "Flags": 0,
    "TransactionType": "SetRegularKey",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "RegularKey": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

| Field        | JSON Type | [Internal Type][] | Description                   |
|:-------------|:----------|:------------------|:------------------------------|
| `RegularKey` | String    | AccountID         | _(Optional)_ A base-58-encoded [Ripple address](reference-rippled.html#addresses) to use as the regular key. If omitted, removes the existing regular key. |

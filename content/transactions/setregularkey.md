## SetRegularKey

[[Source]<br>](https://github.com/ripple/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

A `SetRegularKey` transaction assigns, changes, or removes the regular key pair associated with an account.

You can protect your account by assigning a regular key pair to it and using it instead of the master key pair to sign transactions whenever possible. If your regular key pair is compromised, but your master key pair is not, you can use a `SetRegularKey` transaction to regain control of your account.

For more information about regular and master key pairs, see [Cryptographic Keys](concept-cryptographic-keys.html).

For a tutorial on assigning a regular key pair to an account, see [Working with a Regular Key Pair](working-regular-key-pair.html).

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
| `RegularKey` | String    | AccountID         | _(Optional)_ A base-58-encoded [Ripple address](reference-rippled.html#addresses) that indicates the regular key pair to be assigned to the account. If omitted, removes any existing regular key pair from the account. |

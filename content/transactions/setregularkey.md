## SetRegularKey

[[Source]<br>](https://github.com/ripple/rippled/blob/4239880acb5e559446d2067f00dabb31cf102a23/src/ripple/app/transactors/SetRegularKey.cpp "Source")

A SetRegularKey transaction changes the regular key associated with an address.

```
{
    "Flags": 0,
    "TransactionType": "SetRegularKey",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "RegularKey": "rAR8rR8sUkBoCZFawhkWzY4Y5YoyuznwD"
}
```

| Field      | JSON Type | [Internal Type][] | Description                     |
|:-----------|:----------|:------------------|:--------------------------------|
| RegularKey | String    | AccountID         | _(Optional)_ A base-58-encoded [Ripple address](reference-rippled.html#addresses) to use as the regular key. If omitted, removes the existing regular key. |

In addition to the master key, which is mathematically-related to an address, you can associate **at most 1 additional key pair** with an address using this type of transaction. The additional key pair is called a _regular key_. If your address has a regular key pair defined, you can use the secret key of the regular key pair to [authorize transactions](#authorizing-transactions).

A regular key pair is generated in the same way as any other Ripple keys (for example, with [wallet_propose](reference-rippled.html#wallet-propose)), but it can be changed. A master key pair is an intrinsic part of an address's identity (the address is derived from the master public key). You can [disable](#accountset-flags) a master key but you cannot change it.

You can protect your master secret by using a regular key instead of the master key to sign transactions whenever possible. If your regular key is compromised, but the master key is not, you can use a SetRegularKey transaction to regain control of your address. In some cases, you can even send a [key reset transaction](concept-transaction-cost.html#key-reset-transaction) without paying the [transaction cost](#transaction-cost).

For even greater security, you can use [multi-signing](#multi-signing), but multi-signing requires additional XRP for the [transaction cost](concept-transaction-cost.html) and [reserve](concept-reserves.html).

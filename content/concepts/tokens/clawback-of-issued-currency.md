---
html: clawback-of-issued-currency.html
parent: tokens.html
blurb: Issuers can claw back their issued tokens for compliance purposes.
labels:
  - Tokens
status: not_enabled
---
# Clawback

For regulatory purposes, some issuers must have the ability to recover issued tokens after they are distributed to accounts. For example, if an issuer were to discover that tokens were sent to an account sanctioned for illegal activity, the issuer could recover, or _claw back_ the funds.

Issuers can create tokens that they can claw back by adding the `lsfAllowTrustLineClawback` flag to the issuing account.

**Note:** You can only claw back issued tokens created by your account. You cannot claw back XRP in this way.

Clawback is disabled by default. To use clawback, you must set the `lsfAllowTrustLineClawback` flag through an `AccountSet` transaction. The `AccountSet` transaction only succeeds if the account has an empty owner directory, meaning that the account has no trustlines, offers, escrows, payment channels, or checks. After you set this flag, it cannot reverted. The account permanently gains the ability to claw back issued assets on trustlines.

If you attempt to set `lsfAllowTrustLineClawback` while `lsfNoFreeze` is set, the transaction returns `tecNO_PERMISSION`, because clawback cannot be enabled on an account that has already disclaimed the ability to freeze trustlines. 
Conversely, if you try to set `lsfNoFreeze` while `lsfAllowTrustLineClawback` is set, the transaction also returns `tecNO_PERMISSION`.

## Example Clawback Transaction

```json
{
  "TransactionType": "Clawback",
  "Account": "rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S",
  "Amount": {
      "currency": "FOO",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "314.159"
    }
}
```

In execution, this transaction would claw back at most 314.159 FOO issued by rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S and held by rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW. If rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW does not have a trustline set up or that trustline's balance is 0, then the error `tecNO_LINE` is returned and a fee is consumed.
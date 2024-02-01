---
html: clawing-back-tokens.html
parent: trust-lines-and-issuing.html
seo:
    description: Issuers can claw back their tokens for compliance purposes if they enable the Clawback feature before issuing tokens.
labels:
  - Tokens
---
# Clawing Back Tokens

{% partial file="/docs/_snippets/clawback-disclaimer.md" /%}

For regulatory purposes, some issuers need the ability to recover tokens after they are distributed to accounts. For example, if an issuer were to discover that tokens were sent to an account sanctioned for illegal activity, the issuer could recover, or *claw back*, the funds.

Issuers can gain the ability to claw back their tokens by enabling the **Allow Clawback** flag on their issuing account. This flag cannot be enabled if the issuer has already issued tokens.

**Note:** You can only claw back issued tokens created by your account. You cannot claw back XRP in this way.

Clawback is disabled by default. To use clawback, you must send an [AccountSet transaction][] to enable the **Allow Trust Line Clawback** setting. **An issuer with any existing tokens cannot enable Clawback.** You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists.

If you attempt to set `lsfAllowTrustLineClawback` while `lsfNoFreeze` is set, the transaction returns `tecNO_PERMISSION`, because clawback cannot be enabled on an account that has already disclaimed the ability to freeze trust lines.
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

If successful, this transaction would claw back at most 314.159 FOO issued by rp6abvbTbjoce8ZDJkT6snvxTZSYMBCC9S and held by rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

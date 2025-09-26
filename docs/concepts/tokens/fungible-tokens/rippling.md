---
seo:
    description: Rippling is automatic multi-party net settlement of token balances.
labels:
  - Tokens
  - Cross-Currency
---
# Rippling

Rippling is the _indirect movement_ of funds that occurs for any payment of [trust line tokens](./trust-line-tokens.md) (except when an issuing account exchanges tokens directly with another account). This includes when one holder sends tokens to another holder of the same token.

Rippling can automatically exchange tokens that have the same currency code, even if they have different issuers. This helps to facilitate longer and more complex payments between accounts.

[MPTs](./multi-purpose-tokens.md) intentionally do not support rippling.

## Example of Rippling

Issuers distribute currency to holders over trust lines. When a holder creates a trust line to an issuer for a specific token, they are willing to accept payments of that token. For example, in the chart below, Holder A and Holder B both have trust lines to the Issuer of the token USD.

[![Issuer with trust lines to two holders.](/docs/img/cpt-rippling1.png "Issuer with trust lines to two holders.")](/docs/img/cpt-rippling1.png)

The Issuer transfers 50 USD to Holder A, and 10 USD to Holder B. For these trust lines, the Issuer has a net balance of -60 USD.

[![Issuer sends tokens to holders.](/docs/img/cpt-rippling2.png "Issuer sends tokens to holders.")](/docs/img/cpt-rippling2.png)

Since both accounts are willing to accept payments in USD tokens, Holder A can send a payment of 20 USD to Holder B. This appears to be a single transaction, but it actually involves two steps. Holder A sees their balance go down by 20 USD, Holder B sees their balance go up by 20 USD. Behind the scenes, though, Holder A’s side of the trust line to the Issuer is reduced by 20 USD. The Issuer’s side of the trust line is increased by 20 USD, bringing its net balance to -40 USD.

[![Holder A sends currency through the Issuer.](/docs/img/cpt-rippling3.png "Holder A sends currency through the Issuer.")](/docs/img/cpt-rippling3.png)

Then the Issuer side of the trust line to Holder B is reduced by 20 USD, and the account of Holder B is increased by 20 USD.

[![Holder B receives tokens through the Issuer.](/docs/img/cpt-rippling4.png "Holder B receives tokens  through the Issuer.")](/docs/img/cpt-rippling4.png)

The tokens are transferred through the Issuer, but ultimately the Issuer’s balance doesn’t change. This flow of tokens is known as _rippling_. Issuing accounts must allow rippling so that their holders can transfer tokens to one another. 

Rippling can involve several accounts as the XRP Ledger finds a path to transfer the tokens. For example, the tokens might flow between two issuer accounts that have a trust line between them.

[![Holder A transfers tokens through Issuers A and B to get to Holder B.](/docs/img/cpt-rippling5.png "Holder A transfers tokens through Issuers A and B to get to Holder B.")](/docs/img/cpt-rippling5.png)

Tokens might also flow through intermediary exchanger accounts to reach a holder.

[![Holder A transfers tokens through Issuers A and B and Exchanger X to get to Holder B.](/docs/img/cpt-rippling6.png "Holder A transfers tokens through Issuers A and B and Exchanger X to get to Holder B.")](/docs/img/cpt-rippling6.png)

Other accounts, such as liquidity providers and normal holders, should not allow rippling. Rippling can lead to exploits where balances shift unexpectedly, tokens are allocated at higher rates, and the holder ends up losing value on a transaction where they played no part.

# The Default Ripple Flag

The Default Ripple flag is an account level setting that enables rippling for all incoming trust lines. The default setting of the Default Ripple flag is false. Issuers must enable this flag for their customers to be able to send tokens to one another.

The Default Ripple setting doesn’t affect trust lines that you create, only trust lines that others open to your account. If you change the setting, trust lines that were created before the change keep their existing No Ripple settings. You can use a [TrustSet transaction][] to change the No Ripple setting of a trust line to match your account’s new default.

# The No Ripple Flag

Accounts that do not want to allow rippling can enable the No Ripple flag. If you enable the No Ripple flag on two of your trust lines, other accounts cannot use that pair of trust lines to ripple payments through your account. However, if you have any other trust lines that do not have the No Ripple flag enabled, payments can still ripple through your account as long as _one_ of the trust lines involved does not have No Ripple enabled.

## Using No Ripple

The No Ripple flag can only be enabled on a trust line if the address has a positive or zero balance. This is so that the feature cannot be abused to remove the obligation the trust line balance represents.

To enable the No Ripple flag, send a [TrustSet transaction][] with the `tfSetNoRipple` flag. To disable the No Ripple flag, send a TrustSet transaction with the `tfClearNoRipple` flag.

## Looking up No Ripple status

In the case of two accounts that mutually trust each other, the No Ripple flag is tracked separately for each account.

Using the HTTP / WebSocket APIs or your preferred client library, look up trust lines with the `account_lines` method. For each trust line, the `no_ripple` field shows whether the current address has enabled the No Ripple flag on that trust line. The `no_ripple_peer` field shows whether the counterparty has enabled the No Ripple flag.

## See Also

- **Concepts:**
    - [Paths](paths.md)
- **Use Cases:**
    - [Stablecoin Issuer](../../../use-cases/tokenization/stablecoin-issuer.md)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)
    - [RippleState (trust line) Flags](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

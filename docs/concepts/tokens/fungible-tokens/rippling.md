---
seo:
    description: Rippling is automatic multi-party net settlement of token balances.
labels:
  - Tokens
  - Cross-Currency
---
# Rippling

Rippling occurs when one holder sends issued currency to another holder of the same currency. 

## Example of Rippling

Issuers distribute currency to holders over trust lines. When a holder creates a trust line to an issuer for a specific currency, they are willing to accept payments of that issued currency. For example, in the chart below, Holder A and Holder B both have trust lines to the Issuer of the token USD.

[![Issuer with trust lines to two holders.](/docs/img/cpt-rippling1.png "Issuer with trust lines to two holders.")](/docs/img/cpt-rippling1.png)

The Issuer transfers 50 USD to Holder A, and 10 USD to Holder B.

[![Issuer sends currency to holders.](/docs/img/cpt-rippling2.png "Issuer sends currency to holders.")](/docs/img/cpt-rippling2.png)

Since both accounts are willing to accept payments in USD tokens, Holder A can send a payment of 20 USD to Holder B. Internally, Holder A’s side of the trust line is reduced by 20 USD and the Issuer’s side of the trust line is increased by 20 USD. 

[![Holder A sends currency through the Issuer.](/docs/img/cpt-rippling3.png "Holder A sends currency through the Issuer.")](/docs/img/cpt-rippling3.png)

Next, the Issuer side of the trust line to Holder B is reduced by 20 USD, and the account of Holder B increases by 20 USD.

[![Holder B receives currency through the Issuer.](/docs/img/cpt-rippling4.png "Holder B receives currency through the Issuer.")](/docs/img/cpt-rippling4.png)

The funds are transferred through the Issuer, but ultimately the Issuer’s balance doesn’t change. This flow of funds is known as _rippling_. Issuing accounts must allow rippling so that their holders can transfer funds to one another. 

Other accounts such as liquidity providers and normal holders should not allow rippling. Rippling can lead to exploits where balances shift unexpectedly, funds are allocated at higher rates, and the holder ends up losing money on a transaction where they played no part.

# The Default Ripple Flag

The Default Ripple flag is an account level setting that enables rippling for all incoming trust lines. The default setting of the Default Ripple flag is false. Issuers must enable this flag for their customers to be able to send tokens to one another.

The Default Ripple setting doesn’t affect trust lines created by your account, only trust lines others open to your account. If you change the setting, trust lines that were created before the change keep their existing No Ripple settings. You can use a TrustSet transaction to change the No Ripple setting of a trust line to match your account’s new default.

# The No Ripple Flag

Accounts that do not want to allow rippling can set the No Ripple flag. If you set the No Ripple flag on two of its trust lines, other accounts cannot use those trust lines to ripple payments through your account.

## Using No Ripple

The No Ripple flag can only be enabled on a trust line if the address has a positive or zero balance. This is so that the feature cannot be abused to remove the obligation the trust line balance represents.

To enable the No Ripple flag, send a `TrustSet` transaction with the `tfSetNoRipple` flag. To disable the No Ripple flag, send a `TrustSet` transaction with the `tfClearNoRipple` flag.

## Looking up No Ripple status

In the case of two accounts that mutually trust each other, the No Ripple flag is tracked separately for each account.

Using the HTTP / WebSocket APIs or your preferred client library, look up trust lines with the `account_lines` method. For each trust line, the `no_ripple` field shows whether the current address has enabled the No Ripple flag on that trust line. The `no_ripple_peer` field shows whether the counterparty has enabled the No Ripple flag.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

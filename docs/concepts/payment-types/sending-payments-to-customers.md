---
html: sending-payments-to-customers.html
parent: payment-types.html
seo:
    description: Construct payments carefully to thwart malicious actors.
labels:
  - Tokens
---
# Sending Payments to Customers

When you build an automated system to send payments into the XRP Ledger for your customers, you must make sure that it constructs payments carefully. Malicious actors are constantly trying to find ways to trick a system into paying them more money than it should.

Generally, when sending stablecoins, you use a [Payment transaction][]. Some of the details are different depending on whether you are issuing tokens for the first time or transferring them from a hot wallet to a customer. Things to note include:

- Always specify your issuing address as the issuer of the token. Otherwise, you might accidentally use paths that deliver the same currency issued by other addresses.
- Before sending a payment into the XRP Ledger, double check the cost of the payment. A payment from your operational address to a customer should not cost more than the destination amount plus any transfer fee you have set.
- When issuing new tokens from your issuing address, you should omit the `SendMax` field. Otherwise, malicious users can arrange their settings so that you issue the full `SendMax` amount instead of just the intended destination `Amount`.
- When sending tokens _from a hot wallet_, you must specify `SendMax` if you have a nonzero transfer fee. In this case, set the `SendMax` field to the amount specified in the `Amount` field plus the transfer fee. (You may want to round up slightly, in case the precision of your calculations doesn't exactly match the XRP Ledger's.) For example, if you send a transaction whose `Amount` field specifies 99.47 USD, and your transfer fee is 0.25%, you should set the `SendMax` field to 124.3375, or 124.34 USD if you round up.
- Omit the `Paths` field. This field is unnecessary when sending directly from the issuer, or from a hot wallet as long as the tokens being sent and the tokens being received have the same currency code and issuer—that is, they're the same stablecoin. The `Paths` field is intended for [Cross-Currency Payments](cross-currency-payments.md) and longer multi-hop (rippling) payments. If you naively perform pathfinding and attach the paths to your transaction, your payment may take a more expensive indirect route rather than failing if the direct path is not available; malicious users can even set this up to.
- If you get a `tecPATH_DRY` result code, this usually indicates that either the customer doesn't have the necessary trust line set up already, or your issuer's rippling settings aren't configured correctly.

For a detailed tutorial on issuing a token on the XRP Ledger, whether a stablecoin or otherwise, see [Issue a Fungible Token](../../tutorials/how-tos/use-tokens/issue-a-fungible-token.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}

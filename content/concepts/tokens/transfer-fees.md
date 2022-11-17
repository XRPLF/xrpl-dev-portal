---
html: transfer-fees.html
parent: tokens.html
blurb: Token issuers can charge a fee for transferring their tokens.
labels:
  - Fees
  - Tokens
---
# Transfer Fees

[Token](tokens.html) issuers can charge a _transfer fee_ that applies when users transfer those tokens among themselves. The sender of the transfer is debited an extra percentage based on the transfer fee, while the recipient of the transfer is credited the intended amount. The difference is the transfer fee.

For standard tokens, the tokens paid in the transfer fee are burned, and no longer tracked in the XRP Ledger. If the token is backed by off-ledger assets, this reduces the amount of those assets the issuer has to hold in reserve to meet its obligations in the XRP Ledger. Transfer fees are usually not appropriate for tokens that aren't backed with outside assets.

Non-fungible tokens can also have transfer fees, but they work differently. For details, see [Non-Fungible Tokens](non-fungible-tokens.html).

The transfer fee does not apply when sending or receiving _directly_ to and from the issuing account, but it does apply when transferring from an [operational address][] to another user.

[operational address]: issuing-and-operational-addresses.html
[issuing address]: issuing-and-operational-addresses.html

XRP never has a transfer fee, because it never has an issuer.

## Example

In this example, ACME Bank issues a EUR stablecoin on the XRP Ledger. ACME Bank might set the transfer fee to 1%. For the recipient of a payment to get 2 EUR.ACME, the sender must send 2.02 EUR.ACME. After the transaction, ACME's outstanding obligations in the XRP Ledger have decreased by 0.02€, which means that ACME no longer needs to hold that amount in the bank account backing its EUR stablecoin.

The following diagram shows an XRP Ledger payment of 2 EUR.ACME from Alice to Charlie with a transfer fee of 1%:

{{ include_svg("img/transfer-fees.svg", "Alice sends 2,02€, Charlie receives 2,00€, and ACME owes 0,02€ less in the XRP Ledger") }}

In accounting terms, Alice's, ACME's, and Charlie's balance sheets may have changed like this:

{{ include_svg("img/transfer-fees-balance-sheets.svg", "Alice's assets are down 2,02€, Charlie's are up 2,00€, and ACME's liabilities are down 0,02€") }}



## Transfer Fees in Payment Paths

<!--{# TODO: Update this for OwnerPaysFee amendment when that gets added #}-->

A transfer fee applies whenever an individual transfer would move tokens from one party to another (except when going to/from the issuing account directly). In more complex transactions, this can occur multiple times. Transfer fees apply starting from the end and working backwards, so that ultimately the sender of a payment must send enough to account for all fees. For example:

{{ include_svg("img/transfer-fees-in-paths.svg", "Diagram of cross-currency payment with transfer fees") }}

In this scenario, Salazar (the sender) holds EUR issued by ACME, and wants to deliver 100 USD issued by WayGate to Rosa (the recipient). FXMaker is a trader with the best offer in the order book, at a rate of 1 USD.WayGate for every 0.9 EUR.ACME. If there were no transfer fees, Salazar could deliver 100 USD to Rosa by sending 90 EUR. However, ACME has a transfer fee of 1% and WayGate has a transfer fee of 0.2%. This means:

* FXMaker must send 100.20 USD.WayGate for Rosa to receive 100 USD.WayGate.
* FXMaker's current ask is 90.18 EUR.ACME to send 100.20 USD.WayGate.
* For FXMaker to receive 90.18 EUR.ACME, Salazar must send 91.0818 EUR.ACME.

<!-- SPELLING_IGNORE: waygate, fxmaker -->

# Technical Details

The transfer fee is represented by a setting on the [issuing address][]. The transfer fee cannot be less than 0% or more than 100% and is rounded down to the nearest 0.0000001%. The transfer fee applies to all tokens issued by the same account. If you want to have different transfer fees for different tokens, use multiple [issuing addresses][issuing address].

In the [XRP Ledger protocol](protocol-reference.html), the transfer fee is specified in the `TransferRate` field, as an integer which represents the amount you must send for the recipient to get 1 billion units of the same token. A `TransferRate` of `1005000000` is equivalent to a transfer fee of 0.5%. By default, the `TransferRate` is set to no fee. The value of `TransferRate` cannot be set to less than `1000000000` ("0%" fee) or more than `2000000000` (a "100%" fee). The value `0` is special case for no fee, equivalent to `1000000000`.

A token issuer can submit an [AccountSet transaction][] from its [issuing address][] to change the `TransferRate` for all its tokens.

Anyone can check an account's `TransferRate` with the [account_info method][]. If the `TransferRate` is omitted, then that indicates no fee.

**Note:** The [fix1201 amendment](amendments.html), introduced in `rippled` v0.80.0 and enabled on 2017-11-14, lowered the maximum transfer fee to 100% (a `TransferRate` of `2000000000`) from an effective limit of approximately 329% (based on the maximum size of a 32-bit integer). The ledger may still contain accounts with a transfer fee setting higher than 100% because transfer fees that were already set continue to apply at their stated rate.

## Client Library Support

Some [client libraries](client-libraries.html) have convenience functions for getting and setting `TransferRate` functions.

**JavaScript:** Use `xrpl.percentToTransferRate()` to convert a percentage transfer fee from a string to the corresponding `TransferRate` value.

## See Also

- **Concepts:**
    - [Fees (Disambiguation)](fees.html)
    - [Transaction Cost](transaction-cost.html)
    - [Paths](paths.html)
- **Tutorials:**
    - [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [AccountRoot Flags](accountroot.html#accountroot-flags)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

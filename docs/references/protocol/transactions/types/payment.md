---
seo:
    description: Send funds to another account, convert between currencies, or create a new account by sending it XRP.
labels:
   - Payments
   - XRP
   - Cross-Currency
   - Tokens
---
# Payment
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/xrpld/app/tx/detail/Payment.cpp "Source")

Send value to an account. (Depending on the path taken, this can involve exchanges of several types of funds, all of which occur atomically.) This transaction type can be used for several [types of payments](#types-of-payments).

Payments are also the only way to [create accounts](#creating-accounts).

## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType" : "Payment",
  "Account" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "Destination" : "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
  "DeliverMax" : {
     "currency" : "USD",
     "value" : "1",
     "issuer" : "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
  },
  "Fee": "12",
  "Flags": 2147483648,
  "Sequence": 2,
}
```

{% tx-example txid="7BF105CFE4EFE78ADB63FE4E03A851440551FE189FD4B51CAAD9279C9F534F0E" /%}

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}


| Field            | JSON Type            | [Internal Type][] | Required? | Description |
|:-----------------|:---------------------|:------------------|:----------|:------------|
| `Amount`         | [Currency Amount][]  | Amount            | API v1: Yes | Alias to `DeliverMax`. |
| `CredentialIDs`  | Array of Strings     | Vector256         | No        | Set of Credentials to authorize a deposit made by this transaction. Each member of the array must be the ledger entry ID of a Credential entry in the ledger. {% amendment-disclaimer name="Credentials" /%} |
| `DeliverMax`     | [Currency Amount][]  | Amount            | Yes       | [API v2][]: The maximum amount of currency to deliver. [Partial payments](#partial-payments) can deliver less than this amount and still succeed; other payments fail unless they deliver the exact amount. {% badge href="https://github.com/XRPLF/rippled/releases/tag/2.0.0" %}New in: rippled 2.0.0{% /badge %} |
| `DeliverMin`     | [Currency Amount][]  | Amount            | No        | Minimum amount of destination currency this transaction should deliver. Only valid if this is a [partial payment](#partial-payments). |
| `Destination`    | String - [Address][] | AccountID         | Yes       | The account receiving the payment. |
| `DestinationTag` | Number               | UInt32            | No        | Arbitrary tag that identifies the reason for the payment to the destination, or a hosted recipient to pay. |
| `DomainID`       | String - [Hash][]    | UInt256           | No        | The ledger entry ID of a permissioned domain. If this is a cross-currency payment, only use the corresponding [permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md) to convert currency. Both the sender and the recipient must have valid credentials that grant access to the specified domain. This field has no effect if the payment is not cross-currency. {% amendment-disclaimer name="PermissionedDEX" %/} |
| `InvoiceID`      | String - Hexadecimal | UInt256           | No        | Arbitrary 256-bit value representing a specific reason or identifier for this payment. |
| `Paths`          | Array of path arrays | PathSet           | No        | _(Auto-fillable)_ Array of [payment paths](../../../../concepts/tokens/fungible-tokens/paths.md) to be used for this transaction. Must be omitted for XRP-to-XRP transactions. |
| `SendMax`        | [Currency Amount][]  | Amount            | No        | Highest amount of source currency this transaction is allowed to cost, including [transfer fees](../../../../concepts/tokens/fungible-tokens/transfer-fees.md), exchange rates, and [slippage](http://en.wikipedia.org/wiki/Slippage_%28finance%29). Does not include the [XRP destroyed as a cost for submitting the transaction](../../../../concepts/transactions/transaction-cost.md). Must be supplied for cross-currency/cross-issue payments. Must be omitted for XRP-to-XRP payments. |

When specifying a transaction, you must specify either `Amount` or `DeliverMax`, but not both. When displaying transactions in JSON, API v1 always uses `Amount` and API v2 (or later) always uses `DeliverMax`.


## Types of Payments

The `Payment` transaction type functions differently depending on how you fill in the `Payment` fields:

| Payment type | `Amount`  | `SendMax`  | `Paths`   | `Account` = `Destination`? | Description |
|:-------------|:----------|:-----------|:----------|:---------------------------|:--|
| [Direct XRP Payment][] | String (XRP) | Omitted | Omitted | No          | Transfers XRP directly from one account to another, using one transaction. Always delivers the exact amount. No fee applies other than the basic [transaction cost](../../../../concepts/transactions/transaction-cost.md). |
| [Creating or redeeming tokens][] | Object | Object (optional) | Optional | No | Increases or decreases the amount of a non-XRP currency or asset tracked in the XRP Ledger. [Transfer fees](../../../../concepts/tokens/fungible-tokens/transfer-fees.md) and [freezes](../../../../concepts/tokens/fungible-tokens/freezes.md) do not apply when sending and redeeming directly. |
| [Cross-currency Payment][] | Object (non-XRP) / String (XRP) | Object (non-XRP) / String (XRP) | Usually required | No | Send tokens from one holder to another. The `Amount` or `SendMax` can be XRP or tokens, but can't both be XRP. These payments [ripple through](../../../../concepts/tokens/fungible-tokens/rippling.md) the issuer and can take longer [paths](../../../../concepts/tokens/fungible-tokens/paths.md) through several intermediaries if the transaction specifies a path set. [Transfer fees](../../../../concepts/tokens/fungible-tokens/transfer-fees.md) set by the issuer(s) apply to this type of transaction. These transactions consume offers in the [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md) to connect different currencies, or currencies with the same currency code and different issuers. |
| [Partial payment][] | Object (non-XRP) / String (XRP) | Object (non-XRP) / String (XRP) | Usually required | No | Sends _up to_ a specific amount of any currency. Uses the [`tfPartialPayment` flag](#payment-flags). May include a `DeliverMin` amount specifying the minimum that the transaction must deliver to be successful; if the transaction does not specify `DeliverMin`, it can succeed by delivering _any positive amount_. |
| Currency conversion | Object (non-XRP) / String (XRP) | Object (non-XRP) / String (XRP) | Required         | Yes | Consumes offers in the [decentralized exchange](../../../../concepts/tokens/decentralized-exchange/index.md) to convert one currency to another, possibly taking [arbitrage](https://en.wikipedia.org/wiki/Arbitrage) opportunities. The `Amount` and `SendMax` cannot both be XRP. Also called a _circular payment_ because it delivers money to the sender. This type of transaction may be classified as an "exchange" and not a "payment". |
| MPT Payment | Object | Omitted | Omitted | No | Send MPTs to a holder. See [MPT Payments](#mpt-payments). | 

[Direct XRP Payment]: ../../../../concepts/payment-types/direct-xrp-payments.md
[Creating or redeeming tokens]: ../../../../concepts/tokens/index.md
[Cross-currency Payment]: ../../../../concepts/payment-types/cross-currency-payments.md
[Partial payment]: ../../../../concepts/payment-types/partial-payments.md


## Special issuer Values for SendMax and Amount

<!-- SPELLING_IGNORE: sendmax -->

Most of the time, the `issuer` field of a non-XRP [Currency Amount][] indicates the issuer of a token. However, when describing payments, there are special rules for the `issuer` field in the `DeliverMax` (or `Amount`) and `SendMax` fields of a payment.

* There is only ever one balance between two addresses for the same currency code. This means that, sometimes, the `issuer` field of an amount actually refers to a counterparty, instead of the address that issued the token.
* When the `issuer` field of the destination `DeliverMax` field matches the `Destination` address, it is treated as a special case meaning "any issuer that the destination accepts." This includes all addresses to which the destination has trust lines with a positive limit, as well as tokens issued by the destination itself.
* When the `issuer` field of the `SendMax` field matches the source account's address, it is treated as a special case meaning "any issuer that the source can use." The payment can send tokens the source account already holds, or issue new tokens to others who have trust lines with the source account.

In all of these cases, the currency code must still match exactly.


## Creating Accounts

The Payment transaction type can create new accounts in the XRP Ledger by sending enough XRP to an unfunded address. Other transactions to unfunded addresses always fail.

For more information, see [Creating Accounts](../../../../concepts/accounts/index.md#creating-accounts).

## Paths

If present, the `Paths` field must contain a _path set_ - an array of path arrays. Each individual path represents one way value can flow from the sender to receiver through various intermediary accounts, order books, and automated market makers. A single transaction can potentially use multiple paths, for example if the transaction exchanges currency using several different order books to achieve the best rate.

You must omit the `Paths` field for direct payments, including:

* An XRP-to-XRP transfer.
* A direct transfer on a trust line that connects the sender and receiver.

If the `Paths` field is provided, the server decides at transaction processing time which paths to use, from the provided set plus a _default path_ (the most direct way possible to connect the specified accounts). This decision is deterministic and attempts to minimize costs, but it is not guaranteed to be perfect.

The `Paths` field must not be an empty array, nor an array whose members are all empty arrays.

For more information, see [Paths](../../../../concepts/tokens/fungible-tokens/paths.md).

## Payment Flags

Transactions of the Payment type support additional values in the [`Flags` field](../common-fields.md#flags-field), as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                  |
|:-------------------|:-------------|:--------------|:-----------------------------|
| `tfNoRippleDirect` | `0x00010000` | 65536         | Do not use the default path; only use paths included in the `Paths` field. This is intended to force the transaction to take arbitrage opportunities. Most clients do not need this. |
| `tfPartialPayment` | `0x00020000` | 131072        | If the specified `Amount` cannot be sent without spending more than `SendMax`, reduce the received amount instead of failing outright. See [Partial Payments](#partial-payments) for more details. |
| `tfLimitQuality`   | `0x00040000` | 262144        | Only take paths where all the conversions have an input:output ratio that is equal or better than the ratio of `Amount`:`SendMax`. See [Limit Quality](#limit-quality) for details. |

## Partial Payments

A partial payment allows a payment to succeed by reducing the amount received. Partial payments are useful for [returning payments](../../../../concepts/payment-types/bouncing-payments.md) without incurring additional costs to oneself. However, partial payments can also be used to exploit integrations that naively assume the `Amount` field of a successful transaction always describes the exact amount delivered. To reduce confusion, `Amount` has been renamed to `DeliverMax` in API v2 and later.

A partial payment is any [Payment transaction][] with the `tfPartialPayment` flag enabled. A partial payment can be successful if it delivers any positive amount greater than or equal to its `DeliverMin` field (or any positive amount at all if `DeliverMin` is not specified) without sending more than the `SendMax` value.

The [`delivered_amount`](../metadata.md#delivered_amount) field of a payment's metadata indicates the amount of currency actually received by the destination account.

For more information, see the full article on [Partial Payments](../../../../concepts/payment-types/partial-payments.md).


## Limit Quality

The XRP Ledger defines the "quality" of a currency exchange as the ratio of the numeric amount in to the numeric amount out. For example, if you spend $2 USD to receive £1 GBP, then the "quality" of that exchange is `0.5`. <!-- SPELLING_IGNORE: GBP -->

The [`tfLimitQuality` flag](#payment-flags) allows you to set a minimum quality of conversions that you are willing to take. This limit quality is defined as the destination `Amount` divided by the `SendMax` amount (the numeric amounts only, regardless of currency). When set, the payment processing engine avoids using any paths whose quality (conversion rate) is worse (numerically lower) than the limit quality.

By itself, the `tfLimitQuality` flag reduces the number of situations in which a transaction can succeed. Specifically, it rejects payments where some part of the payment uses an unfavorable conversion, even if the overall *average* quality of conversions in the payment is equal or better than the limit quality. If a payment is rejected in this way, the [transaction result](../transaction-results/index.md) is `tecPATH_DRY`.

Consider the following example. If I am trying to send you 100 Chinese Yuan (`Amount` = 100 CNY) for 20 United States dollars (`SendMax` = 20 USD) or less, then the limit quality is `5`. Imagine one trader is offering ¥95 for $15 (a ratio of about `6.3` CNY per USD), but the next best offer in the market is ¥5 for $2 (a ratio of `2.5` CNY per USD). If I were to take both offers to send you 100 CNY, then it would cost me 17 USD, for an average quality of about `5.9`.

Without the `tfLimitQuality` flag set, this transaction would succeed, because the $17 it costs me is within my specified `SendMax`. However, with the `tfLimitQuality` flag enabled, the transaction would fail instead, because the path to take the second offer has a quality of `2.5`, which is worse than the limit quality of `5`.

The `tfLimitQuality` flag is most useful when combined with [partial payments](../../../../concepts/payment-types/partial-payments.md). When both `tfPartialPayment` and `tfLimitQuality` are set on a transaction, then the transaction delivers as much of the destination `Amount` as it can, without using any conversions that are worse than the limit quality.

In the above example with a ¥95/$15 offer and a ¥5/$2 offer, the situation is different if my transaction has both `tfPartialPayment` and `tfLimitQuality` enabled. If we keep my `SendMax` of 20 USD and a destination `Amount` of 100 CNY, then the limit quality is still `5`. However, because I am doing a partial payment, the transaction sends as much as it can instead of failing if the full destination amount cannot be sent. This means that my transaction consumes the ¥95/$15 offer, whose quality is about `6.3`, but it rejects the ¥5/$2 offer because that offer's quality of `2.5` is worse than the quality limit of `5`. In the end, my transaction only delivers ¥95 instead of the full ¥100, but it avoids wasting money on poor exchange rates.

## MPT Payments

When you send a payment using [MPTs](/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens), the _Amount_ field requires only the `mpt_issuance_id` and the `value`. The `MPTokenIssuanceID` is used to uniquely identify the MPT for the transaction.

Version 1 MPTokens only support direct MPT payment between accounts. They cannot be traded in the decentralized exchange.

{% amendment-disclaimer name="MPTokensV1" /%}

### Sample MPT Payment transaction

```json
{
   "Account": "rLWSJKbwYSzG32JuGissYd66MFTvfMk4Bt",
   "Amount": {
      "mpt_issuance_id": "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
      "value": "100"
   },
   "DeliverMax": {
      "mpt_issuance_id": "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
      "value": "100"
   },
   "SendMax": {
      "mpt_issuance_id": "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
      "value": "100"
   },
   "Destination": "raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak",
   "Fee": "120",
   "Flags": 0,
}
```
## Credential IDs

You can send money to an account that uses [Deposit Authorization](../../../../concepts/accounts/depositauth.md) by providing the `CredentialIDs` field with an exact set of credentials that are preauthorized by the recipient. The set of credentials must match a [DepositPreauth entry](../../ledger-data/ledger-entry-types/depositpreauth.md) in the ledger.

The credentials provided in the `CredentialIDs` field must all be valid, meaning:

- The provided credentials must exist.
- The provided credentials must have been accepted by the subject.
- None of the provided credentials may be expired.
- The sender of this transaction must be the subject of each of the credentials.

If you provide credentials even though the destination account does not use Deposit Authorization, the credentials are not needed but they are still checked for validity.

{% admonition type="info" name="Note" %}
The `CredentialIDs` field is only used for deposit authorization, not for trading in a [permissioned DEX](../../../../concepts/tokens/decentralized-exchange/permissioned-dexes.md), even though Permissioned DEXes also use credentials to grant access. To trade in a permissioned DEX, you use the `DomainID` field to specify a domain for which you hold valid credentials.
{% /admonition %}

{% amendment-disclaimer name="Credentials" /%}

## Special Case for Destination Accounts Below the Reserve

If an account has Deposit Authorization enabled, but its current XRP balance is less than the [reserve requirement](../../../../concepts/accounts/reserves.md), there is a special exception to Deposit Authorization where anyone can send a Payment transaction, without preauthorization, for up to the base account reserve; this exists as an emergency measure to prevent an account from getting "stuck" without enough XRP to transact. To qualify for this special case, the payment MUST NOT use the `CredentialIDs` field.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

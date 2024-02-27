---
html: currency-formats.html
parent: basic-data-types.html
seo:
    description: Precision and range for currency numbers, plus formats of custom currency codes.
label:
  - XRP
  - Tokens
---
# Currency Formats

The XRP Ledger has two kinds of digital asset: XRP and [tokens](../../../concepts/tokens/index.md). Both types have high precision, although their formats are different.

## Comparison

The following table summarizes some of the differences between XRP and tokens in the XRP Ledger:

| XRP                                                      | Tokens |
|:---------------------------------------------------------|:------------------|
| Has no issuer.                                           | Always issued by an XRP Ledger account. |
| Specified as a string.                                   | Specified as an object. |
| Tracked in [accounts](../ledger-data/ledger-entry-types/accountroot.md).                 | Tracked in [trust lines](../ledger-data/ledger-entry-types/ripplestate.md). |
| Can never be created; can only be destroyed.             | Can be issued or redeemed freely. |
| Minimum value: `0`. (Cannot be negative.)                | Minimum value: `-9999999999999999e80`. Minimum nonzero absolute value: `1000000000000000e-96`.
| Maximum value `100000000000` (10<sup>11</sup>) XRP. That's `100000000000000000` (10<sup>17</sup>) "drops". | Maximum value `9999999999999999e80`. |
| Precise to the nearest "drop" (0.000001 XRP)             | 15 decimal digits of precision. |
| Can't be [frozen](../../../concepts/tokens/fungible-tokens/freezes.md).                         | The issuer can [freeze](../../../concepts/tokens/fungible-tokens/freezes.md) balances. |
| No transfer fees; XRP-to-XRP payments are always direct. | Can take indirect [paths](../../../concepts/tokens/fungible-tokens/paths.md) with each issuer charging a percentage [transfer fee](../../../concepts/tokens/transfer-fees.md). |
| Can be used in [Payment Channels](../../../concepts/payment-types/payment-channels.md) and [Escrow](../../../concepts/payment-types/escrow.md). | Not compatible with Payment Channels or Escrow. |

For more information, see [What is XRP?](../../../introduction/what-is-xrp.md) and [Tokens](../../../concepts/tokens/index.md).

## Specifying Currency Amounts

Use the appropriate format for the type of currency you want to specify:

- [XRP Amounts](#xrp-amounts)
- [Token Amounts](#token-amounts)

### XRP Amounts

To specify an amount of XRP, use a [String Number][] indicating _drops_ of XRP, where each drop is equal to 0.000001 XRP. For example, to specify 13.1 XRP:

```
"13100000"
```

**Do not specify XRP as an object.**

XRP amounts cannot be negative.

### Token Amounts

To specify an amount of a [(fungible) token](../../../concepts/tokens/index.md), use an Amount object. This is a JSON object with three fields:

| `Field`    | Type                       | Description                        |
|:-----------|:---------------------------|:-----------------------------------|
| `currency` | String - [Currency Code][] | Arbitrary currency code for the token. Cannot be `XRP`. |
| `value`    | [String Number][]          | Quoted decimal representation of the amount of the token. This can include scientific notation, such as `1.23e11` meaning 123,000,000,000. Both `e` and `E` may be used. This can be negative when displaying balances, but negative values are disallowed in other contexts such as specifying how much to send. |
| `issuer`   | String                     | Generally, the [account](../../../concepts/accounts/index.md) that issues this token. In special cases, this can refer to the account that holds the token instead (for example, in a [Clawback](../transactions/types/clawback.md) transaction). |

[String Number]: #string-numbers

**Caution:** These field names are case-sensitive.

For example, to represent $153.75 US dollars issued by account `r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59`, you would specify:

```json
{
    "currency": "USD",
    "value": "153.75",
    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```

### Specifying Without Amounts

In some cases, you need to define an asset (which could be XRP or a token) without a specific amount, such as when defining an order book in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md).

To describe a token without an amount, specify it as a currency object, but omit the `value` field. For example:

```json
{
  "currency": "TST",
  "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
}
```

To describe XRP without an amount, specify it as a JSON object with _only_ a `currency` field. Never include an `issuer` field for XRP. For example:

```json
{
  "currency": "XRP"
}
```


## String Numbers

{% partial file="/docs/_snippets/string-number-formatting.md" /%}

## XRP Precision

XRP has the same precision as a 64-bit unsigned integer where each unit is equivalent to 0.000001 XRP. It uses integer math, so that any amount less than a full drop is rounded down.

## Token Precision

Tokens can represent a wide variety of assets, including those typically measured in very small or very large denominations. This format uses significant digits and a power-of-ten exponent in a similar way to scientific notation. The format supports positive and negative significant digits and exponents within the specified range. Unlike typical floating-point representations of non-whole numbers, this format uses integer math for all calculations, so it always maintains 15 decimal digits of precision. Multiplication and division have adjustments to compensate for over-rounding in the least significant digits.

When sending token amounts in the XRP Ledger's peer-to-peer network, servers [serialize](../binary-format.md) the amount to a 64-bit binary value.

**Tip:** For tokens that should not be divisible at all, see [Non-Fungible Tokens (NFTs)](../../../concepts/tokens/nfts/index.md).

## Currency Codes
[Currency Code]: #currency-codes

{% partial file="/docs/_snippets/data_types/currency_code.md" /%}



### Standard Currency Codes

The standard format for currency codes is a three-character string such as `USD`. This is intended for use with [ISO 4217 Currency Codes](https://www.xe.com/iso4217.php). The following rules apply:

- Currency codes must be exactly 3 ASCII characters in length. The following characters are permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and <code>&#124;</code>.
- Currency codes are case-sensitive.
- The currency code `XRP` (all-uppercase) is disallowed. Real XRP typically does not use a currency code in the XRP Ledger protocol.

At the protocol level, this format is [serialized](../binary-format.md#currency-codes) into a 160-bit binary value starting with `0x00`.

### Nonstandard Currency Codes

You can also use a 160-bit (40-character) hexadecimal string such as `015841551A748AD2C1F76FF6ECB0CCCD00000000` as the currency code. To prevent this from being treated as a "standard" currency code, the first 8 bits MUST NOT be `0x00`.

**Deprecated:** Some previous versions of [ripple-lib](https://github.com/XRPLF/xrpl.js) supported an "interest-bearing" or "demurraging" currency code type. These codes have the first 8 bits `0x01`. Demurraging / interest-bearing currencies are no longer supported, but you may find them in ledger data. For more information, see [Demurrage](../../../concepts/tokens/fungible-tokens/demurrage.md).

---
html: currency-formats.html
parent: basic-data-types.html
seo:
    description: Precision and range for currency numbers, plus formats of custom currency codes.
label:
  - XRP
  - Tokens
  - MPTs
---
# Currency Formats

The XRP Ledger has three kinds of digital asset: XRP, [tokens](../../../concepts/tokens/index.md), and [Multi-purpose Tokens (MPTs)](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md). All three types have high precision, although their formats are different.

{% amendment-disclaimer name="MPTokensV1" /%}

## Comparison

The following table summarizes some of the differences between XRP, tokens, and MPTs in the XRP Ledger:

| XRP                                                      | Tokens            | MPTs                 |
|:---------------------------------------------------------|:------------------|:---------------------|
| Has no issuer.                                           | Always issued by an XRP Ledger account. | Always issued by an XRP Ledger account. |
| Specified as a string.                                   | Specified as an object. | Specified as an object. |
| Tracked in [accounts](../ledger-data/ledger-entry-types/accountroot.md).                 | Tracked in [trust lines](../ledger-data/ledger-entry-types/ripplestate.md). | Tracked in holder's account. |
| Can never be created; can only be destroyed.             | Can be issued or redeemed freely. | Can be issued or redeemed freely. |
| Minimum value: `0`. (Cannot be negative.)                | Minimum value: `-9999999999999999e80`. Minimum nonzero absolute value: `1000000000000000e-96`. | Minimum value: `0`. (Cannot be negative.)   |
| Maximum value `100000000000` (10<sup>11</sup>) XRP. That's `100000000000000000` (10<sup>17</sup>) "drops". | Maximum value `9999999999999999e80`. | Maximum value `0x7FFFFFFFFFFFFFFF`. |
| Precise to the nearest "drop" (0.000001 XRP)             | 15 decimal digits of precision. |
| Can't be [frozen](../../../concepts/tokens/fungible-tokens/freezes.md).                         | The issuer can [freeze](../../../concepts/tokens/fungible-tokens/freezes.md) balances. | The issuer can lock balances individually and globally. |
| No transfer fees; XRP-to-XRP payments are always direct. | Can take indirect [paths](../../../concepts/tokens/fungible-tokens/paths.md) with each issuer charging a percentage [transfer fee](../../../concepts/tokens/fungible-tokens/transfer-fees.md). | Can charge a transfer fee for secondary sales of the token. |
| Can be used in [Payment Channels](../../../concepts/payment-types/payment-channels.md) and [Escrow](../../../concepts/payment-types/escrow.md). | Not compatible with Payment Channels or Escrow. | Not compatible with Payment Channels or Escrow. |

See [What is XRP?](../../../introduction/what-is-xrp.md), [Tokens](../../../concepts/tokens/index.md), and [Multi-purpose Tokens](../../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md).

## Specifying Currency Amounts

Use the appropriate format for the type of currency you want to specify:

- [XRP Amounts](#xrp-amounts)
- [Token Amounts](#token-amounts)
- [MPT Amounts](#mpt-amounts)

### XRP Amounts

To specify an amount of XRP, use a [String Number][] indicating _drops_ of XRP, where each drop is equal to 0.000001 XRP. For example, to specify 13.1 XRP:

```
"13100000"
```

**Do not specify XRP as an object.**

XRP amounts cannot be negative.

### Token Amounts

To specify an amount of a [(fungible) token](../../../concepts/tokens/index.md), use an `Amount` object. Tokens use the `currency`, `value`, and `issuer` fields.

| `Field`    | Type                       | Description                        |
|:-----------|:---------------------------|:-----------------------------------|
| `currency` | String - [Currency Code][] | Arbitrary currency code for the token. Cannot be `XRP`. |
| `value`    | [String Number][]          | Quoted decimal representation of the amount of the token. This can include scientific notation, such as `1.23e11` meaning 123,000,000,000. Both `e` and `E` may be used. This can be negative when displaying balances, but negative values are disallowed in other contexts such as specifying how much to send. |
| `issuer`   | String                     | Generally, the [account](../../../concepts/accounts/index.md) that issues this token. In special cases, this can refer to the account that holds the token instead (for example, in a [Clawback](../transactions/types/clawback.md) transaction). |

[String Number]: #string-numbers

{% admonition type="warning" name="Caution" %}These field names are case-sensitive.{% /admonition %}

For example, to represent $153.75 US dollars issued by account `r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59`, you would specify:

```json
{
    "currency": "USD",
    "value": "153.75",
    "issuer": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59"
}
```
### MPT Amounts

Specify the amount of MPTs using the `value` field. 

| `Field`    | Type                       | Description                        |
|:-----------|:---------------------------|:-----------------------------------|
| `mpt_issuance_id` | String              | Arbitrary unique identifier for a Multi-purpose Token. |
| `value`    | [String Number][]          | A string representing a positive integer value.  Valid values for this field are between 0x0 and 0x7FFFFFFFFFFFFFFF. Use `AssetScale` to enable values as fractions of the MPT value. See [MPT Precision](#mpt-precision). |

For example, to specify 1 million units of an MPT you would specify:

```json
{
    "mpt_issuance_id": 
	     "0000012FFD9EE5DA93AC614B4DB94D7E0FCE415CA51BED47",
    "value": "1000000"
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

To describe an MPT without an amount, specify it as a JSON object with _only_ a `mpt_issuance_id` field. For example:

```json
{
  "mpt_issuance_id": "0000012FFD9EE5DA93AC614B4DB94D7E0FCE415CA51BED47"
}
```

## String Numbers

{% partial file="/docs/_snippets/string-number-formatting.md" /%}

## XRP Precision

XRP has the same precision as a 64-bit unsigned integer where each unit is equivalent to 0.000001 XRP. It uses integer math, so that any amount less than a full drop is rounded down.

## Token Precision

Tokens can represent a wide variety of assets, including those typically measured in very small or very large denominations. This format uses significant digits and a power-of-ten exponent in a similar way to scientific notation. The format supports positive and negative significant digits and exponents within the specified range. Unlike typical floating-point representations of non-whole numbers, this format uses integer math for all calculations, so it always maintains 15 decimal digits of precision. Multiplication and division have adjustments to compensate for over-rounding in the least significant digits.

When sending token amounts in the XRP Ledger's peer-to-peer network, servers [serialize](../binary-format.md) the amount to a 64-bit binary value.

{% admonition type="success" name="Tip" %}For tokens that should not be divisible at all, see [Non-Fungible Tokens (NFTs)](../../../concepts/tokens/nfts/index.md).{% /admonition %}

## MPT Precision

MPTs are always expressed in whole integers. You can change the `AssetScale` of your MPT to express the basic unit as a fraction of an MPT. The XRP Ledger doesn't use the `AssetScale` on-chain: this is for your convenience in specifying the basic unit.

For example, to express a value of 13.1 MPT, the MPT would require that the `AssetScale` be set to 1, and the `value` of the MPT set to 131.

```json
   "Amount": {
      "mpt_issuance_id":
        "0000012FFD9EE5DA93AC614B4DB94D7E0FCE415CA51BED47",
      "value": "131"
    }
```

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

You can also use a 160-bit (40-character) hexadecimal string, such as `444F4C4C415259444F4F00000000000000000000` as the currency code. To prevent this from being treated as a "standard" currency code, the first 8 bits SHOULD NOT be `0x00`. At a protocol level, non-standard currency codes starting with `0x00` are allowed, but they may not be handled correctly by all APIs. When using or reading a nonstandard currency code, consider the following:

- Most interfaces that read currency codes translate them into ASCII when the currency code is nonstandard.
- If you decode a nonstandard currency code into text (ASCII or UTF-8), beware of non-printing characters or text that may be treated as markup where you are displaying them. Also be careful of "lookalike" currency codes that may display as XRP or other assets, but aren't.
- Not all hexadecimal strings have a direct, human-readable format. See: [Normalize Currency Codes](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/normalize-currency-codes).

**Deprecated:** Some previous versions of [ripple-lib](https://github.com/XRPLF/xrpl.js) supported an "interest-bearing" or "demurraging" currency code type, such as `015841551A748AD2C1F76FF6ECB0CCCD00000000`. These codes have the first 8 bits `0x01`. Demurraging / interest-bearing currencies are no longer supported, but you may find them in ledger data. For more information, see [Demurrage](../../../concepts/tokens/fungible-tokens/demurrage.md).



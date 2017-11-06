# Currency Formats

The XRP Ledger has [two kinds of money](concept-money.html): XRP, and issued currencies. In the XRP Ledger, both types have high precision, although their formats are different.

## String Formatting

{% include 'snippets/string-number-formatting.md' %}

## XRP Precision

XRP has the same precision as a 64-bit unsigned integer where each unit is equivalent to 0.000001 XRP. Its properties are:

* Minimum value: `0`
* Maximum value: `100000000000` (10<sup>11</sup>) XRP
    - `"100000000000000000"` (10<sup>17</sup>) drops of XRP
* Precise to the nearest `0.000001` (10<sup>-6</sup>) XRP
    - `"1"` drop of XRP

## Issued Currency Precision

Issued currencies in the XRP Ledger are represented with a custom format with the following precision:

* Minimum nonzero absolute value: `1000000000000000e-96`
* Maximum value: `9999999999999999e80`
* Minimum value: `-9999999999999999e80`
* 15 decimal digits of precision

## Issued Currency Math
[[Source]<br>](https://github.com/ripple/rippled/blob/35fa20a110e3d43ffc1e9e664fc9017b6f2747ae/src/ripple/protocol/impl/STAmount.cpp "Source")

![Issued Currency Amount Format diagram](img/currency-number-format.png)

Internally, `rippled` represents numbers for issued currencies in a custom number format. This format can store a wide variety of assets, including those typically measured in very small or very large denominations. Unlike typical floating-point representations of non-whole numbers, this format uses integer math for all calculations, so it always maintains 15 decimal digits of precision. Unlike "arbitrary precision" number formats, the custom format can always be stored in a fixed size of 64 bits.

The internal format consists of three parts: a sign bit, a mantissa, and an exponent. The mantissa contains up to 15 significant digits (in base-10), and the exponent contains a scale (from -96 to +80). The sign bit indicates whether the amount is positive or negative. Before recording any amount, `rippled` "canonicalizes" the value so that the mantissa is within the range `1000000000000000` to `9999999999999999` (inclusive) and the exponent is in the range -96 to 80 (inclusive). (Exception: the value `0` is represented with a mantissa of `0`.) For example, the canonical representation of 1 unit of currency is `1000000000000000e-15`. The internal calculations generally use integer math so that numbers are always precise within 15 digits.

When transmitting non-XRP amounts across the network or recording them in ledgers, the amounts are joined into a 64-bit format. The most significant bit indicates whether the amount is XRP or issued currency. (The value `1` indicates a non-XRP amount.) The next bit is the sign bit, 1 for positive or 0 for negative. (Caution: This is the opposite of how sign bits work in most other numeric representations!) The next 8 bits are the exponent, and the mantissa occupies the remaining 54 bits.

## Currency Codes

All non-XRP currencies in the XRP Ledger have a 160-bit currency code. The [`rippled` APIs](reference-rippled.html) map 3-character ASCII strings (case-sensitive) to 160-bit currency codes using a standard mapping. The currency code `XRP` is disallowed for issued currencies. Currencies with the same code can [ripple](concept-noripple.html) across connected trustlines. Currency codes have no other behavior built into the XRP Ledger.

### Standard Currency Codes

The standard currency mapping allocates the bits as follows:

![Standard Currency Code Format](img/currency-code-format.png)

1. The first 8 bits must be `0x00`.
2. The next 96 bits are reserved, and should be all `0`s.
3. The next 24 bits represent 3 characters of ASCII.
    Ripple recommends using [ISO 4217](http://www.xe.com/iso4217.php) codes, or popular pseudo-ISO 4217 codes such as "BTC". However, any combination of the following characters is permitted: all uppercase and lowercase letters, digits, as well as the symbols `?`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `<`, `>`, `(`, `)`, `{`, `}`, `[`, `]`, and <code>&#124;</code>. The currency code `XRP` (all-uppercase) is reserved for XRP and cannot be used by issued currencies.
4. The next 8 bits indicate the currency version. If the same currency is reissued with a different value, you can increment this value to keep the currencies separate.
5. The next 24 bits are reserved and should be all `0`s.

### Nonstandard Currency Codes

You can also issue currency of other types by using a 160-bit (40-character) hexadecimal string such as `015841551A748AD2C1F76FF6ECB0CCCD00000000` as the currency code. To prevent this from being treated as a different currency code type, the first 8 bits MUST NOT be `0x00`.

**Deprecated:** Some previous versions of [ripple-lib](https://github.com/ripple/ripple-lib) supported an "interest-bearing" or "demurraging" currency code type. These currencies have the first 8 bits `0x01`. Demurraging / interest-bearing currencies are no longer supported, but you may encounter them in ledger data. For more information, see [Demurrage](concept-demurrage.html).

# Demurrage

**Warning:** Demurrage is a deprecated feature with no ongoing support. This page describes historical behavior of older versions of Ripple software.

[Demurrage](http://en.wikipedia.org/wiki/Demurrage_%28currency%29) is a negative interest rate on assets held that represents the cost of holding those assets. To represent the demurrage on an issued currency in the XRP Ledger, you can track it using a custom [currency code](currency-formats.html#currency-codes) that indicates the demurrage rate. This effectively creates separate versions of the currency for each varying amount of demurrage. Client applications can support this by representing the demurraging currency code with an annual percentage rate alongside the currency code. For example: "XAU (-0.5%pa)".

## Representing Demurraging Currency Amounts

Rather than continuously update all amounts in the XRP Ledger, this approach divides amounts of interest-bearing or demurraging currency into two types of amount: "ledger values" recorded in the XRP Ledger, and "display values" shown to people. The "ledger values" represent the value of the currency at a fixed point, namely the "Ripple Epoch" of midnight January 1, 2000. The "display values" represent the amount at a later point in time (usually the current time) after calculating continuous interest or demurrage from the Ripple Epoch until that time.

**Tip:** You can think of demurrage as similar to inflation, where the value of all assets affected by it decreases over time, but the ledger always holds amounts in year-2000 values. This does not reflect actual real-world inflation; demurrage is more like hypothetical inflation at a constant rate.

Thus, client software must apply two conversions:

- Taking display values at a given time and converting them to ledger values to be recorded.
- Taking ledger values and converting them to a display value at a given point in time.

### Calculating Demurrage

The full formula for calculating demurrage on a currency is as follows:

```
D = A × ( e ^ (t ÷ τ) )
```

- **D** is the amount after demurrage
- **A** is the pre-demurrage amount as recorded in the global ledger
- **e** is Euler's number
- **t** is the number of seconds since the Ripple Epoch (0:00 on January 1, 2000 UTC)
- **τ** is the e-folding time in seconds. This value is [calculated from the desired interest rate](#calculating-e-folding-time).

To convert between display amounts and ledger amounts, you can use the following steps:

1. Calculate the value of `( e ^ (t ÷ τ) )`. We call this number the "demurrage coefficient". The demurrage coefficient is always relative to a specific time, such as the current time.
2. Apply it to the amount to convert:
    - To convert ledger values to display values, multiply by the demurrage coefficient.
    - To convert display values to ledger values, divide by the demurrage coefficient.
3. If necessary, adjust the resulting value so that it can be represented to the desired accuracy. Ledger values are limited to 15 decimal digits of precision, according to the XRP Ledger's [issued currency format](currency-formats.html#issued-currency-precision).


## Interest-Bearing Currency Code Format

Rather than using the [standard currency code format](currency-formats.html#currency-codes), currencies that have positive interest or negative interest (demurrage) use a 160-bit currency code in the following format:

![Demurraging Currency Code Format](img/demurrage-currency-code-format.png)

1. The first 8 bits must be `0x01`.
2. The next 24 bits represent 3 characters of ASCII.
    This is expected to be an ISO 4217 code. It supports the same characters as the standard format's ASCII characters.
3. The next 24 bits MUST be all `0`s.
4. The next 64 bits are the interest rate of the currency, represented as "[e-folding time](http://en.wikipedia.org/wiki/E-folding)" in an IEEE 754 double format.
5. The next 24 bits are reserved and should be all `0`s.

### Calculating e-folding Time

To convert between ledger amounts and display amounts, or to calculate a currency code for an interest-bearing/demurraging currency, you need the interest rate as an "e-folding time". The e-folding time is the amount of time it takes a quantity to increase by a factor of _e_ (Euler's number). By convention, e-folding time is written as the letter **τ** in formulas.

To calculate an e-folding time for a given rate of annual percent interest:

1. Add the interest rate to 100% to get the percentage of the initial amount present after applying annual interest. For demurrage, use a negative interest rate. For example, 0.5% demurrage would be an interest rate of -0.5%, resulting in **99.5%** remaining.
2. Represent the percentage as a decimal. For example, 99.5% becomes **0.995**.
3. Take the natural log of that number. For example, **ln(0.995) = -0.005012541823544286**. (This number is positive if the initial interest rate was positive, and negative if the interest rate was negative.)
4. Take the number of seconds in one year (31536000) and divide by the natural log result from the previous step. For example, **31536000 ÷ -0.005012541823544286 = -6291418827.045599**. This result is the e-folding time in seconds.

**Note:** By convention, the XRP Ledger's interest/demurrage rules use a fixed number of seconds per year (31536000), which is not adjusted for leap days or leap seconds.

## Client Support

To support interest-bearing and demurraging currencies, client applications must implement several features:

- When displaying the amount of a demurraging currency retrieved from ledger or transaction data, the client must convert from the ledger value to the display value. (With demurrage, the display values are smaller than the ledger values.)

- When accepting input for a demurraging currency, the client must convert amounts from a display format to the ledger format. (With demurrage, the ledger values are are larger than the user input value.) The client must use the ledger value when creating payments, offers, and other types of transaction.

- Clients must distinguish between currencies that do and do not have interest or demurrage, and among currencies that have different rates of interest or demurrage. Clients should be able to parse the [Interest-Bearing Currency Code Format](#interest-bearing-currency-code-format) into a display such as "XAU (-0.5% pa)".

### ripple-lib Support

Demurrage was supported in ripple-lib versions **0.7.37** through **0.12.9**. Demurrage is ***not supported*** in [RippleAPI](rippleapi-reference.html).

The following code samples demonstrate how to use compatible versions of ripple-lib to convert between ledger values and display values. Also see the [Ripple Demurrage Calculator](https://ripple.github.io/ripple-demurrage-tool/).

To convert from a display value to a ledger value, use `Amount.from_human()`:

```js
// create an Amount object for the display amount of the demurring currency
// and pass in a reference_date that represents the current date
// (in this case, ledger value 10 XAU with 0.5% annual demurrage,
//  at 2017-11-04T00:07:50Z.)
var demAmount = ripple.Amount.from_human('10 0158415500000000C1F76FF6ECB0BAC600000000',
                                  {reference_date:563069270});

// set the issuer
demAmount.set_issuer("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");

// get the JSON format for the ledger amount
console.log(demAmount.to_json());

// { "value": "10.93625123082769",
//   "currency": "0158415500000000C1F76FF6ECB0BAC600000000",
//   "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" }
```

To convert from a ledger value to a display value:

```js
// create an Amount object with the ledger value,
ledgerAmount = ripple.Amount.from_json({
  "currency": "015841551A748AD2C1F76FF6ECB0CCCD00000000",
  "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  "value": "10.93625123082769"})

// apply interest up to the current time to get the display amount
var displayAmount = demAmount.applyInterest(new Date());

console.log(displayAmount.to_json());

// { "value": "9.999998874657716",
//   "currency": "0158415500000000C1F76FF6ECB0BAC600000000",
//   "issuer": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" }
```

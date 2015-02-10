Demurrage in Ripple Currencies
==============================

[Demurrage](http://en.wikipedia.org/wiki/Demurrage_%28currency%29) is a
negative interest rate on assets held that represents the cost of
holding those assets. Ripple supports currencies that have interest or 
demurrage rates built into the currency definition, such as 
"XAU (-0.5%pa)". Each currency-rate combination is treated as a completely
distinct currency for purposes of pathfinding and order books.

A gateway that wants to charge demurrage for holding assets (such as 
gold) can issue a custom currency representing that asset with the 
demurrage rate built-in. This is reflected in a different hex 
representation for the demurraging currency. Client applications should 
represent a demurraging currency by displaying the negative annual 
percentage rate along with the currency code. 

XRP cannot have demurrage or interest.

Dealing with Demurraging Currencies
-----------------------------------

The rippled server, and consequently the official global ledger, do not
track changes in value due to demurrage in the balance of funds. This
allows demurrage costs to be applied continuously, instead of operating
on fixed intervals. It also prevents demurrage from inflicting
significant additional computational and storage load for servers that
are part of the network. Instead, the fact that particular holdings are
subject to demurrage is tracked in the ledger by virtue of the custom
currency codes. Demurrage is calculated on the entire currency as if it
were interest, according to the following formula:

D = A \* ( e \^ (t/ τ) )

where:

-   D is the amount after demurrage
-   A is the pre-demurrage amount as recorded in the global ledger
-   e is Euler's number
-   t is the number of seconds since the [Ripple
    Epoch](rippled-apis.html#specifying-time) (0:00 on January 1, 2000
    UTC)
-   τ is the [e-folding time](http://en.wikipedia.org/wiki/E-folding) in
    seconds. This value is calculated from the desired interest rate.

You can think of demurrage in the Ripple Network as similar to
inflation, where the value of all assets affected by it decreases over
time, but the ledger always holds amounts in year-2000 values. (This
representation was chosen as a simplification of the more complicated
representation where individual holdings could track when the demurrage
on them started accruing, because this way it becomes easier to
recognize, exchange, and represent assets with demurrage applied.) Keep
in mind, this does not reflect actual, real-world inflation: instead,
it's hypothetical inflation at a constant rate.

### Calculating e-folding time

It is simple to calculate from a targeted demurrage rate in annual
percent to get a τ value to use in calculating demurrage:

1.  First, subtract the demurrage percentage rate from 100% to get the
    percentage of initial amount that remains after annual demurrage.
    Represent it as a decimal. For example, for 0.5% annual interest,
    you would get 0.995
2.  Now, take the natural log of that number. For example, ln(0.995).
    For traditional demurrage (decrease in value over time), this value
    will be negative.
3.  Finally, take the number of seconds in one year (31536000) and
    divide by the result of the natural log operation. The result is
    your e-folding time in seconds, for example -6291418827.045599

If you're curious: Since an e-folding amount represents how long until
an investment increases e times, a negative interest rate means that the
investment would have been worth e times its value that amount of time
in the past. Alternatively, it means that after that amount of seconds,
the investment will be worth 1/e of what it used to be.

### Canonical Calculations

For purposes of calculating demurrage consistently across applications,
the precision used is important. Our canonical source of demurrage
calculations is ripple-lib. By following these specifications, you
should be able to reproduce the demurrage results from ripple-lib
exactly:

First, recall the canonical formula for demurrage:

D = A \* ( e \^ (t/ τ) )

where D is the post-demurrage amount, and A is the pre-demurrage amount.
For the remainder of the formula, e \^ (t/ τ), we call this the
"demurrage coefficient". The demurrage coefficient is always relative to
a specific time, such that demurrage is calculated for the period
starting at the beginning of the Ripple Epoch (00:00:00 January 1, 2000)

The two directional calculations can therefore be simplified to:

1.  Find the demurrage coefficient for the reference time
2.  Apply it to the amount to convert
    1.  To convert ledger values to display values, multiply by the
        demurrage coefficient
    2.  To convert display values to ledger values, divide by the
        demurrage coefficient

3.  Make sure that the converted value can be represented to the desired
    accuracy. For example, ledger values submitted to Ripple must fit in
    Ripple's [internal format](https://wiki.ripple.com/Currency_format).

For more information on the necessary precision:

The demurrage coefficient should be calculated entirely in [64-bit
IEEE754
doubles](http://en.wikipedia.org/wiki/Double-precision_floating-point_format),
such as the number types native to Javascript, or the float type
available in Python. However, there are some additional notes:

-   For purposes of demurrage, one year is defined as exactly 31536000
    seconds. This is exactly 365 days, with no adjustments for leap days
    or leap seconds.
-   The reference time should be specified in seconds, as an integer. If
    your clock provides a higher resolution, you should truncate the
    reference time to seconds before using it.

Client Applications
-------------------

In order to accurately convey amounts in present-day terms, client
applications must adjust for demurrage. This means a few things:

-   When representing the value of a demurraging currency, the display
    value should be adjusted to the "post-demurrage" values. (This
    generally means that display values will be lower than the ledger
    values.)
-   When making offers or transactions in a demurraging currency,
    amounts entered by the user should be adjusted upward, to interpret
    user input as post-demurrage numbers. (This generally means that
    amounts written into offers are higher than the user input value)

Client applications must also make sure to distinguish between
currencies with differing amounts of demurrage, and to display the
correct demurrage rates for all currencies with such rates. Currently,
the only Ripple Labs-created client that supports demurrage is Ripple
Trade.

### ripple-lib support

Clients that are built from
[ripple-lib](https://github.com/ripple/ripple-lib) can pass a
`reference_date` as an option to the Amount.from\_human function to
account for demurrage. This function can automatically convert a
human-input number to the necessary amount to hold on the ledger to
represent that value in at a given time. (The amount that is sent to the
rippled server is the hypothetical amount one would have needed in order
to have the desired amount after enduring constant demurrage since the
Ripple Epoch.)

For example, if you're using javascript, you can use ripple-lib utility
to calculate this manually:

```
    // create an Amount object for an amount of the demurring currency, in this case 10
    // pass in a reference_date that represents today, 
    // which will calculate how much you will need to represent the requested amount for today
    var demAmount = Amount.from_human('10 0158415500000000C1F76FF6ECB0BAC600000000', {reference_date:459990264});

    // set the issuer -- optional
    demAmount.set_issuer("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");

    // get the json format that can be used as TakerPays or TakerGets in the order creation
    console.log(demAmount.to_json());

    // this will output an Amount with ~10.75 as the value for XAU, which is what is needed to create an
    // effective order today for 10 XAU
```


To calculate how much a given amount has demurred up to today:

```
    // create a new Amount object
    var demAmount = Amount.from_json('10/015841551A748AD2C1F76FF6ECB0CCCD00000000/rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh');
    
    // apply interest
    demAmount = demAmount.applyInterest(new Date());

    // get the current amount:
    console.log(demAmount.to_json());

Where Does Demurrage Go?
------------------------

To put it simply, the value that depreciates due to demurrage becomes
the property of the gateway issuing the currency. This means that, when
someone holding a balance of currency goes to redeem that currency from
the Gateway, the amount they get is the post-demurrage amount (the
"display amount") relative to the current moment in time.

Note that, when the Gateway issues currency with demurrage, it must also
adjust the values it issues, so that the amount sent to the rippled
server and written in the ledger is already adjusted for demurrage up to
the point in time it was issued.

Demurrage and Money-Making Offers
---------------------------------

Demurrage ensures that particular currencies "drift" in value slowly
over time, so that the same amount on the ledger is worth increasingly
less over time when redeemed. (A balance will never go negative, but it
will get closer and closer to zero value.) However, offers are not
automatically updated to compensate for demurrage that accumulated in
the time since the offer was made. This means that, if you are making an
offer to buy a demurraging currency, you must occasionally adjust your
offer to ask for higher ledger amounts to get the same post-demurrage
actual value. However, we expect this to be a complete non-issue because
the relative value of currencies (especially pseudo-currency commodities
such as precious metals) fluctuates much faster than typical rates of
demurrage.

Since Ripple client applications already adjust for demurrage when
taking human inputs to make an offer, most users will not have to do
anything different when making offers.

Currency Format Details
-----------------------

Currency with demurrage or interest is represented as a 160-bit value
that begins with the value `0x01`. This sets it apart from hashes (which
are always `0x80` or higher) as well as standard currency (`0x00`) and
other currency types we may define in the future (`0x02-0x7F`).
Demurraging currency has the following format:

    01 __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __
       CURCODE- DATE------- RATE------------------- RESERVED---

-   CURCODE is the 3-byte currency code, such as "USD"
-   DATE is no longer used, and should always be 0.
-   RATE is the e-folding time, formatted as an IEEE Double, represented
    in hex. For example, -6291418827.045599 becomes "C1F76FF6ECB0BAC6".
-   RESERVED is reserved for future use. It should always be given as 0,
    but other values should be accepted for forward-compatibility.


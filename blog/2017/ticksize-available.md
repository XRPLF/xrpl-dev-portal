---
date: 2017-02-22
category: 2017
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# TickSize is Now Available

As [predicted previously](https://developers.ripple.com/blog/2017/ticksize-3days.html), the TickSize amendment became available on the Ripple Consensus Ledger yesterday afternoon (PST) in ledger 27841793 ([2017-02-21T23:02:52Z](https://xrpcharts.ripple.com/#/transactions/A12430E470BE5C846759EAE3C442FF03374D5D73ECE5815CF4906894B769565E)).

The amendment changes the way RCL offers are ranked in order books, so that currency issuers can configure how many significant digits are taken into account when ranking offers by exchange rate.


## Action Required

1. **If you operate a `rippled` server and accept secure client connections**, then you should upgrade to version 0.50.2 immediately. If you operate a `rippled` server but do not accept secure client connections, then you should upgrade to version 0.50.0 or higher immediately.

2. **If you issue currency on the RCL**, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to determine what tick size is appropriate for your issuing asset. If you take no action, your issued currency can still be traded using the default tick size of 15 significant digits, but Ripple strongly recommends setting a tick size between four and eight digits to provide faster price discovery and to decrease churn in the RCL order books for your currency. Ripple also recommends publishing your tick size policy to users.

3. **If you trade on the RCL** and have algorithmic trading bots, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to update your trading system to check the tick size for a given issuer.

4. **If you have backend software** which constructs and submits transactions related to the issuing of assets on the Ripple Consensus Ledger, then please review [documentation](https://ripple.com/build/transactions/#offer-preference) for the TickSize amendment to adapt your software for correct usage.


## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.50.0 or higher, immediately, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments


## Learn More

For more information, see the following documentation:

- [TickSize Voting Announcement](https://developers.ripple.com/blog/2017/ticksize-voting.html) - Introduction to TickSize and recommendations for how to use it.
- [Offer Preference](https://ripple.com/build/transactions/#offer-preference) - How offers are ranked with and without TickSize.
- [AccountSet transaction](https://ripple.com/build/transactions/#accountset) - How to configure a TickSize.

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group: <https://groups.google.com/forum/#!forum/ripple-server>

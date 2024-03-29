---
date: 2016-07-19
category: 2016
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# TrustSetAuth is Now Available

As [predicted previously](https://developers.ripple.com/blog/2016/trustsetauth-reminder.html), TrustSetAuth became available on the Ripple Consensus Ledger this afternoon (PDT) in ledger 22,721,281 ([2016-07-19T15:10](https://xrpcharts.ripple.com/#/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF)).

This amendment allows pre-authorization of accounting relationships (zero-balance trust lines) when using Authorized Accounts.

## Action Required

To remain operational, all `rippled` instances running on a version earlier than 0.31.0 must be [upgraded](https://ripple.com/build/rippled-setup/#updating-rippled) to `rippled` server **[version 0.32.0](https://developers.ripple.com/blog/2016/rippled-0.32.0.html)** immediately.

See [Updating `rippled`](https://ripple.com/build/rippled-setup/#updating-rippled) for more information about upgrading `rippled`.

## Impact of Not Upgrading

If you operate a `rippled` server on a version earlier than 0.31.0 but do not upgrade to version 0.32.0 immediately, then your server will not be able to synchronize with the rest of the upgraded network.

## Why is the TrustSetAuth Amendment Important?

With this amendment enabled, currency issuers can authorize other addresses to hold their issued currencies without waiting for the counterparty to take action. Without the amendment enabled, currency issuers cannot authorize other addresses to hold their issued currencies unless the currency holder first creates an accounting relationship with the currency issuer and sets a limit with a TrustSet transaction.

## Learn More

For more information, please see the TrustSetAuth documentation in the [Ripple Developer Portal](https://ripple.com/build/):

* [Authorized Accounts](https://ripple.com/build/gateway-guide/#authorized-accounts)

* [Amendments](https://ripple.com/build/amendments/#trustsetauth)

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group: https://groups.google.com/forum/#!forum/ripple-server

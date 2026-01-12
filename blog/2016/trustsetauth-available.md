---
date: '2016-07-19'
template: '../../@theme/templates/blogpost'
category: 2016
labels:
  - Amendments
markdown:
  editPage:
    hide: true
---

# TrustSetAuth is Now Available

As [predicted previously](/blog/2016/trustsetauth-reminder.md), TrustSetAuth became available on the Ripple Consensus Ledger this afternoon (PDT) in ledger 22,721,281 ([2016-07-19T15:10](https://xrpcharts.ripple.com/#/transactions/0E589DE43C38AED63B64FF3DA87D349A038F1821212D370E403EB304C76D70DF)).

This amendment allows pre-authorization of accounting relationships (zero-balance trust lines) when using Authorized Accounts.

## Action Required

To remain operational, all `rippled` instances running on a version earlier than 0.31.0 must be [upgraded](/docs/infrastructure/installation/update-rippled-automatically-on-linux) to `rippled` server **[version 0.32.0](/blog/2016/rippled-0.32.0.md)** immediately.

See [Updating `rippled`](/docs/infrastructure/installation/update-rippled-automatically-on-linux) for more information about upgrading `rippled`.

## Impact of Not Upgrading

If you operate a `rippled` server on a version earlier than 0.31.0 but do not upgrade to version 0.32.0 immediately, then your server will not be able to synchronize with the rest of the upgraded network.

## Why is the TrustSetAuth Amendment Important?

With this amendment enabled, currency issuers can authorize other addresses to hold their issued currencies without waiting for the counterparty to take action. Without the amendment enabled, currency issuers cannot authorize other addresses to hold their issued currencies unless the currency holder first creates an accounting relationship with the currency issuer and sets a limit with a TrustSet transaction.

## Learn More

For more information, please see the following documentation:

- [Authorized Trust Lines](/docs/concepts/tokens/fungible-tokens/authorized-trust-lines)

- [TrustSetAuth Amendment](/resources/known-amendments.md#trustsetauth)

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group: https://groups.google.com/forum/#!forum/ripple-server

---
date: '2016-07-12'
template: '../../@theme/templates/blogpost'
category: 2016
labels:
  - Amendments
markdown:
  editPage:
    hide: true
---

# TrustSetAuth Will Soon Be Available

This notice is for all validator operators, and may be useful for gateways that utilize the Authorized Accounts feature.

A majority of trusted validators voted to enable the TrustSetAuth amendment, which is scheduled to become active on the protocol on Tuesday, 2016-07-19. This amendment allows pre-authorization of accounting relationships (zero-balance trust lines) when using Authorized Accounts.

With this amendment enabled, currency issuers can authorize other addresses to hold their issued currencies without waiting for the other addresses to take action. Without the amendment, currency holders must first create the accounting relationship with the issuer by setting a limit with a TrustSet transaction.

## Action Required

To remain operational, all `rippled` instances running on the version below 0.31.0 must be upgraded to `rippled` server **[version 0.32.0](/blog/2016/rippled-0.32.0.md)** by Tuesday, 2016-07-19.

## Impact of Not Upgrading

If you operate a `rippled` server on a version below 0.31.0 but do not upgrade to [version 0.32.0](/blog/2016/rippled-0.32.0.md) by Tuesday, 2016-07-19, then your server will not be able to synchronize with the rest of the upgraded network.

## Learn More

For more information, please see the documentation in the Ripple Developer Portal:

- [Upgrading `rippled`](/docs/infrastructure/installation/update-rippled-automatically-on-linux)
- [Authorized Trust Lines](/docs/concepts/tokens/fungible-tokens/authorized-trust-lines)
- [TrustSetAuth Amendment](/resources/known-amendments.md#trustsetauth)

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group: <https://groups.google.com/forum/#!forum/ripple-server>

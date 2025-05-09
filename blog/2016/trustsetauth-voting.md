---
date: "2016-07-05"
template: '../../@theme/templates/blogpost'
category: 2016
labels:
    - Amendments
markdown:
    editPage:
        hide: true
---
# The TrustSetAuth Amendment Is Open For Voting #

This notice is for all validator operators, and may be relevant to gateways that utilize the Authorized Account feature.

The new **TrustSetAuth** amendment is open for voting now. This amendment allows pre-authorization of accounting relationships (zero-balance trust lines) when using _Authorized Trust Lines_. With this amendment enabled, currency issuers can authorize other addresses to hold their issued currencies without waiting for the other addresses to take action. Without the amendment, currency holders must first create the accounting relationship with the issuer by setting a limit with a [TrustSet transaction](/docs/references/protocol/transactions/types/trustset).

Ripple's validators will vote in favor of the TrustSetAuth amendment, and we expect the new feature to become active by 2016-07-19.

For more information, see the following articles:

* [Authorized Trust Lines](/docs/concepts/tokens/fungible-tokens/authorized-trust-lines)
* [TrustSetAuth Amendment](/resources/known-amendments.md#trustsetauth)

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group:

<https://groups.google.com/forum/#!forum/ripple-server>

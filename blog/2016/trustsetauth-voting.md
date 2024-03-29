---
date: 2016-07-05
category: 2016
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# The TrustSetAuth Amendment Is Open For Voting #

This notice is for all validator operators, and may be relevant to gateways that utilize the Authorized Account feature.

The new [TrustSetAuth amendment](https://ripple.com/build/amendments/#trustsetauth) is open for voting now. This amendment allows pre-authorization of accounting relationships (zero-balance trust lines) when using [Authorized Accounts](https://ripple.com/build/gateway-guide/#authorized-accounts). With this amendment enabled, currency issuers can authorize other addresses to hold their issued currencies without waiting for the other addresses to take action. Without the amendment, currency holders must first create the accounting relationship with the issuer by setting a limit with a [TrustSet transaction](https://ripple.com/build/transactions/#trustset).

Ripple's validators will vote in favor of the TrustSetAuth amendment, and we expect the new feature to become active by 2016-07-19.

For more information, see the following articles in the Ripple Developer Center:

* Authorized Accounts: <https://ripple.com/build/gateway-guide/#authorized-accounts>
* Amendments: <https://ripple.com/build/amendments/>

To continue receiving updates about the rippled server, please subscribe to the Ripple Server Google Group:

<https://groups.google.com/forum/#!forum/ripple-server>

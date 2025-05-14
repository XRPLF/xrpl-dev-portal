---
date: "2016-10-24"
template: '../../@theme/templates/blogpost'
labels:
    - Amendments
category: 2016
markdown:
    editPage:
        hide: true
---
# The Flow Amendment is Now Available

The Flow Amendment became available on the Ripple Consensus Ledger in ledger 24,970,753 [(2016-10-21T19:47:22Z)](https://livenet.xrpl.org/transactions/C06CE3CABA3907389E4DD296C5F31C73B1548CC20BD7B83416C78CD7D4CD38FC).

This amendment replaces the payment processing engine with a more robust and efficient rewrite called the Flow engine. The new payments engine adds no new features, but improves efficiency and robustness in payment handling.


## Action Required

**If you operate a `rippled` server, then you should upgrade to version 0.33.0 or later, immediately, for service continuity.**

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.33.0 or later, immediately, then your server will become [amendment blocked](/docs/concepts/networks-and-servers/amendments#amendment-blocked-servers), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](/docs/infrastructure/installation/update-rippled-automatically-on-linux).

For other platforms, please [compile version 0.33.0 from source](https://github.com/XRPLF/rippled/tree/0.33.0/Builds).

## Learn, ask questions, and discuss
Related documentation is available in the Ripple Developer Portal, including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum _(Shut down. Formerly `forum.ripple.com`)_
* The Ripple Dev Blog _(Replaced with [xrpl.org/blog](https://xrpl.org/blog/))_
* Ripple Technical Services: <support@ripple.com>
* XRP Chat _(Shut down. Formerly `www.xrpchat.com`)_

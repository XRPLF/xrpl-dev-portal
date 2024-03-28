---
date: 2016-10-07
labels:
    - Amendments
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# The Flow Amendment is Open for Voting

Originally introduced in `rippled` [version 0.32.1](https://developers.ripple.com/blog/2016/rippled-0.32.1.html), but later [vetoed](https://developers.ripple.com/blog/2016/flowv2-vetoed.html) after a flaw was discovered in the code while testing, the new [Flow Amendment](https://ripple.com/build/amendments/#flow) is now open for voting. This amendment replaces the payment processing engine with a more robust and efficient rewrite called the Flow engine. The new payments engine adds no new features, but improves efficiency and robustness in payment handling.


## Action Required

**If you operate a `rippled` server, then you should upgrade to version 0.33.0 by Thursday, 2016-10-20, for service continuity.**

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.33.0 by Thursday, 2016-10-20, when Flow is expected to be enabled via Amendment, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments

If the Flow amendment is vetoed or does not pass, then your server will not become amendment blocked and should continue to operate.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

For other platforms, please [compile version 0.33.0-hf1 from source](https://github.com/ripple/rippled/tree/master/Builds).

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)

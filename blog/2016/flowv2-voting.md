---
date: 2016-08-10
labels:
    - Amendments
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# The FlowV2 Amendment is Open for Voting

The [FlowV2 Amendment](https://ripple.com/build/amendments/#flowv2) is now open for voting. This amendment replaces the payment processing engine with a more robust and efficient rewrite called the FlowV2 engine. The new version of the payment processing engine is intended to follow the same rules as the old engine. However, the new engine occasionally produces different results due to floating point rounding.

The FlowV2 Engine also makes it easier to improve and expand the payment engine with further Amendments. Ripple’s validators will vote in favor of the FlowV2 amendment. We expect the new feature to become active on Wednesday, 2016-08-24.

## Actions Required

If you operate a `rippled` server, you should upgrade to version 0.32.1 by Wednesday, 2016-08-24 for the best performance.

**Note:** A previous version of this post incorrectly stated that backend software must be updated to construct transactions for the new payment processing engine. The process of creating and submitting transactions for the FlowV2 payment engine is the same as for the previous payment engine.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.32.1 by Wednesday, 2016-08-24 (when FlowV2 is expected to become available via Amendment) then your server will become "amendment blocked" and unable to process transactions or evaluate the validity of ledgers.

For instruction on updating `rippled` on supported platforms, see: <https://ripple.com/build/rippled-setup/#updating-rippled>

For other platforms, please compile version 0.32.1 from source. For details, see <https://github.com/ripple/rippled/tree/master/Builds>

## Learn, Ask Questions, and Discuss

Related documentation is available in the Ripple Developer Portal, including detailed example API calls and web tools for API testing: <https://ripple.com/build/>

## Other Resources

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* The Ripple Dev Blog: <https://developers.ripple.com/blog/>
* Ripple Technical Services: support@ripple.com
* XRP Chat: <http://www.xrpchat.com>

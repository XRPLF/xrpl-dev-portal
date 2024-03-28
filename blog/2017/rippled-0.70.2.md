---
date: 2017-09-21
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.70.2

The `rippled` team has released `rippled` version 0.70.2, which corrects an emergent behavior that resulted in high transaction costs and fewer transactions in validated ledgers over the past few days. The problematic behavior involved large numbers of transactions being stuck in different `rippled` instances' open ledgers without being consistently relayed to validators. The large number of "stuck" transactions filled the transaction queue and caused a dramatic increase in the open ledger cost.

There are no new features in the 0.70.2 release.

## Action Required

**If you operate a `rippled` server, then you should upgrade to 0.70.2 immediately.**

## Impact of Not Upgrading

If you operate a `rippled` server, but do not upgrade to `rippled` version 0.70.2, then your `rippled` server could see inconsistent transaction relaying as well as transactions getting stuck in the open ledger without being passed on to validators. In this case, your server may report very high transaction costs and brimming transaction queues.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The SHA-256 for the RPM is: b41f3d75bb0fcf67dcd3cd14fbf1a7029ce28442b6dcd19fff7df330c35ee3e7

The SHA-256 for the source RPM is: 8cae27e639ef57987238c7800127288857c6caa61d15342faf781749ce9ee7ff

For other platforms, please [compile version 0.70.2 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

```
commit cd2d52acdcb4c58cbb5ca3f9a025a826c65f99aa
Author: Edward Hennis <ed@ripple.com>
Date:   Tue Sep 19 14:26:06 2017 -0400

    Set version to 0.70.2
```

## 0.70.2 Change Log

## Bug Fixes

* Recover old open ledger transactions to the queue [(#2231)](https://github.com/ripple/rippled/pull/2231)

## Network Update

The Ripple operations team plans to deploy version 0.70.2 to all `rippled` servers under its operational control, including private clusters, starting at 4:00 PM PT on Thursday, 2017-09-21. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

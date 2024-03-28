---
date: 2018-04-09
category: 2018
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# The DepositAuth & fix1513 Amendments are Now Available

The [DepositAuth](https://ripple.com/build/deposit-authorization/) & fix1513 Amendments became available on the XRP Ledger in ledger sequence number 37,753,345 [(2018-04-06T01:44:42Z)](https://xrpcharts.ripple.com/#/transactions/902C51270B918B40CD23A622E18D48B4ABB86F0FF4E84D72D9E1907BF3BD4B25).

* The DepositAuth Amendment lets an account strictly reject any incoming money from transactions sent by other accounts.
* The fix1513 Amendment fixes an issue where calculation switchovers were not implemented in the fee escalation queue.

## Action Required

**If you operate a `rippled` server**, then you should upgrade to `rippled` version 0.90.1 immediately for service continuity.

## Impact of Not Upgrading

**If you operate a `rippled` server older than version 0.90.0**, your server is amendment blocked. A server that is amendment blocked:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If you are using `rippled` version 0.90.0, your server is not amendment blocked but you should upgrade to [`rippled` version **0.90.1**](https://developers.ripple.com/blog/2018/rippled-0.90.1.html) or higher to get important security fixes. `rippled` version 0.90.0 may stop or restart unexpectedly.

For instructions on updating rippled on supported platforms, see [Updating rippled on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

For other platforms, please compile version 0.90.1 from source. See [the `rippled` GitHub repo](https://github.com/ripple/rippled/tree/develop/Builds) for instructions by platform. For instructions building `rippled` from source on Ubuntu Linux, see [Build and Run `rippled` on Ubuntu](https://ripple.com/build/build-run-rippled-ubuntu/).

## Upcoming Features

The [previously announced](https://developers.ripple.com/blog/2018/rippled-0.90.0.html) Checks amendment has lost the support of a majority of trusted validators and is not expected to become enabled in the immediate future.

## Learn, ask questions, and discuss

Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

To continue receiving updates about the `rippled` server, please subscribe to the Ripple Server Google Group: <https://groups.google.com/forum/#!forum/ripple-server>

Other resources:

- The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
- [The Ripple Dev Blog](https://developers.ripple.com/blog/)
- Ripple Technical Services: <support@ripple.com>
- [XRP Chat](http://www.xrpchat.com/)

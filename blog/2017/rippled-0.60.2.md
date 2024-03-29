---
date: 2017-03-30
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.60.2

The `rippled` team has released `rippled` version 0.60.2, which further strengthens handling of cases associated with a [previously patched exploit](https://developers.ripple.com/blog/2017/rippled-0.50.3.html), in which `NoRipple` flags were being bypassed by using offers. Ripple requires upgrading to `rippled` version 0.60.2 immediately. There are no new features in the 0.60.2 release. **Note**: This does not affect XRP transactions.

Ripple will be following up with a postmortem, explaining the previosuly patched exploit, the timeline of events and the actions taken in more detail at a later date.

## Action Required

**If you operate a rippled server**, then you must upgrade to 0.60.2 immediately.

**If you are an individual user**, then you should have the `NoRipple` flag enabled by default and set the trust line limit to zero on gateways that you do not trust.

**If you are an individual user**, and you do not have the `NoRipple` flag enabled, and you discover a negative balance owed to an unknown account, then you should [freeze](https://ripple.com/build/freeze/#individual-freeze) that individual trust line.


## Impact of Not Upgrading

**If you operate a rippled server**, but do not upgrade to `rippled` version 0.60.2, then your server may lose sync with Ripple operated validators more frequently.

**If you operate a rippled validating server**, but do not upgrade to `rippled` version 0.60.2, which prevents `NoRipple` flags from being bypassed by using offers, then your server will validate some transactions in a payment path that bypass the blocking effect of the `NoRipple` flag using offers.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the RPM is: 3dc7412bda8986188164f0ff70ff80c351b17521e6943a876d5d3268fa07289d

The sha256 for the source RPM is: f189ba1a8ae2201da47008ff50d027dcf719c7001c9b350b6759db279cbb48c8

For other platforms, please [compile version 0.60.2 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

        commit 7cd4d7889779e6418270c8af89386194efbef24b
        Author: seelabs <scott.determan@yahoo.com>
        Date:   Thu Mar 30 14:25:41 2017 -0400

        	Set version to 0.60.2


## Bug Fixes

Prevent the ability to bypass `NoRipple` flags using offers [(#7cd4d78)](https://github.com/ripple/rippled/commit/4ff40d4954dfaa237c8b708c2126cb39566776da)

## Network Update

The Ripple technical operations team plans to deploy `rippled` version 0.60.2 to all `rippled` servers under its operational control, including private clusters, starting at 2:00 PM PDT on Thursday, 2017-03-30. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.


## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)

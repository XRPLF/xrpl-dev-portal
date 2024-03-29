---
date: 2016-07-29
labels:
    - Release Notes
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.32.1

Ripple is proud to announce the release of `rippled` version 0.32.1, which introduces several enhancements that improve the reliability and scalability of the Ripple Consensus Ledger. Ripple recommends that all server operators upgrade to version 0.32.1 by Wednesday, 2016-08-24, for the best performance.

Highlights of this release include:

* A new, optional WebSocket implementation based on [Beast](https://github.com/vinniefalco/Beast). See below for details.
* An improved version of the payment code, which we expect to be available via an [Amendment named "FlowV2"](https://ripple.com/build/amendments/#flowv2) on Wednesday, 2016-08-24. See below for details.

## Actions Required

1. If you operate a `rippled` server, you should upgrade to version 0.32.1 by Wednesday, 2016-08-24, for the best performance.
2. If you have backend software which constructs and submits transactions to the Ripple network, you need to adapt it to correctly use the network’s new payment engine.

## Impact of Not Upgrading
If you operate a rippled server but don’t upgrade to version 0.32.1 by Wednesday, 2016-08-24, when FlowV2 is expected to become available via Amendment, then your server might lose synchronization with the rest of the upgraded network for brief periods of time. That is, the local view of ledgers may be slightly behind the rest of the network. Any rippled server operator running versions prior to 0.32.1, will also become amendment blocked.

For supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The md5sum for the rpm is: 5dcdcef01f3cfc452b0b503eaaeb07bb

The md5sum for the source rpm is: 3180fca1e83001307346f85628823a9c

For other platforms, please [compile version 0.32.1 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

    commit 1ff972fbd3b82f0f7062f05f64f1abd5e274a7bc
    Author: Nik Bougalis <nikb@bougalis.net>
    Date:   Fri Jul 29 12:52:26 2016 -0700

        Set version to 0.32.1


## Network Update
The Ripple operations team plans to deploy version 0.32.1 to all rippled servers under its operational control, including private clusters, starting at 1:00 PM PDT on Thursday, 2016-08-04. The deployment is expected to complete within 4 hours. The network will continue operating during deployment and no outage is expected.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: support@ripple.com
* [XRP Chat](http://www.xrpchat.com/)


## Full Release Notes
The `rippled` 0.32.1 release includes an improved version of the payment code, which we expect to be available via Amendment on Wednesday, 2016-08-24 with the name FlowV2, and a completely new implementation of the WebSocket protocol for serving clients.

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).

**New and Updated Features**

An improved version of the payment processing engine, which we expect to be available via Amendment on Wednesday, 2016-08-24 with the name “FlowV2”. The new payments code adds no new features, but improves efficiency and robustness in payment handling.

The FlowV2 code may occasionally produce slightly different results than the old payment processing engine due to the effects of floating point rounding. Once FlowV2 is enabled on the network then old servers without the FlowV2 amendment will lose sync more frequently because of these differences.

**Beast WebSocket**

A completely new implementation of the WebSocket protocol for serving clients is available as a configurable option for `rippled` administrators. To enable this new implementation, change the “protocol” field in `rippled.cfg` from “ws” to “ws2” (or from “wss” to “wss2” for Secure WebSockets), as illustrated in this example:

    [port_ws_public]
    port = 5006
    ip = 0.0.0.0
    protocol = wss2

The new implementation paves the way for increased reliability and future performance when submitting commands over WebSocket. The behavior and syntax of commands should be identical to the previous implementation. Please report any issues to support@ripple.com. A future version of rippled will remove the old WebSocket implementation, and use only the new one.

**Bug fixes**

Fix a non-exploitable, intermittent crash in some client pathfinding requests (RIPD-1219)

Fix a non-exploitable crash caused by a race condition in the HTTP server. (RIPD-1251)

Fix bug that could cause a previously fee queued transaction to not be relayed after being in the open ledger for an extended time without being included in a validated ledger. Fix bug that would allow an account to have more than the allowed limit of transactions in the fee queue. Fix bug that could crash debug builds in rare cases when replacing a dropped transaction. (RIPD-1200)

Remove incompatible OS X switches in Test.py (RIPD-1250)

Autofilling a transaction fee (sign / submit) with the experimental `x-queue-okay` parameter will use the user’s maximum fee if the open ledger fee is higher, improving queue position, and giving the tx more chance to succeed. (RIPD-1194)

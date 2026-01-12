---
date: '2017-03-29'
template: '../../@theme/templates/blogpost'
category: 2017
labels:
  - Release Notes
markdown:
  editPage:
    hide: true
---

# rippled version 0.60.1

The `rippled` team has released `rippled` version 0.60.1, which corrects a technical flaw that resulted from using 32-bit space identifiers instead of the protocol-defined 16-bit values for Escrow and Payment Channel ledger entries. `rippled` version 0.60.1 also fixes a problem where the websocket timeout timer would not be cancelled when certain errors occurred during subscription streams. **Ripple strongly recommends upgrading to `rippled` version 0.60.1 immediately.**

Ripple expects the [`Escrow`](/resources/known-amendments.md#escrow) and [`PayChan`](/resources/known-amendments.md#paychan) amendments to be enabled via [amendment vote](/blog/2017/escrow-paychan-fix1368-reminder.md) around 11:26 PM PDT on Thursday, 2017-03-30. There are no new features in the 0.60.1 release.

## Action Required

**If you operate a `rippled` server, then you must upgrade to 0.60.1 immediately.**

## Impact of Not Upgrading

- If you operate a `rippled` server, but do not upgrade to `rippled` version 0.60.1, then your `rippled` server will lose sync when processing Payment Channel or Escrow transactions. The `Escrow` and `PayChan` amendments are expected to be enabled via amendment vote around 11:26 PM PDT on Thursday, 2017-03-30.

- If you operate a `rippled` server, but do not upgrade to version 0.60.1, then client websocket connections to your `rippled` server may continue to disconnect during subscription streams.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](/docs/infrastructure/installation/update-rippled-automatically-on-linux).

The sha256 for the RPM is: 6714050e9d1d232e8250be434fe6a61c44f78e41adc3c2b5f49df490ee5312ef

The sha256 for the source RPM is: 5bba13e93fed160a3405315e4128e891b2bc1e439ee5f7b429294003c618f0e1

For other platforms, please [compile version 0.60.1 from source](https://github.com/XRPLF/rippled/tree/0.60.1/Builds).

The first log entry should be the change setting the version:

```text
commit 0d4fe469c6b0ba47645b53930e74248ff789fe75
Author: seelabs <scott.determan@yahoo.com>
Date:   Wed Mar 29 15:41:43 2017 -0400

        Set version to 0.60.1
```

## Bug Fixes

Fix a flaw that resulted from using 32-bit space identifiers instead of the protocol-defined 16-bit values [(#2071)](https://github.com/ripple/rippled/pull/2071)

Fix a problem where the WebSocket timeout timer would not be cancelled when certain errors occurred during subscription streams [(#2067)](https://github.com/ripple/rippled/pull/2067)

## Network Update

The Ripple technical operations team plans to deploy `rippled` version 0.60.1 to all `rippled` servers under its operational control, including private clusters, starting at 11:00 AM PDT on Thursday, 2017-03-30. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

## Learn, ask questions, and discuss

Related documentation is available in the Ripple Developer Portal, including detailed example API calls and web tools for API testing.

Other resources:

- The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
- The Ripple Dev Blog _(Replaced with [xrpl.org/blog](https://xrpl.org/blog/))_
- Ripple Technical Services: support@ripple.com
- XRP Chat _(Shut down. Formerly `www.xrpchat.com`)_

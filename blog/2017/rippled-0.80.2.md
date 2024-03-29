---
date: 2017-12-15
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 0.80.2

Ripple has released `rippled` version 0.80.2, which improves the transaction dispatch logic of `rippled`, allows for more transactions to be in flight at any one time and reduces the overall resource usage of `rippled`. The improved transaction dispatch logic ensures that a transaction is dispatched at most once every 10 seconds, even if it received from multiple peers during that interval.

The fix should also improve load accounting on peer links, reducing the number of extraneous server-server connection drops caused by redundant transaction dispatching.

Ripple strongly recommends upgrading to `rippled` version 0.80.2 immediately.


## Action Required

If you operate a `rippled` server, then you should upgrade to 0.80.2 immediately.

## Impact of Not Upgrading

* **If you operate a `rippled` server**, but do not upgrade to rippled version 0.80.2, then your `rippled` server will use more resources than necessary and may periodically drop transactions and fall out of sync with the network.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The SHA-256 for the RPM is: `a0f431a55a241770d7496b240e4d2c638f2cadd4126ee621c5ed980b8174223c`

The SHA-256 for the source RPM is: `d25bda2c384c67e48fe6c29250c07039d33c6ed5d280ad19fc246469213fe251`

For other platforms, please [compile version 0.80.2 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

```
commit d2fc4e3569d79d3cade78533f673f642a8d26845
Author: Nikolaos D. Bougalis <nikb@bougalis.net>
Date:   Thu Dec 14 15:30:20 2017 -0800

    Set version to 0.80.2
```

## Network Update
The Ripple technical operations team will deploy `rippled` version 0.80.2 to all production `rippled` servers under its operational control, on Friday, 12/15/2017.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)


## 0.80.2 Change Log

* Tune for higher transaction rate processing [(#2294)](https://github.com/ripple/rippled/pull/2294)
* Control transaction dispatch rate [(#2297)](https://github.com/ripple/rippled/pull/2297)

## 0.80.1 Change Log

The [previously-released `rippled` version 0.80.1](https://github.com/ripple/rippled/releases/tag/0.80.1) also included the following fixes and improvements:

**New and Updated Features**

- Allow including validator manifests in published list ([#2278](https://github.com/ripple/rippled/issues/2278))
- Add validator list RPC commands ([#2242](https://github.com/ripple/rippled/issues/2242))
- Support [SNI](https://en.wikipedia.org/wiki/Server_Name_Indication) when querying published list sites and use Windows system root certificates ([#2275](https://github.com/ripple/rippled/issues/2275))
- Grow TxQ expected size quickly, shrink slowly ([#2235](https://github.com/ripple/rippled/issues/2235))

**Bug Fixes**

- Make consensus quorum unreachable if validator list expires ([#2240](https://github.com/ripple/rippled/issues/2240))
- Properly use ledger hash to break ties when determing working ledger for consensus ([#2257](https://github.com/ripple/rippled/issues/2257))
- Explictly use std::deque for missing node handler in SHAMap code ([#2252](https://github.com/ripple/rippled/issues/2252))
- Verify validator token manifest matches private key ([#2268](https://github.com/ripple/rippled/issues/2268))

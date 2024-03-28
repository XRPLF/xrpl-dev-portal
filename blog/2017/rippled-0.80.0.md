---
date: 2017-10-23
category: 2017
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# rippled Version 0.80.0

Ripple has released `rippled` version 0.80.0, which introduces several enhancements that improve the reliability, scalability and security of the XRP Ledger. Ripple recommends that all `rippled` server operators upgrade to version 0.80.0 by Tuesday, 2017-11-07, for service continuity.

Highlights of this release include:

* The **SortedDirectories** amendment sorts the entries in [`DirectoryNode` ledger objects](https://ripple.com/build/ledger-format/#directorynode). It also corrects a technical flaw that could, in some edge cases, prevent an empty intermediate page from being deleted.

Ripple expects the **SortedDirectories** amendment to be enabled on Tuesday, 2017-11-07.


## Action Required

**If you operate a `rippled` server**, then you should upgrade to version 0.80.0 by Tuesday, 2017-11-07, for service continuity.

## Impact of Not Upgrading

If you operate a `rippled` server but do not upgrade to version 0.80.0 by Tuesday, 2017-11-07, when the **SortedDirectories** Amendment is expected to be activated, then your server will become [amendment blocked](https://ripple.com/build/amendments/#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If the **SortedDirectories** amendment does not get approved, then your `rippled` server will not become amendment blocked and should continue to operate.

## Action Recommended

**If you operate a `rippled` server that uses RocksDB as its data store**, then we recommend removing the RocksDB `file_size_mb` parameter from your `rippled.cfg` config file.

For instructions on updating `rippled` on supported platforms, see [Updating `rippled` on supported platforms](https://ripple.com/build/rippled-setup/#updating-rippled).

The sha256 for the rpm is: 0f67e8fdc9c555921534b6944ca418df007cee0705ab9e2fc5423963848b2935

The sha256 for the source rpm is: 9c6f5074e1ec3ce6ced27c0da243bb7ed19a32a8bedf2d68809ec37845f42c1b

For other platforms, please [compile version 0.80.0 from source](https://github.com/ripple/rippled/tree/master/Builds).

The first log entry should be the change setting the version:

```
commit cafe18c59279e7de447f25a0e00d0562d6441c7a
Author: Nik Bougalis <nikb@bougalis.net>
Date:   Thu Oct 19 14:37:27 2017 -0700

    Set version to 0.80.0
```

## Network Update
The Ripple operations team plans to deploy version 0.80.0 to all `rippled` servers under its operational control, including private clusters, starting at 2:00 PM PST on Tuesday, 2017-10-24. The deployment is expected to complete within 4 hours. The network should continue to operate during deployment and no outage is expected.

At that time, `rippled` validators under Ripple’s operational control will begin voting for the **SortedDirectories** amendment.

## Learn, ask questions, and discuss
Related documentation is available in the [Ripple Developer Portal](https://ripple.com/build/), including detailed example API calls and web tools for API testing.

Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* [The Ripple Dev Blog](https://developers.ripple.com/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat](http://www.xrpchat.com/)

## Full Release Notes

### SortedDirectories

The **SortedDirectories** amendment addresses two distinct issues: First, it corrects a technical flaw that could, in some edge cases, prevent an empty intermediate page from being deleted. Second, it sorts directory entries within a page (other than order book page entries, which remain strictly FIFO). This makes insert operations deterministic, instead of pseudo-random and reliant on temporal ordering. Lastly, it removes the ability to perform a "soft delete" where the page number of the item to delete need not be known if the item is in the first 20 pages, and enforces a maximum limit to the number of pages that a directory can span.


## Upcoming Features

The [previously announced](https://developers.ripple.com/blog/2017/rippled-0.70.0.html) FlowCross Amendment will be enabled on a future date (TBA).

We do not have an update on the [previously announced](https://developers.ripple.com/blog/2016/rippled-0.33.0.html) changes to the hash tree structure that `rippled` uses to represent a ledger, called [SHAMapV2](https://ripple.com/build/amendments/#shamapv2). At the time of activation, this amendment will require brief scheduled allowable unavailability while the changes to the hash tree structure are computed by the network. We will keep the community updated as we progress towards this date (TBA).

You can [update to the new version](https://ripple.com/build/rippled-setup/#updating-rippled) on Red Hat Enterprise Linux 7 or CentOS 7 using yum. For other platforms, please [compile the new version from source](https://github.com/ripple/rippled/tree/master/Builds).


## 0.80.0 Change Log

* Improve directory insertion and deletion [(#2165)](https://github.com/ripple/rippled/pull/2165)
* Move consensus thread safety logic from the generic implementation in Consensus into the RCL adapted version RCLConsensus [(#2106)](https://github.com/ripple/rippled/pull/2106)
* Refactor Validations class into a generic version that can be adapted [(#2084)](https://github.com/ripple/rippled/pull/2084)
* Make minimum quorum Byzantine fault tolerant [(#2093)](https://github.com/ripple/rippled/pull/2093)
* Make amendment blocked state thread-safe and simplify a constructor [(#2027)](https://github.com/ripple/rippled/pull/2207/commits/be1f734845ac763ce51d61507c9ba6cf18fc3cfb)
* Use ledger hash to break ties [(#2169)](https://github.com/ripple/rippled/pull/2169)
* Refactor RangeSet [(#2113)](https://github.com/ripple/rippled/pull/2113)
* Improvements to validation quorum calculation

## Bug Fixes

* Check and modify amendment blocked status with each new ledger [(#2137)](https://github.com/ripple/rippled/pull/2137)
* Track escrow in recipient's owner directory [(#2212)](https://github.com/ripple/rippled/pull/2212)
* Ensure consensus close times generate identical ledgers [(#2221)](https://github.com/ripple/rippled/pull/2221)
* Recover open ledger transactions to the queue [(#2232)](https://github.com/ripple/rippled/pull/2232/commits/62127d725d801641bfaa61dee7d88c95e48820c5)

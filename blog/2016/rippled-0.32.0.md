---
date: 2016-06-27
labels:
    - Release Notes
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# rippled version 0.32.0 has been released #

Ripple is proud to announce the release of `rippled` version 0.32.0. This release introduces several enhancements that improve the reliability and scalability of the Ripple Consensus Ledger. Ripple recommends that all server operators upgrade to the new version.

Highlights of this release include:

* The transaction queue now supports batching and can hold up to 10 transactions per account, allowing users to queue multiple transactions for processing when the network load is high. This encourages liquidity for XRP since important transactions now have a more reliable way of getting into the ledger. For more information, see [Queued Transactions](https://ripple.com/build/transaction-cost/#queued-transactions) in the Ripple Developer Portal.
* The `server_info` and `server_state` commands now include information on transaction cost multipliers. Customers who want to robustly submit transactions now have additional tools for accurately setting the fee based on changing network conditions. Furthermore, the `fee` command is now available to unprivileged users. For more information, see the [`rippled` API Method Reference](https://ripple.com/build/rippled-apis/#api-methods) in the Ripple Developer Portal.
* There's a new WebSocket implementation based on [Beast](https://github.com/vinniefalco/Beast). Use of this implementation is optional. A future version of `rippled` will make this WebSocket implementation the default, with the old implementation removed.

Read the complete [release notes in GitHub](https://github.com/ripple/rippled/releases/tag/0.32.0).

## Actions Required ##

1. If you operate a `rippled` server, you should upgrade to version 0.32.0 for the best performance.
2. If you have backend software which constructs and submits transactions to the Ripple network, you may need to adapt it to correctly use the network’s new transaction queue mechanism.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 0.32.0, your server might lose synchronization with the rest of the upgraded network for brief periods of time. That is, the local view of ledgers may be slightly behind the rest of the network.

For instruction on updating rippled on supported platforms, please see [Updating `rippled`](https://ripple.com/build/rippled-setup/#updating-rippled) in the Ripple Developer Center.

The md5sum for the rpm is: **1b37fd80fd869e42a715f17a9e30c81a**.
The md5sum for the source rpm is: **d43f4d371416b213d6197fb1c630cf44**.

For other platforms, please compile version 0.32.0 from source. See [`rippled` Build Instructions](https://github.com/ripple/rippled/tree/master/Builds) for details.

The first log entry should be the change setting the version:

    commit d22eb0caa25ecfbd373cc9af0347e56031a23646
    Author: seelabs <scott.determan@yahoo.com>
    Date:   Fri Jun 24 11:30:09 2016 -0400

        Set version to 0.32.0

## Network Update ##
The Ripple operations team plans to deploy version 0.32.0  to all rippled servers under its operational control, including private clusters, starting at 1:00 PM PDT on Wednesday, 2016-06-29. The deployment is expected to complete within 4 hours.

## Learn, ask questions, and discuss ##
Ripple supported documentation including detailed example API calls and web tools for API testing are located on the Ripple Developer Portal: <https://ripple.com/build/>

### Other resources: ###

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* The Ripple Dev Blog: <https://developers.ripple.com/blog/>
* Ripple Technical Services: [support@ripple.com](mailto:support@ripple.com)
* XRP Chat: <http://www.xrpchat.com/>

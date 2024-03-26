---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-11-10
labels:
    - Amendments
---
# Five Amendments Expected Soon

Several amendments to the XRP Ledger protocol are expected to become enabled on the XRP Ledger Mainnet soon. Three of these amendments fix bugs in the XRP Ledger protocol, one (NegativeUNL) improves the ability of the network to make forward progress during periods of instability, and the last one (TicketBatch) adds the ability to prepare and send transactions in a more flexible order. The details are as follows (all dates are in UTC):

- fixSTAmountCanonicalize (min version: [1.7.0](https://xrpl.org/blog/2021/rippled-1.7.0.html)) expected **2021-11-11**.
- FlowSortStrands (min version: [1.7.0](https://xrpl.org/blog/2021/rippled-1.7.0.html)) expected **2021-11-11**.
- fixRmSmallIncreasedQOffers (min version: [v1.7.2](https://xrpl.org/blog/2021/rippled-1.7.2.html)) expected **2021-11-18**.
- TicketBatch (min version: [v1.7.2](https://xrpl.org/blog/2021/rippled-1.7.2.html)) expected **2021-11-18**.
- NegativeUNL (min version: [v1.7.3](https://xrpl.org/blog/2021/rippled-1.7.3.html)) expected **2021-11-21**.

Each amendment will become enabled if it maintains support from at least 80% of trusted validators until its expected time. Operators of `rippled` servers **must** upgrade to the minimum version or higher by the time these amendments become enabled.

<!-- BREAK -->

## Action Required

If you operate an XRP Ledger (`rippled`) server, you should upgrade to **version 1.7.3** (or higher) as soon as possible, for service continuity.

**Note:** Version 1.8.0 is currently in the release candidate stage, and also supports these amendments. However, the amendments may go live before version 1.8.0 reaches full release, so you should not wait to upgrade.

No action is needed for applications and integrations with the XRP Ledger. You may want to review how [Tickets](https://xrpl.org/tickets.html) work to see if you want to use them in your software, or enable your users to use them.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to the minimum version by the time the amendments are expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If some amendments do not become enabled, then your server will not be amendment blocked as long as it meets the minimum version for any amendments that did become enabled. However, version 1.7.3 is strongly recommended because it includes important fixes for server stability and supports all four amendments.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

## Amendment Summaries

### fixSTAmountCanonicalize

This amendment fixes an edge case in [deserializing](https://xrpl.org/serialization.html) Amount-type fields. Without this amendment, in some rare cases the operation could result in otherwise valid serialized amounts overflowing during deserialization. With this amendment, the XRP Ledger detects error conditions more quickly and eliminates the problematic corner cases.


### FlowSortStrands

This amendment improves the payment engine's calculations for finding the most cost-efficient way to execute a cross-currency transaction.

Without this change, the engine simulates a payment through each possible path to calculate the quality (ratio of input to output) of each path. With this change, the engine calculates the theoretical quality of each path without simulating a full payment. With this amendment, the payment engine executes some cross-currency payments much faster, is able to find the most cost-efficient path in more cases, and can enable some payments to succeed in certain conditions where the old payment engine would fail to find enough liquidity.


### fixRmSmallIncreasedQOffers

This amendment fixes an issue where certain Offers, when almost completely consumed, have a much lower exchange rate than when they were first placed. This occurs when the remaining amounts of one or both assets are so small that they cannot be rounded to a similar ratio as when the Offer was placed.

Without this amendment, an Offer in this state blocks Offers with better rates deeper in the order book and causes some payments and Offers to fail when they could have succeeded.

With this amendment, payments and trades can remove these types of Offers the same way that transactions normally remove fully consumed or unfunded Offers.


### NegativeUNL

This amendment implements a ["Negative UNL" system](https://xrpl.org/negative-unl.html), where the network can track which validators are temporarily offline and disregard those validators for quorum calculations. This can improve the ability of the network to make progress during periods of network instability.


### TicketBatch

This amendment adds [Tickets](https://xrpl.org/tickets.html) as a way of sending transactions out of the typical sequence number order. (Standards Draft: [XLS-13d](https://github.com/XRPLF/XRPL-Standards/issues/16).) If you have an XRP Ledger account, you can create one or more Tickets, then use those Tickets to send transactions that can execute in any order. This allows for usage patterns such as preparing multiple multi-signed transactions in parallel when the process of collecting signatures can take a long time.


## Learn, ask questions, and discuss

To learn more about how the XRP Ledger's amendments system coordinates protocol upgrades, see the [Amendments article](https://xrpl.org/amendments.html).

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

For more platforms with XRP Ledger content and more ways to get involved, see the [XRPL Community Page](https://xrpl.org/contribute.html).

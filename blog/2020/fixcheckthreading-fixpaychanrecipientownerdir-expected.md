---
category: 2020
date: 2020-01-08
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Two Fix Amendments are Expected 2020-01-18

On 2020-01-03, the [fixCheckThreading](https://xrpcharts.ripple.com/#/transactions/71460CE2DB7594C25A649C042D18BC3C027910CF02C60EC7F1E77660C9CAE1D2) and [fixPayChanRecipientOwnerDir](https://xrpcharts.ripple.com/#/transactions/4F5C639512B14BC6986026A2871CBF348C6092B1D4BE2DE9EE64D0F04E1EA5F7) amendments to the XRP Ledger gained support from a majority of trusted validators. These amendments were introduced in [`rippled` v1.4.0](https://github.com/ripple/rippled/releases/tag/1.4.0). Currently, they are expected to become enabled on 2020-01-18. Each amendment that continues to have the support of at least 80% of trusted validators continuously will become enabled on the scheduled date.

## fixCheckThreading Summary

Changes the way Checks transactions affect account metadata, so that Checks are properly added to the [account](https://xrpl.org/accounts.html) history of the receiving account. (Specifically, they update the `PreviousTxnID` and `PreviousTxnLedgerSeq` fields of the receiving account's [AccountRoot object](https://xrpl.org/accountroot.html), which can be used to trace the "thread" of transactions that affected the account and the objects it owns.)

Without this amendment, Checks transactions ([CheckCreate](https://xrpl.org/checkcreate.html), [CheckCash](https://xrpl.org/checkcash.html), and [CheckCancel](https://xrpl.org/checkcancel.html)) only update the account history of the sender. With this amendment, those transactions affect both the sending and receiving accounts. This amendment has no direct effect unless the [Checks amendment](https://xrpl.org/known-amendments.html#checks) is also enabled.

By enabling this amendment in advance of the Checks amendment, the corrected behavior will apply to all Checks.

## fixPayChanRecipientOwnerDir Summary

Changes the [PaymentChannelCreate transaction](https://xrpl.org/paymentchannelcreate.html) type so that it adds new [payment channels](https://xrpl.org/payment-channels.html) to the recipient's [owner directory](https://xrpl.org/directorynode.html). Without this amendment, new payment channels are added only to the sender's owner directory; with this amendment enabled, newly-created payment channels are added to both owner directories. Existing payment channels are unchanged.

This change makes it easier to look up payment channels by their recipient and prevents accounts from being deleted if they are the recipient for open payment channels (except those channels created before this amendment).


## Action Required

- If you operate a `rippled` server, **you must upgrade to version 1.4.0 (or higher) by 2020-01-18, for service continuity.**

- If you use the XRP Ledger APIs to list payment channels, such as using the [account_channels](https://xrpl.org/account_channels.html) method, be aware that the fixPayChanRecipientOwnerDir amendment affects the results of this API. Specifically, the method will list newly-created channels for which the specified account is the recipient. Previously, this method only listed channels for which the account is the sender. (Existing payment channels for which the specified account is the recipient will continue not to appear in the results. Only new channels, created after the amendment becomes enabled, are affected.)

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.4.0 (or higher) by 2020-01-18, when the fixCheckThreading and fixPayChanRecipientOwnerDir amendments are expected to become enabled, then your server will become amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If neither amendment becomes enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The XRP Ledger Dev Blog](https://xrpl.org/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)

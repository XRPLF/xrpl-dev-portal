---
category: 2020
date: 2020-04-28
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# DeletableAccounts and Two Other Amendments Expected Soon

Three amendments to the XRP Ledger protocol currently hold support of a majority of trusted validators, and are expected to become enabled on the following dates (in UTC):

- [fixPayChanRecipientOwnerDir is expected](https://xrpcharts.ripple.com/#/transactions/2EBB6EC9C6A070EF665D482C2E725319DEB552D88B079227333A5BE452602C2A) on **2020-05-01**.
- [fixCheckThreading is expected](https://xrpcharts.ripple.com/#/transactions/413007375A2D1B213D477154375A6878AF58360E4190D339C8B43122CA366AA7) also on **2020-05-01**.
- [DeletableAccounts is expected](https://xrpcharts.ripple.com/#/transactions/592E5151BFAE5B544FF4213A4358D341EA6F394ECF738CBC740F555CEC5A6C70) on **2020-05-08**.

<!-- BREAK -->

As long as these amendments continue to have the support of at least 80% of trusted validators continuously, they will become enabled on the scheduled dates. All three amendments were introduced in [`rippled` v1.4.0](https://github.com/ripple/rippled/releases/tag/1.4.0).

## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.4.0 or higher by **2020-05-01**, for service continuity. **Version 1.5.0** is _strongly recommended_.

- The DeletableAccounts amendment changes the starting [sequence numbers](https://xrpl.org/basic-data-types.html#account-sequence) for accounts. If you have automatic processes that send transactions from newly-funded accounts, please check that the change does not break critical processes.

## Note Regarding Payment Channels

The fixPayChanRecipientOwnerDir amendment previously [gained majority support in January.](https://xrpl.org/blog/2020/fixcheckthreading-fixpaychanrecipientownerdir-expected.html) However, several trusted validators withdrew support from the amendment because it would cause [breaking changes](https://xrpl.org/blog/2020/fixcheckthreading-fixpaychanrecipientownerdir-expected.html#action-required) to the [`account_channels` API method](https://xrpl.org/account_channels.html). Version 1.5.0 of `rippled` contains a fix that makes the `account_channels` API method continue to work without breaking changes. If you use `account_channels`, be sure to upgrade to `rippled` version 1.5.0 to avoid breaking changes to the API.

## Impact of Not Upgrading

If you operate a `rippled` server but don’t upgrade to version 1.4.0 or higher by 2020-05-01, when the fixPayChanRecipientOwnerDir and fixCheckThreading amendments are expected to become enabled, then your server will become [amendment blocked](https://xrpl.org/amendments.html#amendment-blocked), meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data

If none of the amendments become enabled, then your server will not become amendment blocked and should continue to operate.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## DeletableAccounts Summary

The DeletableAccounts amendment makes it possible to delete [XRP Ledger accounts](https://xrpl.org/accounts.html).

If you have accounts on the XRP Ledger, you may be able to reclaim some of the [XRP account reserve](https://xrpl.org/reserves.html) by deleting your accounts after this amendment becomes active. Deleting an account costs 5 XRP and sends the deleted account's remaining XRP to another address. You can send the remaining XRP to another account you own, or even deposit the remaining XRP at a hosted wallet such as an exchange. (When sending to a hosted wallet, be sure to include a [destination tag](https://xrpl.org/source-and-destination-tags.html) or use an [X-address](https://xrpaddress.info/).) Not all accounts can be deleted. For the complete list of requirements, see [Deletion of Accounts](https://xrpl.org/accounts.html#deletion-of-accounts) and the [XRP Community Standards Draft 7](https://github.com/xrp-community/standards-drafts/issues/8).

With this amendment, new accounts start with their `Sequence` numbers equal to the `Sequence` number matching the [index of the ledger](https://xrpl.org/basic-data-types.html#ledger-index) in which the account is created. This change protects accounts that have been deleted from having their old transactions executed again if the same address is later re-created.

Without this amendment, new accounts always start with their `Sequence` numbers at 1, and there is no way to remove accounts from the state data of the ledger.


## fixPayChanRecipientOwnerDir Summary

Changes the [PaymentChannelCreate transaction](https://xrpl.org/paymentchannelcreate.html) type so that it adds new [payment channels](https://xrpl.org/payment-channels.html) to the recipient's [owner directory](https://xrpl.org/directorynode.html). Without this amendment, new payment channels are added only to the sender's owner directory; with this amendment enabled, newly-created payment channels are added to both owner directories. Existing payment channels are unchanged.

This change prevents accounts from being deleted if they are the recipient for open payment channels, except for channels created before this amendment.


## fixCheckThreading Summary

This amendment fixes an aspect of the [Checks amendment](https://xrpl.org/known-amendments.html#checks) and has no effect until the Checks amendment is also enabled. However, enabling this amendment first ensures that all Checks have proper threading metadata from the start.

The fixCheckThreading amendment changes the way Checks transactions affect account metadata, so that Checks are properly added to the [account](https://xrpl.org/accounts.html) history of the receiving account. (Specifically, they update the `PreviousTxnID` and `PreviousTxnLedgerSeq` fields of the receiving account's [AccountRoot object](https://xrpl.org/accountroot.html), which can be used to trace the "thread" of transactions that affected the account and the objects it owns.)

Without this amendment, Checks transactions ([CheckCreate](https://xrpl.org/checkcreate.html), [CheckCash](https://xrpl.org/checkcash.html), and [CheckCancel](https://xrpl.org/checkcancel.html)) only update the account history of the sender. With this amendment, those transactions affect both the sending and receiving accounts.


## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)

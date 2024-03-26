---
category: 2020
date: 2020-05-01
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# Two Fix Amendments Are Now Enabled

As [previously announced](https://xrpl.org/blog/2020/deletableaccounts-expected.html), the [fixCheckThreading](https://xrpcharts.ripple.com/#/transactions/74AFEA8C17D25CA883D40F998757CA3B0DB1AC86794335BAA25FF20E00C2C30A) and [fixPayChanRecipientOwnerDir](https://xrpcharts.ripple.com/#/transactions/D2F8E457D08ACB185CDE3BB9BB1989A9052344678566785BACFB9DFDBDEDCF09) amendments became enabled on 2020-05-01.

The DeletableAccounts amendment is still expected for 2020-05-08.

<!-- BREAK -->

## Action Required

- If you operate a `rippled` server, you must upgrade to version 1.4.0 or higher by **2020-05-01**, for service continuity. **Version 1.5.0** is _strongly recommended_.

- If you use the [`account_channels` API method](https://xrpl.org/account_channels.html), you must upgrade to `rippled` version 1.5.0 to avoid breaking changes to the API triggered by the fixPayChanRecipientOwnerDir amendment.

- The DeletableAccounts amendment changes the starting [sequence numbers](https://xrpl.org/basic-data-types.html#account-sequence) for accounts. If you have automatic processes that send transactions from newly-funded accounts, please check that the change does not break critical processes.

For instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).


## Impact of Not Upgrading

If you operate a `rippled` server on a version older than 1.4.0, then your server is now amendment blocked, meaning that your server:

* Cannot determine the validity of a ledger
* Cannot submit or process transactions
* Does not participate in the consensus process
* Does not vote on future amendments
* Could rely on potentially invalid data


## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)

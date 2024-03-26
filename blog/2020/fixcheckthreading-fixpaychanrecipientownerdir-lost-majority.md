---
category: 2020
date: 2020-01-13
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# fixCheckThreading and fixPayChanRecipientOwnerDir Amendments Lost Majority

On 2019-01-11, the fixCheckThreading and fixPayChanRecipientOwnerDir amendments lost the support of several validators, causing those amendments' support to fall below the 80% threshold for approval. (EnableAmendment LostMajority transactions: [fixCheckThreading](https://xrpcharts.ripple.com/#/transactions/3D10E846B1DA4BA07FA79BA1C13F802DD587F842F3810D997224C3693B120F51), [fixPayChanRecipientOwnerDir](https://xrpcharts.ripple.com/#/transactions/C848F96FDB815623753F27E8B5C83F4E38CFC8F50B28307142A6DFAC946EF070).) As a result, these amendments are no longer expected to become enabled on 2020-01-18, and their status depends on more validators to resume voting in favor of the amendments.

For more information on the Amendment process, see [Amendments](https://xrpl.org/amendments.html) in the XRP Ledger Dev Portal.


## Ripple's Statement

Ripple is one of several validators in the recommended list that are [currently voting](https://xrpscan.com/amendment/621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8) against enabling the fixCheckThreading and fixPayChanRecipientOwnerDir amendments. Ripple's statement on the validator voting is as follows:

> We would like to see these amendments enabled before Deletable Accounts because they fix some edge cases that could be more confusing with Deletable Accounts. However, we have seen a slower than usual uptake of the new core XRP Ledger server version, with almost half the network still using version 1.3.1 instead of the newer 1.4.0. Additionally, [the announcement about these amendments getting a majority](https://xrpl.org/blog/2020/fixcheckthreading-fixpaychanrecipientownerdir-expected.html) was the first time it was reported that fixPayChanRecipientOwnerDir would result in a backwards-incompatible change in the behavior in the API for Payment Channels. Since neither amendment fixes an immediate bug, and enabling either one would [amendment block](https://xrpl.org/amendments.html#amendment-blocked) everyone who's still on v1.3.1, we decided to temporarily have our validators vote against the amendments with the hopes that it would give people more time to upgrade.

## Action Recommended

All XRP Ledger servers should continue to operate as normal for now. If any new amendment gains (or regains) a majority of 80% of validators, it must hold that majority for a continuous period of two weeks to become enabled. However, the following actions are strongly recommended to prepare for the likelihood of future amendments:

- If you operate a `rippled` server, please [upgrade](https://xrpl.org/install-rippled.html) to version 1.4.0.

    **Caution:** Upgrading to v1.4.0 may take longer than usual because of SQL database cleanup the server performs the first time after upgrading. For more information, see [XRP Ledger version 1.4.0 Upgrade Advisory](https://xrpl.org/blog/2020/rippled-1.4.0-upgrade-advisory.html).

- If you use the XRP Ledger APIs to list payment channels, such as using the [account_channels](https://xrpl.org/account_channels.html) method, be aware that the fixPayChanRecipientOwnerDir amendment affects the results of this API. Specifically, the method will list newly-created channels for which the specified account is the recipient. Previously, this method only listed channels for which the account is the sender. (Existing payment channels for which the specified account is the recipient will continue not to appear in the results. Only new channels, created after the amendment becomes enabled, are affected.)

- If you use the XRP Ledger, you may want to read about [how Deletable Accounts work](https://xrpl.org/accounts.html#deletion-of-accounts) in case the changes affect your use of the XRP Ledger. The Deletable Accounts amendment is open for voting, so it may become available within a few weeks depending on how the network's trusted validators vote. (See also: the [Deletable Accounts Draft Specification](https://github.com/xrp-community/standards-drafts/issues/8).)

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [XRPScan Amendments Dashboard](https://xrpscan.com/amendments)
* This XRP Ledger Dev Blog
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)

---
category: 2020
date: 2020-05-08
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# DeletableAccounts is Now Enabled

As previously announced, the DeletableAccounts amendment [became enabled on the XRP Ledger](https://livenet.xrpl.org/transactions/47B90519D31E0CB376B5FEE5D9359FA65EEEB2289F1952F2A3EB71D623B945DE) on **2020-05-08**.

<!-- BREAK -->

## DeletableAccounts Summary

Prior to this amendment, every [account in the XRP Ledger](https://xrpl.org/accounts.html) was permanent. With this amendment, accounts can now be deleted at a cost of 5 XRP by sending a new AccountDelete transaction type. This amendment also changes the starting `Sequence` number for new accounts so that it matches the ledger index when they were created instead of starting at 1.

For more details on what to look out for or how to use deletable accounts, see [the previous primer](/blog/2020/get-ready-for-deletable-accounts).

## Adieu, Deleted Accounts

Within minutes of the amendment going live, some XRP Ledger users have already started reclaiming XRP by deleting their excess accounts. A few of the first accounts to be deleted include:

- [r4WQTd2Ck9tVS536U6EBNErBbrToUoVGh8](https://livenet.xrpl.org/transactions/CF61501174E29B3C7A63E65FFCEF4EA882BD22B449490AB453701DCA7EEAF0B3/detailed)
- [r93Fr5Cmf6KAho1GfF9mvNKV97tZsCFKcB](https://livenet.xrpl.org/transactions/2BCD5B4C9CB7DC65C4C620F2767104CF3F35F805B189A414C1E02479788B7FDA/detailed)
- [rpZ74gjYqVGmRQpXYXbsMXXQXJGJaWhgNu](https://livenet.xrpl.org/transactions/9E471809937837E1D7F6DB5542BECFFD2CE4D43E93D6169613333858CB865436/detailed)

We salute these early adopters for cleaning up extra cruft from the ledger.

## Action Recommended

**If you have software that uses the XRP Ledger,** you should be sure your code still works with the changes to make accounts deletable. See [Get Ready for Deletable Accounts](https://xrpl.org/blog/2020/get-ready-for-deletable-accounts.html) for details on starting sequence numbers, deleted accounts' transaction history, and more.

Additionally, **if you operate an XRP Ledger server,** then you should upgrade to **version 1.5.0** as soon as possible. Two amendments new to v1.5.0, `fixQualityUpperBound` and `RequireFullyCanonicalSig`, are currently **open for voting** and could gain supermajority support among trusted validators at any time. After that point, the amendments could become enabled in two weeks, causing any servers not running at least v1.5.0 to become amendment blocked.

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)

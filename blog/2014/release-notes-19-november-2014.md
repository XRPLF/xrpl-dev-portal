---
category: 2014
date: 2014-11-19
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Release Notes (19 November 2014)

*Curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features.*

### **Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]**

*Released version 0.26.4*

-   Rocksdb v. 3.5.1
-   SQLite v. 3.8.7
-   Disable SSLv3
-   Add counters to track ledger read and write activities
-   Use trusted validators median fee when determining transaction fee
-   Add --quorum argument for server start ([RIPD-563](https://ripplelabs.atlassian.net/browse/RIPD-563))
-   Add account\_offers paging ([RIPD-344](https://ripplelabs.atlassian.net/browse/RIPD-344))
-   Add account\_lines paging ([RIPD-343](https://ripplelabs.atlassian.net/browse/RIPD-343))
-   Ability to configure network fee in rippled.cfg file ([RIPD-564](https://ripplelabs.atlassian.net/browse/RIPD-564))
-   Performance
    -   Ledger performance improvements for storage and traversal ([RIPD-434](https://ripplelabs.atlassian.net/browse/RIPD-434))
    -   Improve client performance for JSON responses ([RIPD-439](https://ripplelabs.atlassian.net/browse/RIPD-439))

<!-- -->

-   Other
    -   Remove PROXY handshake feature
    -   Change to rippled.cfg to support sections containing both key/value pairs and a list of values
    -   Return descriptive error message for memo validation ([RIPD-591](https://ripplelabs.atlassian.net/browse/RIPD-591))
    -   Changes to enforce JSON-RPC 2.0 error format
    -   Optimize account\_lines and account\_offers ([RIPD-587](https://ripplelabs.atlassian.net/browse/RIPD-587))
    -   Improve fee setting logic ([RIPD-614](https://ripplelabs.atlassian.net/browse/RIPD-614))
    -   Improve transaction security
    -   Config improvements
    -   Improve path filtering ([RIPD-561](https://ripplelabs.atlassian.net/browse/RIPD-561))
    -   Logging to distinguish Byzantine failure from tx bug ([RIPD-523](https://ripplelabs.atlassian.net/browse/RIPD-523))

### **Ripple-lib [[Release Notes](https://github.com/ripple/ripple-lib/releases) | [Github](https://github.com/ripple/ripple-lib) | [Issue Tracking](https://github.com/ripple/ripple-lib/issues)]**

*Released version 0.9.3*

-   Change `presubmit` to emit immediately before transaction submit
-   Add "core" browser build of ripple-lib which has a subset of features and smaller file size
-   Update binformat with missing fields from rippled
-   Wait for transaction validation before returning `tec` error
-   Change default `max_fee` on `Remote` to `1 XRP`
-   Fix: Request ledger\_accept should return the Remote

### **Ripple Client [[Release Notes](https://github.com/ripple/ripple-client/releases) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]**

*www.rippletrade.com - released versions 1.1.0, 1.1.1, 1.1.2, and 1.1.3* 1.1.3

-   Add error messages on gateways page
-   Disable remove button on incoming trust
-   Orderbook currency precision changes
-   Update the loading spinners
-   Remove external jQuery dependency
-   Fix problems with GBI Send/Convert
-   Fix release notes link

1.1.2

-   Add BRL, MXN funding pages
-   Add client side validation for trusting amount
-   Code cleanup
-   Show higher precision for orderbook

1.1.1

-   Add account deletion feature
-   Add ripple name support on debug page
-   Change amount precisions on send, convert, orderbook

1.1.0

-   Keep user session in sync thru all the browser tabs
-   Fund UI redesign
-   Add max network fee change field in advanced tab
-   Add Balances sidebar for several pages
-   Add JPY funding page
-   Add pretend page
-   Add 404 page
-   Add tooltip with full Ripple address when hovering over contact
-   E2E tests for settings dropdown and login
-   New amount precision rules based on currencies,
-   Clean up the code according to our js style guide
-   Update Loading UIs
-   Remove downloadable client code
-   Expand history filters by default
-   Fix contact destination tag deletion
-   Fix currency on trustline deletion
-   Generalize currency colors

**[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)**

-   [In the "Send" confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (41,667 XRP)

### **Ripple-Rest [[Release Notes](https://github.com/ripple/ripple-rest/releases) | [Github](https://github.com/ripple/ripple-rest) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RA/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

*Released version 1.3.1*

-   Add `validated` query parameter to POST payment, account settings and trustlines. When set to true this will force the request to wait until the transaction has been validated. [f2710f4b](https://github.com/ripple/ripple-rest/commit/f2710f4b78a8c1b9860f2876f6f051022241c641), [1ee9c9ff](https://github.com/ripple/ripple-rest/commit/1ee9c9ff06ada4a14955bf64ed42d7c3c75f5a3e), [f243fef9](https://github.com/ripple/ripple-rest/commit/f243fef9d28be86f593dae11a3fac7421115e5bf)
-   Add `/v1/transaction-fee` endpoint to retrieve the current fee that connected servers are charging. [212c0bfb](https://github.com/ripple/ripple-rest/commit/212c0bfbcde887db9e9842ef43af062b5ab77598) and [afaa381b](https://github.com/ripple/ripple-rest/commit/afaa381bb5f9a4fdd50f1e35cb1d7990b4926833)
-   Support `last_ledger_sequence` in POST payments, sets the last ledger this payment can be included in.
-   Support `max_fee` in POST payments. This will set the maximum fee the user will pay when posting a payment.
-   Add config entry to configure `max_transaction_fee`. This allows you to set the maximum fee you're willing to pay for any transaction. [Documented changes](https://github.com/ripple/ripple-rest/blob/develop/docs/server-configuration.md)
-   Save unsubmitted transactions to database

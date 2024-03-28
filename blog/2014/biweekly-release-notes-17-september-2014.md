---
date: 2014-07-17
category: 2014
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Biweekly release notes (17 September 2014)

*Curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features.*

*We hope you find these useful! Please let us know if you have feedback in the comments.*

### **Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]**

*Released version 0.26.3-sp1*

-   New command to display HTTP/S-RPC sessions metrics ([RIPD-533](https://ripplelabs.atlassian.net/browse/RIPD-533))
-   Improved handling of HTTP/S-RPC sessions ([RIPD-489](https://ripplelabs.atlassian.net/browse/RIPD-489))
-   Fix unit tests for Windows.
-   Fix integer overflows in JSON parser.
-   Improve processing of trust lines during pathfinding.
-   Added a command line utility called LedgerTool for retrieving and processing ledger blocks from the Ripple network.

### **Ripple-lib [[Release Notes](https://github.com/ripple/ripple-lib/releases) | [Github](https://github.com/ripple/ripple-lib) | [Issue Tracking](https://github.com/ripple/ripple-lib/issues)]**

*Released version 0.8.1*

-   Wallet: Add Wallet class that generates wallets
-   Make npm test runnable in Windows.
-   Fix several stability issues, see merged PR's for details
-   Fix bug in Amount.to\_human\_full()
-   Fix undefined fee states when connecting to a rippled that is syncing

### **Ripple Charts [[Github (frontend)](https://github.com/ripple/ripplecharts-frontend) | [Github (backend)](https://github.com/ripple/ripple-data-api) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RC/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

*No major updates* [***Open bounties***](https://www.bountysource.com/trackers/3954022-ripple-charts)

-   [Value Summary Donut: change details display to better represent IOU/IOU markets](https://www.bountysource.com/issues/3597514-value-summary-donut-change-details-display-to-better-represent-iou-iou-markets) (5,833 XRP)

### **Ripple Client [[Release Notes](https://ripple.com/wiki/Ripple_Trade_Release_Notes) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]**

*www.rippletrade.com - released version 1.0.6, 1.0.7* 1.0.6

-   Balance pie UI changes
-   Enable 2 factor authentication

1.0.7

-   Add "Download to CSV" option for account history
-   Ability to select which issuer you want in the send and convert flows
-   Use bower ripple-lib
-   Update bower dependency versions
-   Fix issues around balance pies and exchange rates
-   Gateway UI changes
-   Show ripple names on notifications
-   Show executed trades in notifications bell
-   Temporarily remove currency and amount filters from history

**[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)**

-   [In the "Send" confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (41,667 XRP)
-   [Incorrect amount displayed for partial payments](https://www.bountysource.com/issues/2842476-incorrect-amount-displayed-for-partial-payments) (8,333 XRP)

### **Codius** **[[Github](https://github.com/codius)]**

-   Connect and write to TCP socket
-   Add jsmn to libuv for JSON parsing

---
date: 2014-07-03
category: 2014
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Biweekly Release Notes (3 September 2014)

*A few days tardy, but better late than never...* *Curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features.* *We hope you find these useful! Please let us know if you have feedback in the comments.*

### **Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]**

*No new releases, *major commits included below**

-   Fix missing return value error check
-   Optimize pathfinding operations
-   Improve parallelization of getRippleLines

### **Ripple-Rest [[Release Notes](https://github.com/ripple/ripple-rest/releases) | [Github](https://github.com/ripple/ripple-rest) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RA/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

**No new releases*, major commits included below*

-   Fix missing metadata on get payment
-   Fix undefined ledger\_current\_index
-   Fix double-date-conversion in request payment
-   Always query rippled for transactions

### **Ripple Charts [[Github (frontend)](https://github.com/ripple/ripplecharts-frontend) | [Github (backend)](https://github.com/ripple/ripple-data-api) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RC/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

*No major updates* [***Open bounties***](https://www.bountysource.com/trackers/3954022-ripple-charts)

-   [Value Summary Donut: change details display to better represent IOU/IOU markets](https://www.bountysource.com/issues/3597514-value-summary-donut-change-details-display-to-better-represent-iou-iou-markets) (5,833 XRP)

### **Ripple Client [[Release Notes](https://ripple.com/wiki/Ripple_Trade_Release_Notes) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]**

*www.rippletrade.com - released version 1.0.4, 1.0.5, 1.0.5-1, and 1.0.5-2* 1.0.4

-   Pie widget that displays the total estimated balance of the account in 1 currency
-   "Flip' button for currency pairs in the Trade tab
-   Click on an active order, load orderbook for that pair
-   "Trade" filter in the History page
-   Place recently used trade pairs at the top of the dropdown
-   Migrate and Login flows now check separate blobs
-   Add destination tags to transaction summary page
-   Update trust lines UI to "Connect gateway" UI, put it under the "Fund" tab
-   Put Rippling and incoming trust lines into the "advanced trust line" options
-   Settings UI updated

1.0.5

-   Only show funded portion of orders in the orderbook

1.0.5-1

-   Fix currency choice restriction bug (RT-2146)

1.0.5-2

-   Various send tab fixes

**[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)**

-   [In the "Send" confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (41,667 XRP)
-   [Incorrect amount displayed for partial payments](https://www.bountysource.com/issues/2842476-incorrect-amount-displayed-for-partial-payments) (8,333 XRP)

### **Codius** **[[Github](https://github.com/codius)]**

-   Create passthrough API
-   Implement fs.statSync to call out of the sandbox
-   Added EventLoop

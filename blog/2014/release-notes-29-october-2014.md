---
category: 2014
date: 2014-10-29
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Release Notes (29 October 2014)

*Curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features.*

*We hope you find these useful! Please let us know if you have feedback in the comments.*

### **Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]**

*No releases*

### **Ripple-lib [[Release Notes](https://github.com/ripple/ripple-lib/releases) | [Github](https://github.com/ripple/ripple-lib) | [Issue Tracking](https://github.com/ripple/ripple-lib/issues)]**

*Released version 0.9.0* 0.9.0

-   Add routes to the vault client for KYC attestations ([ed2da574](https://github.com/ripple/ripple-lib/commit/ed2da57475acf5e9d2cf3373858f4274832bd83f))
-   Currency: add `show_interest` flag to show or hide interest in `Currency.to_human()` and`Currency.to_json()` [Example use in tests](https://github.com/ripple/ripple-lib/blob/947ec3edc2e7c8f1ef097e496bf552c74366e749/test/currency-test.js#L123)
-   Configurable maxAttempts for transaction submission ([d107092](https://github.com/ripple/ripple-lib/commit/d10709254061e9e4416d2cb78b5cac1ec0d7ffa5))
-   Binformat: added missing TransactionResult options ([6abed8d](https://github.com/ripple/ripple-lib/commit/6abed8dd5311765b2eb70505dadbdf5121439ca8))
-   **Breaking change:** make maxLoops in seed.get\_key optional. [Example use in tests](https://github.com/ripple/ripple-lib/blob/23e473b6886c457781949c825b3ff48b3984e51f/test/seed-test.js)([23e473b](https://github.com/ripple/ripple-lib/commit/23e473b6886c457781949c825b3ff48b3984e51f))
-   Shrinkwrap packages for dependency locking ([2dcd5f9](https://github.com/ripple/ripple-lib/commit/2dcd5f94fbc71200eb08a5044c76ef94f7971913))
-   Fix: Amount.to\_human() precision bugs ([4be209e](https://github.com/ripple/ripple-lib/commit/4be209e286b5b209bec7bcd1212098985e15ff2f) and [7708c64](https://github.com/ripple/ripple-lib/commit/7708c64576e70ce3ac190442daceb30e4446aab7))
-   Fix: change handling of requestLedger options ([57b7030](https://github.com/ripple/ripple-lib/commit/57b70300f5f0c7534ede118ddbb5d8762668a4f8))

### **Ripple Charts [[Github (frontend)](https://github.com/ripple/ripplecharts-frontend) | [Github (backend)](https://github.com/ripple/ripple-data-api) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RC/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

-   Added date picker to staging, launching to production soon
-   Massive [pull request](https://github.com/ripple/ripplecharts-frontend/commit/c656f71d6655ee79755f212393d3107861a9c227) outlining upcoming features

[***Open bounties***](https://www.bountysource.com/trackers/3954022-ripple-charts)

-   [Value Summary Donut: change details display to better represent IOU/IOU markets](https://www.bountysource.com/issues/3597514-value-summary-donut-change-details-display-to-better-represent-iou-iou-markets) (5,833 XRP)

### **Ripple Client [[Release Notes](https://github.com/ripple/ripple-client/releases) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]**

*www.rippletrade.com - released version 1.0.11* 1.0.11

-   Numbers after decimals are getting rounded now, not truncated
-   Snapswap USD funding flow (hidden)
-   GBI gateway discovery
-   l10n fixes
-   Roll back pathfinding changes
-   new txQueue mechanism
-   UI cleanup
-   When logged in on multiple tabs, if you sign out/in on one tab, sign out/in on the other tab

**[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)**

-   [In the "Send" confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (41,667 XRP)
-   BOUNTY GRANTED: [Incorrect amount displayed for partial payments](https://www.bountysource.com/issues/2842476-incorrect-amount-displayed-for-partial-payments) (8,333 XRP)

### **Ripple-Rest [[Release Notes](https://github.com/ripple/ripple-rest/releases) | [Github](https://github.com/ripple/ripple-rest) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RA/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

*Released version 1.3.0-rc5* 1.3.0-rc5

-   Freeze support ([pull 167](https://github.com/ripple/ripple-rest/pull/167) and [pull 178](https://github.com/ripple/ripple-rest/pull/178))
-   Memo field support ([pull 154](https://github.com/ripple/ripple-rest/pull/154))
-   Add `destination_amount_submitted` and `source_amount_submitted` to Payment ([0d3599b](https://github.com/ripple/ripple-rest/commit/0d3599b4057c5cb884eade6bc11c978f8770c943) and[67134e3](https://github.com/ripple/ripple-rest/commit/67134e3ef57b808fc193f2f62579c5681aeb49cc))
-   New endpoint to generate an address/secret pair, `/wallet/new`
-   Expose `router` and `remote` as `RippleRestPlugin` to use as a plugin for other modules
-   Log all connected servers, add reconnect to servers on SIGHUP

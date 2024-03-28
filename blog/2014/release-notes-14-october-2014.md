---
date: 2014-10-14
category: 2014
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Release Notes (14 October 2014)

*Curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features.*

*We hope you find these useful! Please let us know if you have feedback in the comments.*

### **Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]**

*Released version 0.26.3-sp4*
-   Update for validating rippled servers that includes new transaction fee logic

### **Ripple-lib [[Release Notes](https://github.com/ripple/ripple-lib/releases) | [Github](https://github.com/ripple/ripple-lib) | [Issue Tracking](https://github.com/ripple/ripple-lib/issues)]**

*Released versions 0.8.2, 0.8.3-rc1, 0.9.0-rc1, 0.9.0-rc2* 0.9.0-rc2
-   Currency: add `show_interest` flag to show or hide interest in `Currency.to_human()` and`Currency.to_json()` [Example use in tests](https://github.com/ripple/ripple-lib/blob/947ec3edc2e7c8f1ef097e496bf552c74366e749/test/currency-test.js#L123)
-   **Breaking change:** make maxLoops in seed.get\_key optional. [Example use in tests](https://github.com/ripple/ripple-lib/blob/23e473b6886c457781949c825b3ff48b3984e51f/test/seed-test.js)([23e473b](https://github.com/ripple/ripple-lib/commit/23e473b6886c457781949c825b3ff48b3984e51f))

0.8.3-rc1
-   Add routes to the vault client for KYC attestations ([ed2da574](https://github.com/ripple/ripple-lib/commit/ed2da57475acf5e9d2cf3373858f4274832bd83f))
-   Configurable maxAttempts for transaction submission ([d107092](https://github.com/ripple/ripple-lib/commit/d10709254061e9e4416d2cb78b5cac1ec0d7ffa5))
-   Fix: change handling of requestLedger options ([57b7030](https://github.com/ripple/ripple-lib/commit/57b70300f5f0c7534ede118ddbb5d8762668a4f8))

0.8.2
-   Currency: Allow mixed letters and numbers in currencies
-   Deprecate account\_tx map/reduce/filter
-   Fix: correct requestLedger arguments
-   Fix: missing subscription on error events for some server methods
-   Fix: orderbook reset on reconnect

### **Ripple Charts [[Github (frontend)](https://github.com/ripple/ripplecharts-frontend) | [Github (backend)](https://github.com/ripple/ripple-data-api) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RC/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

*No major updates* [***Open bounties***](https://www.bountysource.com/trackers/3954022-ripple-charts)
-   [Value Summary Donut: change details display to better represent IOU/IOU markets](https://www.bountysource.com/issues/3597514-value-summary-donut-change-details-display-to-better-represent-iou-iou-markets) (5,833 XRP)

### **Ripple Client [[Release Notes](https://github.com/ripple/ripple-client/releases) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]**

*www.rippletrade.com - released version 1.0.8, 1.0.9, 1.0.10* 1.0.10
-   Added a complete KYC flow (hidden for now)
-   Fixed payment URI’s with small amounts
-   Fixed JSON rewriter issues
-   Fixes on account page UI
-   Fixes on convert page
-   Routing changes
-   Notification and button UI improvements

1.0.9
-   Nodejs server for dev use
-   Advanced settings page UI improvements
-   Add default ripple.txt file
-   Show ripple names on overview page
-   Align balances on the decimal place on overview page

1.0.8
-   UI improvements / cleanup
-   Currency parameter for Ripple URIs

**[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)**
-   [In the “Send” confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (41,667 XRP)
-   [Incorrect amount displayed for partial payments](https://www.bountysource.com/issues/2842476-incorrect-amount-displayed-for-partial-payments) (8,333 XRP)

### **Ripple-Rest [[Release Notes](https://github.com/ripple/ripple-rest/releases) | [Github](https://github.com/ripple/ripple-rest) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RA/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]**

*Released version 1.2.5, 1.3.0-rc2, 1.3.0-rc3, 1.3.0-rc4* 1.3.0-rc4
-   Memo field support
-   Freeze support
-   New endpoint to generate an address/secret pair, `/account/new`
-   New configuration, you will have to change your config file
-   New database interface, support for sqlite in memory or persistent through config path
-   Deprecated Postgres support
-   Transitioned to Express4
-   Refactored response and error handling, improves consistency of response messages
-   Expose `router` and `remote` as `RippleRestPlugin` to use as a plugin for other modules
-   Centralize connection checking, improves consistency of connected responses
-   Centralize logging using winston, timestamps on all logs
-   New test-suite
-   Log all connected servers, add reconnect to servers on SIGHUP
-   Tied api version to major package version and added package version to index page `/` or`/v1`
-   Update ripple-lib which fixes several stability problems and crashes
-   Fix: issue where forcible server connectivity check would cause permanent server disconnect
-   Fix: show index page while hitting root `/`
-   Fix: issue with notification parsing
-   Fix: check and validate issuer upon payment
-   Fix: database reset on startup
-   Fix: Check tx.meta exists before accessing
-   Fix: Allow browser-based client to make POST to ripple-rest server
-   Fix: Occasional crash on getting payments for account
-   Code refactor and cleanup

1.2.5
-   Fix: Check that tx.meta exists before accessing
-   Fix: Case where ripple-rest would crash when rippled could not be connected to


###### About Ryan Terribilini

Ryan Terribilini is head of developer relations at Ripple Labs.

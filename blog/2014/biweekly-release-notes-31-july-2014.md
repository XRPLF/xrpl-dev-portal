---
date: 2014-07-31
category: 2014
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Biweekly release notes (31 July 2014)

Starting today, Ripple Labs will release curated release notes on a bi-weekly basis to ensure better communication with the developer community about ongoing projects.

This effort is part of a larger overhaul of our developer resources, which we are continually adding to.

The curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features.

We hope you find these useful! Please let us know if you have feedback in the comments.

### Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]

*Released version 0.26.1*

-   Enabled asynchronous handling of HTTP-RPC interactions. This fixes client handlers using RPC that periodically return blank responses to requests. ([RIPD-390](https://ripplelabs.atlassian.net/browse/RIPD-390))
-   Fixed auth handling during OfferCreate. This fixes a regression of [RIPD-256](https://ripplelabs.atlassian.net/browse/RIPD-256). ([RIPD-414](https://ripplelabs.atlassian.net/browse/RIPD-414))

### Ripple-Lib [[Release Notes](https://github.com/ripple/ripple-lib/releases) | [Github](https://github.com/ripple/ripple-lib) | [Issue Tracking](https://github.com/ripple/ripple-lib/issues)]

*Released version 0.7.39*

-   Improvements to multi-server support. Fixed an issue where a server's score was not reset and connections would keep dropping after being connected for a significant amount of time.
-   Improvements in order book support. Added support for currency pairs with interest bearing currencies. You can request an order book with hex, ISO code or full name for the currency.
-   Fix value parsing for amount/currency order pairs, e.g. Amount.from\_human("XAU 12345.6789")
-   Improved Amount parsing from human readable string given a hex currency, e.g.Amount.from\_human("10 015841551A748AD2C1F76FF6ECB0CCCD00000000")
-   Improvements to username normalization in the vault client
-   Add 2-factor authentication support for vault client
-   Removed vestiges of Grunt, switched to Gulp

### Ripple-Rest [[Release Notes](https://github.com/ripple/ripple-rest/releases) | [Github](https://github.com/ripple/ripple-rest) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RA/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]

*Released version 1.2.1*

-   Enabled invoice ID
-   Do not limit the amount of account transactions per ledger to 10, fixing the issue where no incoming transactions were ever notified.

### Rippled Historical Database [[Github](https://github.com/ripple/rippled-historical-database)]

*Kicked off development on project*

-   SQL database as a canonical source of historical data in Ripple

### Ripple Charts [[Github (frontend)](https://github.com/ripple/ripplecharts-frontend) | [Github (backend)](https://github.com/ripple/ripple-data-api) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RC/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]

*www.ripplecharts.com*

-   Top 6 markets are visible on the front dashboard now
-   New markets have been added to our volume pie chart
-   Hot/Warm wallet accounts have been deducted from Cold Wallets balances in the capitalization charts (under value trends) to more accurately represent capitalization of each issuer/currency

### Ripple Client [[Release Notes](https://ripple.com/wiki/Ripple_Trade_Release_Notes) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]

*Released versions 1.0.1 and 1.0.2* 1.0.1

-   Account password change functionality
-   Navbar render optimization
-   Currency caching fixes
-   e2e testing setup / basic login, xrp send flow tests
-   Mobile UI fixes
-   "LESS" variables for used colors / fonts
-   Translation fixes
-   Online/Offline issue fix

1.0.2

-   AngularJS optimizations / Performance boost
-   Code cleanup
-   Demurrage exchange fixes
-   Mobile UI fixes
-   "Load more" button for orderbook
-   Detect browser language preferences

[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)

-   [In the "Send" confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (62,500 XRP)
-   [Click on XRP amount in top right, dropdown showing all balances](https://www.bountysource.com/issues/2842592-ripple-trade-click-on-xrp-amount-in-top-right-dropdown-showing-all-balances) (25,000 XRP)
-   [Create "Trade" filter in History tab](https://www.bountysource.com/issues/2842682-create-trade-filter-in-history-tab) (25,000 XRP)

### Codius

*Code drop on 4 August 2014 at 9:00 am PST*

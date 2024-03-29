---
date: 2014-08-14
category: 2014
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Biweekly Release Notes (14 August 2014)

_Release notes are part of a larger overhaul of our developer resources, which we are continually adding to. Curated release notes will be posted on this blog and will include updates from every active project. Specifically we will post and link to any new release notes, open bounties, and upcoming features. We hope you find these useful! Please let us know if you have feedback in the comments._

### Rippled [[Release Notes](https://ripple.com/wiki/Category:Rippled_release_notes) | [Github](https://github.com/ripple/rippled) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=25)]

*Released version 0.26.2*

-   Freeze enforcement: activates on September 15, 2014 ([RIPD-399](https://ripplelabs.atlassian.net/browse/RIPD-399))
-   Add pubkey\_node and hostid to server stream messages ([RIPD-407](https://ripplelabs.atlassian.net/browse/RIPD-407))
-   Fix intermittent exception when closing HTTPS connections ([RIPD-475](https://ripplelabs.atlassian.net/browse/RIPD-475))
-   Correct Pathfinder::getPaths out to handle order books ([RIPD-427](https://ripplelabs.atlassian.net/browse/RIPD-427))
-   Detect inconsistency in PeerFinder self-connects ([RIPD-411](https://ripplelabs.atlassian.net/browse/RIPD-411))
-   Add owner\_funds to client subscription data ([RIPD-377](https://ripplelabs.atlassian.net/browse/RIPD-377)) (Experimental Feature)

### Ripple-Rest [[Release Notes](https://github.com/ripple/ripple-rest/releases) | [Github](https://github.com/ripple/ripple-rest) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RA/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]

*No new releases, major commits included below*

-   Add empty http tests
-   Add rest to lib transaction converter
-   Fixed bugs from API cleanup
-   Began breakout of globals to separate modules

### Ripple Charts [[Github (frontend)](https://github.com/ripple/ripplecharts-frontend) | [Github (backend)](https://github.com/ripple/ripple-data-api) | [Issue Tracking](https://ripplelabs.atlassian.net/browse/RC/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel)]

*www.ripplecharts.com*

-   restore user persistence for light theme
-   add Ripple Fox to gateways list
-   add IOU/IOU markets to top markets
-   metrics: added SS EUR, RS XAU, PR ILS to total network value
-   offersExcercised: demmurage/interest currency support
-   offersExercised: apply interest to unreduced results
-   gateways: rename ripple israel, add GBI
-   gateways: added lakeBTC

[*Open bounties*](https://www.bountysource.com/trackers/3954022-ripple-charts)

-   [Value Summary Donut: change details display to better represent IOU/IOU markets](https://www.bountysource.com/issues/3597514-value-summary-donut-change-details-display-to-better-represent-iou-iou-markets) (8,750 XRP)

### Ripple Client [[Release Notes](https://ripple.com/wiki/Ripple_Trade_Release_Notes) | [Github](https://github.com/ripple/ripple-client) | [Issue Tracking](https://ripplelabs.atlassian.net/secure/RapidBoard.jspa?rapidView=2&view=planning&selectedIssue=RT-1990&quickFilter=38&epics=visible)]

*www.rippletrade.com - new release next week!*

-   Redesigned Settings page
-   Destination Tag included in Transaction Summary (thanks [OrzFly](https://github.com/orzfly)!)
-   Fix invalid/non-canonical currency pairs in dropdown menu
-   Trade filter on history page (thanks [Madsn](https://github.com/Madsn)!)

[*Open bounties*](https://www.bountysource.com/trackers/3604734-ripple-trade)

-   [In the "Send" confirmation page, show network and gateway Fees](https://www.bountysource.com/issues/2842674-in-the-send-confirmation-page-show-network-and-gateway-fees) (62,500 XRP)
-   [Alerts in the top right should include trades](https://www.bountysource.com/issues/2842706-ripple-trade-alerts-in-the-top-right-should-include-executed-trades) (12,500 XRP)
-   [Ripple URI for trade tab](https://www.bountysource.com/issues/2842655-ripple-uri-for-trade-tab) (12,500 XRP)

### Codius [[Github](https://github.com/codius)]

-   Code released on August 4th
-   Examples available ([bitcoin](https://github.com/codius/example-bitcoin), [webserver](https://github.com/codius/example-webserver), [helloworld](https://github.com/codius/example-helloworld))

 

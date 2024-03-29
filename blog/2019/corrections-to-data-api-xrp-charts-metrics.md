---
labels:
    - Advisories
    - Data API
category: 2019
date: 2019-04-04
theme:
    markdown:
        editPage:
            hide: true
---
# Corrections to Data API / XRP Charts Metrics for 2019-03-23

The [Data API][], an open API that provides data to [XRP Charts][] and third-party tools, suffered gaps in data ingestion on 2019-03-23. As a result, several [metrics on XRP Charts](https://xrpcharts.ripple.com/#/metrics), including the number of ledgers closed per day, were overcounted. **During this time, the XRP Ledger did not experience any outages.** However, the Data API's ingestion service was unable to process ledgers with transactions containing the `tecKILLED` transaction response code. `tecKILLED` is a new response code added to the XRP Ledger by amendment [fix1578](https://developers.ripple.com/known-amendments.html#fix1578) on 2019-03-23. This necessitated changes to the [ripple-binary-codec library](https://github.com/ripple/ripple-binary-codec) used by the ingestion service, but [those changes](https://github.com/ripple/ripple-binary-codec/pull/27) were only partially deployed to the ingestion service. We have since reprocessed and corrected the metrics that were affected by this problem.

[Data API]: https://developers.ripple.com/data-api.html
[XRP Charts]: https://xrpcharts.ripple.com/

<!-- BREAK -->

The [Data API][] and [XRP Charts][] are public services that Ripple supports but they are not intended for large-scale production use. These services are also independent from the core XRP Ledger, which is a distributed system that is not operated by any one party.

Although we will continue to improve our tools going forward, it is important to note that Ripple is one participant in the broader XRP Ledger ecosystem and we are excited to see the amazing tools and services that  independent developers are building on the XRP Ledger.

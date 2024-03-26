---
category: 2020
date: 2020-06-11
labels:
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# The Checks Amendment is Expected 2020-06-18

The Checks amendment to the XRP Ledger, introduced all the way back in [`rippled` v0.90.0](https://github.com/ripple/rippled/releases/tag/0.90.0), has [gained support from a majority of trusted validators](https://xrpcharts.ripple.com/#/transactions/F2CACEB0680626E8A4DE7EDA02DEC7438E1FB0D7C8736DD327074F85877E6D8E). Currently, it is expected to become enabled on 2020-06-18. As long as the Checks amendment continues to have the support of at least 80% of trusted validators continuously, it will become enabled on the scheduled date.

<!-- BREAK -->

## Checks Summary

Introduces "Checks" to the XRP Ledger. Checks work similarly to personal paper checks. The sender signs a transaction to create a Check for a specific maximum amount and recipient. Later, the recipient can cash the Check to receive up to the specified amount. The actual movement of money only occurs when the Check is cashed, so cashing the Check may fail depending on the sender's current balance and the available liquidity. If cashing the Check fails, the Check object remains in the ledger so the recipient can try again later.

For more information, see [Checks](https://xrpl.org/checks.html).


## Action Recommended

No action is required at this time. The minimum XRP Ledger server version to remain synced to the network already has support for Checks.

If you are the developer for a library that reads and writes the XRP Ledger's binary format, make sure your library can read and write the new transaction and ledger types introduced by the Checks amendment. Ripple's reference libraries already support Checks, including [`ripple-binary-codec` (since v0.1.13)](https://github.com/ripple/ripple-binary-codec/) and [`ripple-lib` (since v0.19.0)](https://github.com/ripple/ripple-lib/).

If you have an XRP Ledger business, you may also want to read about [Checks](https://xrpl.org/checks.html) to see if your business model could benefit from using this feature.


## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [XRPScan Amendments Dashboard](https://xrpscan.com/amendments)
* [Xpring Forum](https://forum.xpring.io/)
* [XRP Chat Forum](http://www.xrpchat.com/)

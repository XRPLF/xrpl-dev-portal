---
category: 2023
date: 2023-02-01
labels:
    - Developer Reflections
theme:
    markdown:
        editPage:
            hide: true
---
# Developer Reflections: Mandla Money

This week on Developer Reflections, we’re proud to highlight [Mandla Money](https://mandla.money/web/), a digital wallet that allows users to receive, transact, and store value using digital assets via SMS, with no need for a smartphone or an internet connection.

<!-- BREAK -->

Designed to enable better financial inclusion for the unbanked, Mandla SMS Wallet provides a mechanism for transparent, traceable, and low-cost distribution of value via text message in emerging economies. Users can send assets to one another using their cell phone numbers or Mandla IDs as XRP Ledger destination tags, for example, `send#asset#MandlaID#amount`. The use cases include quick and inexpensive distribution of social welfare, remittances (both domestic and cross-border payments), and unlike the XRP Ledger, offline payment capabilities in Mandla.

In short, the way the Mandla SMS wallet works is akin to sending a payment using ApplePay over text message with the XRP Ledger as the payment rail.

![Screenshot: Mandla Money homepage](/blog/img/dev-reflections-mandla-money.png)

## Why the XRP Ledger?

The XRP Ledger has proven reliability (8+ years of consistent performance with more than 63 million closed ledgers), fast transactions that settle in 3-5 seconds, low cost transaction fees, and native support for transaction tags. By making use of XRP Ledger destination tags, Mandla wallet users can send and receive XRP Ledger-based digital assets over SMS using their cell number or Mandla ID, which is also what makes the offline capability possible. It's important to note that the XRP Ledger itself does not have offline capabilities. The offline functionality is provided specifically by Mandla through its use of SMS technology.

Further, the ability to issue assets and set up corresponding trust lines with ease makes integrating various XRP Ledger-issued stablecoins from different jurisdictions into the Mandla wallet easier and much more scalable. 

To learn more, visit [Mandla Wallet](https://mandla.money/web/). 

Want to be featured in Developer Reflections? Learn more and [submit your project](https://xrpl.org/contribute.html#xrpl-blog) today.

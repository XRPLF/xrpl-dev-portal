---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-05-20
labels:
    - xrpl4j Release Notes
---
# Introducing xrpl4j

RippleX and the XRP Ledger Foundation (XRPLF) are pleased to announce the release of`xrpl4j`, a pure Java library for interacting with the XRP Ledger (XRPL). [`xrpl4j`](https://github.com/XRPLF/xrpl4j) provides convenient tooling for developers to take full advantage of all the XRP Ledger has to offer, including wallet derivation, address encoding, transaction serialization and signing and native Java objects modeling core primitives of the rippled API.

Though `xrpl4j` was initially built as a tool for internal Ripple projects, we have since open-sourced the code on Github under the XRP Ledger Foundation organization. We’ve also released [two major versions](https://search.maven.org/search?q=org.xrpl) to Maven Central. This library exposes a large portion of the functionality of the XRP Ledger and can be used in any JVM environment, opening the door for Android and server-side Java developers alike to start developing XRP Ledger apps. Whether you are a novice XRP Ledger developer or a seasoned vet, the `xrpl4j` API offers an easy and idiomatic toolkit for your next app.

Prior to the release of `xrpl4j`, Java developers interested in building on top of the XRP Ledger either had to write large amounts of complicated code themselves or develop their apps using [JavaScript](https://github.com/ripple/ripple-lib) or [Python](https://github.com/XRPLF/xrpl-py). Now, they can enjoy the features of those libraries in an easy-to-use, fully native Java library.

The `xrpl4j` library offers a range of features including:

* Cryptographic key and account generation
* Transaction serialization, secure signing and submission
* Model objects for all [transaction types](https://xrpl.org/transaction-formats.html) and the most commonly used [Ledger objects](https://xrpl.org/ledger-data-formats.html) and [server API](https://xrpl.org/public-rippled-methods.html) requests and responses

The feature set of the library includes almost everything that the XRP Ledger supports. However, by design, `xrpl4j` does not provide abstractions on top of the core rippled API. This design equips developers with the most flexibility in how they use the XRP Ledger, and has the added benefit of being familiar to developers who have built directly on the rippled API. Additionally, newer XRPL developers only have to learn one API instead of needing to learn the core rippled server API along with a new library interface.

While the team at RippleX has built a majority of `xrpl4j` thus far, we did this with input from the developer community. We feel that libraries like `xrpl4j` work best when they are owned, used and supported by a large and thriving community. To that end, we contributed the code to the XRPLF, who is hosting the source code under their [GitHub organization](https://github.com/XRPLF), which features a growing number of libraries and other developer tools supporting the XRP Ledger community.

To get started with `xrpl4j`, follow [this tutorial](https://xrpl.org/get-started-using-java.html) on xrpl.org, check out the [README in the project repo](https://github.com/XRPLF/xrpl4j/blob/main/README.md) or go right to the [reference documentation](https://javadoc.io/doc/org.xrpl/xrpl4j-parent/2.0.0/index.html).

For more discussions about building on top of the XRP Ledger and to see `xrpl4j` in action, tune into the [RippleXDev](https://www.twitch.tv/ripplexdev) Twitch stream on May 25 at 11am PT.

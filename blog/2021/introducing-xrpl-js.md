---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-10-20
labels:
    - xrpl.js Release Notes
author: Team RippleX
---
# Introducing xrpl.js

[RippleX](https://ripple.com/ripplex/) and the [XRP Ledger Foundation (XRPLF)](https://xrplf.org/) are excited to announce xrpl.js **version 2.0.0**, a JavaScript/TypeScript library for interacting with the XRP Ledger (XRPL). Formerly known as ripple-lib, the library was renamed to better represent its role in the XRPL ecosystem and overhauled to take advantage of modern JavaScript features.

<!-- BREAK -->

## Background

JavaScript is one of the most widely-used programming languages, and as such has a massive community of active developers. Maintaining a JavaScript SDK enables these developers to seamlessly interact with the XRP Ledger, both in the browser and in Node.js. In addition, the JavaScript libraries (xrpl.js, ripple-binary-codec, ripple-keypairs, and ripple-address-codec) power many [apps](https://github.com/XRPLF/xrpl.js/blob/develop/APPLICATIONS.md) in the XRPL ecosystem, as well as [packages](https://www.npmjs.com/browse/depended/ripple-lib) from companies such as BitGo and Ledger.

## Changes

With this release of xrpl.js, the JavaScript, [Java](https://github.com/XRPLF/xrpl4j), and [Python](https://github.com/XRPLF/xrpl-py/) libraries provided by the XRPLF now have parallel structures and systems. This enables developers to easily work with their preferred programming language depending on their specific needs, without having to learn an entirely new interface.

xrpl.js will continue to support all ripple-lib features, such as:

- Serializing, signing, and submitting transactions to the XRPL
- Retrieving information from the XRPL
- Helpful utility functions (such as converting between [drops](https://xrpl.org/xrp.html#xrp-properties) and XRP)
- Support for Node.js, web browsers, and React

It also introduces a number of new features, including:

- TypeScript types for all transaction types and WebSocket requests
- A Wallet class to make it easier to work with key pairs
- Protections against the [partial payment attack vector](https://xrpl.org/partial-payments.html#partial-payments-exploit)
- An additional submit implementation that returns the transaction's final outcome after validation.

In version 2.0, the library is now much more aligned with the core XRP Ledger interface. This means XRPL developers—whether new or experienced—can refer to multiple sources of documentation instead of needing to rely solely on the library-specific documentation. There are also a number of general architecture improvements, such as simplifying code, making user interfaces more intuitive (especially in relation to the core ledger), and revamping the testing structure. For a detailed list of changes, visit the [changelog](https://github.com/XRPLF/xrpl.js/blob/develop/HISTORY.md).

## Start Building

To get started using xrpl.js, see [this tutorial on xrpl.org](https://xrpl.org/get-started-using-javascript.html), or check out the [project repo](https://github.com/XRPLF/xrpl.js) or [reference documentation](https://js.xrpl.org/).

If you already have a project that uses ripple-lib, migrate today! We have a [migration guide for moving your code from ripple-lib v1.10 to xrpl.js v2.0](https://xrpl.org/xrpljs2-migration-guide.html).

We hope you enjoy building the Internet of Value, and feel welcome to reach out to the XRP Ledger developer community if you have any questions!

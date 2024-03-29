---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-04-06
labels:
    - xrpl-py Release Notes
author: Team RippleX
---
# Introducing xrpl-py for Pythonistas

Today, [RippleX](https://ripple.com/) and the [XRP Ledger Foundation (XRPLF)](https://xrplf.org/) are excited to announce the launch of [`xrpl-py`](https://github.com/XRPLF/xrpl-py), a pure Python implementation for interacting with the XRP Ledger. The `xrpl-py` library simplifies the hardest parts of XRP Ledger interaction—like serialization and transaction signing—by providing native Python methods and models for [XRP Ledger transactions](https://xrpl.org/transaction-formats.html) and [core server API](https://xrpl.org/api-conventions.html) ([rippled](https://github.com/ripple/rippled)) objects.

<!-- BREAK -->

Python is one of the most popular programming languages in the world. This library opens up a significant amount of XRP Ledger functionality to Python developers, whether they are just learning to code or have been working in the language for years. Data scientists and engineers working on machine learning will find it far easier to work with and build on top of the XRP Ledger by using this library as part of their Python-based toolkit.

Previously, the only actively maintained libraries were for [JavaScript](https://github.com/ripple/ripple-lib) or [Java](https://github.com/XRPLF/xrpl4j). To do any extensive work with the XRP Ledger, Python developers had to either switch to a less familiar language or rely on libraries whose shelf life was unclear. All of this is now available natively, as an easy-to-use library that is friendly to crypto newbies.

The `xrpl-py` library offers a range of features including:

* Serializing, signing, and submitting transactions
* [Cryptographic key generation](https://github.com/XRPLF/xrpl-py#manage-keys-and-wallets)  
* [Converting between X-Addresses and classic addresses](https://github.com/XRPLF/xrpl-py#encode-addresses)
* Retrieving account information, including balances
* [Model objects for all transaction types](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.models.transactions.html)     and all core server [requests](https://xrpl-py.readthedocs.io/en/latest/source/xrpl.models.requests.html)

We think of `xrpl-py` v1.0.0 as the first step in a longer journey. We built  `xrpl-py` as part of our larger goal to facilitate development on the XRP Ledger by decreasing the learning curve, creating more inclusive tools and expanding the choice of programming languages.

The feature set for the first available version is limited but it implements the most common use cases of XRP Ledger development. We're working on adding new features to `xrpl-py` and aim to include everything else the XRP Ledger offers within the library soon. We plan on using this framework to create even more libraries for the XRP Ledger in other languages in the near future.

Since we designed `xrpl-py` to be usable for a wide range of developer levels, you can find the functionality that matches your skill level. For beginners, the library offers several higher-level functions that abstract away a lot of details and provide useful developer interfaces. More experienced developers can access the lower-level methods and functions to build more complex projects. Overall, `xrpl-py` closely mirrors the underlying [core server API](https://xrpl.org/rippled-api.html) so even developers who have built directly on the core server in the past should find the structure of the project familiar.

While the team at RippleX built the first release of `xrpl-py`, we did this while taking input from the community. We feel that libraries like `xrpl-py` work best when they are owned, used, and supported by a large and thriving community of excited developers. To that end, we contributed the code to the XRPLF, who are hosting the source code under their [GitHub organization](https://github.com/XRPLF), which features a growing number of libraries and other developer tools.

To get started, see [this tutorial](https://xrpl.org/get-started-using-python.html) on xrpl.org, check out the [README in the project repo](https://github.com/XRPLF/xrpl-py#xrpl-py), or go right to the [reference documentation](https://xrpl-py.readthedocs.io/).

For more discussion about developing on the XRP Ledger, catch the [RippleXDev stream](https://www.twitch.tv/ripplexdev) on Twitch!

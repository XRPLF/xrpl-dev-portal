---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-02-24
labels:
    - rippled Release Notes
---
# Road to XRP Ledger 1.7: Improving Efficiency and Security

Today, [version 1.7.0](https://xrpl.org/blog/2021/rippled-1.7.0.html) of the reference implementation of the software behind the XRP Ledger (XRPL) was released with key contributions from RippleX aimed at improving the Ledger’s decentralization, security and efficiency.

In this post, RippleX breaks down some of the changes and highlights in the release.

<!-- BREAK -->

## Release Highlights: Improvements for Validators, Server Operators

As a part of our commitment to the XRP Ledger, RippleX continued to work on improving the use of available system resources and making the software work efficiently on various server configurations. Building on previously contributed improvements, a new set of changes has [slashed memory usage by 50%](https://blog.ripplex.io/how-ripples-c-team-cut-rippleds-memory-footprint-down-to-size/). Part of these memory savings came directly from Ripple CTO [David Schwartz](https://twitter.com/JoelKatz), who implemented a change that eliminates a layer of caching to further improve memory and execution time.

Other optimizations include: improved validation and proposal routing, which benefit operators of single servers and large clusters alike, and validator manifests, which are now propagated widely and more efficiently over the peer network—giving greater visibility into the overall ecosystem of operators.

Also being introduced today is **forward ledger replay**—a pivotal improvement to XRPL that enhances security and reduces the amount of bandwidth needed by allowing servers to more easily retain synchronization with the rest of the network. This is an experimental feature that can be enabled via options.

Proposed and agreed upon by XRPL server operators, the features in this latest release of the code demonstrates a shared commitment to improving the XRP Ledger’s performance, innovation and decentralization.


## Looking Ahead

Today’s release is another step in the continuous evolution of the XRPL. Feature updates, such as those being introduced today, are reviewed and voted on by the XRPL’s network operators and help improve its capabilities.

[The XRP Ledger Foundation](https://xrplf.org/)—whose goal is to accelerate the development and adoption of XRPL by engaging developers—will also play an active role in maintaining XRPL’s infrastructure and default [Unique Node List (UNL)](https://xrpl.org/faq.html#validators-and-unique-node-lists) in the future.

“Enhancements, such as today’s improvements to memory usage, are key to growth and innovation on the Ledger,” says Bharath Chari of the XRP Ledger Foundation. “We look forward to supporting the wider ecosystem, including the superb code development by the RippleX team. Testament to this will be our focus on producing an evolving list of validators and enhancing the core code and infrastructure behind the XRP Ledger."

RippleX is one contributor to this growing XRPL community. As such, we look forward to continuing our commitment to developing best-in-class functionalities, tools and open protocols that help developers to build trust and utility on the XRP Ledger.

For details on feature updates in XRPL 1.7.0, visit XRPL.org(https://xrpl.org/) .

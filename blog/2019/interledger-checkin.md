---
labels:
    - Features
category: 2019
date: 2019-04-03
theme:
    markdown:
        editPage:
            hide: true
---
# Interledger Check-in

Here at Ripple, we've been eagerly following and contributing to the progress of [Interledger](https://interledger.org), a neutral standard for connecting all money systems into an Internet-like network of networks. Since finalizing the core protocol suite in late 2017, contributors from a variety of companies and backgrounds have been working hard on growing the ecosystem with implementations and infrastructure. Progress has been rapid and wild, so we thought we'd help make sense of it by checking in to see where Interledger stands today.

<!-- BREAK -->

## Interledger is for Interoperability

First, some review for those who aren't familiar with Interledger: it's a protocol suite for enabling the Internet of Value. There's no Interledger coin or token, no chain of blocks with a shared set of state and balances, and no company or country who decides what you can do with it. The Interledger project is about taking a step away from the technological race of building [the best ledger](https://developers.ripple.com/xrp-ledger-overview.html), and instead bringing all ledgers together into a single interconnected network—creating an "Interledger" the same way that the Internet connected a bunch of individual networks into one massive "Internet".

Ripple's own Evan Schwartz provides [a great intro to Interledger's key features and design choices](https://medium.com/xpring/interledger-how-to-interconnect-all-blockchains-and-value-networks-74f432e64543), and a more detailed look at [why Interledger is structured as a layered protocol suite](https://medium.com/xpring/layer-3-is-for-interoperability-ca387fa5f7e2).

## Developing on Interledger

When you build a blockchain-connected application or service, you get access to payments and data from that one blockchain. If you want access to payments and data from another blockchain or centralized system, you have to repeat that work for the new system. Building on Interledger lets you abstract away the differences between the underlying technologies. If your app can send and receive Interledger payments, you get free access to more and more payments systems and currencies as the Interledger grows.

### Production and Testnet

Right now, Interledger is being used in production by a small number of finance tech pioneers, including [Coil][], [Kava](https://kava.io/), [Strata](https://www.stratalabs.io/), and the [XRPTipBot](https://www.xrptipbot.com/). Thanks to these developers and the XRP Ledger's robust [payment channel](http://developers.ripple.com/payment-channels.html) functionality, it's easy to get started sending and receiving XRP through Interledger today.

If you're not ready to use real money yet, you can start by [building on the Interledger Testnet using the Moneyd server](https://medium.com/interledger-blog/using-moneyd-to-join-the-ilp-testnet-ba64bd42bb14). Moneyd provides a quick on-ramp as the "home router" of the Interledger, giving apps on your computer access to send and receive money. Although Moneyd can just as easily connect to the production Interledger, it is not currently designed for heavy production use, so it lacks features like budgeting that would let you give apps different spending limits and permissions levels.

Production users can run the [ILP Connector reference implementation](https://github.com/interledgerjs/ilp-connector) directly using [Kubernetes](https://kubernetes.io/) or a similar system. The Coil team has also just recently introduced an [alternative ILP Connector implementation called Rafiki](https://medium.com/interledger-blog/introducing-rafiki-e3de4710d3de), which is well-positioned to become a major component of the Interledger ecosystem.


## Interledger Use Cases

The Interledger ecosystem is still relatively small today; you can't yet pay your utility bills or buy a coffee through Interledger. Existing payment systems with strong network effects, like PayPal, Venmo, and Alipay, are already pretty effective at serving those use cases, especially within regions where they're in widespread use. One case that Interledger already serves much better than legacy payment systems is **micropayments**.

Micropayments are payments that are too small to be worth thinking about individually. To date, businesses have had to work around the need for micropayments by using subscription models or advertisement revenue. The fact that Interledger can stream tiny payments provides an alternative, where systems can charge per-use fees, without needing to ask and prompt a person to decide about every individual purchase. Two examples of standards building upon this advantage today are **web content monetization** and **decentralized app hosting**.

### Web Content Monetization

[Web monetization](https://interledger.org/rfcs/0028-web-monetization/) is a standard designed as part of the Interledger Protocol Suite to allow micropayments to stream from a content consumer to a creator as payment for consuming content. [Coil][] users today automatically pay out to content creators—including websites, YouTube channels, and Twitch streams—if those creators enable web monetization. Receiving micropayments via web monetization is as simple as setting up a payment pointer, then adding a [single `<meta>` tag](https://interledger.org/rfcs/0028-web-monetization/#examples) to your website's HTML code.

### Decentralized App Hosting

Decentralized apps, or DApps, are an emerging trend in finance technology that have developed from the idea of smart contracts. One of the big challenges with decentralized apps is scaling: existing decentralized apps mostly run on a blockchain like Ethereum, and every node in the peer-to-peer network must be able to run all smart contracts. [Codius](https://codius.org/) represents a different approach: wrap your DApp in a secure container, and use Interledger to pay for hosting it. Other users, or even the app itself, can also pay for hosting the app. Those who have computing resources to spare can offer to host Codius apps, competing to provide the best reliability and service, without requiring the "all or none" level of commitment that it takes to run a blockchain node.

### Other Use Cases

A variety of other use cases for Interledger are possible, and the viability of some use cases will grow as the ecosystems and tools become more standardized. From [trust-minimized cryptocurrency trading](https://github.com/Kava-Labs/ilp-sdk), to [Quake deathmatches](https://medium.com/interledger-blog/ildeathmatch-monetize-your-quake-games-788b0a7c624c), to pay-for-use APIs, to [crowd-funded power outlets](https://medium.com/@WietseWind/raspberry-pi-interledger-enabled-power-switch-d6966662b04b), there are lots of crazy ideas out there of what you can do when you're [programming with money](https://medium.com/interledger-blog/program-with-money-on-codius-5bec60386c5c).


## You Are Not the Product

An old saying goes, "if you're not paying for the product, you are the product," because advertisements and data collection can derive great profits without charging the apparent customer anything. Of course, these aren't truly free, because ads are manipulative, data collection sacrifices privacy, and the two combined can be even more manipulative. Blockchains, including the XRP Ledger, are the start of something different, but Interledger takes it a step further by providing a level of privacy that blockchains inherently can't.

As a general rule, all data in a [blockchain](https://www.distributedagreement.com/2018/09/24/what-is-a-blockchain/) is public: for all members of a blockchain to reach agreement, they need to know the state of the data to verify its integrity and to progress to the next state. Pseudonyms and mixing of inputs can obscure some of the information, but they can't change the fundamental limitations of blockchain technology.

Interledger is different. Since it's not one single system, there's no need for consensus between distant participants. Transactions between two directly-connected users can stay limited to just those users. With longer-chain payments, most details are encrypted with a key only the sender and receiver know. No one sees all Interledger traffic. Moneyd forwards packets to its "parent" connector but can't read their contents (just a numeric amount and the ILP address the packet is bound for). Moreover, the Moneyd server and all the Interledger reference implementations are provided free of charge and open-source with permissive licenses that grant you the freedom to modify and use them as you like.

## Learn More

The [Interledger Forum](https://forum.interledger.org/) is a great place to ask questions, learn more from the experts, float your ideas, and connect with like-minded individuals who are exploring the future of money.

We're excited to see what you can [BUIDL](https://mashable.com/article/buidl-hodl/) next!

[Coil]: https://coil.com/

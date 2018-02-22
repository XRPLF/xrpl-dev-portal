# XRP Ledger Introduction

The **XRP Ledger** is a decentralized cryptocurrency network. Like all such networks, it's powered by a peer-to-peer server and it enables anyone to send and receive value within the rules of the network. The XRP Ledger is the home of **XRP**, a cryptocurrency which was designed by its creators to bridge the many different currencies preferred by people worldwide. Ripple, the company that stewards development of the XRP Ledger, expects XRP to be a key part of enabling the "Internet of Value": a world in which money moves the way information does today.

## The Best Digital Asset

XRP is the native cryptocurrency of the XRP Ledger. Anyone with a cryptographic key and an internet connection can receive, hold, and send XRP to anyone else. From the beginning, XRP's creators have developed it to be a desirable bridge currency which can facilitate trades in any other currency. XRP has many properties which make it an appealing asset for many other use cases, too:

- **[Censorship-resistant transaction processing][]:** No single party decides which XRP transactions are approved or not, and no one can "roll back" a transaction after it has happened. As long as those who choose to participate in the network keep it healthy, XRP can be sent and received in seconds.
- **[Fast, Efficient Consensus Algorithm][]:** The XRP Ledger's consensus algorithm settles transactions in 4 to 5 seconds, processing at a throughput of up to 1500 transactions per second. These properties put XRP orders of magnitude ahead of other top digital assets.
- **[Finite XRP Supply][]:** When the XRP Ledger began, 100 billion XRP were created, and no more XRP can be created after that. (Each XRP is subdivisible down to 6 decimal places, for a grand total of 100 quintillion "drops" of XRP.) The available supply of XRP decreases slowly over time as small amounts are destroyed to pay transaction costs.
- **[Responsible Software Governance][]:** The XRP Ledger's software is maintained by a team of world-class developers at Ripple, who maintain the security of the network while adding features and stewarding future developments. Ripple acts as a steward for the software and an advocate for its interests, so the XRP Ledger ecosystem has a constructive relationship with governments and financial institutions, not an adversarial one.
- **[Secure, Adaptable Cryptography][]:** The XRP Ledger relies on industry standard digital signature systems like ECDSA (the same scheme used by Bitcoin) but also supports modern, efficient algorithms like Ed25519. The extensible nature of the XRP Ledger's software makes it possible to add and disable algorithms as the state of the art in cryptography advances.
- **[Smart Features for Smart Contracts][]:** The XRP Ledger has features like Escrow, Checks, and Payment Channels to support building cutting-edge financial applications, especially the [Interledger Protocol](https://interledger.org/). This toolbox of advanced features comes with separate double-checks on invariant rules, so even a glitch in the transaction implementation won't cause the XRP Ledger to become inconsistent or corrupt.
- **[On-Ledger Decentralized Exchange][]:** In addition to all the features that make XRP useful on its own, the XRP Ledger also has a fully-functional accounting system for tracking and trading obligations denominated in any way users want, and an exchange built into the protocol. The XRP Ledger can settle long, cross-currency payment paths and exchanges of multiple currencies in atomic transactions, bridging gaps of trust with XRP.

## Censorship-Resistant Transaction Processing
[Censorship-resistant transaction processing]: #censorship-resistant-transaction-processing

With (physical) coins and paper money, individuals can do business without going through a central party. Non-cryptocurrency digital assets all have a central administrator to confirm and validate transactions, who also has the power to censor or roll back transactions, or disallow some individuals from using the digital asset. (For example, if a digital money company decides a person has violated its terms of service, it can freeze or even confiscate that person's money.) XRP and other cryptocurrencies don't have a central administrator, so no one can roll back transactions, freeze XRP balances, or block someone from using them.

**Note:** Non-XRP currencies issued in the XRP Ledger _can_ be frozen. For more information, see the [Freeze documentation](concept-freeze.html).

Furthermore, the XRP Ledger's system of trusted validators uses a small amount of human interaction to achieve better distribution of authority than other decentralized systems. Fully-automated systems for reaching consensus from an unknown set of participants are vulnerable to concentrations of voting power. For example, Bitcoin mining is disproportionately concentrated in places with cheap electricity. As Ripple curates a list of distinct validators operated by different entities in different jurisdictions, the XRP Ledger can become more resistant to censorship and outside pressures than proof-of-work mining. For more information on Ripple's plan to decentralize the recommended set of validators, see the  [Decentralization Strategy Update](https://ripple.com/dev-blog/decentralization-strategy-update/).


## Fast, Efficient Consensus Algorithm
[Fast, Efficient Consensus Algorithm]: #fast-efficient-consensus-algorithm

The XRP Ledger's biggest difference from most cryptocurrencies is that it uses a unique consensus algorithm that does not waste time and energy on "mining", the way Bitcoin, Etherium, and almost all other such systems do. Instead of "proof of work" or even "proof of stake", The XRP Ledger's consensus algorithm uses a system where every participant has an overlapping set of "trusted validators" and those trusted validators efficiently agree on which transactions happen in what order. A single Bitcoin transaction wastes more electricity than a family home in the USA uses in an entire day, and confirming the transaction takes hours. A single XRP transaction uses a negligible amount of electricity, and takes 4 or 5 seconds to confirm. Furthermore, each new "ledger version" in the XRP Ledger (the equivalent of a "block") contains the full current state of all balances, so a server can synchronize with the network in minutes instead of spending hours downloading and re-processing the full transaction history.

For more information on how the XRP Ledger's consensus algorithm works, see [The XRP Ledger Consensus Process](concept-consensus.html). For background on why the XRP Ledger uses a consensus algorithm, see [Reaching Consensus In the XRP Ledger](concept-reaching-consensus.html).


## Finite XRP Supply
[Finite XRP Supply]: #finite-xrp-supply

Alongside war and political turmoil, hyperinflation is one of the leading causes of death for currencies. While the decentralized system of validators provides XRP with some resistance to political factors, the rules of the XRP Ledger provide a simpler solution to hyperinflation: the total supply of XRP is finite. Without a mechanism to create more, it becomes much less likely that XRP could suffer hyperinflation.

The supply of XRP available to the general _does_ change due to a few factors:

- Sending transactions in the XRP Ledger destroys a small amount of XRP. Senders choose how much to destroy, with certain minimums based on the expected work of processing the transaction and how busy the network is. If the network is busy, potential transactions that promise to destroy more XRP can cut in front of the transaction queue. This is an anti-spam measure to make it prohibitively expensive to [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) the XRP Ledger network. For more information, see [Transaction Cost](concept-transaction-cost.html).
- Each account in the XRP Ledger must hold a small amount of XRP in reserve. This is an anti-spam measure to disincentivize making the ledger data occupy too much space. XRP Ledger validators can vote to change the amount of XRP required as a reserve, to compensate for changes in XRP's real-world value. (The last time this happened was in December 2013, when [the reserve requirement decreased from 50 XRP to 20 XRP](https://ripple.com/insights/proposed-change-to-ripple-reserve-requirement-2/).) If the reserve requirement decreases, XRP that was previously locked up by the reserve becomes available again.
- Ripple (the company) holds a large reserve of XRP in escrow. At the start of each month, 1 billion XRP is released from escrow for Ripple to use. (Ripple uses XRP to incentivize growth in the XRP Ledger ecosystem and sells XRP to institutional investors.) At the end of each month, any remaining XRP the company does not sell or give away is stored into escrow for a 54-month period. For more information on Ripple's escrow policy, see [Ripple Escrows 55 Billion XRP for Supply Predictability](https://ripple.com/insights/ripple-to-place-55-billion-xrp-in-escrow-to-ensure-certainty-into-total-xrp-supply/). For more information on the technical capabilities of the Escrow feature, see [Escrow](concept-escrow.html).


## Responsible Software Governance
[Responsible Software Governance]: #responsible-software-governance

Any piece of software can only be as good as the developers who code and manage it. Ripple employs a team of world-class engineers dedicated full-time to maintaining and improving the XRP Ledger software, especially the core server, `rippled`. The [source code for `rippled`](https://github.com/ripple/rippled/) is available to the public with a permissive open-source license, as are many other parts of the XRP Ledger ecosystem. Ripple engineers follow best practices for software engineering, including:

- A famously strict and thorough code review process
- Comprehensive code coverage and unit tests
- Regularly running automated checks for potential vulnerabilities and memory leaks
- Regularly commissioning external reviews by professional organizations

The XRP Ledger also has a built-in "Amendments" system for evolving the existing feature set and transitioning from old rules to new ones. Rather than fracturing the ecosystem or causing uncertainty whenever a transition occurs, any changes to transaction processing in the XRP Ledger are switched on by Amendments that require sustained approval from validators over 2 weeks, giving everyone time to evaluate the changes before they apply, and upgrade their servers appropriately. The system also prevents outdated servers from reporting incorrect data when the rules of the network have changed. For more on how Amendments work, see [Amendments](concept-amendments.html).


## Secure, Adaptable Cryptography
[Secure, Adaptable Cryptography]: #secure-adaptable-cryptography

Cryptography is one of the hardest parts of any distributed system, and a mistake can lead to money stolen by malicious actors anywhere in the world. The XRP Ledger uses industry-standard schemes for signing and verifying transactions, algorithms that have successfully protected hundreds of billions of US dollars' worth of value for many years. The XRP Ledger also layers multi-signing functionality so you can use multi-factor authorization or split keys across multiple people as a backup, and provides new algorithms with a path to migrate the keys you use if a breakthrough in cryptography makes the old algorithms obsolete.

For more information, see [Cryptographic Keys](concept-cryptographic-keys.html) and [Multi-signing](reference-transaction-format.html#multi-signing).


## Smart Features for Smart Contracts
[Smart Features for Smart Contracts]: #smart-features-for-smart-contracts

Besides simple value transfer via XRP payments, the XRP Ledger has several advanced features that provide useful functions for building applications that use Internet of Value to serve previously unknown or impractical needs. Rather than running applications as "smart contracts" in the network itself, the XRP Ledger provides tools for contracts, while letting the applications themselves run anywhere, in whatever environment or container is appropriate. This "keep it simple" approach is flexible, scalable, and powerful.

A sample of advanced features in the XRP Ledger:

- [Payment Channels](tutorial-paychan.html) allow asynchronous balance changes as fast as you can create and validate signatures.
- [Escrow](concept-escrow.html) locks up XRP until a dedicated time or cryptographic condition.
- [DepositAuth](concept-depositauth.html) lets an address decide who can send it money and who can't.
- And of course, there's the [decentralized exchange](#on-ledger-decentralized-exchange) for trading obligations on-ledger...

To ensure that the various functions of the XRP Ledger function as intended, a second layer of protections, called "Invariant Checking" confirms that every transaction follows strict rules and fails transactions that result in behavior outside the defined constraints. With invariant checking, even a bug in transaction processing can't do things like create XRP, delete important data, or cause objects in the ledger to change formats unexpectedly. For more information, see [Protecting the Ledger: Invariant Checking](https://ripple.com/dev-blog/protecting-ledger-invariant-checking/).


## On-Ledger Decentralized Exchange
[On-Ledger Decentralized Exchange]: #on-ledger-decentralized-exchange

One of the biggest features that sets the XRP Ledger apart from other cryptocurrency networks is that it also contains a full currency exchange that runs on the XRP Ledger. Within this system, businesses (typically called "gateways") can freely issue any currency they want to customers, and those customers can freely trade issued currencies for XRP or other issued currencies issued by any gateway. The XRP Ledger can execute atomic cross-currency transactions this way, using orders in the exchange to provide liquidity.

For more information on how the decentralized exchange works, see [Money in the XRP Ledger](concept-money.html) and [Lifecycle of an Offer](reference-transaction-format.html#lifecycle-of-an-offer). For more information on the gateway business model, see the [Gateway Guide](tutorial-gateway-guide.html).

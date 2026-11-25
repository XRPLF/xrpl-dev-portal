---
category: 2026
date: "2026-11-25"
template: '../../@theme/templates/blogpost'
seo:
    description: Learn who runs XRPL validators, what they do, why they earn no direct reward, and why that matters for institutions.
labels:
    - General
markdown:
    editPage:
        hide: true
---
# XRPL Validators: Who Runs the XRP Ledger, and What They Get Out of It

The XRP Ledger has no central operator. It is maintained by a global network of independent servers, and a smaller group of them called validators confirm which transactions are final. These validators are established businesses, universities, and market participants who rely on the ledger and share a stake in its reliability and success. They are vetted, known, and governed through a transparent process, which is exactly what institutions need from the infrastructure they build on.

<!-- BREAK -->

## Who are XRPL validators?

XRPL validators include universities, exchanges, and other known market participants. They run the network because they have a long-term interest in its health. By contributing to the ecosystem, they help it thrive and grow.

There are three things worth understanding about how the XRPL network runs:

* **Nodes:** Computers running the XRPL software (`xrpld`) that keep a copy of the ledger and relay transactions. There are 800+ globally.
* **Validators:** Nodes that are also configured to take part in checking and confirming transactions. There are hundreds of validators globally.
* **UNL validators:** The Unique Node List (UNL) is the recommended list of validators curated by the XRP Ledger Foundation. It currently includes 35 entities, and their votes determine whether changes to the XRPL protocol are adopted. An amendment needs support from more than 80% of UNL validators, held for two weeks, before it activates. <!-- TODO: add link to the full UNL list --> See the full list here.


## What do they do?

All validators on XRPL keep the network safe, stable, and secure by running dedicated computers that check every transaction on XRPL. Through the consensus process, they automatically agree with other validators on which transactions are valid and in what order. That agreement happens every three to five seconds.

UNL validators, specifically, are relied on by all other validators who use them to assess agreement. The stability and reliability of a validator is dependent on a nominated set of peers (other validator nodes) which it assesses agreement with. Most validators use the UNL validators for this peer assessment work. This results in the UNL ensuring reliability, stability and governance of the network.

UNL validators are globally distributed and include universities, exchanges and companies, non-profits and independent market participants and operators that build on the XRP Ledger, with servers across Europe, North America, Asia-Pacific and the Middle East. The current validator list is public. Anyone can see who is validating right now and how each one is voting by visiting [XRPScan](https://xrpscan.com/validators). Learn more about [how validators run](/docs/infrastructure/configuration/server-modes/run-xrpld-as-a-validator).


## What does it take to become a UNL validator?

The XRP Ledger Foundation (XRPLF) curates and publishes the default Unique Node List (dUNL) through a transparent application and evaluation process, selecting candidates that have established a proven operating history as independent, non-UNL mainnet validators. Applicants first build a track record running a validator outside the UNL. They are then reviewed on technical performance, security, community standing and four diversity factors: geography, geopolitics, hosting provider and industry. <!-- TODO: add link to the UNL application guide --> Read the UNL application guide.


## Why there is no direct financial reward for validating

Paying validators can attract extractive players who are there for the return, not for the network's success. XRPL consensus is designed to ensure coordination and forward progress while avoiding competitive use of resources, so the XRP Ledger offers no direct reward for validating. That attracts natural stakeholders, businesses and institutions that benefit from the ledger's reliability, stability, and performance. David Schwartz, CTO Emeritus and one of the chief architects of the XRP Ledger, explored this design choice in his talk "The Best Incentive Is No Incentive" at the Stanford Blockchain Conference. <!-- TODO: add link to the talk --> Operating a validator yields an indirect financial return by safeguarding the performance and reliability of the network powering participant operations.

### The consolidation problem on other chains

On chains that pay staking rewards, operational costs can act as a barrier to participation and validator counts can fall. As the set shrinks, stake concentrates among fewer entities, and fewer parties would need to collude to compromise the network. Over time, yield-driven participation tends toward consolidation, with growing censorship and single-point-of-failure risk.

Research supports this pattern. Common staking reward designs have been shown to compound the advantage of larger holders, even when every participant follows the rules. XRPL avoids this by design. Without stake or rewards, influence cannot be bought or built up over time.

### Less regulatory exposure

With no reward for validating, there is nothing to be characterized as a security or a taxable event.


## Why this matters for institutions

### Known counterparties

On most public blockchains, the validators processing transactions and collecting fees are anonymous. Any institution transacting directly on public Ethereum or Solana has no knowledge of, or control over, which parties they are transacting with. Managing this requires layering permissioned wrappers, regulated intermediaries, and additional compliance infrastructure on top of public rails that were never designed with institutional counterparty requirements in mind. For regulated financial institutions with counterparty due diligence obligations, that is a fundamental compliance exposure that no amount of application-layer complexity fully resolves, because the risk that anonymity introduces is in the infrastructure itself.

### No extra compliance layer

XRPL addresses this at the protocol layer, where the entities participating in consensus are vetted, known, and governed through a transparent process, removing the need for an additional compliance layer on top.

On XRPL, transaction fees are not paid to validators either. They are burned, permanently removed from supply, meaning there is no anonymous party receiving value on the other side of every transaction. The counterparty risk that institutions must architect around on other chains simply does not exist on XRPL.

### A stable, intentionally small validator set

On XRPL, the UNL validator set is small by design. UNL validators are the trusted, yet decentralized group that participates in the consensus process by voting on transaction validity. The entities who participate are vetted, known, and governed through a transparent process. That is a deliberate architectural choice, not something that drifted into place over time as economic pressures pushed certain players out and others in. The key difference is a known, governable structure rather than a series of circumstances that have emerged gradually and have proven hard to reverse.

### Governance institutions already recognize

This is a familiar model to institutions. SWIFT is governed by its member institutions. DTCC is governed by a committee of market participants. XRPL's validator model provides decentralized, cryptographically verifiable governance aligned to trust models traditional financial institutions already use, without relying on anonymous rewards like other blockchains.

### No fee collector

On many chains, part of each fee goes to a block producer the sender cannot choose and may not be able to identify, which means paying a party the sender has not screened. On XRPL, the fee is destroyed, so no validator or anyone else is paid from your transaction, and no validator earns more when fees rise.

### A public record of finality

Every validated ledger, its hash and its close time are public, so anyone can prove which validated ledger holds a transaction. Legal finality comes from the legal terms that govern the asset or the arrangement, which can refer to validated ledgers.

### Compliance tools in the ledger

XRPL builds Credentials, Permissioned Domains, a Permissioned DEX, freeze and clawback into the ledger itself. Your own KYC, AML and sanctions duties still apply.

### Security in layers

Every server applies the same rules to every transaction. Each operator secures its own systems, and the XRP Ledger Foundation's criteria ask dUNL validators to meet a higher security standard than ordinary nodes. Ripple sponsors a [bug bounty](https://ripple.com/bug-bounty/) for the core software.


## Get involved

* [Learn how the UNL works](/docs/concepts/consensus-protocol/unl)
* [Run xrpld as a Validator](/docs/infrastructure/configuration/server-modes/run-xrpld-as-a-validator)
* [Validator list on XRPScan](https://xrpscan.com/validators)
* Read the XRP Ledger Foundation's criteria for UNL Validators <!-- TODO: add link -->
* [Learn how Consensus works](/docs/concepts/consensus-protocol)

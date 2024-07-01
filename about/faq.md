---
seo:
    description: Answers to frequently asked questions about the XRP Ledger, the XRPL ecosystem and the community.
subtitle: Answers to Your XRPL Questions
labels:
  - Blockchain
---
###### FAQ
# Answers to Your XRPL Questions

<!--#{ Use H4s for questions and H2s for sections. This keeps the sidebar nav from getting too clustered and allows the faq filter to stylize things as an accordion. #}-->

#### Is XRPL a private blockchain, owned by Ripple?

No, the XRP Ledger is a decentralized, public blockchain. Any changes that would impact transaction processing or consensus need to be approved by at least 80%% of the network. Ripple is a contributor to the network, but its rights are the same as those of other contributors. In terms of validation, there are 150+ validators on the network with 35+ on the default Unique Node List (see [“What are Unique Node Lists (UNLs)?” below](#what-are-unique-node-lists-unls)) — Ripple runs [only 1](https://foundation.xrpl.org/2023/03/23/unl-update-march-2023/) of these nodes.

#### Isn’t Proof of Work the best validation mechanism?

Proof of Work (PoW) was the first mechanism to solve the double spend problem without requiring a trusted 3rd party. [The XRP Ledger’s consensus mechanism](../docs/concepts/consensus-protocol/index.md) solves the same problem in a far faster, cheaper and more energy efficient way.

#### How can a blockchain be sustainable?

It’s been widely reported that Bitcoin’s energy consumption, as of 2021, is equivalent to that used by Argentina, with much of the electricity Bitcoin miners use coming from polluting sources. The XRP Ledger confirms transactions through a “[consensus](../docs/concepts/consensus-protocol/index.md)” mechanism - which does not waste energy like proof of work does - and leverages carbon offsets to be [one of the first truly carbon neutral blockchains](https://ripple.com/ripple-press/ripple-leads-sustainability-agenda-to-achieve-carbon-neutrality-by-2030/).

#### Can currencies other than XRP be traded through XRPL?

Yes, the XRP Ledger was built specifically to be able to tokenize arbitrary assets, such as USD, EUR, Oil, Gold, reward points, and more. Any currency can be issued on the XRP Ledger. This is illustrated by XRPL’s growing community that backs a variety of fiat and crypto tokens.

#### Isn’t XRPL only for payments?

Although XRPL was initially developed for payment use cases, both the ledger and its native digital asset XRP are increasingly popular for a range of innovative blockchain use cases such as NFTs. New standards proposals for an automated market maker (AMM), hooks amendment for smart contract functionality, and cross-chain bridges are all currently works in progress.

## Validators and Unique Node Lists

#### What service do transaction validators provide?

All nodes ensure that transactions meet protocol requirements, and are therefore “valid.” The service that validators uniquely provide is administratively grouping transactions into ordered units, agreeing on one such ordering specifically to prevent double spending. <!-- STYLE_OVERRIDE: therefore -->

See [Consensus](../docs/concepts/consensus-protocol/index.md) for more information about the consensus process.


#### How much does it cost to run a validator?

Running a validator does not require any fees or XRP. It is comparable in cost to running an email server in terms of its electricity use.


#### What are Unique Node Lists (UNLs)?

UNLs are the lists of validators a given participant believes will not conspire to defraud them. Each server operator can choose their own UNL, usually based on a default set provided by a trusted publisher. (A default set from a publisher is sometimes called a default UNL, or _dUNL_.) <!-- STYLE_OVERRIDE: will --> <!-- SPELLING_IGNORE: dUNL -->


#### Which UNL should I select?

Since anybody can run a validator, the burden is on the network participants to choose a reliable set. Currently, the XRP Ledger Foundation and Ripple are known to publish recommended default lists of high quality validators, based on past performance, proven identities, and responsible IT policies.  However, every network participant can choose which validators it chooses as reliable and need not follow one of the publishers noted above.


#### If Ripple recommends adoption of its UNL, doesn't that create a centralized system?

No. The XRP Ledger network is opt-in. Each participant directly or indirectly chooses its UNL. If Ripple stops operating or acts maliciously, participants can change their UNLs to use a list from a different publisher.


#### What is the incentive structure for validators?

The primary incentive to run a validator is to preserve and protect the stable operation and sensible evolution of the network. It is the validators who decide the evolution of the XRP Ledger, so any business that uses or depends on the XRP Ledger has an inherent incentive to ensure the reliability, and stability of the network. Validators also earn the respect and goodwill of the community by contributing this way.

If you run an XRP Ledger server to participate in the network, the additional cost and effort to run a validator is minimal. This means that additional incentives, such as the mining rewards in Bitcoin, are not necessary. Ripple avoids paying XRP as a reward for operating a validator so that such incentives do not warp the behavior of validators.

For examples of how incentives can warp validation behavior, read about [miner extractable value (MEV)](https://arxiv.org/abs/1904.05234).


#### Can financial institutions set up transaction validators to help them meet specific institutional standards and requirements?

No, institutions cannot set up customized validator policies for choosing to allow some transactions and reject others. Validators either follow the protocol, or they do not. If software does not follow protocol rules, it does not function. Thus, it is not recommended that institutions seek out custom implementations without in-house expertise.


#### What happens if more than 20% of nodes within the network do not agree with the majority? How is the final version of the ledger chosen?

Normally, if there is a dispute about the validity of one transaction, that transaction gets pushed back until the majority can come to an agreement. But if more than 20% of the network did not follow the same protocol rules as the majority, the network would temporarily halt. It could resume when participants reconfigure their UNLs based on those who want to reach consensus with each other. This temporary processing delay is desired rather than double spending.

In the process of determining the authoritative version of a ledger, there may be multiple temporary internal versions. Such internal versions naturally happen in distributed systems because not all nodes receive transactions in the same order. The analogous behavior in Bitcoin is where two servers each see a different longest chain because two blocks were mined at about the same time.

However, there can be only one latest _validated_ ledger version at any given time; other versions are irrelevant and harmless.

For more information about how the XRP Ledger's consensus mechanism behaves in adverse situations, see [Consensus Protections Against Attacks and Failure Modes](../docs/concepts/consensus-protocol/consensus-protections.md).


#### Does the XRP Ledger have a formal process for adding validators?

No, a formal process for adding validators is not compatible with the XRP Ledger, because it is a system with no central authority.

Publishers of individual default UNLs set their own policies for when to add or remove validators from their lists of recommendations.

For recommendations and best practices, see [Run `rippled` as a Validator](../docs/infrastructure/configuration/server-modes/run-rippled-as-a-validator.md).


#### If the dUNL has the most influence on the network, then is the XRPL centralized?
Validators can choose to not use the dUNL, or any widely-used UNL for that matter. Anyone can create a new UNL at any time.

There can be multiple UNLs in use on the same network. Each operator can customize their server's own UNL or choose to follow a different recommended list. All these servers can still run the same chain and reach consensus with one another.

However, if your UNL does not have enough overlap with the UNLs used by others, there is a risk that your server forks away from the rest of the network. As long as your UNL has > 90% overlap with the one used by people you're transacting with, you are completely safe from forking. If you have less overlap, you may still be able to follow the same chain, but the chances of forking increase with lower overlap, worse network connectivity, and the presence of unreliable or malicious validators on your UNL.


## Role of XRP


#### What purpose does XRP serve?

XRP was created as the XRP Ledger's native asset to empower a new generation of digital payments—faster, greener, and cheaper than any previous digital asset. It also serves to protect the ledger from spam, and to [bridge currencies](../docs/concepts/tokens/decentralized-exchange/autobridging.md) in the XRP Ledger's decentralized exchange, when doing so is beneficial to users. Over time, the XRP Ledger community has pioneered new [use cases](/about/uses) for XRP as well as the XRP Ledger itself.


#### How does the XRP Ledger respond to transaction floods?

The XRP Ledger is designed to set the [transaction cost](../docs/concepts/transactions/transaction-cost.md) dynamically based on demand as an anti-spam measure. The impact of any potential XRP manipulation is minimized by increases in network size as the market cap and transaction volume increase.


#### What about money laundering and suspicious economic activity?

<!-- STYLE_OVERRIDE: regarding -->

The XRP Ledger network is an open network, and all transactions are publicly visible.

Ripple is committed to monitoring and reporting any AML flags across the XRP Ledger network, as well as reporting suspicious activity to FinCEN as applicable.

[XRP Forensics / xrplorer](https://xrplorer.com/) maintains an advisory list to track and minimize money laundering, scams, fraud, and illicit use of the XRP Ledger. Exchanges and other service providers can use this service to prevent and react to financial crimes.


## Security Concerns


#### What is the process for reviewing third-party code contributions?

The code contribution process starts with a developer opening a [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) to a source code repository such as the [`rippled` repository](https://github.com/xrplf/rippled/), which contains Ripple's reference implementation of the core XRP Ledger server and protocol.

This pull request triggers automated unit and integration tests, as well as code reviews by several developers who, typically, have significant expertise in the area of code that the pull request affects.

Once the pull request passes automated tests and receives approvals from reviewers, a trusted [maintainer of the repo](https://opensource.guide/best-practices/) can stage it for inclusion in the next beta.


#### Does Ripple own or control the XRP Ledger or XRP Ledger network?

No, Ripple does not own or control the XRP Ledger or XRP Ledger network.

Ripple contributes to a reference implementation of the core XRP Ledger server ([`rippled`](https://github.com/xrplf/rippled)) and employs a team of engineers who contribute to the open-source codebase. Ripple periodically publishes pre-compiled binary packages of the software for convenience. Anyone can [download and compile the software from source](../docs/infrastructure/installation/index.md).

Several entities publish recommended validator lists (UNLs). As of July 2023, Ripple runs only 1 of the 35 validators in the default UNL.


#### Does the XRP Ledger distinguish between the codebase for validation and the one for user software?

Yes. There are several [XRP Ledger client libraries](../docs/references/client-libraries.md) which are intended for user software developers. These libraries have different codebases and repositories from the [core XRP Ledger server](../docs/concepts/networks-and-servers/index.md) which powers the network and validates transactions.

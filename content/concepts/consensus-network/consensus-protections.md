# Consensus Protections Against Attacks and Failure Modes

The XRP Ledger Consensus Protocol is a _byzantine fault tolerant_ consensus mechanism, which means it's designed to operate even if all kinds of things can go wrong: participants depend on an unreliable open network to communicate, and malicious actors may be attempting to control or interrupt the system at any given time. On top of that, the set of participants in the XRP Ledger Consensus Protocol isn't known in advance and can change over time.

Confirming transactions in a timely manner while maintaining [the desired properties of the network](intro-to-consensus.html#consensus-protocol-properties) is a complex challenge, and it's impossible to build a perfect system. The XRP Ledger Consensus Protocol is designed to work as well as it can in most situations, and to fail as gracefully as possible in the situations where it can't.

This page describes some of the types of challenges that the XRP Ledger Consensus Protocol faces and how it handles them.

## Individual Validators Misbehaving

_Validators_ are servers who actively contribute to the process of deciding each new ledger version. Validators only have an influence over servers configured to trust them (including indirectly). Consensus can continue even if some validators are misbehaving, including a large variety of failure cases, such as:

- Being unavailable or overloaded.
- Being partially disconnected from the network, so their messages reach only a subset of participants without delay.
- Intentionally behaving with intent to defraud others or halt the network.
- Behaving maliciously as a result of pressure from outside factors, such as threats from an oppressive government.
- Accidentally sending confusing or malformed messages due to a bug or outdated software.

In general, consensus can continue without problems as long as only a small percentage (less than about 20%) of trusted validators are misbehaving at a given time. (For the exact percentages and the math behind them, see the latest [Consensus Research](consensus-research.html).)

If more than about 20% of validators are unreachable or not behaving properly, the network fails to reach a consensus. During this time, new transactions can be tentatively processed, but new ledger versions cannot be validated, so those transactions' final outcomes are not certain. In this situation, it would become immediately obvious that the XRP Ledger is unhealthy, prompting intervention from human participants who can decide whether to wait, or reconfigure their set of trusted validators.

The only way to confirm invalid transactions—such as those spending money that has already been spent, or otherwise breaking the rules of the network—would be if more than about 80% of trusted validators colluded to confirm those transactions. In other words, a large majority of trusted validators would have to misbehave in the exact same way. With dozens of trusted validators run by different people and businesses in different parts of the world, this would be very difficult to achieve intentionally.


## Software Vulnerabilities

As with any software system, bugs (or intentionally malicious code) in the implementation of the XRP Ledger Consensus Protocol, commonly deployed software packages, or their dependencies, are a problem to be taken seriously. Even bugs that simply cause a server to crash when it sees carefully-crafted inputs can be abused to disrupt the progress of the network. Ripple has a number of precautions in place to address this threat, including:

- An [open-source code base](https://github.com/ripple/rippled/), so any member of the public can review, compile, and independently test the relevant software.
- A thorough and robust code review process for all changes to the official XRP Ledger repositories.
- Digital signatures from Ripple employees on all releases and official software packages.
- Regularly-commissioned professional reviews for security vulnerabilities and insecurities.
- A [bug bounty program](https://ripple.com/bug-bounty/) that rewards security researchers who responsibly disclose vulnerabilities.


## Sybil Attacks

A _[sybil attack](https://en.wikipedia.org/wiki/Sybil_attack)_ is an attempt to take control of a network using a large number of fake identities. In the XRP Ledger, a sybil attack would take the form of running a large number of validators, then convincing others to trust those validators. This sort of attack is theoretically possible, but would be very difficult to accomplish because human intervention is necessary for validators to become trusted.

No matter how many validating servers a would-be attacker runs, those servers have no say on what the existing participants consider validated unless those participants choose to trust the attacker's validators. Other servers only listen to the validators they are configured to trust, either through a validator list or explicit configuration. (See [validator overlap requirements](#validator-overlap-requirements) for a summary of how the default validator list works.)

This trust does not happen automatically, so performing a successful sybil attack would involve the difficult work of convincing targeted humans and businesses to reconfigure their XRP Ledger servers to trust the attacker's validators. Even in the case that one individual entity was fooled into doing so, this would have a minimal impact on others who do not change their configurations.


## 51% Attack

A "51% attack" is an attack on a blockchain system where one party controls more than 50% of all mining or voting power. (Technically, the attack is slightly misnamed because _any_ amount over 50% is enough.) The XRP Ledger is not vulnerable to a 51% attack because it does not use mining in its consensus mechanism. The next closest analogue for the XRP Ledger is a [sybil attack](#sybil-attacks), which would also be difficult to accomplish.


## Validator Overlap Requirements

For all participants in the XRP Ledger to agree on what they consider validated, they must start by choosing a set of trusted validators that are fairly similar to the sets chosen by everyone else. In the worst case, less than about 90% overlap could cause some participants to diverge from each other. For that reason, Ripple publishes a signed list of recommended validators, including trustworthy and well-maintained servers run by the company, industry, and community.

By default, servers in the network are configured with the URL of Ripple's validator list site, and a cryptographic key that can be used to verify the integrity of lists published to that site. In case the site goes down, the signed updates to the list can also be relayed directly among servers in the XRP Ledger's peer-to-peer network.

Participants can configure their own list sites or explicitly choose validators to trust on an individual basis, but Ripple does not recommended because doing so could cause you to diverge from the rest of the network and lose money as a result.

Research is ongoing to design an improved consensus protocol that allow more heterogeneous validator lists. For more information, see the [Consensus Research](consensus-research.html) page.


## See Also

- For an **intro-level overview** of consensus, see [Intro to Consensus](intro-to-consensus.html).
- For a **detailed description** of the consensus protocol, see [Consensus](consensus.html).
- For an explanation of the **design decisions and background** behind the consensus protocol, see [Consensus Principles and Rules](consensus-principles-and-rules.html).
- For **academic research** exploring the properties and limitations of the protocol, see [Consensus Research](consensus-research.html).

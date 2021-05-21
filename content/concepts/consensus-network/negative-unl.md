---
html: negative-unl.html
parent: consensus-network.html
status: not_enabled
blurb: Understand how Negative UNL improves the ledger's resilience during partial outages.
---
# Negative UNL

_The Negative UNL feature has a preliminary implementation in `rippled` 1.6.0 so that it can be used in test networks, but is not yet available as an [amendment](amendments.html) to the XRP Ledger protocol. A `NegativeUNL` amendment :not_enabled: may be included in a future XRP Ledger release based on acceptance testing of the preliminary implementation._

The _Negative UNL_ is a feature of the XRP Ledger [consensus protocol](consensus.html) that improves _liveness_, the network's ability to make forward progress during a partial outage. Using the Negative UNL, servers adjust their effective UNLs based on which validators are currently online and operational, so that a new [ledger version](ledgers.html) can be declared _validated_ even if several trusted validators are offline.

The Negative UNL has no impact on how the network processes transactions or what transactions' outcomes are, except that it improves the network's ability to declare outcomes final during some types of partial outages.

## Background

Each server in the XRP Ledger protocol has its own UNL (Unique Node List), a list of validators it trusts not to collude, and each server independently decides when a ledger version is validated based on the consensus when enough of its trusted validators agree on a new ledger version. (The default configuration uses a recommended UNL, signed by Ripple, consisting of validators Ripple considers to be sufficiently unique, reliable, and independent.) The standard quorum requirement is at least 80% of trusted validators must agree.

Therefore, if more than 20% of trusted validators go offline or become unable to communicate with the rest of the network, the network stops validating new ledgers because it cannot reach a quorum. This is a design choice to ensure that no transactions' outcomes can be changed after they are declared final. During such a situation, the remaining servers would still be online and could provide past and tentative transaction data, but could not confirm the final, immutable outcome of new transactions.

However, this means that the network could stop making forward progress if a few widely-trusted validators went offline. As of 2020-10-06, there are 34 validators in Ripple's recommended UNL, so the network would stop making forward progress if 7 or more of them were offline. Furthermore, if one or two validators are out for an extended period of time, the network has less room for disagreement between the remaining validators, which can make it take longer to achieve a consensus.

## Summary

It is not reasonable to expect a diverse set of validators to maintain 100% uptime: many things can cause a validator to become temporarily unavailable, such as: hardware maintenance, software upgrades, internet connectivity problems, targeted attacks, human error, hardware failures, and outside circumstances like natural disasters.

The "Negative UNL" is **a list of trusted validators which are believed to be offline or malfunctioning**, as declared by a consensus of the remaining validators. Validators in the Negative UNL are ignored for determining if a new ledger version has attained a consensus.

When a validator that is on the Negative UNL comes back online and sends consistent validation votes, the remaining validators remove it from the Negative UNL after a short time.

In cases where validators go offline one or two at a time, the remaining validators can use the Negative UNL to gradually adjust their effective UNLs, so that the network only ever needs 80% of the _online_ validators to achieve a quorum. To prevent the network from fragmenting, the quorum has a hard minimum of 60% of _total_ validators.

If more than 20% of validators suddenly go offline all at once, the remaining servers cannot achieve the quorum necessary to validate a new ledger, so no new ledgers could be validated. However, those servers can still make tentative forward progress through successive consensus rounds. Over time, the remaining validators would continue to apply changes to the Negative UNL to the tentative ledgers and adjust their effective UNLs; eventually, if the situation persists, the network could resume fully validating ledgers by using the adjusted Negative UNL from the tentative ledger versions.

Negative UNL has no effect on [stand-alone mode](rippled-server-modes.html) since the server does not use consensus in stand-alone mode.


## Enabling the Negative UNL for Testing

Negative UNL functionality is currently available for testing on [Devnet](parallel-networks.html). You can test the Negative UNL feature by adding or modifying a `[features]` stanza in your `rippled.cfg` file, as described in [Connect Your rippled to a Parallel Network](connect-your-rippled-to-the-xrp-test-net.html).



## How It Works

The Negative UNL is closely tied to the [consensus process](consensus.html) and is designed with safeguards to maintain the continuity and reliability of the network in adverse situations. When all trusted validators are operating normally, the Negative UNL is unused and has no effect. When some validators appear to be offline or out of sync, the Negative UNL rules take effect.

The Negative UNL is intentionally designed to change at a slow rate, to avoid any time-based disagreements about which Negative UNL should apply to a given ledger version's consensus process.


### Reliability Measurement

Each server in the network has a UNL, the list of validators it trusts not to collude. (By default, a server's exact UNL is configured implicitly based on the recommended validator list Ripple publishes.) Each server tracks the _reliability_ of its trusted validators using a simple metric: the percentage of the last 256 ledgers where the validator's validation vote matched the server's view of consensus. In other words:

> Reliability = V<sub>a</sub> ÷ 256

V<sub>a</sub> is the total number of validation votes received for the last 256 ledgers that matched the server's own view of consensus.

This metric of reliability measures the availability of a validator _and_ the behavior of that validator. A validator should have a high reliability score if it is in sync with the rest of the network and following the same protocol rules as the server scoring it. A validator's reliability score can suffer for any of the following reasons:

- The validator's validation votes are not reaching the server due to poor network connectivity between them.
- The validator stops operating or gets overloaded.
- The validator is not following the same protocol rules as the server, for a variety of reasons. Possibilities include misconfiguration, software bugs, intentionally following a [different network](parallel-networks.html), or malicious behavior.

If a validator's reliability is **less than 50%**, it is a candidate to be added to the Negative UNL. To be removed from the Negative UNL, a validator's reliability must be **greater than 80%**.

Each server, including validators, independently calculates reliability scores for all of its trusted validators. Different servers may reach different conclusions about a validator's reliability, either because that validator's votes reached one server and not the other, or because they happened to disagree about specific ledgers more or less often. To add or remove a validator from the Negative UNL, a consensus of trusted validators must agree that a particular validator is above or below the reliability threshold.

**Tip:** Validators track their own reliability, but do not propose adding themselves to the Negative UNL. A validator's measure of its own reliability cannot take into account how successfully its validation votes propagate through the network, so it is less dependable than measurements from outside servers.



### Modifying the Negative UNL

A ledger version is considered a _flag ledger_ if its ledger index is evenly divisible by 256. The Negative UNL can be modified only on flag ledgers. (Flag ledgers occur about once every 15 minutes on the XRP Ledger Mainnet. They may be farther apart in test networks that have low transaction volume.)

Each flag ledger, all of the following changes apply:

1. Changes to the Negative UNL that were scheduled in the previous flag ledger go into effect for the following ledger version. The consensus process for validating this flag ledger itself does not use the scheduled change.

    **Note:** This is one of the only times a ledger's state data is modified without a [transaction](transaction-basics.html) or [pseudo-transaction](pseudo-transaction-types.html).

2. If the Negative UNL is not full, each server proposes adding **up to 1** validator to the Negative UNL from among its trusted validators with less than 50% reliability.
3. If the Negative UNL is not empty, each server proposes removing **up to 1** validator from the Negative UNL. A server can propose removing a validator from the Negative UNL for two reasons:
    - It scores that validator with > 80% reliability.
    - It does not have that validator in its UNL. (If a validator goes down permanently, this rule ensures that it gets removed from the on-ledger Negative UNL after it has been removed from servers' configured UNLs.)
4. If a proposed change to the Negative UNL achieves a consensus, the change is scheduled to go into effect in the following flag ledger. Up to one addition and one removal can be scheduled this way.

The proposals to add and remove validators from the Negative UNL take the form of [UNLModify pseudo-transactions][]. The consensus process determines whether each pseudo-transaction achieves a consensus or gets thrown out, in the same way as other [pseudo-transactions](pseudo-transaction-types.html). In other words, for a particular validator to be added or removed from the Negative UNL, a consensus of servers must propose the same change.

Scheduled and effective changes to the Negative UNL are tracked in the [NegativeUNL object](negativeunl.html) in the ledger's state data.


### Negative UNL Limits

To prevent the network from fragmenting into two two or more sub-networks, the Negative UNL cannot reduce the quorum requirement to less than 60% of the _total_ UNL entries. To enforce this, a server considers the Negative UNL to be "full" if the number of validators on the Negative UNL is 25% (rounded down) of the number of validators in the server's configured UNL. (The 25% is based on the calculation that if 25% of validators are removed, an 80% consensus of the remaining 75% equals 60% of the original number.) If a server considers the Negative UNL to be full, it won't propose new additions to the Negative UNL; but, as usual, the final outcome depends on what a consensus of trusted validators do.


### Choosing From Multiple Candidate Validators

It is possible that multiple validators may be candidates to be added to the Negative UNL, based on the reliability threshold. Since at most one validator can be added to the Negative UNL at a time, servers must choose which validator to propose adding. If there are multiple candidates, the server chooses which one to propose with the following mechanism:

1. Start with the ledger hash of the parent ledger version.
0. Take the public key of each candidate validator.
0. Calculate the exclusive-or value (XOR) of the candidate validator and the parent ledger's hash.
0. Propose the validator the numerically lowest result of the XOR operation.

If there are multiple candidates to be removed from the Negative UNL in a given flag ledger, servers use the same mechanism to choose among them.

This mechanism has several useful properties:

- It uses information that is readily available to all servers and can be calculated quickly.
- Most servers will chose the same result even if they calculated slightly different scores for their trusted validators. This holds even if those servers disagree on which validator is _least_ or _most_ reliable. This even holds in many cases where the servers disagree on whether some validators are above or below the reliability thresholds. Therefore, the network is likely to achieve a consensus on which validator to add or remove.
- It does not always give the same results each ledger version. Therefore, if one proposed change to the Negative UNL fails to achieve a consensus, the network does not get stuck with some servers trying and failing to add or remove that one validator every time. The network can attempt to add or remove a different candidate to the Negative UNL in a later flag ledger.


### Filtering Validations

During [the validation step of the consensus process](consensus.html#validation), validators in the parent ledger's Negative UNL are disabled. Each server calculates an "effective UNL" consisting of its configured UNL with the disabled validators removed, and recalculates its quorum accordingly. (The quorum is always at least 80% of the effective UNL and at least 60% of the configured UNL.) If a disabled validator sends validation votes, servers track those votes for purposes of calculating the disabled validator's reliability measurement, but they do not use those votes towards determining whether a ledger version has achieved a consensus.

**Note:** The Negative UNL adjusts the _total_ trusted validators that the quorum is calculated from, not the quorum directly. The quorum is a percentage but the number of votes is a whole number, so in some cases, reducing the total trusted validators may not change the number of votes required to reach a quorum. For example, if there are 15 total validators, 80% is 12 validators exactly. If you reduce the total to 14 validators, 80% is 11.2 validators, which means that it still requires 12 validators to reach a quorum.

The Negative UNL has no impact on the other parts of the consensus process, such as choosing which transactions to include in the proposed transaction set. Those steps always rely on configured UNL, and the thresholds are based on how many trusted validators are actively participating in the consensus round. Therefore, even a validator that is in the Negative UNL can participate in the consensus process.

### Example

The following example demonstrates how the Negative UNL affects the consensus process:

1. Suppose your server's UNL consists of 38 trusted validators, so an 80% quorum is at least 31 of 38 trusted validators.

{{ include_svg("img/negative-unl-01.svg", "Diagram: Normal case: Negative UNL unused, quorum is 80% of configured validators.") }}

2. Imagine 2 of those validators, named MissingA and UnsteadyB, appear to have gone offline. (Both of them have reliability scores < 50%.) During the consensus process for ledger _N_, many of the remaining validators propose adding UnsteadyB to the negative UNL. The motion passes via a quorum of at least 31 of the remaining validators, and ledger _N_ becomes validated with UnsteadyB scheduled to be disabled.

{{ include_svg("img/negative-unl-02.svg", "Diagram: UnsteadyB is scheduled to be disabled.") }}


3. For ledgers _N+1_ through _N+256_, the consensus process continues without changes.

4. In the next flag ledger, ledger _N+256_, UnsteadyB gets automatically moved from "scheduled" to the "disabled" list in the ledger. Also, since MissingA is still offline, a consensus of validators schedules MissingA to be disabled in the next flag ledger.

{{ include_svg("img/negative-unl-04.svg", "Diagram: UnsteadyB gets disabled and MissingA is scheduled to be disabled, too.") }}

5. For ledgers _N+257_ through _N+512_, the quorum is now 30 of 37 validators.

6. UnsteadyB comes back online in ledger _N+270_. It sends validation votes that agree with the rest of the network for ledgers _N+270_ through _N+511_, giving it a reliability score of > 80%.

{{ include_svg("img/negative-unl-06.svg", "Diagram: UnsteadyB comes back online, but it's still disabled.") }}

7. In the next flag ledger, _N+256_, MissingA gets automatically moved to the disabled list, as scheduled. Meanwhile, a consensus of validators schedule UnsteadyB to be removed from the Negative UNL, due to its improved reliability score.

{{ include_svg("img/negative-unl-07.svg", "Diagram: MissingA is disabled and UnsteadyB is scheduled to be re-enabled.") }}

8. For ledgers _N+513_ through _N+768_, the quorum is 29 of 36 validators. UnsteadyB continues to send validations stably while MissingA remains offline.

9. In flag ledger _N+768_, UnsteadyB gets automatically removed from the disabled list, as scheduled.

{{ include_svg("img/negative-unl-09.svg", "Diagram: UnsteadyB is removed from the disabled list.") }}

10. Eventually, you decide that MissingA is probably not coming back, so you remove it from your server's configured UNL. Your server starts proposing removing MissingA from the Negative UNL each flag ledger thereafter.

{{ include_svg("img/negative-unl-10.svg", "Diagram: After removing MissingA from the configured UNL, it's proposed for removal from the Negative UNL, too.") }}

11. As validator operators remove MissingA from their configured UNLs, their validators vote to also remove MissingA from the Negative UNL. When enough validators have done so, the proposal to remove MissingA achieves a consensus, and MissingA is scheduled, then finally removed from the Negative UNL.

{{ include_svg("img/negative-unl-11.svg", "Diagram: MissingA is removed from the Negative UNL.") }}


## See Also

- **Concepts:**
    - [Consensus Protocol](consensus.html)
- **Tutorials:**
    - [Connect Your `rippled` to a Parallel Network](connect-your-rippled-to-the-xrp-test-net.html)
    - [Run `rippled` as a Validator](run-rippled-as-a-validator.html)
- **References:**
    - [NegativeUNL Object](negativeunl.html)
    - [UNLModify pseudo-transaction][]
    - [ledger_entry method][]
    - [consensus_info method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

# rippled

The core peer-to-peer server that manages the XRP Ledger is called `rippled`. Each `rippled` server connects to a network of peers, relays transactions and other communications, and maintains a local copy of the complete shared global ledger.

This page contains information on:

- [Types of `rippled` Servers](#types-of-rippled-servers)
- [Parallel XRP Ledger Networks](#parallel-networks)

For more information on `rippled`, see the following resources:

- [Source Code on GitHub](https://github.com/ripple/rippled)
- [Installation and Setup](tutorial-rippled-setup.html)
- [API Reference](reference-rippled-intro.html)
    - [Public API Methods](reference-rippled-api-public.html)
    - [Admin API Methods](reference-rippled-api-admin.html)
    - [Transaction Reference](reference-transaction-format.html)
    - [Ledger Data Format Reference](reference-ledger-format.html)
- Advanced Configuration
    - [History Sharding](concept-history-sharding.html)
    - [Stand-Alone Mode](concept-stand-alone-mode.html)
    - [Amendment Voting](concept-amendments.html#amendment-voting)
- Client Libraries
    - [RippleAPI (JavaScript)](reference-rippleapi.html)


## Types of rippled Servers

The `rippled` server software can run in several modes depending on its configuration, including:

* Stock server - follows the network with a local copy of the ledger.
* Validating server, or _validator_ for short - participates in consensus.
* `rippled` server in stand-alone mode - for testing. Does not communicate to other `rippled` servers.

You can also run the `rippled` executable as a client application for accessing [`rippled` APIs](reference-rippled-intro.html) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)


## Reasons to Run a Stock Server

There are lots of reasons you might want to run your own `rippled` server, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. Of course, you must practice good network security to protect your server from malicious hackers.

You need to trust the `rippled` you use. If you connect to a malicious server, there are many ways that it can take advantage of you or cause you to lose money. For example:

* A malicious server could report that you were paid when no such payment was made.
* It could selectively show or hide payment paths and currency exchange offers to guarantee its own profit while not providing you the best deal.
* If you sent it your address's secret key, it could make arbitrary transactions on your behalf, and even transfer or destroy all the money your address holds.

Additionally, running your own server gives you admin control over it, which allows you to run important admin-only and load-intensive commands. If you use a shared server, you have to worry about other users of the same server competing with you for the server's computing power. Many of the commands in the WebSocket API can put a lot of strain on the server, so `rippled` has the option to scale back its responses when it needs to. If you share a server with others, you may not always get the best results possible.

Finally, if you run a validating server, you can use a stock server as a proxy to the public network while keeping your validating server on a private subnet only accessible to the outside world through the stock server. This makes it more difficult to compromise the integrity of your validating server.


## Reasons to Run a Validator

The robustness of the XRP Ledger depends on an interconnected web of validators who each trust a few other validators _not to collude_. The more operators with different interests there are who run validators, the more certain each member of the network can be that it continues to run impartially. If you or your organization relies on the XRP Ledger, it is in your interest to contribute to the consensus process.

Not all `rippled` servers need to be validators: trusting more servers from the same operator does not offer better protection against collusion. An organization might run validators in multiple regions for redundancy in case of natural disasters and other emergencies.

If your organization runs a validating server, you may also run one or more stock servers, to balance the computing load of API access, or as a proxy between your validation server and the outside network.

### Properties of a Good Validator

There are several properties that define a good validator. The more of these properties your server embodies, the more reason others have to include your server in their list of trusted validators:

* **Availability**. An ideal validator should always be running, submitting validation votes for every proposed ledger.
    * Strive for 100% uptime.
* **Agreement**. A validator's votes should match the outcome of the consensus process as often as possible. To do otherwise could indicate that the validator's software is outdated, buggy, or intentionally biased.
    * Always run the latest `rippled` release without modifications.
* **Timeliness**. A validator's votes should arrive quickly, and not after a consensus round has already finished.
    * A fast internet connection helps with this.
* **Identified**. It should be clear who runs the validator. Ideally, a list of trusted validators should include validators operated by different owners in multiple legal jurisdictions and geographic areas, to reduce the chance that any localized events could interfere with the validator's impartial operation.
    * Setting up [Domain Verification](tutorial-rippled-setup.html#domain-verification) is a good start.

At present, Ripple (the company) cannot recommend any validators aside from those in the default validator list. However, we are collecting data on other validators and building tools to report on their performance. For metrics on validators, see [validators.ripple.com](https://validators.ripple.com).


## Parallel Networks

Most of the time, we describe the XRP Ledger as one collective, singular entity -- and that's mostly true. There is one production XRP Ledger peer-to-peer network, and all business that takes place on the XRP Ledger occurs within the production network.

However, sometimes you may want to do tests and experiments without interacting with the core network. That's why Ripple started the [Ripple Test Net](https://ripple.com/build/ripple-test-net/), an "alternate universe" network, which can act as a testing ground for applications and the `rippled` server itself, without impacting the business operations of everyday XRP Ledger users. The Ripple Test Net (also known as the AltNet) has a separate supply of TestNet-only XRP, which Ripple [gives away for free](https://ripple.com/build/ripple-test-net/) to parties interested in developing applications on the Test Net.

**Caution:** Ripple makes no guarantees about the stability of the test network. It has been and continues to be used to test various properties of server configuration, network topology, and network performance.

Over time, there may also be smaller, temporary test networks for specific purposes.

### Parallel Networks and Consensus

There is no single `rippled` setting that defines which network it uses. Instead, each server uses the consensus of validators it trusts to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues as a parallel network. Even if malicious or misbehaving computers connect to both networks, the consensus process overrides the confusion as long as the members of each network are not configured to trust members of another network in excess of their validation quorum.

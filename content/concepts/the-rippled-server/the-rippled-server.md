# The rippled Server

`rippled` is the core peer-to-peer server that manages the XRP Ledger. This section covers concepts that help you learn the "what" and "why" behind fundamental aspects of the `rippled` server.

Other pages in this category:

* **[History Sharding](history-sharding.html)**

      Historical sharding distributes the transaction history of the XRP Ledger into segments, called shards, across servers in the XRP Ledger network. Understand the purpose of history sharding and when to use it.
<!--{# TODO: Is this History Sharding or Historical Sharding? #}-->

* **[Clustering](clustering.html)**

      If you are running multiple `rippled` servers in a single datacenter, you can configure those servers into a cluster to maximize efficiency. Understand the purpose of clustering and when to use it.


## Types of rippled Servers

The `rippled` server software can run in several modes depending on its configuration, including:

* Stock server - follows the network with a local copy of the ledger.
* Validating server, or _validator_ for short - participates in consensus.
* `rippled` server in stand-alone mode - for testing. Does not communicate to other `rippled` servers.

You can also run the `rippled` executable as a client application for accessing [`rippled` APIs](reference-rippled.html) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)

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
    * Setting up [Domain Verification](#domain-verification) is a good start.

At present, Ripple (the company) cannot recommend any validators aside from those in the default validator list. However, we are collecting data on other validators and building tools to report on their performance. For metrics on validators, see [validators.ripple.com](https://validators.ripple.com).

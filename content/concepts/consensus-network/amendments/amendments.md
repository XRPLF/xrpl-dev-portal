---
html: amendments.html
parent: consensus-network.html
blurb: Amendments represent new features or other changes to transaction processing. Validators coordinate through consensus to apply these upgrades to the XRP Ledger in an orderly fashion.
labels:
  - Blockchain
---
# Amendments

The amendment system uses the consensus process to approve any changes that affect transaction processing on the XRP Ledger. Fully-functional, transaction process changes are introduced as amendments; validators then vote on these changes. If an amendment receives more than 80% support for two weeks, the amendment passes and the change applies permanently to all subsequent ledger versions. Disabling a passed amendment requires a new amendment to do so.

**Note:** Bug fixes that change transaction processes also require amendments.

<!-- TODO: Move this to an amendment tutorial.
Every amendment has a unique identifying hex value and a short name. The short name is for readability only; servers can use different names to describe the same amendement ID, and the names aren't guaranteed to be unique. The amendment ID should be the SHA-512Half hash of the amendment's short name.
-->

## Amendment Process

Every 256th ledger is called a **flag** ledger. The flag ledger doesn't have special contents, but the amendment process happens around it.

1. **Flag Ledger -1:** When `rippled` validators send validation messages, they also submit their amendment votes.
2. **Flag Ledger:** Servers interpret the votes from trusted validators.
3. **Flag Ledger +1:** Servers insert an `EnableAmendment` pseudo-transaction and flag based on what they think happened:
    * The `tfGotMajority` flag means the amendment has more than 80% support.
    * The `tfLostMajority` flag means support for the amendment has decreased to 80% or less.
    * No flag means the amendment is enabled.

    **Note:** It's possible for an amendment to lose 80% support on the same ledger it reaches the required two-week period to be enabled. In these cases, an `EnableAmendment` pseudo-transactions is added for both scenarios, but the amendment is ultimately enabled. 

4. **Flag Ledger +2:** Enabled amendments apply to transactions on this ledger onwards.


## Amendment Voting

Each version of `rippled` is compiled with a list of known amendments and the code to implement those amendments. Operators of `rippled` validators configure their servers to vote on each amendment and can change it at any time. If the operator doesn't choose a vote, the server uses a default vote defined by the source code.

**Note:** The default vote can change between software releases. [Updated in: rippled 1.8.1][]

Amendments must maintain two weeks of support from more than 80% of trusted validators to be enabled. If support drops below 80%, the amendment is temporarily rejected, and the two week period restarts. Amendments can gain and lose a majority any number of times before it becomes permanently enabled.

Amendments that have had their source code removed without being enabled are considered **Vetoed** by the network.


## Amendment Blocked Servers
<a id="amendment-blocked"></a>

Amendment blocking is a security feature to protect the accuracy of XRP Ledger data. When an amendment is enabled, servers running earlier versions of `rippled` without the amendment's source code no longer understand the rules of the network. Rather than guess and misinterpret ledger data, these servers become **amendment blocked** and can't:

* Determine the validity of a ledger.
* Submit or process transactions.
* Participate in the consensus process.
* Vote on future amendments.

The voting configuration of a `rippled` server has no impact on it becoming amendment blocked. A `rippled` server always follows the amendments enabled by the rest of the network, so blockages are based solely on having the code to understand rule changes. This means you can also become amendment blocked if you connect your server to a parallel network with different amendments enabled. For example, the XRP Ledger Devnet typically has experimental amendments enabled. If you are using the latest production release, your server likely won't have the code for those experimental amendments.

You can unblock amendment blocked servers by upgrading to the newest version of `rippled`.


## Retiring Amendments

When amendments are enabled, the source code for pre-amendment behaviors remain in `rippled`. While there are use-cases for keeping old code, such as reconstructing ledger outcomes for verification, tracking amendments and legacy code adds complexity over time.

The [XRP Ledger Standard 11d](https://github.com/XRPLF/XRPL-Standards/discussions/19) defines a process for retiring old amendments and associated pre-amendment code. After an amendment has been enabled on the Mainnet for two years, it can be retired. Retiring an amendment makes it part of the core protocol unconditionally; it's no longer tracked or treated as an amendment, and all pre-amendment code is removed.


## See Also

- **Concepts:**
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Run rippled as a Validator](run-rippled-as-a-validator.html)
    - [Configure Amendment Voting](configure-amendment-voting.html)
    - [Contribute Code to the XRP Ledger](contribute-code.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

# Unique Node List (UNL)

A _unique node list_ (UNL) is a server's list of validators that it trusts not to collude. Every XRP Ledger server is configured with a UNL, which determines which validation votes it listens to and which votes it throws out during the consensus process. By design, each entry in a UNL should represent an independent entity, which could be a business, a university, another type of organization, or even just an individual hobbyist; by having each entry be a separate entity, no one has more than a minimum share of the responsibility for keeping the network running normally.

Validators are intended to be impartial, and to process every transaction as soon as is possible within the constraints of the technology. Validators must not block or censor some transactions for arbitrary reasons, because that hinders the network from reaching consensus. More importantly, validators should be online and operational as much as possible. However, the XRP Ledger is designed to allow for imperfections, both in the network and in the validators themselves. Even if some validators are offline, misconfigured, buggy, or outright malicious, the network should still be able to make progress if the majority of them are operating normally, and the network will never confirm transactions that contradict the rules or past history of the network unless a supermajority (>80%) agree. Keeping these things in mind, the validators on a UNL are chosen to minimize the chances that many validators will fail in the same way at the same time, or collude for malicious reasons.

## UNL Overlap

Each server operator has full control over which validators are in their UNL. However, if two servers operate with totally different UNLs, they are likely to reach different conclusions about when ledgers (and the transactions in them) are validated. This could lead to a _fork_ in the network; when a fork happens, parties on different sides are unable to mutually agree on what has happened and can't transact with one another. To avoid forking, servers in the XRP Ledger need to be configured with UNLs that have a high degree of overlap with one another.

Initially, it was believed that 60% overlap between two servers' UNLs was enough to prevent those servers from forking apart. However, [further research](./consensus-research.md) showed that in the worst case scenario, 90% overlap was required to prevent a fork. This significantly limits how much flexibility server operators have in customizing their UNL: the less overlap with the UNLs that others are using, the higher the chances of forking.

## Recommended Validator Lists

To make it easier to get a diverse and reliable list of validators that has high overlap with others, the XRP Ledger uses a system of recommended validator lists. A server can be configured to download a recommended list from a _publisher_, and to use that list as its UNL. A server can also be configured with multiple publishers' lists, and to use the union of those lists—meaning the server's UNL consists of every validator that is on _any_ of its published lists. Validators who appear on multiple lists are only included once in the server's UNL.

A recommended list can be identified by the public key of its publisher. Typically, recommended lists are associated with a website where they can be downloaded, but lists can also be relayed through the peer-to-peer network in case there are problems accessing the website.

Currently, the default configuration for XRP Ledger servers uses two lists: one published by the XRP Ledger Foundation, and one published by Ripple. Typically, these lists are very similar to one another or even identical. The term _default UNL_ (sometimes abbreviated dUNL) refers to the set of validators included in these lists.

Anyone can publish a signed list of validators in the correct format, which is a JSON document containing signed binary data. For more information on the format of a recommended list, see [Validator List Method](/docs/references/http-websocket-apis/peer-port-methods/validator-list/).

Recommended validator lists need to be updated over time, to add more quality validators and remove validators that aren't as reliable or are retiring. Typically, a recommended validator list has an expiration time, because the publisher expects to have made an update available by that time. Lists also have a sequence number, such that the highest sequence number is the newest version of that list and supercedes any older versions. Lists can also have an activation date so that servers can coordinate when to switch to the new version, and the updated list has time to propagate to all servers that use it.

Publishers aren't involved in day-to-day validation of new transactions, but they do wield significant power in selecting which validators are widely trusted. Server operators should be cautious in selecting which validator list publishers they trust, because carelessness on the part of the publishers could affect the reliability of the servers using those lists.

## How to Get Your Validator on a Recommended List

Each publisher can define their own criteria for being listed. However, the criteria for having your validator added to their lists typically include the following:

- Run a validator with high uptime for at least a year and high agreement with the rest of the network.
- Set up [domain verification](/docs/references/xrp-ledger-toml/#domain-verification) for your validator.
- Be a separate and recognizeable entity in the XRP Ledger community—not, for example, an employee of a company that already runs a validator.
- Run the validator in a separate physical location than most other validators. (So that, for example, an outage at a single data center does not cause many validators to go down.)

Validator list operators may interview candidates for inclusion in the recommended list to confirm that they meet these and other requirements and that they have a commitment to continuing to run the server in the future.

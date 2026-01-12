---
seo:
  description: How validators vote on fees (transaction cost and reserve requirements).
labels:
  - Fees
  - XRP
---

# Fee Voting

Fee voting is a system for adjusting the fees of using the XRP Ledger, specifically the base [transaction cost](../transactions/transaction-cost.md) and [reserve requirements](../accounts/reserves.md). The purpose of the fees is to protect the network from spam, so fee voting decisions must weigh competing priorities of making the network accessible to more users and use cases versus protecting the network from misuse or overuse. Changes must be made periodically to adjust to long-term changes in the value of XRP and the costs and capabilities of network nodes.

[Validator](../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md) operators can set their preferred fee settings in the `[voting]` stanza of the `rippled.cfg` file. Each validator periodically expresses its preferences to the network, about once every 15 minutes. The network automatically adjusts the fee settings to the median of trusted validators' preferences.

{% admonition type="warning" name="Caution" %}Insufficient requirements, if adopted by a consensus of trusted validators (>50%), could expose the XRP Ledger peer-to-peer network to denial-of-service attacks.{% /admonition %}

The parameters you can set are as follows:

| Parameter         | Description                                                                                                                                                                                                                                                                                                             | Recommended Value                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `reference_fee`   | The **reference transaction cost.** This is the amount of XRP, in _drops_ (1 XRP = 1 million drops.), that must be destroyed to send the reference transaction, the cheapest possible transaction. The actual transaction cost is a multiple of this value, scaled dynamically based on the load of individual servers. | `10` (0.00001 XRP)                         |
| `account_reserve` | The **base account reserve.** This is the minimum amount of XRP, in _drops_, that an account must hold in reserve, which is also the minimum requirement to fund a new account.                                                                                                                                         | `1000000` ({% $env.PUBLIC_BASE_RESERVE %}) |
| `owner_reserve`   | The **owner reserve increment.** This is how much more XRP, in _drops_, that an account must hold for _each_ object it owns in the ledger.                                                                                                                                                                              | `200000` ({% $env.PUBLIC_OWNER_RESERVE %}) |

<!-- RESERVES_REMINDER: update recommendations in drops if reserves change -->

## Precautions

Fee preferences should be set carefully. Insufficient fees, if adopted by more than half of trusted validators, could expose the ledger to various denial-of-service attacks. More specifically:

- The reference transaction cost protects the network from excessive _processing and relaying_ of transactions. This is important because every server in the network independently verifies and processes every transaction, and those transactions need to be relayed to every server. If the reference transaction cost is too low, malicious users can overload the network by spamming it with too many transactions. This setting mostly protects servers' CPU and bandwidth usage.
- The reserve settings protect the network from excessive _data storage_. This is important because every server in the network needs a full copy of the most recent ledger state, including all accounts and other ledger entry types. Unused accounts and data cannot be automatically pruned, so the reserves provide an incentive for users to delete data they are not actively using. If the reserves are too low, malicious users can overload the network by creating too many ledger entries. These settings mostly protect servers' RAM and disk space.

Generally speaking, raising the reserve requirements is more disruptive than lowering them. When reserves go down, some users have access to money that was previous locked up; when reserves go up, some users no longer have enough money to send many types of transactions. To minimize disruption, it's generally recommended to be conservative about lowering reserves, instead of aggressively adjusting the settings to respond to volatility in the price of XRP.

## Voting Process

Every 256th ledger is called a "flag" ledger. (A flag ledger is defined such that the `ledger_index` [modulo](https://en.wikipedia.org/wiki/Modulo_operation) `256` is equal to `0`.) Since ledgers typically take 3-4 seconds to close, there is usually a new flag ledger every 15 minutes.

In the ledger immediately before the flag ledger, each validator whose account reserve or transaction cost preferences are different than the current network setting distributes a "vote" message alongside its ledger validation, indicating the values that validator prefers.

In the flag ledger itself, nothing happens, but validators receive and take note of the votes from other validators they trust.

After counting the votes of other validators, each validator attempts to compromise between its own preferences and the preferences of a majority of validators it trusts (the members of its UNL) by taking the median vote for each setting. If the median is _between_ two votes, it chooses the option that is closer to the current setting. If any of the chosen settings are different than what is currently defined in the ledger, the validator inserts a [SetFee pseudo-transaction](../../references/protocol/transactions/pseudo-transaction-types/setfee.md) into its proposal for the ledger following the flag ledger. Other validators also insert a SetFee pseudo-transaction into their proposals based on their preferences and the votes in their UNLs. Validators whose preferences match the existing network settings do nothing. If any SetFee pseudo-transaction has a majority and survives the consensus process to be included in a validated ledger, then the new transaction cost and reserve settings take effect starting with the following ledger.

In short:

- **Flag ledger -1**: Validators submit votes.
- **Flag ledger**: Validators tally votes and decide what SetFee to include, if any.
- **Flag ledger +1**: Validators insert SetFee pseudo-transaction into their proposed ledgers.
- **Flag ledger +2**: New settings take effect, if a SetFee pseudo-transaction achieved consensus.

## Maximum Fee Values

Before the [XRPFees amendment][], the maximum possible values for the fees was limited based on the internal data type of the legacy [FeeSettings ledger entry](../../references/protocol/ledger-data/ledger-entry-types/feesettings.md) format. These values are as follows:

| Parameter         | Maximum Value (drops) | Maximum Value (XRP)               |
| ----------------- | --------------------- | --------------------------------- |
| `reference_fee`   | 2<sup>64</sup>        | (More XRP than has ever existed.) |
| `account_reserve` | 2<sup>32</sup> drops  | Approximately 4294 XRP            |
| `owner_reserve`   | 2<sup>32</sup> drops  | Approximately 4294 XRP            |

On Mainnet and any other networks with the XRPFees amendment enabled, all three fees can now be set to any valid amount of XRP.

## See Also

- **Concepts:**
  - [Amendments](../networks-and-servers/amendments.md)
  - [Transaction Cost](../transactions/transaction-cost.md)
  - [Reserves](../accounts/reserves.md)
  - [Transaction Queue](../transactions/transaction-queue.md)
- **Tutorials:**
  - [Configure `rippled`](../../infrastructure/configuration/index.md)
- **References:**
  - [fee method][]
  - [server_info method][]
  - [FeeSettings object](../../references/protocol/ledger-data/ledger-entry-types/feesettings.md)
  - [SetFee pseudo-transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

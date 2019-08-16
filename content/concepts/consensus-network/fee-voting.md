# Fee Voting

Validators can vote for changes to basic [transaction cost](transaction-cost.html) as well as [reserve requirements](reserves.html). If the preferences in a validator's configuration are different than the network's current settings, the validator expresses its preferences to the network periodically. If a quorum of validators agrees on a change, they can apply a change that takes effect thereafter. Validators may do this for various reasons, especially to adjust to long-term changes in the value of XRP.

Operators of [`rippled` validators](run-rippled-as-a-validator.html) can set their preferences for the transaction cost and reserve requirements in the `[voting]` stanza of the `rippled.cfg` file.

**Caution:** Insufficient requirements, if adopted by a consensus of trusted validators, could expose the XRP Ledger peer-to-peer network to denial-of-service attacks.

The parameters you can set are as follows:

| Parameter | Description | Recommended Value |
|-----------|-------------|-------------------|
| `reference_fee` | Amount of XRP, in _drops_, that must be destroyed to send the reference transaction, the cheapest possible transaction. (1 XRP = 1 million drops.) The actual transaction cost is a multiple of this value, scaled dynamically based on the load of individual servers. | `10` (0.00001 XRP) |
| `account_reserve` | Minimum amount of XRP, in _drops_, that an account must have on reserve. This is the smallest amount that can be sent to fund a new account in the ledger. | `20000000` (20 XRP) |
| `owner_reserve` | How much more XRP, in _drops_, that an address must hold for _each_ object it owns in the ledger. | `5000000` (5 XRP) |

## Voting Process

Every 256th ledger is called a "flag" ledger. (A flag ledger is defined such that the `ledger_index` [modulo](https://en.wikipedia.org/wiki/Modulo_operation) `256` is equal to `0`.) In the ledger immediately before the flag ledger, each validator whose account reserve or transaction cost preferences are different than the current network setting distributes a "vote" message alongside its ledger validation, indicating the values that validator prefers.

In the flag ledger itself, nothing happens, but validators receive and take note of the votes from other validators they trust.

After counting the votes of other validators, each validator attempts to compromise between its own preferences and the preferences of a majority of validators it trusts. (For example, if one validator wants to raise the minimum transaction cost from 10 to 100, but most validators only want to raise it from 10 to 20, the one validator settles on the change to raise the cost to 20. However, the one validator never settles on a value lower than 10 or higher than 100.) If a compromise is possible, the validator inserts a [SetFee pseudo-transaction](setfee.html) into its proposal for the ledger following the flag ledger. Other validators who want the same change insert the same SetFee pseudo-transaction into their proposals for the same ledger. (Validators whose preferences match the existing network settings do nothing.) If a SetFee psuedo-transaction survives the consensus process to be included in a validated ledger, then the new transaction cost and reserve settings denoted by the SetFee pseudo-transaction take effect starting with the following ledger.

In short:

* **Flag ledger -1**: Validators submit votes.
* **Flag ledger**: Validators tally votes and decide what SetFee to include, if any.
* **Flag ledger +1**: Validators insert SetFee pseudo-transaction into their proposed ledgers.
* **Flag ledger +2**: New settings take effect, if a SetFee psuedotransaction achieved consensus.

## Maximum Fee Values

The maximum possible values for the fees are limited by the internal data types stored in the [FeeSettings ledger object](feesettings.html). These values are as follows:

| Parameter | Maximum Value (drops) | Maximum Value (XRP)
|-----------|-----------------------|----|
| `reference_fee` | 2**64 | (More XRP than has ever existed.) |
| `account_reserve` | 2^32 drops | Approximately 4294 XRP |
| `owner_reserve` | 2^32 drops | Approximately 4294 XRP |


## See Also

- **Concepts:**
    - [Amendments](amendments.html)
    - [Transaction Cost](transaction-cost.html)
    - [Reserves](reserves.html)
    - [Transaction Queue](transaction-queue.html)
- **Tutorials:**
    - [Configure `rippled`](configure-rippled.html)
- **References:**
    - [fee method][]
    - [server_info method][]
    - [FeeSettings object](feesettings.html)
    - [SetFee pseudo-transaction][]



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

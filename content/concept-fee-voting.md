# Fee Voting #

Validators can vote for changes to basic [transaction cost](concept-transaction-cost.html) as well as [reserve requirements](concept-reserves.html). If the preferences in a validator's configuration are different than the network's current settings, the validator expresses its preferences to the network periodically. If a quorum of validators agrees on a change, they can apply a change that takes effect thereafter. Validators may do this for various reasons, especially to adjust to long-term changes in the value of XRP.

Operators of [`rippled` validators](tutorial-rippled-setup.html#running-a-validator) can set their preferences for the transaction cost and reserve requirements in the `[voting]` stanza of the `rippled.cfg` file. **Caution:** insufficient requirements could expose the Ripple peer-to-peer network to denial-of-service attacks. The parameters you can set are as follows:

| Parameter | Description | Recommended Value |
|-----------|-------------|-------------------|
| reference\_fee | Amount of XRP, in _drops_, that must be destroyed to send the reference transaction, the cheapest possible transaction. (1 XRP = 1 million drops.) The actual transaction cost is a multiple of this value, scaled dynamically based on the load of individual servers. | `10` (0.00001 XRP) |
| account\_reserve | Minimum amount of XRP, in _drops_, that an account must have on reserve. This is the smallest amount that can be sent to fund a new account in the ledger. | `20000000` (20 XRP) |
| owner\_reserve | How much more XRP, in _drops_, that an address must hold for _each_ object it owns in the ledger. | `5000000` (5 XRP) |

## Voting Process ##

Every 256th ledger is called a "flag" ledger. (A flag ledger is defined such that the `ledger_index` [modulo](https://en.wikipedia.org/wiki/Modulo_operation) `256` is equal to `0`.) In the ledger immediately before the flag ledger, each validator whose account reserve or transaction cost preferences are different than the current network setting distributes a "vote" message alongside its ledger validation, indicating the values that validator prefers.

In the flag ledger itself, nothing happens, but validators receive and take note of the votes from other validators they trust.

After counting the votes of other validators, each validator attempts to compromise between its own preferences and the preferences of a majority of validators it trusts. (For example, if one validator wants to raise the minimum transaction cost from 10 to 100, but most validators only want to raise it from 10 to 20, the one validator settles on the change to raise the cost to 20. However, the one validator never settles on a value lower than 10 or higher than 100.) If a compromise is possible, the validator inserts a [SetFee pseudo-transaction](reference-transaction-format.html#setfee) into its proposal for the ledger following the flag ledger. Other validators who want the same change insert the same SetFee pseudo-transaction into their proposals for the same ledger. (Validators whose preferences match the existing network settings do nothing.) If a SetFee psuedo-transaction survives the consensus process to be included in a validated ledger, then the new transaction cost and reserve settings denoted by the SetFee pseudo-transaction take effect starting with the following ledger.

In short:

* **Flag ledger -1**: Validators submit votes.
* **Flag ledger**: Validators tally votes and decide what SetFee to include, if any.
* **Flag ledger +1**: Validators insert SetFee pseudo-transaction into their proposed ledgers.
* **Flag ledger +2**: New settings take effect, if a SetFee psuedotransaction achieved consensus.

# Fee Voting #

In the long term, it may be necessary to change the basic schedule of XRP requirements to reflect long-term changes in the value of XRP. In this case, validators can vote for changes to basic [transaction cost](tx-cost.html) as well as [reserve requirements](reserves.html). If the preferences in a validator's configuration are different than the network's current settings, the validator expresses its preferences to the network periodically. If a quorum of validators agrees on a change, they can apply a change that takes effect thereafter.

Operators of [`rippled` validators](rippled-setup.html#running-a-validator) can set their preferences for the transaction cost and reserve requirements in the `[voting]` stanza of the `rippled.cfg` file. Changes here should not be made lightly: insufficient requirements could expose the Ripple peer-to-peer network to denial-of-service attacks. The parameters you can set are as follows:

| Parameter | Description | Recommended Value |
|-----------|-------------|-------------------|
| reference\_fee | Amount of XRP, in _drops_, that must be destroyed to send the reference transaction, the cheapest possible transaction. (1 XRP = 1 million drops.) The actual transaction cost is a multiple of this value, scaled dynamically based on the load of individual servers. | `10` (0.00001 XRP) |
| account\_reserve | Minimum amount of XRP, in drops, that an account must have on reserve. This is the smallest amount that can be sent to fund a new account in the ledger. | `20000000` (20 XRP) |
| owner\_reserve | Additional amount of XRP, in drops, that an account must have on reserve for _each_ object it owns in the ledger. | `5000000` (5 XRP) |

### Voting Process ###

Every 256th ledger is called a "flag" ledger. In the ledger immediately before the flag ledger, each validator whose account reserve and transaction cost preferences are different than the current network setting distributes a "vote" message alongside its ledger validation, indicating the values that validator prefers.

In the flag ledger itself, nothing happens, but validators receive and take note of the votes from other validators they trust. 

After seeing the votes of other validators, each validator that wants to change the transaction cost and reserve settings tries to find a compromise on settings that is closest to its own preferences but also approved by a majority of other validators it trusts. (For example, if one validator wants to raise the minimum transaction cost from 10 to 100, but most validators only want to raise it from 10 to 20, the one validator settles on the change to raise the cost to 20.) If this seems possible, the validator inserts a [SetFee pseudo-transaction](transactions.html#setfee) into its proposal for the ledger following the flag ledger, with the expectation that other validators who also want the same change will insert an identical SetFee pseudo-transaction into their proposals for the same ledger. If a SetFee psuedotransaction survives the consensus process to be included in a validated ledger, then the new transaction cost and reserve settings denoted by the SetFee pseudotransaction takes effect starting with the following ledger.

In short:

* **Flag ledger -1**: Validators submit votes.
* **Flag ledger**: Validators tally votes and decide what SetFee to include, if any.
* **Flag ledger +1**: Validators insert SetFee pseudo-transaction into their proposed ledgers.
* **Flag ledger +2**: New settings take effect, if a SetFee psuedotransaction achieved consensus.


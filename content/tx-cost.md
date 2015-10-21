# Transaction Cost #

In order to protect the Ripple Consensus Ledger from being disrupted by spam and denial-of-service attacks, each transaction must destroy a small amount of XRP. This _transaction cost_ is designed to scale up with the load on the network, in order to quickly bankrupt abusers while imposing as little cost as possible on legitimate, respectful users.

Every transaction must specify how much XRP it will destroy in order to pay the transaction cost. This value goes in the [`Fee` field](transactions.html#common-fields).

## Current Transaction Cost ##

The current transaction cost required by the network is typically **0.01 XRP** (10,000 drops), although it sometimes increases due to network load.

## Load Scaling ##

Each server independently scales the transaction cost based on its current load. If you submit a transaction with a `Fee` value that is lower than current load-based transaction cost of the `rippled` server, that server drops the transaction: it neither applies not relays it. (**Exception:** If you submit a transaction through an admin connection, the server applies and relays the transaction as long as the fee meets the overall minimum.) However, your transaction is very unlikely to survive the consensus process unless its `Fee` value meets the requirements of a majority of servers.

The transaction cost is only debited from the sender's XRP balance when the transaction actually becomes included in a validated ledger. The cost does not apply if the transaction is not included in a validated ledger. However, even failed transactions can be included in a validated ledger.

When you sign a transaction online, you can omit the `Fee` field. In this case, `rippled` or ripple-lib looks up an appropriate value based on the state of the peer-to-peer network, and includes it before signing the transaction. There are several drawbacks and limitations to this system, however:

* If the network's transaction fee goes up between signing and distributing the transaction, the transaction may not be confirmed.
    * In the worst case, the transaction may be stuck in a state of being neither definitively confirmed or rejected, unless it included a `LastLedgerSequence` parameter or until you cancel it with a new transaction that uses the same `Sequence` number. See [reliable transaction submission](reliable_tx.html) for best practices.
* If the network's transaction fee is abnormally high, you may end up destroying more of your XRP than expected. You can avoid this by double-checking the details of the signed transaction before submitting it.
    * If you are using `rippled`, you can also use the `fee_mult_max` parameter of the [`sign` command](rippled-apis.html#sign) to set a limit to the load scaling you will allow.
* You cannot look up the fee if you are offline.

### Paying More Than Necessary ###

As a rule, the Ripple Consensus Ledger executes transactions _exactly_ as they are signed, to the extent possible. (To do anything else would be difficult to coordinate across a decentralized consensus network, at the least.) As a consequence of this, every transaction destroys the exact amount of XRP specified by the `Fee`, even if it is much more than the current load fee for any part of the network. The transaction cost can even destroy XRP that would otherwise be set aside for an account's Reserve requirement.



## Fee Voting ##

In the long term, it may be necessary to change the basic fee schedule to reflect long-term changes in the value of XRP, especially because XRP only gets more scarce over time. In this case, validators can vote for changes to the XRP fee schedule, including the transaction fee as well as reserve amounts. If the fee preferences in a validator's configuration are different than the network's current fee schedule, the validator expresses its preferences to the network periodically. If a quorum of validators agrees on a change, they can apply a fee change that takes effect thereafter.

You can set fee preferences in the `[voting]` stanza of the `rippled.cfg` file. Changes here should not be made lightly: insufficient fees could expose the Ripple peer-to-peer network to denial-of-service attacks. The parameters you can set are as follows:

| Parameter | Description | Recommended Value |
|-----------|-------------|-------------------|
| reference\_fee | Amount of XRP, in _drops_, that must be destroyed to send the reference transaction, the cheapest possible transaction. (1 XRP = 1 million drops.) The actual transaction fee, which varies dynamically based on the load of individual servers, is derived from this value. | 10 |
| account\_reserve | Minimum amount of XRP, in drops, that an account must have on reserve. This is the smallest amount that can be sent to fund a new account in the ledger. | 20000000 |
| owner\_reserve | Additional amount of XRP, in drops, that an account must have on reserve for _each_ object it owns in the ledger. | 5000000 |

Every 256th ledger is called a "flag" ledger. In the ledger immediately before the flag ledger, validators whose fee preferences are different than the current network setting distribute a "vote" message alongside their ledger validation, indicating the fee values they would prefer. In the flag ledger itself, nothing happens, but validators receive and take note of the votes from other validators they trust. 

After seeing the votes of other validators, each validator that wants to change the fee tries to find a fee schedule which is closest to its own preferences and also approved by a majority of other validators it trusts. (For example, if one validator wants to raise the fee from 10 to 100, but most validators only want to raise it from 10 to 20, the one validator settles on the change to raise the fee to 20.) If this seems possible, the validator inserts a [SetFee pseudo-transaction](transactions.html#setfee) into its proposal for the ledger following the flag ledger, with the expectation that other validators who also want the same fee change will insert an identical SetFee pseudo-transaction into their proposals for the same ledger. If a SetFee psuedotransaction survives the consensus process to be included in a validated ledger, then the new fee schedule denoted by the SetFee pseudotransaction takes effect starting with the following ledger.

In short:

* **Flag ledger -1**: Validators submit votes
* **Flag ledger**: Validators tally votes and decide what SetFee to include, if any
* **Flag ledger +1**: Validators insert SetFee pseudo-transaction into their proposed ledgers
* **Flag ledger +2**: New fee settings take effect, if a SetFee psuedotransaction achieved consensus

# Transaction Cost #

In order to protect the Ripple Consensus Ledger from being disrupted by spam and denial-of-service attacks, each transaction must destroy a small amount of [XRP](https://ripple.com/knowledge_center/math-based-currency-2/). This _transaction cost_ is designed to scale up with the load on the network, in order to quickly bankrupt abusers while imposing as little cost as possible on legitimate, respectful users.

Every transaction must [specify how much XRP it will destroy](#specifying-the-transaction-cost) in order to pay the transaction cost.


## Current Transaction Cost ##

The current transaction cost required by the network is typically **0.01 XRP** (10,000 drops), although it sometimes increases due to network load.


## Beneficiaries of the Transaction Cost ##

The transaction cost is not paid to any party: the XRP is irrevocably destroyed. Since no new XRP can ever be created, this makes XRP more scarce, and consequently benefits all holders of XRP by making XRP more valuable.


## Load Scaling ##

Each server independently scales the transaction cost based on its current load. If you submit a transaction with a `Fee` value that is lower than current load-based transaction cost of the `rippled` server, that server drops the transaction: it neither applies not relays it. (**Exception:** If you submit a transaction through an admin connection, the server applies and relays the transaction as long as the transaction cost meets the overall minimum.) However, your transaction is very unlikely to survive the consensus process unless its `Fee` value meets the requirements of a majority of servers.


## Querying the Transaction Cost ##

The [`server_info` command](rippled-apis.html#server-info) reports the unscaled minimum XRP cost, as of the previous ledger, as `validated_ledger.base_fee_xrp`, in the form of decimal XRP. The actual cost necessary to relay a transaction is scaled by multiplying by the `load_factor` parameter in the same response, which represents the server's current load level. In other words:

**Current Transaction Cost in XRP = `base_fee_xrp` × `load_factor`**

The [`server_state` command](rippled-apis.html#server-state) returns a direct representation of rippled's internal load calculations. In this case, the effective load rate is the ratio of the current `load_factor` to the `load_base`. The `validated_ledger.base_fee` parameter reports the minimum transaction cost in [drops of XRP](rippled-apis.html#specifying-currency-amounts). This design enables rippled to calculate the transaction cost using only integer math, while still allowing a reasonable amount of fine-tuning for server load. The actual calculation of the transaction cost is as follows:

**Current Transaction Cost in Drops = (`base_fee` × `load_factor`) ÷ `load_base`**


## Specifying the Transaction Cost ##

Every signed transaction must include the transaction cost in the [`Fee` field](transactions.html#common-fields). Like all fields of a signed transaction, this field cannot be changed without invalidating the signature.

Before signing a transaction, we recommend [looking up the current load-based transaction cost](#querying-the-transaction-cost). If the transaction cost is currently high due to load scaling, you may want to wait for it to decrease. If you do not plan on submitting the transaction immediately, we recommend specifying a slightly higher transaction cost to account for future load-based fluctuations in the transaction cost.

When you sign a transaction online, you can omit the `Fee` field. In this case, `rippled` or ripple-lib looks up an appropriate value based on the state of the peer-to-peer network, and includes it before signing the transaction. However, there are several drawbacks and limitations to automatically filling in the transaction cost in this manner:

* If the network's transaction cost goes up between signing and distributing the transaction, the transaction may not be confirmed.
    * In the worst case, the transaction may be stuck in a state of being neither definitively confirmed or rejected, unless it included a `LastLedgerSequence` parameter or until you cancel it with a new transaction that uses the same `Sequence` number. See [reliable transaction submission](reliable_tx.html) for best practices.
* You do not know in advance exactly what value you are signing for the `Fee` field.
    * If you are using `rippled`, you can also use the `fee_mult_max` parameter of the [`sign` command](rippled-apis.html#sign) to set a limit to the load scaling you are willing to sign.
* You cannot look up the transaction cost if you are offline.


### Paying More Than Necessary ###

As a rule, the Ripple Consensus Ledger executes transactions _exactly_ as they are signed, to the extent possible. (To do anything else would be difficult to coordinate across a decentralized consensus network, at the least.) As a consequence of this, every transaction destroys the exact amount of XRP specified by the `Fee` field, even if it is much more than the current minimum transaction cost for any part of the network. The transaction cost can even destroy XRP that would otherwise be set aside for an account's reserve requirement.


## Transaction Costs and Failed Transactions ##

Since the purpose of the transaction cost is to protect the peer-to-peer Ripple network from spurious load, it should apply to any transaction that gets distributed to the network, regardless of whether or not that transaction succeeds. However, in order to affect the shared global ledger, a transaction must be included in a validated ledger. Thus, rippled servers attempt to include failed transactions in ledgers, with [`tec` status codes](transactions.html#result-categories) ("tec" stands for "Transaction Engine - Claimed fee only").

The transaction cost is only debited from the sender's XRP balance when the transaction actually becomes included in a validated ledger. This is true whether the transaction is considered successful or fails with a `tec` code.

If a transaction fails with a different class of status code, such as `tem` (Malformed transactions), the `rippled` server does not relay it to the network. Consequently, that transaction does not get included in a validated ledger, and it cannot have any effect on anyone's XRP balance.

### Insufficient XRP ###

When a rippled server initially evaluates a transaction, it rejects the transaction with the error code `terINSUF_FEE_B` if the sending account does not have a high enough XRP balance to pay the XRP transaction cost. Since this is a `ter` (Retry) code, the transaction never gets relayed to the network and no XRP balances are actually adjusted.

However, account's XRP balance could change between when the transaction gets distributed to the network and when it becomes included in a validated ledger. (For example, a previous transaction sending XRP to the account in question might have applied provisionally, but the two transactions might execute in the opposite order when the network forms the consensus ledger.) In this case, an account may have insufficient XRP to pay the transaction cost even though the transaction got distributed to the network. When this happens, the account pays as much XRP as possible, resulting in a balance of 0 XRP.


## Fee Voting ##

In the long term, it may be necessary to change the basic schedule of XRP requirements to reflect long-term changes in the value of XRP. In this case, validators can vote for changes to basic transaction cost as well as [reserve requirements](https://ripple.com/wiki/Reserves). If the preferences in a validator's configuration are different than the network's current settings, the validator expresses its preferences to the network periodically. If a quorum of validators agrees on a change, they can apply a change that takes effect thereafter.

You can set your preferences for the transaction cost and reserve requirements in the `[voting]` stanza of the `rippled.cfg` file. Changes here should not be made lightly: insufficient requirements could expose the Ripple peer-to-peer network to denial-of-service attacks. The parameters you can set are as follows:

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

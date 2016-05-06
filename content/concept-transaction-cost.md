# Transaction Cost #

In order to protect the Ripple Consensus Ledger from being disrupted by spam and denial-of-service attacks, each transaction must destroy a small amount of [XRP](https://ripple.com/knowledge_center/math-based-currency-2/). This _transaction cost_ is designed to increase along with the load on the network, making it very expensive to deliberately or inadvertently overload the network.

Every transaction must [specify how much XRP it will destroy](#specifying-the-transaction-cost) in order to pay the transaction cost.


## Current Transaction Cost ##

The current transaction cost required by the network for a standard transaction is typically **0.01 XRP** (10,000 drops), after load scaling. It sometimes increases due to higher than usual load.

You can also [query `rippled` for the current transaction cost](#querying-the-transaction-cost).

### Special Transaction Costs ###

Some transactions have different transaction costs:

| Transaction           | Cost Before Load Scaling |
|-----------------------|--------------------------|
| [Reference Transaction](#reference-transaction-cost) (Most transactions) | 10 drops |
| [Key Reset Transaction](#key-reset-transaction) | 0 |
| [Multi-signed transaction](reference-transaction-format.html#multi-signing) | 10 drops × (1 + Number of Signatures Provided) |


## Beneficiaries of the Transaction Cost ##

The transaction cost is not paid to any party: the XRP is irrevocably destroyed. Since no new XRP can ever be created, this makes XRP more scarce, and consequently benefits all holders of XRP by making XRP more valuable.


## Load Cost and Open Ledger Cost ##

When the [FeeEscalation amendment](concept-amendments.html#feeescalation) is enabled, there are two thresholds for the transaction cost:

* If the transaction cost does not meet a `rippled` server's [load-based transaction cost threshold](#local-load-cost), the server ignores the transaction completely. (This logic is essentially unchanged with or without the amendment.)
* If the transaction cost does not meet a `rippled` server's [open ledger cost threshold](#open-ledger-cost), the server queues the transaction for a later ledger.

This divides transactions into roughly three categories:

* Transactions that specify a transaction cost so low that they get rejected by the load-based transaction cost.
* Transactions that specify a transaction cost high enough to be included in the current open ledger.
* Transactions in between, which get [queued for a later ledger version](#queued-transactions).


## Local Load Cost ##

Each `rippled` server maintains a cost threshold based on its current load. If you submit a transaction with a `Fee` value that is lower than current load-based transaction cost of the `rippled` server, that server neither applies nor relays the transaction. (**Note:** If you submit a transaction through an [admin connection](reference-rippled.html#connecting-to-rippled), the server applies and relays the transaction as long as the transaction meets the un-scaled minimum transaction cost.) A transaction is very unlikely to survive [the consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) unless its `Fee` value meets the requirements of a majority of servers.

## Open Ledger Cost ##

A `rippled` server with the [FeeEscalation amendment](concept-amendments.html#feeescalation) enabled has a second mechanism for enforcing the transaction cost, called the _open ledger cost_. A transaction can only be included in the open ledger if it meets the open ledger cost requirement in XRP. Transactions that do not meet the open ledger cost are [queued for a following ledger](#queued-transactions) instead.

For each new ledger version, the server picks a soft limit on the number of transactions to be included in the open ledger, based on the number of transactions in the previous ledger. The open ledger cost is equal to the minimum un-scaled transaction cost until the number of transactions in the open ledger is equal to the soft limit. After that, the open ledger cost increases exponentially for each additional transaction included in the open ledger. For the next ledger, the server increases the soft limit if the current ledger contained more transactions than the soft limit, and decreases the soft limit if the consensus process takes more than 5 seconds.

The open ledger cost requirement is [proportional to the normal cost of the transaction](#fee-levels), not the absolute transaction cost. Transaction types that have a higher-than-normal requirement, such as [multi-signed transactions](reference-transaction-format.html#multi-signing) must pay more to meet the open ledger cost than transactions which have minimum transaction cost requirements.

See also: [Fee Escalation explanation in `rippled` repository](https://github.com/ripple/rippled/blob/release/src/ripple/app/misc/FeeEscalation.md).

### Queued Transactions ###

(Requires the [FeeEscalation amendment](concept-amendments.html#feeescalation))

When `rippled` receives a transaction that meet the server's local load cost but not the open ledger cost, the server checks the transaction to see if it is "likely to be included" in a later ledger. If so, the server adds the transaction to the transaction queue and relays the transaction to other members of the network. Otherwise, the server discards the transaction. The server tries minimize the amount of network load caused by transactions that would not pay a transaction cost, since [the transaction cost only applies when a transaction is included in a validated ledger](#transaction-costs-and-failed-transactions).

The `rippled` server uses a variety of heuristics to determine which transactions are "likely to be included in a ledger."  Most importantly, those transactions must be properly-formed and [authorized](reference-transaction-format.html#authorizing-transactions) with valid signatures.

When the current open ledger closes and the server starts a new open ledger, the server starts taking transactions from the queue to include in the new open ledger. The transaction queue is sorted with the transactions that would pay the highest transaction cost first, proportional to the un-scaled cost of those transactions. Transactions that pay the same transaction cost are queued in the order the server receives them.

**Note:** As of `rippled` **version 0.31.0**, the transaction queue supports at most 1 transaction per sending address. This is expected to change in later versions.

**Caution:** The current implementation does not allow transactions with an `AccountTxnID` field in the transaction queue.

## Reference Transaction Cost ##

The "Reference Transaction" is the cheapest (non-free) transaction, in terms of the necessary [transaction cost](concept-transaction-cost.html) before load scaling. Most transactions have the same cost as the reference transaction. Some transactions, such as [multi-signed transactions](reference-transaction-format.html#multi-signing), require a multiple of this cost instead. When the open ledger cost escalates, the requirement is proportional to the basic cost of the transaction.

### Fee Levels ###

_Fee levels_ represent the proportional difference between the minimum cost and the actual cost of a transaction. The [Open Ledger Cost](#open-ledger-cost) is measured in fee levels instead of absolute cost. See the following table for a comparison:

| Transaction | Minimum cost in drops | Minimum cost in Fee levels | Double cost in drops | Double cost in fee levels |
|-------------|-----------------------|----------------------------|----------------------|---------------------------|
| Reference transaction (most transactions) | 10 | 256 | 20 | 512 |
| [Multi-signed transaction](reference-transaction-format.html#multi-signing) with 4 signatures | 50 | 256 | 100 | 512 |
| [Key reset transaction](concept-transaction-cost.html#key-reset-transaction) | 0 | (Effectively infinite) | N/A | (Effectively infinite) |


## Querying the Transaction Cost ##

The `rippled` APIs have two ways to query the local load-based transaction cost: the `server_info` command (intended for humans) and the `server_state` command (intended for machines).

If the [FeeEscalation amendment](concept-amendments.html#feeescalation) is enabled, you can use the [`fee` command](reference-rippled.html#fee) to check the open ledger cost.

### server_info ###

The [`server_info` command](reference-rippled.html#server-info) reports the unscaled minimum XRP cost, as of the previous ledger, as `validated_ledger.base_fee_xrp`, in the form of decimal XRP. The actual cost necessary to relay a transaction is scaled by multiplying that `base_fee_xrp` value by the `load_factor` parameter in the same response, which represents the server's current load level. In other words:

**Current Transaction Cost in XRP = `base_fee_xrp` × `load_factor`**


### server_state ###

The [`server_state` command](reference-rippled.html#server-state) returns a direct representation of `rippled`'s internal load calculations. In this case, the effective load rate is the ratio of the current `load_factor` to the `load_base`. The `validated_ledger.base_fee` parameter reports the minimum transaction cost in [drops of XRP](reference-rippled.html#specifying-currency-amounts). This design enables `rippled` to calculate the transaction cost using only integer math, while still allowing a reasonable amount of fine-tuning for server load. The actual calculation of the transaction cost is as follows:

**Current Transaction Cost in Drops = (`base_fee` × `load_factor`) ÷ `load_base`**



## Specifying the Transaction Cost ##

Every signed transaction must include the transaction cost in the [`Fee` field](reference-transaction-format.html#common-fields). Like all fields of a signed transaction, this field cannot be changed without invalidating the signature.

As a rule, the Ripple Consensus Ledger executes transactions _exactly_ as they are signed. (To do anything else would be difficult to coordinate across a decentralized consensus network, at the least.) As a consequence of this, every transaction destroys the exact amount of XRP specified by the `Fee` field, even if it is much more than the current minimum transaction cost for any part of the network. The transaction cost can even destroy XRP that would otherwise be set aside for an account's reserve requirement.

Before signing a transaction, we recommend [looking up the current load-based transaction cost](#querying-the-transaction-cost). If the transaction cost is currently high due to load scaling, you may want to wait for it to decrease. If you do not plan on submitting the transaction immediately, we recommend specifying a slightly higher transaction cost to account for future load-based fluctuations in the transaction cost.


### Automatically Specifying the Transaction Cost ###

When you sign a transaction online, you can omit the `Fee` field. In this case, `rippled` or ripple-lib looks up an appropriate value based on the state of the peer-to-peer network, and includes it before signing the transaction. However, there are several drawbacks and limitations to automatically filling in the transaction cost in this manner:

* If the network's transaction cost goes up between signing and distributing the transaction, the transaction may not be confirmed.
    * In the worst case, the transaction may be stuck in a state of being neither definitively confirmed or rejected, unless it included a `LastLedgerSequence` parameter or until you cancel it with a new transaction that uses the same `Sequence` number. See [reliable transaction submission](tutorial-reliable-transaction-submission.html) for best practices.
* You do not know in advance exactly what value you are signing for the `Fee` field.
    * If you are using `rippled`, you can also use the `fee_mult_max` and `fee_div_max` parameters of the [`sign` command](reference-rippled.html#sign) to set a limit to the load scaling you are willing to sign.
* You cannot look up the current transaction cost from an offline machine.
* You cannot automatically specify the transaction cost when [multi-signing](reference-transaction-format.html#multi-signing).



## Transaction Costs and Failed Transactions ##

Since the purpose of the transaction cost is to protect the peer-to-peer Ripple network from excessive load, it should apply to any transaction that gets distributed to the network, regardless of whether or not that transaction succeeds. However, in order to affect the shared global ledger, a transaction must be included in a validated ledger. Thus, `rippled` servers attempt to include failed transactions in ledgers, with [`tec` status codes](reference-transaction-format.html#result-categories) ("tec" stands for "Transaction Engine - Claimed fee only").

The transaction cost is only debited from the sender's XRP balance when the transaction actually becomes included in a validated ledger. This is true whether the transaction is considered successful or fails with a `tec` code.

If a transaction's failure is [final](reference-transaction-format.html#finality-of-results), the `rippled` server does not relay it to the network. Consequently, that transaction does not get included in a validated ledger, and it cannot have any effect on anyone's XRP balance.

### Insufficient XRP ###

When a `rippled` server initially evaluates a transaction, it rejects the transaction with the error code `terINSUF_FEE_B` if the sending account does not have a high enough XRP balance to pay the XRP transaction cost. Since this is a `ter` (Retry) code, the `rippled` server retries the transaction without relaying it to the network, until the transaction's outcome is [final](reference-transaction-format.html#finality-of-results).

When a transaction has already been distributed to the network, but the account does not have sufficient XRP to pay the transaction cost, the result code `tecINSUFF_FEE` occurs instead. In this case, the account pays all the XRP it can, ending with 0 XRP. This can occur because `rippled` decides whether to relay the transaction to the network based on its in-progress ledger, but transactions may be dropped or reordered when building the consensus ledger.


## Key Reset Transaction ##

As a special case, an account can send a [SetRegularKey](reference-transaction-format.html#setregularkey) transaction with a transaction cost of `0`, as long as the account's [lsfPasswordSpent flag](reference-ledger-format.html#accountroot-flags) is disabled. This transaction must be signed by the account's _master key_. Sending this transaction enables the lsfPasswordSpent flag.

This feature is designed to allow you to recover an account if the regular key is compromised, without worrying about whether the compromised account has any XRP available. This way, you can regain control of the account before you send additional XRP to it.

The [lsfPasswordSpent flag](reference-ledger-format.html#accountroot-flags) starts out disabled. If enabled, it gets disabled again when the account receives a [Payment](reference-transaction-format.html#payment) of XRP.

When the [FeeEscalation amendment](concept-amendments.html#feeescalation) is enabled, `rippled` prioritizes key reset transactions above other transactions even though the nominal transaction cost of a key reset transaction is zero.


## Changing the Transaction Cost ##

In addition to short-term scaling to account for load, the Ripple Consensus Ledger has a mechanism for changing the minimum transaction cost in order to account for long-term changes in the value of XRP. Any changes have to be approved by the consensus process. See [Fee Voting](concept-fee-voting.html) for more information.

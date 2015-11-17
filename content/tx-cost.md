# Transaction Cost #

In order to protect the Ripple Consensus Ledger from being disrupted by spam and denial-of-service attacks, each transaction must destroy a small amount of [XRP](https://ripple.com/knowledge_center/math-based-currency-2/). This _transaction cost_ is designed to increase along with the load on the network, making it very expensive to deliberately or inadvertently overload the network.

Every transaction must [specify how much XRP it will destroy](#specifying-the-transaction-cost) in order to pay the transaction cost.


## Current Transaction Cost ##

The current transaction cost required by the network is typically **0.01 XRP** (10,000 drops), although it sometimes increases due to network load.

You can also [query `rippled` for the current transaction cost](#querying-the-transaction-cost).


## Beneficiaries of the Transaction Cost ##

The transaction cost is not paid to any party: the XRP is irrevocably destroyed. Since no new XRP can ever be created, this makes XRP more scarce, and consequently benefits all holders of XRP by making XRP more valuable.


## Load Scaling ##

Each `rippled` server independently scales the transaction cost based on its current load. If you submit a transaction with a `Fee` value that is lower than current load-based transaction cost of the `rippled` server, that server neither applies nor relays the transaction. (**Note:** If you submit a transaction through an admin connection, the server applies and relays the transaction as long as the transaction cost meets the overall minimum.) A transaction is very unlikely to survive [the consensus process](https://ripple.com/knowledge_center/the-ripple-ledger-consensus-process/) unless its `Fee` value meets the requirements of a majority of servers.


## Querying the Transaction Cost ##

The `rippled` APIs have two ways to query the transaction cost: the `server_info` command (intended for humans) and the `server_state` command (intended for machines).

### server_info ###

The [`server_info` command](rippled-apis.html#server-info) reports the unscaled minimum XRP cost, as of the previous ledger, as `validated_ledger.base_fee_xrp`, in the form of decimal XRP. The actual cost necessary to relay a transaction is scaled by multiplying that `base_fee_xrp` value by the `load_factor` parameter in the same response, which represents the server's current load level. In other words:

**Current Transaction Cost in XRP = `base_fee_xrp` × `load_factor`**


### server_state ###

The [`server_state` command](rippled-apis.html#server-state) returns a direct representation of `rippled`'s internal load calculations. In this case, the effective load rate is the ratio of the current `load_factor` to the `load_base`. The `validated_ledger.base_fee` parameter reports the minimum transaction cost in [drops of XRP](rippled-apis.html#specifying-currency-amounts). This design enables `rippled` to calculate the transaction cost using only integer math, while still allowing a reasonable amount of fine-tuning for server load. The actual calculation of the transaction cost is as follows:

**Current Transaction Cost in Drops = (`base_fee` × `load_factor`) ÷ `load_base`**



## Specifying the Transaction Cost ##

Every signed transaction must include the transaction cost in the [`Fee` field](transactions.html#common-fields). Like all fields of a signed transaction, this field cannot be changed without invalidating the signature.

As a rule, the Ripple Consensus Ledger executes transactions _exactly_ as they are signed. (To do anything else would be difficult to coordinate across a decentralized consensus network, at the least.) As a consequence of this, every transaction destroys the exact amount of XRP specified by the `Fee` field, even if it is much more than the current minimum transaction cost for any part of the network. The transaction cost can even destroy XRP that would otherwise be set aside for an account's reserve requirement.

Before signing a transaction, we recommend [looking up the current load-based transaction cost](#querying-the-transaction-cost). If the transaction cost is currently high due to load scaling, you may want to wait for it to decrease. If you do not plan on submitting the transaction immediately, we recommend specifying a slightly higher transaction cost to account for future load-based fluctuations in the transaction cost.


### Automatically Specifying the Transaction Cost ###

When you sign a transaction online, you can omit the `Fee` field. In this case, `rippled` or ripple-lib looks up an appropriate value based on the state of the peer-to-peer network, and includes it before signing the transaction. However, there are several drawbacks and limitations to automatically filling in the transaction cost in this manner:

* If the network's transaction cost goes up between signing and distributing the transaction, the transaction may not be confirmed.
    * In the worst case, the transaction may be stuck in a state of being neither definitively confirmed or rejected, unless it included a `LastLedgerSequence` parameter or until you cancel it with a new transaction that uses the same `Sequence` number. See [reliable transaction submission](reliable_tx.html) for best practices.
* You do not know in advance exactly what value you are signing for the `Fee` field.
    * If you are using `rippled`, you can also use the `fee_mult_max` parameter of the [`sign` command](rippled-apis.html#sign) to set a limit to the load scaling you are willing to sign.
* You cannot look up the current transaction cost from an offline machine.



## Transaction Costs and Failed Transactions ##

Since the purpose of the transaction cost is to protect the peer-to-peer Ripple network from excessive load, it should apply to any transaction that gets distributed to the network, regardless of whether or not that transaction succeeds. However, in order to affect the shared global ledger, a transaction must be included in a validated ledger. Thus, `rippled` servers attempt to include failed transactions in ledgers, with [`tec` status codes](transactions.html#result-categories) ("tec" stands for "Transaction Engine - Claimed fee only").

The transaction cost is only debited from the sender's XRP balance when the transaction actually becomes included in a validated ledger. This is true whether the transaction is considered successful or fails with a `tec` code.

If a transaction's failure is [final](transactions.html#finality-of-results), the `rippled` server does not relay it to the network. Consequently, that transaction does not get included in a validated ledger, and it cannot have any effect on anyone's XRP balance.

### Insufficient XRP ###

When a `rippled` server initially evaluates a transaction, it rejects the transaction with the error code `terINSUF_FEE_B` if the sending account does not have a high enough XRP balance to pay the XRP transaction cost. Since this is a `ter` (Retry) code, the `rippled` server retries the transaction without relaying it to the network, until the transaction's outcome is [final](transactions.html#finality-of-results).

An account's XRP balance could change between when the transaction gets distributed to the network and when it becomes included in a validated ledger. (For example, a previous transaction sending XRP to the account in question might have applied provisionally, but the two transactions might execute in the opposite order when the network forms the consensus ledger.) In this case, an account may have insufficient XRP to pay the transaction cost even though the transaction has already been distributed to the network. When this happens, the transaction fails with the result code `tecINSUFF_FEE` and the account pays as much XRP as possible, resulting in a balance of 0 XRP.


## Key Reset Transaction ##

As a special case, an account can send a [SetRegularKey](transactions.html#setregularkey) transaction with a transaction cost of `0`, as long as the account's [lsfPasswordSpent flag](ripple-ledger.html#accountroot-flags) is disabled. This transaction must be signed by the account's _master key_. Sending this transaction enables the lsfPasswordSpent flag.

This feature is designed to allow you to recover an account if the regular key is compromised, without worrying about whether the compromised account has any XRP available. This way, you can regain control of the account before you send additional XRP to it.

The [lsfPasswordSpent flag](ripple-ledger.html#accountroot-flags) starts out disabled. If enabled, it gets disabled again when the account receives a [Payment](transactions.html#payment) of XRP.


## Changing the Transaction Cost ##

In addition to short-term scaling to account for load, the Ripple Consensus Ledger has a mechanism for changing the minimum transaction cost in order to account for long-term changes in the value of XRP. Any changes have to be approved by the consensus process. See [Fee Voting](fee-voting.html) for more information.

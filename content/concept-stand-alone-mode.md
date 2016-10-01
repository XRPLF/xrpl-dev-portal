Stand-Alone Mode
===============================================================================

You can run `rippled` in stand-alone mode without a consensus of trusted servers. In stand-alone mode, `rippled` does not communicate with any other servers in the Ripple peer-to-peer network, but you can do most of the same actions on your local server only. Stand-alone provides a method for testing `rippled` behavior without being tied to the live network. For example, you can [test the effects of Amendments](concept-amendments.html#testing-amendments) before those Amendments have gone into effect across the decentralized network.

When you run `rippled` in stand-alone mode, you have to tell it what ledger version to start from:

* Create a [new genesis ledger](#new-genesis-ledger) from scratch.
* [Load an existing ledger version](#load-saved-ledger) from disk.

**Caution:** In stand-alone mode, you must [manually advance the ledger](#advancing-ledgers-in-stand-alone-mode).


New Genesis Ledger
-------------------------------------------------------------------------------
In stand-alone mode, you can have `rippled` create a new genesis ledger. This provides a known state, with none of the ledger history from the production Ripple Consensus Ledger. (This is very useful for unit tests, among other things.)

* To start `rippled` in stand-alone mode with a new genesis ledger, use the [`-a`](https://wiki.ripple.com/Rippled#--standalone.2C_-a) and [`--start`](https://wiki.ripple.com/Rippled#--start) options:

```
rippled -a --start --conf=/path/to/rippled.cfg
```

In a genesis ledger, the [genesis address](reference-rippled.html#special-addresses) holds all 100 billion XRP. The keys of the genesis address are [hardcoded](https://github.com/ripple/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184) as follows:

**Address:** `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

**Secret:** `snoPBrXtMeMyMHUVTgbuqAfg1SUTb` ("masterpassphrase")

**Caution:** If you create a new genesis ledger, the hard-coded default [Reserve](concept-reserves.html) is **200 XRP** minimum for funding a new address, with an increment of **50 XRP** per object in the ledger. These values are higher than the current reserve requirements of the production network. (See also: [Fee Voting](concept-fee-voting.html))



Load Saved Ledger
-------------------------------------------------------------------------------
You can start with a ledger version that was saved to disk if your `rippled` server was previously synced with the Ripple peer-to-peer network (either the production network or the [Test Net](tutorial-rippled-setup.html#parallel-networks)).

### 1. Start `rippled` normally. ###

To load an existing ledger, you must first retrieve that ledger from the network. Start `rippled` in online mode as normal:

```
rippled --conf=/path/to/rippled.cfg
```

### 2. Wait until `rippled` is synced. ###

Use the [`server_info` command](reference-rippled.html#server-info) to check the state of your server relative to the network. Your server is synced when the `server_state` value shows any of the following values:

* `full`
* `proposing`
* `validating`

For more information, see [Possible Server States](reference-rippled.html#possible-server-states).

### 3. (Optional) Retrieve specific ledger versions. ###

If you only want the most recent ledger, you can skip this step.

If you want to load a specific historical ledger version, use the [`ledger_request` command](reference-rippled.html#ledger-request) to make `rippled` fetch it. If `rippled` does not already have the ledger version, you may have to run the `ledger_request` command multiple times until it has finished retrieving the ledger.

If you want to replay a specific historical ledger version, you must fetch both the ledger version to replay and the ledger version before it. (The previous ledger version sets up the initial state upon which you apply the changes described by the ledger version you replay.)

### 4. Shut down `rippled`. ###

Use the [`stop` command](reference-rippled.html#stop):

```
rippled stop --conf=/path/to/rippled.cfg
```

### 5. Start `rippled` in stand-alone mode. ###

To load the most recent ledger version, you can use the [`-a`](https://wiki.ripple.com/Rippled#--standalone.2C_-a) and [`--load`](https://wiki.ripple.com/Rippled#--load) options when starting the server:

```
rippled -a --load --conf=/path/to/rippled.cfg
```

To instead load a specific historical ledger, use the [`--load`](https://wiki.ripple.com/Rippled#--load) parameter along with the `--ledger` parameter, providing the ledger index or identifying hash of the ledger version to load:

```
rippled -a --load --ledger 19860944 --conf=/path/to/rippled.cfg
```

### 6. Manually advance the ledger. ###

When you load a ledger with `--ledger` in stand-alone mode, it goes to the current open ledger, so you must [manually advance the ledger](#advancing-ledgers-in-stand-alone-mode):

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```


Advancing Ledgers in Stand-Alone Mode
-------------------------------------------------------------------------------

In stand-alone mode, `rippled` does not communicate to other members of the peer-to-peer network or participate in a consensus process. Instead, you must manually advance the ledger index using the [`ledger_accept` command](reference-rippled.html#ledger-accept):

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

In stand-alone mode, `rippled` makes no distinction between a "closed" ledger version and a "validated" ledger version. (For more information about the difference, see [The Ripple Ledger Consensus Process](https://ripple.com/build/ripple-ledger-consensus-process/).)

Whenever `rippled` closes a ledger, it reorders the transactions according to a deterministic but hard-to-game algorithm. (This is an important part of consensus, since transactions may arrive at different parts of the network in different order.) When using `rippled` in stand-alone mode, you should manually advance the ledger before submitting a transaction that depends on the result of a transaction from a different address. Otherwise, the two transactions might be executed in reverse order when the ledger is closed. **Note:** You can safely submit multiple transactions from a single address to a single ledger, because `rippled` sorts transactions from the same address in ascending order by [`Sequence` number](reference-transaction-format.html#common-fields).

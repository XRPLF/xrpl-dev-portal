---
html: advance-the-ledger-in-stand-alone-mode.html
parent: use-stand-alone-mode.html
seo:
    description: Make progress in stand-alone mode by manually closing the ledger.
labels:
  - Core Server
---
# Advance the Ledger in Stand-Alone Mode

In [stand-alone mode][], `rippled` does not communicate to other members of the peer-to-peer network or participate in a consensus process. Since there is no consensus process in this mode, you must manually advance the ledger index using the [ledger_accept method][]:

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

In stand-alone mode, `rippled` makes no distinction between a "closed" ledger version and a "validated" ledger version. (For more information about the difference, see [The XRP Ledger Consensus Process](../../concepts/consensus-protocol/index.md).)

Whenever `rippled` closes a ledger, it reorders the transactions according to a deterministic but hard-to-game algorithm. (This is an important part of consensus, since transactions may arrive at different parts of the network in different order.) When using `rippled` in stand-alone mode, you should manually advance the ledger before submitting a transaction that depends on the result of a transaction from a different address. Otherwise, the two transactions might be executed in reverse order when the ledger is closed. 

**Note:** You can safely submit multiple transactions from a single address to a single ledger, because `rippled` sorts transactions from the same address in ascending order by [`Sequence` number](../../references/protocol/transactions/common-fields.md).


## See Also

- **References:**
    - [ledger_accept method][]
    - [server_info method][]
    - [`rippled` Commandline Usage](../commandline-usage.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

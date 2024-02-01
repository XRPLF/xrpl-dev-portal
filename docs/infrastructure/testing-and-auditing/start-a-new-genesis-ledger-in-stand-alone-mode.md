---
html: start-a-new-genesis-ledger-in-stand-alone-mode.html
parent: use-stand-alone-mode.html
seo:
    description: Start from a fresh genesis ledger in stand-alone mode.
labels:
  - Core Server
---
# Start a New Genesis Ledger in Stand-Alone Mode

In stand-alone mode, you can have `rippled` create a new genesis ledger. This provides a known state, with none of the ledger history from the production XRP Ledger. (This is very useful for unit tests, among other things.)

* To start `rippled` in stand-alone mode with a new genesis ledger, use the `-a` and `--start` options:

```
rippled -a --start --conf=/path/to/rippled.cfg
```

For more information on the options you can use when starting `rippled` in stand-alone mode, see [Commandline Usage: Stand-Alone Mode Options](../commandline-usage.md#stand-alone-mode-options).

In a genesis ledger, the [genesis address](../../concepts/accounts/addresses.md#special-addresses) holds all 100 billion XRP. The keys of the genesis address are [hardcoded](https://github.com/XRPLF/rippled/blob/94ed5b3a53077d815ad0dd65d490c8d37a147361/src/ripple/app/ledger/Ledger.cpp#L184) as follows:

**Address:** `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

**Secret:** `snoPBrXtMeMyMHUVTgbuqAfg1SUTb` ("`masterpassphrase`")

## Settings in New Genesis Ledgers

In a new genesis ledger, the hard-coded default [Reserve](../../concepts/accounts/reserves.md) is **200 XRP** minimum for funding a new address, with an increment of **50 XRP** per object in the ledger. These values are higher than the current reserve requirements of the production network. (See also: [Fee Voting](../../concepts/consensus-protocol/fee-voting.md))

By default, a new genesis ledger has no [amendments](../../concepts/networks-and-servers/amendments.md) enabled. If you start a new genesis ledger with `--start`, the genesis ledger contains an [EnableAmendment pseudo-transaction](../../references/protocol/transactions/pseudo-transaction-types/enableamendment.md) to turn on all amendments natively supported by the `rippled` server, except for amendments that you explicitly disable in the config file. The effects of those amendments are available starting from the very next ledger version. (Reminder: in stand-alone mode, you must [advance the ledger manually](advance-the-ledger-in-stand-alone-mode.md).)

## See Also

- **Concepts:**
    - [The `rippled` Server](../../concepts/networks-and-servers/index.md)
        - [`rippled` Server Modes](../../concepts/networks-and-servers/rippled-server-modes.md)
    - [Parallel Networks](../../concepts/networks-and-servers/parallel-networks.md)
    - [Amendments](../../concepts/networks-and-servers/amendments.md)
    - [Fee Voting](../../concepts/consensus-protocol/fee-voting.md)
- **References:**
    - [ledger_accept method][]
    - [server_info method][]
    - [`rippled` Commandline Usage](../commandline-usage.md)
- **Use Cases:**
    - [Contribute Code to the XRP Ledger](/resources/contribute-code/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

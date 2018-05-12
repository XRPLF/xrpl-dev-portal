# Stand-Alone Mode

You can run `rippled` in stand-alone mode without a consensus of trusted servers. In stand-alone mode, `rippled` does not communicate with any other servers in the XRP Ledger peer-to-peer network, but you can do most of the same actions on your local server only. Stand-alone provides a method for testing `rippled` behavior without being tied to the live network. For example, you can [test the effects of Amendments](amendments.html#testing-amendments) before those Amendments have gone into effect across the decentralized network.

When you run `rippled` in stand-alone mode, you have to tell it what ledger version to start from:

* Create a [new genesis ledger](start-a-new-genesis-ledger-in-stand-alone-mode.html) from scratch.
* [Load an existing ledger version](load-a-saved-ledger-in-stand-alone-mode.html) from disk.

**Caution:** In stand-alone mode, you must [manually advance the ledger](advance-the-ledger-in-stand-alone-mode.html).

{% include '_snippets/rippled_versions.md' %}

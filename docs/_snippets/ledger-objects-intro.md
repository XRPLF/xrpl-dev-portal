Each [ledger version](../concepts/ledgers/index.md)'s state data is a set of **ledger objects**, sometimes called _ledger entries_, which collectively represent all settings, balances, and relationships at a given point in time. To store or retrieve an object in the state data, the protocol uses that object's unique **[Ledger Object ID](../references/protocol/ledger-data/common-fields.md)**.

In the [peer protocol](../concepts/networks-and-servers/peer-protocol.md), ledger objects have a [canonical binary format](../references/protocol/binary-format.md). In `rippled` APIs, ledger objects are represented as JSON objects.

A ledger object's data fields depend on the type of object; the XRP Ledger supports the following types:

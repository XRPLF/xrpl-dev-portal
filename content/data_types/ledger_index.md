A ledger index is a 32-bit unsigned integer used to identify a ledger. The ledger index is also known as the ledger's sequence number. The very first ledger was ledger index 1, and each new ledger has a ledger index 1 higher than that of the ledger immediately before it.

The ledger index indicates the order of the ledgers; the [Hash][] value identifies the exact contents of the ledger. Two ledgers with the same hash are always the same. For validated ledgers, hash values and sequence numbers are equally valid and correlate 1:1. However, this is not true for in-progress ledgers:

* Two different `rippled` servers may have different contents for a current ledger with the same ledger index, due to latency in propagating transactions throughout the network.
* There may be multiple closed ledger versions competing to be validated by consensus. These ledger versions have the same sequence number but different contents (and different hashes). Only one of these closed ledgers can become validated.
* A current ledger's contents change over time, which would cause its hash to change, even though its ledger index number stays the same. The hash of a ledger is not calculated until the ledger is closed.

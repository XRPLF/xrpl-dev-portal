A ledger index is a 32-bit unsigned integer used to identify a ledger. The ledger index is sometimes known as the ledger's _sequence number_. (This is different from an [account sequence](basic-data-types.html#account-sequence).) The very first ledger was ledger index 1, and each new ledger has a ledger index that is 1 higher than the ledger index of the ledger immediately before it.

The ledger index indicates the order of the ledgers; the [Hash][] value identifies the exact contents of the ledger. Two ledgers with the same hash are always the same. For validated ledgers, hash values and ledger indexes are equally valid and correlate 1:1. However, this is not true for in-progress ledgers:

* Two different `rippled` servers may have different contents for a current ledger with the same ledger index, due to latency in propagating transactions throughout the network.
* There may be multiple closed ledger versions competing to be validated by consensus. These ledger versions have the same ledger index but different contents (and different hashes). Only one of these closed ledgers can become validated.
* The current open ledger's hash is not calculated. This is because a current ledger's contents change over time, which would cause its hash to change, even though its ledger index stays the same. The hash of a ledger is only calculated when the ledger is closed.

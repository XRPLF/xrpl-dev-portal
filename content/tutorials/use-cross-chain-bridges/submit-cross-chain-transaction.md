---
html: submit-cross-chain-transactions.html
parent: tutorials.html
blurb: Steps to submit a cross-chain transaction, using a bridge.
labels:
  - Interoperability
---
# Submit Cross-chain Transactions

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

## Prerequisites

- The locking and issuing chains are both up and running.
- The witness servers are up and running.
- Set up a bridge between the two chains.
- Enable the `XChainBridge` amendment in the `rippled.cfg` configuration file on both chains.
- You have an account on the locking and issuing chain.


## Steps

1. Create a claim ID with `XChainCreateClaimID`, using your account on the issuing chain.
   
2. Retrieve the claim ID from the transaction metadata, or use the `XChainCreateClaimID` RPC call.

3. Submit an `XChainCommit` transaction with the claim ID, using your account on the locking chain.

4. A witness server takes note of the `XChainCommit` transaction and submits an `XChainAddClaimAttestation` transaction on the issuing chain, attesting that the `XChainCommit` transaction did in fact occur on the locking chain.

5. When enough `XChainAddClaimAttestation` signatures are submitted to reach quorum, the funds are automatically released on the issuing chain to the `OtherChainDestination` specified by the `XChainCommit` transaction.

6. (Optional) If the funds aren't automatically released, you can submit an `XChainClaim` transaction with your account on the issuing chain.


## See Also

- **Transactions:**
  - [XChainCreateClaimID](../transaction-types/xchaincreateclaimid.md)
  - [XChainCommit](../transaction-types/xchaincommit.md)
  - [XChainAddClaimAttestation](../transaction-types/xchainaddclaimattestation.md)
  - [XChainClaim](../transaction-types/xchainclaim.md)
- [List of Parallel Networks](../parallel-networks-list.md)
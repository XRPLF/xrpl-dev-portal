---
html: set-up-iou-iou-bridge.html
parent: tutorials.html
blurb: Steps to set up an IOU-IOU bridge.
labels:
  - Interoperability
---
# Set Up an IOU-IOU Bridge

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

## Prerequisites

- An XRP-XRP bridge must be set up between the locking and issuing chain.
- Ensure the witnesses' transaction submission accounts are funded on the locking and issuing chains.
- Door accounts exist for the bridge on the locking and issuing chains.


## Steps

1. Submit an `XChainCreateBridge` transaction from the door account on the locking chain.
  
    **Note:** Don't include a `MinAccountCreateAmount` value.

2. Submit a `SignerListSet` transaction from the door account on the locking chain, using the witnesses' signing keys as the signers.
   
3. Disable the master key on the locking chain's door account with an `AccountSet` transaction.
   
4. Submit an `XChainCreateBridge` transaction from the door account on the issuing chain.

5. Submit a `SignerListSet` transaction from the door account on the issuing chain, using the witnesses' signing keys as the signers.

6. Disable the master key on the issuing chain's door account with an `AccountSet` transaction.


## See Also

- **Transactions:**
  - [XChainCreateBridge](../transaction-types/xchaincreatebridge.md)
  - [SignerListSet](https://xrpl.org/signerlistset.html)
  - [AccountSet](https://xrpl.org/accountset.html)
- [List of Parallel Networks](../parallel-networks-list.md)
---
html: set-up-xrp-xrp-bridge.html
parent: tutorials.html
blurb: Steps to create an XRP-XRP bridge with a new sidechain.
labels:
  - Interoperability
---
# Set Up an XRP-XRP Bridge

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

Setting up an XRP-XRP bridge on a new issuing chain is somewhat complex because there are no accounts on the issuing chain, even for witnesses. The issuing chain must use its genesis account as a door account to submit attestations and create transaction submission accounts for witnesses.


## Prerequisites

- The issuing chain is set up and active. Validators must be running and successfully closing ledgers.
- The witnesses' accounts on the locking chain are funded, so they can submit transactions.
- A door account for the bridge exists on the locking chain.


## Steps

1. Submit an `XChainCreateBridge` transaction from the door account on the locking chain.

    **Note:** The `MinAccountCreateAmount` value should at least be equal to the account reserve on the issuing chain.

2. Submit a `SignerListSet` transaction from the door account on the locking chain, using the witnesses' signing keys as the signers.

4. Disable the master key on the locking chain's door account with an `AccountSet` transaction.

5. Submit an `XChainCreateBridge` transaction from the genesis account on the issuing chain.

6. Submit `XChainAccountCreateCommit` transactions from the witnesses' locking chain accounts to create corresponding accounts on the issuing chain.

7. Create an attestation for each `XChainAccountCreateCommit` transaction. These attestations must be signed by the genesis seed.

    **Note:** This can also be done by a witness server that is set up to not submit transactions.

8.  Submit the attestations with the `XChainAddAccountCreateAttestation` transaction on the issuing chain, using the genesis account.

9.  Submit a `SignerListSet` transaction from the genesis account on the issuing chain, using the witnesses' signing keys as the signers.

10. Disable the master key on the issuing chain's genesis account with an `AccountSet` transaction.


## See Also

- **Transactions:**
  - [AccountSet](https://xrpl.org/accountset.html)
  - [SignerListSet](https://xrpl.org/signerlistset.html)
  - [XChainCreateBridge](../transaction-types/xchaincreatebridge.md)
  - [XChainAccountCreateCommit](../transaction-types/xchainaccountcreatecommit.md)
  - [XChainAddAccountCreateAttestation](../transaction-types/xchainaddaccountcreateattestation.md)
- [List of Parallel Networks](../parallel-networks-list.md)
---
html: escrow-uc.html
parent: payments-uc.html
seo:
    description: Transactions allow accounts to modify the XRP Ledger.
labels:
  - Ledgers
---
# Smart Contracts

A smart contract is a blockchain-based program that handles the conditions and executes the fulfillment of an agreement between two parties. Broken into its simplest components, a smart contract _does_ something if _something else_ happens.

![Smart Contract](/docs/img/uc-smart-contract.png) 

The benefit of encoding a smart contract into a blockchain is that it enables contracts to be securely carried out without traditional third parties like financial or legal institutions. Instead, the contract is supervised by the distributed, decentralized network of computers that run the blockchain.

This enables you to transact with anybody without having to trust they'll uphold their end of a deal: the conditions of the smart contract force them to comply.

## Conditionally Held Escrow

Smart contracts on the XRP Ledger work through conditionally held escrows.


### Create the Escrow

A conditionally held escrow is similar to a normal escrow: you set aside funds with an escrow to guarantee funds are available to a recipient. The difference is that a conditionally held escrow on the ledger has a `Condition` attached to it, which serves as a lock on the funds. The ledger won't release those funds until an `EscrowFinish` transaction is submitted with the corresponding `Fulfillment` field. 

![Escrow with lock and key](/docs/img/uc-yescrow-holding-lock-and-key.png)


The `Condition` and `Fulfillment` fields can be viewed as a lock and key on an escrow.

See: [`EscrowCreate`](../../references/protocol/transactions/types/escrowcreate.md).


### Establish the Oracle

An oracle is a neutral third-party agent that can verify real-world events to either fulfill or invalidate a smart contract. Oracles are vital to making conditional escrows work by generating the condition and fulfillment, and keeping the fulfillment secret until the terms of the contract are met.

![The Oracle](/docs/img/uc-the-oracle.png)

In the context of smart contracts, an oracle will most likely be software that can read real-world data. The oracle would be programmed with the terms of the contract between parties and generate the condition and fulfillment hex values.

The oracle gives the condition hex value to the escrow creator, enabling them to set up the escrow initially.

After the oracle's programming detects the conditions are met, it gives the fulfillment hex value to the escrow recipient. It does nothing else after this point, such as finishing the escrow. The recipient of the escrow would most likely finish the escrow.

See: [Generate a condition and fulfillment](../../tutorials/how-tos/use-specialized-payment-types/use-escrows/send-a-conditionally-held-escrow.md#1-generate-condition-and-fulfillment).

## Examples

Smart contracts have a wide range of uses, but some uses include:

1. Handling payments on large-value items you would otherwise need lawyers for, such as mortgages.
![Real Estate and Supply Chain](/docs/img/uc-smart-contract-real-estate-supplies.png)
2. Supply-chain management to ensure funds are delivered upon receipt of goods.
3. Automating certain kinds of insurance claims that can be verified by software.
![Insurance and Payments](/docs/img/uc-smart-contract-insurance.png)
4. Ensuring payments are given for services rendered.

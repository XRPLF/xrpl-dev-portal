# Create a Smart Contract Using Escrows

<ul>A smart contract is a blockchain-based program that encodes the conditions and fulfillment of an agreement between two or more parties and automatically fulfills the terms of the agreement once conditions are met.</u>

<ul>A smart contract can help you exchange anything of value in a transparent, traceable, tamper-resistant, and irreversible way.</ul>

<ul>The benefit of encoding a smart contract into a blockchain is that it enables the contract to be securely performed without traditional third-parties, like financial or legal institutions, which can result in lower costs. Instead, the contract is supervised by the distributed, decentralized network of computers that run the blockchain.</ul>

<ul>You can use the XRP Ledger escrow feature to provide smart contracts that release XRP after a certain time has passed or after a cryptographic condition has been fulfilled. In this case, we'll create a smart contract using a conditionally held escrow that releases XRP after a cryptographic condition has been fulfilled.</ul>

<ul>Consider this scenario that we'll use to frame this use case: A party planner uses smart contracts to manage payments from their clients (party hosts) to party vendors, such as caterers and bands. Specifically, the party planner wants to use a smart contract to enable its party host to pay their party band 2000 XRP once it finishes playing its set.</ul>

<ul>Here’s a roadmap to the high-level tasks that the participants need to complete to implement this smart contract using an XRP Ledger escrow.</ul>



{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Meet the prerequisites

The party host must have:

- An XRP Ledger account to pay XRP into the escrow.

- Access to a `rippled` server that they can use to create the escrow and, if necessary, cancel it.

The party band must have:

- An XRP Ledger account to receive XRP paid by the escrow.

- The ability to look up an XRP Ledger transaction hash. For example, they can use the [RPC Tool](https://developers.ripple.com/xrp-ledger-rpc-tool.html) or have access to a `rippled` server that they can use to send transactions.

The party planner must have:

- Access to a `rippled` server that they can use to finish the escrow.



<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## Define the terms of the smart contract

Before the party host can create the smart contract, the participants must clearly define what they want the smart contract to do. For example, to create an escrow that provides the smart contract in this scenario, the participants will need to agree upon the following details:

- Should the smart contract be fulfilled after a specific time has passed or after a cryptographic condition has been fulfilled?

  Because the smart contract must be fulfilled only after the party band has completed their set, the participants should use a smart contract that is fulfilled after a cryptographic condition has been fulfilled.

  Even if the party band agrees to show up and complete their set at a designated time, the participants shouldn't use a time-based contract because of the possibility that the party band won't show up.

- Should the participants be able to cancel the smart contract after a specific time period if the condition is not fulfilled?

  The participants agree that the escrow can be canceled after 11:00 pm the night of the party, which is when the party band is scheduled to complete their set. After cancellation, the locked XRP will then return to the party host's account.

- Should the smart contract disallow fulfillment until a specific time?

  The participants agree to disallow the smart contract from being fulfilled until 11:00 pm the night of the party, which is when the party band is scheduled to complete their set. ***TODO: not necessary, but just an extra precaution? Or just unnecessary?***

- How much XRP should the smart contract to hold and potentially pay?

  The participants agree that the smart contract should hold and potentially pay 2000 XRP, which is the party band's fee.

- Which XRP Ledger account should the smart contract pay XRP out of?

  The participants agree that the smart contract should pay XRP out of the party host's XRP Ledger account.

- Which XRP Ledger account should the smart contract pay XRP into?

  The participants agree that the smart contract should pay XRP to the party band's XRP Ledger account.



<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Generate a condition and a fulfillment](send-a-conditionally-held-escrow.html#1-generate-condition-and-fulfillment) (party planner)

Because participants want to create a conditionally held escrow to provide the smart contract, the party planner must generate a condition and a fulfillment.

The party planner provides the condition value to the party host, who will create the escrow that provides the smart contract.

The party planner keeps the fulfillment value a secret until it is time to fulfill the contract.

In this use case, the party planner is playing the role of an _oracle_. In the context of smart contracts, an oracle is a third-party agent that can verify real-world events to either fulfill or invalidate a smart contract. This use case uses a human oracle for illustrative purposes, but in real-life, a software application would more likely play the role of the oracle to automate the process.

Using an XRP Ledger escrow to provide this smart contract is a great arrangement because the party planner, as the third-party oracle, never "holds" the funds as one might in a traditional escrow arrangement, and can't possibly take the funds for themselves.



<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Calculate times needed for the contract](send-a-conditionally-held-escrow.html#2-calculate-release-or-cancel-time) (party planner)

Because the participants want the smart contract to be eligible for cancellation the day after the party if the contact is not fulfilled, the party host must calculate a `CancelAfter` value to include in the escrow definition.

Because the participants want to disallow the smart contact from being fulfilled until the time at which the party band is scheduled to finish its set at the party, the party host must calculate a `FinishAfter` value to include in the escrow definition.

The party band can validate these values after the party host creates the escrow.



<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Create the escrow](send-a-conditionally-held-escrow.html#3-submit-escrowcreate-transaction) (party host)

Create the escrow to provide the smart contract. The party host must create the escrow because they are the only participant that can authorize the lock up and potential payout of XRP from their XRP Ledger account.



<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Wait for validation](send-a-conditionally-held-escrow.html#4-wait-for-validation) and [confirm escrow creation](send-a-conditionally-held-escrow.html#5-confirm-that-the-escrow-was-created) (party host and party band)

Wait for validation of the ledger that contains the escrow creation transaction and then confirm that the escrow was created.

At this time, the party host provides the escrow transaction's `hash` value to the party band. The party band can use the `hash` value to look up the escrow transaction on the XRP Ledger to ensure that it is been created correctly.



<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Finish the escrow](send-a-conditionally-held-escrow.html#6-submit-escrowfinish-transaction) (party planner)

The party band shows up and plays their set as defined in the smart contract.

The party planner finishes the escrow using the fulfillment value they generated and kept secret.

If the party band is a no-show, the party planner does not finish the escrow, but rather [cancels the escrow](cancel-an-expired-escrow.html) to return the held XRP to the party host's account.


<span class="use-case-step-num">{{n.next()}}</span>
<!-- <span class="use-case-step-length">(1 hour)</span> -->
## [Wait for validation](send-a-conditionally-held-escrow.html#7-wait-for-validation) and [confirm escrow finish](send-a-conditionally-held-escrow.html#8-confirm-final-result) (party planner, party host, and party band)

Wait for validation of the ledger that contains the escrow finish transaction and then confirm that the escrow was finished.

At this time, the party planner provides the transaction's `hash` value to the party host and party band. The party host and party band can use the `hash` value to look up the escrow transaction on the XRP Ledger to ensure that it is been finished correctly. The party host and band can also just check their XRP Ledger account balances to ensure that the balances have decreased and increased by 2000 XRP accordingly.



### Related Tasks

- [Send a Time-Held Escrow](send-a-time-held-escrow.html)
- [Cancel an Expired Escrow](cancel-an-expired-escrow.html)
- [Look Up Escrows](look-up-escrows.html)

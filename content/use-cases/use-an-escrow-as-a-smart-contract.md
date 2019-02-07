# Use an Escrow as a Smart Contract

***TODO: Content in this use case breaks the Use Case template. Let's figure out a way to adjust either the template or content to make this work.***

***TODO: Interested in how we talk about escrow vs smart contract here. Is the escrow something that can provide, be used as, or serve as a smart contract? I'm open to the language we use to describe this relationship.***

A smart contract is a blockchain-based program that encodes the conditions and fulfillment of an agreement between two or more parties and automatically fulfills the terms of the agreement once conditions are met.

A smart contract can help you exchange anything of value in a transparent, traceable, tamper-resistant, and irreversible way.

The benefit of encoding a smart contract into a blockchain is that it enables the contract to be securely performed without traditional third-parties, like financial or legal institutions, which can result in lower costs. Instead, the contract is supervised by the distributed, decentralized network of computers that run the blockchain.

You can use XRP Ledger escrows as smart contracts that release XRP after a certain time has passed or after a cryptographic condition has been fulfilled. In this case, we'll use an escrow as a smart contract that releases XRP after a cryptographic condition has been fulfilled.

Let's use this scenario to help illustrate this use case: A party planner uses smart contracts to manage payments from party hosts to party vendors. Specifically, the party planner wants to use a smart contract to have the party host pay the party band 2000 XRP once they are done with their set. ***TODO: this is a far-out example -- but I had to use something really tangible to be able to make myself understand the logistics of how this might work. I'm open to any other scenario that might be more appropriate.***

In this use case, the party host is the sender of the escrow, the party band is the receiver of the escrow, and the party planner is playing the role of an _oracle_. In the context of smart contracts, an oracle is a neutral third-party agent that can verify real-world events to either fulfill or invalidate a smart contract. This use case uses a human oracle for illustrative purposes, but in real-life, a software application would more likely play the role of the oracle to automate the process.

Using an XRP Ledger escrow to provide this smart contract is a great arrangement because the party planner, as the third-party oracle, never "holds" the funds as one might in a traditional escrow arrangement, and can't possibly take the funds for themselves.

Here’s a roadmap to the high-level tasks that these participants need to complete to use an escrow as a smart contract.


{% set n = cycler(* range(1,99)) %}

<span class="use-case-step-num">{{n.next()}}</span>
## Meet the prerequisites

The party host (sender) must have:

- An XRP Ledger [account](accounts.html#creating-accounts) that holds enough XRP to pay for escrow and any fees incurred.

- Access to a [`rippled` server](install-rippled.html) that they can use to create the escrow.

The party band (receiver) must have:

- An XRP Ledger [account](accounts.html#creating-accounts) that can receive the XRP paid by the escrow.

- The ability to look up the details of an XRP Ledger transaction hash. For example, they can use the [RPC Tool](https://developers.ripple.com/xrp-ledger-rpc-tool.html) or access a [`rippled` server](install-rippled.html) that they can use to look up the transaction hash.

The party planner (oracle) must have:

- The ability to generate a condition and a fulfillment.

- Access to a [`rippled` server](install-rippled.html) that they can use to submit the fulfillment value and finish the escrow.



<span class="use-case-step-num">{{n.next()}}</span>
## Define the terms of the smart contract

To create the escrow as a smart contract, the participants must first define the terms of the contract. In this scenario, the participants need to agree on the following details.

- Should the escrow be fulfilled after a specific time has passed or after a cryptographic condition has been fulfilled?

    - *[Conditionally-held escrow](send-a-conditionally-held-escrow.html)*: In this case, the participants agree to use a conditionally-held escrow. This is a good choice because the smart contract can be fulfilled only after the party planner (oracle) verifies that the party band completed their set and submits the cryptographic condition and fulfillment to finish the escrow and release the XRP.

    To handle a no-show scenario, the participants configure the escrow to be eligible for cancellation after a specific time. Typically, this cancellation time should be after the time at which the party planner is expected to finish the escrow. The the cancellation time in this way helps prevent the party host from maliciously cancelling the escrow before the party planner can finish the escrow.

    The conditionally-held escrow provides the functionality required to handle the terms of this smart contract by putting the ability to finish the escrow solely in the hands of the neutral party planner (oracle).

    - *[Time-held escrow](send-a-time-held-escrow.html)*: A time-held escrow is not the best choice for this scenario because the party band could be a no-show. If the party band is scheduled to finish their set at 11 p.m., the participants could agree to allow the escrow to finish and release the XRP at 11 p.m. At 11 p.m., any participant, including the party band, can finish the escrow and release the XRP, even if the band didn't show up. This does not meet the terms of the smart contract.

    The participants could agree to allow the cancellation of the escrow before 11 p.m. to accommodate the no-show scenario. However, consider that the party band could show up and play their set, but the party host cancels the escrow before a participant can finish the escrow at 11 pm.

- Should the escrow disallow fulfillment until a specific time?

  The participants agree to disallow the escrow from being fulfilled until 11 p.m. the night of the party, which is when the party band is scheduled to complete their set. ***TODO: not necessary, but just an extra precaution? Or just unnecessary?***

- Should the participants be able to cancel the escrow after a specific time period if the condition is not fulfilled?

  The participants agree that the escrow can be cancelled after 12 noon the day after the party. This gives the party planner enough time to finish the escrow, if the party band fulfills their end of the contract. After cancellation, the locked XRP returns to the party host's account.

  This timing also prevents the party host from maliciously cancelling the escrow before the party planner can finish the fulfilled contract.

- How much XRP should the escrow to lock up and potentially pay?

  The participants agree that the escrow should lock up and potentially pay 2000 XRP, which is the party band's fee.

- Which XRP Ledger account should the escrow lock up and potentially pay XRP out of?

  The participants agree that the escrow should lock up and potentially pay XRP out of the party host's XRP Ledger account.

- Which XRP Ledger account should the escrow lock up and potentially pay XRP into?

  The participants agree that the escrow should lock up and potentially pay XRP to the party band's XRP Ledger account.



<span class="use-case-step-num">{{n.next()}}</span>
## [Generate a condition and a fulfillment](send-a-conditionally-held-escrow.html#1-generate-condition-and-fulfillment) (oracle)

Because participants want to create a conditionally-held escrow to provide the smart contract, they need a condition value and a fulfillment value. In this scenario, the participant that creates these values is the neutral party planner (oracle).

The party planner generates the condition and fulfillment values and provides the condition value to the party host, who creates the escrow.

The party planner must keep the fulfillment value a secret. They will use the condition and fulfillment values to finish the escrow.



<span class="use-case-step-num">{{n.next()}}</span>
## [Calculate time values needed for the escrow](send-a-conditionally-held-escrow.html#2-calculate-release-or-cancel-time) (sender)

Because the participants want the escrow to be eligible for cancellation after 12 noon the day after the party, the party host (sender) must calculate a `CancelAfter` value to include in the escrow definition.

Because the participants want to disallow the escrow from being finished until after 11:00 pm the night of the party (the time when the party band is scheduled to finish its set), the party host must calculate a `FinishAfter` value to include in the escrow definition.



<span class="use-case-step-num">{{n.next()}}</span>
## [Create the escrow](send-a-conditionally-held-escrow.html#3-submit-escrowcreate-transaction) (sender)

The party host (sender) creates the escrow that provides the smart contract. The party host must create the escrow because they are the only participant that can authorize the lock up and potential payout of XRP from their XRP Ledger account.



<span class="use-case-step-num">{{n.next()}}</span>
## [Wait for validation](send-a-conditionally-held-escrow.html#4-wait-for-validation) and [confirm escrow creation](send-a-conditionally-held-escrow.html#5-confirm-that-the-escrow-was-created) (sender and receiver)

The party host (sender) waits for validation of the ledger that contains the escrow creation transaction and then confirms that the escrow was created.

The party host then provides the escrow transaction's `hash` value to the party band (receiver). The party band can use the `hash` value to look up the escrow transaction on the XRP Ledger to ensure that it was created according to the smart contract terms they agreed to.



<span class="use-case-step-num">{{n.next()}}</span>
## [Finish the escrow](send-a-conditionally-held-escrow.html#6-submit-escrowfinish-transaction) (oracle)

The party band (receiver) shows up and plays their set.

The party planner (oracle) finishes the escrow using the fulfillment value they generated and kept secret.

Alternatively, if the party band is a no-show, the party planner does not finish the escrow. In this case, after 12 noon the next day, any participant can [cancel the escrow](cancel-an-expired-escrow.html) to return the held XRP to the party host's (sender's) account.


<span class="use-case-step-num">{{n.next()}}</span>
## [Wait for validation](send-a-conditionally-held-escrow.html#7-wait-for-validation) and [confirm escrow finish](send-a-conditionally-held-escrow.html#8-confirm-final-result) (oracle, sender, and receiver)

The party planner (oracle) waits for validation of the ledger that contains the escrow finish transaction and then confirms that the escrow was finished.

At this time, the party planner provides the transaction's `hash` value to the party host (sender) and party band (receiver). The party host and party band can use the `hash` value to look up the escrow transaction on the XRP Ledger to ensure that it is been finished correctly. The party host and party band can also just check their XRP Ledger account balances to ensure that their balances have decreased and increased by 2000 XRP respectively.



### Related Tasks

- [Send a Time-Held Escrow](send-a-time-held-escrow.html)
- [Cancel an Expired Escrow](cancel-an-expired-escrow.html)
- [Look Up Escrows](look-up-escrows.html)

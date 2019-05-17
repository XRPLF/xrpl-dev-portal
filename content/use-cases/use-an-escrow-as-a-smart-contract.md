# Use an Escrow as a Smart Contract

A smart contract is a blockchain-based program that encodes the conditions and fulfillment of an agreement between two or more parties and automatically fulfills the terms of the agreement once conditions are met. A smart contract can help you exchange anything of value in a transparent, traceable, tamper-resistant, and irreversible way.

The benefit of encoding a smart contract into a blockchain is that it enables the contract to be securely performed without traditional third-parties, like financial or legal institutions. Instead, the contract is supervised by the distributed, decentralized network of computers that run the blockchain.

You can use XRP Ledger escrows as smart contracts that release XRP after a certain time has passed or after a cryptographic condition has been fulfilled. In this case, we'll use an escrow as a smart contract that releases XRP after a cryptographic condition has been fulfilled.

Let's use this scenario to help illustrate this use case: A party planner uses smart contracts to manage payments from party hosts to party vendors. Specifically, the party planner wants to use a smart contract to have the party host pay the party band 2000 XRP once they are done with their set.

In this use case, the party host is the sender of the escrow, the party band is the receiver of the escrow, and the party planner is playing the role of an _oracle_. In the context of smart contracts, an oracle is a neutral third-party agent that can verify real-world events to either fulfill or invalidate a smart contract. This use case uses a human oracle for illustrative purposes, but in real-life, a software application would more likely play the role of the oracle.

Using an XRP Ledger escrow to provide this smart contract is a great arrangement because the party planner, as the third-party oracle, never "holds" the funds as one might in a traditional escrow arrangement, and can't possibly take the funds for themselves.

Here’s a roadmap to the high-level tasks that these participants need to complete to use an escrow as a smart contract.



{% set n = cycler(* range(1,99)) %}
<!-- USE_CASE_STEPS_START -->
<span class="use-case-step-num">{{n.next()}}</span>
## Meet the prerequisites

The party host (sender) must have:

- An XRP Ledger [account](accounts.html#creating-accounts) that holds enough XRP to pay for escrow and any fees incurred.

- Access to a secure signing environment, which includes having a network connection to a [`rippled` server](install-rippled.html) (any server) that they can submit signed transactions to. <!--#{ once set up secure signing tutorial is available, link to it from here }# -->

The party band (receiver) must have:

- An XRP Ledger [account](accounts.html#creating-accounts) that can receive the XRP paid by the escrow.

- Access to a [`rippled` server](install-rippled.html) that they can use to look up the details of an XRP Ledger transaction hash and submit the fulfillment value to finish the escrow.

The party planner (oracle) must have:

- The ability to generate a condition and a fulfillment.

- To be able to keep a secret (the fulfillment) until the time is right.

- A way to communicate the fulfillment publicly or at least to the party band when the time is right.

- The ability to recognize whether the party band has fulfilled their end of the contract (played at the party).



<span class="use-case-step-num">{{n.next()}}</span>
## Define the terms of the smart contract

To create the escrow as a smart contract, the participants must first define the terms of the contract. In this scenario, the participants need to agree on the following details.

- **Should the escrow disallow fulfillment until a specific time?**

      While this is an option, the participants agree that it is unnecessary for their escrow. For conditionally-held escrows, enabling this option doesn't provide any additional security, since whether the escrow can be finished still depends entirely on whether the party planner (oracle) publishes the fulfillment before the expiration.

- **Should the escrow expire?**

      Absolutely yes. The participants agree that the escrow should expire after 12 noon the day after the party. This gives the party band (receiver) enough time to finish the escrow, after the party planner verifies that they fulfilled their end of the contract and publishes the cryptographic fulfillment. After expiration, the locked XRP returns to the party host's (sender's) account.

      If the participants don't allow the escrow to expire and the party planner doesn't release the condition, the XRP stays locked in the escrow forever.

- **How much XRP should the escrow lock up and potentially pay?**

      The participants agree that the escrow should lock up and potentially pay 2000 XRP, which is the party band's fee.

- **From which XRP Ledger account should the escrow lock up XRP for potential payment to the party band?**

      The participants agree that the escrow should lock up and potentially pay XRP out of the party host's XRP Ledger account.

- **Which XRP Ledger account should the escrow potentially pay XRP to?**

      The participants agree that the escrow should potentially pay XRP to the party band's XRP Ledger account.



<span class="use-case-step-num">{{n.next()}}</span>
## Oracle: Generate a condition and a fulfillment

Because participants want to create a conditionally-held escrow to provide the smart contract, they need a condition value and a fulfillment value. In this scenario, the participant that creates these values is the neutral party planner (oracle).

The party planner generates the condition and fulfillment values. The party planner provides the condition value to the party host, who creates the escrow. The part planner also provides the condition to the party band so that they know that this is the right condition.

The party planner must keep the fulfillment value a secret. Anyone can use the condition and fulfillment values to finish the escrow. Most often, the receiver finishes the escrow because they're the ones who are motivated to get paid.

[Generate a condition and a fulfillment >](send-a-conditionally-held-escrow.html#1-generate-condition-and-fulfillment)

<span class="use-case-step-num">{{n.next()}}</span>
## Sender: Calculate time values needed for the escrow

Because the participants want the escrow to be eligible for cancellation after 12 noon the day after the party, the party host (sender) must calculate a `CancelAfter` value to include in the escrow definition.

[Calculate time values needed for the escrow >](send-a-conditionally-held-escrow.html#2-calculate-release-or-cancel-time)


<span class="use-case-step-num">{{n.next()}}</span>
## Sender: Create the escrow

The party host (sender) creates the escrow that provides the smart contract. The party host must create the escrow because they are the only participant that can authorize the lock up and potential payout of XRP from their XRP Ledger account.

[Create the escrow >](send-a-conditionally-held-escrow.html#3-submit-escrowcreate-transaction)


<span class="use-case-step-num">{{n.next()}}</span>
## Sender and Receiver: Wait for validation and confirm escrow creation

The party host (sender) waits for validation of the ledger that contains the escrow creation transaction and then confirms that the escrow was created.

[Wait for validation >](send-a-conditionally-held-escrow.html#4-wait-for-validation) 

The party host then provides the escrow transaction's `hash` value to the party band (receiver). The party band can use the `hash` value to look up the escrow transaction on the XRP Ledger to ensure that it was created according to the smart contract terms they agreed to. As part of this step, the party band should confirm that the condition matches the one the party planner (oracle) provided. If the condition is wrong, the fulfillment the party planner provides won't let the party band finish the escrow and get paid.

[confirm escrow creation >](send-a-conditionally-held-escrow.html#5-confirm-that-the-escrow-was-created)


<span class="use-case-step-num">{{n.next()}}</span>
## Receiver: Finish the escrow

The party band (receiver) shows up and plays their set.

The party planner (oracle) is present at the party to ensure that everything is going smoothly. The party planner confirms first-hand that the party band has fulfilled their contract and publishes the fulfillment publicly, or at least to the party band.

The party band must finish the escrow before 12 noon. If they don't, the escrow expires and the party band doesn't get paid.

If the party planner does not publish the fulfillment (the party band is a no show) or if the party planner publishes the fulfillment, but no one finishes the escrow; after 12 noon the next day, anyone can [cancel the escrow](cancel-an-expired-escrow.html). Cancelling the escrow returns the held XRP to the party host's account.

[Finish the escrow >](send-a-conditionally-held-escrow.html#6-submit-escrowfinish-transaction)


<span class="use-case-step-num">{{n.next()}}</span>
## Receiver and Sender: Wait for validation and confirm final result

The party band (receiver) waits for validation of the ledger that contains the escrow finish transaction and then confirms that the escrow was finished.

At this time, the party band provides the transaction's `hash` value to the party host (sender). They can use the `hash` value to look up the escrow transaction on the XRP Ledger to ensure that it is been finished correctly.

The party band can check their XRP Ledger account balance to ensure that their balance has increased by 2000 XRP. The party host's balance won't change at this step (unless the escrow was canceled) because the escrow creation already debited the locked-up XRP from their account.

[Wait for validation >](send-a-conditionally-held-escrow.html#7-wait-for-validation)

[confirm final result >](send-a-conditionally-held-escrow.html#8-confirm-final-result)

<!-- USE_CASE_STEPS_END -->

### Related Tasks
<div class='related-tasks-links'>

- [Send a Time-Held Escrow](send-a-time-held-escrow.html)
- [Cancel an Expired Escrow](cancel-an-expired-escrow.html)
- [Look Up Escrows](look-up-escrows.html)

</div>
# Open a Payment Channel and Connect to the Internet of Value

***TODO: Open to suggestions on this title. In talking with PM, we want to emphasize the possibilities of the "inter-exchange network" and the exchange being able to connect to the Internet of Value.***

If you are a digital asset exchange that makes multiple XRP payments to another exchange with some degree of frequency, consider opening an XRP Ledger [payment channel](payment-channels.html) between your exchange (the _payer exchange_) and the other exchange (the _payee exchange_). For example, you may be an exchange that needs to rebalance your account on your exchange with an account you own on another exchange ***TODO: not sure about this - accurate? useful to mention as an example?*** A payment channel enables you to send one-way, "asynchronous" XRP payments that can be divided into very small increments and settled later.

With this use case in mind, here are some of the benefits of using a payment channel instead of individual payment transactions to send XRP:

- **Experience faster processing:** A standard XRP payment involves sending an XRP Ledger transaction and waiting for a new ledger version to be approved by [consensus](https://developers.ripple.com/consensus.html). When you use a payment channel to send XRP, creation and verification of a claim, which is a guarantee of XRP payment, all happen outside of the consensus process. This means that a payer exchange can guarantee XRP payments to a payee exchange at a rate limited only by the participants' ability to create and verify the digital signatures of the payment channel claims.

- **Lower transaction costs:** The payee exchange can choose to take payment channel claims it has received from a payer exchange and redeem them in batches to receive the guaranteed XRP amount. Redeeming a batch of claims in a single transaction incurs a single transaction fee, while processing multiple XRP payment transactions (one per claim without a payment channel in place, for example) incurs multiple transaction fees.

- **Connect to the Internet of Value:** One of the key requirements of the [Internet of Value](https://ripple.com/insights/the-internet-of-value-what-it-means-and-how-it-benefits-everyone/) is interoperability. The [Interledger Protocol](https://interledger.org/) (ILP), which plays a large role in driving this interoperability, [uses payment channels](https://interledger.org/rfcs/0027-interledger-protocol-4) as its method for rebalancing accounts, whether it uses the XRP Ledger's payment channels, Bitcoin's micropayment channels, or Ethereum's state channels. When you open a payment channel from your exchange to another, you are connecting your exchange to the Internet of Value and helping to create the inter-exchange network that is fundamental to the success of the Internet of Value.

Here’s a roadmap to the high-level tasks you’ll need to perform to implement this payment channel use case.


{% set n = cycler(* range(1,99)) %}


<span class="use-case-step-num">{{n.next()}}</span>
## [Understand payment channels](payment-channels.html)

Payment channels enable you to send "asynchronous" XRP payments that can be divided into very small increments and settled later. Learn more about them and whether they provide the features your use case requires.


<span class="use-case-step-num">{{n.next()}}</span>
## [Set up and run `rippled` servers](manage-the-rippled-server.html) (payer and payee)

To be able to use a payment channel to send and receive payments, both the payer and payee exchanges must each have access to a `rippled` server that they can use to send transactions. A great way for an exchange to get access to a `rippled` server is to set up and run one.


<span class="use-case-step-num">{{n.next()}}</span>
## [Fund XRP Ledger accounts](accounts.html) (payer and payee)

The payer exchange must have a funded XRP Ledger account to be used to send XRP to the payee exchange.

The payee exchange must have a funded XRP Ledger account to be used to redeem XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Open a payment channel](use-payment-channels.html#1-the-payer-creates-a-payment-channel-to-a-particular-recipient) (payer) and [verify it](use-payment-channels.html#2-the-payee-checks-specifics-of-the-payment-channel) (payee)

The payer exchange opens a payment channel to the payee exchange.

The payee exchange then reviews the details of the payment channel.

***TODO: do we have any best practices around how long a payment channel should be allowed to remain open for this use case? For example, is it okay to keep it open for a year and just add more XRP to the payment channel whenever more XRP needs to be moved? Or do you want to close it as soon as possible? Should the payer allow the payment channel to hold just enough XRP for the initial claim (bc the payment channel locks up the XRP for a given time period) and then update the channel to hold more XRP the next time they want to send another claim? Does it matter - is there a best practice?***

<span class="use-case-step-num">{{n.next()}}</span>
## [Create a claim](use-payment-channels.html#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel) and [send it](use-payment-channels.html#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services) (payer)

The payer exchange creates a claim for an amount of XRP that it wants to send to the payee exchange and then sends the claim details to the payee exchange off-ledger.


<span class="use-case-step-num">{{n.next()}}</span>
## [Verify the claim](use-payment-channels.html#5-the-payee-verifies-the-claims) and [redeem it](use-payment-channels.html#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount) (payee)

The payee exchange verifies the claim sent by the payer exchange.

This is usually when the payee provides goods or services to the payer in exchange for the amount of XRP listed in the claim. However, in this use case, there is likely no exchange of goods or services. The payee exchange can just redeem the claim to receive the XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Continue to use the payment channel](use-payment-channels.html#7-repeat-steps-3-6-as-desired) (payer and payee)

Payer and payee exchanges can continue to send, verify, and redeem claims as needed within the parameters set by the payment channel.


<span class="use-case-step-num">{{n.next()}}</span>
## When it's time, make a request to [close the payment channel](use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed) (payer)

When the payer exchange and payee exchange are done using the payment channel, the payer exchange can make a request to close the payment channel.


### Related Tasks

To access the full payment channel tutorial, see [Use Payment Channels](use-payment-channels.html).

***TODO: any suggested related tasks? maybe list your exchange data in XRP Charts?***

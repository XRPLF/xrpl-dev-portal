# Use a Payment Channel to Move XRP Between Exchanges

***TODO: what do we think of this use case title? I like using the name of the feature and also describing the task to be performed. Is the title accurate? Is it too long?***

As a digital exchange, you may need the ability to send XRP to another digital exchange. A straightforward way to do this is through a Payment Channel. For example, XXXXXXXX. ***TODO: what is a real-life description of this use case in action between two digital exchanges?*** In this use case, the exchange sending XRP is called the _payer exchange_. The exchange receiving XRP is called the _payee exchange_. Here’s a roadmap to the high-level tasks you’ll need to perform to implement this Payment Channel use case.

{% set n = cycler(* range(1,99)) %}


<span class="use-case-step-num">{{n.next()}}</span>
## [Understand Payment Channels](payment-channels.html)

Payment Channels enable you to send "asynchronous" XRP payments that can be divided into very small increments and settled later. Learn more about them and whether they provide the features your use case requires.


<span class="use-case-step-num">{{n.next()}}</span>
## [Set up and run `rippled` servers](manage-the-rippled-server.html)

To be able to use a Payment Channel to send and receive payments, both the payer and payee exchanges must each have access to a `rippled` server that they can use to send transactions. A great way for an exchange to get access to a `rippled` server is to set up and run one.


<span class="use-case-step-num">{{n.next()}}</span>
## [Fund XRP Ledger accounts](accounts.html)

The payer exchange must have a funded XRP Ledger account to be used to send XRP to the payee exchange.

The payee exchange must have a funded XRP Ledger account to be used to redeem XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Open a Payment Channel](use-payment-channels.html#1-the-payer-creates-a-payment-channel-to-a-particular-recipient) and [verify it](use-payment-channels.html#2-the-payee-checks-specifics-of-the-payment-channel)

The payer exchange opens a Payment Channel to the payee exchange.

The payee exchange then reviews the details of the Payment Channel.

***TODO: do we have any best practices around how long a payment channel should be allowed to remain open for this use case? Is it okay to keep it open for a year and just add more XRP to the Payment Channel whenever more XRP needs to be moved? Or do you want to close it as soon as possible? How much XRP should the payer allow the payment channel to hold? Just enough for the initial claim and then update the channel to hold more XRP the next time you want to send another claim?***

<span class="use-case-step-num">{{n.next()}}</span>
## [Create a payment claim](use-payment-channels.html#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel) and [send it](use-payment-channels.html#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services)

The payer exchange creates a claim for an amount of XRP that it wants to send to the payee exchange and then sends the claim details to the payee exchange off-ledger.


<span class="use-case-step-num">{{n.next()}}</span>
## [Verify the payment claim](use-payment-channels.html#5-the-payee-verifies-the-claims) and [redeem it](use-payment-channels.html#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount)

The payee exchange verifies the payment claim sent by the payer exchange.

This is usually when the payee provides goods or services to the payer in exchange for the amount of XRP listed in the payment claim. However, in this use case, there is likely no exchange of goods or services. The payee exchange can just redeem the payment claim to receive the XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## Continue to use the Payment Channel and [close it when you're ready](use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed)

Payer and payee exchanges can continue to send, verify, and redeem payment claims as needed within the parameters set by the Payment Channel. When ready, the payer exchange can request that the Payment Channel be closed.


### Related Tasks

***TODO: any suggested related tasks? maybe list your exchange data in XRP Charts?***

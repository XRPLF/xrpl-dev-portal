# Open a Payment Channel to Move XRP Between Exchanges (and Connect to the Internet of Value)

***TODO: Long title? LOL But I wanted to provide it and open up a discussion about it. The first half of the title describes the task -- the second half addresses a more aspirational task that PM would like to surface for the use case. Any thoughts?***

***TODO: If you look at the generated HTML, you'll see some CSS formatting that I think we'll need to fix before publishing. Or perhaps there's a workaround?***

***TODO: The language is still pretty rough b/c I'm still working on fully understanding the use case. Once I'm closer to the truth - I'll refine the language.***

As a digital asset exchange, do you make multiple XRP payments to another exchange with some degree of frequency? For example, do you routinely rebalance an account on your exchange with an account you own on another exchange? ***TODO: not sure about this - accurate? useful to mention as an example? Any other example we might want to list?***

If this usage pattern sounds familiar, consider opening an XRP Ledger [payment channel](payment-channels.html) between your exchange (what we'll refer to as the _payer exchange_) and the other exchange (the _payee exchange_). A payment channel enables you to send one-way, "asynchronous" XRP payments that can be divided into very small increments and settled later.

Here are some of the benefits of using a payment channel to send XRP instead of using individual payment transactions:

- **Achieve faster processing:** A standard payment transaction involves submitting an XRP Ledger transaction and waiting for a new ledger version that includes the transaction to be approved by [consensus](https://developers.ripple.com/consensus.html). When you use a payment channel to send XRP, creation and verification of a claim, which guarantees the payment of XRP, all happen outside of the consensus process. This means that a payer exchange can guarantee XRP payments to a payee exchange at a rate limited only by the participants' ability to create and verify the digital signatures of the payment channel claims.

- **Lower transaction costs:** The payee exchange can choose to take payment channel claims it has received from a payer exchange and redeem them in batches to receive the guaranteed XRP amounts. Redeeming a batch of claims in a single transaction incurs a single transaction fee, while processing multiple XRP payment transactions (one per claim without a payment channel in place, for example) to receive the same amount of XRP incurs multiple transaction fees. **TODO: accurately stated? Is the batch processing primarily what reduces the transaction cost? And just to understand this for myself using oversimplified examples: When sending XRP via a standard payment transaction - the sender incurs the fee, correct? When sending XRP via a payment channel - the sender incurs a fee to create the channel, the receiver incurs a fee for each batch redemption, and the sender incurs a fee to close the channel -- is this right? So using a payment channel starts to save transaction costs once you use a batch redemption to process what would otherwise have been four individual payment transactions - something like that - again, just for my own understanding?***

- **Connect to the Internet of Value:** One of the key requirements of the [Internet of Value](https://ripple.com/insights/the-internet-of-value-what-it-means-and-how-it-benefits-everyone/) is interoperability. The [Interledger Protocol](https://interledger.org/) (ILP), which plays a large role in driving this interoperability, [uses payment channels](https://interledger.org/rfcs/0027-interledger-protocol-4) as its method for rebalancing accounts, whether it uses the XRP Ledger's payment channels, Bitcoin's micropayment channels, or Ethereum's state channels, for example. ***TODO: is the use of "rebalancing" correct here? I got this definition from the Payment Channel description on https://interledger.org/rfcs/0027-interledger-protocol-4/. In the context of talking about ILP, okay to mention Bitcoin and Ethereum examples?*** In effect, when you open a payment channel from your exchange to another, you are connecting to the Internet of Value and helping to create the inter-exchange network that is fundamental to the success of the Internet of Value and the apps that are built on it. ***TODO: Really unsure of this text -- accurately stated? This is addressing three things I talked about with PM: connecting to the IoV, building the inter-exchange network, and also surfacing the possibilities around exchanges being considered for use by IoV apps.***

Here’s a roadmap to the high-level tasks you’ll need to perform to implement this payment channel use case. To go directly to a full payment channels tutorial, see [Use Payment Channels](use-payment-channels.html).


{% set n = cycler(* range(1,99)) %}


<span class="use-case-step-num">{{n.next()}}</span>
## [Understand payment channels](payment-channels.html)

Learn more about payment channels and whether they provide the features you need for your specific implementation.


<span class="use-case-step-num">{{n.next()}}</span>
## [Set up and run `rippled` servers](manage-the-rippled-server.html) (payer and payee)

To use a payment channel to send and receive payments, both the payer and payee exchanges must each have access to a `rippled` server that they can use to send transactions. A great way for an exchange to get access to a `rippled` server is to set up and run one.


<span class="use-case-step-num">{{n.next()}}</span>
## [Fund XRP Ledger accounts](accounts.html) (payer and payee)

The payer exchange must have a funded XRP Ledger account to be used to send XRP to the payee exchange.

The payee exchange must have a funded XRP Ledger account to be used to redeem XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Open a payment channel](use-payment-channels.html#1-the-payer-creates-a-payment-channel-to-a-particular-recipient) (payer) and [verify it](use-payment-channels.html#2-the-payee-checks-specifics-of-the-payment-channel) (payee)

The payer exchange opens a payment channel to the payee exchange. Opening a payment channel includes setting certain specifics of the channel, such as its expiration date and the amount it can hold. For this exchange use case, there is no real need to ever close the channel, so you may not want to define a `CancelAfter` (expiration) value. If you ever need to close the channel, you can still do so. Regarding the amount of XRP the channel should hold, consider this example: As an exchange, you are likely holding 97% of XRP across all of your user accounts in a cold wallet and 3% in hot wallet. When deciding on the amount a payment channel should hold, think about how much of the 3% in the hot wallet you want to set the payment channel to be able to use. You have the option to increase the amount allocated to the channel after you create it. ***TODO: Accurately stated? How do we feel about providing this info? Is this appropriate here in this use case? I'm thinking that it is appropriate if it is specific to this use case. If this guidance can be useful beyond this use case, it may be worth adding this info to the PaymentChannelCreate Fields reference or the Using Payment Channels tutorial. Any thoughts?***

The payee exchange then reviews the details of the payment channel.


<span class="use-case-step-num">{{n.next()}}</span>
## [Create claims](use-payment-channels.html#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel) and [send them](use-payment-channels.html#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services) (payer)

The payer exchange creates one or more claims for amounts of XRP that it wants to guarantee to the payee exchange and then sends the claim details to the payee exchange off-ledger. ***TODO: making this about multiple claims b/c the benefits described above are dependent on the payee being able to send multiple claims quickly -- and the payee being able to redeem multiple claims for a reduced transaction cost. Sound okay?***


<span class="use-case-step-num">{{n.next()}}</span>
## [Verify claims](use-payment-channels.html#5-the-payee-verifies-the-claims) and [redeem them in batches](use-payment-channels.html#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount) (payee)

The payee exchange verifies claims sent by the payer exchange.

This is usually when the payee provides goods or services to the payer in exchange for the amount of XRP listed in the claims. However, in this use case, there is likely no exchange of goods or services. The payee exchange can just redeem batches of claims to receive the XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Continue to use the payment channel](use-payment-channels.html#7-repeat-steps-3-6-as-desired) (payer and payee)

Payer and payee exchanges can continue to send, verify, and redeem batches of claims as needed within the parameters set by the payment channel.


<span class="use-case-step-num">{{n.next()}}</span>
## When it's time, make a request to [close the payment channel](use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed) (payer)

When the payer exchange and payee exchange are done using the payment channel, the payer exchange can make a request to close the payment channel.


### Related Tasks

***TODO: any suggested related tasks? maybe list your exchange data in XRP Charts?***

# Open a Payment Channel to Enable an Inter-Exchange Network

As a digital asset exchange, do you make multiple XRP payments to another exchange with some degree of frequency? If this usage pattern sounds familiar, consider opening an XRP Ledger [payment channel](payment-channels.html) between your exchange (the _payer_ exchange) and the other exchange (the _payee_ exchange). A payment channel enables you to send one-way, "asynchronous" XRP payments that can be divided into very small increments and settled later. Here are some of the benefits of using a payment channel to send XRP instead of using individual payment transactions:

- **Achieve faster processing:** A standard payment transaction involves submitting an XRP Ledger transaction and waiting for a new ledger version that includes the transaction to be approved by [consensus](https://developers.ripple.com/consensus.html). When you use a payment channel to send XRP, creation and verification of a claim, which guarantees the payment of XRP, all happen outside of the consensus process. This means that the payer exchange can guarantee XRP payments to the payee exchange at a rate limited only by the participants' ability to create and verify the digital signatures of the claims.

- **Lower transaction costs:** The payee exchange can choose to take the claims it has received from the payer exchange and redeem them in batches to receive the guaranteed XRP amounts. Redeeming a batch of claims in a single transaction incurs a _single_ set of transaction costs (any applicable reference transaction, load, and open ledger costs), while processing multiple XRP payment transactions (one per claim without a payment channel in place, for example) to receive the same amount of XRP incurs _multiple_ sets of transaction costs. ***TODO: accurately stated?***

- **Connect to the Internet of Value:** One of the key requirements of the [Internet of Value](https://ripple.com/insights/the-internet-of-value-what-it-means-and-how-it-benefits-everyone/) is interoperability. The [Interledger Protocol](https://interledger.org/) (ILP), which plays a large role in driving this interoperability, [uses payment channels](https://interledger.org/rfcs/0027-interledger-protocol-4) as its method for rebalancing accounts, whether it uses the XRP Ledger's payment channels, Bitcoin's micropayment channels, or Ethereum's state channels, for example. In effect, when you open a payment channel from your exchange to another, you are connecting to the Internet of Value and helping to create the inter-exchange network that is fundamental to the success of the Internet of Value and the apps that are built on it.

<ul>Here’s a roadmap to the high-level tasks you’ll need to perform to implement this payment channel use case. To go directly to a full payment channels tutorial, see <a href="use-payment-channels.html">Use Payment Channels</a>.</ul> ***TODO: I put this paragraph above in an HTML ul tag to keep the CSS formatting on this page somewhat sane. I know that it is unnecessarily indented, but if I make it a regular paragraph, the formatting will break and look even more conspicuous. We can fix the CSS in a future release.***

<!-- #{TODO: for the future: per Warren, it would be great to add diagrams for each step in the flow - showing claims and batch redemptions moving through the payment channel}# -->

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

The payee exchange must have a funded XRP Ledger account to be used to redeem (receive) XRP sent by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Open a payment channel](use-payment-channels.html#1-the-payer-creates-a-payment-channel-to-a-particular-recipient) (payer) and [verify it](use-payment-channels.html#2-the-payee-checks-specifics-of-the-payment-channel) (payee)

The payer exchange opens a payment channel from a payer exchange account to a payee exchange account. Opening a payment channel includes setting certain specifics of the channel, such as its expiration date and the amount it can hold.

For this exchange use case, there is no real need to ever close the channel, so you may not want to define a `CancelAfter` (expiration) value. If you ever need to close the channel, you can still do so.

Regarding the amount of XRP the payment channel should hold, consider the typical best practice of holding the vast majority of XRP across all of your user accounts in a cold wallet, with a small amount of XRP in a hot wallet. Think about your daily traded volume of XRP to help determine how much XRP in your hot wallet to make available in the payment channel. You have the option to increase the amount allocated to the payment channel after you create it.

The payee exchange then reviews the details of the payment channel.

If the payer exchange has multiple accounts and wants to use them with payment channels, they must open one payment channel per pair of payer and payee accounts. Also keep in mind that payment channels are unidirectional. So, let's say that exchange A wants to move XRP in both directions between an account it owns on exchange A and an account it owns on exchange B. Exchange A must open one payment channel from its exchange A account to its exchange B account, as well as a second payment channel from its exchange B account to its exchange A account. ***TODO: stated correctly? Relevant to surface this info here?***


<span class="use-case-step-num">{{n.next()}}</span>
## [Create claims](use-payment-channels.html#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel) and [send them](use-payment-channels.html#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services) (payer)

The payer exchange creates one or more claims for amounts of XRP that it wants to guarantee to the payee exchange and then sends the claim details to the payee exchange off-ledger.


<span class="use-case-step-num">{{n.next()}}</span>
## [Verify claims](use-payment-channels.html#5-the-payee-verifies-the-claims) and [redeem them in batches](use-payment-channels.html#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount) (payee)

The payee exchange verifies claims sent by the payer exchange.

This is usually when the payee provides goods or services to the payer in exchange for the amount of XRP listed in the claims. However, in this use case, there is likely no exchange of goods or services. The payee exchange can just redeem batches of claims to receive the XRP guaranteed by the payer exchange.


<span class="use-case-step-num">{{n.next()}}</span>
## [Continue to use the payment channel](use-payment-channels.html#7-repeat-steps-3-6-as-desired) (payer and payee)

Payer and payee exchanges can continue to send, verify, and redeem batches of claims as needed within the parameters set by the payment channel.


<span class="use-case-step-num">{{n.next()}}</span>
## When it's time, make a request to [close the payment channel](use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed) (payer)

When the payer exchange and payee exchange are done using the payment channel, the payer exchange can make a request to close the payment channel.


### Related Tasks

- [List XRP in Your Exchange](list-xrp-in-your-exchange.html)

<!-- #{TODO: jha rebase on master to be able to link to [List Your Exchange on XRP Charts](list-your-exchange-on-xrp-charts.html) }#-->

***TODO: any other related tasks?

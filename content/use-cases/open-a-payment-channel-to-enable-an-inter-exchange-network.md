# Open a Payment Channel to Enable an Inter-Exchange Network

A payment channel enables you to send one-way, "asynchronous" XRP payments that can be divided into very small increments and settled later. As a digital asset exchange, if you frequently send XRP to another exchange, you can improve the efficiency of these payments by opening an XRP Ledger [payment channel](payment-channels.html) between your exchange (the _payer_ exchange) and the other exchange (the _payee_ exchange). In the case of a two-way flow with another exchange, you can simply open two payment channels (one for each direction).



## Why Send XRP to Other Exchanges?

The need to send XRP from your exchange to another exchange may originate with your customers withdrawing XRP from your exchange and depositing it to the other exchange. If you are a large exchange, you probably have many customers moving XRP from your exchange into another exchange. You may be processing XRP payments all day long and for each payment, you are waiting for confirmation times, potentially at both ends of the transaction, as well as paying transaction costs.



## Benefits of Using a Payment Channel

Here are some of the benefits of using a payment channel to send XRP instead of using individual payment transactions: <!-- {# TODO: for the future, complete https://ripplelabs.atlassian.net/browse/DOC-2243 to see if using a payment channel would actually result in a cost benefit to the sending exchange #}-->

- **Process withdrawals faster:** A standard payment transaction involves submitting an XRP Ledger transaction and waiting for a new ledger version that includes the transaction to be approved by [consensus](consensus.html). When you use a payment channel to send XRP, creation and verification of a claim, which guarantees the payment of XRP, all happen outside of the consensus process. This means that the payer exchange can guarantee XRP payments to the payee exchange at a rate limited only by the participants' ability to create and verify the digital signatures of the claims.

      For your customers who are moving XRP to take advantage of arbitrage opportunities or to do algorithmic trading, speed matters. Enabling a customer to move XRP and start trading in an instant is a compelling differentiator for your exchange.

- **Connect to the Internet of Value:** One of the key requirements of the [Internet of Value](https://ripple.com/insights/the-internet-of-value-what-it-means-and-how-it-benefits-everyone/) is interoperability. The [Interledger Protocol](https://interledger.org/) (ILP), which plays a large role in driving this interoperability, works best when it [uses payment channels](https://interledger.org/rfcs/0027-interledger-protocol-4) as its method for rebalancing accounts. In effect, when you open a payment channel from your exchange to another, you are connecting to the Internet of Value and helping to create the inter-exchange network that is fundamental to the success of the Internet of Value and the apps that are built on it.

      Connecting your exchange to other exchanges by way of payment channels is another differentiator. For customers who are moving XRP to purchase various currencies across exchanges, knowing that they can move XRP at a moment's notice from your exchange to any number of exchanges in the Internet of Value can make your exchange a preferred place to custody their assets.

Here’s a roadmap to the high-level tasks you’ll need to perform to implement this payment channel use case. To go directly to a full payment channels tutorial, see [Use Payment Channels](use-payment-channels.html).

<!-- #{TODO: for the future: per Warren, it would be great to add diagrams for each step in the flow - showing claims and batch redemptions moving through the payment channel. Also, we have any recommendations around Payment Channel Managers, we can surface that here.}# -->



{% set n = cycler(* range(1,99)) %}
<!-- USE_CASE_STEPS_START -->
<span class="use-case-step-num">{{n.next()}}</span>
## Understand payment channels

Learn more about payment channels and whether they provide the features you need for your specific implementation.

[Understand payment channels >](payment-channels.html)


<span class="use-case-step-num">{{n.next()}}</span>
## Payer and payee: Set up and run `rippled` servers

To use a payment channel to send and receive XRP, both the payer and payee exchanges must each have access to a `rippled` server that they can use to send transactions. If your exchange processes XRP withdrawals directly, you are probably already running a `rippled` server that you can use for this purpose.

If not, a great way for an exchange to get access to a `rippled` server is to set up and run one.

[Set up and run rippled servers >](manage-the-rippled-server.html)


<span class="use-case-step-num">{{n.next()}}</span>
## Payer and payee: Fund XRP Ledger accounts with enough XRP

If your exchange processes XRP deposits and withdrawals directly, you probably have existing funded XRP Ledger accounts that you can use for this purpose. Just ensure that they are funded with enough XRP as described here.

Along these lines, there's a good chance that you are following industry best practices and have a cold account plus one or more hot accounts. Use the hot accounts for your payment channels.

- The payer exchange must have a funded XRP Ledger account to be used to send XRP to the payee exchange.

      Aside from the [base reserve](reserves.html) (20 XRP) and the [owner reserve](reserves.html#owner-reserves) of a payment channel (5 XRP), the account must also be able to set aside enough XRP in the payment channel to cover the intended number of transactions.

      The payer exchange can always top-off the channel using the [PaymentChannelFund](paymentchannelfund.html) transaction if it runs out of XRP. However, topping-off requires an actual on-ledger transaction and confirmation, so it could take 4-5 seconds of processing time and ~10 drops of XRP to complete the top-off transaction. The more XRP the payer exchange pre-funds, the less often they need to top-off, so they can save some time and money by pre-funding more XRP.

      However, if the payer exchange puts in more XRP than they need, they need to [close the payment channel](use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed) to get the XRP back. This means waiting out the following events:

      1. Completion of the payer's request to start closing the payment channel.
      2. Passage of the `SettleDelay` time set for the payment channel.
      3. Completion of a request to finish closing the payment channel after the `SettleDelay` has passed.

- The payee exchange must have a funded XRP Ledger account to be used to redeem (receive) XRP sent by the payer exchange.

      The account needs at least 21 XRP, which provides the 20 XRP [base reserve](reserves.html), plus enough to pay the transaction costs of redeeming claims, which are trivial. For example, you could redeem thousands of claims for less than 1 XRP in total.

[Fund XRP Ledger accounts with enough XRP >](accounts.html)

<span class="use-case-step-num">{{n.next()}}</span>
## Payer: [Open a payment channel](use-payment-channels.html#1-the-payer-creates-a-payment-channel-to-a-particular-recipient)

The payer exchange opens a payment channel from their XRP Ledger account to the payee exchange's XRP Ledger account. Opening a payment channel includes setting certain specifics of the channel, such as its expiration date and the amount it can hold.

For this exchange use case, there is no real need to ever close the channel, so the payer exchange may not want to define a `CancelAfter` (expiration) value. If they ever need to close the channel, they can still do so.

As the payer exchange, you can think of the payment channel as a special sub-wallet exclusively for a particular destination. Consider estimating how much XRP the payment channel requires similar to how you would estimate a hot wallet's needs. According to [typical best practices](issuing-and-operational-addresses.html), exchanges hold the vast majority of XRP across all of their user accounts in a cold wallet, with a small amount of XRP in a hot wallet.

Along these lines, you should also decide approximately how often you want to add more XRP to the payment channel---for example, daily, every 4 hours, or every 15 minutes---and estimate the volume of XRP that you send to the payee exchange during that interval. You should fund the payment channel with enough to cover at least that much volume or the largest withdrawal that you want to process without delay, whichever is larger. For example, if you plan to refill the channel every 15 minutes, have an average volume of 50 XRP every 15 minutes, but occasionally send transfers of 10,000 XRP, you should supply the channel with at least 10,000 XRP.

For withdrawals that are larger than the amount of XRP you have in the payment channel, you must process them specially. Either you can send large withdrawals as normal XRP payments, skipping the payment channel entirely, or you can first send a transaction to add the full withdrawal amount to the payment channel before creating claims for those. (See below for details on creating claims.)

If either exchange has multiple hot accounts in the XRP Ledger, the two exchanges should each designate a specific hot account to use with the payment channel between them. Although there are other potentially viable configurations, this use case assumes a configuration with one payment channel connecting two exchanges. This channel can serve all customers sending XRP from the payer exchange to the payee exchange.

Since payment channels are unidirectional, you need a second channel in the opposite direction to send XRP from the _payee_ exchange to the _payer_ exchange. This second channel does not need to connect the exact same pair of hot accounts, but it is most convenient to do so. With two unidirectional channels, each exchange can use the XRP it redeems from its incoming channel to refill its outgoing channel.



<span class="use-case-step-num">{{n.next()}}</span>
## Payee: Verify payment channel details

The payee exchange reviews the details of the payment channel.

[Verify payment channel details >](use-payment-channels.html#2-the-payee-checks-specifics-of-the-payment-channel)


<span class="use-case-step-num">{{n.next()}}</span>
## Payer: Create claims

The payer exchange creates one or more claims for amounts of XRP that it wants to guarantee to the payee exchange.

[Create claims >](use-payment-channels.html#3-the-payer-creates-one-or-more-signed-claims-for-the-xrp-in-the-channel)

<span class="use-case-step-num">{{n.next()}}</span>
## Payer: Send claim details to the payer exchange

After creating a claim, the payer exchange must send details of the claim to the payee exchange, off-ledger.

Consider a series of claims prompted by payer exchange customers withdrawing XRP and depositing it to the payee exchange. In this case, the payer and payee exchanges should agree on the information the payer exchange must send for each claim to enable the payee exchange to correctly credit its customers' accounts. For example, consider sharing the following claim information off-ledger:

**Channel ID**: `7C02D0802B272599889ADFA4298FD92E4C8BD5120ED9A5BA3884CF636F9B4029`

**Public key**: `023D9BFCC22FB9A997E45ACA0D2D679A6A1AE5589E51546F3EDC4E9B16713FC255`

| Sequence | Signature         | Amount | Destination Tag |
|:---------|:------------------|:-------|:----------------|
| 1        | 3045022100CE6E... | 2000   | 12345678        |
| 2        | 304402200C304A... | 3000   | 23456781        |
| 3        | 30450221009849... | 4000   | 34567812        |

| Claim Information   | Purpose                                                |
|:--------------------|:-------------------------------------------------------|
| **Channel ID**      | Payment channel the payer exchange used to create the claim. The payee exchange needs this value to verify and redeem the claim. |
| **Public key**      | Public key the payer exchange used to open the payment channel. The payee exchange needs this value to verify and redeem the claim. |
| **Sequence**        | A value that indicates the sequence in which the payer exchange created the claims. The payee exchange needs this value to keep track of and redeem claims in the correct order. For example, if the payer exchange did not provide the sequence value and the payee exchange lost track of the second claim above, the payee exchange might incorrectly credit 2000 XRP to destination tag 34567812. If the payer exchange did provide the sequence value, the payee exchange would know that it needs to account for a claim between claim 1 and claim 3. With claim 2 accounted for, the payee exchange could correctly credit 1000 XRP to destination tag 23456781 and 1000 XRP to destination tag 34567812. |
| **Signature**       | Signature of the claim. The payee exchange needs this value to verify and redeem the claim. |
| **Amount**          | Cumulative amount of the claims created by the payer exchange. The payee exchange needs this value to verify and redeem the claim. For information about how to calculate the actual amount the payee exchange needs to credit the customer, see [Verify claims](#payee-verify-claims). |
| **Destination Tag** | Destination tag of the customer account on the payee exchange that needs to be credited based on the claim. The payer exchange can get this value from their customer's withdrawal request, which should provide a destination tag for the deposit to the payee exchange. When the payee exchange redeems claims, the XRP is deposited into the payee exchange's XRP Ledger account. The payee exchange can then credit the XRP from the claim to the appropriate customer account based on the destination tag provided. |

[Send claim details to the payer exchange >](use-payment-channels.html#4-the-payer-sends-a-claim-to-the-payee-as-payment-for-goods-or-services)

<span class="use-case-step-num">{{n.next()}}</span>
## Payee: Verify claims

The payee exchange verifies claims sent by the payer exchange.

After verifying claims, the payee exchange should credit the claimed XRP to the customer accounts indicated by the destination tags sent by the payer exchange. Because claim amounts are cumulative, the payee exchange needs to be careful to credit the customer for only the _the difference from the previous claim_.

For example, to know how much to credit a customer for a claim amount of 3000, the payee exchange needs to know that the previous claim amount was 2000. The difference between the claim amount and the previous claim amount (3000 - 2000 = 1000) is the amount the payee exchange must credit to the customer account.

[Verify claims >](use-payment-channels.html#5-the-payee-verifies-the-claims)


<span class="use-case-step-num">{{n.next()}}</span>
## Payee: Redeem them in batches

The payee exchange can redeem batches of claims after verifying them to receive the XRP guaranteed by the payer exchange. Here are some guidelines the payee exchange can use to decide how often to redeem claims:

- Don't redeem every claim. That's not gaining any benefit from the payment channels.

- Don't wait until you have more in claims than you're scared to lose. If something goes wrong and you miss your chance to redeem a claim, you don't get paid. If that happens and you have already credited one or more customers in your system, you could be in trouble. Those customers may have already traded the XRP for other cryptocurrencies and withdrawn them. That leaves you with more XRP owed in your system than you were holding for your customers, and it's too late to correct the balances of the customers whose deposits you didn't receive.

- If the payer requests to close the channel, you won't get paid if you don't redeem your claims before it finishes closing. The amount of time you have is based on the `SettleDelay`.

- If the channel was created with an immutable `CancelAfter` time, be sure to redeem all outstanding claims before that time.

- You can decide to redeem, for example, after a certain amount of time, after accumulating a certain amount of credit, or based on other criteria you care about, such as how much you trust the payer exchange. The safest strategy is probably based on a combination of these criteria.

<!-- #{ TODO: Talk to some active PayChan users like Coil people to get some more specific recommendations. But I imagine that settling every few minutes or even hours could make sense depending on how much the payee exchange trusts the payer exchange, how many transactions they do how rapidly, etc. }# -->

[Redeem them in batches >](use-payment-channels.html#8-when-ready-the-payee-redeems-a-claim-for-the-authorized-amount)


<span class="use-case-step-num">{{n.next()}}</span>
## Payer and payee: Continue to use the payment channel

Payer and payee exchanges can continue to send, verify, and redeem batches of claims as needed within the parameters set by the payment channel.

[Continue to use the payment channel >](use-payment-channels.html#7-repeat-steps-3-6-as-desired)

<span class="use-case-step-num">{{n.next()}}</span>
## Payer: When it's time, make a request to close the payment channel

When the payer exchange and payee exchange are done using the payment channel, the payer exchange can make a request to close the payment channel.

[Close the payment channel >](use-payment-channels.html#9-when-the-payer-and-payee-are-done-doing-business-the-payer-requests-for-the-channel-to-be-closed)
<!-- USE_CASE_STEPS_END -->

# Listing XRP as an Exchange

This document describes the steps that an exchange needs to take to list XRP. For details about other aspects of `rippled` and the Ripple Consensus Ledger (RCL), see the  [Ripple Developer Center](https://ripple.com/build).

## Alpha Exchange

For illustrative purposes, this document uses a fictitious business called _Alpha Exchange_ to explain the high-level steps required to list XRP. For the purposes of this document, Alpha Exchange:

* Currently specializes in listing BTC/USD

* Wants to add BTC/XRP and XRP/USD trading pairs

* Maintains balances for all of its customers

* Maintains balances for each of its supported currencies

### User Benefits

Alpha Exchange wants to list BTC/XRP and XRP/USD trading pairs partially because listing these pairs will benefit its users. Specifically, this support will allow its users to:

* Deposit XRP _to_ Alpha Exchange _from_ the RCL

* Withdraw XRP _from_ Alpha Exchange _to_ the RCL

* Trade XRP with other currencies, such as BTC, USD, amongst others

## Prerequisites for Supporting XRP

To support XRP, Alpha Exchange must:

* Create and maintain new [accounts](#accounts)

* Create and maintain [balance sheets](#balance-sheets)

See also:

* [Gateway Compliance](https://ripple.com/build/gateway-guide/#gateway-compliance) — Gateways and exchanges are different, but exchanges should also ensure that they are complying with local regulations and reporting to the appropriate agencies.

* [Requirements for Sending to RCL](https://ripple.com/build/gateway-guide/#requirements-for-sending-to-rcl)

* [Requirements for Sending to RCL](https://ripple.com/build/gateway-guide/#requirements-for-sending-to-rcl)

* [Gateway Precautions](https://ripple.com/build/gateway-guide/#precautions)

### Accounts

XRP is held in *accounts* (sometimes referred to as *wallets* ) on the Ripple Consensus Ledger (RCL). Accounts on the RCL are different than accounts on other blockchain ledgers, such as Bitcoin, where accounts incur little to no overhead. To submit transactions (for example, [OfferCreate](https://ripple.com/build/transactions/#offercreate) and others used for trading), RCL accounts require XRP [reserves](https://ripple.com/build/reserves/) to protect the ledger against spam and malicious usage. On other blockchains, balances are derived from the previous block. On the RCL, [account objects](https://ripple.com/build/ledger-format/#accountroot) describe several other properties of the account in addition to balances, so accounts are represented in each ledger and can never be destroyed or removed. Exchanges do not need to create accounts for each customer that holds XRP; they can store all of their customers’ XRP in just a few RCL accounts. For more information about RCL accounts, see the [Accounts](https://ripple.com/build/accounts/) article.

To comply with Ripple's recommend best practices, Alpha Exchange should create at least two new [accounts](https://ripple.com/build/accounts/) on the RCL. To minimize the risks associated with a compromised secret key, Ripple recommends creating [_issuing_, _operational_, and _standby_ accounts](https://ripple.com/build/issuing-operational-addresses/) (these are sometimes referred to, respectively, as cold, hot, and warm wallets). The operational/standby/issuing model is intended to balance security and convenience. Exchanges listing XRP should create the following accounts:

* An [_issuing_ account](https://ripple.com/build/issuing-operational-addresses/#issuing-address) to securely hold the majority of XRP and customers' funds. To provide optimal security, this account should be offline.

    For more information about the possible consequences of a compromised issuing account, see [Issuing Account Compromise](https://ripple.com/build/issuing-operational-addresses/#issuing-address-compromise).

* One or more [_operational_ accounts](https://ripple.com/build/issuing-operational-addresses/#operational-addresses) to conduct the day-to-day business of managing customers' XRP withdrawals and deposits. For example, with an opertaitional wallet, exchanges can securely support these types of automated XRP transfers. Operational accounts need to be online to service instant withdrawal requests.

    For more information about the possible consequences of a compromised operational account, see [Operational Account Compromise](https://ripple.com/build/issuing-operational-addresses/#operational-address-compromise).

* Optionally, one or more standby accounts to provide an additional layer of security between the issuing and operational accounts. Unlike an operational account, the secret key of a standby account does not need to be online. Additionally, you can distribute the secret keys for the standby account to several different people and implement  [multisigning](https://ripple.com/build/how-to-multi-sign/) to increase security.

    For more information about the possible consequences of a compromised standby account, see [Standby Account Compromise](https://ripple.com/build/issuing-operational-addresses/#standby-address-compromise).


See also:

* ["Suggested Business Practices" in the _Gateway Guide_](https://ripple.com/build/gateway-guide/#suggested-business-practices)

* [Issuing and Operational Addresses](https://ripple.com/build/issuing-operational-addresses/)

* [Creating Accounts](https://ripple.com/build/transactions/#creating-accounts)

* [Reserves](https://ripple.com/build/reserves/)

### Balance Sheets

Alpha Exchange will custody its customers' XRP, so it needs to track each customer's balance(s). To do this, Alpha Exchange must create and maintain an additional balance sheet. The following table illustrates what this balance sheet might look like.

The new RCL accounts (_Alpha Operational_, _Alpha Standby_, _Alpha Issuing_) are in the *User* column of the *XRP Balances on RCL* table.

The *Alpha Exchange XRP Balances* table represents new, additional balance sheet. Alpha Exchange’s software manages their users’ balances of XRP on this accounting system.


<table>
  <tr>
    <td><b><i>XRP Balances
on RCL</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
XRP Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Operational</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Standby</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Issuing</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

#### XRP Amounts

Amounts of XRP are represented on the RCL as an unsigned integer count of *drops*, where one XRP == 1,000,000 drops. Ripple recommends that software store XRP balances as integer amounts of drops, and perform integer arithmetic on these values. However, user interfaces should present balances in units of XRP.

One drop (.000001 XRP) cannot be further subdivided. Bear this in mind when calculating and displaying FX rates between XRP and other assets.

For more informtion, see [Specifying Currency Amounts](https://ripple.com/build/rippled-apis/#specifying-currency-amounts).

#### On-Ledger and Off-Ledger

With exchanges like _Alpha Exchange_, XRP can be "on-ledger" or "off-ledger":

* **On-Ledger XRP**: XRP that can be queried through the public RCL by specifying the public [address](https://ripple.com/build/accounts/#addresses) of the XRP holder. The counterparty to these balances is the RCL. For more information, see [Currencies](https://ripple.com/build/rippled-apis/#currencies).

* **Off-Ledger XRP**: XRP that is held by the accounting system of an exchange and can be queried through the exchange interface. Off-ledger XRP balances are credit-based. The counterparty is the exchange holding the XRP.

    Off-ledger XRP balances are traded between the participants of an exchange. To support these trades, the exchange must hold a balance of _on-ledger XRP_ equal to the aggregate amount of _off-ledger XRP_ that it makes available for trade.


## Flow of Funds

The remaining sections describe how funds flow through the accounts managed by Alpha Exchange as its users begin to deposit, trade, and redeem XRP balances. To illustrate the flow of funds, this document uses the tables introduced in the ["Balance Sheets" section](#balance-sheets).

There are four main steps involved in an exchange's typical flow of funds:

1. [Deposit XRP into Exchange](#deposit-xrp-into-exchange)

2. [Rebalance XRP Holdings](#rebalance-xrp-holdings)

3. [Withdraw XRP from Exchange](#withdraw-xrp-from-exchange)

4. [Trade XRP on the Exchange](#trade-xrp-on-the-exchange)


This list does not include the [prerequisites](#prerequisites-for-supporting-xrp) required of an exchange.

At this point, _Alpha Exchange_ has created [operational, standby, and issuing accounts](#accounts) on the RCL and added them to its balance sheet, but has not accepted any deposits from its users.


<table>
  <tr>
    <td><b><i>XRP Balances
on RCL</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
XRP Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
  </tr>
  <tr>
    <td><i>Alpha Operational</i></td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Standby</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><i>Alpha Issuing</i></td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>


### Deposit XRP into Exchange

To track [off-ledger XRP balances](#on-ledger-and-off-ledger) exchanges need to create new [balance sheets](#balance-sheets) (or similar accounting systems). The following table illustrates the balance changes that take place on Alpha Exchange's new balance sheet as users begin to deposit XRP.

A user named Charlie wants to deposit 50,000 XRP to Alpha Exchange. Doing this involves the following steps:

1. Charlie submits a payment of 50,000  XRP (by using [RippleAPI](https://ripple.com/build/rippleapi/) or similar software) to Alpha Exchange's [issuing account](#accounts).

    a. Charlie adds an identifier (in this case, `789`) to the payment to associate it with his account at Alpha Exchange. This is called a [_destination tag_](https://ripple.com/build/gateway-guide/#source-and-destination-tags). (To use this, Alpha Exchange must have set the asfRequireDest flag on all of its accounts. This flag requires all incoming payments to have a destination tag like Charlie's. For more information, see [AccountSet Flags](https://ripple.com/build/transactions/#accountset-flags).

2. The software at Alpha Exchange detects the incoming payment, and recognizes `789` as the destination tag for Charlie’s account.

3. When it detects the incoming payment, Alpha Exchange's software updates its balance sheet to indicate that the 50,000 XRP it received is controlled by Charlie.

    Charlie can now use up to 50,000 XRP on the exchange. For example, he can create offers to trade XRP with BTC or any of the other currencies Alpha Exchange supports.

<table>
  <tr>
    <td><b><i>XRP Balances
on RCL</i></b></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange
XRP Balances</i></b></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Charlie</td>
    <td><s>100,000</s>
<br>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>0</s>
<br>50,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Operational</td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Standby</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Issuing</td>
    <td><s>0</s>
<br>50,000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>


### Trade XRP on The Exchange

Alpha Exchange users (like Charlie) can trade credit-based balances on Alpha Exchange. Alpha Exchange should keep track of user balances on its new balance sheet as these trades are made. These trades are _off-ledger_ and independent from the RCL, so the balance changes are not recorded there.

For more information about trading _on_ the RCL, see [Lifecycle of an Offer](https://ripple.com/build/transactions/#lifecycle-of-an-offer).


### Rebalance XRP Holdings

Exchanges can adjust the balances between their operational and issuing accounts at any time. Each balance adjustment consumes a [transaction fee](https://ripple.com/build/fees-disambiguation/), but does not otherwise affect the aggregate balance of all the accounts. The aggregate, on-ledger balance should always exceed the total balance available for trade on the exchange. (The excess should be sufficient to cover the RCL's [transaction fees](https://ripple.com/build/transaction-cost/).)

The following table demonstrates balance adjustment of 80,000 XRP (via a [_payment_](https://ripple.com/build/transactions/#payment) on the RCL) between Alpha Exchange's issuing account and its operational account, where the issuing account was debited and the operational account was debited. If the payment were reversed (debit the operational account and credit the issuing account), the operational account balance would decrease. Balance adjustments like these allow an exchange to limit the risks associated with holding XRP in online operational accounts.


<table>
  <tr>
    <td><b><i>Alpha Exchange XRP
Off-Ledger Balances</i></b></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange XRP On-Ledger Balances</i></b></td>
    <td></td>
  </tr>
  <tr>
    <td><b>Acct #</b></td>
    <td><b>User</b></td>
    <td><b>Balance</b></td>
    <td></td>
    <td><b>RCL Account</b></td>
    <td><b>Balance</b></td>
  </tr>
  <tr>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Operational</td>
    <td><s>0</s>
<br>80,000</td>
  </tr>
  <tr>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Standby</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>789</td>
    <td>Charlie</td>
    <td>50,000</td>
    <td></td>
    <td>Issuing</td>
    <td><s>180,000</s>
<br>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>


### Withdraw XRP from Exchange

Withdrawals allow an exchange's users to move XRP from the exchange's off-ledger balance sheet to an account on the RCL.

In this example, Charlie withdraws 25,000 XRP from Alpha Exchange. This involves the following steps:

1. Charlie initiates the process on Alpha Exchange’s website. He provides instructions to transfer 25,000 XRP to a specific account on the RCL (named "Charlie RCL" in the following table).

2. In response to Charlie’s instructions, Alpha Exchange does the following:

    a. Debits the amount (25,000 XRP) from Charlie’s account on its off-ledger balance sheet

    b. Submits a payment on the RCL for the same amount (25,000 XRP), from Alpha Exchange's operational account to Charlie’s RCL account


<table>
  <tr>
    <td><b><i>RCL On-Ledger XRP Balances</td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange XRP
Off-Ledger Balances</td>
    <td></td>
    <td></td>
    <td></td>
    <td><b><i>Alpha Exchange XRP On-Ledger Balances</td>
    <td></td>
  </tr>
  <tr>
    <td><b>User</td>
    <td><b>Balance</td>
    <td></td>
    <td><b>Acct #</td>
    <td><b>User</td>
    <td><b>Balance</td>
    <td></td>
    <td><b>RCL Account</td>
    <td><b>Balance</td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Operational</td>
    <td><s>80,000</s>
<br>55,000</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Standby</td>
    <td>0</td>
  </tr>
  <tr>
    <td>….</td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
    <td></td>
    <td></td>
    <td>….</td>
    <td></td>
  </tr>
  <tr>
    <td>Charlie RCL</td>
    <td><s>50,000</s>
<br>75,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td><s>50,000</s>
<br>25,000</td>
    <td></td>
    <td>Issuing</td>
    <td>100,000</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td>...</td>
    <td></td>
  </tr>
</table>

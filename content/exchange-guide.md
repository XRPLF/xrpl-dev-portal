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

### Accounts

Alpha Exchange must create at least two new [accounts](https://ripple.com/build/accounts/) (also referred to as "wallets") on the RCL. To minimize the risks associated with a compromised secret key, Ripple recommends creating [_issuing_, _operational_, and _standby_ accounts](https://ripple.com/build/issuing-operational-addresses/) (these are sometimes referred to, respectively, as cold, hot, and warm wallets). The operational/standby/issuing model is intended to balance security and convenience. Exchanges listing XRP should create the following accounts:

* An [_issuing_ account](https://ripple.com/build/issuing-operational-addresses/#issuing-address) to securely hold the majority of XRP and customers' funds. To provide optimal security, this account should be offline.

    For more information about the possible consequences of a compromised issuing account, see [Issuing Account Compromise](https://ripple.com/build/issuing-operational-addresses/#issuing-address-compromise).

* One or more [_operational_ accounts](https://ripple.com/build/issuing-operational-addresses/#operational-addresses) to conduct the day-to-day business of managing customers' XRP withdrawals and deposits. Operational accounts need to be online to service instant withdrawal requests.

    For more information about the possible consequences of a compromised operational account, see [Operational Account Compromise](https://ripple.com/build/issuing-operational-addresses/#operational-address-compromise).

* Optionally, one or more standby accounts to provide an additional layer of security between the issuing and operational accounts. Unlike an operational account, the secret key of a standby account does not need to be online. Additionally, you can distribute the secret keys for the standby account to several different people and implement  [multisigning](https://ripple.com/build/how-to-multi-sign/) to increase security.

    For more information about the possible consequences of a compromised standby account, see [Standby Account Compromise](https://ripple.com/build/issuing-operational-addresses/#standby-address-compromise).

For more information, see:

* ["Suggested Business Practices" in the _Gateway Guide_](https://ripple.com/build/gateway-guide/#suggested-business-practices)

* [Issuing and Operational Addresses](https://ripple.com/build/issuing-operational-addresses/)

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

## On-Ledger and Off-Ledger

With exchanges like _Alpha Exchange_, XRP can be "on-ledger" or "off-ledger":

* **On-Ledger XRP**: XRP that can be queried through the public RCL by specifying the public [address](https://ripple.com/build/accounts/#addresses) of the XRP holder. The counterparty to these balances is the RCL. For more information, see [Currencies](https://ripple.com/build/rippled-apis/#currencies).

* **Off-Ledger XRP**: XRP that is held by the accounting system of an exchange and can be queried through the exchange interface. Off-ledger XRP balances are credit-based. The counterparty is the exchange holding the XRP.

    Off-ledger XRP balances are traded between the participants of an exchange. To support these trades, the exchange must hold a balance of _on-ledger XRP_ equal to the aggregate amount of _off-ledger XRP_ that it makes available for trade.


## Flow of Funds

The remaining sections describe how funds flow through the accounts managed by Alpha Exchange as its users begin to deposit, trade, and redeem XRP balances. To illustrate the flow of funds, this document uses the tables introduced in a [previous section](#balance-sheets).

There are three main steps involved in an exchange's typical flow of funds:

1. [Deposit XRP into Exchange](#deposit-xrp-into-an-exchange)

2. [Rebalance XRP Holdings](#rebalance-xrp-holdings)

3. [Withdraw XRP from Exchange](#withdraw-xrp-from-exchange)

4. [Trade XRP on the Exchange](#trade-xrp-on-the-exchange)


This list does not include the [prerequisites](#prerequisites for Supporting XRP) required of an exchange.

At this point, _Alpha Exchange_ has created [operational, standby, and issuing accounts](#accounts) on the RCL and added them to its balance sheet, but has not funded the new accounts.


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




## Deposit XRP into Exchange

The exchange is required to create a new accounting system to track off ledger XRP balances. Figure 1 shows the initial condition of this new account system, where all user balances start with a value of zero.

Example deposit : The user Charlie wishes to deposit 50,000 XRP to Alpha Exchange. Through the interface that Alpha Exchange provides, Charlie is instructed to submit a payment (via Ripple API or wallet software) for that amount to Alpha Exchange’s cold wallet address, and to associate a numerical identifier (say 789) with the payment.

<table>
  <tr>
    <td>XRP Balances
on RCL</td>
    <td></td>
    <td></td>
    <td>Alpha Exchange
XRP Balances</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>User</td>
    <td>Balance</td>
    <td></td>
    <td>Acct #</td>
    <td>User</td>
    <td>Balance</td>
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
    <td>100,000
50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td> 0
50,000</td>
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
    <td>Alpha Hot</td>
    <td>0</td>
    <td></td>
    <td>...</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Warm</td>
    <td>0</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>Alpha Cold</td>
    <td> 0
50,000</td>
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


Figure 2 : Before and after a XRP deposit is made by Charlie to Alpha Exchange

The software at Alpha Exchange detects the incoming payment, and recognizes 789 as the identifier associated with Charlie’s account. The number 789 is a field known as a "Destination Tag" on the RCL. (Alpha Exchange has set a flag, called asfRequireDest, on its wallets to ensure that all incoming payment have a destination tag.)

[https://ripple.com/build/transactions/#accountset-flags](https://ripple.com/build/transactions/#accountset-flags)

Upon detecting the incoming payment, Alpha Exchange software updates the balance sheet to reflect the 50,000 XRP received is controlled by Charlie.  Charlie is now able to use up to 50,000 XRP on the exchange, for example to create orders trading XRP to other supported currencies on Alpha Exchange.

## Rebalancing XRP Holdings

In order to securely support automated transfers of XRP, the exchange will keep a portion of XRP holdings in one (or more) operational "hot" wallets. In most XRP integrations, an exchange will elect to have their middleware software make payments automatically from the hot wallet (a withdrawal payment, for example), while a cold wallet will require human intervention.

<table>
  <tr>
    <td>Alpha Exchange XRP
Off Ledger Balances</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Alpha Exchange XRP On Ledger Balances</td>
    <td></td>
  </tr>
  <tr>
    <td>Acct #</td>
    <td>User</td>
    <td>Balance</td>
    <td></td>
    <td>Wallet</td>
    <td>Balance</td>
  </tr>
  <tr>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Hot</td>
    <td>0
80,000</td>
  </tr>
  <tr>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Warm</td>
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
    <td>Cold</td>
    <td>180,000
100,000</td>
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


Figure 3 : Without fractional reserve, XRP moves to operational hot wallet

The exchange can adjust balances between hot and cold wallets at any time.  While each such adjustment consumes a fee, it does not otherwise affect the overall balance, which is an aggregate of all the holding wallets.  This aggregate On Ledger balance should at all times exceed the total available for trade on the exchange.  (Where the excess is sufficient to cover ledger transaction fees.)

Figure 3 shows a balance adjustment via a payment of 80,000 XRP from Cold wallet to Hot wallet.  A payment made in reverse (debit the hot wallet, credit the cold wallet; not shown) would decrease the hot wallet balance. These balance adjustments allow an exchange to limit the risk associated with holding XRP in an online Hot wallet, by holding a balance in an offline Cold wallet.

## Withdraw XRP from Exchange

The *withdraw* feature allows customers to move XRP from Alpha Exchange to a wallet on the Ripple Consensus Ledger.

In this example, Charlie initiates the process on the Alpha Exchange’s website.  He provides instructions to transfer 25,000 XRP to a specific Ripple wallet on RCL (named "Charlie" in figure 4).

<table>
  <tr>
    <td>RCL On Ledger XRP Balances</td>
    <td></td>
    <td></td>
    <td>Alpha Exchange XRP
Off Ledger Balances</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Alpha Exchange XRP On Ledger Balances</td>
    <td></td>
  </tr>
  <tr>
    <td>User</td>
    <td>Balance</td>
    <td></td>
    <td>Acct #</td>
    <td>User</td>
    <td>Balance</td>
    <td></td>
    <td>Wallet</td>
    <td>Balance</td>
  </tr>
  <tr>
    <td>Dave</td>
    <td>25,000</td>
    <td></td>
    <td>123</td>
    <td>Alice</td>
    <td>80,000</td>
    <td></td>
    <td>Hot</td>
    <td>80,000
55,000</td>
  </tr>
  <tr>
    <td>Edward</td>
    <td>45,000</td>
    <td></td>
    <td>456</td>
    <td>Bob</td>
    <td>50,000</td>
    <td></td>
    <td>Warm</td>
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
    <td>Charlie</td>
    <td>50,000
75,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>50,000
25,000</td>
    <td></td>
    <td>Cold</td>
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


Figure 4 : Before and after a XRP withdrawal by Charlie

In response to Charlie’s instruction to withdraw 25,000 XRP, Alpha Exchange performs the following tasks, shown in figure 4, in this order:

* Debit the amount from Charlie’s row on the balance sheet

* Submit a Ripple payment for the same amount, from Alpha Exchange hot wallet to Charlie’s RCL wallet

## Trade XRP on The Exchange

Users of Alpha Exchange can trade the credit based balances on Alpha Exchange, and Alpha should be expected to keep track of all users balances as the trades are made. These trades are independent of, and not reflected on, RCL.

# About XRP Accounts

XRP is held in Ripple Consensus Ledger *accounts* (sometimes referred to as *wallets* or *addresses*).  This document shows that an exchange is able to store all of the customers’ XRP in relatively few wallets.  (Technically, all the XRP could be managed in a single wallet.  It is for security reasons that an exchange should manage a set of hot, warm, and cold wallets.)

An exchange should not create a Ripple wallet for each customer who holds XRP with the exchange.  The RCL differs from other blockchains such as Bitcoin where additional wallets incur essentially no overhead.  A Bitcoin balance is a collation of multiple UTXOs from prior blocks.  A Ripple account, in contrast, is represented in each iteration of the ledger, and can never be destroyed or removed (similar to Ethereum).  The Ripple account object includes an XRP balance as well as other properties.  Also, each Ripple account requires an XRP reserve, which adds a cost to creating a large number of wallets.

See [https://ripple.com/build/transactions/#creating-accounts](https://ripple.com/build/transactions/#creating-accounts) and [https://ripple.com/build/reserves/](https://ripple.com/build/reserves/).

# About XRP Balances

Amounts of XRP are represented on the Ripple Consensus Ledger as an unsigned integer count of *drops*, where one XRP == 1,000,000 drops.  Ripple recommends that software store XRP balances as integer amounts of drops, and perform integer arithmetic on these values.  However all user interfaces should present balances in units of XRP.

One drop (or .000001 XRP) cannot be further subdivided.  Bear this in mind when calculating and displaying FX rates between XRP and other assets.

See [https://ripple.com/build/rippled-apis/#specifying-currency-amounts](https://ripple.com/build/rippled-apis/#specifying-currency-amounts) for additional detail.

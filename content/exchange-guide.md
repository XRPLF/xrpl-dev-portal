# Listing XRP as an Exchange

This document describes the steps that an exchange needs to take to list XRP. For details about other aspects of `rippled` and the Ripple Consensus Ledger (RCL), see [https://ripple.com/build](https://ripple.com/build).

## Alpha Exchange

For illustrative purposes, this document uses a fictitious change called _Alpha Exchange_ that has the following characteristics:

* Currently specializes in listing BTC/USD
* Wants to add BTC/XRP and XRP/USD trading pairs
* Maintains balances for all of its customers
* Maintains balances for each of its supported currencies

### User Benefits

By supporting the BTC/XRP and XRP/USD trading pairs, Alpha Exchange allows its users to:

* Deposit XRP _to_ Alpha Exchange _from_ the RCL

* Withdraw XRP _from_ Alpha Exchange _to_ the RCL

* Trade XRP with other currencies, such as BTC, USD, amongst others

### Prerequisites for Supporting XRP

To support XRP, Alpha Exchange must create and maintain new accounts and balance sheets.

#### Accounts

Alpha Exchange must create at least two new [accounts](https://ripple.com/build/accounts/) (also referred to as "wallets") on the RCL. To minimize the risk associated with a compromised secret key, Ripple recommends creating [_issuing_ and _operational_ accounts](https://ripple.com/build/issuing-operational-addresses/):

    * An _issuing_ account to securely hold the majority of XRP and customers' funds

    * One or more _operational_ (and, perhaps, _standby_) accounts to conduct the day-to-day business of accepting customers' XRP withdrawals and deposits

#### Balance Sheets

* An additional balance sheet to track each customer’s XRP held at Alpha Exchange

The new RCL wallets are represented on the left-hand side of Figure 1. A  model of hot, cold and warm wallets is intended to balance security and convenience for users deposits and withdrawals. Cold wallets are understood to be offline, warm may be online using the [Ripple Multisign](https://ripple.com/build/how-to-multi-sign/) technology, and hot wallets are developed to service instant withdrawal requests.  For more information about secure wallets and  additional best practices, see the Ripple Developer Portal :

[https://ripple.com/build/gateway-guide/#suggested-business-practices](https://ripple.com/build/gateway-guide/#suggested-business-practices)

The additional balance sheet is represented on the right-hand side of Figure 1.  Alpha Exchange’s software manages their users’ balances of XRP on this accounting system.  The remainder of this document describes the flow of funds as Alpha Exchange allows users to deposit, trade, and redeem XRP balances.

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
    <td>50,000</td>
    <td></td>
    <td>789</td>
    <td>Charlie</td>
    <td>0</td>
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


Figure 1 : Initial requirements for listing XRP, denoted by green table cells

## Key Definitions

**On Ledger XRP**: XRP that is visible by querying the public RCL blockchain via the public address of the XRP holder. The counterparty to these balances is the global, decentralized and distributed, RCL.

**Off Ledger XRP**: XRP that is held by the accounting system of an exchange that is visible by querying the exchange interface. These balances are credit based, and have a counterparty as the exchange. While these XRP balances are traded between participants in an exchange, the exchange is obligated to hold a balance of On Ledger XRP equal to the aggregate amount of Off Ledger XRP available for trade.

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

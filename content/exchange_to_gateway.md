# Becoming a Ripple Gateway #

An existing online financial service, such as a payment system or digital currency exchanges, can provide additional value to customers by acting as a Ripple Gateway. This provides users the ability to send cross-currency payments to users linked by other Ripple Gateways, and potentially provides a new revenue source for balances deposited, withdrawn, or transferred in Ripple.

Expanding an existing exchange system to support Ripple is a relatively simple task. This document explains the concepts necessary to set up a system, and covers the details of doing so. In this document, we use a fictional online currency exchange named "ACME" and its users as examples of how ACME can expand its business to include being a Ripple Gateway.

## Ripple Gateways Explained ##

A Ripple _*Gateway*_ is an entity that exchanges balances in the Ripple Network for balances in the Ripple Network -- in other words, performing deposits and withdrawals from Ripple. Typically, a Gateway holds money (or other assets of value) outside of Ripple, and creates _*issuances*_ in the Ripple Network to represent them. Within Ripple, issuances can be sent, traded, and exchanged atomically without the gateway's intervention.

### Prior to Ripple Integration ###

Our example exchange, ACME, already accepts withdrawals and deposits from users using some existing system, and uses an internal accounting system to track how much balance each user has with the exchange. Such a system can be modeled simply like this:

<!-- diagram: e2g_1

Alice - €4 held
ACME - €5 held
ACME Core Accounting - Bob: €1, Charlie: €2, ACME itself: €2

Alice deposits €4

Alice - €0 held
ACME - €9 held
ACME Core Accounting - Alice: €4, Bob: €1, Charlie: €2, ACME itself: €2

-->

### Adding Ripple Deposits ###

Two changes are necessary in order to become a Ripple Gateway. First, you must modify your accounting system to track money that is backing funds issued on the Ripple Network. This could be as simple as adding a record in your core accounting system for Ripple. Second, you must create and follow a process for "deposits" into Ripple, and "withdrawals" from Ripple. These are similar to, but separate from the process of depositing and withdrawing money from the exchange. 

A deposit into Ripple involves the following steps:

1. Alice asks to deposit €2 of her balance into Ripple
2. In its internal accounting, ACME debits Alice's balance €2 and credits the Ripple-backed balance by €2.
3. ACME submits a Ripple transaction, sending €2 to Alice's Ripple address. The €2 is marked in Ripple as being "issued" by ACME.

<!-- diagram:

ACME Core Accounting - Alice: €4, Bob: €1, Charlie: €2, ACME itself: €2, Ripple: €0
ACME hot wallet —€0→ cold wallet
Alice Ripple acct —€0→ cold wallet

Alice "deposits" €2 into Ripple (intermediate state)

ACME Core Accounting - Alice: €2, Bob: €1, Charlie: €2, ACME itself: €2, Ripple: €2
ACME hot wallet —€2→ cold wallet
Alice Ripple acct —€0→ cold wallet

ACME sends Alice's money to her Ripple account

ACME Core Accounting - Alice: €2, Bob: €1, Charlie: €2, ACME itself: €2, Ripple: €2
ACME hot wallet —€0→ cold wallet
Alice Ripple acct —€2→ cold wallet

-->

There are several prerequisites that ACME must meet in order for this to happen:

- ACME must have a Ripple account. Our best practices recommend actually having at least two accounts, so that the account creating issuances in Ripple is exposed to less risk than the account(s) performing day-to-day transactions.
- ACME needs to know Alice's Ripple address.
- Alice must create a trustline from her Ripple address to ACME.

### Trading on Ripple ###

After the issuances have been created in Ripple, they can be freely transferred and 

- Anyone can buy/sell EUR@ACME on Ripple
    - including users who don't have ACME accounts (caveat: requireauth flag)
- Ripple users trading and sending EUR@ACME to one another requires no intervention by ACME


### Withdrawing from Ripple ###

(TODO: flesh out)

- ACME should honor its obligations
    - but should do KYC first

Withdrawal process: (like a deposit in reverse!)

1. Bob sends Ripple transaction of €1 to ACME
2. In its internal accounting, ACME debits its Ripple-backing balance €1 and credits Bob's balance €1.

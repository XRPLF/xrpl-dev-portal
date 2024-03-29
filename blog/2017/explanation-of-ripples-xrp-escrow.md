---
date: 2017-12-15
category: 2017
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# An Explanation of Ripple’s XRP Escrow

To provide additional predictability to the XRP supply, Ripple has locked 55 billion XRP (55% of the total possible supply) into a series of escrows. These escrows are on the ledger itself and the ledger mechanics, enforced by consensus, control the release of the XRP.

The escrow consists of independent on ledger escrows that release a total of one billion XRP each month over the next 55 months. This provides an upper limit on the amount of new XRP that can be brought into circulation. The amount of XRP actually released into circulation will likely be much less than this. Any additional XRP leftover each month will be placed into a new escrow to release in the first month in which no escrow currently releases.

During the process of moving Ripple’s XRP into escrow, we also changed our account security model. The XRP Ledger supports a native multisign scheme and Ripple secured the accounts the escrows release into using this scheme.

The multisignature scheme has numerous advantages over the schemes other ledgers use. For example, the signers or quorum can be changed without changing the receiving address. Individual signers can rotate their own credentials without disturbing the funds on the ledger.

## Ledger Mechanics

The XRP Ledger’s escrow system is designed to handle two use cases. The one that gives it its name is its ability to lock funds on the ledger subject to release to one of two accounts depending on whether a particular condition occurs by a particular time. This supports Interledger transactions or cross-ledger atomic swaps.

The escrow system consists of three types of transactions and one type of ledger entry. Escrows are created with an “EscrowCreate” transaction. This creates the “Escrow” ledger entry. An escrow can then be either cancelled or finished with an “EscrowCancel” or an “EscrowFinish” transaction.

If an escrow is successfully finished, it delivers the XRP held to its destination account. If the escrow is cancelled, it delivers the XRP back to the source account. A ledger can have a date before which it cannot be cancelled, a date before which it cannot be finished, and a condition which must be satisfied to permit it to be finished.

An escrow as a time lock several different ways, but the simplest one is to create an escrow that cannot be cancelled, cannot be finished before a particular date, and requires no additional condition to finish. For simplicity, the destination account can be set to be identical to the source account.

On the ledger, an “Escrow” entry has a source account, a destination account, and an XRP amount. It is considered owned by the account that created it and increases the required XRP reserve for that account until it is completed or cancelled. Escrow entries can optionally have a cryptocondition that must be satisfied to finish the escrow, a date before which it cannot be cancelled, and a date before which it cannot be completed.

Escrows can also have source and destination tags. Source and destination tags on the XRP Ledger provide a uniform and reliable way to support hosted accounts where an agent (such as an exchange) performs a transaction on behalf of its customer. The destination tag informs the recipient of which customer to credit. The source tag permits a payment to be refunded and the refund to be credited to the proper customer. This permits exchanges (or hosted wallet providers) to perform and receive escrowed payments on behalf of their customers.

While the escrow is currently being used to provide more predictability to the XRP supply, Ripple expects that escrow will increasingly be used for higher-value, on-ledger and cross-ledger atomic payments using the Interledger Protocol. The XRP Ledger also provides payment channels for lower-value, off-ledger payments and micropayments.

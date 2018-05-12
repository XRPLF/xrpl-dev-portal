A Sequence number is a 32-bit unsigned integer used to identify a transaction or Offer relative to a specific account.

Every [account in the XRP Ledger](accounts.html) has a Sequence number, which starts at 1. For a transaction to be relayed to the network and possibly included in a validated ledger, it must have a `Sequence` field that matches the sending account's current `Sequence` number. An account's Sequence field is incremented whenever a transaction from that account is included in a validated ledger (regardless of whether the transaction succeeded or failed). This preserves the order of transactions submitted by an account, and differentiates transactions that would otherwise be the same.

Every [Offer in the XRP Ledger's decentralized exchange](offers.html) is marked with the sending `Account` [Address][] and the `Sequence` value of the [OfferCreate transaction](offercreate.html) that created it. These two fields, together, uniquely identify the Offer.

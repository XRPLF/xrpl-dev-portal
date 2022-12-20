---
html: payment-channels-uc.html
parent: payments-uc.html
blurb: Transfer XRP between accounts.
labels:
  - Transactions
---
# Payment Channels

Payment Channels are an advanced feature for sending asynchronous XRP payments that can be divided into very small increments and settled later.

The XRP for a payment channel is set aside temporarily. The sender creates _Claims_ against the channel, which the recipient verifies without sending an XRP Ledger transaction or waiting for a new ledger version to be approved by [consensus](consensus.html). (This is an _asynchronous_ process because it happens separate from the usual pattern of getting transactions approved by consensus.) At any time, the recipient can _redeem_ a Claim to receive an amount of XRP authorized by that Claim. Settling a Claim like this uses a standard XRP Ledger transaction, as part of the usual consensus process. This single transaction can encompass any number of transactions guaranteed by smaller Claims.

Because Claims can be verified individually but settled in bulk later, payment channels make it possible to conduct transactions at a rate only limited by the participants' ability to create and verify the digital signatures of those Claims. This limit is primarily based on the speed of the participants' hardware and the complexity of the signature algorithms. For maximum speed, use Ed25519 signatures, which are faster than the XRP Ledger's default secp256k1 ECDSA signatures. Research has [demonstrated the ability to create over Ed25519 100,000 signatures per second and to verify over 70,000 per second](https://ed25519.cr.yp.to/ed25519-20110926.pdf) on commodity hardware in 2011.

Learn about [Payment Channels](payment-channels.html) on the XRP Ledger.

---

***TODO: Improve conceptual intro of corresponding topic and update this page.***

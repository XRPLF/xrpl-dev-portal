# Reserves #

The Ripple Consensus Ledger applies _reserve requirements_, in XRP, to protect the shared global ledger from growing excessively large as the result of spam or malicious usage. The goal is to constrain the growth of the ledger to match [Moore's Law](https://en.wikipedia.org/wiki/Moore's_law) so that a current commodity-level machine can always fit the current ledger in RAM and the full ledger history on disk.

To submit transactions, an address must hold a minimum amount of XRP in the shared global ledger. You cannot send this XRP to other addresses. To fund a new address, you must send enough XRP to meet the reserve requirement.

The current minimum reserve requirement is **20 XRP**. (This is the cost of an address that owns no other objects in the ledger.)


## Base Reserve and Owner Reserve ##

The reserve requirement is divided into two parts:

* The **Base Reserve** is a minimum amount of XRP that is required for every address in the ledger. Currently, this is 20 XRP (`20000000` drops).
* The **Owner Reserve** is an increase to the reserve requirement for each object that the address owns in the ledger. Currently, this is 5 XRP (`5000000` drops) per item.


### Owner Reserves ###

Many objects in the ledger are owned by a particular address, and count toward the reserve requirement of that address. When objects are removed from the ledger, they no longer count against their owner's reserve requirement.

* [Offers](reference-ledger-format.html#offer) are owned by the address that placed them. Transaction automatically removes Offers that are fully consumed or found to be unfunded. Alternatively, the owner can cancel an Offer by sending an [OfferCancel transaction](reference-transaction-format.html#offercancel), or by sending an [OfferCreate transaction](reference-transaction-format.html#offercreate) that contains an `OfferSequence` parameter.
* [Trust lines](reference-ledger-format.html#ripplestate) are shared between two addresses. The owner reserve can apply to one or both of the addresses, depending on whether the fields that address controls are in their default state. See [Contributing to the Owner Reserve](reference-ledger-format.html#contributing-to-the-owner-reserve) for details.
* A single [SignerList](reference-ledger-format.html#signerlist) counts as 3 to 10 objects for purposes of the owner reserve, depending on how many members it has. See also: [SignerLists and Reserves](reference-ledger-format.html#signerlists-and-reserves).
* [Owner directories](reference-ledger-format.html#directorynode) list all the ledger nodes that contribute to an address's owner reserve. However, the owner directory itself does not count towards the reserve.

#### Owner Reserve Edge Cases ####

The Ripple Consensus Ledger considers an [OfferCreate transaction](reference-transaction-format.html#offercreate) to be an explicit statement of willingness to hold an asset. Consuming the offer automatically creates a trust line (with limit 0, and a balance above that limit) for the `taker_pays` currency if such a trust line does not exist. However, if the offer's owner does not hold enough XRP to also meet the owner reserve requirement of the new trust line, the offer is considered unfunded. See also: [Lifecycle of an Offer](reference-transaction-format.html#lifecycle-of-an-offer).



## Going Below the Reserve Requirement ##

During transaction processing, a transaction can only be successful if the sending address holds at least the reserve requirement in XRP. In the process, the [transaction cost](concept-transaction-cost.html) destroys some of the sending address's XRP balance. This can cause an address's XRP to go below the reserve requirement.

When an address holds less XRP than its current reserve requirement, it cannot send new transactions. Even so, the address continues to exist in the ledger, as all addresses do. Unless the reserve requirements decrease, the only way for the address to become able to send transactions again is for it to receive enough XRP that it meets the reserve requirement.

**Exception:** When an address is below the reserve requirement, it can send new [OfferCreate transactions](reference-transaction-format.html#offercreate) to acquire more XRP, or other currencies on its existing trust lines. These transactions cannot create new [trust lines](reference-ledger-format.html#ripplestate), or [Offer nodes in the ledger](reference-ledger-format.html#offer), so they can only execute trades that consume Offers that are already in the order books.

## Changing the Reserve Requirements ##

The Ripple Consensus Ledger has a mechanism to adjust the reserve requirements for long-term changes in the value of XRP. Any changes have to be approved by the consensus process. See [Fee Voting](concept-fee-voting.html) for more information.

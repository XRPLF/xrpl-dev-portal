# Reserves #

The Ripple Consensus Ledger applies _reserve requirements_, in XRP, to protect the shared global ledger from growing too large to handle efficiently as the result of spam or malicious usage. The goal is to constrain the growth of the ledger to match [Moore's Law](https://en.wikipedia.org/wiki/Moore's_law) so that a current commodity-level machinec an always fit the current ledger in RAM and the full ledger history on disk.

Each account in the shared global ledger must hold a minimum of XRP in order to submit transactions, and it cannot send this XRP to other accounts. You cannot create a new account unless you send enough XRP to meet the minimum reserve requirement.


## Base Reserve and Owner Reserve ##

The reserve requirement is divided into two parts:

* The **Base Reserve** is a static minimum amount of XRP that is required for every account in the ledger. Currently, this is 20 XRP (`20000000` drops).
* The **Owner Reserve** is an additional requirement that scales with the number of objects that the account owns in the ledger. Currently, this is 5 XRP (`5000000` drops) per item.


### Owner Reserves ###

Many objects in the ledger are owned by a particular account, and therefore count toward the reserve requirement of that account. When objects are removed from the ledger, they no longer count against their owner's account reserve.

* [Offers](ripple-ledger.html#offer) are owned by the account that placed them. An Offer can be automatically removed from the ledger if it is fully consumed or if it is found unfunded during transaction processing. Alternatively, the owner can cancel an offer by sending an [OfferCancel transaction](transactions.html#offercancel), or by sending an [OfferCreate transaction](transactions.html#offercreate) that contains an `OfferSequence` parameter.
* [Trust lines](ripple-ledger.html#ripplestate) are shared between two accounts. The owner reserve can apply to one or both of the accounts, depending on whether the fields that account controls are in their default state. See [Contributing to the Owner Reserve](ripple-ledger.html#contributing-to-the-owner-reserve) for details.
* [Owner directories](ripple-ledger.html#directorynode) list all the ledger nodes that contribute to an account's owner reserve. However, the owner directory itself does not count towards the reserve.

#### Owner Reserve Edge Cases ####

The Ripple Consensus Ledger considers an [OfferCreate transaction](transactions.html#offercreate) to be an explicit statement of willingness to hold an asset. Consuming the offer automatically creates a trust line (with limit 0, and a balance above that limit) for the `taker_pays` currency if such a trust line does not exist. However, if the offer's owner does not possess enough XRP to meet the additional reserve requirement of the new trust line, the offer is considered unfunded. See also: [Lifecycle of an Offer](transactions.html#lifecycle-of-an-offer).



## Going Below the Reserve Requirement ##

During transaction processing, a transaction can only be successful if the sending account possesses at least the reserve requirement in XRP. In the process, the [transaction cost](tx-cost.html) destroys some of the sending account's XRP balance. This can cause an account to go below the reserve requirement.

When an account has less XRP than its current reserve requirement, it continues to exist in the ledger, but it cannot send new transactions. Unless the reserve requirements decrease, the only way for the account to become able to send transactions again is for it to receive enough XRP that it meets the reserve requirement.


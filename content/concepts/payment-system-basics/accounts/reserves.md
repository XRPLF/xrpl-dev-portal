# Reserves

The XRP Ledger applies _reserve requirements_, in XRP, to protect the shared global ledger from growing excessively large as the result of spam or malicious usage. The goal is to constrain the growth of the ledger to match improvements in technology so that a current commodity-level machine can always fit the current ledger in RAM and the full ledger history on disk.

To submit transactions, an address must hold a minimum amount of XRP in the shared global ledger. You cannot send this XRP to other addresses. To fund a new address, you must send enough XRP to meet the reserve requirement.

The current minimum reserve requirement is **20 XRP**. (This is the cost of an address that owns no other objects in the ledger.) Each new [account](accounts.html) must set aside this much XRP, which cannot be recovered or sent to others.


## Base Reserve and Owner Reserve

The reserve requirement is divided into two parts:

* The **Base Reserve** is a minimum amount of XRP that is required for every address in the ledger. Currently, this is 20 XRP (`20000000` drops).
* The **Owner Reserve** is an increase to the reserve requirement for each object that the address owns in the ledger. Currently, this is 5 XRP (`5000000` drops) per item.


### Owner Reserves

Many objects in the ledger are owned by a particular address, and count toward the reserve requirement of that address. When objects are removed from the ledger, they no longer count against their owner's reserve requirement.

- [Offers](offer.html) are owned by the address that placed them. Transaction processing automatically removes Offers that are fully consumed or found to be unfunded. Alternatively, the owner can cancel an Offer by sending an [OfferCancel transaction][], or by sending an [OfferCreate transaction][] that contains an `OfferSequence` parameter.
- [Trust lines](ripplestate.html) are shared between two addresses. The owner reserve can apply to one or both of the addresses, depending on whether the fields that address controls are in their default state. See [Contributing to the Owner Reserve](ripplestate.html#contributing-to-the-owner-reserve) for details.
- Without the [MultiSignReserve amendment][], a single [SignerList](signerlist.html) counts as 3 to 10 objects for purposes of the owner reserve, depending on how many members it has. With the [MultiSignReserve amendment][] enabled, a single SignerList counts as 1 object for purposes of the owner reserve, regardless of the number of members it has. See also: [SignerLists and Reserves](signerlist.html#signerlists-and-reserves).
- [Held Payments (Escrow)](escrow-object.html) are owned by the address that placed them.
- [Payment Channels](use-payment-channels.html) are owned by the address that created them.
- [Owner directories](directorynode.html) list all the ledger objects that contribute to an address's owner reserve. However, the owner directory itself does not count towards the reserve.
- [Checks](checks.html) are owned by the address that created them (the sender, not the destination).


#### Owner Reserve Edge Cases

The XRP Ledger considers an [OfferCreate transaction][] to be an explicit statement of willingness to hold an asset. Consuming the offer automatically creates a trust line (with limit 0, and a balance above that limit) for the `taker_pays` currency if such a trust line does not exist. However, if the offer's owner does not hold enough XRP to also meet the owner reserve requirement of the new trust line, the offer is considered unfunded. See also: [Lifecycle of an Offer](offers.html#lifecycle-of-an-offer).


## Going Below the Reserve Requirement

During transaction processing, the [transaction cost](transaction-cost.html) destroys some of the sending address's XRP balance. This can cause an address's XRP to go below the reserve requirement.

When an address holds less XRP than its current reserve requirement, it cannot send new transactions that would transfer XRP to others, or increase its own reserve. Even so, the address continues to exist in the ledger and can send other transactions as long as it has enough XRP to pay the transaction cost. The address can become able to send all types of transactions again if it receives enough XRP to meet its reserve requirement again, or if the [reserve requirement decreases](#changing-the-reserve-requirements) to less than the address's XRP holdings.

**Tip:** When an address is below the reserve requirement, it can send new [OfferCreate transactions][] to acquire more XRP, or other currencies on its existing trust lines. These transactions cannot create new [trust lines](ripplestate.html), or [Offer nodes in the ledger](offer.html), so they can only execute trades that consume Offers that are already in the order books.


## Changing the Reserve Requirements

The XRP Ledger has a mechanism to adjust the reserve requirements for long-term changes in the value of XRP. Any changes have to be approved by the consensus process. See [Fee Voting](fee-voting.html) for more information.

## See Also

- [account_objects method][]
- [AccountRoot Object][]
- [Fee Voting](fee-voting.html)
- [SetFee pseudo-transaction][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

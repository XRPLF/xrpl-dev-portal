---
html: reserves.html
parent: accounts.html
blurb: XRP Ledger accounts require a reserve of XRP to reduce spam in ledger data.
labels:
  - Fees
  - Accounts
top_nav_grouping: Popular Pages
---
# Reserves

The XRP Ledger applies _reserve requirements_, in XRP, to protect the shared global ledger from growing excessively large as the result of spam or malicious usage. The goal is to constrain the growth of the ledger to match improvements in technology so that a current commodity-level machine can always fit the current ledger in RAM.

To have an account, an address must hold a minimum amount of XRP in the shared global ledger. You cannot send this XRP to other addresses. To fund a new address, you must send that address enough XRP to meet the reserve requirement.

The reserve requirement changes from time to time due to the [Fee Voting](fee-voting.html) process, where validators can agree to new reserve settings. On [Mainnet](parallel-networks.html), the current minimum reserve requirement is **10 XRP**. (This is the cost of an address that owns no other objects in the ledger.) Each new [account](accounts.html) must set aside this much XRP. Some of this XRP can be recovered by [deleting the account](accounts.html#deletion-of-accounts).

To determine the current minimum reserve requirement, use the [`server_info` command](server_info.html) and take `validated_ledger.reserve_base_xrp`.

## Base Reserve and Owner Reserve

The reserve requirement has two parts:

* The **Base Reserve** is a minimum amount of XRP that is required for each address in the ledger.
* The **Owner Reserve** is an increase to the reserve requirement for each object that the address owns in the ledger.


### Owner Reserves

Many objects in the ledger are owned by a particular address, and count toward the reserve requirement of that address. Each object increases the reserve requirement by the Owner Reserve. On Mainnet, this is currently 2 XRP (`2000000` [drops](xrp.html#xrp-properties)) per item.

When objects are removed from the ledger, they no longer count against their owner's reserve requirement.

To retrieve the number of objects an account owns in the ledger, use the [account_info method][] and take `account_data.OwnerCount`. `OwnerCount` is one of the fields of the [`AccountRoot` object](accountroot.html). To look up reserve settings, use the [server_info method][]: the `validated_ledger.reserve_inc_xrp` is the owner reserve and the `validated_ledger.reserve_base_xrp` is the base reserve, both in decimal XRP. To get the values in integer drops of XRP instead, use the [server_state method][].

To calculate an address's Owner Reserve requirement, multiply `OwnerCount` by `reserve_inc_xrp`, then add `reserve_base_xrp`. [Here is a demonstration](build-a-desktop-wallet-in-python.html#codeblock-17) of this calculation in Python.

- [Offers](offer.html) are owned by the address that placed them. Transaction processing automatically removes Offers that are fully consumed or found to be unfunded. Alternatively, the owner can cancel an Offer by sending an [OfferCancel transaction][], or by sending an [OfferCreate transaction][] that contains an `OfferSequence` parameter.
- [Trust lines](ripplestate.html) are shared between two addresses. The owner reserve can apply to one or both of the addresses, depending on whether the fields that address controls are in their default state. See [Contributing to the Owner Reserve](ripplestate.html#contributing-to-the-owner-reserve) for details.
- A SignerList counts as 1 object for purposes of the owner reserve (since the [MultiSignReserve amendment][] activated in April 2019). See also: [Signer Lists and Reserves](signerlist.html#signer-lists-and-reserves).
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

The XRP Ledger has a mechanism to adjust the reserve requirements. Such adjustments may consider, for example, long-term changes in the value of XRP, improvements in the capacity of commodity-level machine hardware, or increased efficiency in the server software implementation. Any changes have to be approved by the consensus process. See [Fee Voting](fee-voting.html) for more information.

## See Also

- [account_objects method][]
- [AccountRoot Object][]
- [Fee Voting](fee-voting.html)
- [SetFee pseudo-transaction][]
- [Tutorial: Calculate and display the reserve requirement (Python)](build-a-desktop-wallet-in-python.html#3-display-an-account)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

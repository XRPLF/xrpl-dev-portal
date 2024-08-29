---
html: reserves.html
parent: accounts.html
seo:
    description: XRP Ledger accounts require a reserve of XRP to reduce spam in ledger data.
labels:
  - Fees
  - Accounts
top_nav_grouping: Popular Pages
---
# Reserves

The XRP Ledger applies _reserve requirements_, in XRP, to protect the shared global ledger from growing excessively large as the result of spam or malicious usage. The goal is to constrain the growth of the ledger to match improvements in technology so that a current commodity-level machine can always fit the current ledger in RAM.

To have an account, an address must hold a minimum amount of XRP in the shared global ledger. To fund a new address, you must receive enough XRP at that address to meet the reserve requirement. You cannot send the reserved XRP to others, but you can recover some of the XRP by [deleting the account](deleting-accounts.md).

The XRP reserve is not dormant, however. You can use your reserves to pay transaction fees. Another way to look at your reserves is that you are pre-funding your account to handle your transaction fees.

The reserve requirement changes from time to time due to the [Fee Voting](../consensus-protocol/fee-voting.md) process, where validators can agree to new reserve settings.

## Base Reserve and Owner Reserve

The reserve requirement has two parts:

* The **Base Reserve** is a minimum amount of XRP that is required for each address in the ledger.
* The **Owner Reserve** is an increase to the reserve requirement for each object that the address owns in the ledger. The cost per item is also called the _incremental reserve_.

The current reserve requirements on Mainnet are:

- Base reserve: **10 XRP**
- Owner reserve: **2 XRP** per item

Reserves on other networks may vary.

An exception to the owner reserve is that you can create your first two trust lines on the XRPL without the required reserves of 2 XRP per trust line. Create your new account with the 10 XRP base reserve, then create your 2 trust lines and the reserves are not required. If you fund your account with more than 10 XRP, your account will be charged the normal reserve fees for your first two trust lines.

## Owner Reserves

Many objects in the ledger (ledger entries) are owned by a particular account. Usually, the owner is the account that created the object. Each object increases the owner's total reserve requirement by the owner reserve. When objects are removed from the ledger, they no longer count against the reserve requirement.

Objects that count towards their owner's reserve requirement include: [Checks](../payment-types/checks.md), [Deposit Preauthorizations](depositauth.md#preauthorization), [Escrows](../payment-types/escrow.md), [NFT Offers](../tokens/nfts/trading.md), [NFT Pages](../tokens/nfts/index.md), [Offers](../../references/protocol/ledger-data/ledger-entry-types/offer.md), [Oracles](../xrpl-sidechains/price-oracles.md), [Payment Channels](../payment-types/payment-channels.md), [Signer Lists](multi-signing.md), [Tickets](tickets.md), and [Trust Lines](../tokens/fungible-tokens/index.md).

Some special cases:

- Non-Fungible Tokens (NFTs) are grouped into pages containing up to 32 NFTs each, and the owner reserve applies per page rather than per NFT. Due to the mechanism for splitting and combining pages, the number of NFTs actually stored per page varies. See also: [Reserve for NFTokenPage objects](../../references/protocol/ledger-data/ledger-entry-types/nftokenpage.md#nftokenpage-reserve).
- Trust lines (`RippleState` entries) are shared between two accounts. The owner reserve can apply to one or both of them. Most often, the token holder owes a reserve and the issuer does not. See also: [RippleState: Contributing to the Owner Reserve](../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#contributing-to-the-owner-reserve).
- Signer lists created before the [MultiSignReserve amendment][] activated in April 2019 count as multiple objects. See also: [Signer Lists and Reserves](../../references/protocol/ledger-data/ledger-entry-types/signerlist.md#signer-lists-and-reserves).
- An [Owner Directory](../../references/protocol/ledger-data/ledger-entry-types/directorynode.md) is a ledger entry that lists all objects related to an account, including all objects the account owns. However, the owner directory itself does not count towards the reserve.
- Oracles count as one item for the owner reserve if they contain one to five `PriceData` objects, or two items if they contain six to ten `PriceData` objects.

### Looking Up Reserves

Applications can look up the current base and incremental reserve values using the [server_info method][] or [server_state method][]:

| Method                  | Units                | Base Reserve Field                  | Incremental Reserve Field          |
|-------------------------|----------------------|-------------------------------------|------------------------------------|
| [server_info method][]  | Decimal XRP          | `validated_ledger.reserve_base_xrp` | `validated_ledger.reserve_inc_xrp` |
| [server_state method][] | Integer drops of XRP | `validated_ledger.reserve_base`     | `validated_ledger.reserve_inc`     |

To determine the owner reserve of an account, multiply the incremental reserve by the number of objects the account owns. To look up the number of objects an account owns, call the [account_info method][] and take `account_data.OwnerCount`.

To calculate an address's total reserve requirement, multiply `OwnerCount` by `reserve_inc_xrp`, then add `reserve_base_xrp`. [Here is a demonstration](../../tutorials/python/build-apps/build-a-desktop-wallet-in-python.md#codeblock-17) of this calculation in Python.


## Going Below the Reserve Requirement

During transaction processing, the [transaction cost](../transactions/transaction-cost.md) destroys some of the sending address's XRP balance. This can cause an address's XRP to go below the reserve requirement. You can even destroy _all_ of your XRP this way.

When your account holds less XRP than its current reserve requirement, you cannot send XRP to others, or create new objects that would increase your account's reserve requirement. Even so, the account continues to exist in the ledger and you can still send transactions that don't do these things, as long as you have enough XRP to pay the transaction cost. You can go back above the reserve requirement by receiving enough XRP, or if the reserve requirement decreases below the amount you have.

**Tip:** If your address is below the reserve requirement, you can send an [OfferCreate transactions][] to acquire more XRP and get back above the reserve requirement. However, since you cannot create an [Offer entry in the ledger](../../references/protocol/ledger-data/ledger-entry-types/offer.md) while you are below the reserve, this transaction can only consume Offers that are already in the order books.


## Changing the Reserve Requirements

The XRP Ledger has a mechanism to adjust the reserve requirements. Such adjustments may consider, for example, long-term changes in the value of XRP, improvements in the capacity of commodity-level machine hardware, or increased efficiency in the server software implementation. Any changes have to be approved by the consensus process. See [Fee Voting](../consensus-protocol/fee-voting.md) for more information.

## See Also

- [account_objects method][]
- [AccountRoot Object][]
- [Fee Voting](../consensus-protocol/fee-voting.md)
- [SetFee pseudo-transaction][]
- [Tutorial: Calculate and display the reserve requirement (Python)](../../tutorials/python/build-apps/build-a-desktop-wallet-in-python.md#3-display-an-account)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

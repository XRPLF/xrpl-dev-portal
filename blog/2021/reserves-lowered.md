---
category: 2021
theme:
    markdown:
        editPage:
            hide: true
date: 2021-09-21
labels:
    - Advisories
---
# Lower Reserves Are Now In Effect

Over the course of the past year, several members of the XRP Ledger community have advocated for lowering the reserve requirements in the network to compensate for the sustained increase in the price of XRP. On 2021-09-19, [the new reserve values went into effect](https://livenet.xrpl.org/transactions/5922A0BA30621C60B2B6DDBC3FF6B5BB509EB3685C4C3D56696A9FE4FE6D48A3/raw) after gaining support from a majority of validators. The new reserve amounts are **10 XRP** base for an account plus **2 XRP** per object owned in the ledger, down from 20 XRP base and 5 XRP per object owned.

<!-- BREAK -->

## Impacts

Some XRP that was previously reserved is now available for use. Since the base reserve requirement has decreased from 20 to 10, accounts with a balance of at least 20 XRP now have access to the difference of 10 XRP, plus a decrease of 3 XRP per item owned (from 5 each to 2 each). For example, if your account owns 4 objects in the ledger, your reserve requirement decreased from 40 XRP (20 + 4×5) to 18 XRP (10 + 4×2).

It is now possible to fund new accounts by sending a payment of as little as 10 XRP; previously, at least 20 XRP was required.

The [special transaction cost](https://xrpl.org/transaction-cost.html) to [delete an account](https://xrpl.org/accounts.html#deletion-of-accounts) is based on the owner reserve, so deleting an account now requires burning only 2 XRP instead of 5 XRP.


## Action Recommended

Most XRP Ledger users and integrations do not need to take action to benefit from the reduced reserve. However, if you have software with a hard-coded reserve of 20 XRP, you should consider adjusting it to use the new values, or better yet, occasionally query the reserve information from the API:

To look up XRP reserves, see the [server_info method](https://xrpl.org/server_info.html)'s response. In particular, the `validated_ledger.reserve_base_xrp` field shows the base account reserve and the `validated_ledger.reserve_inc_xrp` shows the owner reserve (per item). You can also use the [server_state method](https://xrpl.org/server_state.html) to get the values in drops of XRP.


## Background

The XRP Ledger has [reserve requirements](https://xrpl.org/reserves.html) to disincentivize spamming the ledger with data, which must be replicated throughout the network and maintained by all servers in the system. The _base reserve_ (now 10 XRP) sets the minimum XRP that must be sent to create a new account, and the _owner reserve_ (now 2 XRP per item) increases an account's reserve for each additional object the account owns in the ledger's [state data](https://xrpl.org/ledger-data-formats.html), such as Offers, trust lines and Escrows.

The [Fee Voting](https://xrpl.org/fee-voting.html) process lets validators in the decentralized XRP Ledger network collectively adjust the reserve requirements. One reason to adjust reserve requirements is to compensate for long-term changes in the value of XRP. Fee voting can adjust reserves in either direction, but as XRP Ledger expert David Schwartz notes, [increases in the reserve are more painful for users than decreases](https://twitter.com/JoelKatz/status/1380980093858631682), so validator operators should avoid lowering the reserve if doing so is likely to require an increase later.

The previous time the reserves changed was in [December 2013](https://ripple.com/insights/proposed-change-to-ripple-reserve-requirement-2/), when 20 XRP was worth much less in fiat currency than it is today. The new 10 XRP reserve brings the fiat-currency cost of creating a new XRP Ledger account closer to the historical average.

## XRP Ledger Foundation Statement

The XRP Ledger Foundation posted this statement about the change to Twitter:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">We are very happy to see that the reserves have been voted down to 10/2 by validators. The foundation firmly believes in increasing accessibility to the XRP Ledger and hope this trend will continue in the same direction.</p>&mdash; XRP Ledger Foundation (Official) (@XRPLF) <a href="https://twitter.com/XRPLF/status/1439655907051274241?ref_src=twsrc%5Etfw">September 19, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

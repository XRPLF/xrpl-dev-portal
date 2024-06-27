---
category: 2024
date: 2024-03-26
labels:
    - Advisories
    - Amendments
theme:
    markdown:
        editPage:
            hide: true
---
# AMM Status Update

As previously expected, the [AMM Amendment to the XRP Ledger](./get-ready-for-amm.md) went live on 2024-03-22. However, soon after, a community member identified a discrepancy in a few AMM pools which indicated transactions were not executing as intended. A team including RippleX, Orchestra Finance, tequ, and other members of the XRP Ledger community moved quickly to identify the source of the problem, which involves how the DEX payment engine routes liquidity through AMM pools and order books in some complex payment path scenarios. 

A fix has been developed and [is being reviewed, tested, and prepared for release](https://github.com/XRPLF/rippled/pull/4968) as soon as possible. The fix requires an amendment to the XRP Ledger protocol, which must be voted in by network validators and maintain over 80% support for the normal 2-week period before activation. Until the fix is enabled on the network, it's best for users to redeem LP tokens and not deposit new funds into AMM pools.

Stay tuned for the release of `rippled` version 2.1.1.

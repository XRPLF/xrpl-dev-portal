---
category: 2024
markdown:
    editPage:
        hide: true
date: 2024-12-11
labels:
    - Advisories
---
# Lower Reserves Are In Effect

On 2024-12-02, the reserve requirements for using the XRP Ledger blockchain changed by the collective voting of the validators. The new requirements are **1 XRP** base reserve per account (down from 10 XRP), and **0.2 XRP** owner reserve increment per item (down from 2 XRP).

The base cost of sending a transaction (10 drops) remains unchanged.

## Background

The XRP Ledger has [reserves](../../docs/concepts/accounts/reserves.md) and a [transaction cost](../../docs/concepts/transactions/transaction-cost.md) to protect the network from spam. The protocol includes a [fee voting](../../docs/concepts/consensus-protocol/fee-voting.md) process for changing both the reserves and transaction cost, to adjust for external factors like the price of XRP and the costs of operating a network node.

Validators in the decentralized network can configure their fee voting preferences. They need to balance competing priorities of having lower fees to reduce the barrier to entry, but higher fees to protect against overly frivolous or disruptive usage. The network collectively decides on fees based on the votes of trusted validators, with each node advocating for the median of votes from validators it trusts.

The last time fees changed was [in 2021, when reserves dropped from 20 base and 5 per item to 10 base and 2 per item](../2021/reserves-lowered.md).

## Action Recommended

### FeeSettings Format

Due to the [XRPFees amendment](../../resources/known-amendments.md#xrpfees), the format of the `FeeSettings` ledger entry changed when the new reserve settings went into effect. If you have code that reads the `FeeSettings` ledger entry directly, make sure your code is capable of reading the new format.

Code that uses the `fee`, `server_info`, or `server_state` API methods should continue to work as before.

### Fee Volatility

Currently, votes among recommended validators on Mainnet are divided among a few different preferred settings for reserves and the transaction cost. While the numbers are close to 50% one way or another, a validator temporarily going offline could cause the median vote to move, causing the fee settings to change again temporarily; validators changing their votes could also cause further fee movements in the near future. To be prepared for any future possible movements in both the reserve requirements and transaction cost, you should:

- Instead of hard-coding reserve requirements or transaction costs, look up the necessary settings using the [`fee` API method](../../docs/references/http-websocket-apis/public-api-methods/server-info-methods/fee.md).
- Consider holding more XRP than the minimum, so that your account still meets the requirements if reserves go back up.

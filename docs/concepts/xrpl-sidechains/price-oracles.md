# Price Oracles

_(Requires the [PriceOracle amendment][] {% not-enabled /%})_

Blockchains can't inherently interact with and "know" what's happening off the network, but many of its use cases in decentralized finance require this information.

Price oracles solve this problem. An oracle is a service or technology that gathers real-world information, such as market prices, exchange rates, or interest rates, and relays it to the blockchain. Like blockchains, most oracles are also decentralized and validate data through multiple nodes.

{% admonition type="info" name="Note" %}

Generally speaking, oracles aren't limited to only providing financial information. They can provide any type of info, such as what sports team won a game, or even the weather. The XRP Ledger's Price Oracle feature, however, is designed specifically for reporting the prices of assets.

{% /admonition %}


## How Oracles Works

Most oracle blockchain interactions work like this:

1. Data is validated offchain by a decentralized oracle network.
2. The data is sent to the blockchain.
3. The blockchain uses that information to execute a smart contract, such as releasing funds from an escrow.

This process can also work in reverse, pushing transaction information to external systems.


## Price Oracles on the XRP Ledger

XRPL price oracles are a native, on-chain oracle, enhancing the native DeFi functionality of the XRP Ledger. Off-chain price oracles send their data to XRPL oracles, which store that information on-chain. Decentralized apps can then query the XRPL oracles for price data; multiple XRPL oracles can be queried to minimize risk and inaccuracies.

By standardizing price feeds in this manner, all XRPL apps can access a dependable, shared data source.

## See Also

- **References:**
    - [get_aggregate_price method][]
    - [Oracle entry][]
    - [OracleDelete transaction][]
    - [OracleSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

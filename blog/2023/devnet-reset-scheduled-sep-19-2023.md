---
category: 2023
date: 2023-09-11
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Devnet Reset Scheduled for Tue, Sep 19, 2023
_by Team RippleX_

As [previously announced](https://xrpl.org/blog/2023/upcoming-devnet-reset.html), the RippleX-managed Devnet test network will be reset. This reset has been scheduled for **Tuesday, September 19, 2023**.

At the time of the reset, a brief Devnet outage of less than one hour is expected.

If you have any tests or demos that rely on existing Devnet accounts and data, you will have to recreate that data after the reset. There are no effects anticipated on Testnet, Mainnet, or other networks.

In general, Devnet can be reset at any time, as the network's sole purpose is testing of in-development features which may not yet be stable. Demos, tutorials, and apps that use Devnet should automatically re-create any necessary data as needed.

<!-- BREAK -->

## Background

Ripple runs [several altnets](https://xrpl.org/parallel-networks.html) for various purposes, including Testnet, Devnet, AMM-Devnet. Unlike Mainnet, these chains are centralized with validators run by a single entity so that they can be reset. Devnet is a test network that runs pre-release versions of the code with new amendments enabled so that various parties can experiment with new features.

## After the Reset

The Devnet's starting supply of Test XRP will be given to a faucet account that you can access from the [XRP Faucets page](https://xrpl.org/xrp-testnet-faucet.html) or by API. If you want to fund the same addresses you were using before, you can specify the destination address when calling the faucet by API. For example, the following request asks the faucet to send test XRP to the address rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd on Devnet:

```http
POST https://faucet.devnet.rippletest.net/accounts
Content-Type: application/json

{
    "destination": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
}
```

If you have tests or samples that rely on data or settings in the Devnet ledger, you must re-create those settings and data. Note that AMM accounts may not use the same addresses after the reset.

## Learn, ask questions, and discuss

To learn more about the XRP Ledger, the amendment process, or other topics, see the following resources:

- [XRPL.org](https://xrpl.org) documentation
- [XRP Ledger Developers on Discord](https://xrpldevs.org/)
- [XRPL Server Software (rippled) on GitHub](https://github.com/XRPLF/rippled)
    - [Create a new issue](https://github.com/XRPLF/rippled/issues/new/choose)

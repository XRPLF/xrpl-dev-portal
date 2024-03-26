---
category: 2023
date: 2023-09-06
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Upcoming Devnet Reset
_by Team RippleX_

We are resetting Devnet due to incompatibility with a previous in-development version of the **AMM** (Automated Market Maker) amendment that was included in a beta release of the XRP Ledger core server. If you have any tests or demos that rely on existing Devnet accounts and data, you will have to recreate that data after the reset. There are no effects anticipated on Testnet, Mainnet, or other networks.

<!-- BREAK -->

## Background

Ripple runs [several altnets](https://xrpl.org/parallel-networks.html) for various purposes, including Testnet, Devnet, AMM-Devnet. Unlike Mainnet, these chains are centralized with validators run by a single entity so that they can be reset as needed. Each network has its own upgrade cadence and can have different [amendments to the protocol](https://xrpl.org/amendments.html) enabled. Devnet is a test network that runs pre-release versions of the code with new amendments enabled so that various parties can experiment with new features.

Ripple proposed Automated Market Makers as [XLS-30d](https://github.com/XRPLF/XRPL-Standards/discussions/78), and implemented this feature as the AMM amendment, which was merged to the reference server implementation as part of [version **1.12.0-b2**](https://github.com/XRPLF/rippled/tree/1.12.0-b2).


## Changes Leading to This Reset
Originally, the Automated Market Makers were implemented with an automated market maker's `AMM` ledger entry in the owner directory for the AMM's account. During development, this was changed as part of a larger set of design changes per review. After approval, the amendment was merged to the `develop` branch of the codebase. Devnet enabled this version of the code after its servers were upgraded. This allowed users to create and use automated market makers on Devnet.

Later, after testing on Devnet, it was decided to add the AMM back to the owner directory to make it easier to look up the AMM ledger entry. After review, these changes were merged to the `develop` branch as part of the same "AMM" amendment. These changes are incompatible with `AMM` ledger entries that were created with previous versions of the amendment, because the updated code adds a required field, `OwnerNode`, to the AMM ledger entry to help find it in the owner directory; ledger entries that were created under the previous code do not have this field. (The original version of the code did have this field, but that code was never in use on Devnet.)

The AMM-Devnet has been repeatedly reset for changes like these throughout the development of the AMM code, but now Devnet needs to be reset because the previous, incompatible code was in the `develop` branch and has already been used on Devnet.

Because the AMM amendment has never been in a stable release nor the `master` branch of the codebase, there are no conflicts on Testnet or Mainnet.


## After the Reset

We plan to reset Devnet so that it has all the following amemdments enabled:

- Amendments currently enabled on Mainnet.

    **Note:** For retired amendments, the Devnet will follow the amended behavior but the retired amendment's ID will not appear enabled in the on-ledger `Amendments` entry or the `feature` API method.

- Amendments that are "open for voting" as of version 1.11.0, including FixNFTokenRemint and XRPFees.

- Amendments that are new in version 1.12.0: AMM, Clawback, and fixReducedOffersV1.

As before, the Devnet's starting supply of Test XRP will be given to a faucet account that you can access from the [XRP Faucets page](https://xrpl.org/xrp-testnet-faucet.html) or by API. If you want to fund the same addresses you were using before, you can specify the destination address when calling the faucet by API. For example, the following request asks the faucet to send test XRP to the address rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd on Devnet:

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
- [AMM Documentation on Ripple's Open Source Site](https://opensource.ripple.com/docs/xls-30d-amm/automated-market-makers/)
- [XRP Ledger Developers on Discord](https://xrpldevs.org/)
- [XRP Ledger Foundation](https://foundation.xrpl.org/), on various platforms:
    - [YouTube](https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg)
    - [X / Twitter](https://twitter.com/XRPLF/)
    - [GitHub](https://github.com/XRPLF/)

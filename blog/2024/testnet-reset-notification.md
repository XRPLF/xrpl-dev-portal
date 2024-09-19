---
category: 2024
date: 2024-08-14
seo:
    title: Upcoming Testnet Reset Notification
    description: The Testnet reset was completed successfully on Monday, August 19, 2024 to improve stability and reduce the cost of running a Testnet node. Learn more.
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Upcoming Testnet Reset

Testnet is scheduled for a reset on **Monday, August 19, 2024** to improve stability and reduce the cost of running a Testnet node. 

{% admonition type="success" name="Update" %}
The reset has completed successfully. Testnet network and faucet are online and fully operational.
{% /admonition %}

## Background

Ripple operates Testnet and Devnet to help the community test new features and integrations without risking real money. Testnet is meant to closely mirror the amendment status of Mainnet while Devnet acts as a preview of proposed and upcoming features based on the develop branch of the source code. Both networks have their own fixed, finite supply of test XRP, most of which is given out for free from a "faucet" service. The networks are occasionally reset so that the faucet can continue to give out test XRP, and to ensure that balances in the test networks have no real-world value.

However, the current structure of Testnet, where test XRP is available for free, allows users to exploit the network by engaging in resource-intensive activities, such as minting millions of NFTs, that would otherwise be prohibitively expensive on XRPL Mainnet. This reset is necessary to reduce infrastructure demands and maintain the efficiency of Testnet. 

## Impact

This reset affects Testnet only. Other networks will continue to operate as usual, including XRPL Mainnet, XRPL Devnet, Xahau, and the Hooks Testnet.

The reset will delete all ledger data in Testnet, including all accounts, transactions, balances, settings, offers, AMMs, escrows, and other data. This means all balances will be reset to zero and the block number will start at one again. No changes are anticipated to services such as Tesnet APIs, faucets, Explorers, access rights, and wallet integrations; these services usually manage resets without issues.

Testnet will have its amendment statuses restored to match XRPL Mainnet. Any existing accounts or other data in either network will need new test XRP from the faucet and will need to be re-created. 

If code relies on specific addresses, a request  to the faucet can fund the same address again. However, any AMMs that are re-created after the reset will generally have different account addresses. As a reminder, it's best not to use the same addresses or key pairs on Mainnet and any test networks.

The important URLs, Network ID, and validator settings for both networks will remain the same.

## Action Recommended

If you run a `rippled` server that is connected to Testnet, after the reset you should delete your database data and restart the server. Database files and folders are defined in the config file in the `[database_path]` and `[node_db]` stanzas. If you use the default config, you can run the following commands:

```sh
rm -r /var/lib/rippled/db/*

systemctl restart rippled.service
```

## Learn, Ask Questions, and Discuss

We’re exploring long-term solutions to enhance network resilience and ensure you’re well-prepared, including:

* Optimizing resource allocation to manage testnet resources to prevent overuse.
* Implementing additional safeguards and resource management strategies.
* Establishing a regular reset schedule to provide consistency and predictability for developers by setting a clear timeline for testnet maintenance.

We’d like to hear from you!  Join the [XRPL Dev Discord](https://discord.gg/sfX3ERAMjH) to share your feedback. Your input and feedback on what changes would be beneficial is invaluable to improve testnet management and better support the community's needs.
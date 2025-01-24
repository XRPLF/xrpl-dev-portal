---
category: 2025
date: 2025-01-24
seo:
    description: Devnet is scheduled to reset on Monday, February 3, 2025 due to Clio databases nearing capacity. Learn more.
labels:
    - Advisories
markdown:
    editPage:
        hide: true
---
# Upcoming Devnet Reset

Devnet is scheduled for a reset on **Monday, February 3, 2025**. Clio server databases on the network are nearing storage capacity and need to be cleared.

<!--
{% admonition type="success" name="Update" %}
The reset has completed successfully. Devnet is online and fully operational.
{% /admonition %}
-->

## Background

Ripple operates Clio servers on Devnet to help the community access validated ledger data efficiently. Clio handles API calls better and stores data in a more space-efficient format than `rippled` servers, ultimately reducing the load on the network.

The virtual machines we're running the Clio servers from are nearing storage capacity. In order to continue serving the community, Devnet will be reset to clear the Clio databases.

## Impact

This reset affects Devnet only. Other networks will continue to operate as usual, including XRPL Mainnet, XRPL Testnet, Xahau, and the Hooks Testnet.

The reset will delete all ledger data in Devnet, including all accounts, transactions, balances, settings, offers, AMMs, escrows, and other data. This means all balances will be reset to zero and the block number will start at one again. No changes are anticipated to services such as Devnet APIs, faucets, Explorers, access rights, and wallet integrations; these services usually manage resets without issues.

Any existing accounts or other data will need new test XRP from the faucet and will need to be re-created.

If code relies on specific addresses, a request to the faucet can fund the same address again. However, any AMMs that are re-created after the reset will generally have different account addresses. As a reminder, it's best not to use the same addresses or key pairs on Mainnet and any developer networks.

As part of the reset, we'll also be updating the validator list with a new publisher key. The important URLs and Network ID will remain the same.

## Actions Required

If you run a `rippled` server that is connected to Devnet, after the reset you should delete your database data and restart the server. Database files and folders are defined in the config file in the `[database_path]` and `[node_db]` stanzas. If you use the default config, you can run the following commands:

```sh
rm -r /var/lib/rippled/db/*

systemctl restart rippled.service
```

You will also have to update the `[validator_list_keys]` keys stanza in your `validators.txt` file:

```
[validator_list_sites]
https://vl.devnet.rippletest.net

[validator_list_keys]
EDBB54B0D9AEE071BB37784AF5A9E7CC49AC7A0EFCE868C54532BCB966B9CFC13B
```

## Learn, Ask Questions, and Discuss

We’re exploring long-term solutions to enhance network resilience and ensure you’re well-prepared, including:

* Optimizing resource allocation to manage devnet resources to prevent overuse.
* Implementing additional safeguards and resource management strategies.
* Establishing a regular reset schedule to provide consistency and predictability for developers by setting a clear timeline for devnet maintenance.

We’d like to hear from you!  Join the [XRPL Dev Discord](https://discord.gg/sfX3ERAMjH) to share your feedback. Your input and feedback on what changes would be beneficial is invaluable to improve devnet management and better support the community's needs.
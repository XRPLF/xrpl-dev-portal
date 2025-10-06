---
category: 2025
date: "2025-09-24"
template: '../../@theme/templates/blogpost'
seo:
    description: Devnet is scheduled to reset on Friday, October 3, 2025 to prevent validators from becoming amendment blocked when PermissionDelegation is temporarily disabled.
labels:
    - Advisories
markdown:
    editPage:
        hide: true
---
# Upcoming Devnet Reset

Devnet is scheduled for a reset on **Friday, October 3, 2025**. The `PermissionDelegation` amendment requires more development and will be set to unsupported in the next rippled release. To prevent validators that upgrade to this version from becoming amendment blocked, Devnet will be reset.

{% admonition type="success" name="Update" %}
The reset has completed successfully. Devnet is online and fully operational.
{% /admonition %}


## Background

A bug was discovered in the implementation of `PermissionDelegation` released with 2.5.0. Due to the severity of the bug, the feature will be disabled in the upcoming rippled release while the bug is resolved. Since the feature was enabled on Devnet with the 2.5.0 release, this upcoming change will cause validators to become amendment blocked. To prevent this, Devnet must be reset.


## Impact

This reset affects Devnet only. Other networks will continue to operate as usual, including XRPL Mainnet, XRPL Testnet, Xahau, and the Hooks Testnet.

The reset will delete all ledger data in Devnet, including all accounts, transactions, balances, settings, offers, AMMs, escrows, and other data. This means all balances will be reset to zero and the block number will start at one again. No changes are anticipated to services such as Devnet APIs, faucets, Explorers, access rights, and wallet integrations; these services usually manage resets without issues.

Any existing accounts or other data will need new test XRP from the faucet and will need to be re-created.

If code relies on specific addresses, a request to the faucet can fund the same address again. However, any AMMs that are re-created after the reset will generally have different account addresses. As a reminder, it's best not to use the same addresses or key pairs on Mainnet and any developer networks.


## Actions Required

If you run a `rippled` server that is connected to Devnet, after the reset you should delete your database data and restart the server. Database files and folders are defined in the config file in the `[database_path]` and `[node_db]` stanzas. If you use the default config, you can run the following commands:

```sh
rm -r /var/lib/rippled/db/*

systemctl restart rippled.service
```


## Learn, Ask Questions, and Discuss

We’d like to hear from you!  Join the [XRPL Dev Discord](https://discord.gg/sfX3ERAMjH) to share your feedback. Your input and feedback on what changes would be beneficial is invaluable to improve devnet management and better support the community's needs.

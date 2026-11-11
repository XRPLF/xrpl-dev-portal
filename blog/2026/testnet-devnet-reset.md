---
category: 2026
date: "2026-11-09"
template: '../../@theme/templates/blogpost'
seo:
    description: Testnet and Devnet are scheduled to reset on Wednesday, November 25, 2026, to improve full history server stability.
labels:
    - Advisories
markdown:
    editPage:
        hide: true
---
# Upcoming Testnet and Devnet Resets

Testnet and Devnet are scheduled for a reset on **Wednesday, November 25, 2026** to improve full history server stability.

## Background

Ripple operates Testnet and Devnet to help the community test new features and integrations without risking real money. Testnet is meant to closely mirror the amendment status of Mainnet while Devnet acts as a preview of proposed and upcoming features based on the `develop` branch of the source code.

Testnet relied on a single full history server, which crashed and can't be recovered without a reset. To prevent this from happening again, we're upgrading server storage capacity. We will still have some retention limits, but this should reduce how often Testnet needs to be reset.

## Impact

The resets affect Testnet and Devnet only. Other networks, including Mainnet, will continue to operate as usual.

The resets will delete all ledger data in Testnet and Devnet, including all accounts, transactions, balances, settings, offers, AMMs, escrows, and other data. Testnet will have its Amendment statuses restored to match Mainnet's. If you use existing accounts or other data in either network, you will need to get new test XRP from the faucet and re-create them.

If your code relies on specific addresses, you can request the faucet fund the same address again. However, any AMMs that are re-created after the reset will generally have different account addresses. As a reminder, it's best not to use the same addresses or key pairs on Mainnet and any test networks.

The important URLs, Network ID, and validator settings for both networks will remain the same.

### Action Recommended

If you run an `xrpld` server that is connected to Testnet or Devnet, after the reset you should delete your database data and restart the server. Database files and folders are defined in your config file in the `[database_path]` and `[node_db]` stanzas. If you use the default config, you can run the following commands:

```sh
sudo systemctl stop xrpld
sudo rm -r /var/lib/xrpld/db/*
sudo systemctl start xrpld
```

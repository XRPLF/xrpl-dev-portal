---
category: 2024
date: 2024-04-17
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# Testnet and Devnet Resets Upcoming

This week, the faucets on both [Testnet and Devnet faucets](https://xrpl.org/resources/dev-tools/xrp-faucets/) had their supply of test XRP depleted. Team RippleX, which operates the test networks, has been periodically moving funds back to the Testnet faucet to keep it running temporarily. Additionally, both faucets have had their default funding amount reduced to 100 XRP and the maximum amount from one request reduced. Both networks will be completely reset on Saturday, 2024-04-20. Until then, you may encounter times when the faucets are empty and cannot provide test XRP.

{% admonition type="success" name="Update" %}
The resets have completed successfully. Testnet and Devnet networks and faucets are online and fully operational.
{% /admonition %}

## Background

Ripple operates Testnet and Devnet to help the community test new features and integrations without risking real money. These test networks are centralized, unlike the production XRP Ledger (Mainnet). Testnet is meant to closely mirror the amendment status of Mainnet while Devnet acts as a preview of proposed and upcoming features based on the `develop` branch of the source code. Both networks have their own fixed, finite supply of test XRP, most of which is given out for free from a "faucet" service. The networks are occasionally reset so that the faucet can continue to give out test XRP, and to ensure that balances in the test networks have no real-world value.

Until recently, the faucet had been configured to give out 1,000 XRP on Testnet or 10,000 XRP on Devnet by default, but users could ask for up to 1 million XRP per request. However, usage of both faucets has recently increased significantly, causing them to run out of funds earlier than anticipated. The faucet settings have been changed on both networks to give out 100 XRP by default and a maximum of 1,000 XRP per request; the new limits will remain in effect after the reset. Additional limitations may be imposed in the future as necessary.

## Impact

The resets affect Testnet and Devnet only. Other networks will continue to operate as usual, including Mainnet, Xahau, and the Hooks Testnet.

The resets will delete all ledger data in Testnet and Devnet, including all accounts, transactions, balances, settings, offers, AMMs, escrows, and other data. Testnet will have its Amendment statuses restored to match Mainnet's. If you use existing accounts or other data in either network, you will need to get new test XRP from the faucet and re-create them.

If your code relies on specific addresses, you can request the faucet fund the same address again. However, any AMMs that are re-created after the reset will generally have different account addresses. As a reminder, it's best not to use the same addresses or key pairs on Mainnet and any test networks.

The important URLs, Network ID, and validator settings for both networks will remain the same.

### Action Recommended

If you run a `rippled` server that is connected to the Testnet or Devnet, after the reset you should delete your database data and restart the server. Database files and folders are defined in your config file in the `[database_path]` and `[node_db]` stanzas. If you use the default config, you can run the following commands:

```sh
rm -r /var/lib/rippled/db/*

systemctl restart rippled.service
```

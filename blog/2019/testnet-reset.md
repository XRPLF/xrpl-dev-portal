---
labels:
    - Advisories
date: 2019-08-30
category: 2019
theme:
    markdown:
        editPage:
            hide: true
---
# XRP Testnet Has Been Reset

On 2019-08-27 at approximately 1:00 UTC (6 PM PDT), Ripple reset their XRP Testnet. This means that all accounts, balances, and settings in the Testnet have been deleted and all contents of the Testnet's decentralized exchange have been erased. However, in the process of resetting the XRP Testnet, a procedural issue caused amendments that were previously enabled to be disabled in the fresh ledger chain. Ripple plans to reset the XRP Testnet again today (2019-08-30) at 4 PM PDT. Starting at this time, the Testnet may be unavailable for a maintenance window lasting up to 4 hours.

{% admonition type="success" name="UPDATE" %}
The second reset occurred as planned and the Testnet became fully available by approximately 7:56 PM PDT. The amendments that are enabled on the Testnet now match the status of amendments on the production Mainnet.
{% /admonition %}

The production XRP Ledger, or Mainnet, is completely unaffected. This also has no effect on other test networks not run by Ripple.

<!-- BREAK -->

## Background

Ripple operates an XRP test network (the XRP Testnet) to help the community test new features and integrations without requiring real XRP on the XRP Ledger Mainnet. Although Ripple has stated publicly the intention to reset the Testnet on a monthly basis, feedback from members of the XRP Ledger ecosystem has been that monthly resets would too disruptive, and in practice, resets of the Testnet have been irregular and infrequent.

Recently use of the Testnet Faucet has increased, causing it to fund over 1 million new accounts per month. On 2019-08-25, Ripple's XRP Testnet Faucet address exhausted its supply of Testnet XRP, rendering it unusable. Like real XRP, the supply of Testnet XRP is limited and most Testnet XRP was being held by addresses whose keys have been discarded. Thus, the only way to add more XRP to the Testnet Faucet is to restart the network from scratch.

In the future, Ripple intends to reset the Testnet approximately every 90 days or as needed. Ripple will make every effort to provide advance notice before resetting the XRP Testnet in the future.

Furthermore, to better accommodate the increased usage, the Testnet Faucet has been reconfigured to distribute 1,000 Testnet XRP at a time to new accounts, instead of 10,000.


## Testnet Status

Currently, the Testnet is available and users can get new accounts and new Testnet XRP from the [Testnet Faucet](https://xrpl.org/xrp-test-net-faucet.html), but new accounts and transactions will be deleted again when the next reset occurs.

If your test app relies on data being present in the Testnet ledger, we recommend building automated testing scripts that repopulate the Testnet with test data after a reset. For example, if your test finds that necessary data is not on the ledger, you can re-create it.

Do not rely on the Testnet ledger's state. The data on it will be deleted when the next reset occurs.

At this time, no amendments are enabled on the Testnet, so features such as [Multi-signing](https://xrpl.org/multi-signing.html), [Escrow](https://xrpl.org/escrow.html), and [Payment Channels](https://xrpl.org/payment-channels.html) are currently unavailable. Following the latest reset, the status of Amendments in the Testnet should exactly match the [current status of the Mainnet](https://xrpl.org/known-amendments.html). Specifically, the Checks amendment will not be re-enabled at this time.

This change does not have any bearing on the future status of the Checks amendment, but is being made so that the Testnet's transaction processing matches the Mainnet as closely as possible.

## Action Recommended

If you run a `rippled` server [connected to the XRP Testnet](https://xrpl.org/connect-your-rippled-to-the-xrp-test-net.html), you should delete your database data and restart your server after the reset occurs. For example:

```sh
# rm -r /var/lib/rippled/db/*

# systemctl restart rippled.service
```

**Warning:** Be sure that you have not put any files you want to keep in the folder before you delete it. It is generally safe to delete all of a `rippled` server's database files, but you should only do this if the configured database folder is not used for anything other than `rippled`'s databases.

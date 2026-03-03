---
category: 2026
date: "2026-02-23"
template: '../../@theme/templates/blogpost'
seo:
    title: Introducing XRP Ledger version 3.1.1 and upcoming Devnet reset
    description: rippled version 3.1.1 is now available. This version disables the Batch and fixBatchInnerSigs amendments. Devnet is also scheduled to reset on Tuesday, March 3, 2026 to prevent validators from becoming amendment blocked.
labels:
    - rippled Release Notes
markdown:
    editPage:
        hide: true
---
# Introducing XRP Ledger version 3.1.1 and Upcoming Devnet Reset

Version 3.1.1 of `rippled`, the reference server implementation of the XRP Ledger protocol, is now available. This release supersedes version 3.1.0, disabling the `Batch` and `fixBatchInnerSigs` amendments due to a severe bug.


## Upcoming Devnet Reset

Devnet is scheduled for a reset on **Tuesday, March 3, 2026**. The `Batch` amendment requires more development and is now set to unsupported in version 3.1.1. To prevent validators that upgrade to this version from becoming amendment blocked, Devnet must be reset.

### Impact

This reset affects Devnet only. Other networks will continue to operate as usual, including XRPL Mainnet, XRPL Testnet, Xahau, and the Hooks Testnet.

The reset will delete all ledger data in Devnet, including all accounts, transactions, balances, settings, offers, AMMs, escrows, and other data. This means all balances will be reset to zero and the block number will start at one again. No changes are anticipated to services such as Devnet APIs, faucets, Explorers, access rights, and wallet integrations; these services usually manage resets without issues.

Any existing accounts or other data will need new test XRP from the faucet and will need to be re-created.

If code relies on specific addresses, a request to the faucet can fund the same address again. However, any AMMs or Vaults that are re-created after the reset will have different pseudo-account addresses. As a reminder, it's best not to use the same addresses or key pairs on Mainnet and any developer networks.


## Action Required

If you run an XRP Ledger server, upgrade to version 3.1.1 as soon as possible to ensure service continuity.

### Add New GPG Key

As a reminder, [Ripple rotated the GPG key](./gpg-key-rotation.md) used to sign `rippled` packages. You must download and trust the new key before upgrading to version 3.1.1.

{% tabs %}
{% tab label="Red Hat / CentOS" %}

```bash
sudo rpm --import https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
rpm -qi gpg-pubkey-ab06faa6 | gpg --show-keys --fingerprint
```

{% /tab %}
{% tab label="Ubuntu / Debian" %}

```bash
sudo install -d -m 0755 /etc/apt/keyrings && \
curl -fsSL https://repos.ripple.com/repos/api/gpg/key/public \
 | gpg --dearmor \
 | sudo tee /etc/apt/keyrings/ripple.gpg > /dev/null
gpg --show-keys --fingerprint /etc/apt/keyrings/ripple.gpg
```

Ensure the `signed-by` path in your Ripple source list refers to the location the key was downloaded. For example, on an Ubuntu 22.04 Jammy installation, `/etc/apt/sources.list.d/ripple.list` would contain:

```
deb [signed-by=/etc/apt/keyrings/ripple.gpg] https://repos.ripple.com/repos/rippled-deb jammy stable
```
{% /tab %}
{% /tabs %}

The output should include an entry for Ripple such as the following:

```
pub   ed25519 2026-02-16 [SC] [expires: 2033-02-14]
      E057 C1CF 72B0 DF1A 4559  E857 7DEE 9236 AB06 FAA6
uid                      TechOps Team at Ripple <techops+rippled@ripple.com>
sub   ed25519 2026-02-16 [S] [expires: 2029-02-15]
```

{% admonition type="danger" name="Warning" %}
Only trust this key if its fingerprint exactly matches: `E057 C1CF 72B0 DF1A 4559  E857 7DEE 9236 AB06 FAA6`.
{% /admonition %}

### Install / Upgrade

On supported platforms, see the [instructions on installing or updating `rippled`](../../docs/infrastructure/installation/index.md).

| Package | SHA-256 |
|:--------|:--------|
| [RPM for Red Hat / CentOS (x86-64)](https://repos.ripple.com/repos/rippled-rpm/stable/rippled-3.1.1-1.el9.x86_64.rpm) | `c6d028db1e2a4da898df68e5a92a893bebf1d167a0539d15ae27435f2155ccb2` |
| [DEB for Ubuntu / Debian (x86-64)](https://repos.ripple.com/repos/rippled-deb/pool/stable/rippled_3.1.1-1_amd64.deb) | `cc30c33012bd83ed793b38738870cf931a96ae106fde60b71685c766da1d22e3` |

For other platforms, please [build from source](https://github.com/XRPLF/rippled/blob/master/BUILD.md). The most recent commit in the git log should be the change setting the version:

```text
commit c5988233d05bedddac28866ed37607f4869855f9
Author: Ed Hennis <ed@ripple.com>
Date:   Mon Feb 23 16:47:09 2026 -0400

    Set version to 3.1.1 (#6410)
```

### Delete Devnet Database

If you run a `rippled` server that is connected to Devnet, after the reset you should delete your database data and restart the server. Database files and folders are defined in your config file in the `[database_path]` and `[node_db]` stanzas. If you use the default config, you can run the following commands:

```sh
rm -r /var/lib/rippled/db/*

systemctl restart rippled.service
```


## Full Changelog

### Amendments

- **Batch** - A bug was discovered in `Batch`, and the amendment was disabled. The fix for this feature will be included in a future release as `BatchV1_1`. ([#6402](https://github.com/XRPLF/rippled/pull/6402))
- **fixBatchInnerSigs** - A bug was discovered in `Batch`, so this amendment was also disabled. This fix will be included in a future release as part of `BatchV1_1`. ([#6402](https://github.com/XRPLF/rippled/pull/6402))

### CI/Build

- CI: Update `prepare-runner` action to fix macOS build environment. ([#6402](https://github.com/XRPLF/rippled/pull/6402))


## Credits

Thanks to Pranamya Keshkamat and Cantina AI for discovering and responsibly disclosing the `Batch` issue.

The following RippleX teams contributed to this release:

- RippleX Engineering
- RippleX Docs
- RippleX Product


## Bug Bounties and Responsible Disclosures

We welcome reviews of the `rippled` code and urge researchers to responsibly disclose any issues they may find.

For more information, see:

- [Ripple's Bug Bounty Program](https://ripple.com/legal/bug-bounty/)
- [rippled Security Policy](https://github.com/XRPLF/rippled/blob/develop/SECURITY.md)

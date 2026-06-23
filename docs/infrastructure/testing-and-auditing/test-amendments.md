---
seo:
    description: You can test proposed amendments before they're enabled on the network.
labels:
  - Core Server
  - Blockchain
---
# Test Amendments

You can test how the `xrpld` server behaves, before amendments are fully enabled on Mainnet, using one of the following approaches:

- **Connect to Devnet:** Devnet runs beta `xrpld` releases and is the public network where new amendments are previewed before reaching Mainnet.
- **Stand-Alone Mode:** Run a single `xrpld` server in offline mode with the amendment forced on. Does not connect to the peer-to-peer network or use consensus.
- **Private Test Network:** Initialize a self-hosted network with multiple validators where you control how amendments activate.

## Connect to Devnet

To test an amendment already enabled on Devnet, connect to it directly without setting up your own validators or local server.

Follow [Connect Your xrpld to a Parallel Network](../configuration/connect-your-xrpld-to-the-xrp-test-net.md), but be sure to skip the `[features]` stanza described in [step 3](../configuration/connect-your-xrpld-to-the-xrp-test-net.md#3-enable-or-disable-features). Devnet has its own amendment state, and forcing features causes your server to diverge from the network.

Once connected, confirm the amendment is active by inspecting `Amendments` via the [ledger_entry method][].

## Stand-Alone Mode

To test locally without setting up validators or connecting to a network, run your server in [stand-alone mode](start-a-new-genesis-ledger-in-stand-alone-mode.md) with the amendment forced on.

{% admonition type="warning" name="Caution" %}This approach uses the `[features]` stanza to force amendments on. Do not use `[features]` while connected to Mainnet, Testnet, or Devnet. Forcing different features than other validators can cause your server to diverge from the network.{% /admonition %}

Two stanzas in `xrpld.cfg` interact with amendments: `[amendments]` records which amendments a server votes to support, while `[features]` forces specific features to be treated as enabled, only on the local server. Add a `[features]` stanza with one amendment short name per line:

{% tabs %}

{% tab label="Example" %}
```
[features]
MultiSign
TrustSetAuth
```
{% /tab %}

{% /tabs %}

To confirm the amendment is active, query the `Amendments` ledger entry with the [ledger_entry method][].

## Private Test Network

To test an amendment under multi-validator consensus on a [private network](run-private-network-with-docker.md), you can either enable it at the genesis ledger or compress the standard two-week voting timer. Enabling skips the activation flow entirely, while compressing the timer lets you exercise it on a shorter schedule.

If your private network uses a Network ID of 1025 or higher, transactions submitted to it must include a matching [`NetworkID`](../../references/protocol/transactions/common-fields.md#networkid-field) field.

### Enable at Genesis

Start each validator with the `--start` flag to enable amendments at the genesis ledger. This skips the two-week voting timer entirely.

```
xrpld --start --net --conf /etc/opt/ripple/xrpld.cfg
```

Once the network is producing ledgers, subsequent restarts don't require `--start`.

{% admonition type="info" name="Note" %}There is an [open issue](https://github.com/XRPLF/rippled/issues/4386) to make new genesis ledgers always start with amendments enabled, removing the need for `--start`.{% /admonition %}

To verify that amendments are active, query the `Amendments` ledger entry with the [ledger_entry method][].

{% admonition type="info" name="Note" %}If a new account comes back with `Sequence: 1`, the `DeletableAccounts` amendment isn't active and enablement failed. With DeletableAccounts enabled, new accounts start at the current ledger sequence number rather than 1. {% /admonition %}

Changing which amendments are enabled requires resetting the network to a new genesis ledger. As a best practice, if other users rely on your test network, communicate on Discord both before and after each reset.

### Compress the Voting Timer

To exercise the amendment voting and activation flow on a quicker schedule, set `[amendment_majority_time]` in each validator's `xrpld.cfg`. This shortens the delay between an amendment reaching majority support and its activation. Do not use it on Mainnet, Testnet, or Devnet.

```
[amendment_majority_time]
30 minutes
```

The format is `<number> <minutes|hours|days|weeks>`. The minimum is 15 minutes due to the flag-ledger interval. Common test-network values are 30 minutes or 48 hours.

Once the network is running, run the following on each validator:

```
xrpld feature <amendment_name> accept
```

You can verify the amendment's voting status with `xrpld feature`.

## See Also

- **Concepts:**
    - [Amendments](../../concepts/networks-and-servers/amendments.md)
    - [Parallel Networks](../../concepts/networks-and-servers/parallel-networks.md)
- **References:**
    - [ledger_entry method][]
    - [`NetworkID` field](../../references/protocol/transactions/common-fields.md#networkid-field)
    - [`xrpld` Commandline Usage](../commandline-usage.md)
- **Tutorials:**
    - [Run a Private Network with Docker](run-private-network-with-docker.md)
    - [Start a New Genesis Ledger in Stand-Alone Mode](start-a-new-genesis-ledger-in-stand-alone-mode.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

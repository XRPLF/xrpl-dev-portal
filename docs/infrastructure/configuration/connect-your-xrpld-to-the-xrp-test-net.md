---
html: connect-your-xrpld-to-the-xrp-test-net.html
parent: configure-xrpld.html
seo:
    description: Connect your xrpld server to the test net to try out new features or test functionality with fake money.
labels:
  - Core Server
  - Blockchain
  - Development
---
# Connect Your xrpld to a Parallel Network

Various [alternative test and development networks](../../concepts/networks-and-servers/parallel-networks.md) exist for developers to test their apps or experiment with features without risking real money. **The funds used on these networks aren't real funds and are intended for testing only.** You can connect your [`xrpld` server](../../concepts/networks-and-servers/index.md) to any of these test networks.

{% admonition type="warning" name="Caution" %}On test networks with new and experimental features, you may need to run a pre-production release of the server to sync with the network. See the [Parallel Networks Page](../../concepts/networks-and-servers/parallel-networks.md) for information on what code version each network needs.{% /admonition %}

## Steps

To connect your `xrpld` server to the XRP Testnet or Devnet, complete these steps. You can also use these steps to switch back to the production Mainnet after being on the Testnet or Devnet.

## 1. Configure your server to connect to the right hub.

Edit your `xrpld.cfg` file.

{% partial file="/docs/_snippets/conf-file-location.md" /%}
<!--{_ }-->

1. Set an `[ips]` stanza with the hub for the network you want to connect to:

    {% tabs %}

    ```{% label="Testnet" %}
    [ips]
    s.altnet.rippletest.net 51235
    ```

    ```{% label="Devnet" %}
    [ips]
    s.devnet.rippletest.net 51235
    ```

    ```{% label="Mainnet" %}
    # No [ips] stanza. Use the default hubs to connect to Mainnet.
    ```

    {% /tabs %}

    Don't skip the `[ips]` stanza for a test network. Without `[ips]` (and without `[ips_fixed]`) the server bootstraps from four built-in hubs, which are Mainnet hubs, so a test network server either gets refused or ends up talking to Mainnet peers. Production operators report test network servers failing to start up usefully without an explicit entry.

2. Comment out the previous `[ips]` stanza, if there is one:

    ```
    # [ips]
    # r.ripple.com 51235
    # sahyadri.isrdc.in 51235
    ```

3. Add a `[network_id]` stanza with the appropriate value:

    {% tabs %}

    ```{% label="Testnet" %}
    [network_id]
    testnet
    ```

    ```{% label="Devnet" %}
    [network_id]
    devnet
    ```

    ```{% label="Mainnet" %}
    [network_id]
    main
    ```

    {% /tabs %}

    For custom networks, everyone who connects to the network should use a value unique to that network. When creating a new network, choose a value above 1024 so that transactions carry a `NetworkID` and can't be replayed from another network; values 1024 and below are reserved for legacy networks.

    {% admonition type="info" name="Note" %}This setting helps your server find peers who are on the same network, but it isn't a hard control on what network your server follows. The UNL / trusted validator settings (in the next step) are what actually define what network the server follows.{% /admonition %}

## 2. Set your trusted validator list.

Edit your `validators.txt` file. This file is located in the same folder as your `xrpld.cfg` file and defines which validators your server trusts not to collude.

1. Uncomment or add the `[validator_list_sites]` and `[validator_list_keys]` stanzas for the network you want to connect to:

    {% tabs %}

    ```{% label="Testnet" %}
    [validator_list_sites]
    https://vl.altnet.rippletest.net

    [validator_list_keys]
    ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860
    ```

    ```{% label="Devnet" %}
    [validator_list_sites]
    https://vl.devnet.rippletest.net

    [validator_list_keys]
    EDBB54B0D9AEE071BB37784AF5A9E7CC49AC7A0EFCE868C54532BCB966B9CFC13B
    ```

    ```{% label="Mainnet" %}
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```

    {% /tabs %}

    {% admonition type="success" name="Tip" %}Preview packages might come with the necessary stanzas pre-configured, but check them just in case.{% /admonition %}

2. Comment out any previous `[validator_list_sites]`, `[validator_list_keys]`, or `[validators]` stanzas.

    For example:

    ```
    # [validator_list_sites]
    # https://vl.ripple.com
    #
    # [validator_list_keys]
    # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

    # Old hard-coded List of Devnet Validators
    # [validators]
    # n9Mo4QVGnMrRN9jhAxdUFxwvyM4aeE1RvCuEGvMYt31hPspb1E2c
    # n9MEwP4LSSikUnhZJNQVQxoMCgoRrGm6GGbG46AumH2KrRrdmr6B
    # n9M1pogKUmueZ2r3E3JnZyM3g6AxkxWPr8Vr3zWtuRLqB7bHETFD
    # n9MX7LbfHvPkFYgGrJmCyLh8Reu38wsnnxA4TKhxGTZBuxRz3w1U
    # n94aw2fof4xxd8g3swN2qJCmooHdGv1ajY8Ae42T77nAQhZeYGdd
    # n9LiE1gpUGws1kFGKCM9rVFNYPVS4QziwkQn281EFXX7TViCp2RC
    # n9Jq9w1R8UrvV1u2SQqGhSXLroeWNmPNc3AVszRXhpUr1fmbLyhS
    ```

## 3. Enable (or Disable) Features

For some test networks using experimental features, you must also forcefully enable the appropriate feature in the config file. For other networks, you shouldn't use the `[features]` stanza. Add or modify the `[features]` stanza of your config file as follows:

{% tabs %}

{% tab label="Testnet" %}
```
# [features]
# Delete or comment out. Don't force-enable features on Testnet.
```
{% /tab %}

{% tab label="Devnet" %}
```
# [features]
# Delete or comment out. Don't force-enable features on Devnet.
```
{% /tab %}

{% tab label="Mainnet" %}
```
# [features]
# Delete or comment out. Don't force-enable features on Mainnet.
```
{% /tab %}

{% /tabs %}

{% admonition type="danger" name="Warning" %}Don't use the `[features]` stanza when connecting to Mainnet or Testnet. Forcefully enabling different features than the rest of the network could cause your server to diverge from the network.{% /admonition %}

## 4. Restart the server.

```sh
$ sudo systemctl restart xrpld
```

## 5. Verify that your server syncs.

It takes about 5 to 15 minutes to sync to the network after a restart. Finding more than a handful of peers can take longer on a test network (see [Monitoring a test network server](#monitoring-a-test-network-server) below). After your server is synced, the [server_info method][] shows a `validated_ledger` object based on the network you are connected to.

To confirm that your `xrpld` is connected to the right network, compare the results from your server to [a public server][public servers] on the Testnet or Devnet. If `server_state` stays at `connected` or `syncing` and `validated_ledger` never appears, check that `[ips]`, `[network_id]`, and your `[validator_list_sites]` and `[validator_list_keys]` all name the same network. The `seq` field of the `validated_ledger` object should be the same on both servers (possibly off by one or two, if it changed as you were checking).

The following example shows how to check your server's latest validated ledger from the commandline:

```sh
xrpld server_info | grep seq
```

You can use [server_info in the WebSocket Tool](/resources/dev-tools/websocket-api-tool#server_info) to look up the latest ledger index (`seq`) on the intended network.

## Monitoring a test network server

Test networks are much smaller than Mainnet, and monitoring tuned for Mainnet misreads them:

- **Expect low peer counts and slow discovery.** A healthy Testnet server may hold only a handful of peers, and discovering even eight can take over half an hour. The `/health` endpoint is served on your server's peer port (for example `https://host:2459/health` with the packaged config) and its thresholds are hardcoded. With 7 peers or fewer it returns HTTP 503 (a warning), and with no peers it returns HTTP 500 (critical); a server that is still syncing returns 503 even with enough peers. One production fleet's automated health checks flagged slow-discovering Testnet servers as unhealthy and restarted them, which wiped the peers they had found and trapped them in a bootstrap loop; the fix was demoting the peer-count check to a warning, after delaying health checks by up to an hour proved sometimes insufficient. Treat peer count as informational on test networks; gate on ledger age and advancement instead.
- **Don't let automation restart a discovering server.** The restart loop above is the general lesson: any orchestrator that kills servers failing a health check needs a generous startup grace for this software, on any network.
- Everything else transfers: ledger age, sync state, and disk still mean what they mean on Mainnet, though ledger-age alert thresholds may need adjusting on a quiet test network, where longer gaps between ledgers trip the default warning while the server is healthy; see [Health Check Interventions](../troubleshooting/health-check-interventions.md#special-cases).

## See Also

- **Tools:**
    - [XRP Faucets](/resources/dev-tools/xrp-faucets)
    - [WebSocket API Tool](/resources/dev-tools/websocket-api-tool) - Select 'Testnet Public Server' or 'Devnet Public Server' in the connection options.
- **Concepts:**
    - [Parallel Networks](../../concepts/networks-and-servers/parallel-networks.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Run xrpld as a Validator](server-modes/validator.md)
    - [Test `xrpld` Offline in Stand-Alone Mode](../testing-and-auditing/index.md)
    - [Troubleshooting `xrpld`](../troubleshooting/index.md)
- **References:**
    - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

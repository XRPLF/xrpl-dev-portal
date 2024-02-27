---
html: connect-your-rippled-to-the-xrp-test-net.html
parent: configure-rippled.html
seo:
    description: Connect your rippled server to the test net to try out new features or test functionality with fake money.
labels:
  - Core Server
  - Blockchain
  - Development
---
# Connect Your rippled to a Parallel Network

Various [alternative test and development networks](../../concepts/networks-and-servers/parallel-networks.md) exist for developers to test their apps or experiment with features without risking real money. **The funds used on these networks are not real funds and are intended for testing only.** You can connect your [`rippled` server](../../concepts/networks-and-servers/index.md) to any of these test networks.

**Caution:** On test networks with new and experimental features, you may need to run a pre-production release of the server to sync with the network. See the [Parallel Networks Page](../../concepts/networks-and-servers/parallel-networks.md) for information on what code version each network needs.

## Steps

To connect your `rippled` server to the XRP Testnet or Devnet, complete these steps. You can also use these steps to switch back to the production Mainnet after being on the Testnet or Devnet.

## 1. Configure your server to connect to the right hub.

Edit your `rippled.cfg` file.

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

    ```{% label="Sidechain-Devnet" %}
    [ips]
    sidechain-net2.devnet.rippletest.net 51235
    ```

    {% /tabs %}

2. Comment out the previous `[ips]` stanza, if there is one:

    ```
    # [ips]
    # r.ripple.com 51235
    # zaphod.alloy.ee 51235
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

    ```{% label="Sidechain-Devnet" %}
    [network_id]
    262
    ```

    {% /tabs %}

    For custom networks, everyone who connects to the network should use a value unique to that network. When creating a new network, choose a network ID at random from the integers 11 to 4,294,967,295.

    **Note:** This setting helps your server find peers who are on the same network, but it is not a hard control on what network your server follows. The UNL / trusted validator settings (in the next step) are what actually define what network the server follows.

## 2. Set your trusted validator list.

Edit your `validators.txt` file. This file is located in the same folder as your `rippled.cfg` file and defines which validators your server trusts not to collude.

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
    EDDF2F53DFEC79358F7BE76BC884AC31048CFF6E2A00C628EAE06DB7750A247B12
    ```

    ```{% label="Mainnet" %}
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```

    ```{% label="Sidechain-Devnet" %}
    [validator_list_sites]
    https://vlsidechain-net2.devnet.rippletest.net

    [validator_list_keys]
    EDA5504C7133743FADA46342229B4E9CBBE1CF9BCA19D16633574F7CBB72F79569
    ```

    {% /tabs %}

    **Tip:** Preview packages might come with the necessary stanzas pre-configured, but check them just in case.

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

For some test networks using experimental features, you must also forcefully enable the appropriate feature in the config file. For other networks, you should not use the `[features]` stanza. Add or modify the `[features]` stanza of your config file as follows:

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

{% tab label="Sidechain-Devnet" %}
```
[features]
XChainBridge
```
{% /tab %}

{% /tabs %}

**Warning:** Do not use the `[features]` stanza when connecting to Mainnet or Testnet. Forcefully enabling different features than the rest of the network could cause your server to diverge from the network.

## 4. Restart the server.

```sh
$ sudo systemctl restart rippled
```

## 5. Verify that your server syncs.

It takes about 5 to 15 minutes to sync to the network after a restart. After your server is synced, the [server_info method][] shows a `validated_ledger` object based on the network you are connected to.

To confirm that your `rippled` is connected to the right network, compare the results from your server to [a public server][public servers] on the Testnet or Devnet. The `seq` field of the `validated_ledger` object should be the same on both servers (possibly off by one or two, if it changed as you were checking).

The following example shows how to check your server's latest validated ledger from the commandline:

```sh
rippled server_info | grep seq
```

You can use [server_info in the WebSocket Tool](/resources/dev-tools/websocket-api-tool#server_info) to look up the latest ledger index (`seq`) on the intended network.



## See Also

- **Tools:**
    - [XRP Faucets](/resources/dev-tools/xrp-faucets)
    - [WebSocket API Tool](/resources/dev-tools/websocket-api-tool) - Select 'Testnet Public Server' or 'Devnet Public Server' in the connection options.
- **Concepts:**
    - [Parallel Networks](../../concepts/networks-and-servers/parallel-networks.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Run rippled as a Validator](server-modes/run-rippled-as-a-validator.md)
    - [Test `rippled` Offline in Stand-Alone Mode](../testing-and-auditing/index.md)
    - [Troubleshooting `rippled`](../troubleshooting/index.md)
- **References:**
    - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
html: connect-your-rippled-to-the-xrp-test-net.html
parent: configure-rippled.html
blurb: Connect your rippled server to the test net to try out new features or test functionality with fake money.
labels:
  - Core Server
  - Blockchain
  - Development
---
# Connect Your rippled to a Parallel Network

Various [alternative test and development networks](parallel-networks.html) exist for developers to test their apps or experiment with features without risking real money. **The funds used on these networks are not real funds and are intended for testing only.** You can connect your [`rippled` server](xrpl-servers.html) to any of these test networks.

**Caution:** On test networks with new and experimental features, you may need to run a pre-production release of the server to sync with the network. See the [Parallel Networks Page](parallel-networks.html) for information on what code version each network needs.

## Steps

To connect your `rippled` server to the XRP Testnet or Devnet, complete these steps. You can also use these steps to switch back to the production Mainnet after being on the Testnet or Devnet.

## 1. Configure your server to connect to the right hub.

Edit your `rippled.cfg` file.

{% include '_snippets/conf-file-location.md' %}
<!--{_ }-->

1. Set an `[ips]` stanza with the hub for the network you want to connect to:

    <!-- MULTICODE_BLOCK_START -->

    *Testnet*

        [ips]
        s.altnet.rippletest.net 51235

    *Devnet*

        [ips]
        s.devnet.rippletest.net 51235

    *Mainnet*

        # No [ips] stanza. Use the default hubs to connect to Mainnet.

    *NFT-Devnet*

        [ips]
        xls20-sandbox.rippletest.net 51235

    <!-- MULTICODE_BLOCK_END -->

2. Comment out the previous `[ips]` stanza, if there is one:

        # [ips]
        # r.ripple.com 51235
        # zaphod.alloy.ee 51235
        # sahyadri.isrdc.in 51235

3. Add a `[network_id]` stanza with the appropriate value:

    <!-- MULTICODE_BLOCK_START -->

    *Testnet*

        [network_id]
        testnet

    *Devnet*

        [network_id]
        devnet

    *Mainnet*

        [network_id]
        main

    *NFT-Devnet*

        [network_id]
        20

    <!-- MULTICODE_BLOCK_END -->

    For sidechains and custom networks, everyone who connects to the network should use a value unique to that network. When creating a new network, choose a network ID at random from the integers 11 to 4,294,967,295.

    **Note:** This setting helps your server find peers who are on the same network, but it is not a hard control on what network your server follows. The UNL / trusted validator settings (in the next step) are what actually define what network the server follows.

## 2. Set your trusted validator list.

Edit your `validators.txt` file. This file is located in the same folder as your `rippled.cfg` file and defines which validators your server trusts not to collude.

1. Uncomment or add the `[validator_list_sites]` and `[validator_list_keys]` stanzas for the network you want to connect to:

    <!-- MULTICODE_BLOCK_START -->

    *Testnet*

        [validator_list_sites]
        https://vl.altnet.rippletest.net

        [validator_list_keys]
        ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860

    *Devnet*

        [validator_list_sites]
        https://vl.devnet.rippletest.net

        [validator_list_keys]
        EDDF2F53DFEC79358F7BE76BC884AC31048CFF6E2A00C628EAE06DB7750A247B12


    *Mainnet*

        [validator_list_sites]
        https://vl.ripple.com

        [validator_list_keys]
        ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

    *NFT-Devnet*

        [validator_list_sites]
        http://nftvalidators.s3.us-west-2.amazonaws.com/index.json

        [validator_list_keys]
        ED8E43A943A174190BA2FAE91F44AC6E2D1D8202EFDCC2EA3DBB39814576D690F7

    <!-- MULTICODE_BLOCK_END -->

    **Tip:** The packages for the NFT preview should already contain the necessary stanzas, but check them just in case.

1. Comment out any previous `[validator_list_sites]`, `[validator_list_keys]`, or `[validators]` stanzas.

    For example:

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

## 3. (NFT-Devnet Only) Enable Features

To connect to the NFT-Devnet, you must also forcefully enable the NFT feature, `XLS20`. Add or modify the `[features]` stanza of your config file as follows:

```
[features]
NonFungibleTokensV1
```

**Warning:** Do not use the `[features]` stanza when connecting to Mainnet or Testnet. Forcefully enabling different features than the rest of the network could cause your server to diverge from the network.

## 4. Restart the server.

```sh
$ sudo systemctl restart rippled
```

## 5. Verify that your server syncs.

It takes about 5 to 15 minutes to sync to the network after a restart. After your server is synced, the [server_info method][] shows the a `validated_ledger` object based on the network you are connected to.

To verify that your `rippled` is connected to the XRP Testnet or Devnet, compare the results from your server to [a public server][public servers] on the Testnet or Devnet. The `seq` field of the `validated_ledger` object should be the same on both servers (possibly off by one or two, if it changed as you were checking).

The following example shows how to check the latest validated ledger from the commandline:

<!-- MULTICODE_BLOCK_START -->

*Local Server*

```sh
rippled server_info | grep seq
```

*Testnet*

```sh
# s.altnet.rippletest.net
rippled --rpc_ip 35.158.96.209:51234 server_info | grep seq
```

*Devnet*

```sh
# s.devnet.rippletest.net
rippled --rpc_ip 34.83.125.234:51234 server_info | grep seq
```


*Mainnet*

```sh
# s1.ripple.com
rippled --rpc_ip 34.201.59.230:51234 server_info | grep seq
```

*NFT-Devnet*

```sh
# xls20-sandbox.rippletest.net
rippled --rpc_ip 34.211.220.150:51234 server_info | grep seq
```

<!-- MULTICODE_BLOCK_END -->

**Note:** The IP addresses in these examples are for public servers, and may change periodically. If you get no response, look up the IP address of a [public server][public servers], for example using the `dig` command.



## See Also

- **Tools:**
    - [XRP Faucets](xrp-testnet-faucet.html)
    - [WebSocket API Tool](websocket-api-tool.html) - Select 'Testnet Public Server' or 'Devnet Public Server' in the connection options.
- **Concepts:**
    - [Parallel Networks](parallel-networks.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Run rippled as a Validator](run-rippled-as-a-validator.html)
    - [Test `rippled` Offline in Stand-Alone Mode](use-stand-alone-mode.html)
    - [Troubleshooting `rippled`](troubleshoot-the-rippled-server.html)
- **References:**
    - [server_info method][]



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

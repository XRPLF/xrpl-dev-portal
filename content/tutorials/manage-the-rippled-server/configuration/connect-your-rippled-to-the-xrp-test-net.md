# Connect Your rippled to an XRPL Altnet

Ripple has created [alternative test and development networks](parallel-networks.html) for developers to test their apps on the latest non-production version of the XRP Ledger (Testnet) or to test and experiment with features on the latest beta version (Devnet). **The funds used on these networks are not real funds and are intended for testing only.** You can connect your [`rippled` server](the-rippled-server.html) to either the Testnet or Devnet.

**Note:** The XRP Testnet and Devnet ledger and balances are reset on a regular basis.

To connect your `rippled` server to the XRP Testnet or Devnet, set the following configurations:

1. In your `rippled.cfg` file:

    a. To connect to the [Testnet](xrp-testnet-faucet.html), uncomment the following section and add:

        [ips]
        s.altnet.rippletest.net 51235

    b. To connect to the [Devnet](xrp-testnet-faucet.html), uncomment the following section and add:

        [ips]
        s.devnet.rippletest.net 51235

    c. Comment out the following section, as follows:

        # [ips]
        # r.ripple.com 51235



2. In your `validators.txt` file:

    2a. Changes to connect to the altnet

        a. Uncomment the following sections, as follows to connect to the altnet:

            [validator_list_sites]
            https://vl.altnet.rippletest.net

            [validator_list_keys]
            ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860

        b. Comment out the following sections, as follows:

            # [validator_list_sites]
            # https://vl.ripple.com
            #
            # [validator_list_keys]
            # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

    2b. Changes to connect to the devnet

        a. Comment out the following sections as follows:

            # [validator_list_sites]
            # https://vl.altnet.rippletest.net

            # [validator_list_keys]
            # ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860        

            # [validator_list_sites]
            # https://vl.ripple.com
            #
            # [validator_list_keys]
            # ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734

        b. Add the following trusted validators to the validator.txt file:

            # Hard-coded List of Devnet Validators
            [validators]
            n9Mo4QVGnMrRN9jhAxdUFxwvyM4aeE1RvCuEGvMYt31hPspb1E2c
            n9MEwP4LSSikUnhZJNQVQxoMCgoRrGm6GGbG46AumH2KrRrdmr6B
            n9M1pogKUmueZ2r3E3JnZyM3g6AxkxWPr8Vr3zWtuRLqB7bHETFD
            n9MX7LbfHvPkFYgGrJmCyLh8Reu38wsnnxA4TKhxGTZBuxRz3w1U
            n94aw2fof4xxd8g3swN2qJCmooHdGv1ajY8Ae42T77nAQhZeYGdd
            n9LiE1gpUGws1kFGKCM9rVFNYPVS4QziwkQn281EFXX7TViCp2RC
            n9Jq9w1R8UrvV1u2SQqGhSXLroeWNmPNc3AVszRXhpUr1fmbLyhS


3. Restart `rippled`.

4. To verify that your `rippled` is connected to the XRP Testnet or Devnet, use the [server_info method][] on your server and compare it to the results from a public server on the Testnet or Devnet. The `seq` field of the `validated_ledger` object should be the same on both servers (possibly off by one or two, if it changed as you were checking).

    The following command checks the latest validated ledger of a Testnet server at `s.altnet.rippletest.net`:

        $ ./rippled --rpc_ip 34.210.87.206:51234 server_info | grep seq

    The following command checks the latest validated ledger of a Devnet server at `s.devnet.rippletest.net`:

        $ ./rippled --rpc_ip 34.83.125.234:51234 server_info | grep seq

    The following command checks your local `rippled`'s latest validated ledger index:

        $ ./rippled server_info | grep seq


## See Also

- **Tools:**
    - [XRP Faucets](xrp-testnet-faucet.html)
    - [WebSocket API Tool](websocket-api-tool.html) - Select 'Testnet Public Server' in the connection options.
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

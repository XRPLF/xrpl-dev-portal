# Connect Your rippled to the XRP Test Net

Ripple has created the [XRP Test Network](https://ripple.com/build/xrp-test-net/) to provide a testing platform for the XRP Ledger. XRP Test Net funds are not real funds and are intended for testing only. You can connect your `rippled` server to the XRP Test Net to test out and understand `rippled` functionality before connecting to the production XRP Ledger Network. You can also use the XRP Test Net to verify that your own code interacts correctly with `rippled`.

**Note:** The XRP Test Net ledger and balances are reset on a regular basis.

To connect your `rippled` server to the XRP Test Net, set the following configurations:

1. In your `rippled.cfg` file:

    a. Uncomment the following section, as follows:

        [ips]
        r.altnet.rippletest.net 51235

    b. Comment out the following section, as follows:

        # [ips]
        # r.ripple.com 51235

2. In your `validators.txt` file:

    a. Uncomment the following sections, as follows:

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

3. Restart `rippled`.

4. To verify that your `rippled` is connected to the XRP Test Net, use the [server_info method][] on your server and compare it to the results from a public server on the Test Net. The `seq` field of the `validated_ledger` object should be the same on both servers (possibly off by one or two, if it changed as you were checking).

    The following command checks the latest validated ledger of a Test Net server at `s.altnet.rippletest.net`:

        $ ./rippled --rpc_ip 34.210.87.206:51234 server_info | grep seq

    The following command checks your local `rippled`'s latest validated ledger sequence:

        $ ./rippled server_info | grep seq



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

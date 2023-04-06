---
html: run-rippled-as-a-validator.html
parent: configure-rippled.html
blurb: Have your server vote on the consensus ledger.
labels:
  - Core Server
  - Blockchain
top_nav_grouping: Popular Pages
top_nav_name: Join UNL
---
# Run rippled as a Validator

A [`rippled` server](xrpl-servers.html) running in [validator mode](rippled-server-modes.html) does everything a stock server does:

- Connects to a [network of peers](consensus-network.html)

- Relays cryptographically signed [transactions](transaction-basics.html)

- Maintains a local copy of the complete shared global [ledger](ledgers.html)

What makes a validator _different_ is that it also issues validation messages, which are sets of candidate transactions for evaluation by the XRP Ledger network during the [consensus process](consensus-principles-and-rules.html#how-consensus-works).

Issuing validation messages does not automatically give your validator a say in the consensus process, so the system is not vulnerable to a [Sybil attack](https://en.wikipedia.org/wiki/Sybil_attack). Other servers ignore your validation messages unless they add your validator to their Unique Node List (UNL). If your validator is included in a UNL, it is a _trusted_ validator and its proposals are considered in the consensus process by the servers that trust it.

Even if your validator isn't a _trusted_ validator, it stills plays an important role in the overall health of the network. These validators help set the standard that trusted validators are measured against. For example, if a trusted validator is disagreeing with a lot of these validators that aren't listed in UNLs, that might indicate a problem.

**Warning:** Validators should not be accessible to the public. Do not allow public WebSocket access to your validator server or any other form of public access.



## 1. Understand the traits of a good validator

Strive to have your validator embody the following properties. Being a good validator helps `rippled` server operators and validator list publishers (such as https://vl.ripple.com and https://vl.xrplf.org) trust your validator before adding it to their UNLs.

- **Available**

    A good validator is always running and submitting validation votes for every proposed ledger. Strive for 100% uptime.

- **In agreement**

    A good validator's votes match the outcome of the consensus process as often as possible. To do otherwise could indicate that your validator's software is outdated, buggy, or intentionally biased. Always run the [latest `rippled` release](https://github.com/XRPLF/rippled/tree/release) without modifications. [Watch `rippled` releases](https://github.com/XRPLF/rippled/releases) and subscribe to the [Google Group](https://groups.google.com/g/ripple-server) to be notified of new releases.

- **Issuing prompt votes**

    A good validator's votes arrive quickly and not after a consensus round has already finished. To keep your votes on time, make sure your validator meets the recommended [system requirements](system-requirements.html), which include a fast internet connection.

    It is possible to submit new transactions and query data using a validator, but heavy loads of API queries may make the validator less reliable at keeping up with consensus. If your API needs are light enough, then you can use a server for both purposes. Ideally, a validator should be dedicated to participating in consensus.

- **Identified**

    A good validator has a clearly identified owner. Providing [domain verification](#6-provide-domain-verification) is a good start. Ideally, XRP Ledger network UNLs include validators run by different owners in multiple legal jurisdictions and geographic areas. This reduces the chance that any localized events could interfere with the impartial operations of trusted validators. <!-- STYLE_OVERRIDE: clearly -->

It is strongly recommended that operators use the list providers that are present in this [example file](https://github.com/XRPLF/rippled/blob/develop/cfg/validators-example.txt).



## 2. Install a `rippled` server

For more information, see [Install `rippled`](install-rippled.html).



## 3. Enable validation on your `rippled` server

Enabling validation on your `rippled` server means providing a validator token in your server's `rippled.cfg` file. You can use the `validator-keys` tool (included in `rippled` packages) to securely generate and manage your validator keys and tokens.

In a secure location **not** on your validator:

1. Manually build and run the `validator-keys` tool, if you don't already have it installed via a `rippled` RPM.

    For information about manually building and running the `validator-keys` tool, see [validator-keys-tool](https://github.com/ripple/validator-keys-tool).

2. Generate a validator key pair using the `create_keys` command.

        $ validator-keys create_keys

      Sample output on Ubuntu:

        Validator keys stored in /home/my-user/.ripple/validator-keys.json

        This file should be stored securely and not shared.

      Sample output on macOS:

        Validator keys stored in /Users/my-user/.ripple/validator-keys.json

        This file should be stored securely and not shared.

      **Warning:** Store the generated `validator-keys.json` key file in a secure, offline, and recoverable location, such as an encrypted USB flash drive. Do not store keys on the validator where you intend to use the keys. If your `secret_key` is compromised, [revoke the key](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation) immediately. Do not modify the contents of `validator-keys.json`, except to update the backup after generating a new token. If you generate more than one token from the same backup without updating, the network ignores the later tokens because they use the same `token_sequence` number.

      For more information about the `validator-keys` tool and the key pairs it generates, see the [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md).

3. Generate a validator token using the `create_token` command.

        $ validator-keys create_token --keyfile /PATH/TO/YOUR/validator-keys.json

    Sample output:

        Update rippled.cfg file with these values:

        # validator public key: nHUtNnLVx7odrz5dnfb2xpIgbEeJPbzJWfdicSkGyVw1eE5GpjQr

        [validator_token]
        eyJ2YWxpZGF0aW9uX3NlY3J|dF9rZXkiOiI5ZWQ0NWY4NjYyNDFjYzE4YTI3NDdiNT
        QzODdjMDYyNTkwNzk3MmY0ZTcxOTAyMzFmYWE5Mzc0NTdmYT|kYWY2IiwibWFuaWZl
        c3QiOiJKQUFBQUFGeEllMUZ0d21pbXZHdEgyaUNjTUpxQzlnVkZLaWxHZncxL3ZDeE
        hYWExwbGMyR25NaEFrRTFhZ3FYeEJ3RHdEYklENk9NU1l1TTBGREFscEFnTms4U0tG
        bjdNTzJmZGtjd1JRSWhBT25ndTlzQUtxWFlvdUorbDJWMFcrc0FPa1ZCK1pSUzZQU2
        hsSkFmVXNYZkFpQnNWSkdlc2FhZE9KYy9hQVpva1MxdnltR21WcmxIUEtXWDNZeXd1
        NmluOEhBU1FLUHVnQkQ2N2tNYVJGR3ZtcEFUSGxHS0pkdkRGbFdQWXk1QXFEZWRGdj
        VUSmEydzBpMjFlcTNNWXl3TFZKWm5GT3I3QzBrdzJBaVR6U0NqSXpkaXRROD0ifQ==

On your validator:

1. Add `[validator_token]` and its value to your validator's `rippled.cfg` file.

    If you previously configured your validator without the `validator-keys` tool, delete `[validation_seed]` and its value from your `rippled.cfg` file. This changes your validator public key.

2. Restart `rippled`.

        $ sudo systemctl restart rippled.service

3. Use the `server_info` command to get information about your validator to verify that it is running as a validator.

        $ rippled server_info

      - The `pubkey_validator` value in the response should match the `public_key` in the `validator-keys.json` file that you generated for use with your validator.

      - The `server_state` value should be _**proposing**_.

**Security Tip:** Change the permissions on your `rippled.cfg` file to be more restrictive. On Linux it is recommended to be `0600`. You can do this with `chmod 0600 rippled.cfg`

## 4. Connect to the network

This section describes three different configurations you can use to connect your validator to the XRP Ledger network. Use the configuration that best suits your use case.

- [Discovered peers](#connect-using-discovered-peers): Connect to any servers in the peer-to-peer network.

- [Proxies](#connect-using-proxies): Run stock `rippled` servers as proxies between your validator and the rest of the peer-to-peer network.

- [Public hubs](#connect-using-public-hubs): Connect only to specific public servers with a high reputation.

For a comparison of these approaches, see [Pros and Cons of Peering Configurations](peer-protocol.html#pros-and-cons-of-peering-configurations).


### Connect using discovered peers

This configuration connects your validator to the XRP Ledger network using [discovered peers](peer-protocol.html#peer-discovery). This is the default behavior for `rippled` servers.

_**To connect your validator to the XRP Ledger network using discovered peers,**_ omit the `[peer_private]` stanza or set it to `0` in your validator's `rippled.cfg` file. The [example `rippled.cfg` file](https://github.com/ripple/rippled/blob/develop/cfg/rippled-example.cfg) is delivered with this configuration.


### Connect using proxies

This configuration connects your validator to the network through stock `rippled` servers that you run yourself. These proxy servers sit between your validator and inbound and outbound network traffic.

_**To connect your validator to the XRP Ledger network using proxies:**_

1. Set up stock `rippled` servers. For more information, see [Install rippled](install-rippled.html).

2. Configure your validator and stock `rippled` servers to run in a [cluster](cluster-rippled-servers.html).

3. In your validator's `rippled.cfg` file, set `[peer_private]` to `1`. This prevents your validator's IP address from being forwarded. For more information, see [Private Peers](peer-protocol.html#private-peers). It also prevents your validator from connecting to servers other than those defined in the `[ips_fixed]` stanza you defined to run your validator in a cluster.

    **Warning:** Be sure that you don't publish your validator's IP address in other ways.

4. Configure your validator host machine's firewall to allow the following traffic only:

    - Inbound traffic: Only from IP addresses of the stock `rippled` servers in the cluster you configured.

    - Outbound traffic: Only to the IP addresses of the stock `rippled` servers in the cluster you configured and to your UNL list providers through port 443.

5. Restart `rippled`.

        $ sudo systemctl restart rippled.service

6. Use the [Peer Crawler](peer-crawler.html) endpoint on one of your stock `rippled` servers. The response should not include your validator. This verifies that your validator's `[peer_private]` configuration is working. One of the effects of enabling `[peer_private]` on your validator is that your validator's peers do not include it in their Peer Crawler results.

        $ curl --insecure https://STOCK_SERVER_IP_ADDRESS_HERE:51235/crawl | python3 -m json.tool

<!-- { TODO: Future: add a recommended network architecture diagram to represent the proxy, clustering, and firewall setup: https://ripplelabs.atlassian.net/browse/DOC-2046 }-->


### Connect using public hubs

This configuration connects your validator to the network using three [public hubs](rippled-server-modes.html#public-hubs). This configuration is similar to [connecting using proxies you run yourself](#connect-using-proxies), but instead you connect through public hubs.

_**To connect your validator to the network using public hubs:**_

1. In your validator's `rippled.cfg` file, include the following `[ips_fixed]` stanza. The three values, `r.ripple.com 51235`, `zaphod.alloy.ee 51235` and `sahyadri.isrdc.in 51235`, are default public hubs. This stanza tells `rippled` to always attempt to maintain peer connections with these public hubs.

        [ips_fixed]
        r.ripple.com 51235
        zaphod.alloy.ee 51235
        sahyadri.isrdc.in 51235

    **Caution:** This configuration connects your validator to the network using default public hubs. Because these are the _default_ public hubs, they may sometimes be too busy to provide your validator with a connection to the network. To help avoid this issue, connect to more public hubs and, even better, connect to non-default public hubs.

    You can include the IP addresses of other `rippled` servers here, but _**only**_ if you can expect them to:

      - Relay messages without censoring.
      - Stay online consistently.
      - Not DDoS you.
      - Not try to crash your server.
      - Not publish your IP address to strangers.

2. Also in your validator's `rippled.cfg` file, include the following `[peer_private]` stanza and set it to `1`. This instructs your validator’s peers not to broadcast your validator’s IP address. This setting also instructs your validator to connect to only the peers configured in your `[ips_fixed]` stanza. This ensures that your validator connects to and shares its IP with only peer `rippled` servers you know and trust.

        [peer_private]
        1

    **Warning:** Be sure that you don't publish your validator's IP address in other ways.

    With `[peer_private]` enabled, `rippled` ignores any connections suggested by the `[ips]` stanza. If you need to connect to an IP currently in your `[ips]` stanza, put it in the `[ips_fixed]` stanza instead, but _**only**_ if you can expect them to behave responsibly as described in step 1.

3. Restart `rippled`.

        $ sudo systemctl restart rippled.service



## 5. Verify your network connection

Here are some methods you can use to verify that your validator has a healthy connection to the XRP Ledger network:

- Use the [`peers`](peers.html) command to return a list of all `rippled` servers currently connected to your validator. If the `peers` array is `null`, you don’t have a healthy connection to the network. If you've set up your validator using the instructions in this document, the `peers` array should include the same number of objects as the number of peers defined in your `[ips_fixed]` stanza.

    If you listed a public hub in your `[ips_fixed]` stanza and it is busy, it may reject your validator's connection. In this case, you may end up with fewer connections than configured in your `[ips_fixed]` stanza. Your validator retries the connection if it's initially rejected.

    If you are having trouble maintaining a reliable and safe connection to the network and haven't set up connections using public hubs or proxies, see [4. Connect to the network](#4-connect-to-the-network). Using one of the methods described in the section may help your validator remain healthily connected to the network.

- Use the [`server_info`](server_info.html) command to return some basic information about your validator. The `server_state` should be set to `proposing`. It may also be set to `full` or `validating`, but only for a few minutes before moving into `proposing`.

    If the `server_state` does not spend the majority of its time set to `proposing`, it may be a sign that your validator is unable to fully participate in the XRP Ledger network. For more information about server states and using the `server_info` endpoint to diagnose issues with your validator, see [`rippled` Server States](rippled-server-states.html) and [Get the `server_info`](diagnosing-problems.html#get-the-server_info).

- Use the [`validators`](validators.html) command to return the current list of published and trusted validators used by the validator. Ensure that the `validator_list_expires` value is either `never` or not expired or about to expire.



## 6. Provide domain verification

To help validation list publishers and other participants in the XRP Ledger network understand who runs your validator, provide domain verification for your validator. At a high level, domain verification is a two-way link:

- Use your domain to claim ownership of a validator key.

- Use your validator key to claim ownership of a domain.

Creating this link establishes strong evidence that you own both the validator key and the domain. Providing this evidence is one aspect of [being a good validator](#1-understand-the-traits-of-a-good-validator).

To provide domain verification:

1. Choose a domain name you own that you want to be publicly associated with your validator. As a precaution against DDoS attempts, your domain name should not resolve to the ip address of your validator.

2. Serve an [`xrp-ledger.toml`](xrp-ledger-toml.html) file at your domain, and complete the [domain verification](xrp-ledger-toml.html#domain-verification) steps. Once you have completed these steps, your validator should be visible to the livenet [explorer](https://livenet.xrpl.org/network/validators) or any other site that monitors the validator network and supports decetralized domain verification.

3. Share your validator's public key with the public, especially other `rippled` operators. For example, you can share your validator's public key on your website, on social media, in the [XRPChat community forum](https://www.xrpchat.com/), or in a press release.


## Revoke validator keys

If your validator's master private key is compromised, you must revoke it immediately and permanently.

For information about how to revoke a master key pair you generated for your validator using the `validator-keys` tool, see [Key Revocation](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation).


## See Also

- **Concepts:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Consensus Network](consensus-network.html)
    - [The `rippled` Server](xrpl-servers.html)
- **Tutorials:**
    - [Cluster rippled Servers](cluster-rippled-servers.html)
    - [Install `rippled`](install-rippled.html)
    - [Capacity Planning](capacity-planning.html)
    - [XRP Ledger Businesses](xrp-ledger-businesses.html)
- **References:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info method][]
    - [validator_list_sites method][]
    - [validators method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

# Run rippled as a Validator

A `rippled` server running in validator mode does everything a stock server does:

- Connects to a network of peers

- Relays cryptographically signed transactions

- Maintains a local copy of the complete shared global ledger

What makes a validator _different_ is that it also issues validation messages, which are sets of candidate transactions for evaluation by the XRP Ledger network during the [consensus process](consensus-principles-and-rules.html#how-consensus-works).

It's important to understand that these validation messages are used only by `rippled` servers that explicitly trust your validator by listing it on their Unique Node Lists (UNLs). Servers that do not include your validator in their UNLs ignore your validator's messages in the consensus process. A validator that is not included in any UNL is called an _untrusted_ validator.

For this reason, aside from getting your validator up and running, another key aspect of operating a validator is putting infrastructure in place that builds trust in your validator. Before validation list publishers, such as [https://vl.ripple.com](https://vl.ripple.com), can add your validator to their UNLs, they must first have trust in your validator. Once your validator has been added to a UNL, it is a _trusted_ validator that participates in the consensus process.

To run a `rippled` server as a validator, complete the following tasks:

1. Install a `rippled` server. For more information, see [Install rippled](install-rippled.html).

2. [Enable validation on your `rippled` server](#enable-validation-on-your-rippled-server).

3. [Connect your validator to the network using public hubs](#connect-to-the-network-using-public-hubs).

At this point, you are likely running your `rippled` server as an untrusted validator. It's worth noting that running an untrusted validator can also be helpful to the overall health of the network. Untrusted validators help set the standard that trusted validators are measured against. For example, if a trusted validator is disagreeing with a lot of untrusted validators, that might indicate a problem.

If you want `rippled` server operators and validator list publishers to add your validator to their UNLs, making your _untrusted_ validator a _trusted_ validator, complete the following addtional tasks that help build trust in your validator:

1. [Understand the traits of a good validator](#understand-the-traits-of-a-good-validator).

2. [Connect your validator to the network using proxies](#connect-to-the-network-using-proxies).

3. [Provide domain verification](#provide-domain-verification).



## Enable Validation on Your `rippled` Server

Enabling validation on your `rippled` server means providing a validator token in your server's `rippled.cfg` file. Ripple recommends using the `validator-keys` tool (included in `rippled` RPMs) to securely generate and manage your validator keys and tokens.

In a location **not** on your validator:

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

      **Warning:** Store the generated `validator-keys.json` key file in a secure, offline, and recoverable location, such as an encrypted USB flash drive. Do not modify its contents. In particular, be sure to not store the key file on the validator where you intend to use the keys. If your validator's `secret_key` is compromised, [revoke the key](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation) immediately.

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



## Connect to the Network Using Public Hubs

This section applies to running a validator that you want to remain an untrusted validator. In this case, it may be more efficient for you to use public hubs to connect your validator to the network than to run stock `rippled` servers to use as proxies.

**Note:** If you are running a trusted validator or a validator that you want to become trusted, [connect your validator to the network using proxies](#connect-to-the-network-using-proxies) instead of public hubs.

As a validator operator, one of your key responsibilities is to ensure that your validator has reliable and safe connections to the XRP Ledger network. Instead of connecting to random and potentially malicious peers on the network, you can instruct your validator to connect to the network through one or more public hubs. This setup can help protect your validator from [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) attacks.

A public hub is a `rippled` server that Ripple has assessed to have a track record of embodying the following traits: ***TODO: accurate to say that Ripple assessed this?***

- Good bandwidth.
- Connections to a lot of peers with good reputations. ***TODO: I imagine that the assessment included checking the behavior of the peers? Is it accurate to refer to this as "reputations"?***
- Ability to relay messages reliably.

To connect your validator reliably and safely to the network using public hubs, set the following configurations in your validator’s `rippled.cfg` file.

1. Include the following `[ips_fixed]` stanza. The two values, `r.ripple.com 51235` and `zaphod.alloy.ee 51235`, are public hubs. This stanza tells `rippled` to always attempt to maintain peer connections with these public hubs.

        [ips_fixed]
        r.ripple.com 51235
        zaphod.alloy.ee 51235

    You can include the IP addresses of other `rippled` servers you trust, but _**do not include**_ servers that you don’t trust.

2. Include the following `[peer_private]` stanza and set it to `1`. Enabling this setting instructs your validator’s peers to not broadcast your validator’s IP address. This setting also instructs your validator to connect to only the peers configured in your `[ips_fixed]` stanza. This ensures that your validator connects to and shares its IP with only peer `rippled` servers you know and trust.

    **Warning:** Be sure that you don't publish your validator's IP address in other ways.


        [peer_private]
        1

    With `[peer_private]` enabled, `rippled` ignores any connections suggested by the `[ips]` stanza. If you need to connect to an IP currently in your `[ips]` stanza, put it in the `[ips_fixed]` stanza instead, but _**only if you trust it**_.



## Understand the Traits of a Good Validator

Not every validator is likely to be widely trusted and validator list publishers may require validators to meet stringent criteria before they list them in their UNLs.

Strive to have your validator always embody the following properties. The more of these properties your validator embodies, the more reasons validator list publishers have to include it on their UNLs.

- **Available**

    A good validator is always running and submitting validation votes for every proposed ledger. Strive for 100% uptime.

- **In agreement**

    A good validator's votes match the outcome of the consensus process as often as possible. To do otherwise could indicate that your validator's software is outdated, buggy, or intentionally biased. Always run the [latest `rippled` release](https://github.com/ripple/rippled/tree/master) without modifications. [Watch `rippled` releases](https://github.com/ripple/rippled/releases) to be notified of new releases.

- **Issuing timely votes**

    A good validator's votes arrive quickly and not after a consensus round has already finished. To keep your votes timely, make sure your validator meets the recommended [system requirements](system-requirements.html), which include a fast internet connection.

- **Identified**

    A good validator has a clearly identified owner. Providing [domain verification](#provide-domain-verification) is a good start. Ideally, XRP Ledger network UNLs include validators operated by different owners in multiple legal jurisdictions and geographic areas. This reduces the chance that any localized events could interfere with the impartial operations of trusted validators.

Ripple (the company) publishes a [validator list](https://github.com/ripple/rippled/blob/develop/cfg/validators-example.txt) with a set of recommended validators. Ripple strongly recommends using exactly this list for production servers.



## Connect to the Network Using Proxies

This section applies to a trusted validator or a validator that you want to become trusted. In this case, Ripple recommends that you run stock `rippled` servers to use as proxies to connect your validator to the network.

**Note:** If you are running a validator that you want to remain an untrusted validator, it may be more efficient for you to [connect to the network using public hubs](#connect-to-the-network-using-public-hubs).

As a validator operator, one of your key responsibilities is to ensure that your validator has reliable and safe connections to the XRP Ledger network. Instead of connecting to random and potentially malicious peers on the network, you can set up one or more stock `rippled` servers as proxies between your validator and inbound and outbound traffic. This setup can help protect your validator from [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) attacks.

**Note:** While these servers are acting as proxies, they are not web proxies for HTTP(S) traffic.

<!-- { TODO: Future: add a recommended network architecture diagram to represent the proxy, clustering, and firewall setup: https://ripplelabs.atlassian.net/browse/DOC-2046 }-->

1. [Enable validation](#enable-validation-on-your-rippled-server) on your `rippled` server.

2. Set up stock `rippled` servers. For more information, see [Install rippled](install-rippled.html).

3. Configure your validator and stock `rippled` servers to run in a [cluster](cluster-rippled-servers.html).

4. In your validator's `rippled.cfg` file:

    1. Copy the `[ips_fixed]` IP address list you defined in the previous cluster configuration step and paste it under `[ips]`. ***TODO: I think this step is no longer required, correct? As long as you have your proxy servers in [ips_fixed] and [peer_private] enabled, you don't need [ips] set in the validator in the cluster, correct?***

        For this purpose, the `[ips_fixed]` and `[ips]` values must be identical and contain only the IP addresses and ports of the stock `rippled` servers you clustered with your validator. This ensures that your validator connects to only the stock `rippled` servers that you control.

    2. Set `[peer_private]` to `1` to prevent your validator's IP address from being forwarded. For more information, see [Private Peers](peer-protocol.html#private-peers).

        **Warning:** Be sure that you don't publish your validator's IP address in other ways.

5. Configure your validator host machine's firewall to allow the following traffic only:

    - Inbound traffic: Only from IP addresses of the stock `rippled` servers in the cluster you configured.

    - Outbound traffic: Only to the IP addresses of the stock `rippled` servers in the cluster you configured and to <https://vl.ripple.com> through port 443.

6. Restart `rippled`.

        $ sudo systemctl restart rippled.service

7. Use the [Peer Crawler](peer-protocol.html#peer-crawler) endpoint on one of your stock `rippled` servers. The response should not include your validator. This verifies that your validator's `[peer_private]` configuration is working. One of the effects of enabling `[peer_private]` on your validator is that your validator's peers do not include it in their Peer Crawler results.



## Provide Domain Verification

To help validation list publishers and other participants in the XRP Ledger network understand who operates your validator, provide domain verification for your validator. At a high level, domain verification is a two-way link:

- Use your domain to claim ownership of a validator key.

- Use your validator key to claim ownership of a domain.

Creating this link establishes strong evidence that you own both the validator key and the domain.

To provide domain verification:

1. Choose a domain name you own that you want to be publicly associated with your validator. You must run a public-facing HTTPS server on port 443 of that domain and you must have access to the private key file associated with that server's TLS certificate. (Note: [TLS was formerly called SSL](https://en.wikipedia.org/wiki/Transport_Layer_Security).)

2. Share your validator's public key with the public, especially other `rippled` operators. For example, you can share your validator's public key on your website, on social media, in the [XRPChat community forum](https://www.xrpchat.com/), or in a press release.

3. Submit a request to have your validator listed in XRP Charts' [Validator Registry](https://xrpcharts.ripple.com/#/validators) using this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLScszfq7rRLAfArSZtvitCyl-VFA9cNcdnXLFjURsdCQ3gHW7w/viewform). Having your validator listed in this registry provides another form of public verification that your validator and domain are owned by you. To complete the form, you'll need the following information:

      1. Find your validator public key by running the following on the validator server.

            $ /opt/ripple/bin/rippled server_info | grep pubkey_validator

        Provide the value returned in the **Validator Public Key** field of the Google Form.

      2. Sign the validator public key using your web domain's TLS private key. The TLS private key file does not need to be stored on your validator's server.

            $ openssl dgst -sha256 -hex -sign /PATH/TO/YOUR/TLS.key <(echo YOUR_VALIDATOR_PUBLIC_KEY_HERE)

        Sample output:

            4a8b84ac264d18d116856efd2761a76f3f4544a1fbd82b9835bcd0aa67db91c53342a1ab197ab1ec4ae763d8476dd92fb9c24e6d9de37e3594c0af05d0f14fd2a00a7a5369723c019f122956bf3fc6c6b176ed0469c70c864aa07b4bf73042b1c7cf0b2c656aaf20ece5745f54ab0f78fab50ebd599e62401f4b57a4cccdf8b76d26f4490a1c51367e4a36faf860d48dd2f98a6134ebec1a6d92fadf9f89aae67e854f33e1acdcde12cfaf5f5dbf1b6a33833e768edbb9ff374cf4ae2be21dbc73186a5b54cc518f63d6081919e6125f7daf9a1d8e96e3fdbf3b94b089438221f8cfd78fd4fc85c646b288eb6d22771a3ee47fb597d28091e7aff38a1e636b4f

        Provide the value returned in the **SSL Signature** field of the Google Form.

      3. Using the [`validator-keys` tool](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md) (included in `rippled` RPMs), sign the domain name.

            $ validator-keys --keyfile /PATH/TO/YOUR/validator-keys.json sign YOUR_DOMAIN_NAME

        Sample output:

            E852C2FE725B64F353E19DB463C40B1ABB85959A63B8D09F72C6B6C27F80B6C72ED9D5ED6DC4B8690D1F195E28FF1B00FB7119C3F9831459F3C3DE263B73AC04

        Provide the value returned in the **Domain Signature** field of the Google Form.

4. After submitting the completed Google Form, you'll receive an email from XRP Charts that tells you whether your domain verification succeeded or failed. If your domain verification succeeds, XRP Charts lists your validator and domain in its [Validator Registry](https://xrpcharts.ripple.com/#/validators).

<!--{ ***TODO: For the future - add a new section or separate document: "Operating a Trusted Validator" -- things that you need to be aware of once your validator has been added to a UNL and is participating in consensus. We should tell the user what to expect once they are listed in a UNL. How to tell if your validator is participating in the consensus process? How to tell if something isn't right with your validator - warning signs that they should look out for? How to tell if your validator has fallen out of agreement - what is the acceptable vs unacceptable threshold? Maybe provide a script that will alert them when something is going wrong.*** }-->



## Revoke Validator Keys

If your validator's master private key is compromised, you must revoke it immediately and permanently.

For information about how to revoke a master key pair you generated for your validator using the `validator-keys` tool, see [Key Revocation](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation).



## Verify Your Connection to Network

Here are some methods you can use to verify that your validator has a healthy connection to the XRP Ledger network:

- Use the [`peers`](peers.html) command to return a list of all `rippled` servers currently connected to your validator. If the `peers` array is `null`, you don’t have a healthy connection to the network. If you've set up your validator using the instructions in this document, the `peers` array should include the same number of objects as the number of peers defined in your `[ips_fixed]` stanza. ***TODO: I have both r.ripple.com 51235 and zaphod.alloy.ee 51235 in my [ips_fixed] - and sometimes I get connect to only 1 peer. Is this a problem, or is it okay? If this is okay, I guess we can't say that the number of peers in ips_fixed and the number of peers returned will always be the same. If you are not using [peer_private] - what is a healthy minimum number of peers?***

    - If you are running an untrusted validator, haven't already set up connections to public hubs, and are having trouble maintaining a reliable and safe connection to the network, see [Connect to the Network Using Public Hubs](#connect-to-the-network-using-public-hubs).

    - If you are running a trusted validator, haven't already set up connections to proxies, and are having trouble maintaining a reliable and safe connection to the network, see [Connect to the Network Using Proxies](#connect-to-the-network-using-proxies).

- Use the [`server_info`](server_info.html) command to return some basic information about your validator. The `server_state` should be set to `proposing`. It may also be set to `full` or `validating`, but only for a few minutes before moving into `proposing`.

    If the `server_state` does not spend the majority of its time set to `proposing`, it may be a sign that your validator is unable to fully participate in the XRP Ledger network. ***TODO: accurate?*** For more information about server states and using the `server_info` endpoint to diagnose issues with your validator, see [`rippled` Server States](rippled-server-states.html) and [Get the `server_info`](diagnosing-problems.html#get-the-server-info).

- Use the [`validators`](validators.html) command to return the current list of published and trusted validators used by the validator. ***TODO: Is this useful? what values should they be looking for? `result.publisher_lists.available` is `true`? `result.trusted_validator_keys` contains X values?***

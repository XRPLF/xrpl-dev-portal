---
html: validator.html
parent: server-modes.html
seo:
    description: Have your server vote on the consensus ledger.
labels:
  - Core Server
  - Blockchain
top_nav_grouping: Popular Pages
top_nav_name: Join UNL
---
# Validator

An `xrpld` (formerly `rippled`) server running in [validator mode](../../../concepts/networks-and-servers/xrpld-server-modes.md) does everything a stock server does:

- Connects to a [network of peers](../../../concepts/networks-and-servers/peer-protocol.md)

- Relays cryptographically signed [transactions](../../../concepts/transactions/index.md)

- Maintains a local copy of the current state of the shared global [ledger](../../../concepts/ledgers/index.md), plus as much recent history as it is configured to keep

What makes a validator _different_ is that it also takes part in the [consensus process](../../../concepts/consensus-protocol/consensus-principles-and-rules.md#how-consensus-works): it issues proposals (candidate transaction sets) and validations (signed votes for the resulting ledger).

Issuing validations doesn't automatically give your validator a say in the consensus process, so the system isn't vulnerable to a [Sybil attack](https://en.wikipedia.org/wiki/Sybil_attack). Other servers ignore your validations unless they add your validator to their Unique Node List (UNL). If your validator is included in a UNL, it is a _trusted_ validator and its proposals are considered in the consensus process by the servers that trust it.

Every server chooses its own UNL, but almost all of them use the two lists published by the XRP Ledger Foundation and Ripple. In practice, being trusted means being on those default lists, which operators call the dUNL. See [How the Network Fits Together](../../prerequisites/how-the-network-fits-together.md#what-a-validator-is-and-what-trust-means).

Even if your validator isn't a _trusted_ validator, it still plays an important role in the overall health of the network. These validators help set the standard that trusted validators are measured against. For example, if a trusted validator is disagreeing with a lot of these validators that aren't listed in UNLs, that might indicate a problem.

{% admonition type="danger" name="Warning" %}Validators shouldn't be accessible to the public. Don't allow public WebSocket access to your validator server or any other form of public access.{% /admonition %}


## Before you begin

A validator isn't the right first server. If you want to submit transactions or query the ledger, run a [stock server](stock-node.md). Validating adds nothing to that.

Operators who run validators well describe the same sequence:

1. **Run a stock server first** for a few weeks. Learn what the configuration does, what a healthy server looks like, and how to update and restart it.
2. **Run a validator that isn't on any UNL** for months. This is the only safe place to rehearse restarts, upgrades, configuration mistakes, rebuild drills, and monitoring. Its votes count for nothing, so mistakes cost nothing. Hold it to the same standard as a trusted validator anyway.
3. **Seek UNL inclusion** only after a long record of clean operation. The XRP Ledger Foundation's list is applied for by pull request to the [XRPLF/unl](https://github.com/XRPLF/unl) repository; read its [application guide](https://github.com/XRPLF/unl/blob/main/docs/UNL-application-guide.md) first, because it states the requirements. Ripple's list has no public application process. Once you are on a UNL, your uptime is a public number and every restart has a cost.

Before you start, have the following:

- Hardware that meets the [Validator System Requirements](../../prerequisites/system-requirements/validator.md).
- A domain name you control, for [domain verification](#6-provide-domain-verification). It must not resolve to the validator's IP address.
- A secure, offline place to keep the validator master key. It never goes on the validator.
- A way to be alerted when the validator stops proposing. Build monitoring before you promote the validator, not after. See [Validator Best Practices](../best-practices/validator.md).

Read [Validator Security](../security/validator.md) before you choose how to connect to the network in step 4.


## 1. Understand the traits of a good validator

Strive to have your validator embody the following properties. Being a good validator helps `xrpld` server operators and validator list publishers (such as https://vl.ripple.com and https://unl.xrplf.org) trust your validator before adding it to their UNLs.

- **Available**

    A good validator is always running and submitting validation votes for every proposed ledger. Strive for 100% uptime.

- **In agreement**

    A good validator's votes match the outcome of the consensus process as often as possible. To do otherwise could indicate that your validator's software is outdated, buggy, or intentionally biased. Always run the latest stable release without modifications. [Watch releases](https://github.com/XRPLF/rippled/releases) of the core server and subscribe to the [ripple-server Google Group](https://groups.google.com/g/ripple-server) to be notified of new releases.

- **Issuing prompt votes**

    A good validator's votes arrive quickly and not after a consensus round has already finished. To keep your votes on time, make sure your validator meets the recommended [system requirements](../../prerequisites/system-requirements/validator.md), which include a fast internet connection.

    A validator should be dedicated to participating in consensus. Serving API queries from a validator makes it less reliable at keeping up with consensus, and other processes on the same host compete with it for disk and memory. Co-hosted workloads are the most common cause of validator halts on home hardware.

- **Identified**

    A good validator has a clearly identified owner. Providing [domain verification](#6-provide-domain-verification) is a good start. Ideally, XRP Ledger network UNLs include validators run by different owners in multiple legal jurisdictions and geographic areas. This reduces the chance that any localized events could interfere with the impartial operations of trusted validators. <!-- STYLE_OVERRIDE: clearly -->

It is strongly recommended that operators use the list providers that are present in this {% source-link name="example file" path="cfg/validators-example.txt" /%}.



## 2. Install an `xrpld` server

For more information, see [Install `xrpld`](../../installation/index.md).

After installation, before enabling validation, confirm the server syncs and reaches the `full` state as a stock server. Expect about 5 to 20 minutes on first start, depending on hardware. If it doesn't sync, fix that first; see [Server Doesn't Sync](../../troubleshooting/server-doesnt-sync.md).



## 3. Enable validation on your `xrpld` server

Enabling validation on your `xrpld` server means providing a validator token in your server's `xrpld.cfg` file. You can use the `validator-keys` tool (included in `xrpld` Linux packages) to securely generate and manage your validator keys and tokens. {% badge href="https://github.com/XRPLF/rippled/releases/tag/3.3.0" %}Updated in: xrpld 3.3.0{% /badge %}

{% admonition type="info" name="Note" %}
`xrpld` 3.2.0 packages don't include the `validator-keys` tool; if you run 3.2.0, build it from source from the [validator-keys-tool repository](https://github.com/ripple/validator-keys-tool). Earlier `rippled` packages installed the tool at `/opt/ripple/bin/validator-keys`. Starting with `xrpld` 3.3.0, packages install it at `/usr/bin/validator-keys`, which is on the `PATH`.
{% /admonition %}

In a secure location **not** on your validator:

1. Generate a validator key pair using the `validator-keys` tool:

    ```
    validator-keys create_keys
    ```

      Sample output on Ubuntu:

    ```
    Validator keys stored in /home/my-user/.ripple/validator-keys.json

    This file should be stored securely and not shared.
    ```

      Sample output on macOS:

    ```
    Validator keys stored in /Users/my-user/.ripple/validator-keys.json

    This file should be stored securely and not shared.
    ```

      {% admonition type="danger" name="Warning" %}Store the generated `validator-keys.json` key file in a secure, offline, and recoverable location, such as an encrypted USB flash drive. Don't store keys on the validator where you intend to use the keys. If your `secret_key` is compromised, [revoke the key](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation) immediately. Don't modify the contents of `validator-keys.json`, except to update the backup after generating a new token. If you generate more than one token from the same backup without updating, the network ignores the later tokens because they use the same `token_sequence` number.{% /admonition %}

      For more information about the `validator-keys` tool and the key pairs it generates, see the [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md).

2. Generate a validator token using the `create_token` command.

    ```
    validator-keys create_token --keyfile /PATH/TO/YOUR/validator-keys.json
    ```

    Sample output:

    ```
    Update rippled.cfg file with these values and restart xrpld:

    # validator public key: nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE

    [validator_token]
    eyJ2YWxpZGF0aW9uX3NlY3J|dF9rZXkiOiI5ZWQ0NWY4NjYyNDFjYzE4YTI3NDdiNT
    QzODdjMDYyNTkwNzk3MmY0ZTcxOTAyMzFmYWE5Mzc0NTdmYT|kYWY2IiwibWFuaWZl
    c3QiOiJKQUFBQUFGeEllMUZ0d21pbXZHdEgyaUNjTUpxQzlnVkZLaWxHZncxL3ZDeE
    hYWExwbGMyR25NaEFrRTFhZ3FYeEJ3RHdEYklENk9NU1l1TTBGREFscEFnTms4U0tG
    bjdNTzJmZGtjd1JRSWhBT25ndTlzQUtxWFlvdUorbDJWMFcrc0FPa1ZCK1pSUzZQU2
    hsSkFmVXNYZkFpQnNWSkdlc2FhZE9KYy9hQVpva1MxdnltR21WcmxIUEtXWDNZeXd1
    NmluOEhBU1FLUHVnQkQ2N2tNYVJGR3ZtcEFUSGxHS0pkdkRGbFdQWXk1QXFEZWRGdj
    VUSmEydzBpMjFlcTNNWXl3TFZKWm5GT3I3QzBrdzJBaVR6U0NqSXpkaXRROD0ifQ==
    ```

    The tool's output still says `rippled.cfg`; the file is `xrpld.cfg` on current installs. The tool increments `token_sequence` in `validator-keys.json` every time you create a token. Update your offline backup of the file now, before you forget. A token generated from a stale copy of the file carries a sequence number the network has already seen, and the network ignores it.

On your validator:

1. Add `[validator_token]` and its value to your validator's `xrpld.cfg` file.

    If you previously configured your validator without the `validator-keys` tool, delete `[validation_seed]` and its value from your `xrpld.cfg` file. The server refuses to start with both present. This changes your validator public key.

    {% admonition type="warning" name="Caution" %}
    The server rejects some invalid values at startup, but it doesn't warn about stanzas or keys it doesn't recognize, and if a `key = value` line appears twice in a stanza the last one wins, while a single-value stanza (such as `[node_size]` or `[path_search_max]`) that appears twice is ignored, and nothing is logged. If you didn't write the file by hand, review every stanza before you use it. See [Keep the configuration honest](../best-practices/validator.md#keep-the-configuration-honest).
    {% /admonition %}

2. Restart `xrpld`.

    ```
    sudo systemctl restart xrpld.service
    ```

    Expect about 3 minutes before the server reaches `proposing` on a dedicated host with local NVMe, and 5 to 25 minutes on smaller or shared hosts. Several minutes in the `connected` state with an empty `complete_ledgers` range is normal even when the ledger store is intact; it isn't corruption, so don't delete the store. See [Restart with care](../best-practices/validator.md#restart-with-care). Watch `server_state` rather than a clock.

    {% admonition type="danger" name="One token, one server" %}
    Never run two servers with the same validator token, even briefly during a migration or a restore. Two servers signing with one key send conflicting validations under one identity. See [No High Availability](../security/validator.md#no-high-availability) for how to move a validator safely.
    {% /admonition %}

3. Use the `server_info` command to get information about your validator to verify that it is running as a validator.

    ```
    xrpld server_info
    ```

      - The `pubkey_validator` value in the response should match the `public_key` in the `validator-keys.json` file that you generated for use with your validator.

      - The `server_state` value should be _**proposing**_.

      - Run this over an admin connection (the command-line client uses one). `proposing` and `validating` are reported only to admin connections; a non-admin connection sees `full` even while the validator is proposing. Admin responses also include the `node_size` in effect, which is useful for confirming the server sized itself as you intended.

Adding a validator token changes one default: pathfinding is switched off automatically when `[validator_token]` or `[validation_seed]` is present. You don't need to disable it yourself.

**Security Tip:** Restrict who can read `xrpld.cfg`, which now contains your validator token. The packaged service runs as the `xrpld` user while the file is installed owned by root, so don't make it `0600`: the service could no longer read it and would fail to start. Use:

```sh
sudo chown root:xrpld /etc/xrpld/xrpld.cfg
sudo chmod 0640 /etc/xrpld/xrpld.cfg
```

After this, command-line calls such as `xrpld server_info` need `sudo`, because the client reads the same file.

## 4. Connect to the network

This section describes four configurations you can use to connect your validator to the XRP Ledger network. Use the configuration that best suits your use case.

- [Discovered peers](#connect-using-discovered-peers): Connect to any servers in the peer-to-peer network.

- [Proxies](#connect-using-proxies): Run stock `xrpld` servers as proxies between your validator and the rest of the peer-to-peer network.

- [Public hubs](#connect-using-public-hubs): Connect only to specific public servers with a high reputation.

- [Outbound only](#connect-outbound-only): Accept no inbound peer connections at all.

For a comparison of these approaches, see [Pros and Cons of Peering Configurations](../../../concepts/networks-and-servers/peer-protocol.md#pros-and-cons-of-peering-configurations) and the [topology comparison](../security/validator.md#topology-and-exposure) on the Validator Security page.


### Connect using discovered peers

This configuration connects your validator to the XRP Ledger network using [discovered peers](../../../concepts/networks-and-servers/peer-protocol.md#peer-discovery). This is the default behavior for `xrpld` servers.

_**To connect your validator to the XRP Ledger network using discovered peers,**_ omit the `[peer_private]` stanza or set it to `0` in your validator's `xrpld.cfg` file. The {% source-link name="example xrpld.cfg file" path="cfg/xrpld-example.cfg" /%} is delivered with this configuration.

This configuration advertises your validator's IP address to the network. The XRP Ledger Foundation's [UNL application guide](https://github.com/XRPLF/unl/blob/main/docs/UNL-application-guide.md) lists keeping a UNL validator's IP address private as a security requirement, so read it before you choose this option for a validator you plan to put forward. Production validators that run this way limit their exposure with a low `peers_max`, `ip_limit` in the `[overlay]` stanza, and a hosting provider that mitigates DDoS attacks, and firewall everything else.


### Connect using proxies

This configuration connects your validator to the network through stock `xrpld` servers that you run yourself. These proxy servers sit between your validator and inbound and outbound network traffic. It is the configuration professional operators most often use, on bare metal and in the cloud.

_**To connect your validator to the XRP Ledger network using proxies:**_

1. Set up stock `xrpld` servers. For more information, see [Install xrpld](../../installation/index.md).

2. Configure your validator and stock `xrpld` servers to run in a [cluster](../peering/cluster-xrpld-servers.md).

3. Bring the proxies up first and confirm from **outside** your network that their peer ports are reachable and that they are synced. A private validator connects only to the servers in its `[ips_fixed]` stanza. If none of them are reachable, it sits at zero peers and can't validate.

    Proxies don't need to be near the validator. One operator runs proxies in two regions, about 13 ms and about 270 ms from the validator over private peering, with full agreement; spreading them means one regional outage doesn't isolate the validator.

4. In your validator's `xrpld.cfg` file, set `[peer_private]` to `1`. This stops your validator advertising its IP address in peer gossip. (Any server with a validator key already asks its peers to keep its address out of crawl results, with or without this setting.) For more information, see [Private Peers](../../../concepts/networks-and-servers/peer-protocol.md#private-peers). It also prevents your validator from connecting to servers other than those defined in the `[ips_fixed]` stanza you defined to run your validator in a cluster.

    {% admonition type="danger" name="Warning" %}Be sure that you don't publish your validator's IP address in other ways.{% /admonition %}

5. Configure your validator host machine's firewall to allow the following traffic only:

    - Inbound traffic: Only from IP addresses of the stock `xrpld` servers in the cluster you configured.

    - Outbound traffic: Only to the IP addresses of the stock `xrpld` servers in the cluster you configured, to your UNL list providers through port 443, and to what the host itself needs: DNS, NTP, and your package repository. Without those the validator can't resolve its peers or list publishers, keeps inaccurate time, and can't be updated.

    On a cloud provider, go one step further: give the validator no public address at all. Put it in a private subnet with outbound-only NAT and let the proxies reach it over the private network. See [Topology and exposure](../security/validator.md#topology-and-exposure).

6. Restart `xrpld`.

    ```
    sudo systemctl restart xrpld.service
    ```

7. On the validator, confirm with the [peers method][] that it is connected to exactly the servers in `[ips_fixed]` and nothing else. This is the real test of `[peer_private]`.

8. Optionally, query the [Peer Crawler](../../../references/http-websocket-apis/peer-port-methods/peer-crawler.md) endpoint on one of your stock servers, using that server's peer port (2459 in the current example configuration; 51235 on many older installs):

    ```sh
    curl --insecure https://STOCK_SERVER_IP_ADDRESS_HERE:2459/crawl | python3 -m json.tool
    ```

    Your validator still appears in the list, by node public key, but with no `ip` or `port` fields. Any server that holds a validator key hides its address from the crawl automatically, so this check doesn't prove `[peer_private]` is set; step 7 does.

<!-- { TODO: Future: add a recommended network architecture diagram to represent the proxy, clustering, and firewall setup: https://ripplelabs.atlassian.net/browse/DOC-2046 }-->


### Connect using public hubs

This configuration connects your validator to the network using [public hubs](../../../concepts/networks-and-servers/xrpld-server-modes.md#public-hubs). This configuration is similar to [connecting using proxies you run yourself](#connect-using-proxies), but instead you connect through public hubs.

_**To connect your validator to the network using public hubs:**_

1. In your validator's `xrpld.cfg` file, include the following `[ips_fixed]` stanza. This stanza tells `xrpld` to always attempt to maintain peer connections with these public hubs.

    ```
    [ips_fixed]
    r.ripple.com 51235
    sahyadri.isrdc.in 51235
    hubs.xrpkuwait.com 51235
    hub.xrpl-commons.org 51235
    ```

    {% admonition type="info" name="Note" %}
    The above list may evolve over time. To ensure you're using the most current set of public hubs, refer to the official {% source-link name="xrpld-example.cfg" path="cfg/xrpld-example.cfg" /%} maintained by XRPLF.
    {% /admonition %}

    {% admonition type="warning" name="Caution" %}This configuration connects your validator to the network using default public hubs. Because these are the _default_ public hubs, they may sometimes be too busy to provide your validator with a connection to the network. To help avoid this issue, connect to more public hubs and, even better, connect to non-default public hubs. Some hub operators offer [peer reservations](../peering/use-a-peer-reservation.md), which guarantee your validator a slot on that hub. A reservation doesn't protect you from the hub's own outages or maintenance, so reserve on more than one.{% /admonition %}

    You can include the IP addresses of other `xrpld` servers here, but _**only**_ if you can expect them to:

      - Relay messages without censoring.
      - Stay online consistently.
      - Not DDoS you.
      - Not try to crash your server.
      - Not publish your IP address to strangers.

2. Also in your validator's `xrpld.cfg` file, include the following `[peer_private]` stanza and set it to `1`. This stops your validator advertising its IP address in peer gossip. (Any server with a validator key already asks its peers not to broadcast its address in crawl results.) This setting also instructs your validator to connect to only the peers configured in your `[ips_fixed]` stanza. This ensures that your validator connects to and shares its IP with only peer `xrpld` servers you know and trust.

    ```
    [peer_private]
    1
    ```

    {% admonition type="danger" name="Warning" %}Be sure that you don't publish your validator's IP address in other ways.{% /admonition %}

    With `[peer_private]` enabled, `xrpld` ignores any connections suggested by the `[ips]` stanza. If you need to connect to an IP currently in your `[ips]` stanza, put it in the `[ips_fixed]` stanza instead, but _**only**_ if you can expect them to behave responsibly as described in step 1.

3. Restart `xrpld`.

    ```
    sudo systemctl restart xrpld.service
    ```


### Connect outbound only

A validator doesn't need to accept inbound peer connections. If you remove the peer port from the `[server]` stanza (and its `[port_peer]` stanza), the server opens no listener at all and still connects outward to the servers in `[ips_fixed]` and, if `[peer_private]` is `0`, to discovered peers. The server never requires a peer listener; a validator has run this way on a published UNL for years.

What you give up is peer capacity: an outbound-only server contributes nothing to other servers' connectivity. That is acceptable for a validator. What you gain is no inbound attack surface on the peer port and the lowest bandwidth of any configuration.

_**To connect outbound only:**_

1. In `xrpld.cfg`, remove `port_peer` from the `[server]` stanza and remove or comment out the `[port_peer]` stanza.
2. List trusted hubs or your own proxies in `[ips_fixed]` and set `[peer_private]` to `1`, as in [Connect using public hubs](#connect-using-public-hubs).
3. Restart `xrpld` and confirm with the [peers method][] that every connection is outbound. (`[peers_max]` does nothing in this configuration: with `[peer_private]` set there are no discovered peers to cap, and fixed peers don't count toward it.)



## 5. Verify your network connection

Here are some methods you can use to verify that your validator has a healthy connection to the XRP Ledger network:

- Use the [`peers`](../../../references/http-websocket-apis/admin-api-methods/peer-management-methods/peers.md) command to return a list of all `xrpld` servers currently connected to your validator. If the `peers` array is `null`, you don’t have a healthy connection to the network. If you've set up your validator using the instructions in this document, the `peers` array should hold close to the number of peers defined in your `[ips_fixed]` stanza. Brief dips are normal; a sustained shortfall isn't.

    If you listed a public hub in your `[ips_fixed]` stanza and it is busy, it may reject your validator's connection. In this case, you may end up with fewer connections than configured in your `[ips_fixed]` stanza. Your validator retries the connection if it's initially rejected.

    If you are having trouble maintaining a reliable and safe connection to the network and haven't set up connections using public hubs or proxies, see [4. Connect to the network](#4-connect-to-the-network). Using one of the methods described in the section may help your validator remain healthily connected to the network.

- Use the [`server_info`](../../../references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md) command to return some basic information about your validator. The `server_state` should be set to `proposing`. It may also be set to `full` or `validating`, but only for a few minutes before moving into `proposing`.

    If the `server_state` doesn't spend the majority of its time set to `proposing`, it may be a sign that your validator is unable to fully participate in the XRP Ledger network. For more information about server states and using the `server_info` endpoint to diagnose issues with your validator, see [`xrpld` Server States](../../../references/http-websocket-apis/api-conventions/xrpld-server-states.md) and [Get the `server_info`](../../troubleshooting/diagnosing-problems.md#get-the-server_info).

- Use the [`validators`](../../../references/http-websocket-apis/admin-api-methods/status-and-debugging-methods/validators.md) command to return the current list of published and trusted validators used by the validator. Ensure that `validator_list.expiration` is `never` or a date that isn't near. Each entry in `publisher_lists` should show `available` as `true` and an `expiration` in the future.

{% admonition type="info" name="The health check and private validators" %}
The [Health Check](../../../references/http-websocket-apis/peer-port-methods/health-check.md) endpoint on the peer port returns HTTP 503 (warning) whenever the server has one to seven peers, and 500 (critical) at none. A validator connected only to a few fixed peers can never report healthy, however well it is running. Base automated checks on `server_state` from the `server_info` method instead, and see [Health Check Interventions](../../troubleshooting/health-check-interventions.md).
{% /admonition %}



## 6. Provide domain verification

To help validation list publishers and other participants in the XRP Ledger network understand who runs your validator, provide domain verification for your validator. At a high level, domain verification is a two-way link:

- Use your domain to claim ownership of a validator key.

- Use your validator key to claim ownership of a domain.

Creating this link establishes strong evidence that you own both the validator key and the domain. Providing this evidence is one aspect of [being a good validator](#1-understand-the-traits-of-a-good-validator).

Operators consistently name this step as the hardest part of setting up a validator, and most failures come from one of the mistakes listed below. Work through the steps in order.

To provide domain verification:

1. Choose a domain name you own that you want to be publicly associated with your validator. As a precaution against DDoS attempts, your domain name shouldn't resolve to the IP address of your validator.

2. Serve an [`xrp-ledger.toml`](../../../references/xrp-ledger-toml.md) file at your domain, and complete the [domain verification](../../../references/xrp-ledger-toml.md#domain-verification) steps.

    Host the file on static hosting (for example a GitHub Pages or Cloudflare Pages site) rather than on the validator. Running a web server on the validator has exposed validators' IP addresses and, in more than one case, their operators' home addresses.

    Check the following, which account for most failed verifications:

    - The file is served over HTTPS with a certificate from a recognized authority, at the exact path `/.well-known/xrp-ledger.toml`.
    - The domain in the file, the domain you attest with `set_domain` (next step), and the domain serving the file match exactly.
    - The `[[VALIDATORS]]` table uses double square brackets, its `public_key` is the master key (the `nH...` value from `validator-keys.json`, not the ephemeral key), and its `attestation` is the exact string that `set_domain` printed. If you lost that output, `validator-keys attest_domain` prints it again.
    - The response carries the `Access-Control-Allow-Origin: *` header. See [CORS Setup](../../../references/xrp-ledger-toml.md#cors-setup).

    The [xrp-ledger.toml Checker](/resources/dev-tools/xrp-ledger-toml-checker) and the [Domain Verifier](/resources/dev-tools/domain-verifier) on this site run these checks for you.

3. Attest the domain from the key side. The `validator-keys set_domain` command signs the domain claim and **outputs a new validator token**. You must copy that new `[validator_token]` into `xrpld.cfg` and restart the server. If you skip this, the TOML side verifies fine but the validator's manifest never carries the domain, and the verification fails with no error anywhere. This is the single most common cause of a validator that "just won't verify".

    Update your offline backup of `validator-keys.json` after running `set_domain`, as with any new token.

4. Check both sides. On the validator, the [validator_info method][] should show your `domain` and a `seq` that matches the new token. From any public server, the [manifest method][] for your validator public key should return the same `seq` and `domain`. If the public server returns an older `seq` or no manifest, see [Validator Not Visible on Explorers](../../troubleshooting/validator-not-visible-on-explorers.md).

5. Once both sides check out, your validator should be visible to the livenet [explorer](https://livenet.xrpl.org/network/validators) or any other site that monitors the validator network and supports decentralized domain verification.

6. Share your validator's public key with the public, especially other `xrpld` operators. For example, you can share your validator's public key on your website, on social media, or in a press release.


## 7. Check what the network sees

Your own server tells you whether it is proposing. It doesn't tell you whether the rest of the network has received your manifest, or whether explorers have indexed it. Validations are ephemeral, and every number an explorer shows is that observer's reconstruction of what it happened to receive.

After setup, and after every token change, run the [manifest method][] for your validator public key against a public server such as `s1.ripple.com`. The `seq` and `domain` in the response should match what your validator reports in [validator_info method][]. If they don't, or if explorers show your validator as unknown or unverified while it proposes with full agreement, see [Validator Not Visible on Explorers](../../troubleshooting/validator-not-visible-on-explorers.md).


## Revoke validator keys

If your validator's master private key is compromised, you must revoke it immediately and permanently.

For information about how to revoke a master key pair you generated for your validator using the `validator-keys` tool, see [Key Revocation](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation).


## See also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [The `xrpld` Server](../../../concepts/networks-and-servers/index.md)
    - [Negative UNL](../../../concepts/consensus-protocol/negative-unl.md)
- **Tutorials:**
    - [Validator System Requirements](../../prerequisites/system-requirements/validator.md)
    - [Validator Security](../security/validator.md)
    - [Validator Best Practices](../best-practices/validator.md)
    - [Cluster xrpld Servers](../peering/cluster-xrpld-servers.md)
    - [Configure Amendment Voting](../configure-amendment-voting.md)
    - [Install `xrpld`](../../installation/index.md)
    - [Capacity Planning](../../prerequisites/capacity-planning.md)
- **References:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [consensus_info method][]
    - [peers method][]
    - [validator_info method][]
    - [validator_list_sites method][]
    - [validators method][]
    - [manifest method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

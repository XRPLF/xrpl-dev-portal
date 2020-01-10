# Use a Peer Reservation

A [peer reservation][] is a setting that makes a `rippled` server always accept connections from a peer matching the reservation. This page describes how to use peer reservations to keep a consistent peer-to-peer connection between two servers, with the cooperation of the administrators of both servers.

Peer reservations are most useful when the two servers are run by different parties, and the server that receives the incoming connection is a [hub server](rippled-server-modes.html#public-hubs) with many peers. For clarity, these instructions use the following terms:

- The server making the outgoing connection is the **stock server**. This server _uses_ the peer reservation on the hub server.
- The server receiving the incoming connection is the **hub server**. The administrator _adds_ the peer reservation to this server.

However, you can use these instructions to set up a peer reservation regardless of whether one server or both are hubs, validators, or stock servers. It is also possible to use a peer reservation when the busier server is the one making the outgoing connection, but this process does not describe that configuration.

## Prerequisites

To complete these steps, you must meet the following prerequisites:

- The administrators both servers must have `rippled` [installed](install-rippled.html) and running.
- The administrators of both servers must agree to cooperate and must be able to communicate. A public communications channel is fine because you don't need to share any secret information.
- The hub server must be able to receive incoming peer connections. For instructions on how to configure a firewall to allow this, see [Forward Ports for Peering](forward-ports-for-peering.html).
- Both servers must be configured to sync with the same [XRP Ledger network](parallel-networks.html), such as the production XRP Ledger, the Testnet, or the Devnet.

## Steps

To use a peer reservation, complete the following steps:

### 1. (Stock Server) Set up a permanent node key pair

The administrator of the stock server completes this step.

If you have already configured your server with a permanent node key pair value, you can skip ahead to [step 2: Communicate your node public key to the peer's admin](#2-communicate-the-stock-servers-node-public-key). (For example, setting up a permanent node key pair for each server is part of the process of [setting up a server cluster](cluster-rippled-servers.html).)

**Tip:** Setting up a permanent node key pair is optional, but makes it easier to keep the peer reservation set up if you need to erase your server's databases or move to a new machine. If you don't want to set up a permanent node key pair, you can use your server's automatically-generated node public key as reported in the `pubkey_node` field of the [server_info method][] response.

1. Generate a new, random key pair using the [validation_create method][]. (Omit the `secret` value.)

    For example:

        rippled validation_create

        Loading: "/etc/rippled.cfg"
        Connecting to 127.0.0.1:5005
        {
           "result" : {
              "status" : "success",
              "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
              "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
              "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
           }
        }

    Save the `validation_seed` (your node seed value) and the `validation_public_key` value (your node public key )

2. Edit your `rippled`'s config file.

        vim /etc/opt/ripple/rippled.cfg

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

3. Add a `[node_seed]` stanza using the `validation_seed` value you generated earlier.

    For example:

        [node_seed]
        ssZkdwURFMBXenJPbrpE14b6noJSu

    **Warning:** All servers should have unique `[node_seed]` values. If you copy your config file to another server, be sure to remove or change the `[node_seed]` value. Keep your `[node_seed]` secret; if a malicious actor gains access to this value, they could use it to impersonate your server in XRP Ledger peer-to-peer communications.

4. Restart your `rippled` server:

        systemctl restart rippled

### 2. Communicate the stock server's node public key

The administrator of the stock server tells the administrator of the hub server what the stock server's node public key is. (Use the `validation_public_key` from step 1.) The administrator of the hub server needs this value for the next steps.

### 3. (Hub Server) Add the peer reservation

The administrator of the hub server completes this step.

Use the [peer_reservations_add method][] to add a reservation using the node public key that you got in the previous step. For example:

```sh
$ rippled peer_reservations_add n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG "Description here"

Loading: "/etc/opt/ripple/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "status": "success"
  }
}
```

**Tip:** The description is an optional field that you can provide to add a human-readable note about who this reservation is for.

### 4. Communicate the hub server's current IP address and peer port

The administrator of the hub server must tell their server's current IP address and peer port to the administrator of the stock server. If the hub server is behind a firewall that does network address translation (NAT), use the server's _external_ IP address. The default config file uses port 51235 for the peer protocol.

### 5. (Stock Server) Connect to the peer server

The administrator of the stock server completes this step.

Use the [connect method][] to connect your server to the hub server. For example:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "command": "connect",
    "ip": "169.54.2.151",
    "port": 51235
}
```

*JSON-RPC*

```
{
    "method": "connect",
    "params": [
        {
            "ip": "169.54.2.151",
            "port": 51235
        }
    ]
}
```


*Commandline*

```
rippled connect 169.54.2.151 51235
```

<!-- MULTICODE_BLOCK_END -->

If the hub server's administrator has set up the peer reservation as described in the previous steps, this should automatically connect and remain connected as long as possible.


## Next Steps

As a server administrator, you can manage the reservations your server has for other peers. (It is not possible to check which other servers have reservations for yours.) You can:

- Add more peer reservations or update their descriptions, using the [peer_reservations_add method][].
- Check which servers you have configured reservations for, using the [peer_reservations_list method][].
- Remove one of your reservations using the [peer_reservations_del method][].
- Check which peers are currently connected and how much bandwidth they have used, using the [peers method][].

**Tip:** Although there is no API method to immediately disconnect from an unwanted peer, you can use a software firewall such as `firewalld` to block an unwanted peer from connecting to your server. For examples, see the community-contributed [rbh script](https://github.com/gnanderson/rbh).


## See Also

- **Concepts:**
    - [Peer Protocol](peer-protocol.html)
    - [Consensus](consensus.html)
    - [Parallel Networks](parallel-networks.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html)
    - [Troubleshooting `rippled`](troubleshoot-the-rippled-server.html)
- **References:**
    - [peers method][]
    - [peer_reservations_add method][]
    - [peer_reservations_del method][]
    - [peer_reservations_list method][]
    - [connect method][]
    - [fetch_info method][]
    - [Peer Crawler](peer-crawler.html)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

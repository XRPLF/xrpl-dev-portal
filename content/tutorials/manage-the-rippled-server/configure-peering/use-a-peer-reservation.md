# Use a Peer Reservation

A [peer reservation][] is a setting that makes a `rippled` server always accept connections from a peer matching the reservation. The following steps describe how to use peer reservations to maintain a consistent connection from one server to a specific peer, with the permission of the peer server's administrator.

## Prerequisites

These steps describe how to connect `rippled` servers using a peer reservation. This is most useful when the two servers are run by different parties. To complete these steps, you must meet the following prerequisites:

- You have your own `rippled` [installed](install-rippled.html) and running.
- You must have the cooperation of the administrator for the peer `rippled` server.
- The peer `rippled` server must be able to receive incoming peer connections. For instructions on how to configure a firewall to allow this, see [Forward Ports for Peering](forward-ports-for-peering.html).

## Steps

To use a peer reservation, complete the following steps:

### 1. Set up a permanent node key pair

If you have already configured your server with a permanent node key pair value, you can skip ahead to [step 2: Communicate your node public key to the peer's admin](2-communicate-your-node-public-key-to-the-peers-admin). (For example, setting up a permanent node key pair for each server is part of the process of [setting up a server cluster](cluster-rippled-servers.html).)

**Tip:** Setting up a permanent node key pair is optional, but makes it easier to keep the peer reservation set up if you need to erase its databases or move to a new machine. If you don't want to set up a permanent node key pair, you can use your server's automatically-generated node public key as reported in the `pubkey_node` field of the [server_info method][] response.

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

### 2. Communicate your node public key to the peer's admin

Tell the administrator of the peer server what your node public key is. (Use the `validation_public_key` you saved earlier.) The administrator of the peer server needs this value to add the peer reservation for your server.

### 3. (Peer administrator) Add the peer reservation

The administrator of the "peer" server (the one receiving the incoming peering connection) must complete this step.

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

### 4. (Peer administrator) Communicate your current IP address and peer port

The administrator of the "peer" server (the one receiving the incoming peering connection) must tell their server's current IP address and peer port to the other administrator (the one whose server will make the outgoing peering connection). If your server is behind a firewall that does network address translation (NAT), you should provide your server's external IP address. The default config file uses port 51235 for the peer protocol.

### 5. Connect to the peer server

Use the [connect method][] to connect your server to the peer server. For example:

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

If the peer server's administrator has set up the peer reservation as described in the previous steps, this should automatically connect and remain connected as long as possible.


## Next Steps

As the administrator, you can manage the reservations your server has for other peers. (It is not possible to check which servers have configured reservations for you.) You can:

- Add more peer reservations or update their descriptions, using the [peer_reservations_add method][].
- Check which servers you have configured reservations for, using the [peer_reservations_list method][].
- Remove one of your reservations using the [peer_reservations_del method][].
- Check which peers are currently connected and how much bandwidth they have used, using the [peers method][].

**Tip:** Although there is no API method to immediately disconnect from an unwanted peer, you can use a software firewall such as `firewalld` to block an unwanted peer from connecting to your server. For examples, see the community-contributed [rbh script](https://github.com/gnanderson/rbh).



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

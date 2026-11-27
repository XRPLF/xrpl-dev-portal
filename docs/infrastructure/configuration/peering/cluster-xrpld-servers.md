---
html: cluster-xrpld-servers.html
parent: configure-peering.html
seo:
    description: Set up a group of servers that share work for higher efficiency.
labels:
  - Core Server
---
# Cluster xrpld Servers

If you run multiple [`xrpld` servers](../../../concepts/networks-and-servers/index.md) in the same data center, you can configure them in a [cluster](../../../concepts/networks-and-servers/clustering.md) to maximize efficiency. To configure clustering:

1. For each of your servers, note the IP address of the server.

2. For each of your servers, generate a unique seed using the [validation_create method][]. The command is only a convenient key generator here: the seed becomes the server's node identity, and clustering has nothing to do with validating. Stock servers cluster the same way, and no server in the cluster needs a validator key.

    For example, using the commandline interface:

    ```
    $ xrpld validation_create

    Loading: "/etc/xrpld/xrpld.cfg"
    Connecting to 127.0.0.1:5005
    {
       "result" : {
          "status" : "success",
          "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
          "validation_private_key" : "paAtZmp7WHiujj6Pq7UjqBZXk3ZZZvrBJcSKMiYAD5qtVxCW1j1",
          "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
          "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
       }
    }
    ```

    Save the `validation_seed` and `validation_public_key` parameters from each response. Keep the seed secret. The public key isn't secret, and the other cluster members need it.

3. On each server, edit the {% source-link name="config file" path="cfg/xrpld-example.cfg" /%}, modifying the following sections:

    1. In the `[ips_fixed]` section, list the IP address and port of each _other_ member of the cluster. For each of those servers, the port number should match the `protocol = peer` port in that server's `xrpld.cfg` (2459 by default on current versions; 51235 on many older installs). For example:

        ```
        [ips_fixed]
        192.168.0.1 2459
        192.168.0.2 2459
        ```

        This defines specific peer servers to which this server should always attempt to maintain a direct peer-to-peer connection.

        {% admonition type="info" name="Note" %}If you omit the port number, the server uses port 2459, the IANA-assigned port for the XRP Ledger protocol.{% /admonition %}

    2. In the `[node_seed]` section, set the server's node seed to one of the `validation_seed` values you generated using the [validation_create method][] in step 2. Each server must use a unique node seed. For example:

        ```
        [node_seed]
        ssZkdwURFMBXenJPbrpE14b6noJSu
        ```

        This defines the key pair the server uses to sign peer-to-peer communications, excluding validation messages.

    3. In the `[cluster_nodes]` section, set the members of the server's cluster, identified by their `validation_public_key` values. Each server should list the public keys of all _other_ members of the cluster here. A server accepts cluster reports only from peers whose keys are in its own `[cluster_nodes]`, and each report adds every member the reporting server knows, so membership spreads through the servers you trust: if this server lists B and B lists C, this server learns C from B's report and treats C as a member too. A one-sided entry still fails at the first link, because the server that isn't listed rejects the other's reports as coming from a stranger. Listing every member on every server keeps the cluster intact when any one server is down, which is why these steps do it. Optionally, add a custom name for each server. For example:

        ```
        [cluster_nodes]
        n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar keynes
        n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa friedman
        ```

        This defines the key pairs the server uses to recognize members of its cluster.

4. After saving the config file, restart `xrpld` on each server.

    ```
    # systemctl restart xrpld
    ```

5. To confirm that each server is now a member of the cluster, use the [peers method][]. The `cluster` field should list the public keys and (if configured) the custom names for each server.

    For example, using the commandline interface:

    ```
    $ xrpld peers

    Loading: "/etc/xrpld/xrpld.cfg"
    Connecting to 127.0.0.1:5005
    {
      "result" : {
        "cluster" : {
            "n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar": {
              "tag": "keynes",
              "age": 1
            },
            "n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa": {
              "tag": "friedman",
              "age": 1
            }
        },
        "peers" : [
          ... (omitted) ...
        ],
        "status" : "success"
      }
    }
    ```

## See Also

- **Concepts:**
    - [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)
- **Tutorials:**
    - [Install xrpld](../../installation/index.md)
- **References:**
    - [validation_create method][]
    - [peers method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

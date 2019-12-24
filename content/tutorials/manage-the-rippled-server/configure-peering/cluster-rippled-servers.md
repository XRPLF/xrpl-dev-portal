# Cluster rippled Servers

If you run multiple [`rippled` servers](the-rippled-server.html) in the same data center, you can configure them in a [cluster](clustering.html) to maximize efficiency. To configure clustering:

1. For each of your servers, note the IP address of the server.

2. For each of your servers, generate a unique seed using the [validation_create method][].

    For example, using the commandline interface:

        $ rippled validation_create

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

    Save the `validation_seed` and `validation_public_key` parameters from each response somewhere secure.

3. On each server, edit the [config file](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg), modifying the following sections:

    1. In the `[ips_fixed]` section, list the IP address and port of each _other_ member of the cluster. For each of those servers, the port number should match the `protocol = peer` port (usually 51235) from that server's `rippled.cfg`. For example:

            [ips_fixed]
            192.168.0.1 51235
            192.168.0.2 51235

        This defines specific peer servers to which this server should always attempt to maintain a direct peer-to-peer connection.

    2. In the `[node_seed]` section, set the server's node seed to one of the `validation_seed` values you generated using the [validation_create method][] in step 2. Each server must use a unique node seed. For example:

            [node_seed]
            ssZkdwURFMBXenJPbrpE14b6noJSu

        This defines the key pair the server uses to sign peer-to-peer communications, excluding validation messages.

    3. In the `[cluster_nodes]` section, set the members of the server's cluster, identified by their `validation_public_key` values. Each server should list the public keys of all _other_ members of the cluster here. Optionally, add a custom name for each server. For example:

            [cluster_nodes]
            n9McNsnzzXQPbg96PEUrrQ6z3wrvgtU4M7c97tncMpSoDzaQvPar keynes
            n94UE1ukbq6pfZY9j54sv2A1UrEeHZXLbns3xK5CzU9NbNREytaa friedman

        This defines the key pairs the server uses to recognize members of its cluster.

4. After saving the config file, restart `rippled` on each server.

        # systemctl restart rippled

5. To confirm that each server is now a member of the cluster, use the [peers method][]. The `cluster` field should list the public keys and (if configured) the custom names for each server.

    For example, using the commandline interface:

        $ rippled peers

        Loading: "/etc/rippled.cfg"
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

## See Also

- **Concepts:**
    - [Peer Protocol](peer-protocol.html)
- **Tutorials:**
    - [Install rippled](install-rippled.html)
- **References:**
    - [validation_create method][]
    - [peers method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

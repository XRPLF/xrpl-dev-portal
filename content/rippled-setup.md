# Operating rippled Servers #

The core server of the Ripple peer-to-peer network is [`rippled`](rippled-apis.html). Anyone can run their own `rippled` server (also known as a _`rippled` node_) that follows the network and keeps a complete copy of the Ripple ledger. You can even have your server perform validations and participate in the consensus process.


## Types of rippled Servers ##

The `rippled` server software can run in several modes depending on its configuration, including:

* Stock node - follows the network with a local copy of the ledger.
* Validating node - participates in consensus.
* Stand-alone mode - for basic testing.

You can also run `rippled` as a client application for accessing [rippled APIs](rippled-apis.html) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)


## Parallel Networks ##

Most of the time, we describe the Ripple peer-to-peer network as one collective, singular entity -- and that's mostly true. There is one production Ripple peer-to-peer network, and all business that takes place on Ripple occurs within the production network.

However, sometimes you may want to do tests and experiments without interacting with the core network. That's why Ripple Labs started the [Ripple Test Net](https://rippletest.net/), an "alternate universe" network, which can act as a testing ground for applications and the `rippled` server itself, without impacting the business operations of everyday Ripple users. The Ripple Test Net (also known as the AltNet) has a separate supply of TestNet-only XRP, which Ripple Labs gives away for free to parties interested in developing applications on the Test Net. XRP is automatically generated and distributed to wallets for all new accounts on rippletest.net.

**Caution:** Ripple Labs makes no guarantees about the stability of the test network. It has been and continues to be used to test various properties of server configuration, network topology, and network performance.

Over time, there may also be additional, smaller test networks for specific purposes.

### Parallel Networks and Consensus ###

There is no `rippled` setting that defines which network it uses. Instead, it uses the consensus of validators it trusts to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues to operate as a parallel network. Even if malicious or misbehaving nodes connect to both networks, the consensus process overrides the confusion as long as the members of each network are not configured to trust members of another network in excess of their quorum settings.


## Reasons to Run a Stock Node ##

There are lots of reasons you might want to run your own `rippled` server, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it.

It is important that you can trust the `rippled` you use, so you can be certain that the software you are running will behave in the manner specified in its source code. Of course, you must also practice good network security to protect your server from malicious hackers. If you connect to a malicious server, there are myriad ways that it can take advantage of you or cause you to lose money. For example:

* A malicious server could report that you were paid when no such payment was made
* It could selectively show or hide payment paths and currency exchange offers to guarantee its own profit while not providing you the best deal
* If you sent it your account's secret, it could make arbitrary transactions on your behalf, and even transfer or destroy all the money in your account's balances.

Additionally, running your own server gives you admin control over it, which allows you to run important admin-only and load-intensive commands. If you use a shared server, you have to worry about other users of the same server competing with you for the server's computing power. Many of the commands in the WebSocket API can put a lot of strain on the server, so `rippled` has the option to scale back its responses when it needs to. If you share a server with others, you may not always get the best results possible.

Finally, if you run a validating node, you can use a stock node as a proxy to the public network while keeping your validating node on a private subnet only accessible to the outside world through the stock node. This makes it more difficult to compromise the integrity of your validating node.


## Reasons to Run a Validating Node ##

The robustness of the Ripple network depends on an interconnected web of validators who each trust a few other validators _not to collude_. The more operators with different interests there are who run validating nodes, the more certain each member of the network can be that it continues to run impartially. If you or your organization relies on the Ripple peer-to-peer network, it is in your interest to contribute to the consensus process.

Not all `rippled` nodes need to be validating nodes: trusting additional nodes from the same operator does not provide additional protection against collusion. However, an organization may run nodes in multiple regions in order to provide better redundancy in case of natural disasters and other emergencies.

If your organization runs a validating node, you may also run one or more stock nodes, to balance the computing load of API access, or as a proxy between your validation server and the outside network.


## System Requirements ##

A `rippled` server should run comfortably on commodity hardware, to make it easy to participate in the network. At present, we recommend the following:

- Operating System:
    - Production: Ubuntu Linux (latest LTS) supported
    - Development: Mac OS X, Windows (64-bit), or most Linux distributions
- CPU: 64-bit x86_64, 2+ cores
- Disk: Minimum 50GB SSD recommended (500+ IOPS, more is better) for the database partition
- RAM: 4+GB

Amazon EC2's m3.medium or m3.large VM sizes may be appropriate depending on your workload. (Validating nodes need more resources.)

Naturally, a fast network connection is preferable.


## Clustering ##

If you are running multiple `rippled` servers in a single datacenter, you can configure your nodes to operate in a cluster to maximize efficiency. Operating your `rippled` servers in a cluster provides the following benefits:

* Clustered nodes share the work of cryptography. If one node has verified the authenticity of a message, the other nodes in the cluster trust it and do not re-verify.
* Clustered nodes share information about peers and API clients that are misbehaving or abusing the network. This makes it harder to attack all nodes of the cluster at once.
* Clustered nodes always propagate transactions throughout the cluster, even if the transaction does not meet the current load-based transaction fee on some of them.

To enable clustering, modify the following sections of your [config file](https://github.com/ripple/rippled/blob/d7def5509d8338b1e46c0adf309b5912e5168af0/doc/rippled-example.cfg#L297-L346) for each server:

* List the IP addresses of each other node under the `[ips_fixed]` section.
* Generate a unique seed (using the [`validation_create` command](rippled-apis.html#validation-seed)) for each of your nodes, and configure it under the `[node_seed]` section. The `rippled` node uses this key to sign its messages to other nodes in the peer-to-peer network. **Note:** This is a different key than the one `rippled` uses to sign ledger proposals for consensus, but it is in the same format.
* Add the public keys (for peer communication) of each of your other nodes under the `[cluster_nodes]` section.



# Installing rippled #

For development, you can [compile `rippled` from source](https://wiki.ripple.com/Rippled_build_instructions).

Production `rippled` instances can use Ripple Labs' binary executable, available from the Ripple Labs apt-get repository. 

## Installation on Red Hat with yum  ##

This section assumes that you are using Red Hat Enterprise Linux 7.

1. Install the Ripple rpm repository:

        $ sudo rpm -Uvh http://mirrors.ripple.com/ripple-repo-el7.rpm

2. Install the `rippled` software package:

        $ sudo yum install --enablerepo=ripple-stable rippled

3. Configure the `rippled` service to start on system boot:

        $ sudo systemctl enable rippled.service

4. Start the `rippled` service

        $ sudo systemctl start rippled.service

## Installation on Ubuntu with apt ##

This section assumes that you are using Ubuntu 14.04.

1. Install the Ripple apt repository:

        $ sudo apt-get install software-properties-common
        $ sudo apt-add-repository 'deb http://mirrors.ripple.com/ubuntu/ trusty stable contrib'
        $ sudo apt-get update

2. Install the `rippled` package:

        $ sudo apt-get install rippled

3. Start the `rippled` service:

        $ sudo service rippled start

# Configuring rippled #

1. Configure `rippled` in `/etc/rippled/rippled.cfg`:

        [server]
        port_peer
        port_rpc
        port_ws

        [port_peer]
        port = 51235
        ip = 0.0.0.0
        protocol = peer

        [port_rpc]
        port = 51234
        ip = 0.0.0.0
        admin = 127.0.0.1
        protocol = http

        [port_ws]
        port = 51233
        ip = 0.0.0.0
        admin = 127.0.0.1
        protocol = ws

        [ssl_verify]
        0

        [sntp_servers]
        time.windows.com
        time.apple.com
        time.nist.gov
        pool.ntp.org

        [node_db]
        type=nudb
        path=/var/lib/rippled/db/nudb

        [database_path]
        /var/lib/rippled/db

        [debug_logfile]
        /var/log/rippled/debug.log

        [rpc_startup]
        {"command": "log_level", "severity": "warning"}

   See [the rippled GitHub repository](https://github.com/ripple/rippled/blob/develop/doc/rippled-example.cfg) for additional configuration options.

2. (Optional) If connecting to a [parallel network](#parallel-networks), add IP addresses of parallel network nodes to `rippled.cfg`:

  For example the following IP addresses are the current [Ripple Test Net](#parallel-networks) validators:

        [ips]
        52.16.66.76 51235
        52.11.28.194 51235
        54.94.245.104 51235
        52.11.181.30 51235
        52.68.19.29 51235
        41.79.78.42 51235

3. Add trusted validation public keys to `rippled.cfg`:

  The default configuration includes validators operated by Ripple Labs for the production Ripple peer-to-peer network:
  
        [validators]
        n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7 RL1
        n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj RL2
        n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C RL3
        n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS RL4
        n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA RL5

  If you want to connect to the [Ripple Test Net](#parallel-networks), you could add the validation public keys of the Ripple Labs validators on that network instead:

        [validators]
        n9LYyd8eUVd54NQQWPAJRFPM1bghJjaf1rkdji2haF4zVjeAPjT2
        n9KcuH7Y4q4SD3KoS5uXLhcDVvexpnYkwciCbcX131ehM5ek2BB6
        n9LeE7e1c35m96BfFbUu1HKyJfqwiPvwNk6YxT5ewuZYsvwZqprp
        n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr
        n9LXZBs2aBiNsgBkhVJJjDX4xA4DoEBLycF6q8zRhXD1Zu3Kwbe4
        n9MnXUt5Qcx3BuBYKJfS4fqSohgkT79NGjXnZeD9joKvP3A5RNGm

4. Adjust the validation quorum value in `rippled.cfg`:

  This sets the minimum of trusted validations a ledger must have before the server considers it fully validated. Note that if you are validating, your validation counts.

  For example, a validation quorum for a new [Ripple Test Net](#parallel-networks) validator could be set as follows:

        [validation_quorum]
        4

5. Restart rippled:

        $ sudo service rippled restart
        
It can take several minutes for `rippled` to sync with the rest of the network, during which time it outputs warnings about missing ledgers. After that, you have a fully functional stock `rippled` node that you can use for local signing and API access to the Ripple peer-to-peer network.

# Running a Validating Node #

Becoming a validator that participates in the network involves several steps. Initially, the network probably ignores any validations your node provides: this is called being an _untrusted validator_. Later, after the operators of other `rippled` validators add your node to their configuration, your node's validations actually contribute to the consensus process. At this point, you have become a _trusted validator_.


## Validator Setup ##

1. [Install and configure a `rippled` node.](#installing-rippled)

2. Start `rippled`:

        $ sudo service rippled start

3. Generate a validation public key and seed and save the output to a secure place::

        $ rippled --conf /etc/rippled/rippled.cfg -q validation_create
        {
            "status" : "success",
            "validation_key" : "FOLD WERE CHOW WIT SWIM RANK WED DAN LAIN TRIO MURK NELL",
            "validation_public_key" : "n9KHn8NfbBsZV5q8bLfS72XyGqwFt5mgoPbcTV4c6qKiuPTAtXYk",
            "validation_seed" : "ssdecohJMDPFuUPDkmG1w4objZyp4"
        }

4. Add the generated validator signing key from above to your `rippled.cfg`:

        [validation_seed]
        ssdecohJMDPFuUPDkmG1w4objZyp4

5. Restart `rippled` validator:

        $ sudo service rippled restart



## Domain Verification ##

Network participants are unlikely to trust validators without knowing who is operating them. To address this concern, validator operators can associate their validator with a web domain that they operate. [Publishing a ripple.txt](#ripple.txt) and [setting the validator's account domain](#account-domain) allows services like [validators.ripple.com](https://validators.ripple.com) to detect the domain associated with the validator.

### ripple.txt ###

Publish a [ripple.txt](https://wiki.ripple.com/Ripple.txt) page at your domain with a signed SSL certificate.

List the validator's `validation_public_key` (generated [above](#validator-setup) in step 3) in the `[validation_public_key]` section.

### Account domain ###

A master seed can be used to generate both a validation public key and a Ripple account address. Since the same secret key is used for both, whoever operates the validator also controls the account with the corresponding address. (The validator's public key and the account address both represent the public key for the same keypair.)

The steps below describe how to set the domain field of a validator's Ripple account.

1. Get the validator's account address using the `validation_seed` generated [above](#validator-setup) in step 3:

        $ rippled wallet_propose ssdecohJMDPFuUPDkmG1w4objZyp4
        {
           "result" : {
              "account_id" : "rU7bM9ENDkybaxNrefAVjdLTyNLuue1KaJ",
              "key_type" : "secp256k1",
              "master_key" : "FOLD WERE CHOW WIT SWIM RANK WED DAN LAIN TRIO MURK NELL",
              "master_seed" : "ssdecohJMDPFuUPDkmG1w4objZyp4",
              "master_seed_hex" : "434256443542C27BD1A84A2BACC9B8F0",
              "public_key" : "aBQzwnRdgHVZmr8gLNugihTf5NsWAUpayGdAHtz8YPk1w3L4fh6S",
              "public_key_hex" : "038ED9785EE7FC687445E0D94065A74FF6CEC6506A03C7380075D81A2B9E7E8681",
              "status" : "success"
           }
        }

2. Fund the account by sending it at least 25 XRP.

3. Set the `Domain` field of the account to match the domain hosting your ripple.txt.

  For example, this can be done using [ripple-cli](https://www.npmjs.com/package/ripple-cli):

        $ ripple-cli account_set_domain mycooldomain.com
        {
            "engine_result": "tesSUCCESS",
            "engine_result_code": 0,
            "engine_result_message": "The transaction was applied. Only final in a validated ledger.",
            "ledger_hash": "876BC104F7EB386B929E5AD44F14EFA47FE5EB471EA00D70DDA69AE6119193B0",
            "ledger_index": 1337445,
            "metadata": {
              ...
            }
        }

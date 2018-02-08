# Operating rippled Servers

The core server of the XRP Ledger peer-to-peer network is [`rippled`](reference-rippled.html). Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger. You can even have your server take part in the consensus process.

This page contains instructions for:

* [Installing `rippled`](#installing-rippled)
* [Participating in the Consensus Process](#running-a-validator)


## Types of rippled Servers

The `rippled` server software can run in several modes depending on its configuration, including:

* Stock server - follows the network with a local copy of the ledger.
* Validating server, or _validator_ for short - participates in consensus.
* `rippled` server in stand-alone mode - for testing. Does not communicate to other `rippled` servers.

You can also run the `rippled` executable as a client application for accessing [`rippled` APIs](reference-rippled.html) locally. (Two instances of the same binary can run side-by-side in this case; one as a server, and the other running briefly as a client and then terminating.)


## Reasons to Run a Stock Server

There are lots of reasons you might want to run your own `rippled` server, but most of them can be summarized as: you can trust your own server, you have control over its workload, and you're not at the mercy of others to decide when and how you can access it. Of course, you must practice good network security to protect your server from malicious hackers.

You need to trust the `rippled` you use. If you connect to a malicious server, there are many ways that it can take advantage of you or cause you to lose money. For example:

* A malicious server could report that you were paid when no such payment was made.
* It could selectively show or hide payment paths and currency exchange offers to guarantee its own profit while not providing you the best deal.
* If you sent it your address's secret key, it could make arbitrary transactions on your behalf, and even transfer or destroy all the money your address holds.

Additionally, running your own server gives you admin control over it, which allows you to run important admin-only and load-intensive commands. If you use a shared server, you have to worry about other users of the same server competing with you for the server's computing power. Many of the commands in the WebSocket API can put a lot of strain on the server, so `rippled` has the option to scale back its responses when it needs to. If you share a server with others, you may not always get the best results possible.

Finally, if you run a validating server, you can use a stock server as a proxy to the public network while keeping your validating server on a private subnet only accessible to the outside world through the stock server. This makes it more difficult to compromise the integrity of your validating server.


## Reasons to Run a Validator

The robustness of the XRP Ledger depends on an interconnected web of validators who each trust a few other validators _not to collude_. The more operators with different interests there are who run validators, the more certain each member of the network can be that it continues to run impartially. If you or your organization relies on the XRP Ledger, it is in your interest to contribute to the consensus process.

Not all `rippled` servers need to be validators: trusting more servers from the same operator does not offer better protection against collusion. An organization might run validators in multiple regions for redundancy in case of natural disasters and other emergencies.

If your organization runs a validating server, you may also run one or more stock servers, to balance the computing load of API access, or as a proxy between your validation server and the outside network.

### Properties of a Good Validator

There are several properties that define a good validator. The more of these properties your server embodies, the more reason others have to include your server in their list of trusted validators:

* **Availability**. An ideal validator should always be running, submitting validation votes for every proposed ledger.
    * Strive for 100% uptime.
* **Agreement**. A validator's votes should match the outcome of the consensus process as often as possible. To do otherwise could indicate that the validator's software is outdated, buggy, or intentionally biased.
    * Always run the latest `rippled` release without modifications.
* **Timeliness**. A validator's votes should arrive quickly, and not after a consensus round has already finished.
    * A fast internet connection helps with this.
* **Identified**. It should be clear who runs the validator. Ideally, a list of trusted validators should include validators operated by different owners in multiple legal jurisdictions and geographic areas, to reduce the chance that any localized events could interfere with the validator's impartial operation.
    * Setting up [Domain Verification](#domain-verification) is a good start.

At present, Ripple (the company) cannot recommend any validators aside from those in the default validator list. However, we are collecting data on other validators and building tools to report on their performance. For metrics on validators, see [validators.ripple.com](https://validators.ripple.com).


# Installing rippled

For development, you can [compile `rippled` from source](https://wiki.ripple.com/Rippled_build_instructions).

Production `rippled` instances can [use Ripple's binary executable](#installation-on-centosred-hat-with-yum), available from the Ripple [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) repository.

## System Requirements

A `rippled` server should run comfortably on commodity hardware, to make it inexpensive to participate in the network. At present, we recommend the following:

- Operating System:
    - Production: CentOS or RedHat Enterprise Linux (latest release) or Ubuntu (15.04+) supported
    - Development: Mac OS X, Windows (64-bit), or most Linux distributions
- CPU: 64-bit x86_64, 2+ cores
- Disk: Minimum 50GB SSD recommended (500+ IOPS, more is better) for the database partition
- RAM: 4+GB

Amazon EC2's m3.large VM size may be appropriate depending on your workload. (Validating servers need more resources.)

Naturally, a fast network connection is preferable.


## Installation on CentOS/Red Hat with yum

This section assumes that you are using CentOS 7 or Red Hat Enterprise Linux 7.

1. Install the Ripple RPM repository:

        $ sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm

2. Install the `rippled` software package:

        $ sudo yum install --enablerepo=ripple-stable rippled

3. Configure the `rippled` service to start on system boot:

        $ sudo systemctl enable rippled.service

4. Start the `rippled` service

        $ sudo systemctl start rippled.service

## Installation on Ubuntu with alien

This section assumes that you are using Ubuntu 15.04 or later.

1. Install yum-utils and alien:

        $ sudo apt-get update
        $ sudo apt-get install yum-utils alien

2. Install the Ripple RPM repository:

        $ sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm

3. Download the `rippled` software package:

        $ yumdownloader --enablerepo=ripple-stable --releasever=el7 rippled

4. Verify the signature on the `rippled` software package:

        $ sudo rpm --import https://mirrors.ripple.com/rpm/RPM-GPG-KEY-ripple-release && rpm -K rippled*.rpm

5. Install the `rippled` software package:

        $ sudo alien -i --scripts rippled*.rpm && rm rippled*.rpm

6. Configure the `rippled` service to start on system boot:

        $ sudo systemctl enable rippled.service

7. Start the `rippled` service

        $ sudo systemctl start rippled.service

## Postinstall

It can take several minutes for `rippled` to sync with the rest of the network, during which time it outputs warnings about missing ledgers. After that, you have a fully functional stock `rippled` server that you can use for local signing and API access to the XRP Ledger.

[rippled commands](reference-rippled.html#list-of-public-commands) can be run with:

        $ /opt/ripple/bin/rippled <command>


## Updating rippled

You can subscribe to the [rippled Google Group](https://groups.google.com/forum/#!forum/ripple-server) to receive notifications of new `rippled` releases.

### Automatic Update on CentOS/Red Hat

Automatic rippled updates can be enabled with a one-time Cron configuration:

1. Check that `/opt/ripple/bin/update-rippled.sh` exists. If it does not, [update manually](#manual-update-on-centosred-hat).

2. Install `crond`:

        $ sudo yum install cronie

3. Open the crontab file for editing

        $ sudo crontab -e

4. Add the following to the crontab file. Be sure to add a blank line at the end of the file.

        RANDOM_DELAY=59
        0 * * * * /opt/ripple/bin/update-rippled.sh


The script updates the installed `rippled` package within an hour of each new release.

### Manual Update on CentOS/Red Hat

Run the following commands to update to the latest release of `rippled`:

        $ sudo rpm -Uvh --replacepkgs https://mirrors.ripple.com/ripple-repo-el7.rpm
        $ sudo yum update --enablerepo=ripple-stable rippled
        $ sudo systemctl daemon-reload
        $ sudo service rippled restart

### Manual Update on Ubuntu

Run the following commands to update to the latest release of `rippled`:

        $ sudo rpm -Uvh --replacepkgs https://mirrors.ripple.com/ripple-repo-el7.rpm
        $ yumdownloader --enablerepo=ripple-stable --releasever=el7 rippled
        $ rpm -K rippled*.rpm
        $ sudo alien -i --scripts rippled*.rpm
        $ sudo systemctl daemon-reload
        $ sudo service rippled restart


# Running a Validator

Running a `rippled` validator that participates in the Consensus process is simple:

1. [Enable validation](#validator-setup) on your `rippled` server.
    * At first, your server is an _untrusted validator_. Others can see the validations your server issues, but they disregard them in the consensus process.
2. Share the public key with the public, especially other `rippled` operators.
3. When other `rippled` operators add your public key to their list of trusted servers, you have become a _trusted validator_.
    * Also see [Properties of a Good Validator](#properties-of-a-good-validator) for best practices.


## Validator Setup

The `validator-keys` tool (included in the `rippled` RPM) is the recommended means to securely generate and manage your validator keys.

1. [Install a `rippled` server.](#installing-rippled)

2. Generate a validator key pair:

        $ /opt/ripple/bin/validator-keys create_keys

    **Warning:** Store the generated `validator-keys.json` key file in a secure but recoverable location, such as an encrypted USB flash drive. Do not modify its contents.

3. Generate a validator token and edit your `rippled.cfg` file to add the `[validator_token]` value.

        $ /opt/ripple/bin/validator-keys create_token --keyfile /path/to/your/validator-keys.json

    If you had previously configured your validator without using the `validator-keys` tool, you must also delete the `[validation_seed]` from your `rippled.cfg` file. This changes your validator public key.

4. Start `rippled`:

        $ sudo service rippled restart

See [the `validator-keys-tool` GitHub repository](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md) for more information about managing validator keys.


## Public-Facing Server

To protect a production validator from [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) attacks, you can use a stock `rippled` server as a proxy between the validator and the outside network.

1. [Set up the `rippled` validator.](#validator-setup)

2. [Set up one or more stock `rippled` servers.](#installing-rippled)

3. Configure the validator and stock `rippled` servers to be [clustered](#clustering) with each other.

4. Make the following configuration changes to your validator:
    * Copy the `[ips_fixed]` list and paste it under `[ips]`. These fields should contain only the IP addresses and ports of the public-facing rippled(s). The validator connects to only these peers.
    * Change `[peer_private]` to `1` to prevent its IP address from being forwarded.

5. Configure the validator host machine's firewall to only accept inbound connections from its public-facing rippled(s).

Remember to restart `rippled` for config changes to take effect.

Take care not to publish the IP address of your validator.


## Domain Verification

Network participants are unlikely to trust validators without knowing who is operating them. To address this concern, validator operators can associate their validator with a web domain that they control.

1. Find your validator public key by running the following on the validator server:

        $ /opt/ripple/bin/rippled server_info -q | grep pubkey_validator

2. Sign the validator public key (from step 1) using the SSL private key used for your domain. The SSL private key file does not need to be stored on the validator server.

        $ openssl dgst -sha256 -hex -sign /path/to/your/ssl.key <(echo <your-validator-public-key>)

3. Using `validator-keys` tool (included in the `rippled` RPM), sign the domain name:

        $ /opt/ripple/bin/validator-keys --keyfile /path/to/your/validator-keys.json sign <your-domain-name>

4. In order to have the verified validator domain published, email <validators@ripple.com> with both signatures as well as the validator public key and domain name.


# Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file (located at `/opt/ripple/etc/rippled.cfg` when installing `rippled` with yum).

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/develop/doc/rippled-example.cfg) for a description of all configuration options.

Changes to the `[debug_logfile]` or `[database_path]` sections may require you to give the `rippled` user and group ownership to your new configured path:

        $ chown -R rippled:rippled <configured path>

Restart `rippled` for any configuration changes to take effect:

        $ sudo service rippled restart


## Parallel Networks

Most of the time, we describe the XRP Ledger as one collective, singular entity -- and that's mostly true. There is one production XRP Ledger peer-to-peer network, and all business that takes place on the XRP Ledger occurs within the production network.

However, sometimes you may want to do tests and experiments without interacting with the core network. That's why Ripple started the [Ripple Test Net](https://ripple.com/build/ripple-test-net/), an "alternate universe" network, which can act as a testing ground for applications and the `rippled` server itself, without impacting the business operations of everyday XRP Ledger users. The Ripple Test Net (also known as the AltNet) has a separate supply of TestNet-only XRP, which Ripple [gives away for free](https://ripple.com/build/ripple-test-net/) to parties interested in developing applications on the Test Net.

**Caution:** Ripple makes no guarantees about the stability of the test network. It has been and continues to be used to test various properties of server configuration, network topology, and network performance.

Over time, there may also be smaller, temporary test networks for specific purposes.

### Parallel Networks and Consensus

There is no `rippled` setting that defines which network it uses. Instead, it uses the consensus of validators it trusts to know which ledger to accept as the truth. When different consensus groups of `rippled` instances only trust other members of the same group, each group continues as a parallel network. Even if malicious or misbehaving computers connect to both networks, the consensus process overrides the confusion as long as the members of each network are not configured to trust members of another network in excess of their quorum settings.


## Clustering

If you are running multiple `rippled` servers in a single datacenter, you can configure those servers into a cluster to maximize efficiency. Running your `rippled` servers in a cluster provides the following benefits:

* Clustered `rippled` servers share the work of cryptography. If one server has verified the authenticity of a message, the other servers in the cluster trust it and do not re-verify.
* Clustered servers share information about peers and API clients that are misbehaving or abusing the network. This makes it harder to attack all servers of the cluster at once.
* Clustered servers always propagate transactions throughout the cluster, even if the transaction does not meet the current load-based transaction fee on some of them.

To enable clustering, change the following sections of your [config file](https://github.com/ripple/rippled/blob/d7def5509d8338b1e46c0adf309b5912e5168af0/doc/rippled-example.cfg#L297-L346) for each server:

* List the IP address and port of each other server under the `[ips_fixed]` section. The port should be the one from the other servers' `protocol = peer` setting in their `rippled.cfg`. Example:

        [ips_fixed]
        192.168.0.1 51235
        192.168.0.2 51235

* Generate a unique seed (using the [`validation_create` command](reference-rippled.html#validation-seed)) for each of your servers, and configure it under the `[node_seed]` section. The `rippled` server uses this key to sign its messages to other servers in the peer-to-peer network.

* Add the public keys (for peer communication) of each of your other servers under the `[cluster_nodes]` section.

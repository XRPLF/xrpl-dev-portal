# rippled Setup

The core server of the XRP Ledger peer-to-peer network is [`rippled`](concept-rippled.html). Anyone can run their own `rippled` server that follows the network and keeps a complete copy of the XRP Ledger. You can even have your server take part in the consensus process.

This page contains instructions for:

* [Capacity Planning for `rippled`](#capacity-planning)
* [Installing `rippled`](#installing-rippled)
* [Validator Setup](#running-a-validator)
* [Clustering Setup](#clustering)


{% include 'snippets/capacity-planning.md' %}

# Installing rippled

Production `rippled` instances can [use Ripple's binary executable](#installation-on-centosred-hat-with-yum), available from the Ripple [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) repository.

For development, you can [compile `rippled` from source](https://github.com/ripple/rippled/tree/master/Builds).


## Minimum System Requirements

A `rippled` server should run comfortably on commodity hardware, to make it inexpensive to participate in the network. At present, we recommend the following minimum requirements:

- Operating System:
    - Production: CentOS or RedHat Enterprise Linux (latest release) or Ubuntu (16.04+) supported
    - Development: Mac OS X, Windows (64-bit), or most Linux distributions
- CPU: 64-bit x86_64, 2+ cores
- Disk: Minimum 50GB SSD recommended (1000 IOPS, more is better) for the database partition
- RAM:
    - Testing: 8GB+
    - Production: 32 GB

Amazon EC2's `m3.large` VM size may be appropriate depending on your workload. A fast network connection is preferable. Any increase in a server's client-handling load increases resources needs.

**Tip:** For recommendations beyond the minimum requirements, see [Capacity Planning](#capacity-planning).

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

[rippled commands](reference-rippled-api-public.html) can be run with:

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
    * Also see [Properties of a Good Validator](concept-rippled.html#properties-of-a-good-validator) for best practices.


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

4. To have the verified validator domain included on [XRP Charts](https://xrpcharts.ripple.com/#/validators), submit this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLScszfq7rRLAfArSZtvitCyl-VFA9cNcdnXLFjURsdCQ3gHW7w/viewform) with your validator's information.


# Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file (located at `/opt/ripple/etc/rippled.cfg` when installing `rippled` with yum). For recommendations about configuration settings, see [Capacity Planning](#capacity-planning).

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/master/doc/rippled-example.cfg) for a description of all configuration options.

Changes to the `[debug_logfile]` or `[database_path]` sections may require you to give the `rippled` user and group ownership to your new configured path:

        $ chown -R rippled:rippled <configured path>

Restart `rippled` for any configuration changes to take effect:

        $ sudo service rippled restart


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

* Generate a unique seed (using the [`validation_create` command](reference-rippled-api-admin.html#validation-seed)) for each of your servers, and configure it under the `[node_seed]` section. The `rippled` server uses this key to sign its messages to other servers in the peer-to-peer network.

* Add the public keys (for peer communication) of each of your other servers under the `[cluster_nodes]` section.

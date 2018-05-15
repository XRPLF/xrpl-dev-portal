# Run rippled as a Validator

Running a `rippled` validator that participates in the Consensus process is simple:

1. [Enable validation](run-rippled-as-a-validator.html) on your `rippled` server.
    * At first, your server is an _untrusted validator_. Others can see the validations your server issues, but they disregard them in the consensus process.
2. Share the public key with the public, especially other `rippled` operators.
3. When other `rippled` operators add your public key to their list of trusted servers, you have become a _trusted validator_.
    * Also see [Properties of a Good Validator](rippled-server-modes.html#properties-of-a-good-validator) for best practices.


## Validator Setup

The `validator-keys` tool (included in the `rippled` RPM) is the recommended means to securely generate and manage your validator keys.

1. [Install a `rippled` server.](install-rippled.html)

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

1. [Set up the `rippled` validator.](run-rippled-as-a-validator.html)

2. [Set up one or more stock `rippled` servers.](install-rippled.html)

3. Configure the validator and stock `rippled` servers to be [clustered](cluster-rippled-servers.html) with each other.

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

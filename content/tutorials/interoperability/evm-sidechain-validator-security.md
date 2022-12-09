---
html: evm-sidechain-validator-security.html
parent: join-evm-sidechain-devnet.html
blurb: Learn how to join the XRP Ledger EVM Sidechain Devnet.
labels:
  - Development, Interoperability
status: not_enabled
---
# EVM Sidechain Validator Security

Each validator candidate is encouraged to run its operations independently, as diverse setups increase the resilience of the network. Validator candidates should begin their setup phase now, to be on time for launch.

## Horcrux

Horcrux is a [multi-party-computation (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) signing service for Tendermint nodes.
 
- Composed of a cluster of signer nodes in place of the [remote signer](https://docs.tendermint.com/master/nodes/remote-signer.html), thereby enabling High Availability (HA) for block signing through fault tolerance.
- Secures your validator private key by splitting it across multiple private signer nodes using threshold Ed25519 signatures.
- Adds security and availability without sacrificing block sign performance.

For information on how to upgrade your validator infrastructure with Horcrux, refer to the [documentation](https://github.com/strangelove-ventures/horcrux/blob/main/docs/migrating.md). 

## Tendermint KMS

Tendermint KMS is a signature service with support for Hardware Security Modules (HSMs), such as YubiHSM 2 and Ledger Nano. It is intended to be run alongside XRP Ledger EVM Sidechain validators, ideally on separate physical hosts, providing defense-in-depth for online validator signing keys, double signing protection, and a central signing service that can be used when running multiple validators in several zones. <!-- SPELLING_IGNORE: kms, hsms, yubihsm, yubikey -->

## Hardware Security Modules (HSM)

You must ensure that an attacker cannot steal a validator's key. Otherwise, the entire stake delegated to the compromised validator at risk. Hardware security modules (HSM) help mitigate this risk.

HSMs must support **`ed25519` signatures for Evmos**. The [YubiHSM 2](https://www.yubico.com/products/hardware-security-module/) supports `ed25519` and can be used with this YubiKey [library](https://github.com/iqlusioninc/yubihsm.rs). <!-- SPELLING_IGNORE: evmos -->

**IMPORTANT**: The YubiHSM can protect a private key but **cannot ensure** in a secure setting that it will not sign the same block twice. <!-- STYLE_OVERRIDE: will -->

## Sentry Nodes (DDOS Protection)

Validators are responsible for ensuring that the network can sustain denial of service attacks.

One recommended way to mitigate these risks is for validators to carefully structure their network topology in a sentry node architecture.

Validator nodes should only connect to full-nodes they trust; either they run these nodes themselves, or the nodes are run by other validator administrators they know personally. A validator node typically runs in a data center. Most data centers provide direct links to the networks of major cloud providers. The validator can use those links to connect to sentry nodes in the cloud. This shifts the burden of denial-of-service from the validator's node directly to its sentry nodes, and might require new sentry nodes be spun up or activated to mitigate attacks on existing ones.

Sentry nodes can be quickly spun up or change their IP addresses. Because the links to the sentry nodes are in private IP space, an internet-based attacked cannot disturb them directly. This ensures that the validator's block proposals and votes always make it to the rest of the network.

To set up your sentry node architecture:

1. Edit your validator node's `config.toml` file:

```sql
#Comma separated list of nodes to keep persistent connections to
#Do not add private peers to this list if you don't want them advertised
persistent_peers =[list of sentry nodes]

# Set true to enable the peer-exchange reactor
pex = false
```

2. Edit your sentry node's `config.toml` file:

```sql
#Comma separated list of peer IDs to keep private (will not be gossiped to other peers)
#Example ID: 3e16af0cead27979e1fc3dac57d03df3c7a77acc@3.87.179.235:26656

private_peer_ids = "node_ids_of_private_peers"
```
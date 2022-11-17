---
html: join-evm-sidechain-devnet.html
parent: evm-sidechains.html
blurb: Learn how to join the XRP Ledger EVM Sidechain Devnet.
labels:
  - Development, Interoperability
status: not_enabled
---
# Join the XRP Ledger EVM Sidechain Devnet

This tutorial walks you through the steps to join the existing **XRP Ledger EVM Sidechain Devnet**. 

For ease of use, create an alias, `exprd`, to run all commands inside your Docker container. 

## Pre-requisites

Before proceeding to initialize the node, ensure that the following pre-requisites are installed and running:

* Docker 19+
* Create an alias to run all commands in this tutorial inside a Docker container: 

    ```bash
    alias exrpd="docker run -it --rm -v ~/.exrpd:/root/.exrpd peersyst/xrp-evm-client:latest exrpd"
    ```

## Initialize Node

The first task is to initialize the node, which creates the necessary validator and node configuration files. 

1. Initialize the chain parameters using the following command:

    ```bash
    exrpd config chain-id exrp_1440001-1
    ```

2. Create or add a key to your node. For this tutorial, we use the `test` keyring:

    ```bash
    exrpd keys add <key_name> --keyring-backend test
    ```

    Note the `key_name` you enter as you need to reference it in subsequent steps.

    **Note** For more information on a more secure setup for your validator, refer to [cosmos-sdk keys and keyrings](https://docs.cosmos.network/v0.46/run-node/keyring.html) and [validator security](evm-sidechain-validator-security.html).


3. Initialize the node using the following command:

    ```bash
    exrpd init <your_custom_moniker> --chain-id exrp_1440001-1
    ```

    Monikers can contain only ASCII characters. Using Unicode characters renders your node unreachable.

All these commands create your `~/.exrpd` (i.e `$HOME`) directory with subfolders `config/` and `data/`. In the `config` directory, the most important files for configuration are `app.toml` and `config.toml`.

## Genesis & Seeds

1. Copy the Genesis File.

    Download the `genesis.json` file from here and copy it to the `config` directory: `~/.exrpd/config/genesis.json`. This is a genesis file with the chain-id and genesis accounts balances.

        ```bash
        wget [https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/devnet/genesis.json](https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/devnet/genesis.json) ~/.exrpd/config/
        ```

    Verify the genesis configuration file:

        ```bash
        exrpd validate-genesis
        ```

2. Add Persistent Peer Nodes

    Set the [`persistent_peer`](https://docs.tendermint.com/master/tendermint-core/using-tendermint.html#persistent-peer)s field in `~/.exrpd/config/config.toml` to specify peers with which your node maintains persistent connections. You can retrieve them from the list of available peers on the archive repo ([https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/devnet/peers.txt](https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/devnet/peers.txt)).

    To get a list of entries from the `peers.txt` file in the `PEERS` variable, run the following command:

        ```bash
        PEERS=`curl -sL https://raw.githubusercontent.com/Peersyst/xrp-evm-archive/main/devnet/peers.txt | sort -R | head -n 10 | awk '{print $1}' | paste -s -d, -`
        ```

    Use `sed` to include them in the configuration. You can also add them manually:

        ```bash
        sed -i.bak -e "s/^persistent_peers *=.*/persistent_peers = \"$PEERS\"/" ~/.exrpd/config/config.toml
        ```

## Run a Devnet Validator Node

Run the Devnet validator node using following command:

```bash
exrpd tx staking create-validator \
  --amount=1000000000000axrp \
  --pubkey=$(exrpd tendermint show-validator) \
  --moniker="<your_custom_moniker>" \
  --chain-id=<chain_id> \
  --commission-rate="0.05" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1000000" \
  --gas="auto" \
  --gas-prices="0.025axrp" \
  --from=<key_name>
```

**Note** For more information on running a validator note, see [Run a validator](evm-sidechain-run-a-validator-node.html)


## Start the Node

Start the node. 

```bash
exrpd start
```

Once enough voting power (+2/3) from the genesis validators is up-and-running, the node starts producing blocks.
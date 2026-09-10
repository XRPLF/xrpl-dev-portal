---
seo:
    description: Spin up a local XRP Ledger sandbox for development and experimentation using xrpl-up.
top_nav_name: xrpl-up
top_nav_grouping: Get Started
labels:
  - Development
---

# Get Started with xrpl-up

`xrpl-up` is a CLI tool that lets you interact with the XRP Ledger from your terminal — no code required to get started. It spins up a local sandbox on your machine where you can send transactions, create accounts, and experiment with XRPL features using simple commands.

The local sandbox runs a real XRP Ledger node on your machine using Docker. It comes with pre-funded accounts so you can start experimenting immediately. The same commands also work against Testnet and Devnet.

## Goals

In this tutorial, you'll learn how to use `xrpl-up` to interact with the XRP Ledger in a development environment. This includes:

- Installing and setting up `xrpl-up` for local or Testnet development.
- Submitting transactions and querying accounts via CLI — no code required.
- Running scripts against a local sandbox or Testnet for more complex workflows.
- Experimenting with XRPL features like payments, AMM, NFTs, and the DEX in a sandbox environment.

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- [Docker](https://www.docker.com/) (required for local sandbox mode)

## Steps

### 1. Install xrpl-up

Install `xrpl-up` globally from npm:

```bash
npm install -g xrpl-up
```

Once installed, run `xrpl-up --help` to see all available commands:

```bash
xrpl-up --help
```

### 2. Start the Sandbox

Start a local XRP Ledger node with 10 pre-funded accounts:

```bash
xrpl-up start
```

{% admonition type="info" name="Note" %}
The first time you run this, Docker pulls the rippled image (~1 GB). Subsequent starts are fast.
{% /admonition %}

Once running, verify the sandbox is healthy:

```bash
xrpl-up status
```

This shows the rippled version, current ledger index, and faucet availability.

### 3. View Your Accounts

In a new terminal, list all pre-funded accounts with their addresses and XRP balances:

```bash
xrpl-up accounts
```

Each account has:
- An **address** (e.g. `rHb9CJA...`) — the public identifier, like a bank account number.
- A **seed** (e.g. `sn3nxiW7...`) — the private key used to sign transactions. Keep this secret.

### 4. Send a Payment

Pick two accounts from the list above — one as sender, one as receiver. Use the sender's seed and receiver's address:

```bash
xrpl-up payment --to <destination-address> --amount <amount> --node local --seed <sender-seed>
```

Then verify the balances updated:

```bash
xrpl-up account balance <address> --node local
```

### 5. Scaffold a Project and Run Scripts

To go further, scaffold a project with ready-to-run example scripts that cover more XRPL features:

```bash
xrpl-up init my-project
cd my-project && npm install
```

When prompted for a default network, choose **local**. The project includes example scripts covering payments, tokens, NFTs, AMM, and the DEX.

Run any script against the sandbox:

```bash
xrpl-up run scripts/<your-script>.ts
```

`xrpl-up run` automatically injects the network connection so your scripts don't need to hardcode any endpoint:

| Variable | Example value |
|----------|---------------|
| `XRPL_NETWORK_URL` | `ws://localhost:6006` |
| `XRPL_NETWORK` | `local` |
| `XRPL_NETWORK_NAME` | `Local rippled (Docker)` |

### 6. Stop the Sandbox

When you're done:

```bash
xrpl-up stop
```

To wipe all state and start fresh next time:

```bash
xrpl-up reset
```

## Next Steps

For full `xrpl-up` documentation including snapshots, amendments, CI/CD, and all available commands, see the [xrpl-up README](https://github.com/ripple/xrpl-up#readme).

Explore the [xrpl-up examples](https://github.com/ripple/xrpl-up/tree/main/examples) for step-by-step walkthroughs:

- [Issue a Token](https://github.com/ripple/xrpl-up/blob/main/examples/simple/issued-token.md)
- [Mint an NFT](https://github.com/ripple/xrpl-up/blob/main/examples/simple/nft.md)
- [Create an AMM](https://github.com/ripple/xrpl-up/blob/main/examples/simple/amm.md)
- [Trade on the DEX](https://github.com/ripple/xrpl-up/blob/main/examples/simple/dex.md)
- [Open an Escrow](https://github.com/ripple/xrpl-up/blob/main/examples/simple/escrow.md)
- [Payment Channels](https://github.com/ripple/xrpl-up/blob/main/examples/simple/payment-channel.md)
- [Multi-Purpose Tokens](https://github.com/ripple/xrpl-up/blob/main/examples/simple/mpt.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

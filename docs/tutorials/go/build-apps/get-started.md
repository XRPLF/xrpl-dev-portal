---
seo:
  description: Build a Go application that interacts with the XRP Ledger.
labels:
  - Development
---

# Get Started Using Go Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`xrpl-go`](https://github.com/Peersyst/xrpl-go), a pure Go library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Learning Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `xrpl-go`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl-go`.
- How to use the `xrpl-go` library to look up information about an account on the XRP Ledger.

## Requirements

To follow this tutorial, you should have Go version `1.22.0` or later installed.
[Download latest Go version](https://go.dev/dl/).

## Installation

The [`xrpl-go` library](https://github.com/Peersyst/xrpl-go) is available on [pkg.go.dev](https://pkg.go.dev/github.com/Peersyst/xrpl-go).

Start a new project (or use an existing one) and install the `xrpl-go` library via Go modules:

```bash
# Initialize your module (if you haven't already)
go mod init your-module-name

# Fetch the latest version of xrpl-go
go get -u github.com/Peersyst/xrpl-go
```

## Start Building

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP to your [account](../../../concepts/accounts/index.md), integrating with the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md), or [issuing tokens](../../../concepts/tokens/index.md). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1.-connect-to-the-xrp-ledger)
2. [Get an account.](#2.-get-account)
3. [Query the XRP Ledger.](#3.-query-the-xrp-ledger)

### 1. Connect to the XRP Ledger

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl-go`, you have two main options:

1. Via WebSocket:

   {% code-snippet file="/_code-samples/get-started/go/base/ws/main.go" from="func main()" language="go" /%}

2. Via RPC:

   {% code-snippet file="/_code-samples/get-started/go/base/rpc/main.go" from="func main()" language="go" /%}

#### Connect to the production XRP Ledger

The sample code in the previous section shows you how to connect to the Testnet, which is a [parallel network](../../../concepts/networks-and-servers/parallel-networks.md) for testing where the money has no real value. When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

- By [installing the core server](../../../infrastructure/installation/index.md) (`rippled`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../../infrastructure/configuration/connect-your-rippled-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

  ```go
  import "github.com/Peersyst/xrpl-go/xrpl/websocket"

  const MY_SERVER = "ws://localhost:6006/"

  func main() {
    client := websocket.NewClient(websocket.NewClientConfig().WithHost(MY_SERVER))

    // ... custom code goes here
  }
  ```

  See the example [core server config file](https://github.com/XRPLF/rippled/blob/c0a0b79d2d483b318ce1d82e526bd53df83a4a2c/cfg/rippled-example.cfg#L1562) for more information about default values.

- By using one of the available [public servers][]:

  ```go
  import "github.com/Peersyst/xrpl-go/xrpl/websocket"

  const PUBLIC_SERVER = "wss://xrplcluster.com/"

  func main() {
    client := websocket.NewClient(websocket.NewClientConfig().WithHost(PUBLIC_SERVER))

    // ... custom code goes here
  }
  ```

### 2. Get account

In `xrpl-go`, account creation and key management live in the `wallet` package, and on Testnet you can use the built-in faucet provider on your WebSocket (or RPC) client to fund a brand-new account immediately.

On Testnet, you can fund a new ED25519 account like this:

```go
w, err := wallet.New(crypto.ED25519())
if err != nil {
	fmt.Println(err)
	return
}
if err := client.FundWallet(&w); err != nil {
	fmt.Println(err)
	return
}
```

This constructor returns a Go `Wallet` value with the following fields:

```go
type Wallet struct {
    PublicKey      string          // the hex-encoded public key
    PrivateKey     string          // the hex-encoded private key
    ClassicAddress types.Address   // the XRPL “r…” address
    Seed           string          // the base58 seed
}
```

If you already have a seed encoded in [base58][], you can make a `Wallet` instance from it like this:

```go
  w, err := wallet.FromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9", "")
```

### 3. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](../../../references/http-websocket-apis/public-api-methods/account-methods/index.md), [a specific transaction](../../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md), the state of a [current or a historical ledger](../../../references/http-websocket-apis/public-api-methods/ledger-methods/index.md), and [the XRP Ledger's decentralized exchange](../../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/index.md). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](../../../concepts/transactions/reliable-transaction-submission.md).

Use the Client's `Request()` method to access the XRP Ledger's [WebSocket API](../../../references/http-websocket-apis/api-conventions/request-formatting.md). For example:

{% code-snippet file="/_code-samples/get-tx/go/main.go" from="// Get the latest validated ledger" language="go" /%}

Or, use the getter methods from the [`websocket`](https://pkg.go.dev/github.com/Peersyst/xrpl-go@v0.1.12/xrpl/websocket) or [`rpc`](https://pkg.go.dev/github.com/Peersyst/xrpl-go@v0.1.12/xrpl/rpc) packages:

{% code-snippet file="/_code-samples/get-started/go/get-acc-info/ws/main.go" from="// Get info from" before="// Get info about" language="go" /%}

## Keep on Building

Now that you know how to use `xrpl-go` to connect to the XRP Ledger, get an account, and look up information about it, you can also:

- [Send XRP](../../how-tos/send-xrp.md).

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
seo:
  description: Build a Go application that interacts with the XRP Ledger.
labels:
  - Development
---

{% code-walkthrough
  filesets=[
    {
      "files": ["/_code-samples/get-started/go/get-acct-info/main.go", "/_code-samples/get-started/go/get-acct-info-rpc/main.go"],
      "downloadAssociatedFiles": ["/_code-samples/get-started/go/go.mod", "/_code-samples/get-started/go/get-acct-info/main.go", "/_code-samples/get-started/go/get-acct-info-rpc/main.go", "/_code-samples/get-started/go/README.md"]
    }
  ]
%}

# Get Started Using Go Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`xrpl-go`](https://github.com/XRPLF/xrpl-go), a pure Go library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `xrpl-go`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl-go`.
- How to use the `xrpl-go` library to look up information about an account on the XRP Ledger.
- How to put these steps together to create a Go app.

## Prerequisites

To complete this tutorial, you should meet the following guidelines:

- Have a basic understanding of Go.
- Have installed [Go](https://go.dev/dl/) version `1.25.13` or later.

## Source Code

Click **Download** on the top right of the code preview panel to download the source code.

## Steps

Follow the steps to create a simple application with `xrpl-go`.

{% step id="import-tag" %}
### 1. Install Dependencies

The [`xrpl-go` library](https://github.com/XRPLF/xrpl-go) is available on [pkg.go.dev](https://pkg.go.dev/github.com/Peersyst/xrpl-go).

Start a new project by creating an empty folder, then move into that folder and install the `xrpl-go` library via Go modules:

```bash
# Initialize your module (if you haven't already)
go mod init your-module-name

# Fetch the latest version of xrpl-go
go get github.com/Peersyst/xrpl-go@latest
```

Alternatively, if you're using the downloaded source code, you can install the dependencies listed in the `go.mod` file:

```bash
go mod tidy
```
{% /step %}

### 2. Connect to the XRP Ledger

{% step id="connect-tag" %}
#### Connect to the XRP Ledger Testnet

To make queries and submit transactions, you need to connect to the XRP Ledger. To do this with `xrpl-go`, create a client from the [`websocket` package](https://pkg.go.dev/github.com/Peersyst/xrpl-go/xrpl/websocket) and call its `Connect()` method. The sample code also attaches a Testnet faucet provider to the client so that you can fund a new account in the next step. This tutorial uses the WebSocket client because it can also subscribe to events.

The sample code shows you how to connect to the Testnet, which is one of the available [parallel networks](../../concepts/networks-and-servers/parallel-networks.md).
{% /step %}

{% step id="connect-rpc-tag" %}
#### (Optional) Connect Using JSON-RPC

`xrpl-go` also provides a JSON-RPC client in the [`rpc` package](https://pkg.go.dev/github.com/Peersyst/xrpl-go/xrpl/rpc). The `get-acct-info-rpc/main.go` file in the code panel shows the same application using the JSON-RPC client. You create the client from a config that takes the server URL and the faucet provider. Because JSON-RPC sends one HTTP request per call, there is no connection to open or close.
{% /step %}

{% step id="connect-mainnet-tag" %}
#### Connect to the XRP Ledger Mainnet

The sample code in the previous section shows you how to connect to the Testnet, which is a [parallel network](../../concepts/networks-and-servers/parallel-networks.md) for testing where the money has no real value. When you're ready to integrate with the production XRP Ledger, you'll need to connect to the Mainnet. You can do that in two ways:

- By [installing the core server](../../infrastructure/installation/index.md) (`xrpld`) and running a node yourself. The core server connects to the Mainnet by default, but you can [change the configuration to use Testnet or Devnet](../../infrastructure/configuration/connect-your-xrpld-to-the-xrp-test-net.md). [There are good reasons to run your own core server](../../concepts/networks-and-servers/index.md#reasons-to-run-your-own-server). If you run your own server, you can connect to it like so:

  ```go
  import "github.com/Peersyst/xrpl-go/xrpl/websocket"

  const MY_SERVER = "ws://localhost:6006/"

  func main() {
    client := websocket.NewClient(websocket.NewClientConfig().WithHost(MY_SERVER))

    // ... custom code goes here
  }
  ```

  See the example {% source-link name="core server config file" path="cfg/xrpld-example.cfg#L1469" /%} for more information about default values.

- By using one of the available [public servers][]:

  ```go
  import "github.com/Peersyst/xrpl-go/xrpl/websocket"

  const PUBLIC_SERVER = "wss://xrplcluster.com/"

  func main() {
    client := websocket.NewClient(websocket.NewClientConfig().WithHost(PUBLIC_SERVER))

    // ... custom code goes here
  }
  ```
{% /step %}

### 3. Get Account

{% step id="get-account-create-wallet-tag" %}
#### Create and Fund a Wallet

In `xrpl-go`, account creation and key management live in the [`wallet` package](https://pkg.go.dev/github.com/Peersyst/xrpl-go/xrpl/wallet), and on Testnet you can use the built-in faucet provider on your client to fund a brand-new account immediately. On Testnet, you can fund a new ED25519 account as shown in the example.

The `wallet.New` constructor returns a Go `Wallet` value with the following fields:

```go
type Wallet struct {
    PublicKey      string          // the hex-encoded public key
    PrivateKey     string          // the hex-encoded private key
    ClassicAddress types.Address   // the XRPL “r…” address
    Seed           string          // the base58 seed
}
```
{% /step %}

{% step id="get-account-create-wallet-c-tag" %}
#### (Optional) Use Your Own Wallet Seed

If you already have a seed encoded in [base58][], you can make a `Wallet` instance from it with `wallet.FromSeed`, as shown in the commented-out line of the example.
{% /step %}

{% step id="query-xrpl-tag" %}
### 4. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](../../references/http-websocket-apis/public-api-methods/account-methods/index.md), [a specific transaction](../../references/http-websocket-apis/public-api-methods/transaction-methods/tx.md), the state of a [current or a historical ledger](../../references/http-websocket-apis/public-api-methods/ledger-methods/index.md), and [the XRP Ledger's decentralized exchange](../../references/http-websocket-apis/public-api-methods/path-and-order-book-methods/index.md). You need to make these queries, among other reasons, to look up account info to follow best practices for [reliable transaction submission](../../concepts/transactions/reliable-transaction-submission.md).

Use the client's `GetAccountInfo()` method to look up information about the account you got in the previous step. The [`websocket`](https://pkg.go.dev/github.com/Peersyst/xrpl-go/xrpl/websocket) and [`rpc`](https://pkg.go.dev/github.com/Peersyst/xrpl-go/xrpl/rpc) packages provide typed getter methods like this for common queries. To call any other method of the XRP Ledger's [WebSocket API](../../references/http-websocket-apis/api-conventions/request-formatting.md), use the client's `Request()` method.
{% /step %}

{% step id="listen-for-events-tag" %}
### 5. Listen for Events

You can set up handlers for various types of events in `xrpl-go`, such as whenever the XRP Ledger's [consensus process](../../concepts/consensus-protocol/index.md) produces a new [ledger version](../../concepts/ledgers/index.md). To do that, first attach an event handler using the client's `OnLedgerClosed()` method, then call the `Subscribe()` method with the [subscribe method][] request for the type of events you want.
{% /step %}

{% step id="disconnect-tag" %}
### 6. Disconnect

Call the `Disconnect()` method so the program can end. The example code waits 10 seconds before disconnecting to allow time for the ledger event listener to receive and display events.
{% /step %}

{% step id="run-app-tag" %}
### 7. Run the Application

Finally, in your terminal, run the application from the folder that contains the `go.mod` file like so:

```sh
go run ./get-acct-info
```

You should see output similar to the following:

```sh
Connected to Testnet

Creating a new wallet and funding it with Testnet XRP...
Wallet: rLpGGFQhU1JJB2YnHgQ5bcpph9CxNsREKb
Account Testnet Explorer URL:
  https://testnet.xrpl.org/accounts/rLpGGFQhU1JJB2YnHgQ5bcpph9CxNsREKb

Getting account info...
{
  "account_data": {
    "index": "E02B88187332A044320B0CE553B2962FF593E00C42A3C2D5D59FBD80A551217B",
    "Flags": 0,
    "LedgerEntryType": "AccountRoot",
    "Account": "rLpGGFQhU1JJB2YnHgQ5bcpph9CxNsREKb",
    "Balance": "100000000",
    "OwnerCount": 0,
    "PreviousTxnID": "538931DECCE783C08991B7BB242A84ED14397FF1DAD40BD9366F97F34FD8144C",
    "PreviousTxnLgrSeq": 22090474,
    "Sequence": 22090474
  },
  "ledger_index": 22090474,
  "validated": true
}

Listening for ledger close events...
Ledger #22090475 validated with 27 transactions!
Ledger #22090476 validated with 28 transactions!

Disconnected
```

To run the JSON-RPC version of the application instead, use `go run ./get-acct-info-rpc`. It prints the same wallet and account info, then exits without listening for events.
{% /step %}

## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [Client Libraries](../../references/client-libraries.md)
- **Tutorials:**
    - [Send XRP](../payments/send-xrp)
    - [Issue a Fungible Token](../tokens/fungible-tokens/issue-a-fungible-token.md)
    - [Set up Secure Signing](../../concepts/transactions/secure-signing.md)
- **References:**
    - [`xrpl-go` Reference](https://pkg.go.dev/github.com/Peersyst/xrpl-go)
    - [Public API Methods](../../references/http-websocket-apis/public-api-methods/index.md)
    - [API Conventions](../../references/http-websocket-apis/api-conventions/index.md)
        - [base58 Encodings](../../references/protocol/data-types/base58-encodings.md)
    - [Transaction Formats](../../references/protocol/transactions/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

{% /code-walkthrough %}

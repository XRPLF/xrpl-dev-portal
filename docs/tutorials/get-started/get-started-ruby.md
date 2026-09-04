---
seo:
    description: Build a Ruby app that interacts with the XRP Ledger.
top_nav_name: Ruby
top_nav_grouping: Get Started
labels:
  - Development
---
# Get Started Using Ruby Library

This tutorial walks you through the basics of building an XRP Ledger-connected application using [`xrpl-ruby`](https://github.com/AlexanderBuzz/xrpl-ruby), a pure Ruby library built to interact with the XRP Ledger.

This tutorial is intended for beginners and should take no longer than 30 minutes to complete.

## Learning Goals

In this tutorial, you'll learn:

- The basic building blocks of XRP Ledger-based applications.
- How to connect to the XRP Ledger using `xrpl-ruby`.
- How to get an account on the [Testnet](/resources/dev-tools/xrp-faucets) using `xrpl-ruby`.
- How to use the `xrpl-ruby` library to look up information about an account on the XRP Ledger.
- How to put these steps together to create a Ruby app.

## Requirements

- `xrpl-ruby` requires Ruby 3.0 or later.

## Installation

`xrpl-ruby` is available as a [RubyGem](https://rubygems.org/gems/xrpl-ruby):

```sh
gem install xrpl-ruby
```

Or add it to your `Gemfile`:

```ruby
gem 'xrpl-ruby'
```

## Start Building

When you're working with the XRP Ledger, there are a few things you'll need to manage, whether you're adding XRP to your [account](../../concepts/accounts/index.md), integrating with the [decentralized exchange](../../concepts/tokens/decentralized-exchange/index.md), or [issuing tokens](../../concepts/tokens/index.md). This tutorial walks you through basic patterns common to getting started with all of these use cases and provides sample code for implementing them.

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Connect to the XRP Ledger.](#1-connect-to-the-xrp-ledger)
2. [Get an account.](#2-get-account)
3. [Query the XRP Ledger.](#3-query-the-xrp-ledger)

### 1. Connect to the XRP Ledger

To make queries and submit transactions, you need to connect to the XRP Ledger. Ruby supports WebSockets, so `xrpl-ruby` opens a persistent WebSocket connection to a public server. You can pass a network alias (`:testnet`, `:devnet`, `:mainnet`) or a full WebSocket URL:

```ruby
require 'xrpl-ruby'

# Create a client using the Testnet
client = XRPL::Client.new(:testnet)

# Open the connection and block until it is ready to accept requests
client.connect!
```

`connect!` blocks until the WebSocket connection is open, so the request in the next step can't race with connection setup.

#### Connect to the production XRP Ledger

The sample code above connects to the Testnet, which is one of the available [parallel networks](../../concepts/networks-and-servers/parallel-networks.md). When you're ready to integrate with the production XRP Ledger, connect to the Mainnet instead, either with a network alias or by using one of the available [public servers](../public-servers.md):

```ruby
client = XRPL::Client.new(:mainnet)
# or an explicit URL:
client = XRPL::Client.new('wss://s1.ripple.com')
```

### 2. Get account

To store value and execute transactions on the XRP Ledger, you need an account: a [set of keys](../../concepts/accounts/cryptographic-keys.md) and an [address](../../concepts/accounts/addresses.md) that's been [funded with enough XRP](../../concepts/accounts/index.md) to meet the [account reserve](../../concepts/accounts/reserves.md). The address is the identifier of your account, and you use the private key to sign transactions that you submit to the XRP Ledger.

To generate a new wallet, use the `generate` method on the `Wallet` class:

```ruby
wallet = Wallet::Wallet.generate

puts wallet.classic_address
puts wallet.seed
```

For testing and development purposes, you can use the `XRPL.fund_wallet` helper to create and fund a wallet on the XRP Ledger [Testnet](../../concepts/networks-and-servers/parallel-networks.md). It requests test XRP from the faucet and waits until the account is funded on the ledger:

```ruby
# Create and fund a new wallet on the Testnet
funded = XRPL.fund_wallet(client)
wallet = funded[:wallet]

puts "Classic address: #{wallet.classic_address}"
puts "Balance (drops): #{funded[:balance]}"
```

### 3. Query the XRP Ledger

You can query the XRP Ledger to get information about [a specific account](../../references/http-websocket-apis/public-api-methods/account-methods/index.md), a specific transaction, the state of a current or historical ledger, and the XRP Ledger's decentralized exchange.

Here, we use the client to look up information about the account we funded in the previous step:

```ruby
require 'json'

account_info = client.account_info_response(
  account: wallet.classic_address,
  ledger_index: 'validated'
)

puts JSON.pretty_generate(account_info)
```

The response fields you typically want to inspect are:

- `['result']['account_data']['Sequence']` — the sequence number of the next valid transaction for the account. You need to specify the sequence number when you prepare transactions.
- `['result']['account_data']['Balance']` — the account's XRP balance, in drops.
- `['result']['validated']` — indicates whether the returned data is from a [validated ledger](../../concepts/ledgers/open-closed-validated-ledgers.md).

For a detailed description of every response field, see [account_info](../../references/http-websocket-apis/public-api-methods/account-methods/account_info.md).

### 4. Putting it all together

Using these building blocks, we can create a Ruby app that:

1. Creates and funds an account on the Testnet.
2. Connects to the XRP Ledger.
3. Looks up and prints information about the account.

```ruby
require 'xrpl-ruby'
require 'json'

# Create a client using the Testnet
client = XRPL::Client.new(:testnet)
client.connect!

# Create a new wallet and fund it using the Testnet faucet
funded = XRPL.fund_wallet(client)
wallet = funded[:wallet]

puts "Classic address: #{wallet.classic_address}"

# Look up information about the account on the XRP Ledger
account_info = client.account_info_response(
  account: wallet.classic_address,
  ledger_index: 'validated'
)

puts JSON.pretty_generate(account_info)

client.disconnect
```

To run the app, you can copy the code from [this website's GitHub Repository](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/get-started/ruby/) and run it from the command line:

```sh
gem install xrpl-ruby
ruby get-account-info.rb
```

You should see output similar to this example:

```json
{
  "id": "e4f1...",
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "rTEST...",
      "Balance": "100000000",
      "Flags": 0,
      "LedgerEntryType": "AccountRoot",
      "OwnerCount": 0,
      "PreviousTxnID": "AE18...",
      "PreviousTxnLgrSeq": 12345678,
      "Sequence": 12345678,
      "index": "4DD9..."
    },
    "ledger_index": 12345678,
    "validated": true
  }
}
```

## Keep on building

Now that you know how to use `xrpl-ruby` to connect to the XRP Ledger, get an account, and look up information about it, you can also use `xrpl-ruby` to:

- [Send XRP](../payments/send-xrp.md).
- [Set up secure signing](../../concepts/transactions/secure-signing.md) for your account.

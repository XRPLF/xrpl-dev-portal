---
html: public-api-methods.html
parent: http-websocket-apis.html
seo:
    description: Get data from the XRP Ledger and submit transactions using these public API methods.
top_nav_name: API Methods
top_nav_grouping: Popular Pages
labels:
  - Core Server
---
# Public API Methods

Communicate directly with an [XRP Ledger server](../../../concepts/networks-and-servers/index.md) using the public API methods. Public methods are not necessarily meant for the general public, but they are used by any client attached to the server. Think of public methods as being for members or customers of the organization running the server.


## [Account Methods](account-methods/index.md)

An account in the XRP Ledger represents a holder of XRP and a sender of transactions. Use these methods to work with account info.

* **[`account_channels`](account-methods/account_channels.md)** - Get a list of payment channels where the account is the source of the channel.
* **[`account_currencies`](account-methods/account_currencies.md)** - Get a list of currencies an account can send or receive.
* **[`account_info`](account-methods/account_info.md)** - Get basic data about an account.
* **[`account_lines`](account-methods/account_lines.md)** - Get info about an account's trust lines.
* **[`account_nfts`](account-methods/account_nfts.md)** - Get a list of non-fungible tokens owned by an account.
* **[`account_objects`](account-methods/account_objects.md)** - Get all ledger objects owned by an account.
* **[`account_offers`](account-methods/account_offers.md)** - Get info about an account's currency exchange offers.
* **[`account_tx`](account-methods/account_tx.md)** - Get info about an account's transactions.
* **[`gateway_balances`](account-methods/gateway_balances.md)** - Calculate total amounts issued by an account.
* **[`noripple_check`](account-methods/noripple_check.md)** - Get recommended changes to an account's Default Ripple and No Ripple settings.


## [Ledger Methods](ledger-methods/index.md)

A ledger version contains a header, a transaction tree, and a state tree, which contain account settings, trust lines, balances, transactions, and other data. Use these methods to retrieve ledger info.

* **[`ledger`](ledger-methods/ledger.md)** - Get info about a ledger version.
* **[`ledger_closed`](ledger-methods/ledger_closed.md)** - Get the latest closed ledger version.
* **[`ledger_current`](ledger-methods/ledger_current.md)** - Get the current working ledger version.
* **[`ledger_data`](ledger-methods/ledger_data.md)** - Get the raw contents of a ledger version.
* **[`ledger_entry`](ledger-methods/ledger_entry.md)** - Get one element from a ledger version.


## [Transaction Methods](transaction-methods/index.md)

Transactions are the only thing that can modify the shared state of the XRP Ledger. All business on the XRP Ledger takes the form of transactions. Use these methods to work with transactions.

* **[`submit`](transaction-methods/submit.md)** - Send a transaction to the network.
* **[`submit_multisigned`](transaction-methods/submit_multisigned.md)** - Send a multi-signed transaction to the network.
* **[`transaction_entry`](transaction-methods/transaction_entry.md)** - Retrieve info about a transaction from a particular ledger version.
* **[`tx`](transaction-methods/tx.md)** - Retrieve info about a transaction from all the ledgers on hand.
* **[`tx_history`](transaction-methods/tx_history.md)** - Retrieve info about all recent transactions.

By default, the following methods are [admin-only](../admin-api-methods/index.md). They can be used as public methods if the server admin has [enabled public signing](../../../infrastructure/configuration/enable-public-signing.md).

* **[`sign`](../admin-api-methods/signing-methods/sign.md)** - Cryptographically sign a transaction.
* **[`sign_for`](../admin-api-methods/signing-methods/sign_for.md)** - Contribute to a multi-signature.


## [Path and Order Book Methods](path-and-order-book-methods/index.md)

Paths define a way for payments to flow through intermediary steps on their way from sender to receiver. Paths enable cross-currency payments by connecting sender and receiver through order books. Use these methods to work with paths and other books.

* **[`amm_info`](path-and-order-book-methods/amm_info.md)** - Get info about an Automated Market Maker (AMM).
* **[`book_offers`](path-and-order-book-methods/book_offers.md)** - Get info about offers to exchange two currencies.
* **[`deposit_authorized`](path-and-order-book-methods/deposit_authorized.md)** - Look up whether one account is authorized to send payments directly to another. <!-- STYLE_OVERRIDE: is authorized to -->
* **[`nft_buy_offers`](path-and-order-book-methods/nft_buy_offers.md)** - Retrieve a list of buy offers for a specified NFToken object.
* **[`nft_sell_offers`](path-and-order-book-methods/nft_sell_offers.md)** - Retrieve a list of sell offers for a specified NFToken object.
* **[`path_find`](path-and-order-book-methods/path_find.md)** - Find a path for a payment between two accounts and receive updates.
* **[`ripple_path_find`](path-and-order-book-methods/ripple_path_find.md)** - Find a path for payment between two accounts, once.


## [Payment Channel Methods](payment-channel-methods/index.md)

Payment channels are a tool for facilitating repeated, unidirectional payments, or temporary credit between two parties. Use these methods to work with payment channels.

* **[`channel_authorize`](payment-channel-methods/channel_authorize.md)** - Sign a claim for money from a payment channel.
* **[`channel_verify`](payment-channel-methods/channel_verify.md)** - Check a payment channel claim's signature.


## [Subscription Methods](subscription-methods/index.md)

Use these methods to enable the server to push updates to your client when various events happen, so that you can know and react right away. _WebSocket API only._

* **[`subscribe`](subscription-methods/subscribe.md)** - Listen for updates about a particular subject.
* **[`unsubscribe`](subscription-methods/unsubscribe.md)** - Stop listening for updates about a particular subject.


## [Server Info Methods](server-info-methods/index.md)

Use these methods to retrieve information about the current state of the `rippled` server.

* **[`fee`](server-info-methods/fee.md)** - Get information about transaction cost.
* **[`server_info`](server-info-methods/server_info.md)** - Retrieve status of the server in human-readable format.
* **[`server_state`](server-info-methods/server_state.md)** - Retrieve status of the server in machine-readable format.
- **[`manifest`](server-info-methods/manifest.md)** - Retrieve the latest ephemeral public key information about a known validator.

## [Clio Methods](clio-server/index.md)

Use these methods to retrieve information using Clio server APIs.

* **[`server_info`](clio-methods/server_info-clio.md)** - Retrieve status of the Clio server.
* **[`ledger`](clio-methods/ledger-clio.md)** - Get info about a ledger version using Clio server's `ledger` API.
* **[`nft_info`](clio-methods/nft_info.md)** - Retrieve information about the specified NFT using Clio server's `nft_info` API.
* **[`nft_history`](clio-methods/nft_history.md)** - Retrieve the history of ownership and transfers for the specified NFT.
* **[`nfts_by_issuer`](clio-methods/nfts_by_issuer.md)** - Returns a list of NFTokens that are issued by the specified account.

## [Utility Methods](utility-methods/index.md)

Use these methods to perform convenient tasks, such as ping and random number generation.

* **[`json`](utility-methods/json.md)** - Use as a proxy to running other commands. Accepts the parameters for the command as a JSON value. _Commandline only._
* **[`ping`](utility-methods/ping.md)** - Confirm connectivity with the server.
* **[`random`](utility-methods/random.md)** - Generate a random number.


## Deprecated Methods

The `owner_info` command is deprecated. Use [`account_objects`](account-methods/account_objects.md) instead.

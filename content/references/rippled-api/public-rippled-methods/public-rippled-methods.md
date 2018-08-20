# Public rippled Methods

Communicate directly with a `rippled` server using the following public API methods. Public methods are not necessarily meant for the general public, but they are used by any client attached to the server. Think of public methods as being for members or customers of the organization running the server.


## [Account Methods](account-methods.html)

An account in the XRP Ledger represents a holder of XRP and a sender of transactions. Use these methods to work with account info.

* **[`account_channels`](account_channels.html)** - Get a list of payment channels where the account is the source of the channel.
* **[`account_currencies`](account_currencies.html)** - Get a list of currencies an account can send or receive.
* **[`account_info`](account_info.html)** - Get basic data about an account.
* **[`account_lines`](account_lines.html)** - Get info about an account's trust lines.
* **[`account_objects`](account_objects.html)** - Get all ledger objects owned by an account.
* **[`account_offers`](account_offers.html)** - Get info about an account's currency exchange offers.
* **[`account_tx`](account_tx.html)** - Get info about an account's transactions.
* **[`gateway_balances`](gateway_balances.html)** - Calculate total amounts issued by an account.
* **[`noripple_check`](noripple_check.html)** - Get recommended changes to an account's DefaultRipple and NoRipple settings.


## [Ledger Methods](ledger-methods.html)

A ledger version contains a header, a transaction tree, and a state tree, which contain account settings, trustlines, balances, transactions, and other data. Use these methods to retrieve ledger info.

* **[`ledger`](ledger.html)** - Get info about a ledger version.
* **[`ledger_closed`](ledger_closed.html)** - Get the latest closed ledger version.
* **[`ledger_current`](ledger_current.html)** - Get the current working ledger version.
* **[`ledger_data`](ledger_data.html)** - Get the raw contents of a ledger version.
* **[`ledger_entry`](ledger_entry.html)** - Get one element from a ledger version.


## [Transaction Methods](transaction-methods.html)

Transactions are the only thing that can modify the shared state of the XRP Ledger. All business on the XRP Ledger takes the form of transactions. Use these methods to work with transactions.

* **[`sign`](sign.html)** - Cryptographically sign a transaction.
* **[`sign_for`](sign_for.html)** - Contribute to a multi-signature.
* **[`submit`](submit.html)** - Send a transaction to the network.
* **[`submit_multisigned`](submit_multisigned.html)** - Send a multi-signed transaction to the network.
* **[`transaction_entry`](transaction_entry.html)** - Retrieve info about a transaction from a particular ledger version.
* **[`tx`](tx.html)** - Retrieve info about a transaction from all the ledgers on hand.
* **[`tx_history`](tx_history.html)** - Retrieve info about all recent transactions.


## [Path and Order Book Methods](path-and-order-book-methods.html)

Paths define a way for payments to flow through intermediary steps on their way from sender to receiver. Paths enable cross-currency payments by connecting sender and receiver through order books. Use these methods to work with paths and other books.

* **[`book_offers`](book_offers.html)** - Get info about offers to exchange two currencies.
* **[`deposit_authorized`](deposit_authorized.html)** - Look up whether one account is authorized to send payments directly to another.
* **[`path_find`](path_find.html)** - Find a path for a payment between two accounts and receive updates.
* **[`ripple_path_find`](ripple_path_find.html)** - Find a path for payment between two accounts, once.


## [Payment Channel Methods](payment-channel-methods.html)

Payment channels are a tool for facilitating repeated, unidirectional payments, or temporary credit between two parties. Use these methods to work with payment channels.

* **[`channel_authorize`](channel_authorize.html)** - Sign a claim for money from a payment channel.
* **[`channel_verify`](channel_verify.html)** - Check a payment channel claim's signature.


## [Subscription Methods](subscription-methods.html)

Use these methods to enable the server to push updates to your client when various events happen, so that you can know and react right away. _WebSocket API only._

* **[`subscribe`](subscribe.html)** - Listen for updates about a particular subject.
* **[`unsubscribe`](unsubscribe.html)** - Stop listening for updates about a particular subject.


## [Server Info Methods](server-info-methods.html)

Use these methods to retrieve information about the current state of the `rippled` server.

* **[`fee`](fee.html)** - Get information about transaction cost.
* **[`server_info`](server_info.html)** - Retrieve status of the server in human-readable format.
* **[`server_state`](server_state.html)** - Retrieve status of the server in machine-readable format.


## [Utility Methods](utility-methods.html)

Use these methods to perform convenient tasks, such as ping and random number generation.

* **[`json`](json.html)** - Use as a proxy to running other commands. Accepts the parameters for the command as a JSON value. _Commandline only._
* **[`ping`](ping.html)** - Confirm connectivity with the server.
* **[`random`](random.html)** - Generate a random number.


## Deprecated Methods

The `owner_info` command is deprecated. Use [`account_objects`](account_objects.html) instead.

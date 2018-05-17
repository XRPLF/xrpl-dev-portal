# Public rippled Methods

Communicate directly with a `rippled` server using the following public API methods. Public methods are not necessarily meant for the general public, but they are used by any client attached to the server. Think of public methods as being for members or customers of the organization running the server.

* [`account_currencies`](account_currencies.html)

     Get a list of currencies an account can send or receive.

* [`account_channels`](account_channels.html)

     Get a list of payment channels where the account is the source of the channel.

* [`account_info`](account_info.html)

     Get basic data about an account.

* [`account_lines`](account_lines.html)

     Get info about an account's trust lines.

* [`account_objects`](account_objects.html)

     Get all ledger objects owned by an account.

* [`account_offers`](account_offers.html)

     Get info about an account's currency exchange offers.

* [`account_tx`](account_tx.html)

     Get info about an account's transactions.

* [`book_offers`](book_offers.html)

     Get info about offers to exchange two currencies.

* [`channel_authorize`](channel_authorize.html)

     Sign a claim for money from a payment channel.

* [`channel_verify`](channel_verify.html)

     Check a payment channel claim's signature.

* [`fee`](fee.html)

     Get information about transaction cost.

* [`gateway_balances`](gateway_balances.html)

     Calculate total amounts issued by an account.

* [`ledger`](ledger.html)

     Get info about a ledger version.

* [`ledger_closed`](ledger_closed.html)

     Get the latest closed ledger version.

* [`ledger_current`](ledger_current.html)

     Get the current working ledger version.

* [`ledger_data`](ledger_data.html)

     Get the raw contents of a ledger version.

* [`ledger_entry`](ledger_entry.html)

     Get one element from a ledger version.

* [`noripple_check`](noripple_check.html)

     Get recommended changes to an account's DefaultRipple and NoRipple settings.

* [`path_find`](path_find.html)

     Find a path for a payment between two accounts and receive updates.

* [`ping`](ping.html)

     Confirm connectivity with the server.

* [`random`](random.html)

     Generate a random number.

* [`ripple_path_find`](ripple_path_find.html)

     Find a path for payment between two accounts, once.

* [`server_info`](server_info.html)

     Retrieve status of the server in human-readable format.

* [`server_state`](server_state.html)

     Retrieve status of the server in machine-readable format.

* [`sign`](sign.html)

     Cryptographically sign a transaction.

* [`sign_for`](sign_for.html)

     Contribute to a multi-signature.

* [`submit`](submit.html)

     Send a transaction to the network.

* [`submit_multisigned`](submit_multisigned.html)

     Send a multi-signed transaction to the network.

* [`subscribe`](subscribe.html)

     Listen for updates about a particular subject.

* [`transaction_entry`](transaction_entry.html)

     Retrieve info about a transaction from a particular ledger version.

* [`tx`](tx.html)

     Retrieve info about a transaction from all the ledgers on hand.

* [`tx_history`](tx_history.html)

     Retrieve info about all recent transactions.

* [`unsubscribe`](unsubscribe.html)

     Stop listening for updates about a particular subject.


## Deprecated Methods

The `owner_info` command is deprecated. Use [`account_objects`](account_objects.html) instead.

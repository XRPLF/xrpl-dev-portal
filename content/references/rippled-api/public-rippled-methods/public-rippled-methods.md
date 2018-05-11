# Public rippled Methods

Communicate directly with a `rippled` server using these public API methods.

Public methods are not necessarily meant for the general public, but they are used by any client attached to the server. Think of public methods as being for members or customers of the organization running the server.

Public methods include operations such as checking the state of the ledger, finding a path to connecting users, and submitting a transaction, among others.

## List of Methods


* [`account_currencies` - Get a list of currencies an account can send or receive](account_currencies.html)
* [`account_channels` - Get a list of payment channels where the account is the source of the channel](account_channels.html)
* [`account_info` - Get basic data about an account](account_info.html)
* [`account_lines` - Get info about an account's trust lines](account_lines.html)
* [`account_objects` - Get all ledger objects owned by an account](account_objects.html)
* [`account_offers` - Get info about an account's currency exchange offers](account_offers.html)
* [`account_tx` - Get info about an account's transactions](account_tx.html)
* [`book_offers` - Get info about offers to exchange two currencies](book_offers.html)
* [`channel_authorize` - Sign a claim for money from a payment channel](channel_authorize.html)
* [`channel_verify` - Check a payment channel claim's signature](channel_verify.html)
* [`fee` - Get information about transaction cost](fee.html)
* [`gateway_balances` - Calculate total amounts issued by an account](gateway_balances.html)
* [`ledger` - Get info about a ledger version](ledger.html)
* [`ledger_closed` - Get the latest closed ledger version](ledger_closed.html)
* [`ledger_current` - Get the current working ledger version](ledger_current.html)
* [`ledger_data` - Get the raw contents of a ledger version](ledger_data.html)
* [`ledger_entry` - Get one element from a ledger version](ledger_entry.html)
* [`noripple_check` - Get recommended changes to an account's DefaultRipple and NoRipple settings](noripple_check.html)
* [`path_find` - Find a path for a payment between two accounts and receive updates](path_find.html)
* [`ping` - Confirm connectivity with the server](ping.html)
* [`random` - Generate a random number](random.html)
* [`ripple_path_find` - Find a path for payment between two accounts, once](ripple_path_find.html)
* [`server_info` - Retrieve status of the server in human-readable format](server_info.html)
* [`server_state` - Retrieve status of the server in machine-readable format](server_state.html)
* [`sign` - Cryptographically sign a transaction](sign.html)
* [`sign_for` - Contribute to a multi-signature](sign_for.html)
* [`submit` - Send a transaction to the network](submit.html)
* [`submit_multisigned` - Send a multi-signed transaction to the network](submit_multisigned.html)
* [`subscribe` - Listen for updates about a particular subject](subscribe.html)
* [`transaction_entry` - Retrieve info about a transaction from a particular ledger version](transaction_entry.html)
* [`tx` - Retrieve info about a transaction from all the ledgers on hand](tx.html)
* [`tx_history` - Retrieve info about all recent transactions](tx_history.html)
* [`unsubscribe` - Stop listening for updates about a particular subject](unsubscribe.html)


## Deprecated Methods

The `owner_info` command is deprecated. Use [`account_objects`](account_objects.html) instead.

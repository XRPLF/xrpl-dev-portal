# Public rippled API Methods

Public `rippled` API methods are available to any client attached to a `rippled` server. These methods are intended for members or customers of the organization running the server. Public methods include operations such as checking the state of the ledger, finding a path for cross-currency payments, and submitting a transaction.

For admin methods, which are intended for the people and systems in charge of keeping the server operational, see [Admin `rippled` API Methods](reference-rippled-api-admin.html).

## List of Public Methods

* [`account_currencies` - Get a list of currencies an account can send or receive](#account-currencies)
* [`account_channels` - Get a list of payment channels where the account is the source of the channel](#account-channels)
* [`account_info` - Get basic data about an account](#account-info)
* [`account_lines` - Get info about an account's trust lines](#account-lines)
* [`account_objects` - Get all ledger objects owned by an account](#account-objects)
* [`account_offers` - Get info about an account's currency exchange offers](#account-offers)
* [`account_tx` - Get info about an account's transactions](#account-tx)
* [`book_offers` - Get info about offers to exchange two currencies](#book-offers)
* [`channel_authorize` - Sign a claim for money from a payment channel](#channel-authorize)
* [`channel_verify` - Check a payment channel claim's signature](#channel-verify)
* [`fee` - Get information about transaction cost](#fee)
* [`gateway_balances` - Calculate total amounts issued by an account](#gateway-balances)
* [`ledger` - Get info about a ledger version](#ledger)
* [`ledger_closed` - Get the latest closed ledger version](#ledger-closed)
* [`ledger_current` - Get the current working ledger version](#ledger-current)
* [`ledger_data` - Get the raw contents of a ledger version](#ledger-data)
* [`ledger_entry` - Get one element from a ledger version](#ledger-entry)
* [`noripple_check` - Get recommended changes to an account's DefaultRipple and NoRipple settings](#noripple-check)
* [`path_find` - Find a path for a payment between two accounts and receive updates](#path-find)
* [`ping` - Confirm connectivity with the server](#ping)
* [`random` - Generate a random number](#random)
* [`ripple_path_find` - Find a path for payment between two accounts, once](#ripple-path-find)
* [`server_info` - Retrieve status of the server in human-readable format](#server-info)
* [`server_state` - Retrieve status of the server in machine-readable format](#server-state)
* [`sign` - Cryptographically sign a transaction](#sign)
* [`sign_for` - Contribute to a multi-signature](#sign-for)
* [`submit` - Send a transaction to the network](#submit)
* [`submit_multisigned` - Send a multi-signed transaction to the network](#submit-multisigned)
* [`subscribe` - Listen for updates about a particular subject](#subscribe)
* [`transaction_entry` - Retrieve info about a transaction from a particular ledger version](#transaction-entry)
* [`tx` - Retrieve info about a transaction from all the ledgers on hand](#tx)
* [`tx_history` - Retrieve info about all recent transactions](#tx-history)
* [`unsubscribe` - Stop listening for updates about a particular subject](#unsubscribe)

The `owner_info` command is deprecated. Use [`account_objects`](#account-objects) instead.

### Commandline Access

You can use the `rippled` application (as a separate instance) as a JSON-RPC client. In this mode, it has syntax for triggering most API methods with a single line from the command prompt, as described in each method. However, some methods or options don't have commandline syntax. For otherwise unsupported syntax, you can use the following method:

* [`json` - Pass JSON through the commandline](#json)

**Note:** The commandline interface is intended for administrative purposes only and is _not a supported API_.


# Account Information

These methods retrieve information about [Accounts](concept-accounts.html) and objects related to them.

{% include 'rippled-api-methods/account_currencies.md' %}

{% include 'rippled-api-methods/account_channels.md' %}

{% include 'rippled-api-methods/account_info.md' %}

{% include 'rippled-api-methods/account_lines.md' %}

{% include 'rippled-api-methods/account_offers.md' %}

{% include 'rippled-api-methods/account_objects.md' %}

{% include 'rippled-api-methods/account_tx.md' %}

{% include 'rippled-api-methods/noripple_check.md' %}

{% include 'rippled-api-methods/gateway_balances.md' %}

# Ledger Information

These methods retrieve information about the shared [XRP Ledger Data](reference-ledger-format.html), including metadata, individual stored objects, or even the entire data of a ledger version.

{% include 'rippled-api-methods/ledger.md' %}

{% include 'rippled-api-methods/ledger_closed.md' %}

{% include 'rippled-api-methods/ledger_current.md' %}

{% include 'rippled-api-methods/ledger_data.md' %}

{% include 'rippled-api-methods/ledger_entry.md' %}

# Transactions

[Transactions](concept-transactions.html) are the only way to modify the shared state of the XRP Ledger. These methods look up the status and [outcome](reference-transaction-results.html) of completed transactions, or submit new transactions.

{% include 'rippled-api-methods/tx.md' %}

{% include 'rippled-api-methods/transaction_entry.md' %}

{% include 'rippled-api-methods/tx_history.md' %}

{% include 'rippled-api-methods/sign.md' %}

{% include 'rippled-api-methods/sign_for.md' %}

{% include 'rippled-api-methods/submit.md' %}

{% include 'rippled-api-methods/submit_multisigned.md' %}

# Paths and Order Books

These methods look up useful information about the decentralized exchange and possible [paths](concept-paths.html) for payments using issued currencies, including cross-currency payments. <!--{# TODO: link decentralized exchange when there's a standalone article for it #}-->

{% include 'rippled-api-methods/book_offers.md' %}

{% include 'rippled-api-methods/path_find.md' %}

{% include 'rippled-api-methods/ripple_path_find.md' %}


# Payment Channels

These methods create and verify claims that can be used with payment channels to achieve unlimited asynchronous transactions. <!--{# TODO: link paychan concept when there's a standalone article. #}-->

{% include 'rippled-api-methods/channel_authorize.md' %}

{% include 'rippled-api-methods/channel_verify.md' %}


# Subscriptions

Using subscriptions, you can have the server push updates to your client when various events happen, so that you can know and react right away. Subscriptions are only supported in the WebSocket API, where you can receive additional responses in the same channel.

JSON-RPC support for subscription callbacks is deprecated and may not work as expected.

{% include 'rippled-api-methods/subscribe.md' %}

{% include 'rippled-api-methods/unsubscribe.md' %}

# Server Information

These methods provide information about the server itself.

**Tip:** [Admin Methods](reference-rippled-api-admin.html) provide a much richer suite of methods and data for monitoring and debugging the server.

{% include 'rippled-api-methods/server_info.md' %}

{% include 'rippled-api-methods/server_state.md' %}

{% include 'rippled-api-methods/fee.md' %}


# Convenience Functions

These methods provide miscellaneous utilities for convenience.

{% include 'rippled-api-methods/ping.md' %}

{% include 'rippled-api-methods/random.md' %}

{% include 'rippled-api-methods/json.md' %}



<!--{# Common link includes #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}

# Admin rippled API Methods

Admin `rippled` API methods are available only to clients connected on an admin connection to a `rippled` server. These methods are intended for the people and systems in charge of keeping the server operational. Admin methods include tools for managing, monitoring, and debugging the server.

For public methods, which are intended for more day-to-day use, see [Public `rippled` API Methods](reference-rippled-api-public.html).

## List of Admin Methods

Admin methods are only available if you [connect to `rippled`](reference-rippled-intro.html#connecting-to-rippled) on a host and port that the config file identifies as admin. (By default, the commandline client uses an admin connection.)

* [`can_delete` - Allow online deletion of ledgers up to a specific ledger](#can-delete)
* [`connect` - Force the rippled server to connect to a specific peer](#connect)
* [`consensus_info` - Get information about the state of consensus as it happens](#consensus-info)
* [`feature` - Get information about protocol amendments](#feature)
* [`fetch_info` - Get information about the server's sync with the network](#fetch-info)
* [`get_counts` - Get statistics about the server's internals and memory usage](#get-counts)
* [`ledger_accept` - Close and advance the ledger in stand-alone mode](#ledger-accept)
* [`ledger_cleaner` - Configure the ledger cleaner service to check for corrupted data](#ledger-cleaner)
* [`ledger_request` - Query a peer server for a specific ledger version](#ledger-request)
* [`log_level` - Get or modify log verbosity](#log-level)
* [`logrotate` - Reopen the log file](#logrotate)
* [`peers` - Get information about the peer servers connected](#peers)
* [`print` - Get information about internal subsystems](#print)
* [`stop` - Shut down the rippled server](#stop)
* [`validation_create` - Generate keys for a new rippled validator](#validation-create)
* [`validation_seed` - Temporarily set key to be used for validating](#validation-seed)
* [`validators` - Get information about the current validators](#validators)
* [`validator_list_sites` - Get information about sites that publish validator lists](#validator-list-sites)
* [`wallet_propose` - Generate keys for a new account](#wallet-propose)

The following admin methods are deprecated and may be removed without further notice:

* `ledger_header` - Use the [`ledger` command](reference-rippled-api-public.html#ledger) instead.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Use the configuration file for UNL management instead.
* `wallet_seed` - Use [`wallet_propose`](#wallet-propose) instead.

**Tip:** The public methods [`server_info`](reference-rippled-api-public.html#server-info) and [`server_state`](reference-rippled-api-public.html#server-state) also provide more information when connected as an admin.


# Key Generation

These methods generate or manage secret values associated with the server.

{% include 'rippled-api-methods/wallet_propose.md' %}

{% include 'rippled-api-methods/validation_create.md' %}

{% include 'rippled-api-methods/validation_seed.md' %}


# Logging and Data Management

These methods manage the ledger data stored by the server and the data written to server logs.

{% include 'rippled-api-methods/can_delete.md' %}

{% include 'rippled-api-methods/ledger_cleaner.md' %}

{% include 'rippled-api-methods/ledger_request.md' %}

{% include 'rippled-api-methods/log_level.md' %}

{% include 'rippled-api-methods/logrotate.md' %}


# Server Control

These methods manage the connectivity and activity of the server.

{% include 'rippled-api-methods/connect.md' %}

{% include 'rippled-api-methods/ledger_accept.md' %}

{% include 'rippled-api-methods/stop.md' %}


# Status and Debugging

These methods return detailed information about server internals, for monitoring the server state or troubleshooting problems.

{% include 'rippled-api-methods/consensus_info.md' %}

{% include 'rippled-api-methods/fetch_info.md' %}

{% include 'rippled-api-methods/feature.md' %}

{% include 'rippled-api-methods/get_counts.md' %}

{% include 'rippled-api-methods/peers.md' %}

{% include 'rippled-api-methods/print.md' %}

{% include 'rippled-api-methods/validator_list_sites.md' %}

{% include 'rippled-api-methods/validators.md' %}



<!--{# Common link includes #}-->
{% include 'snippets/rippled_versions.md' %}
{% include 'snippets/tx-type-links.md' %}
{% include 'snippets/rippled-api-links.md' %}

# Admin rippled Methods

Communicate directly with a `rippled` server using these admin API methods. Admin methods are meant only for trusted personnel in charge of keeping the server operational. Admin methods include commands for managing, monitoring, and debugging the server.

Admin commands are available only if you connect to `rippled` on a host and port that the `rippled.cfg` file identifies as admin. By default, the commandline client uses an admin connection. For more information on connecting to `rippled`, see [Getting Started with the rippled API](get-started-with-the-rippled-api.html).


## [Key Generation Methods](key-generation-methods.html)

Use these methods to generate and manage keys.

* **[`validation_create`](validation_create.html)** - Generate keys for a new rippled validator.
* **[`wallet_propose`](wallet_propose.html)** - Generate keys for a new account.


## [Logging and Data Management Methods](logging-and-data-management-methods.html)

Use these methods to manage log levels and other data, such as ledgers.

* **[`can_delete`](can_delete.html)** - Allow online deletion of ledgers up to a specific ledger.
* **[`download_shard`](download_shard.html)** - Download a specific shard of ledger history.
* **[`ledger_cleaner`](ledger_cleaner.html)** - Configure the ledger cleaner service to check for corrupted data.
* **[`ledger_request`](ledger_request.html)** - Query a peer server for a specific ledger version.
* **[`log_level`](log_level.html)** - Get or modify log verbosity.
* **[`logrotate`](logrotate.html)** - Reopen the log file.


## [Server Control Methods](server-control-methods.html)

Use these methods to manage the rippled server.

* **[`connect`](connect.html)** - Force the rippled server to connect to a specific peer.
* **[`ledger_accept`](ledger_accept.html)** - Close and advance the ledger in stand-alone mode.
* **[`stop`](stop.html)** - Shut down the rippled server.
* **[`validation_seed`](validation_seed.html)** - Temporarily set key to be used for validating.


## [Status and Debugging Methods](status-and-debugging-methods.html)

Use these methods to check the status of the network and server.

* **[`consensus_info`](consensus_info.html)** - Get information about the state of consensus as it happens.
* **[`feature`](feature.html)** - Get information about protocol amendments.
* **[`fetch_info`](fetch_info.html)** - Get information about the server's sync with the network.
* **[`get_counts`](get_counts.html)** - Get statistics about the server's internals and memory usage.
* **[`peers`](peers.html)** - Get information about the peer servers connected.
* **[`print`](print.html)** - Get information about internal subsystems.
* **[`validators`](validators.html)** - Get information about the current validators.
* **[`validator_list_sites`](validator_list_sites.html)** - Get information about sites that publish validator lists.


## Deprecated Methods

The following admin commands are deprecated and may be removed without further notice:

* `ledger_header` - Use the [ledger method][] instead.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Use the `validators.txt` config file for UNL management instead.
* `wallet_seed` - Use the [wallet_propose method][] instead.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

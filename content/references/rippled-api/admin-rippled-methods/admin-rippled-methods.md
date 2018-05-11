# Admin rippled Methods

Communicate directly with a `rippled` server using these admin API methods.

Admin methods are meant only for trusted personnel in charge of keeping the server operational. Admin methods include commands for managing, monitoring, and debugging the server.

Admin commands are available only if you connect to `rippled` on a host and port that the `rippled.cfg` file identifies as admin. By default, the commandline client uses an admin connection. For more information on connecting to `rippled`, see [Getting Started with the rippled API](get-started-with-the-rippled-api.html).

## List of Admin Methods

* [`can_delete` - Allow online deletion of ledgers up to a specific ledger](can_delete.html)
* [`connect` - Force the rippled server to connect to a specific peer](connect.html)
* [`consensus_info` - Get information about the state of consensus as it happens](consensus_info.html)
* [`feature` - Get information about protocol amendments](feature.html)
* [`fetch_info` - Get information about the server's sync with the network](fetch_info.html)
* [`get_counts` - Get statistics about the server's internals and memory usage](get_counts.html)
* [`ledger_accept` - Close and advance the ledger in stand-alone mode](ledger_accept.html)
* [`ledger_cleaner` - Configure the ledger cleaner service to check for corrupted data](ledger_cleaner.html)
* [`ledger_request` - Query a peer server for a specific ledger version](ledger_request.html)
* [`log_level` - Get or modify log verbosity](log_level.html)
* [`logrotate` - Reopen the log file](logrotate.html)
* [`peers` - Get information about the peer servers connected](peers.html)
* [`print` - Get information about internal subsystems](print.html)
* [`stop` - Shut down the rippled server](stop.html)
* [`validation_create` - Generate keys for a new rippled validator](validation_create.html)
* [`validation_seed` - Temporarily set key to be used for validating](validation_seed.html)
* [`validators` - Get information about the current validators](validators.html)
* [`validator_list_sites` - Get information about sites that publish validator lists](validator_list_sites.html)
* [`wallet_propose` - Generate keys for a new account](wallet_propose.html)

## Deprecated Methods

The following admin commands are deprecated and may be removed without further notice:

* `ledger_header` - Use the [ledger method][] instead.
* `unl_add`, `unl_delete`, `unl_list`, `unl_load`, `unl_network`, `unl_reset`, `unl_score` - Use the configuration file for UNL management instead.
* `wallet_seed` - Use the [wallet_propose method][] instead.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

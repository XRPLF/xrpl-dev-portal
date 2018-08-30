# Diagnosing Problems with rippled

If you have having problems with `rippled`, the first step is to collect more information to accurately characterize the problem. From there, it can be easier to figure out a root cause and a fix.

If your server does not start, see [rippled Server Won't Start](server-wont-start.html) for a list of some possible causes and fixes.

The remainder of this document suggests steps for diagnosing the problem if your server starts successfully.

## Get the server_info

You can use the commandline to get server status information from the local `rippled` instance. For example:

```
rippled server_info
```

The response to this command has a lot of information, which is documented along with the [server_info method][].
For troubleshooting purposes, the most important fields are (from most commonly used to least):

- **`server_state`** - Most of the time, this field should show either `full` or `proposing` depending on whether it is [configured as a validator](run-rippled-as-a-validator.html). The value `connected` means that the server can communicate with the rest of the peer-to-peer network, but it does not yet have enough data to track progress of the shared ledger state. Normally, syncing to the state of the rest of the ledger takes about 5-15 minutes after starting.

    - If your server remains in the `connected` state for hours, or returns to the `connected` state after being in the `full` or `proposing` states, that usually indicates that your server cannot keep up with the rest of the network. The most common bottlenecks are disk I/O and network bandwidth.

- **`complete_ledgers`** - This field shows which [ledger indexes](basic-data-types.html#ledger-index) your server has complete ledger data for. Healthy servers usually have a single range of recent ledgers, such as `"12133424-12133858"`.

    - If you have a disjoint set of complete ledgers such as `"11845721-12133420,12133424-12133858"`, that could indicate that your server has had intermittent outages or has temporarily fallen out of sync with the rest of the network. The most common causes for this are insufficient disk I/O or network bandwidth.

    - Normally, a `rippled` server downloads recent ledger history from its peers. If gaps in your ledger history persist for more than a few hours, you may not be connected to any peers who have the missing data. If this occurs, you can force your server to try and peer with one of Ripple's full-history public servers by adding the following stanza to your config file and restarting:

            [ips_fixed]
            s2.ripple.com 51235

- **`amendment_blocked`** - This field is normally omitted from the `server_info` response. If this field appears with the value `true`, then the network has approved an [amendment](amendments.html) for which your server doesn't have an implementation. Most likely, you can fix this by [updating rippled](update-rippled.html) to the latest version. You can also use the [feature method][] to see what amendment IDs are currently enabled and which one(s) your server does and does not support.

- **`peers`** - This field indicates how many other servers in the XRP Ledger peer-to-peer network your server is connected to. Healthy servers typically show between 5 and 50 peers, unless explicitly configured to connect only to certain peers.

    - If you have 0 peers, your server may be unable to contact the network, or your system clock may be wrong. (Ripple recommends running an [NTP](http://www.ntp.org/) daemon on all servers to keep their clocks synced.)

### No Response from Server

The `rippled` executable returns the following message if it wasn't able to connect as a client to the `rippled` server:

```json
{
   "error" : "internal",
   "error_code" : 71,
   "error_message" : "Internal error.",
   "error_what" : "no response from server"
}
```

This generally indicates one of several problems:

- The `rippled` server is just starting up, or is not running at all. Check the status of the service; if it is running, wait a few seconds and try again.
- You may need to pass different [parameters to the `rippled` commandline client](commandline-usage.html#client-mode-options) to connect to your server.
- The `rippled` server may not be configured not to accept JSON-RPC connections.


## Check the server log

While running, `rippled` servers write information to a debug log. The location of the debug log depends on your server's configuration file. The [default configuration](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142) writes the server's debug log to the file `/var/log/rippled/debug.log`. If you start the `rippled` service directly (instead of using `systemctl` or `service` to start it), it also prints log messages to the console by default.

You can control the verbosity of the debug log with the [log_level method][]. The default config file sets the `log_level` to severity "warning" for all categories of log messages. (See the `[rpc_startup]` stanza of the config file for settings.)

It is normal for a `rippled` the server to print many warning-level (`WRN`) messages during startup and a few warning-level messages from time to time later on. You can **safely ignore** most warnings in the first 5 to 15 minutes of server startup.

For a more thorough explanation of various types of log messages, see [Understanding Log Messages](understanding-log-messages.html).



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

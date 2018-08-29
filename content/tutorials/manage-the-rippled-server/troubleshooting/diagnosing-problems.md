# Diagnosing Problems with rippled

If you have having problems with `rippled`, the first step is to collect more information to accurately characterize the problem. From there, it can be easier to figure out a root cause and a fix.

If your server does not start, see [rippled Server Won't Start](server-wont-start.html) for a list of some possible causes and fixes.

The remainder of this document suggests steps for diagnosing the problem if your server starts successfully.

## Get the server_info

You can use the commandline to get server status information from the local `rippled` instance. For example:

```
rippled server_info
```

The response to this command has a lot of information, which is documented along with the [server info method][].
For troubleshooting purposes, the most important fields are (from most commonly used to least):

- **`server_state`** - Most of the time, this field should show either `full` or `proposing` depending on whether it is [configured as a validator](run-rippled-as-a-validator.html). The value `connected` means that the server can communicate with the rest of the peer-to-peer network, but it does not yet have enough data to track progress of the shared ledger state. Normally, syncing to the state of the rest of the ledger takes about 5-15 minutes.
    - If your server remains in the `connected` state for hours after starting, or returns to the `connected` state after being in the `full` or `proposing` states, that usually indicates that your server cannot keep up with the rest of the network. The most common bottlenecks are disk I/O and network bandwidth.

- **`complete_ledgers`** - This field shows which [ledger indexes](basic-data-types.html#ledger-index) your server has complete ledger data for. Healthy servers usually have a single range of recent ledgers, such as `"12133424-12133858"`.
    - If you have a disjoint set of complete ledgers such as `"11845721-12133420,12133424-12133858"`, that could indicate that your server has had intermittent outages or has temporarily fallen out of sync with the rest of the network. The most common causes for this are insufficient disk I/O or network bandwidth.
    - Normally, a `rippled` server downloads recent ledger history from its peers. If gaps in your ledger history persist for more than a few hours, you may not be connected to any peers who have the missing data. If this occurs, you can force your server to try and peer with one of Ripple's full-history public servers by adding the following stanza to your config file and restarting:

            [ips_fixed]
            s2.ripple.com 51235

- **`amendment_blocked`** - This field is normally omitted from the `server_info` response. If this field appears with the value `true`, then the network has approved an [amendment](amendments.html) for which your server doesn't have an implementation. Most likely, you can fix this by [updating rippled](update-rippled.html) to the latest version. You can also use the [feature method][] to see what amendment IDs are currently enabled and which one(s) your server does and does not support.

- **`peers`** - This field indicates how many other servers in the XRP Ledger peer-to-peer network your server is connected to. Healthy servers typically show between 5 and 50 peers, unless explicitly configured to connect only to certain peers.
    - If you have 0 peers, your server may be unable to contact the network, or your system clock may be wrong. (Ripple recommends running an [NTP](http://www.ntp.org/) daemon on all servers to keep their clocks synced.)

### No Response from Server

The following message indicates that the `rippled` executable wasn't able to connect as a client to the `rippled` server:

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
- You need to pass different parameters to the `rippled` commandline client to connect to your server.
- The `rippled` server is configured not to accept JSON-RPC connections.


## Check the server log

While running, `rippled` servers write information to a debug log. The location of the debug log depends on your server's configuration file. The [default configuration](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142) writes the server's debug log to the file `/var/log/rippled/debug.log`. If you start the `rippled` service directly (instead of using `systemctl` or `service` to start it), it also prints log messages to the console by default.

You can control the verbosity of the debug log with the [log_level method][]. The default config file sets the `log_level` to severity "warning" for all categories of log messages. (See the `[rpc_startup]` stanza of the config file for settings.)

### Crashes

Messages in the log that indicate runtime errors can indicate that the server crashed. These messages usually start with a message such as one of the following examples:

```
Throw<std::runtime_error>
```

```
Terminating thread rippled: main: unhandled St13runtime_error
```

If your server always crashes on startup, see [Server Won't Start](server-wont-start.html) for possible cases.

If your server crashes randomly during operation or as a result of particular commands, make sure you are [updated](updating-rippled.html) to the latest `rippled` version. If you are on the latest version and your server is still crashing, check the following:

- Is your server running out of memory? On some systems, `rippled` may be terminated by the Out Of Memory (OOM) Killer or another monitor process
- If your server is running in a shared environment, are other users or administrators causing the machine or service to be restarted?
- Does your server meet the [minimum requirements](install-rippled.html#minimum-system-requirements) to run `rippled`? What about the [recommendations for production servers](capacity-planning.html#recommendation-1)?

If none of the above apply, please report the issue to Ripple as a security-sensitive bug. If Ripple can reproduce the crash, you may be eligible for a bounty. See <https://ripple.com/bug-bounty/> for details.


### Benign Warnings

During server startup, it is normal for the server to print many warning-level (`WRN`) messages. During server operation, it is normal to print warning-level messages occasionally.

You can **safely ignore** messages such as the following:

```text
2018-Aug-28 22:55:41.738765510 Peer:WRN [012] onReadMessage: Connection reset by peer
2018-Aug-28 22:55:58.316094260 Validations:WRN Val for 2137ACEFC0D137EFA1D84C2524A39032802E4B74F93C130A289CD87C9C565011 trusted/full from nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ signing key n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5 already validated sequence at or past 12133663 src=1
2018-Aug-28 22:56:21.397076850 LedgerMaster:ERR No hash for fetch pack. Missing Index 7159808
2018-Aug-28 22:56:22.256065549 Validations:WRN Unable to determine hash of ancestor seq=3 from ledger hash=00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E seq=12133675
2018-Aug-28 22:56:22.368460130 LedgerConsensus:WRN View of consensus changed during open status=open,  mode=proposing
2018-Aug-28 22:56:22.368468202 LedgerConsensus:WRN 96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661 to 00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E
2018-Aug-28 22:56:22.368499966 LedgerConsensus:WRN {"accepted":true,"account_hash":"89A821400087101F1BF2D2B912C6A9F2788CC715590E8FA5710F2D10BF5E3C03","close_flags":0,"close_time":588812130,"close_time_human":"2018-Aug-28 22:55:30.000000000","close_time_resolution":30,"closed":true,"hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_index":"3","parent_close_time":588812070,"parent_hash":"5F5CB224644F080BC8E1CC10E126D62E9D7F9BE1C64AD0565881E99E3F64688A","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
2018-Aug-28 22:56:36.180827973 LoadMonitor:WRN Job: gotFetchPack run: 11566ms wait: 0ms
2018-Aug-28 22:56:36.180970431 LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
2018-Aug-28 22:56:36.181053831 LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
2018-Aug-28 22:56:36.181110594 LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
2018-Aug-28 22:56:36.181169931 LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
```

***(TODO: waiting for the C++ team to verify that all of the above messages are indeed benign.)***


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

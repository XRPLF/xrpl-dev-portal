---
html: diagnosing-problems.html
parent: troubleshoot-the-rippled-server.html
blurb: Collect information to identify the cause of problems.
---
# Diagnosing Problems with rippled

If you are having problems with `rippled`, the first step is to collect more information to accurately characterize the problem. From there, it can be easier to figure out a root cause and a fix.

See the following pages for some common categories of problems, their causes, and fixes:

- If your server does not start (such as crashing or otherwise shutting down automatically), see **[rippled Server Won't Start](server-wont-start.html)**.
- If your server starts, but does not reliably sync or remain synced to the XRP Ledger network, see **[rippled Server Doesn't Sync](server-doesnt-sync.html)**.

The remainder of this document suggests steps for diagnosing problems that happen while your server is up and running (including if the process is active but unable to sync with the network).

## Get the server_info

You can use the commandline to get server status information from the local `rippled` instance. For example:

```
rippled server_info
```

The response to this command has a lot of information, which is documented along with the [server_info method][].
For troubleshooting purposes, the most important fields are (from most commonly used to least):

- **`server_state`** - Most of the time, this field should show `proposing` for a server that is [configured as a validator](run-rippled-as-a-validator.html), or `full` for a non-validating server. The value `connected` means that the server can communicate with the rest of the peer-to-peer network, but it does not yet have enough data to track progress of the shared ledger state. Normally, syncing to the state of the rest of the ledger takes about 5-15 minutes after starting.

    - If your server remains in the `connected` state for hours, or returns to the `connected` state after being in the `full` or `proposing` states, that usually indicates that your server cannot keep up with the rest of the network. The most common bottlenecks are disk I/O, network bandwidth, and RAM.

    - For example, the following server state information shows a healthy server that took less than 3 minutes to sync (split between the `disconnected`, `connected`, and `syncing` states), and is currently in the fully-synced `proposing` state, where it has remained for approximately 90 minutes:

            $ ./rippled server_info
            Loading: "/etc/opt/ripple/rippled.cfg"
            2020-Jan-03 22:49:32.834134358 HTTPClient:NFO Connecting to 127.0.0.1:5005

            {
              "result" : {
                "info" : {
                  ... (trimmed) ...
                  "server_state" : "proposing",
                  "server_state_duration_us" : "5183282365",
                  "state_accounting" : {
                    "connected" : {
                      "duration_us" : "126164786",
                      "transitions" : 1
                    },
                    "disconnected" : {
                      "duration_us" : "2111321",
                      "transitions" : 1
                    },
                    "full" : {
                      "duration_us" : "5183282365",
                      "transitions" : 1
                    },
                    "syncing" : {
                      "duration_us" : "5545604",
                      "transitions" : 1
                    },
                    "tracking" : {
                      "duration_us" : "0",
                      "transitions" : 1
                    }
                  },
                  ... (trimmed) ...
                }
              }
            }

        If your server shows multiple `transitions` between the same states, that indicates that your server was unable to stay synced. If you do not have a `full` or `proposing` state, then your server has not yet synced to the network. Over a long period of time, it's likely your server may occasionally lose sync because internet connections fluctuate, so this is only a problem if the amount of time spent not in sync is a significant portion of your uptime. After about 24 hours of uptime, if less than 99% of your server's total runtime is spent in the `full` or `proposing` states, you may want to investigate possible sources of instability.

    - For help debugging syncing issues, see [Server Doesn't Sync](server-doesnt-sync.html).

- **`complete_ledgers`** - This field shows which [ledger indexes](basic-data-types.html#ledger-index) your server has complete ledger data for. Healthy servers usually have a single range of recent ledgers, such as `"12133424-12133858"`.

    - If you have a disjoint set of complete ledgers such as `"11845721-12133420,12133424-12133858"`, that could indicate that your server has had intermittent outages or has temporarily fallen out of sync with the rest of the network. The most common causes for this are insufficient disk I/O or network bandwidth.

    - Normally, a `rippled` server downloads recent ledger history from its peers. If gaps in your ledger history persist for more than a few hours, you may not be connected to any peers who have the missing data. If this occurs, you can force your server to try and peer with one of Ripple's full-history public servers by adding the following stanza to your config file and restarting:

            [ips_fixed]
            s2.ripple.com 51235

- **`amendment_blocked`** - This field is normally omitted from the `server_info` response. If this field appears with the value `true`, then the network has approved an [amendment](amendments.html) for which your server doesn't have an implementation. Most likely, you can fix this by [updating rippled](install-rippled.html) to the latest version. You can also use the [feature method][] to see what amendment IDs are currently enabled and which one(s) your server does and does not support.

- **`peers`** - This field indicates how many other servers in the XRP Ledger peer-to-peer network your server is connected to. Healthy servers typically show between 5 and 50 peers, unless explicitly configured to connect only to certain peers.

    - If you have 0 peers, your server may be unable to contact the network, or your system clock may be wrong. (Ripple recommends running an [NTP](http://www.ntp.org/) daemon on all servers to keep their clocks synced.)

    - If you have exactly 10 peers, that may indicate that your `rippled` is unable to receive incoming connections through a router using [NAT](https://en.wikipedia.org/wiki/Network_address_translation). You can improve connectivity by configuring your router's firewall to forward the port used for peer-to-peer connections (port 51235 [by default](https://github.com/ripple/rippled/blob/8429dd67e60ba360da591bfa905b58a35638fda1/cfg/rippled-example.cfg#L1065)).

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

- The `rippled` server is starting up, or is not running at all. Check the status of the service; if it is running, wait a few seconds and try again.
- You may need to pass different [parameters to the `rippled` commandline client](commandline-usage.html#client-mode-options) to connect to your server.
- The `rippled` server may be configured not to accept JSON-RPC connections.


## Check the server log

[By default,](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142) `rippled` writes the server's debug log to the file `/var/log/rippled/debug.log`. The location of the debug log can differ based on your server's config file. If you start the `rippled` service directly (instead of using `systemctl` or `service` to start it), it also prints log messages to the console by default.

The default config file sets the log level to severity "warning" for all categories of log messages by internally using the [log_level method][] during startup. You can control the verbosity of the debug log [using the `--silent` commandline option during startup](commandline-usage.html#verbosity-options) and with the [log_level method][] while the server is running. (See the `[rpc_startup]` stanza of the config file for settings.)

It is normal for a `rippled` the server to print many warning-level (`WRN`) messages during startup and a few warning-level messages from time to time later on. You can **safely ignore** most warnings in the first 5 to 15 minutes of server startup.

For a more thorough explanation of various types of log messages, see [Understanding Log Messages](understanding-log-messages.html).


## Info Collection Script

If you have problems diagnosing the problem, or you are unable to resolve the problem with any of the common fixes, you may want to ask for help in a support forum or the [GitHub issues](https://github.com/ripple/rippled/issues). When asking for help, you can use an info collection script to gather information about your system to help others diagnose the issue.

The official package installation (for [Ubuntu/Debian](install-rippled-on-ubuntu.html) or [CentOS/RedHat](install-rippled-on-centos-rhel-with-yum.html)) installs such a script by default, to `/opt/ripple/bin/getRippledInfo`. [New in: rippled 1.5.0][] If you compiled `rippled` yourself, you can find the same script [in the `rippled` source code repository](https://github.com/ripple/rippled/blob/develop/bin/getRippledInfo).

To use the script:

1. Run the script while `rippled` is running.

        $ /opt/ripple/bin/getRippledInfo

        ####################################################
          rippled info has been gathered. Please copy the
          contents of /tmp/ripple_info.Xo8Xr/rippled_info.md
          to a github gist at https://gist.github.com/

          PLEASE REVIEW THIS FILE FOR ANY SENSITIVE DATA
          BEFORE POSTING! We have tried our best to omit
          any sensitive information from this file, but you
          should verify before posting.
        ####################################################

    The script collects the output of many commands and writes them to a temporary file. The filename is randomized with a string of letters and numbers (case-sensitive), for example: `/tmp/ripple_info.Xo8Xr/rippled_info.md`


2. Look over the output file for sensitive information.

    The script attempts to scrub sensitive information from the output, such as validator keys or tokens. However, you should still check the output before posting publicly, as a precaution. For example, the script outputs detailed information about your server hardware, and you may want to remove some sections for privacy reasons. Use a text editor to read the output file and to remove anything you don't want to post.

        nano /tmp/ripple_info.Xo8Xr/rippled_info.md

3. Upload the output file where others can see it.

    You can upload the file directly to [GitHub Gist](https://gist.github.com/), [Pastebin](https://pastebin.com/), or a similar service. If you are running `rippled` on a remote server, you may find it easier to first transfer the file to a machine with a web browser, using `scp` or a similar tool. <!-- SPELLING_IGNORE: pastebin -->


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Amendments](amendments.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html)
    - [Configure rippled](configure-rippled.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [log_level method][]
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

---
html: configure-statsd.html
parent: configure-xrpld.html
seo:
    description: Monitor your xrpld server with StatsD metrics.
labels:
  - Core Server
---
# Configure StatsD

`rippled` can export health and behavioral information about itself in [StatsD](https://github.com/statsd/statsd) format. Those metrics can be consumed and visualized through [`rippledmon`](https://github.com/ripple/rippledmon) or any other collector that accepts StatsD formatted metrics.

## Configuration Steps

To enable StatsD on your `xrpld` server, perform the following steps:

1. Set up a `rippledmon` instance on another machine to receive and aggregate stats.

    ```
    $ git clone https://github.com/ripple/rippledmon.git
    $ cd rippledmon
    $ docker-compose up
    ```

    Make sure [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed on your machine when performing the steps above. For more information about configuring `rippledmon`, see the [`rippledmon` repository](https://github.com/ripple/rippledmon).

0. Add the `[insight]` stanza to your `xrpld`'s config file.

    ```
    [insight]
    server=statsd
    address=192.0.2.0:8125
    prefix=my_rippled
    ```

    - For the `address`, use the IP address and port where `rippledmon` is listening. By default, this port is 8125.
    - For the `prefix`, choose a name that identifies the `xrpld` server you are configuring. The prefix must not include whitespace, colons ":", or the vertical bar "|". The prefix appears on all of the StatsD metrics exported from this server.

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

0. Restart the `xrpld` service.

    ```
    $ sudo systemctl restart xrpld
    ```

0. Check that the metrics are being exported:

    ```
    $ tcpdump -i en0 | grep UDP
    ```

    Replace `en0` with the appropriate network interface for your machine. For a complete list of the interfaces on your machine use `$ tcpdump -D`.

    Sample Output:

    ```
    00:41:53.066333 IP 192.0.2.2.63409 > 192.0.2.0.8125: UDP, length 196
    ```

    You should periodically see messages indicating outbound traffic to the configured address and port of your `rippledmon` instance.

## Key Metrics to Monitor

After you enable StatsD, the core server exports metrics about its own health and behavior. Each metric arrives as `<prefix>.<group>.<metric>`, where `prefix` is the value you set in the `[insight]` stanza and `group` is the server subsystem that reports it. For example, with `prefix=my_xrpld`, the validated ledger age arrives as `my_xrpld.LedgerMaster.Validated_Ledger_Age`.

All of the metrics in this section are reported as StatsD gauges. Cumulative values are not reset between reports, so calculate rates in your collector. For the complete list of exported metrics, see the [`rippledmon` repository](https://github.com/ripple/rippledmon).

### Ledger

| Metric | Description |
| --- | --- |
| `LedgerMaster.Validated_Ledger_Age` | Age of the last validated ledger, in seconds. |
| `LedgerMaster.Published_Ledger_Age` | Age of the last published ledger, in seconds. |

{% admonition type="info" name="Note" %}
Before the server records its first validated or published ledger, the corresponding metric reports `1209600` (two weeks) rather than an actual age. Exclude that value when setting alert thresholds.
{% /admonition %}

### Server State

These metrics report how long the server has spent in each operational state and how many times it has entered each one. The core server tracks five accounting states: Disconnected, Connected, Syncing, Tracking, and Full. The [xrpld Server States](../../references/http-websocket-apis/api-conventions/xrpld-server-states.md) reference lists seven states, but `validating` and `proposing` aren't tracked separately here; time the server spends in those states is counted under `Full_duration`.

| Metric | Description |
| --- | --- |
| `State_Accounting.Disconnected_duration` | Total time spent in the Disconnected state, in microseconds. |
| `State_Accounting.Connected_duration` | Total time spent in the Connected state, in microseconds. |
| `State_Accounting.Syncing_duration` | Total time spent in the Syncing state, in microseconds. |
| `State_Accounting.Tracking_duration` | Total time spent in the Tracking state, in microseconds. |
| `State_Accounting.Full_duration` | Total time spent in the Full state, in microseconds. |
| `State_Accounting.Disconnected_transitions` | Number of times the server has entered the Disconnected state. |
| `State_Accounting.Connected_transitions` | Number of times the server has entered the Connected state. |
| `State_Accounting.Syncing_transitions` | Number of times the server has entered the Syncing state. |
| `State_Accounting.Tracking_transitions` | Number of times the server has entered the Tracking state. |
| `State_Accounting.Full_transitions` | Number of times the server has entered the Full state. |

### Peers

| Metric | Description |
| --- | --- |
| `Overlay.Peer_Disconnects` | Total number of peer connections that have closed since the server started. |
| `Peer_Finder.Active_Inbound_Peers` | Number of active inbound peer slots (connections initiated by other servers). |
| `Peer_Finder.Active_Outbound_Peers` | Number of active outbound peer slots (connections this server initiated). |

### List All Exported Metrics

```
tcpdump -A -i lo udp port 8125
```

If your collector runs on a different machine, use that machine's network interface instead. Replace `lo` with the interface your StatsD traffic crosses, and `8125` with the port your collector listens on. When the collector runs on the same host as the server, that traffic stays on the loopback interface, which is `lo` on Linux and `lo0` on macOS. On Linux you can also pass `any` to capture on every interface. Each metric appears in the payload as `<prefix>.<group>.<metric>:<value>|<type>`.



## See Also

- **Concepts:**
    - [XRP Ledger Overview](/about/)
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
- **Tutorials:**
    - [Install `xrpld`](../installation/index.md)
    - [Capacity Planning](../installation/capacity-planning.md)
- **References:**
    - [server_info method](../../references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md)
    - [print method](../../references/http-websocket-apis/admin-api-methods/status-and-debugging-methods/print.md)

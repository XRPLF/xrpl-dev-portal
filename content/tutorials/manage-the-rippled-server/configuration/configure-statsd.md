---
html: configure-statsd.html
parent: configure-rippled.html
blurb: Monitor your rippled server with StatsD metrics.
---
# Configure StatsD

`rippled` can export health and behavioral information about itself in [StatsD](https://github.com/statsd/statsd) format. Those metrics can be consumed and visualized through [`rippledmon`](https://github.com/ripple/rippledmon) or any other collector that accepts StatsD formatted metrics.

## Configuration Steps

To enable StatsD on your `rippled` server, perform the following steps:

1. Set up a `rippledmon` instance on another machine to receive and aggregate stats.

        $ git clone https://github.com/ripple/rippledmon.git
        $ cd rippledmon
        $ docker-compose up

    Make sure [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) are installed on your machine when performing the steps above. For more information about configuring `rippledmon`, see the [`rippledmon` repository](https://github.com/ripple/rippledmon).

0. Add the `[insight]` stanza to your `rippled`'s config file.

        [insight]
        server=statsd
        address=192.0.2.0:8125
        prefix=my_rippled

    - For the `address`, use the IP address and port where `rippledmon` is listening. By default, this port is 8125.
    - For the `prefix`, choose a name that identifies the `rippled` server you are configuring. The prefix must not include whitespace, colons ":", or the vertical bar "|". The prefix appears on all of the StatsD metrics exported from this server.

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

0. Restart the `rippled` service.

        $ sudo systemctl restart rippled

0. Check that the metrics are being exported:

        $ tcpdump -i en0 | grep UDP

    Replace `en0` with the appropriate network interface for your machine. For a complete list of the interfaces on your machine use `$ tcpdump -D`.

    Sample Output:

        00:41:53.066333 IP 192.0.2.2.63409 > 192.0.2.0.8125: UDP, length 196

    You should periodically see messages indicating outbound traffic to the configured address and port of your `rippledmon` instance.

For descriptions of each StatsD metric, see the [`rippledmon` repository](https://github.com/ripple/rippledmon).



## See Also

- **Concepts:**
    - [XRP Ledger Overview](xrp-ledger-overview.html)
    - [Consensus Network](consensus-network.html)
    - [The `rippled` Server](the-rippled-server.html)
- **Tutorials:**
    - [Install `rippled`](install-rippled.html)
    - [Capacity Planning](capacity-planning.html)
- **References:**
    - [server_info method](server_info.html)
    - [print method](print.html)

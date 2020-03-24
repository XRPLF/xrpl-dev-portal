# Configure StatsD

 The client implementation of [StatsD](https://github.com/statsd/statsd) within rippled can be enabled to export health and behavioral information about the server. Those metrics can be consumed and visualized through [`rippledmon`](https://github.com/ripple/rippledmon) or any other collector that accepts StatsD formatted metrics. 

## Configuration Steps

 To enable StatsD on your rippled server, perform the following steps:

1. Configure rippledmon on a separate machine. For more information about configuring `rippledmon` see the `rippledmon` [repository](https://github.com/ripple/rippledmon).


0. Add the `[insight]` stanaza to your `rippled`'s config file. The stanza should contain the address that you would like to send StatsD metrics to followed by the port number that `rippledmon` is listneing on.

        [insight]
        server=statsd
        address=192.0.2.0:8125
        prefix=my_rippled


0. Restart the `rippled` service.

        $ sudo systemctl restart rippled

For a quick way to check if metrics are being exported, try the following command:

        $ tcpdump -i en0 | grep UDP

Replace en0 with the appropriate network interface for your machine. 

Sample Output:

        00:41:53.066333 IP 192.0.2.2.63409 > 192.0.2.0.8125: UDP, length 196

If you periodically see the 8125 port suffix on the destination address, you can be confident that your server is properly exporting StatsD metrics.

For descriptions of each StatsD metric see the `rippledmon` [repository](https://github.com/ripple/rippledmon)



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






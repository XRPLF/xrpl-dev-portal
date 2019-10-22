# System Requirements

## Minimum Specifications

A `rippled` server should run comfortably on commodity hardware, to make it inexpensive to participate in the network. At present, Ripple recommends the following minimum requirements:

- Operating System:
    - Production: CentOS or RedHat Enterprise Linux (latest release), Ubuntu (16.04+), or Debian (9.x) supported
    - Development: Mac OS X, Windows (64-bit), or most Linux distributions
- CPU: 64-bit x86_64, 2+ cores
- Disk: Minimum 50GB for the database partition. SSD strongly recommended (minimum 1000 IOPS, more is better)
- RAM: 8GB+

Amazon EC2's `m3.large` VM size may be appropriate depending on your workload. A fast network connection is preferable. Any increase in a server's client-handling load increases resources needs.


## Recommended Specifications

For best performance in enterprise production environments, Ripple recommends running `rippled` on bare metal with the following characteristics:

- Operating System: Ubuntu 16.04+
- CPU: Intel Xeon 3+ GHz processor with 4 cores and hyperthreading enabled
- Disk: SSD (7000+ writes/second, 10,000+ reads/second)
- RAM:
  	- For testing: 8GB+
  	- For production: 32GB
- Network: Enterprise data center network with a gigabit network interface on the host

## System Time

A `rippled` server relies on maintaining accurate time. It is recommended that the system synchronize time using the Network Time Protocol (NTP) with daemons such as `ntpd` or `chrony`.


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html) - More information on the recommended specifications and planning for production needs
    - [Install `rippled`](install-rippled.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

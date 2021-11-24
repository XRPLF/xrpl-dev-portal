---
html: system-requirements.html
parent: install-rippled.html
blurb: Hardware and software requirements for running rippled.
labels:
  - Core Server
---
# System Requirements

## Recommended Specifications

For reliable performance in production environments, it is recommended to run an XRP Ledger (`rippled`) server on bare metal with the following characteristics:

- Operating System: Ubuntu (LTS) or CentOS or RedHat Enterprise Linux (latest release)
- CPU: Intel Xeon 3+ GHz processor with 8+ cores and hyperthreading enabled
- Disk: SSD / NVMe (10,000 IOPS or better)
- RAM: 64 GB
- Network: Enterprise data center network with a gigabit network interface on the host


## Minimum Specifications

For testing purposes or occasional use, you can run an XRP Ledger server should on commodity hardware. The following minimum requirements should work for most cases, but may not always [stay synced with the network](server-doesnt-sync.html):

- Operating System: Mac OS X, Windows (64-bit), or most Linux distributions (Red Hat, Ubuntu, and Debian supported)
- CPU: 64-bit x86_64, 4+ cores
- Disk: Minimum 50 GB for the database partition. SSD strongly recommended (minimum 1000 IOPS, more is better)
- RAM: 16 GB+

<!-- SPELLING_IGNORE: iops, ntp, x86_64, ec2 -->

Amazon EC2's `m3.large` VM size may be appropriate depending on your workload. A fast network connection is preferable. Any increase in a server's client-handling load increases resources needs.


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

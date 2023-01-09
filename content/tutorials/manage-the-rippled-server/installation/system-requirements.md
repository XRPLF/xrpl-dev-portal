---
html: system-requirements.html
parent: install-rippled.html
blurb: Hardware and software requirements for running rippled.
labels:
  - Core Server
---
# System Requirements

## Recommended Specifications

For reliable performance in production environments, it is recommended to run an XRP Ledger (`rippled`) server on bare metal with the following characteristics or better:

- Operating System: Ubuntu (LTS) or CentOS or RedHat Enterprise Linux (latest release).
- CPU: Intel Xeon 3+ GHz processor with 8+ cores and hyperthreading enabled.
- Disk: SSD / NVMe (10,000 IOPS sustained - not burst or peak - or better). Minimum 50 GB for the database partition. Do not use Amazon Elastic Block Store (AWS EBS) because its latency is too high to sync reliably.
- RAM: 64 GB.
- Network: Enterprise data center network with a gigabit network interface on the host.


## Minimum Specifications

For testing purposes or occasional use, you can run an XRP Ledger server on commodity hardware. The following minimum requirements should work for most cases, but may not always [stay synced with the network](server-doesnt-sync.html):

- Operating System: Mac OS X, Windows (64-bit), or most Linux distributions (Red Hat, Ubuntu, and Debian supported).
- CPU: 64-bit x86_64, 4+ cores.
- Disk: SSD / NVMe (10,000 IOPS sustained - not burst or peak - or better). Minimum 50 GB for the database partition. Do not use Amazon Elastic Block Store (AWS EBS) because its latency is too high to sync reliably.
- RAM: 16 GB+.

<!-- SPELLING_IGNORE: iops, ntp, x86_64, ec2, nvme -->

Amazon EC2's `i3.2xlarge` VM size may be appropriate depending on your workload. A fast network connection is preferable. Any increase in a server's client-handling load increases resources needs.

For a validator, consider `z1d.2xlarge` with an extra 1 TB disk for logging and core dump storage.


## System Time

A `rippled` server relies on maintaining the correct time. It is recommended that the system synchronize time using the Network Time Protocol (NTP) with daemons such as `ntpd` or `chrony`.


## See Also

- **Concepts:**
    - [The `rippled` Server](xrpl-servers.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html) - More information on the recommended specifications and planning for production needs
    - [Install `rippled`](install-rippled.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
- **References:**
    - [rippled API Reference](http-websocket-apis.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

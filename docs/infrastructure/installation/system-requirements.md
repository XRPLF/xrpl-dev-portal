---
seo:
    description: Hardware and software requirements for running xrpld or Clio.
labels:
  - Core Server
---
# System Requirements

The following system requirements apply to both the core XRP Ledger server, `xrpld`, and the Clio server for API access.

## Recommended Specifications

For reliable performance in production environments, it is recommended to run a server on bare metal with the following characteristics or better:

- Operating System: One of the following supported Linux distributions:

    | Distribution | Versions |
    |---|---|
    | Ubuntu | 22.04 (Jammy), 24.04 (Noble), 26.04 (Resolute) |
    | Debian | 12 (Bookworm), 13 (Trixie) |
    | Rocky Linux | 9 |
    | AlmaLinux | 9 |
    | Fedora | 42 |
- CPU: 3+ GHz 64-bit x86_64 processor with 8+ cores.
- Disk: SSD / NVMe (10,000 IOPS sustained - not burst or peak - or better). Minimum 50 GB for the database partition. Do not use Amazon Elastic Block Store (AWS EBS) because its latency is too high to sync reliably.
- RAM: 64 GB.
- Network: Enterprise data center network with a gigabit network interface on the host.

For a validator in AWS, consider `z1d.2xlarge` with an extra 1 TB disk for logging and core dump storage.

## Minimum Specifications

{% admonition type="warning" name="Caution" %}These specifications are not enough to reliably [stay synced with Mainnet](../troubleshooting/server-doesnt-sync.md). For production use, follow the recommended specifications above.{% /admonition %}

For testing purposes, you can run an XRP Ledger server on commodity hardware with the following minimum requirements:

- Operating System: macOS, Windows (64-bit), or a supported Linux distribution (see recommended specs above).
- CPU: 64-bit x86_64, 4+ cores.
    - For development purposes, it is also possible to compile `rippled` for some Apple Silicon or ARM processors. See the {% source-link name="Build instructions" path="BUILD.md" /%} for guidance. However, architectures other than x86_64 are not officially supported and are not recommended for production.
- Disk: SSD / NVMe (10,000 IOPS sustained - not burst or peak - or better). Minimum 50 GB for the database partition. Do not use Amazon Elastic Block Store (AWS EBS) because its latency is too high to sync reliably.
- RAM: 16 GB+.

<!-- SPELLING_IGNORE: iops, ntp, x86_64, ec2, nvme -->

Amazon EC2's `i3.2xlarge` VM size may be appropriate depending on your workload. A fast network connection is preferable. Any increase in a server's client-handling load increases resources needs.


## System Time

A `xrpld` server relies on maintaining the correct time. It is recommended that the system synchronize time using the Network Time Protocol (NTP) with daemons such as `ntpd` or `chrony`.


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.md) - More information on the recommended specifications and planning for production needs
    - [Install `xrpld`](index.md)
    - [Troubleshoot xrpld](../troubleshooting/index.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
seo:
    description: What a non-production XRP Ledger server needs for learning, tutorials, and test networks.
---
# Development and Testing

If you want to try the XRP Ledger, learn how the core server works, or follow tutorials, you don't need production-grade hardware. The other pages in this section describe what's needed to operate reliably in production; for casual development and testing, a much smaller setup is enough.

## Production vs. Development and Testing

The distinction matters because the requirements are very different:

- **Production** is when other people (users, partners, or applications) rely on your server's availability, performance, or correctness. The pages for [Stock Node](stock-node.md), [Validator](validator.md), [Full History](full-history.md), [Hub](hub.md), [Pathfinding](pathing.md), and [Clio](clio.md) describe production requirements.
- **Development and testing** is when only you or your team rely on the server, usually for learning, prototyping, or experimentation.

The rest of this page covers the second case.

## What's Enough for Learning

The simplest setup is a [stock `xrpld` server](../../configuration/server-modes/stock-node.md) on a modest host. The minimum specifications below are typically enough; you don't need to meet the recommended (production) specifications documented on the per-type pages.

Hosts that work well:

- A cheap virtual private server (VPS) from a common cloud provider
- A dedicated machine on your home network with reasonable specs
- A spare laptop or desktop

A stock server connects to the network, accepts transactions, and keeps recent ledger history. That's enough for most APIs, tutorials, and exploration. You don't need [full history](../../configuration/server-modes/full-history.md), validator-grade hardware, or a high-end host until you have a production reason.

Point a learning server at the Testnet or Devnet, not Mainnet. Test networks are much smaller, and the minimums below are meant for them; on Mainnet they won't reliably keep up (see the Caution below). [Connect Your xrpld to a Parallel Network](../../configuration/connect-your-xrpld-to-the-xrp-test-net.md) has the steps. For unit tests or experiments with no network at all, run `xrpld` in [stand-alone mode](../../testing-and-auditing/start-a-new-genesis-ledger-in-stand-alone-mode.md), which these minimums cover comfortably. And if you only want to follow tutorials, you may not need a server of your own yet: the public Testnet and Devnet servers and the [XRP Faucets](/resources/dev-tools/xrp-faucets) cover that.

## Minimum Specifications

{% admonition type="warning" name="Caution" %}These specifications aren't enough to reliably [stay synced with Mainnet](../../troubleshooting/server-doesnt-sync.md). For production, see the requirements on the appropriate per-type page.{% /admonition %}

For testing purposes, you can run an XRP Ledger server on commodity hardware with the following minimum requirements:

- Operating System: Linux. Ubuntu, Debian, and Red Hat have packages; other distributions may build but are untested. macOS 15 or later and 64-bit Windows work for development, built from source.
- CPU: 64-bit x86_64, 4+ cores.
  - For development purposes, it is also possible to compile `xrpld` for some Apple Silicon or ARM processors. See [Build xrpld on Linux, Mac, or Windows](../../installation/build-on-linux-mac-windows.md) for guidance. However, architectures other than x86_64 aren't officially supported and aren't recommended for production.
- Disk: SSD / NVMe (10,000 IOPS sustained - not burst or peak - or better). Minimum 50 GB for the database partition. Don't use Amazon Elastic Block Store (AWS EBS) because its latency is too high to sync reliably.
- RAM: 16 GB+.

<!-- SPELLING_IGNORE: iops, ntp, x86_64, ec2, nvme -->

A fast network connection is preferable. Any increase in a server's client-handling load increases resource needs.

## See Also

- [System Requirements](index.md): overview of requirements across server types
- [Install `xrpld`](../../installation/index.md): installation steps for supported platforms

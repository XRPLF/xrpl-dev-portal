---
seo:
    description: Hardware, storage, and cost reality for running an XRP Ledger full history server.
labels:
  - Core Server
---
# Full History System Requirements

A full history server is an `xrpld` (formerly `rippled`) server that keeps every ledger version back to the start of the XRP Ledger's retained history (ledger index 32570). Very few servers need to do this, and the requirements are unlike any other role: this is a storage project first and a server second.

{% admonition type="info" name="Dated figures" %}
Measurements on this page are from production full history deployments in 2026. History only grows: recheck the sizes and growth rate before you buy anything.
{% /admonition %}

## The scale, measured

On one production full history server in mid-2026:

| Component | Size |
|:----------|:-----|
| NuDB ledger store (`nudb.dat`) | 28 TB |
| NuDB key file (`nudb.key`) | 3.8 TB |
| SQLite transaction database (`transaction.db`) | 12 TB |
| **Total** | **~44 TB** |

Growth was roughly **400 to 500 GB per month**, and the rate rises with network activity. Plan the storage runway in years, not months.

{% admonition type="warning" name="Two built-in limits to design around" %}
The NuDB store is a single file larger than ext4's 16 TiB (about 17.6 TB) single-file limit: use XFS (recommended) or ZFS. And `transaction.db` has a hard ceiling set by its SQLite page size, about 17.6 TB on the default settings, and the 12 TB in the table above is already about 68% of it - **configure the page size before the database is first created**. See [Fix SQLite Transaction Database Page Size](../../troubleshooting/fix-sqlite-tx-db-page-size-issue.md).
{% /admonition %}

## Hardware that works in production

- **Storage:** tens of TB of solid-state storage per server, with room to grow. Production deployments use arrays of SAS or NVMe SSDs, commonly in RAID 0 for speed, with redundancy provided by running multiple servers rather than by the array (see [Full History Best Practices](../../configuration/best-practices/full-history.md#redundancy-is-the-backup)). All of it on a filesystem without a 16 TiB file limit.
- **Memory:** large memory helps the page cache but isn't the constraint people expect. A production server with 512 GB fitted averages about 80 GB in actual use. 128 to 256 GB is a sensible fit for new builds.
- **CPU:** server-class with plenty of threads for serving; full history nodes in production run heavier worker-thread tuning than other roles (see [Full History](../../configuration/server-modes/full-history.md#configuration-shape)). CPU is still not the binding resource.
- **Disk throughput and IOPS:** sustained IOPS matter most while a server catches up to the network; below roughly 5,000 random IOPS a server can't acquire sync at all, and 10,000 is the comfortable floor. Under normal serving load, a healthy full history server's I/O is surprisingly flat.
- **Network:** 1 Gbps is standard; a faster private link between your own full history servers pays for itself the first time you rebuild one. The measured sibling copy moved about 30 TB, the NuDB files, in 7 to 8 hours at 10 Gbps; copying the whole ~44 TB including `transaction.db` takes longer.

## The economics

Full history is the one role where hosting choice is effectively settled: **own hardware in colocation**. Two independent professional operators reached the same verdict:

- A three-server full history cluster costs on the order of a few hundred dollars per server per month in rack costs once the hardware is bought (hardware on the order of $15,000 to $30,000 USD for three machines, more at current prices).
- The same deployment priced on a major cloud came to roughly ten times the monthly cost, before solving how to transfer tens of TB in.

As one operator put it: if you are going all-in on XRPL infrastructure, rent a rack and fill it with machines.

Budget the attention too: production operators report roughly an hour a week when everything is healthy, and multi-day efforts when something breaks at this scale.

## Who should not build this

You don't need full history to validate, to serve current state, or to run almost any application. Recent-history retention covers the overwhelming majority of uses at a fraction of the cost; see [Configure Online Deletion](../../configuration/data-retention/configure-online-deletion.md). Build full history if you operate an explorer, an indexer, an analytics platform, or a public data service - and read [Full History Best Practices](../../configuration/best-practices/full-history.md) first, because one server of this kind isn't a deployment, it is a liability.

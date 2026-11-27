---
seo:
    description: Operate XRP Ledger full history servers - redundancy as backup, rebuilding nodes, upgrades, and the storage ceilings to watch.
labels:
  - Core Server
---
# Full History Best Practices

Operating `xrpld` (formerly `rippled`) full history servers is dominated by one fact: at tens of terabytes, there is no practical backup system. Everything in this page follows from how production operators live with that.

## Redundancy is the backup

No incremental or differential backup exists for a store this size, and a full copy takes most of a day with the source **offline** (7 to 8 hours for the ~30 TB of NuDB files at 10 Gbps, longer for everything). Production operators solve this by making the fleet its own backup:

- **Three servers minimum, four to be safe.** The arithmetic of a failure: one server keeps serving, one acts as the copy source for the rebuild, and the replacement rebuilds from it. With only two, a single failure leaves you serving with no safety margin for the many hours a rebuild takes; with one, a disk failure is the end of your dataset.
- RAID 0 inside each server is a legitimate choice at this scale - speed and capacity per chassis - precisely because redundancy lives at the fleet level, not the array level. A mirrored array would also faithfully mirror corruption.
- What you do back up conventionally: configs, keys, and `wallet.db`. They are small, and they are the parts you can't regenerate.

## Standing up server N (or rebuilding one)

The honest acquisition picture, from operators who have done all of it:

1. **Copy from a sibling** - the production method. Expect 7 to 8 hours for ~30 TB of NuDB files over a 10 Gbps private link, and more for the whole ~44 TB. **The store can't be copied hot: stop the donor server first**, and plan for it to resync and catch up afterward. A copied `transaction.db` keeps the donor's page size, so check `PRAGMA page_size` on the new server, and make sure its filesystem takes a single file over 16 TiB.
2. **Import a ledger store dump** using `[import_db]` and `--import`; see [Configure Full History](../data-retention/configure-full-history.md). This is the same idea when the source is a file rather than a sibling, but the import fills the `[node_db]` store only, so check where `transaction.db` and its page size come from. For datasets this size, physical delivery of drives is often the fastest transfer.
3. **Backfill from the network: not viable for full history.** Historical acquisition is the server's lowest-priority work, and operators report it effectively never completes at this scale. Peering with full history servers (Ripple's `s2.ripple.com` pool, or another operator by arrangement) works for filling bounded gaps, not for acquiring 44 TB.

Rehearse the rebuild before you need it. The operators who trust this model are the ones who have actually exercised it.

## Upgrades

- **One server at a time, verify, then the next.** Never upgrade the fleet together: a bad release plus an eager rollout is how you lose the dataset's redundancy in an afternoon.
- Production full history operators deliberately run **behind** the network: upgrade after the majority has, unless a release is an urgent fix. Stability beats freshness when a resync costs days. Keep the version-drift and `amendment_blocked` alerts from [Validator Best Practices](validator.md#alert-on-the-right-things) on, because an amendment can activate about two weeks after it reaches 80% support, and a server that doesn't support it becomes amendment blocked.
- Watch restarts generally: avoid stopping a server while an [online deletion rotation is in flight](https://github.com/XRPLF/rippled/issues/8518) - not applicable to pure full history servers (no deletion), but most fleets also run recent-history servers where it is. And after any troubled restart, remember the empty-until-synced startup behavior before concluding data is lost; see [Restart with care](validator.md#restart-with-care).

## Watch the ceilings

Two numbers deserve standing alerts on a full history server:

- **Free disk versus growth rate, on every volume that holds the store.** At 400-500 GB/month growth, a comfortable margin evaporates in months. Alert on projected runway, not just percent used. The server's own 512 MB free-space stop only watches the `[database_path]` volume, and only while `use_tx_tables` is on, so a separate drive or array for the NuDB files is yours to watch.
- **`transaction.db` versus its page-count ceiling.** The SQLite database has a hard maximum size fixed by its page size (about 17.6 TB at the default page size; up to ~281 TB at the maximum). One community deployment measured 68% of its ceiling in 2026, and the operator learned of the limit from this documentation project rather than from any warning in advance. The server's only warning is its last: when less than 512 MB of page headroom is left it logs a fatal message and stops cleanly, and the fix is a `--vacuum` rebuild that can take days with the server offline. On ext4 a single file also tops out at 16 TiB (the same size as the default ceiling), so a larger page size only helps on XFS or ZFS. Alert on projected runway in months. Check yours: see [Fix SQLite Transaction Database Page Size](../../troubleshooting/fix-sqlite-tx-db-page-size-issue.md) for the check and the verified fix.

## Serving health

- Monitor **ledger completeness** (`complete_ledgers` = `32570-tip`), not just sync. After a restart the range reads empty until the server has synced and then back-fills from the local store at low priority, so give the alert a window and don't read the empty range as lost data; see [An empty range after a restart is normal](validator.md#an-empty-range-after-a-restart-is-normal).
- Run a **real historical query** as a scheduled check - process health and HTTP 200s can all be green while historical serving is broken.
- At this scale, I/O statistics are flat in normal operation; a sustained change in the I/O profile is a signal even when nothing else complains.

## Plan for the long game

A full history server is a commitment measured in years: the dataset's value is its continuity. Document the rebuild procedure, keep the hardware lifecycle funded (the growth rate retires drives on a schedule), and know who you would call to re-acquire history if the worst happened - the short list of operators who hold it is the real disaster recovery plan, which is also a reason to be a good citizen of that list.

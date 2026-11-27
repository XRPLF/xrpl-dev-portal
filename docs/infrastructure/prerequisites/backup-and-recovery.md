---
seo:
    description: What to back up on an xrpld server, what never to back up, and how operators who have actually restored do it.
labels:
  - Core Server
---
# Backup and Recovery

Backing up an `xrpld` (formerly `rippled`) server is unusual: almost everything on it is deliberately disposable, and the few things that aren't are tiny. Most operators get this backwards - imaging whole drives while the one irreplaceable file sits in a single copy on the server itself.

## What to back up

| Asset | Size | Why |
|:------|:-----|:----|
| **Validator master key** (`validator-keys.json`) | bytes | The only thing on a validator that can't be regenerated: your network identity, UNL standing, and domain verification bind to it. Keep it **off the server**, offline, with a tested second copy, and refresh both copies after every `create_token` or `set_domain`, because the file holds the current `token_sequence`. The token in the config is derived from it and reissuable. |
| Configuration (`xrpld.cfg`, `validators.txt`) | KB | Reconstructible by hand, but slowly; version-control or copy before every change. On a validator `xrpld.cfg` holds `[validator_token]` (and `[node_seed]` if you set one), so keep those lines out of the repository and treat every copy of the file as a copy of the secret; see [If you suspect exposure](../configuration/security/validator.md#if-you-suspect-exposure) |
| `wallet.db` | KB-MB | Carries the node identity, peer reservations, amendment votes, and the validator and publisher manifests the server trusts; a restored copy keeps all of them. Without it the server mints a new node identity (unless `[node_seed]` pins one), peer reservations and cluster trust must be redone, and amendment votes revert to defaults. Back it up together with `xrpld.cfg`: at startup the server keeps whichever manifest has the higher sequence, so a current `wallet.db` with an older `xrpld.cfg` makes it treat the configured token as stale while still signing with that token's key, and the two disagree. Copy the file from a stopped server, or use SQLite's online backup (`sqlite3 wallet.db ".backup wallet-backup.db"`); a plain copy taken while the server is writing can be inconsistent |
| Anything of your own (scripts, monitoring, units, drop-ins) | small | Version control; infrastructure-as-code shops reconstruct entire hosts from it |


## What not to back up

**The ledger store, on most servers.** For a validator, or any server that keeps a day or so of history, resyncing from the network is faster and more reliable than a restore, and the data is public: there is nothing to protect. Operators imaging terabytes of `nudb` are spending real money to make recovery slower. Retention changes the calculation. A server that keeps months of history is back on the current ledger within hours of a rebuild, while the history its API users need takes weeks to backfill, so decide by the history you must serve, the downtime you can accept, and a restore procedure you have tested. At [full history](../configuration/best-practices/full-history.md#redundancy-is-the-backup) scale the dataset can't be re-acquired casually, and the answer there is fleet redundancy, not backup media.


## The custody spectrum

Both ends run in production; pick by what you're protecting:

- **Floor** (home validator): master key generated offline, stored off-box on two media, config copies before changes (kept as private as the token they contain). Ten minutes of work; one operator discovered mid-survey that his only master key copy lived on the validator itself - the realization is common, the fix is cheap.
- **Ceiling** (professional fleet): keys generated on an isolated machine straight into offline cold storage; the active token in a secrets manager, fetched at runtime with audit logging; configs reconstructed from version-controlled infrastructure code; restore procedures rehearsed.

## Recovery, from operators who have done it

The operators who have genuinely restored converge on the same lessons:

1. **Exercise the restore once, for real.** Untested backups are hopes. The operators who trust their recovery are the ones who have rebuilt a server from keys + config + resync and timed it.
2. **Decide the rebuild-vs-repair rule before the incident.** One fleet operator starts provisioning a replacement the moment a root cause isn't obvious, because a fresh server is ~30 minutes and diagnosis under pressure is open-ended - "a race which will happen first." Know your own rebuild time.
3. **Don't delete in haste.** After a bad restart the server reports an empty ledger range until it syncs; a healthy store looks lost. One operator destroyed an intact store this way. Check file sizes, give it time, then decide. See [Understanding Log Messages](../troubleshooting/understanding-log-messages.md#need-consensus-ledger).
4. **A restored validator must not overlap its predecessor.** Never run two servers with the same validator key, even briefly during recovery - see [No High Availability](../configuration/security/validator.md#no-high-availability). Recovery order: new host up and synced as a plain server first, identity moved last.
5. **Check what a restored `wallet.db` carries.** On a hub, `peer_reservations_list` should show every reservation you expect; on a validator, the `feature` command should show your intended votes. Any amendment-voting commands under `[rpc_startup]` run at every start and override votes restored from the file, so keep them in step with your current choices.


## See Also

- [Validator Security](../configuration/security/validator.md) - key custody in full
- [Full History Best Practices](../configuration/best-practices/full-history.md) - redundancy as backup at scale
- [Minimal Configurations](../configuration/minimal-configurations.md) - small configs are easy configs to keep safe

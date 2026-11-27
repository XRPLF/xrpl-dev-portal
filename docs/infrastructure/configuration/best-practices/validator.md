---
seo:
    description: Day-to-day operating practices for a production XRP Ledger validator, from operators who run them.
labels:
  - Core Server
  - Blockchain
---
# Validator Best Practices

A well-run validator is boring. Operators of trusted validators report years without a serious incident on near-default configuration. What separates them from the validators that drop off UNLs isn't tuning. It is knowing what healthy looks like, being told promptly when it stops, and treating every restart and upgrade as an event with a cost.

This page covers operating an `xrpld` (formerly `rippled`) validator after it is set up. For setup, see [Validator](../server-modes/validator.md). For keys, exposure, and host hardening, see [Validator Security](../security/validator.md).

## Know what healthy looks like

Compare your validator against these reference values, measured on production validators in 2026:

| Signal | Healthy | Where to read it |
|:-------|:--------|:-----------------|
| `server_state` | `proposing`, continuously | [server_info method][] over an **admin** connection; non-admin connections report `full` even while proposing |
| Ledger close time | About 3.9 s average; converge time about 3 s | [server_info method][] (`last_close`) or [consensus_info method][] |
| Agreement | 100% over 24 hours; 99.95% or better over a month, with the misses in a few clusters you can explain (a restart costs about 15 missed validations a minute) | Your own monitoring from the validation stream. Explorer-derived agreement is a reconstruction and has shown network-wide false readings; use it as a cross-check |
| `load_factor` | 1, with brief spikes into the thousands during network events while agreement holds | [server_info method][] |
| Peers | Stable, near the count you configured; brief dips are normal, a sustained drop or one direction collapsing isn't | [peers method][] |
| Memory | `MemAvailable` above a few GB; "used" near full is normal (page cache) | Host metrics |
| `io_latency_ms` | 1 | [server_info method][]. This times the server's internal I/O queue, not the disk; read disk latency from host metrics |

Timing expectations:

- A restart costs about 3 minutes before the server proposes again on a dedicated host with local NVMe, and 5 to 25 minutes on smaller or shared hosts, where several of those minutes are spent in `connected` with an empty `complete_ledgers` range even when the ledger store is intact. More than about 15 minutes in `connected` isn't normal; see [Restart with care](#restart-with-care). Watch `server_state` over an admin connection rather than a clock. The log line `Need consensus ledger` during this phase is normal.
- Sync is faster with good fixed peers than with discovered peers.

## Alert on the right things

The alert sets of three professional operators and several home operators converge on the same core. Alert on:

- **`server_state` leaving `proposing` for more than a minute or two.** The one rule everybody has. Brief drops are normal: one validator left `full` about 20 times in 25 days for under two minutes in total, so alerting on every transition pages you for nothing. Poll it over an admin connection; a monitor on a non-admin port sees `full` forever and never fires.
- **Agreement and missed validations.** Missed validations per hour, and agreement below 100% over a window. Operators who track alert history from their own validation stream report that this rule rarely fires without a real cause such as a restart, an upgrade, or network gear.
- **Validated ledger age.** Watch at 15 seconds, alert at 30. Read it from `server_info` (`validated_ledger.age`), not from the `/health` endpoint, which in current versions never receives the age and so never reports on it. The age is your server's view and is the first number to go stale when your server loses its peers, so check a public server: if its validated ledger is just as old, the network has a problem, and if not, yours does.
- **Peer count dropping**, with inbound and outbound counted separately. A total that stays flat can hide one direction collapsing.
- **`MemAvailable` low, or sustained swap-in activity.** Pages being read back from swap, or stall time in `/proc/pressure/memory`, are the early warning. Swap *used* isn't: stale pages can sit in swap for weeks on a healthy host, and a swap-used alert fires for nothing. See [Memory](../../prerequisites/system-requirements/validator.md#memory).
- **Disk free space** on both the ledger-store volume and the volume holding the SQLite databases. The server's own check looks only at the volume that holds `[database_path]`, and runs only while `use_tx_tables` is on (the default), so a ledger store on its own drive, or a server without transaction tables, has no check but yours. When that volume has under 512 MB free the server logs a fatal message and exits cleanly with status 0, and `systemd` with `Restart=on-failure` doesn't restart a clean exit. The alert is the fix; a restart loop against a full disk isn't.
- **Version drift.** The server logs `Check for upgrade: A majority of trusted validators are running a newer version.` at error level, repeated weekly, when 60% or more of the trusted validators that report an `xrpld` version are running a newer one (it checks only once it has validations from 90% of the UNL). By then it is urgent: amendments activate about two weeks after support rises above 80%, and a server that doesn't support an enabled amendment becomes [amendment blocked](../../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers). Alert on `amendment_blocked` too, in case you missed the warning.
- **Validator list expiry.** Read `publisher_lists` from the [validators method][]. Alert if any list shows `available: false` or an `expiration` less than three days away. Lists normally refresh silently for years; the check is cheap and the failure mode (outbound HTTPS or DNS to the publisher broken by a firewall change) is otherwise invisible until the list expires and the server can no longer judge validity.
- **Link flaps, and failed lookups for the list publishers in the log.** A gateway reboot shows up on the host as carrier flaps and in the server log as `Host not found` for the publisher sites, before the missed validations arrive.

Rules of thumb that operators learned the hard way:

- **Alert on sustained windows, not spikes.** `load_factor` spikes to thousands during network events with no effect on agreement, so treat it as context for other alerts rather than an alert of its own; one operator's standalone `load_factor` rule fired 24 times in six months, and three of those came with a real agreement drop. The health check's own guidance to require several consecutive failures applies to everything.
- **Counters are cumulative since start.** `peer_disconnects` and `peer_disconnects_resources` in the [server_info method][] and the read and write counters in [get_counts method][] never reset; the object counts in the same response (`Ledger`, `Transaction`, and the rest) are current in-memory totals that rise and fall, so watch those as values. Graph and alert on deltas of the cumulative ones, not values. Two of the [get_counts method][] fields, `node_reads_hit` and `node_read_bytes`, are also 32-bit and wrap (the byte counter every few hours on a busy server), so take those deltas modulo 2^32. Reading a large cumulative number after an incident and concluding it is still happening is the most common misreading. One operator found 134,000 disconnects in 14 hours behind a status line that said `proposing` with clean agreement, only by diffing the counter.
- **Monitor freshness, not liveness.** `systemctl` says `active`, the process answers, the dashboard renders, and the validated ledger is 40 seconds old. Every check should prove fresh data, not a running process.
- **Node health isn't what the network sees.** Check an external view of your validator (an explorer or validator registry) as well as your own server, but treat explorer figures as a cross-check, not a primary alert source. In one incident every trusted validator showed about 66% agreement on the public explorers for hours while the network was fine, because the shared data service behind them had a bug; the same service had earlier dropped a validator from its history for days. See [Validator Not Visible on Explorers](../../troubleshooting/validator-not-visible-on-explorers.md).
- **Alert when a reboot is pending.** Automatic operating-system updates leave kernel updates waiting for a reboot that never comes. Alert on the pending-reboot flag and reboot in a quiet window using the restart procedure below.
- **Alerts must leave the host.** The failures that surprise operators are the ones where the thing that should alert is the thing that is down: power, the router, the monitoring relay after a reboot. Push alerts to a phone or a service off-site. A small operator's alternative to a threshold stack is a dead man's switch: a cron job that reports success on schedule, and silence is the alert.
- **The health check is wrong for private validators.** It reports a warning at one to seven peers and critical at none, so a validator behind a few fixed peers never reports healthy, and it reports a warning when `load_factor_server` passes 100 times `load_base` and critical at 1,000 times (the server's own load, not the open-ledger fee escalation that the headline `load_factor` can also carry), which can happen during network-wide load while validators keep full agreement; gate on `server_state` instead. See [The health check and private validators](../server-modes/validator.md#5-verify-your-network-connection).

Community operators publish their tooling, and two are worth knowing: a long-running operator's [field guide](https://github.com/realgrapedrop/rippled-field-guide) collecting measured configuration and monitoring practice, and an open-source [validator dashboard](https://github.com/joshuahamsa/LFG-XRPL-Validator-Dashboard) built because no standard one existed. Community-maintained, not endorsed by the XRPL Foundation or Ripple; review anything before you run it.
## Failures outside the host

Operators' worst outages rarely came from the server. They came from everything upstream of it, none of which warned first:

- **Network gear that updates itself.** A gateway installed a firmware update on its own overnight and rebooted. The validator missed validations on 27 ledgers over about nine minutes and recovered without help, and nothing on the host warned first. Disable automatic updates on routers and gateways feeding a validator and apply them manually in a quiet window. Alert on link flaps, and keep the gateway's own event log, because that is what turns a mystery spike into a one-line root cause.
- **DHCP.** A host that lost its lease renewal during a memory thrash never got its address back. Give the validator a static address.
- **Power.** Home and small-datacenter operators run a UPS sized for their longest realistic outage, and some run two.
- **The ISP.** Fiber cuts are the most common worst-incident among home operators. Serious home deployments run a second connection.
- **DNS.** A local caching resolver keeps peer and validator-list lookups working through short upstream failures.

Design around your lowest third-party SLA. If you can't, that is your availability.

## Restart with care

Every restart of a trusted validator is visible to the network. Before you stop the server:

1. **Check for an in-flight online deletion rotation.** The log line is `rotating  validatedSeq` with two spaces, so grep loosely:

    ```sh
    grep -E 'rotating +validatedSeq|finished rotation' /var/log/xrpld/debug.log | tail -2
    ```

    If the most recent `rotating` line isn't followed by `finished rotation`, wait. Rotation copies live data forward between two backend stores and then deletes the old one, in several steps. A restart that lands mid-rotation preceded the prolonged failure-to-sync under investigation upstream (XRPLF/rippled [#8518](https://github.com/XRPLF/rippled/issues/8518)) - in that incident even a clean stop was followed by 40+ minutes stuck in `connected` - so wait out a rotation when you can.
2. **If a restart goes wrong, don't delete anything in haste.** See [An empty range after a restart is normal](#an-empty-range-after-a-restart-is-normal) below before you touch the data directory.
3. **Give the server time to stop.** Rotation duration scales with store size and can exceed supervisor timeouts; on a large store one rotation has run for more than an hour. A clean stop (SIGTERM) lets the rotation abort at a safe point; a hard kill partway through hasn't been shown to be safe. The packaged `systemd` unit already allows five minutes (`TimeoutStopSec=5min`); keep that in any custom unit. Docker's default stop grace period is 10 seconds, after which it sends SIGKILL: set `--stop-timeout 300` on the container, or `stop_grace_period: 5m` in Compose, and expect stops to be slow.
4. **Stop with the service manager**, then verify the process is gone before you do anything to the data directory:

    ```
    sudo systemctl stop xrpld.service
    ```

5. **Expect about 3 minutes** on a dedicated host with local NVMe, and 5 to 25 minutes on smaller or shared hosts, before the server proposes again. Setting `fast_load=1` in the `[node_db]` stanza loads the last persisted ledger from disk before the server syncs, which shortened one operator's return to service from six minutes to four; the example configuration's own caveat applies, it helps only if the disk has the IOPS to serve it.

If your validator is on a UNL, the [Negative UNL](../../../concepts/consensus-protocol/negative-unl.md) handles your absence automatically. There is nothing to configure and no way to put yourself on it ahead of planned maintenance. Once your validator's reliability over the last 256 ledgers falls below 50%, other validators can propose adding it at the next flag ledger (every 256 ledgers, about 15 minutes), and the change takes effect the flag ledger after that; in practice, expect to be on it within half an hour to an hour of going quiet. Your validator stays on the published list throughout; it is only removed from the effective UNL that quorum is calculated against. Once it is back and its reliability climbs above 80%, the network removes it the same way. Operators who have been through it report it works as designed. The network tolerates a planned absence; what it doesn't tolerate is a validator that is unreliable while claiming to be present.

Rebooting for a kernel update is the same procedure, and it is safe if you check the rotation first and stop cleanly. Don't skip kernel updates to avoid it.

### An empty range after a restart is normal

The server can't trust the ledgers on disk until it has synced with the network, so `complete_ledgers` reports `empty` after a restart even when the store is intact. On restart it finds peers, collects validations until it knows the current validated ledger, downloads that ledger (taking nodes from the local store where it can), switches to `full` or `proposing`, and then back-fills history from the local store as one of its lowest-priority tasks. Two backend directories under the NuDB path are also normal; one is the archive that online deletion keeps until the next rotation.

Don't delete the ledger store because the range is empty. A missing rotating backend makes the server stop at startup on purpose, so a server that is running and `connected` still has its store. Delete and resync only if the server crash-loops at startup or the log names a missing backend.

More than about 15 minutes in `connected` after a restart isn't normal. Keep the store and the logs, check for a crash loop, and check your peers before you change anything. In XRPLF/rippled [#8518](https://github.com/XRPLF/rippled/issues/8518) an operator deleted a store that was probably intact after reading the empty range as corruption, and the long `connected` phase coincided with `ledgerData` reads taking about 4 seconds each on a virtual server; that slow-sync case is still open with the maintainers.

## Update deliberately

- **Update `xrpld` manually, never unattended.** Operating system security patches can be automatic. The server binary shouldn't be. Even operators with fully automated infrastructure update `xrpld` by hand.
- **Know when releases happen.** Watch the [releases feed](https://github.com/XRPLF/rippled/releases) (it has an Atom feed you can route to chat), subscribe to the [ripple-server Google Group](https://groups.google.com/g/ripple-server), which still carries every release and emergency notice, and keep the version-drift alert above as the backstop.
- **Stage the rollout.** If you run more than one server, upgrade one, watch it sync and run for a while, then the next. Operators disagree about whether the validator goes first or last, and both orders work. Validator-last uses a redundant server as a canary so a bad release never costs validator uptime. Validator-first minimizes the time the validator runs an old version. The invariants are the same either way: one server at a time, watch it, keep a rollback path.
- **Keep a rollback path.** Stash the previous package, the working config, and the unit file before upgrading. Before rolling back, confirm the older version supports every amendment enabled on the network since; otherwise the rollback leaves the validator amendment blocked instead of restoring it. Binary rollbacks are rare but real; one long-running operator has needed one since 2021, after a bug surfaced a week or two after release. That is also the argument against being either the very first or the very last to upgrade.
- **Answer N to the configuration prompt.** On Debian-based systems, a package upgrade may ask whether to replace `xrpld.cfg` with the package version. Answering Y replaces your configuration, validator token included, with the default. The default answer is N. To make it impossible, pass the `dpkg` option through `apt` (`apt-get -o Dpkg::Options::="--force-confold" install xrpld`), or divert the packaged file with `dpkg-divert` so the package never touches your live config. If it has already happened, the previous file is at `xrpld.cfg.dpkg-old`.
- **After the rename from `rippled` to `xrpld`**, verify everything that referenced the old unit name: `systemd` drop-ins and resource limits, cron jobs, log rotation (a leftover `/etc/logrotate.d/rippled` beside the packaged `xrpld` file is the common case), and monitoring hooks. A limit bound to a unit that no longer exists enforces nothing. See [Migrate from rippled to xrpld](../../installation/migrate-to-xrpld.md).

## Vote on amendments

Voting is an active responsibility, not a default. Operators' philosophies range from following the reference implementation's defaults unless they have a specific objection, to testing every amendment themselves before voting. All are legitimate. What isn't legitimate isn't knowing what your validator is voting for.

- **Use the `feature` command, and verify with it.** Set votes with the [feature method][] over an admin connection; no restart is needed. Then read the vote back with the same command on the server itself rather than relying on an explorer's view, which lags and has shown mismatches. See [Configure Amendment Voting](../configure-amendment-voting.md).
- **Votes live in `wallet.db`.** That is why they survive upgrades, and why losing that file resets them to defaults. The legacy `[amendments]` and `[veto_amendments]` stanzas are imported only when the votes table doesn't exist yet; on an existing server they do nothing. Anything in `[rpc_startup]`, by contrast, runs at every start and replaces votes you set while running. Pick one place to manage votes.
- **Review your votes periodically.** Vetoes persist across upgrades for years. Several long-running validators still carry vetoes for amendments proposed a decade ago that nobody remembers setting.
- **Fees and reserves are a vote too, and the defaults aren't the network's values.** Without a `[voting]` stanza a validator votes for a 10 XRP account reserve and a 2 XRP owner reserve, the compiled-in defaults, while the network runs 1 XRP and 0.2 XRP. Set the stanza to the values you actually support, and check the current ones on [Reserves](../../../concepts/accounts/reserves.md):

    ```ini
    [voting]
    reference_fee = 10
    account_reserve = 1000000
    owner_reserve = 200000
    ```

    See [Fee Voting](../../../concepts/consensus-protocol/fee-voting.md).

## Choose retention for a validator

A validator needs only recent ledgers, but the smallest settings aren't free:

- Online deletion runs a rotation each time the retained window fills. Rotation copies every still-referenced object forward into the new store, so its cost is the same whether you keep 256 ledgers or 30,000; a smaller window just runs it far more often. (Mechanism described by the core developers in XRPLF/rippled [#6202](https://github.com/XRPLF/rippled/issues/6202).) One operator's measurements on a client-serving server: raising `online_delete` from 3,000 to 25,000 changed rotation from eight ten-minute storms a day to one 23-minute rotation a day.
- Dedicated validators tolerate small windows better than servers that serve clients, because nothing competes with the rotation. The package ships `online_delete=512` with `advisory_delete=0`, the minimum is 256, and production validators run everything from 256 to about 100,000. Day-scale values (about 25,000 to 32,000 ledgers) are the most common choice: rotations become rare, and the disk cost is modest. See [Disk](../../prerequisites/system-requirements/validator.md#disk) for the sizing rule.
- Leave `ledger_history` at its default of 256 on a validator, so a restart doesn't backfill a day of history it has no use for. It must never exceed `online_delete`.
- Leave `advisory_delete` at `0` on a validator, unless you schedule `can_delete` yourself and alert when it stops running. Advisory deletion is for servers that need to control exactly when rotation happens (one operator triggers it daily at a quiet hour so restarts can be planned around rotations, which stretches each generation to about 48 hours), and a rotation that never gets triggered grows the store until the disk is full.

For the settings, see [Configure Online Deletion](../data-retention/configure-online-deletion.md).

## Keep the configuration honest

The server rejects some invalid values at startup (an unrecognized `node_size` name, `online_delete` below `ledger_history`, both a seed and a token), but it accepts almost anything else you put in `xrpld.cfg` without complaint:

- Stanzas and keys it doesn't recognize are ignored. Configuration written by generators and AI assistants has shipped with keys that don't exist, so the caps the operator thought were set were not.
- If a `key = value` line appears twice in a stanza, the last one wins, silently. A single-value stanza that appears twice (two `[path_search_max]` sections, say) is ignored entirely, with only a warning in the log.
- Without `[node_seed]`, the node identity lives in `wallet.db`. It is created once and reused, so this is fine until you rebuild the host or lose that file: then the server gets a new identity, which `[cluster_nodes]` on its peers no longer recognizes, with no error. Pin `[node_seed]` on clustered servers.
- Lines in `[rpc_startup]` run at every start and override runtime changes.

Two habits:

1. **Read every stanza of any config you didn't write by hand**, and keep the file short. A working validator config is a few dozen live lines; the shipped example is many hundreds, most of them comments.
2. **Verify effective settings on the running server**, not in the file: `node_size` and `pubkey_validator` from the [server_info method][] (admin connection), the trusted list from the [validators method][], votes from the [feature method][], and peers from the [peers method][].

## Manage logs from day one

- Keep `log_level` at `warning` in `[rpc_startup]`. At `debug`, the log grows by several GB a day.
- Rotate the log daily and cap it. An unrotated log filling the disk is a common first outage. Packaged installs ship a `logrotate` configuration; make sure only one exists, that it uses `nocreate`, and that its `postrotate` step calls `xrpld logrotate` (see [logrotate method][]) so the server reopens the file. Without that step the server keeps writing to the rotated file.
- Log volume isn't severity. `warning` still produces a large number of benign lines. Alert on specific signatures, not on line counts.

## Duties of a trusted validator

If a UNL publisher adds your validator, you take on obligations that nobody hands you in writing:

- **Be reachable.** Publishers and the XRP Ledger Foundation coordinate through direct channels, and they need a reliable way to contact you. That doesn't mean being personally available around the clock. It means important issues get handled within a reasonable time. For planned upgrades and routine coordination, expect an action window of a week or two. Exceptional situations are different: an emergency release after a security disclosure may need most trusted validators to act within a day or two to keep the network stable. Know which kind of request you are looking at. Operators who couldn't be reached, or who were consistently late, have lost their seats in the past; publishers normally contact an operator and give them a chance to respond before removing them, though emergencies may not allow for that.
- **Your uptime is public.** Every restart shows up in explorer statistics. Aim for the highest uptime you can, and accept that some downtime, from maintenance, hardware failure, or connectivity loss, is unavoidable. Publishers judge uptime over time, not on one incident; what counts is how quickly you respond, restore service, and communicate. Plan maintenance, let the Negative UNL cover planned downtime, and never run a second copy of the validator to cover for it (see [No High Availability](../security/validator.md#no-high-availability)).
- **Availability is a network property.** A geographically distributed set of validators whose operators respond honestly during their own working hours already gives the network a super-majority available around the clock. Individual honesty about your response times is worth more than a claimed 24/7 that you can't keep. Larger operators do run 24/7 on-call with playbooks; a single person can reach very high availability with automation, redundancy in the rebuild path, and a clear policy.
- **Not being on a UNL isn't a lower standard.** Untrusted validators are the baseline that trusted ones are measured against. Operate one as if it were trusted.

## See also

- **Concepts:**
    - [Consensus](../../../concepts/consensus-protocol/index.md)
    - [Negative UNL](../../../concepts/consensus-protocol/negative-unl.md)
    - [Amendments](../../../concepts/networks-and-servers/amendments.md)
- **Tutorials:**
    - [Validator](../server-modes/validator.md)
    - [Validator Security](../security/validator.md)
    - [Validator System Requirements](../../prerequisites/system-requirements/validator.md)
    - [Configure Online Deletion](../data-retention/configure-online-deletion.md)
    - [Configure Amendment Voting](../configure-amendment-voting.md)
    - [Health Check Interventions](../../troubleshooting/health-check-interventions.md)
- **References:**
    - [server_info method][]
    - [get_counts method][]
    - [validators method][]
    - [feature method][]
    - [peers method][]
    - [logrotate method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

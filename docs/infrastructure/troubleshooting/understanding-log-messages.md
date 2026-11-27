---
seo:
    description: Interpret and respond to warning and error messages in the debug log.
labels:
    - Core Server
---
# Understanding Log Messages

The following sections describe some of the most common types of log messages that can appear in a [`xrpld` server's](../../concepts/networks-and-servers/index.md) debug log and how to interpret them.

This is an important step in [Diagnosing Problems](diagnosing-problems.md) with `xrpld`.

## Log Message Structure

The following shows the format of the log file:

```text
2026-Jul-08 20:10:17.372178946 UTC Peer:WRN [IP Address: 197.27.127.136:53046, Public Key: n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7, Id: 236] onReadMessage: stream truncated
2026-Jul-08 20:11:13.582438263 UTC PeerFinder:ERR Logic testing     52.196.126.86:13308 with error, Connection timed out
2026-Jul-08 20:11:57.728448343 UTC Peer:WRN [IP Address: 197.27.127.136:53366, Public Key: n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7, Id: 242] onReadMessage: stream truncated
2026-Jul-08 20:12:12.075081020 UTC LoadMonitor:WRN Job: sweep run: 1172ms wait: 0ms
```

Each line represents one log entry, with the following parts in order, separated by spaces:

1. The date the log entry was written, such as `2026-Jul-08`.
2. The time the log entry was written, such as `20:12:12.075081020`.
3. The time zone indicator `UTC`. (Log dates are always in UTC.)
4. The log partition and severity, such as `LoadMonitor:WRN`.
5. The log message, such as `Job: sweep run: 1172ms wait: 0ms`.

Log entries about a peer-to-peer connection (such as those from the `Peer` partition) also include a bracketed identifier between the partition/severity and the message. {% badge href="https://xrpl.org/blog/2026/xrpld-3.2.0" %}New in: xrpld 3.2.0{% /badge %}

It contains the following fields:

- `IP Address`: The peer's IP address and port, such as `197.27.127.136:53046`.
- `Public Key`: The base58-encoded [node public key](../../concepts/networks-and-servers/peer-protocol.md#node-key-pair) the peer uses to sign peer protocol messages, such as `n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7`. This field is omitted if the peer's public key isn't yet known, such as before the connection's handshake completes.
- `Id`: The numeric ID the server assigns to the peer connection, such as `236`.

For simplicity, the examples in this page omit the date, time, and time zone indicator.

## Crashes

Messages in the log that mention runtime errors can indicate that the server crashed. These messages usually start with a message such as one of the following examples:

```
Throw<std::runtime_error>
```

To find it: `grep -F "runtime_error" /var/log/xrpld/debug.log`

On current versions the main thread is named `xrpld-main`; a crash message naming `rippled: main` comes from an older server.

If your server always crashes on startup, see [Server Won't Start](server-wont-start.md) for possible cases.

If your server crashes randomly during operation or as a result of particular commands, make sure you are [updated](../installation/index.md) to the latest `xrpld` version. If you are on the latest version and your server is still crashing, check the following:

- Is your server running out of memory? On some systems, `xrpld` may be terminated by the Out Of Memory (OOM) Killer or another monitor process.
- If your server is running in a shared environment, are other users or administrators causing the machine or service to be restarted? For example, some hosted providers automatically kill any service that uses a large amount of a shared machine's resources for an extended period of time.
- Does your server meet the [minimum requirements](../prerequisites/system-requirements/index.md) to run `xrpld`? What about the [recommendations for production servers](../prerequisites/system-requirements/stock-node.md#recommended-specifications)?

If none of the above apply, please report the issue to Ripple as a security-sensitive bug. If Ripple can reproduce the crash, you may be eligible for a bounty. See <https://ripple.com/bug-bounty/> for details.

## Already validated sequence at or past

The following log message indicates that a server received validations for different ledger indexes out of order. Current versions (3.4.1) no longer write this message; you see it only in logs from older servers.

```text
Validations:WRN Val for 2137ACEFC0D137EFA1D84C2524A39032802E4B74F93C130A289CD87C9C565011 trusted/full from nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ signing key n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5 already validated sequence at or past 12133663 src=1
```

To find it: `grep -F "already validated sequence at or past" /var/log/xrpld/debug.log`

Occasional messages of this type don't usually indicate a problem. If this type of message occurs often with the same sending validator, it could indicate a problem, including any of the following (roughly in order of most to least likely):

- The server writing the message is having network issues.
- The validator described in the message is having network issues.
- The validator described in the message is behaving maliciously.

## async_send failed

The following log message indicates that [StatsD export](../configuration/configure-statsd.md) failed:

```text
Collector:ERR async_send failed: Connection refused
```

To find it: `grep -F "async_send failed" /var/log/xrpld/debug.log`

This could mean:

- Your StatsD configuration has the wrong IP address or port.
- The StatsD server you were attempting to export to was down or not accessible from your `xrpld` server.

Check the `[insight]` stanza in your `xrpld`'s config file and confirm that you have network connectivity from your `xrpld` server to your StatsD server.

This error has no other impact on the `xrpld` server, which should continue to work as normal except for the sending of StatsD metrics.

## Check for upgrade

The following log message indicates that the server has detected that it is running an older software version than at least 60% of the trusted validators that report an `xrpld` version. The check runs at flag ledgers and reports only once the server has seen validations from at least 90% of its UNL, so it doesn't fire during the first minutes after a start. It is logged at error level, also printed to standard error, and repeats weekly until you restart:

```text
LedgerMaster:ERR Check for upgrade: A majority of trusted validators are running a newer version.
```

To find it: `grep -F "Check for upgrade" /var/log/xrpld/debug.log`

This isn't strictly a problem, but an old server version is likely to become [amendment blocked](../../concepts/networks-and-servers/amendments.md#amendment-blocked-servers). You should [update `xrpld`](../installation/index.md) to the latest stable version. (If you are connected to [devnet](../../concepts/networks-and-servers/parallel-networks.md), update to the latest nightly version instead.)

## Connection reset by peer

The following log message indicates that a peer `xrpld` server closed a connection:

```text
Peer:WRN [IP Address: 197.27.127.136:53046, Public Key: n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7, Id: 12] onReadMessage: Connection reset by peer
```

To find it: `grep -F "Connection reset by peer" /var/log/xrpld/debug.log`

Losing connections from time to time is normal for any peer-to-peer network. **Occasional messages of this kind don't indicate a problem.**

A large number of these messages around the same time may indicate a problem, such as:

- Your internet connection to one or more specific peers was cut off.
- Your server may have been overloading the peer with requests, causing the peer to disconnect your server.

## Consumer entry dropped with balance at or above drop threshold

The following log message indicates that a client to the server's public API has been dropped as a result of [rate limiting](../../references/http-websocket-apis/api-conventions/rate-limiting.md):

```text
Resource:WRN Consumer entry 169.55.164.21 dropped with balance 25970 at or above drop threshold 25000
```

To find it: `grep -F "dropped with balance" /var/log/xrpld/debug.log`

The entry contains the IP address of the client that exceeded its rate limit, and the client's "balance", which is a score estimating the rate at which the client has been using the API. The threshold for dropping a client is [hardcoded to a score of 25000](https://github.com/XRPLF/rippled/blob/3.4.1/include/xrpl/resource/detail/Tuning.h#L15). {% badge href="https://xrpl.org/blog/2025/rippled-2.3.1" %}Updated in: rippled 2.3.1{% /badge %}

If you see frequent messages from the same IP address, you may want to block those IP addresses from your network to reduce the load on your server's public API. (For example, you may be able to configure your firewall to block those IP addresses.)

To avoid being dropped by rate limiting on your own server, [connect as an admin](../../tutorials/get-started/get-started-http-websocket-apis.md#admin-access).

## Server stalled

The following log messages indicate that the server's main processing loop has stopped making progress. The line appears every 10 seconds while the stall lasts, at warning level and then at fatal level from 90 seconds, each followed by a `JobQueue:` dump; at 600 seconds the server logs `LogicError: Fatal server stall detected. Stalled time: 600s` and aborts itself:

```text
LoadManager:WRN Server stalled for 30 seconds.
LoadManager:FTL Server stalled for 90 seconds.
```

To find it: `grep -F "Server stalled for" /var/log/xrpld/debug.log`

This occurs when: 
- The computer is in sleep mode
- The job queue contains numerous small jobs

If neither of these scenarios applies, get a stack trace. On a Linux server, open the core file in `gdb`, then run `thread apply all bt full`.

## InboundLedger 7 timeouts for ledger

The following log message indicates that your server is having trouble requesting specific ledger data from its peers. Current versions give up on a ledger after six timeouts, so the count shown is 7:

```text
InboundLedger:WRN 7 timeouts for ledger 8265938
```

To find it: `grep -F "timeouts for ledger" /var/log/xrpld/debug.log`

This isn't strictly a problem, but if you want to acquire ledger history faster, you can configure `xrpld` to connect to peers with full history by adding or editing the `[ips_fixed]` config stanza and restarting the server. For example, to always try to connect to one of Ripple's full-history servers:

```
[ips_fixed]
s2.ripple.com 51235
```

## InboundLedger Want hash

The following log message indicates that the server is requesting ledger data from other servers. It is written at the `debug` level, so it appears only if you have raised the log level for the `InboundLedger` partition:

```text
InboundLedger:DBG Want: 5AE53B5E39E6388DBACD0959E5F5A0FCAF0E0DCBA45D9AB15120E8CDD21E019B
```

To find it: `grep -F "InboundLedger:DBG Want:" /var/log/xrpld/debug.log`

This is normal if your server is syncing or backfilling.

## LoadMonitor Job

The following log message indicates that a function takes a long time to run (over 11 seconds in this example):

```text
2018-Aug-28 22:56:36.180827973 LoadMonitor:WRN Job: gotFetchPack run: 11566ms wait: 0ms
```

To find it: `grep -F "LoadMonitor:WRN Job:" /var/log/xrpld/debug.log`

The following similar message occurs when a job spends a long time waiting to run (again, over 11 seconds in this example):

```text
LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
```

These two types of messages often occur together, when a long-running job causes other jobs to wait a long time for it to finish.

It is **normal** to display several messages of these types **during the first few minutes** after starting the server.

If the messages continue for more than 5 minutes after starting the server, especially if the `run` times are well over 1000 ms, that may indicate that **your server doesn't have enough disk I/O, RAM, or CPU**. This may be caused by not having powerful enough hardware or because other processes running on the same hardware are competing with `xrpld` for resources. (Examples of other processes that may compete with `xrpld` for resources include scheduled backups, virus scanners, and periodic database cleaners.)

Another possible cause is trying to use NuDB on rotational hard disks; NuDB should only be used with solid state drives (SSDs). It's **not recommended** to use `xrpld` with rotational disks, but you _may_ be able to do so using RocksDB. If you are using rotational disks, make sure both `[node_db]` is configured to use RocksDB. For example:

```
[node_db]
type=RocksDB
# ... more config omitted
```

## Need consensus ledger

After a restart, the server logs messages like the following while it re-anchors to the network:

```text
LedgerConsensus:WRN Need consensus ledger 98DB8B5D2B4D44E2BF0B9F822B41D96BC8F17C77F0B7B8EBE6F67BDBAD5BE22A
```

To find it: `grep -F "Need consensus ledger" /var/log/xrpld/debug.log`

This message is normal after any restart, even with an intact ledger store: the server reports an empty ledger range until it syncs to the current validated ledger, then back-fills its history from the local store as a low-priority task. Production measurements put the return to a synced state at about three minutes on a dedicated host and five to twenty-five minutes on smaller or shared ones; see [Restart with care](../configuration/best-practices/validator.md#restart-with-care) for the figures. Don't delete database files because the ledger range looks empty during this window; see [Restart with care](../configuration/best-practices/validator.md#restart-with-care).

## No peer protocol configured

```text
HTTPClient:WRN Warning: No peer protocol configured
```

To find it: `grep -F "No peer protocol configured" /var/log/xrpld/debug.log`

None of the ports listed in the `[server]` stanza has `protocol = peer`, so the server accepts no inbound peer connections. If that is deliberate - the [outbound-only validator topology](../configuration/security/validator.md#topology-and-exposure) runs this way - the warning is expected and benign. It appears on every commandline call and once at server start, in the debug log as `Application:ERR`. If it isn't deliberate, add a peer port. Without one, every peer slot is an outbound connection.

## Waiting for node to stabilize

The following log message indicates that [online deletion is waiting](../configuration/data-retention/online-deletion.md#interrupting-online-deletion) because the server isn't fully synced. (Older versions wrote `Not deleting` here instead.)

```text
SHAMapStore:WRN Waiting 2000ms for node to stabilize. state: syncing. age 25s. Missing ledgers: 0. Expect: 54635255-54635511. Complete ledgers: 54635300-54635511
```

To find it: `grep -F "for node to stabilize" /var/log/xrpld/debug.log`

The `state` indicates the [server state](../../references/http-websocket-apis/api-conventions/xrpld-server-states.md). The `age` indicates how many seconds since the last validated ledger was closed. (A healthy age for the last validated ledger is 7 seconds or less.) The rotation waits and retries rather than giving up; if it can't make progress for `max_waiting_ledgers` ledgers (by default the `online_delete` value), it logs `online_delete rotation has been unable to make progress for N ledgers.` at the error level.

During startup, these messages are normal and can be safely ignored. At other times, messages like this usually indicate that the server doesn't meet the [system requirements](../prerequisites/system-requirements/index.md), especially disk I/O, to run online deletion at the same time as everything else the server is doing.


## Out of transaction DB space

```text
Application:WRN Server stopping: Out of transaction DB space
```

To find it: `grep -E "Out of transaction DB space|less than 512MB" /var/log/xrpld/debug.log`

The server **stops deliberately and exits cleanly** - which means a `systemd` unit with `Restart=on-failure` doesn't restart it, and the stop can look like a silent disappearance rather than a crash. One of two fatal lines comes just before it:

```text
SQLiteDatabase:FTL Remaining free disk space is less than 512MB
SQLiteDatabase:FTL Free SQLite space for transaction db is less than 512MB. To fix this, xrpld must be executed with the vacuum parameter before restarting. Note that this activity can take multiple days, depending on database size.
```

The first means the volume holding `[database_path]` has under 512 MB free: grow the volume or reduce retention. The second means `transaction.db` is within 512 MB of its SQLite page-count ceiling, and more disk doesn't help; you need the rebuild in [Fix SQLite Transaction Database Page Size](fix-sqlite-tx-db-page-size-issue.md). The prevention is alerting on free disk space and on the ceiling before the server does this for you, and remembering that `transaction.db` never shrinks - [online deletion](../configuration/data-retention/online-deletion.md) frees pages inside the file for reuse but doesn't return them to the filesystem.

## Potential Censorship

The following log message indicates that the XRP Ledger detects potential transaction censorship. For more information about these log messages and the transaction censorship detector, see [Transaction Censorship Detection](../../concepts/networks-and-servers/transaction-censorship-detection.md).

```text
CensorshipDetector:WRN Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851545.
```

To find it: `grep -F "Potential Censorship" /var/log/xrpld/debug.log`

Current versions write only this warning form, repeated at intervals while the transaction stays excluded; the separate error form with "Additional warnings suppressed" came from older versions.

## rotating validatedSeq

The following log message indicates that [online deletion](../configuration/data-retention/online-deletion.md) has started running:

```text
SHAMapStore:WRN rotating  validatedSeq 54635511 lastRotated 54635255 deleteInterval 256 canDelete_ 4294967295 state full age 4s. Complete ledgers: 54635000-54635511
```

To find it: `grep -E "rotating +validatedSeq|finished rotation" /var/log/xrpld/debug.log`

(There are two spaces after "rotating", so search with `grep -E "rotating +validatedSeq"`.)

This log message is normal and indicates that online deletion is operating as expected.

The log message contains values describing the current online deletion run. Each keyword corresponds to the value immediately following it:

| Keyword          | Value            | Description                            |
|:-----------------|:-----------------|:---------------------------------------|
| `validatedSeq`   | [Ledger Index][] | The current validated ledger version.  |
| `lastRotated`    | [Ledger Index][] | The end of the ledger range in the ["old" (read-only) database](../configuration/data-retention/online-deletion.md#how-it-works). Online deletion deletes the ledger versions before this one. |
| `deleteInterval` | Number           | How many ledger versions to keep after online deletion. The [`online_delete` setting](../configuration/data-retention/online-deletion.md#configuration) controls this value. |
| `canDelete_`     | [Ledger Index][] | The newest ledger version that the server is allowed to delete, if using [advisory deletion](../configuration/data-retention/online-deletion.md#advisory-deletion). If not using advisory deletion, this value is ignored. |

When online deletion finishes, it writes the following log message:

```text
SHAMapStore:WRN finished rotation. validatedSeq: 54635511, lastRotated: 54635511. Complete ledgers: 54635300-54635511
```

The `validatedSeq` in the "finished" message matches the "rotating" message, and the two numbers in it are equal. It becomes the `lastRotated` value the next time online deletion runs.

If the server falls out of sync while running online deletion, it waits and retries, writing a ["Waiting for node to stabilize" log message](#waiting-for-node-to-stabilize) until it can finish.

Avoid stopping the server between a "rotating" message and its "finished rotation" message when you can wait: a restart that landed mid-rotation preceded a prolonged failure to sync in one reported case (XRPLF/rippled [#8518](https://github.com/XRPLF/rippled/issues/8518), still open). See [Restart with care](../configuration/best-practices/validator.md#restart-with-care).


## Unable to determine hash of ancestor

The following log message indicates that the server sees a validation message from a peer and it doesn't know the parent ledger version that server is building on. This can occur when the server isn't in sync with the rest of the network:

```text
Validations:WRN Unable to determine hash of ancestor seq=3 from ledger hash=00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E seq=12133675 (available: 12133650-12133675)
```

To find it: `grep -F "Unable to determine hash of ancestor" /var/log/xrpld/debug.log`

{% partial file="/docs/_snippets/unsynced_warning_logs.md" /%}

## [veto_amendments] section in config file ignored
<!-- SPELLING_IGNORE: veto_amendments -->

The following log message indicates that your `xrpld.cfg` file contains a legacy `[veto_amendments]` stanza. The first time the server starts on version 1.7.0 or higher, it reads the stanza to set amendment votes; on later restarts, it ignores the `[amendments]` and `[veto_amendments]` stanzas and prints this message instead.

```text
Amendments:WRN [veto_amendments] section in config file ignored in favor of data in db/wallet.db.
```

To find it: `grep -F "section in config file ignored" /var/log/xrpld/debug.log`

To resolve this error, remove the `[amendments]` and `[veto_amendments]` stanzas from your config file. For more information, see [Amendment Voting](../../concepts/networks-and-servers/amendments.md#amendment-voting).


## View of consensus changed during open

The following log message indicates that a server isn't in sync with the rest of the network:

```text
LedgerConsensus:WRN View of consensus changed during open mode=proposing, 96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661 to 00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E, {...}.
```

To find it: `grep -F "View of consensus changed" /var/log/xrpld/debug.log`. The `{...}` is the JSON of the ledger the server was on, which can run to hundreds of characters.

{% partial file="/docs/_snippets/unsynced_warning_logs.md" /%}

## We are not running on the consensus ledger

The following log message indicates that a server isn't in sync with the rest of the network:

```text
NetworkOPs:WRN We are not running on the consensus ledger
```

To find it: `grep -F "not running on the consensus ledger" /var/log/xrpld/debug.log`

{% partial file="/docs/_snippets/unsynced_warning_logs.md" /%}

## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Technical FAQ](/about/faq.md)
- **Tutorials:**
    - [Diagnosing Problems](diagnosing-problems.md)
    - [Capacity Planning](../prerequisites/capacity-planning.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

<!-- SPELLING_IGNORE: oom, async_send, statsd, inboundledger, loadmonitor, validatedseq -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}

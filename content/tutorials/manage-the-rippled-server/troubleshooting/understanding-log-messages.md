---
html: understanding-log-messages.html
parent: troubleshoot-the-rippled-server.html
blurb: Interpret and respond to warning and error messages in the debug log.
---
# Understanding Log Messages

The following sections describe some of the most common types of log messages that can appear in a [`rippled` server's](the-rippled-server.html) debug log and how to interpret them.

This is an important step in [Diagnosing Problems](diagnosing-problems.html) with `rippled`.

## Log Message Structure

The following shows the format of the log file:

```text
2020-Jul-08 20:10:17.372178946 UTC Peer:WRN [236] onReadMessage from n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7 at 197.27.127.136:53046: stream truncated
2020-Jul-08 20:11:13.582438263 UTC PeerFinder:ERR Logic testing     52.196.126.86:13308 with error, Connection timed out
2020-Jul-08 20:11:57.728448343 UTC Peer:WRN [242] onReadMessage from n9J2CP7hZypxDJ27ZSxoy4VjbaSgsCNaRRJtJkNJM5KMdGaLdRy7 at 197.27.127.136:53366: stream truncated
2020-Jul-08 20:12:12.075081020 UTC LoadMonitor:WRN Job: sweep run: 1172ms wait: 0ms
```

Each line represents one log entry, with the following parts in order, separated by spaces:

1. The date the log entry was written, such as `2020-Jul-08`.
2. The time the log entry was written, such as `20:12:12.075081020`.
3. The time zone indicator `UTC`. (Log dates are always in UTC.) [New in: rippled 1.5.0][]
4. The log partition and severity, such as `LoadMonitor:WRN`.
5. The log message, such as `Job: sweep run: 1172ms wait: 0ms`.

For simplicity, the examples in this page omit the date, time, and time zone indicator.


## Crashes

Messages in the log that mention runtime errors can indicate that the server crashed. These messages usually start with a message such as one of the following examples:

```
Throw<std::runtime_error>
```

```
Terminating thread rippled: main: unhandled St13runtime_error
```

If your server always crashes on startup, see [Server Won't Start](server-wont-start.html) for possible cases.

If your server crashes randomly during operation or as a result of particular commands, make sure you are [updated](install-rippled.html) to the latest `rippled` version. If you are on the latest version and your server is still crashing, check the following:

- Is your server running out of memory? On some systems, `rippled` may be terminated by the Out Of Memory (OOM) Killer or another monitor process.
- If your server is running in a shared environment, are other users or administrators causing the machine or service to be restarted? For example, some hosted providers automatically kill any service that uses a large amount of a shared machine's resources for an extended period of time.
- Does your server meet the [minimum requirements](system-requirements.html) to run `rippled`? What about the [recommendations for production servers](system-requirements.html#recommended-specifications)?

If none of the above apply, please report the issue to Ripple as a security-sensitive bug. If Ripple can reproduce the crash, you may be eligible for a bounty. See <https://ripple.com/bug-bounty/> for details.


## Already validated sequence at or past

Log messages such as the following indicate that a server received validations for different ledger indexes out of order.

```text
Validations:WRN Val for 2137ACEFC0D137EFA1D84C2524A39032802E4B74F93C130A289CD87C9C565011 trusted/full from nHUeUNSn3zce2xQZWNghQvd9WRH6FWEnCBKYVJu2vAizMxnXegfJ signing key n9KcRZYHLU9rhGVwB9e4wEMYsxXvUfgFxtmX25pc1QPNgweqzQf5 already validated sequence at or past 12133663 src=1
```

Occasional messages of this type do not usually indicate a problem. If this type of message occurs often with the same sending validator, it could indicate a problem, including any of the following (roughly in order of most to least likely):

- The server writing the message is having network issues.
- The validator described in the message is having network issues.
- The validator described in the message is behaving maliciously.


## async_send failed

The following log message indicates that [StatsD export](configure-statsd.html) failed:

```text
Collector:ERR async_send failed: Connection refused
```

This could mean:

- Your StatsD configuration has the wrong IP address or port.
- The StatsD server you were attempting to export to was down or not accessible from your `rippled` server.

Check the `[insight]` stanza in your `rippled`'s config file and confirm that you have network connectivity from your `rippled` server to your StatsD server.

This error has no other impact on the `rippled` server, which should continue to work as normal except for the sending of StatsD metrics.


## Check for upgrade

The following message indicates that the server has detected that it is running an older software version than at least 60% of its trusted validators:

```text
LedgerMaster:ERR Check for upgrade: A majority of trusted validators are running a newer version.
```

This is not strictly a problem, but an old server version is likely to become [amendment blocked](amendments.html#amendment-blocked). You should [update `rippled`](install-rippled.html) to the latest stable version. (If you are connected to [devnet](parallel-networks.html), update to the latest nightly version instead.)


## Connection reset by peer

The following log message indicates that a peer `rippled` server closed a connection:

```text
Peer:WRN [012] onReadMessage: Connection reset by peer
```

Losing connections from time to time is normal for any peer-to-peer network. **Occasional messages of this kind do not indicate a problem.**

A large number of these messages around the same time may indicate a problem, such as:

- Your internet connection to one or more specific peers was cut off.
- Your server may have been overloading the peer with requests, causing the peer to disconnect your server.


## Consumer entry dropped with balance at or above drop threshold

The following log message indicates that a client to the server's public API has been dropped as a result of [rate limiting](rate-limiting.html):

```text
Resource:WRN Consumer entry 169.55.164.21 dropped with balance 15970 at or above drop threshold 15000
```

The entry contains the IP address of the client that exceeded its rate limit, and the client's "balance", which is a score estimating the rate at which the client has been using the API. The threshold for dropping a client is [hardcoded to a score of 15000](https://github.com/ripple/rippled/blob/06c371544acc3b488b9d9c057cee4e51f6bef7a2/src/ripple/resource/impl/Tuning.h#L34-L35).

If you see frequent messages from the same IP address, you may want to block those IP addresses from your network to reduce the load on your server's public API. (For example, you may be able to configure your firewall to block those IP addresses.)

To avoid being dropped by rate limiting on your own server, [connect as an admin](get-started-using-http-websocket-apis.html#admin-access).

## InboundLedger 11 timeouts for ledger

```text
InboundLedger:WRN 11 timeouts for ledger 8265938
```

This indicates that your server is having trouble requesting specific ledger data from its peers. If the [ledger index](basic-data-types.html#ledger-index) is much lower than the most recent validated ledger's index as reported by the [server_info method][], this probably indicates that your server is downloading a [history shard](history-sharding.html).

This is not strictly a problem, but if you want to acquire ledger history faster, you can configure `rippled` to connect to peers with full history by adding or editing the `[ips_fixed]` config stanza and restarting the server. For example, to always try to connect to one of Ripple's full-history servers:

```
[ips_fixed]
s2.ripple.com 51235
```


## InboundLedger Want hash

Log messages such as the following indicate that the server is requesting ledger data from other servers:

```text
InboundLedger:WRN Want: 5AE53B5E39E6388DBACD0959E5F5A0FCAF0E0DCBA45D9AB15120E8CDD21E019B
```

This is normal if your server is syncing, backfilling, or downloading [history shards](history-sharding.html).


## LoadMonitor Job

Messages such as the following occur when a function takes a long time to run (over 11 seconds in this example):

```text
2018-Aug-28 22:56:36.180827973 LoadMonitor:WRN Job: gotFetchPack run: 11566ms wait: 0ms
```

The following similar message occurs when a job spends a long time waiting to run (again, over 11 seconds in this example):

```text
LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
LoadMonitor:WRN Job: processLedgerData run: 0ms wait: 11566ms
LoadMonitor:WRN Job: AcquisitionDone run: 0ms wait: 11566ms
```

These two types of messages often occur together, when a long-running job causes other jobs to wait a long time for it to finish.

It is **normal** to display several messages of these types **during the first few minutes** after starting the server.

If the messages continue for more than 5 minutes after starting the server, especially if the `run` times are well over 1000 ms, that may indicate that **your server does not have sufficient resources, such as disk I/O, RAM, or CPU**. This may be caused by not having sufficiently-powerful hardware or because other processes running on the same hardware are competing with `rippled` for resources. (Examples of other processes that may compete with `rippled` for resources include scheduled backups, virus scanners, and periodic database cleaners.)

Another possible cause is trying to use NuDB on rotational hard disks; NuDB should only be used with solid state drives (SSDs). Ripple recommends always using SSD storage for `rippled`'s databases, but you _may_ be able to run `rippled` successfully on rotational disks using RocksDB. If you are using rotational disks, make sure both the `[node_db]` and the `[shard_db]` (if you have one) are configured to use RocksDB. For example:

```
[node_db]
type=RocksDB
# ... more config omitted

[shard_db]
type=RocksDB
```


## No hash for fetch pack

Messages such as the following are caused by a bug in `rippled` v1.1.0 and earlier when downloading historical ledgers for [history sharding](history-sharding.html):

```text
2018-Aug-28 22:56:21.397076850 LedgerMaster:ERR No hash for fetch pack. Missing Index 7159808
```

These can be safely ignored.


## Not deleting

Messages such as the following occur when [online deletion is interrupted](online-deletion.html#interrupting-online-deletion):

```text
SHAMapStore:WRN Not deleting. state: syncing. age 25s
```

The `state` indicates the [server state](rippled-server-states.html). The `age` indicates how many seconds since the last validated ledger was closed. (A healthy age for the last validated ledger is 7 seconds or less.)

During startup, these messages are normal and can be safely ignored. At other times, messages like this usually indicate that the server does not meet the [system requirements](system-requirements.html), especially disk I/O, to run online deletion at the same time as everything else the server is doing.


## Potential Censorship

Log messages such as the following are issued when the XRP Ledger detects potential transaction censorship. For more information about these log messages and the transaction censorship detector, see [Transaction Censorship Detection](transaction-censorship-detection.html).

**Warning Message**

```text
LedgerConsensus:WRN Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851545.
```

**Error Message**

```text
LedgerConsensus:ERR Potential Censorship: Eligible tx E08D6E9754025BA2534A78707605E0601F03ACE063687A0CA1BDDACFCD1698C7, which we are tracking since ledger 18851530 has not been included as of ledger 18851605. Additional warnings suppressed.
```


## rotating validatedSeq

This message indicates that [online deletion](online-deletion.html) has started running:

```text
SHAMapStore:WRN rotating  validatedSeq 54635511 lastRotated 54635255 deleteInterval 256 canDelete_ 4294967295
```

This log message is normal and indicates that online deletion is operating as expected.

The log message contains values describing the current online deletion run. Each keyword corresponds to the value immediately following it:

| Keyword          | Value            | Description                            |
|:-----------------|:-----------------|:---------------------------------------|
| `validatedSeq`   | [Ledger Index][] | The current validated ledger version.  |
| `lastRotated`    | [Ledger Index][] | The end of the ledger range in the ["old" (read-only) database](online-deletion.html#how-it-works). Online deletion deletes this ledger version and earlier. |
| `deleteInterval` | Number           | How many ledger versions to keep after online deletion. The [`online_delete` setting](online-deletion.html#configuration) controls this value. |
| `canDelete_`     | [Ledger Index][] | The newest ledger version that the server is allowed to delete, if using [advisory deletion](online-deletion.html#advisory-deletion). If not using advisory deletion, this value is ignored. |

When online deletion finishes, it writes the following log message:

```text
SHAMapStore:WRN finished rotation 54635511
```

The number at the end of the message is the [ledger index][] of the validated ledger at the time online deletion started, matching the `validatedSeq` value of the "rotating" message. This becomes the `lastRotated` value the next time online deletion runs.

If the server falls out of sync while running online deletion, it interrupts online deletion and writes a ["Not deleting" log message](#not-deleting) instead of a "finished rotation" message.


## Shard: No such file or directory

A bug in `rippled` 1.3.1 can cause it to write log messages such as the following when you have [history sharding](history-sharding.html) enabled:

```text
ShardStore:ERR shard 1804: No such file or directory
ShardStore:ERR shard 354: No such file or directory
ShardStore:ERR shard 408: No such file or directory
ShardStore:ERR shard 2927: No such file or directory
ShardStore:ERR shard 2731: No such file or directory
ShardStore:ERR shard 2236: No such file or directory
```

This indicates that the server tried to start acquiring a new history shard, but it failed to create a new directory to hold the shard. This bug prevents rippled 1.3.1 from acquiring new shards. [A fix is forthcoming.](https://github.com/ripple/rippled/pull/3014)

Aside from the bug, this error can also occur if `rippled` became unable to write to the underlying file system **after startup**. Possible causes include:

- Hardware failure of storage media
- The file system became unmounted
- The shard folder was deleted

**Tip:** It is generally safe to delete `rippled`'s database files when the service is stopped, but you should never delete them while the server is running.


## Unable to determine hash of ancestor

Log messages such as the following occur when the server sees a validation message from a peer and it does not know the parent ledger version that server is building on. This can occur when the server is not in sync with the rest of the network:

```text
Validations:WRN Unable to determine hash of ancestor seq=3 from ledger hash=00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E seq=12133675
```

{% include '_snippets/unsynced_warning_logs.md' %}
<!--_ -->


## [veto_amendments] section in config file ignored

Log messages such as the following occur when  your `rippled.cfg` file contains a legacy `[veto_amendments]` stanza. The first time the server starts on version 1.7.0 or higher, it reads the stanza to set amendment votes; on later restarts, it ignores the `[amendments]` and `[veto_amendments]` stanzas and prints this message instead.

```text
Amendments:WRN [veto_amendments] section in config file ignored in favor of data in db/wallet.db.
```

To resolve this error, remove the `[amendments]` and `[veto_amendments]` stanzas from your config file. For more information, see [Amendment Voting](amendments.html#amendment-voting).


## View of consensus changed during open

Log messages such as the following occur when a server is not in sync with the rest of the network:

```text
LedgerConsensus:WRN View of consensus changed during open status=open,  mode=proposing
LedgerConsensus:WRN 96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661 to 00B1E512EF558F2FD9A0A6C263B3D922297F26A55AEB56A009341A22895B516E
LedgerConsensus:WRN {"accepted":true,"account_hash":"89A821400087101F1BF2D2B912C6A9F2788CC715590E8FA5710F2D10BF5E3C03","close_flags":0,"close_time":588812130,"close_time_human":"2018-Aug-28 22:55:30.000000000","close_time_resolution":30,"closed":true,"hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_hash":"96A8DF9ECF5E9D087BAE9DDDE38C197D3C1C6FB842C7BB770F8929E56CC71661","ledger_index":"3","parent_close_time":588812070,"parent_hash":"5F5CB224644F080BC8E1CC10E126D62E9D7F9BE1C64AD0565881E99E3F64688A","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
```

{% include '_snippets/unsynced_warning_logs.md' %}
<!--_ -->


## We are not running on the consensus ledger

```text
NetworkOPs:WRN We are not running on the consensus ledger
```

{% include '_snippets/unsynced_warning_logs.md' %}
<!--_ -->


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Technical FAQ](technical-faq.html)
- **Tutorials:**
    - [Diagnosing Problems](diagnosing-problems.html)
    - [Capacity Planning](capacity-planning.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]

<!-- SPELLING_IGNORE: oom, async_send, statsd, inboundledger, loadmonitor, validatedseq -->

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

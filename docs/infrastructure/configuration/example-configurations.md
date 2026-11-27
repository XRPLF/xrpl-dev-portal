---
seo:
    description: Sanitized configuration files from production XRP Ledger servers, one per role, with the reason behind every setting that departs from the defaults.
labels:
  - Core Server
---
# Example Configurations

These are configuration files from servers that run in production today, contributed by the operators who informed these guides. Identifying values are removed or replaced, and the files are lightly edited for readability, but every setting that matters is the operator's own. They are the companion to [Minimal Configurations](minimal-configurations.md): that page gives you the smallest file that does the job, this page shows what the file looks like after years of operation, and why.

Read these for the reasoning, not to copy them. Several settings are specific to the host or the fleet they came from, and each one says so. Where an operator's file carried a line that the current server no longer reads, it is noted rather than silently kept.

{% admonition type="info" name="Which version" %}
Settings and defaults were checked against `xrpld` (formerly `rippled`) 3.4.1. The packaged example configuration is the reference for anything not covered here.
{% /admonition %}

## Stock server behind an application

A server that answers an application's queries and accepts its transactions, with about two weeks of history. It runs on a cloud virtual machine with local NVMe storage.

{% admonition type="warning" name="Not safe to copy as is" %}
This file predates the front end that now sits in front of it. Its two public listeners bind every interface with no `limit`, `send_queue_limit`, or `secure_gateway`, so pasted onto an internet-facing host it would serve anyone, unthrottled. Add the public-port settings from [Stock Node Best Practices](best-practices/stock-node.md) or keep the listeners on a private interface before you use it.
{% /admonition %}


```
[server]
port_rpc_admin_local
port_peer
port_ws_admin_local
port_rpc_public
port_ws_public
port_grpc

[port_rpc_admin_local]
port = 5005
ip = 127.0.0.1
admin = 127.0.0.1
protocol = http

[port_ws_admin_local]
port = 6006
ip = 127.0.0.1
admin = 127.0.0.1
protocol = ws
send_queue_limit = 500

[port_peer]
port = 2459
ip = 0.0.0.0
protocol = peer

[port_rpc_public]
port = 51234
ip = 0.0.0.0
protocol = http

[port_ws_public]
port = 51233
ip = 0.0.0.0
protocol = ws

[port_grpc]
port = 50051
ip = 127.0.0.1
secure_gateway = 127.0.0.1

[node_size]
large

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=380000
advisory_delete=0

[fetch_depth]
380000

[ledger_history]
360000

[peers_max]
50

[database_path]
/var/lib/xrpld/db

[debug_logfile]
/var/log/xrpld/debug.log

[rpc_startup]
{ "command": "log_level", "severity": "warning" }

[validators_file]
validators.txt

[ssl_verify]
1
```

What the operator chose, and why:

- **`online_delete=380000` with `ledger_history` just below it.** At 3.5 to 4 seconds per ledger that is 15 to 18 days of history, enough for an application that reconciles against recent ledgers and never asks for older ones. `ledger_history` must not exceed `online_delete`, or the server refuses to start. `[fetch_depth]` matches, so peers can pull any ledger the server holds.
- **`node_size` is `large`, not `huge`.** The host has the memory for `huge`, but the operator sized the cache to the workload rather than to the machine. On a server that isn't a validator, the difference shows up as RAM, not as correctness.
- **Public listeners on `0.0.0.0` with nothing in front.** This file predates a front end. A server that is reachable from the internet should carry `limit`, `send_queue_limit`, and `secure_gateway` on its public ports, as the [stock node best practices](best-practices/stock-node.md) describe, or sit behind a gateway that enforces the same.
- **gRPC on loopback.** Nothing on this host needs it; it stays enabled and private so a local Clio or tool can use it later without a restart.
- **`peers_max` of 50.** More than the default 21, because the server is a bridge for an application and the operator wants peering headroom; well under hub scale, because this isn't a hub.
- **A `[sntp_servers]` stanza was in the original and is omitted here.** The current server doesn't read it; keep the host's own NTP service running instead. The original also carried `nudb_block_size=4096`, which is the default and has no effect.

## Validator behind its own proxies

The topology that most production validators use: the validator is a private peer that connects only to stock servers the same operator runs, and those proxies face the network. Values are as the operator runs them; the two files are near-identical because the fleet renders both from one template.

The validator:

```
[server]
port_rpc_admin_local
port_ws_admin_local
port_peer

[port_rpc_admin_local]
port = 5005
ip = 127.0.0.1
admin = 127.0.0.1
protocol = http

[port_ws_admin_local]
port = 6006
ip = 127.0.0.1
admin = 127.0.0.1
protocol = ws

[port_peer]
port = 2459
ip = 0.0.0.0
protocol = peer

[network_id]
main

[peer_private]
1

[ips_fixed]
PROXY_A_PRIVATE_IP 2459
PROXY_B_PRIVATE_IP 2459

[cluster_nodes]
PROXY_A_NODE_PUBLIC_KEY
PROXY_B_NODE_PUBLIC_KEY

[node_seed]
THIS_SERVER_NODE_SEED

[node_size]
huge

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=512
advisory_delete=0

[ledger_history]
256

[database_path]
/var/lib/xrpld/db

[debug_logfile]
/var/log/xrpld/debug.log

[rpc_startup]
{ "command": "log_level", "severity": "warning" }

[validators_file]
mainnet_validators.txt

[validator_token]
THIS_SERVER_VALIDATOR_TOKEN

[ssl_verify]
1
```

Each proxy differs in four places: `[peer_private]` is absent (the default, 0, so the proxy accepts inbound peers), `[ips_fixed]` lists the validator and the public hubs, `[cluster_nodes]` lists the validator and the sibling proxy, and retention is `online_delete=1024` with `ledger_history` 512, so the validator can refill from a proxy after a restart without going to the network.

What to notice:

- **`[peer_private]` plus `[ips_fixed]` is the whole privacy mechanism.** The validator makes outbound connections to its proxies only and asks them not to advertise it. The proxies are what the rest of the network sees. The [Validator](server-modes/validator.md#connect-using-proxies) page walks through the setup and the check with the `peers` method.
- **`[cluster_nodes]` on both sides.** A server accepts cluster reports only from peers it lists, and learns the rest of the cluster from those reports, so a one-sided entry fails at the first link; every member lists every other member so the cluster survives any one server being down. The `[node_seed]` pins each server's node identity so the cluster survives a rebuilt database. See [Cluster xrpld Servers](peering/cluster-xrpld-servers.md).
- **Small retention on the validator, double it on the proxies.** A validator needs only enough history to stay in consensus; the proxies keep twice as much so they can always serve the validator's first fetch after a restart.
- **The custom `validators_file` name** is the operator's convention for keeping Mainnet and test network validator lists side by side. The file format is unchanged.
- **One stanza from the original is omitted here**: a public RPC and WebSocket listener on the validator, which the operator confirmed was a template artifact protected at the network layer, not an intended exposure. A validator should have no public API listener at all; see [Validator Security](security/validator.md).

### Outbound-only variant

One long-standing trusted validator runs without any inbound peer port: `[server]` has no `port_peer` entry, `[ips]` lists the hubs it dials out to, and `peers_max` is 12. Every command-line call prints `Warning: No peer protocol configured`, which is expected in this shape and harmless. Retention is `online_delete` and `ledger_history` both at 10,000, with `fetch_depth` 500 because nothing fetches from it. This is the most private topology possible and it costs the operator the ability to accept a proxy's connection; it is right for a validator that will never serve anyone else.

## Public hub

A hub in a pool of five, three of which accept 300 peers and two of which are held at about 100 as lower-load failover hubs. The file is reconstructed from the operator's recorded settings rather than copied verbatim.

```
[server]
port_rpc_admin_local
port_ws_admin_local
port_peer

[port_rpc_admin_local]
port = 5005
ip = 127.0.0.1
admin = 127.0.0.1
protocol = http

[port_ws_admin_local]
port = 6006
ip = 127.0.0.1
admin = 127.0.0.1
protocol = ws

[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer

[node_size]
huge

[peers_max]
300

[peer_private]
0

[relay_proposals]
trusted

[relay_validations]
trusted

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=100000
advisory_delete=0

[fetch_depth]
10000

[ledger_history]
100000

[crawl]
overlay=1
server=1
counts=0
unl=1

[workers]
31

[database_path]
/var/lib/xrpld/db

[debug_logfile]
/var/log/xrpld/debug.log

[rpc_startup]
{ "command": "log_level", "severity": "warning" }

[validators_file]
validators.txt
```

What the operator chose, and why:

- **Peer port 51235.** These hubs ship in the server's built-in bootstrap list on that port, so they keep it; a new hub would use the registered default 2459. See [Hub](server-modes/hub.md).
- **`peers_max` of 300 on the primary hubs, about 100 on the failover pair.** The requirements page says to start around 100 and raise it after measuring; this fleet measured for years. The failover hubs run lighter so that reserved peers always have somewhere to land.
- **`[relay_proposals]` and `[relay_validations]` set to `trusted`.** The hub still processes untrusted proposals and validations but relays only the trusted ones, which is the bulk of the bandwidth saving. The defaults differ per setting: `trusted` for proposals, `all` for validations. The third value, `drop_untrusted`, also stops processing them locally.
- **`[crawl]` enabled for overlay, server, and UNL, with `counts` off.** A public hub is a reference point for the network, so the operator deliberately publishes its topology view while withholding the internal object counts.
- **`[fetch_depth]` of 10,000 against 100,000 retained.** Peers may pull only the most recent 10,000 ledgers from the hub, which bounds the disk reads a peer can impose while keeping enough history for any peer's first sync. The setting is its own section; a `fetch_depth` key inside `[node_db]` is ignored, which is how the source file served all 100,000.
- **`[workers]` is host-specific.** It was set to the core count of that machine. Leave it unset unless you have measured; the default comes from the core count and `node_size` and tops out at 14.
- **Peer reservations aren't in the file.** They are added and removed at runtime with the `peer_reservations_add` admin command and persist in `wallet.db`, which is one reason to back that file up. See [Use a Peer Reservation](peering/use-a-peer-reservation.md).

## Full history server

A full history server in a fleet of three, behind front ends, feeding researchers and an indexer. The file is close to verbatim; addresses and the node seed are removed.

```
[server]
port_rpc_admin_local
port_ws_admin_local
port_peer
port_rpc
port_ws_public
port_grpc

[port_rpc_admin_local]
port = 5005
ip = 0.0.0.0
admin = 127.0.0.1
protocol = http

[port_ws_admin_local]
port = 6006
ip = 127.0.0.1
admin = 127.0.0.1
protocol = ws

[port_peer]
port = 51235
ip = 0.0.0.0
protocol = peer

[port_rpc]
port = 8081
ip = 0.0.0.0
protocol = http
secure_gateway = FRONT_END_A_IP, FRONT_END_B_IP
limit = 50000
send_queue_limit = 65535

[port_ws_public]
port = 8080
ip = 0.0.0.0
protocol = ws
secure_gateway = FRONT_END_A_IP, FRONT_END_B_IP
limit = 50000
send_queue_limit = 20000

[port_grpc]
port = 50051
ip = 0.0.0.0

[network_id]
main

[node_size]
huge

[node_db]
type=NuDB
path=/data/nudb
advisory_delete=0
fast_load=0
cache_size=9000000
cache_age=600

[ledger_history]
full

[database_path]
/data

[debug_logfile]
/data/debug.log

[rpc_startup]
{ "command": "log_level", "severity": "error" }

[peer_private]
1

[ips_fixed]
OWN_HUB_A_IP 51235
OWN_HUB_B_IP 51235

[peers_max]
10

[node_seed]
THIS_SERVER_NODE_SEED

[workers]
32

[io_workers]
26

[prefetch_workers]
14

[path_search]
1

[path_search_old]
1

[path_search_fast]
1

[path_search_max]
0

[validators_file]
validators.txt

[ssl_verify]
1
```

What the operator chose, and why:

- **No `online_delete` and `ledger_history` set to `full`.** That pair is what makes it a full history server. The store on this fleet is tens of terabytes on NVMe; see [Full History System Requirements](../prerequisites/system-requirements/full-history.md).
- **A private peer behind its own hubs.** `[peer_private]` with `[ips_fixed]` pointing at the operator's own hubs: the server isn't a peering resource, it is a data resource, and its peer connections exist only to stay synced. The `peers_max` of 10 is a statement of intent; behind `[peer_private]` the server dials only its fixed peers, and fixed peers don't count against the limit. Its hubs do the public peering.
- **Public API ports with `secure_gateway`, `limit`, and `send_queue_limit`.** Client traffic arrives only through the front ends named in `secure_gateway`, which forward the real client address; the firewall is what stops anything else reaching ports 8080 and 8081. The two settings do different jobs: `secure_gateway` trusts, the firewall restricts. See [Full History Security](security/full-history.md).
- **The admin RPC port binds `0.0.0.0` but grants admin only to `127.0.0.1`.** Fleet tooling reaches it over the private network; privilege is gated by the `admin` list and the port is firewalled. If you can't firewall it, bind it to loopback.
- **gRPC open on all interfaces, without `secure_gateway`.** A Clio or indexer on the private network can extract from it. Restrict the port at the firewall; add the extracting host's address to `secure_gateway` so its extraction isn't rate limited.
- **`cache_size` and `cache_age` set.** The node store's object cache always exists; unset, the server sizes it from `node_size`, which at `huge` means 8,388,608 objects kept for up to 900 minutes. This operator raised the count slightly to 9,000,000 and shortened the age to 600 minutes on a host with hundreds of gigabytes of RAM. `fast_load=0` is the default.
- **Thread pools sized to the host.** `[workers]`, `[io_workers]`, and `[prefetch_workers]` were tuned for that machine's core count during a dry run. Unset, `workers` is derived from the core count and `node_size` and never exceeds 14, while `io_workers` is 6 on any host with more than two cores and `prefetch_workers` is 4; set them only after measuring on your own host.
- **Pathfinding off.** `[path_search_max]` 0 disables path search; `[path_search]` and `[path_search_fast]` have no effect once the maximum is zero, and `[path_search_old]` is used only when a client asks `sign` or `submit` to build paths, which a public server shouldn't offer. A public full history server never offers pathfinding; see [Pathfinding](server-modes/pathing.md).
- **Log level `error`.** Lower than the usual `warning`, chosen after years of knowing which warnings matter on this fleet. Start at `warning`.

## Pathfinding

No operator in this program runs pathfinding on a stock `xrpld` in production; the one production pathfinding service runs a separate path engine in front of a cluster of stock servers, which is outside these guides. The `xrpld` block for a dedicated pathfinding server is therefore the one on [Minimal Configurations](minimal-configurations.md#pathfinding-server), and the stock servers behind that service look like this:

```
[server]
port_rpc_admin_local
port_ws_admin_local
port_peer

[port_rpc_admin_local]
port = 5005
ip = 127.0.0.1
admin = 127.0.0.1
protocol = http

[port_ws_admin_local]
port = 6006
ip = 0.0.0.0
admin = 127.0.0.1, PRIVATE_LAN_CIDR
protocol = ws
send_queue_limit = 500

[port_peer]
port = 2459
ip = 0.0.0.0
protocol = peer

[cluster_nodes]
SIBLING_A_NODE_PUBLIC_KEY
SIBLING_B_NODE_PUBLIC_KEY

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=256
advisory_delete=0

[database_path]
/var/lib/xrpld/db

[debug_logfile]
/var/log/xrpld/debug.log

[rpc_startup]
{ "command": "log_level", "severity": "warning" }

[validators_file]
validators.txt

[ssl_verify]
1
```

What to notice:

- **The admin WebSocket port is open to a private LAN range.** The path engine on another host on that network talks to the server over WebSocket as an admin client. The `admin` list is what grants the privilege; the port must never be reachable from outside that LAN.
- **Three clustered siblings.** Clustering here is sync insurance: a restarted member re-enters the network through peers that already trust it. It doesn't share client load between the servers.
- **Minimum retention.** `online_delete=256` because the path engine works on the current ledger state and never asks for history.
- **The original uses an in-memory node store from a custom build.** It is replaced with NuDB here because that is what the packaged server supports.

## Clio writer and its feeding server

The ingestion side of a Clio deployment: a writer-capable Clio process and the `xrpld` server that feeds it. The Clio fragment is the writer's; a reader uses the same database and source list with `"read_only": true`. See [Robust Clio setup](server-modes/clio-robust-setup.md) for the whole deployment.

Clio, the writer (fragment, not a complete file):

```json
{
  "read_only": false,
  "database": {
    "type": "cassandra",
    "cassandra": {
      "contact_points": "SCYLLA_A_PRIVATE_IP,SCYLLA_B_PRIVATE_IP,SCYLLA_C_PRIVATE_IP",
      "port": 9042,
      "keyspace": "clio",
      "replication_factor": 3
    }
  },
  "etl_sources": [
    { "ip": "XRPLD_A_PRIVATE_IP", "ws_port": "6005", "grpc_port": "50051" },
    { "ip": "XRPLD_B_PRIVATE_IP", "ws_port": "6005", "grpc_port": "50051" }
  ]
}
```

The feeding `xrpld`, the stanzas that matter (`port_ws_clio` must also be listed in `[server]`, or the server never reads the stanza):

```
[port_ws_clio]
port = 6005
ip = PRIVATE_INTERFACE_IP
protocol = ws
secure_gateway = CLIO_WRITER_IP, CLIO_READER_A_IP, CLIO_READER_B_IP

[port_grpc]
port = 50051
ip = PRIVATE_INTERFACE_IP
secure_gateway = CLIO_WRITER_IP, CLIO_READER_A_IP, CLIO_READER_B_IP
```

What to notice:

- **Every Clio process lists the same two sources.** Clio load-balances extraction across them and keeps going while one is synced. A reader needs the sources too, for forwarded requests and subscriptions, even though it never writes.
- **`secure_gateway` on both feeder listeners names the Clio hosts.** Without it extraction still works but is rate limited, and Clio logs a warning containing `is_unlimited is false`. The address must be the one the feeder actually sees: behind Docker or NAT that is the bridge or gateway address, and this operator traced exactly that warning to it. `secure_gateway` lifts the rate limit only; the firewall is what keeps the ports private.
- **Replication factor 3 on a three-host cluster.** Clio reads and writes at quorum, so the cluster tolerates one replica of a row being unavailable. See [Clio System Requirements](../prerequisites/system-requirements/clio.md).

## See Also

- [Minimal Configurations](minimal-configurations.md)
- [Server Modes](server-modes/index.md)
- [Security](security/index.md)
- [Best Practices](best-practices/index.md)

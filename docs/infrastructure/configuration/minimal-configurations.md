---
seo:
    description: Minimal working xrpld configurations per server role, with every line explained.
labels:
  - Core Server
---
# Minimal Configurations

The example configuration file that ships with `xrpld` (formerly `rippled`) is about 1,700 lines, of which a typical server sets fewer than 60. Operators consistently report that finding those lines is the hardest part of starting out. This page is the other way around: the smallest working configuration per role, every line present for a reason, with the full annotated file left as reference material.

Each configuration below is a complete starting point once `validators.txt` sits next to `xrpld.cfg`. The per-role pages explain the choices and how to grow from here.

{% admonition type="info" name="About omitted settings" %}
Anything not set here uses the server's defaults, including automatic `node_size` selection from the host's memory and cores. A setting you don't understand is better omitted than copied: several of the sharpest operational problems in production trace back to settings pasted from examples. Note that the server silently ignores unknown keys and, if a key appears twice in a stanza, uses the last one - so typos and duplicates fail without errors. A stanza that holds a single value, such as `[path_search_max]` or `[peers_max]`, behaves differently: if it appears twice, the server ignores both copies, and nothing is logged, because the config loader's log sink is disabled. When a block below says "plus", change the stanza already in your file instead of pasting a second copy.
{% /admonition %}

## Stock server (submit transactions, serve your apps)

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

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=25000
advisory_delete=0

[path_search_max]
0

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

Line by line: the validator list in `validators.txt` (the packages install it next to `xrpld.cfg`; with a build from source, copy `cfg/validators-example.txt` from the source tree yourself, because the server refuses to start if the file named here is missing); admin interfaces on loopback only; a public peer port on 2459, the registered default on current versions (many existing servers and most public hubs still listen on 51235, so match the port each peer actually uses); NuDB with about a day of retention (budget roughly double the steady-state store for rotation peaks; see [Capacity Planning](../prerequisites/capacity-planning.md#disk-space)), because online deletion costs the same per rotation whatever the window and a window of a few hours rotates all day long (raise `online_delete` and add `[ledger_history]` if your applications query history, because `ledger_history` defaults to 256 and a restarted server backfills only that much; see [Stock Node](server-modes/stock-node.md#history-for-api-traffic)); log level capped at `warning` so the debug log doesn't eat the disk; pathfinding off, because it is on by default and is the most expensive request a server can serve (remove the stanza only if your own applications call `path_find`; see [Pathfinding](server-modes/pathing.md)). Serving clients beyond localhost needs the limits in [Stock Node Best Practices](best-practices/stock-node.md) added.

## Validator

Everything in the stock configuration above (its peer port is optional here; see below), plus:

```
[validator_token]
<token from the validator-keys tool; the master key stays offline>

[peer_private]
1

[ips_fixed]
<first hub or proxy> <its peer port>
<second hub or proxy> <its peer port>
```

A validator adds exactly three ideas: an identity (the token, never the master key - see [Validator Security](security/validator.md#keys)), private peering behind peers you chose ([topologies compared](security/validator.md#topology-and-exposure)), and day-scale retention so deletion rotations are rare (the stock block's `[node_db]` already provides it). Pathfinding turns itself off when a validator token is present, and the stock block's `[path_search_max]` already says so. A private validator connects outward to its `[ips_fixed]` peers and needs no inbound peer port. If you keep one (it also serves the `/health` endpoint that some checks use), firewall it to your proxies and turn the crawler off with a `[crawl]` stanza containing `0`. The full setup order, including key generation and verification, is on the [Validator](server-modes/validator.md) page - configuration alone doesn't make a working validator.

## Hub

The stock configuration, with the peer capacity raised and more history kept for peers to fetch (replace the stock `[node_db]` with the one below rather than adding a second one):

```
[peers_max]
100

[ledger_history]
50000

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
online_delete=50000
advisory_delete=0
```

`peers_max` starts at 100, the figure [Hub System Requirements](../prerequisites/system-requirements/hub.md) gives for a new hub; production hubs raise it toward 300 as the host and its link prove themselves. The 50,000-ledger window is the low end of the history-serving range. Leave `[fetch_depth]` out: it limits how far back peers may ask this server for ledgers, and it defaults to everything the server keeps, so setting it only makes the hub serve less than it stores. `peer_private` stays off (a hub that hides isn't a hub), and the crawler stays on. Sizing, bandwidth reality, and the rest: [Hub](server-modes/hub.md).

## Pathfinding server

The stock configuration, with pathfinding turned on deliberately, a separate port for the proxy, and nothing else to do:

```
[path_search]
2

[path_search_fast]
2

[path_search_max]
7

[port_ws_proxy]
port = 6005
ip = <the private address the proxy connects to>
protocol = ws
secure_gateway = <the proxy's address>
```

Replace the `[path_search_max] 0` in the stock block with the one above (a second copy would be ignored), add `port_ws_proxy` to the `[server]` list, keep the admin ports on loopback, and put the proxy in front of the new port, capping concurrent path requests there, because the server accepts more than it can serve well. `path_search` and `path_search_fast` are shown at their defaults of 2; only `path_search_max` changes, from 3 to 7. The depths are deliberate but short of the example configuration's "advanced pathfinding" ceiling of 10; raise `path_search_max` only after measuring.

{% admonition type="warning" name="Never point the proxy at an admin port" %}
The stock block's two ports both carry `admin = 127.0.0.1`. A proxy on the same host connects from 127.0.0.1, so every client behind it would arrive as an administrator, able to run admin commands and exempt from the server's per-client limits. The proxy port above has no `admin` line. Its `secure_gateway` entry makes the server rate-limit by the client address the proxy forwards rather than treating all proxied clients as one; don't have the proxy send an `X-User` header, which lifts those limits entirely.
{% /admonition %}


See [Pathfinding](server-modes/pathing.md) for the role and [Pathfinding Security](security/pathing.md) for why it never shares a host with another role.

## Full history

Not a minimal-config role. The order of operations matters more than the stanzas - in particular the SQLite page size for `transaction.db` must be set **before first start** (the `[sqlite]` `page_size` applies to that file only):

```
[sqlite]
page_size=32768

[ledger_history]
full

[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb
```

No `online_delete` at all, and no `advisory_delete` either, because the server reads it only when `online_delete` is set. Full history usually lives on its own array, so adjust `path` to your mount; [Configure Full History](data-retention/configure-full-history.md) uses the packaged path throughout. Follow [Configure Full History](data-retention/configure-full-history.md) step by step rather than starting from this fragment.

## See Also

- [Capacity Planning](../prerequisites/capacity-planning.md)
- [Understanding Log Messages](../troubleshooting/understanding-log-messages.md)
- The annotated example configuration file shipped with the server (`xrpld-example.cfg`), as reference

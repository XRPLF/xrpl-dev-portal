---
seo:
    description: Use public XRP Ledger hubs for reliable peering - the built-in bootstrap hubs, the ips stanza, and peer reservations.
labels:
  - Core Server
---
# Connect to Public Hubs

Public hubs are `xrpld` (formerly `rippled`) servers run by community operators specifically to provide peering capacity. Connecting to good hubs is the single most effective peering improvement a server operator can make: sync is faster and more reliable with a few well-run fixed peers than with discovery alone, and operators who struggled to hold sync consistently report that peering with established hubs resolved it.

## The built-in bootstrap hubs

When a server starts with neither `[ips]` nor `[ips_fixed]` configured, it bootstraps from a short list of hub hostnames built into the server source code. If you set either section, that section is used instead, and the list below is ignored:

```
r.ripple.com 51235
sahyadri.isrdc.in 51235
hubs.xrpkuwait.com 51235
hub.xrpl-commons.org 51235
```

These are pools of hubs operated by Ripple and community organizations. Every fresh install that sets no peers quietly depends on them for its first connections, which is why bootstrap operators treat the role as a serious commitment (see [Hub](../server-modes/hub.md#who-should-run-a-hub)). The exact list belongs to the server version you run; it changes only through source code changes.

## Add hubs to your configuration

`[ips]` entries are starting points for peer discovery: the server contacts them, and may also find other peers through them. Write the port on every entry: an entry without one uses 2459, the registered peer port, and the hubs below listen on 51235.

```
[ips]
r.ripple.com 51235
hubs.xrpkuwait.com 51235
```

`[ips_fixed]` entries are peers the server always tries to keep connected, reconnecting whenever the connection drops:

```
[ips_fixed]
hub.example.net 51235
```

Use `[ips_fixed]` for hubs you deliberately rely on - for example, a [private validator's](configure-a-private-server.md) chosen peering points. Use more than one, from more than one operator: hubs restart and fleets do maintenance, and your peering should survive any single hub disappearing.

## Peer reservations: a guaranteed slot

Busy hubs run at their peer limits, so an ordinary connection can be crowded out. A [peer reservation](use-a-peer-reservation.md) is the hub operator's guarantee that your server always gets a slot on that hub, identified by your server's node public key. It doesn't guarantee uninterrupted connectivity: the hub's own outages and maintenance still apply, so reserve on more than one hub.

From the requesting side:

1. Find how the hub operator accepts requests - some handle it through community channels, and some bootstrap operators run automated request systems.
2. Share your **node public key** (from `server_info`, the `pubkey_node` field). That key isn't a secret. Never share seeds or validator keys as part of a peering request. If your server has no `[node_seed]`, that key is generated once and stored in its databases, so erasing them or moving to a new machine changes it and the hub's reservation stops matching. Set a permanent `[node_seed]` first if that could happen; see [step 1 of Use a Peer Reservation](use-a-peer-reservation.md#1-stock-server-set-up-a-permanent-node-key-pair).
3. Expect to prove you operate the server. A careful hub operator verifies that the request comes from the server's own address and that the connecting server presents the claimed key, so a request system asking you to run a verification command from the server is behaving correctly, not suspiciously.
4. Add the hub's addresses to `[ips_fixed]` once the reservation is granted.

A reservation only matters when the hub is full: it lets your server in when an ordinary connection would be turned away, including while the hub refills after a restart. After a hub restarts, your server reconnects because the hub is in your `[ips_fixed]`, so keep it there.

One bootstrap operator accepts automated reservation requests at [xrpkuwait.com/xrpk-peer-reservation](https://xrpkuwait.com/xrpk-peer-reservation), using the verification flow described above. Community-maintained, not endorsed by the XRPL Foundation or Ripple; review anything before you run it.

## Etiquette

- Don't point large fleets at one hub without talking to its operator.
- If a hub gives you a reservation, tell them when you decommission the server so they can reclaim the slot.
- If your server grows into spare capacity of its own, consider [running a hub](../server-modes/hub.md): the network's peering capacity exists because operators who used it gave some back.

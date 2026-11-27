---
seo:
    description: Secure a stock XRP Ledger server - exposed API surface, admin isolation, and the shared-infrastructure hazards.
labels:
  - Core Server
---
# Stock Node Security

A stock `xrpld` (formerly `rippled`) server's security posture depends entirely on who can reach its ports. A submission server for your own applications on a private network has almost no exposed surface; a public API backend has the largest surface of any role except a hub. This page works from the exposed case backward - remove what doesn't apply.

## The API surface

- **Nothing public without limits.** Every port reachable beyond localhost carries `limit`, queue caps, and - if a front end exists - `secure_gateway`, which sets trust in the front end's forwarded headers, not access; see [Stock Node Best Practices](../best-practices/stock-node.md#port-limits-that-production-front-ends-actually-run).
- **Prefer a front end.** Terminate TLS, authenticate if you need to, and absorb abuse at a load balancer or gateway you control, not at `xrpld`. The server's own defenses (per-client scoring, connection caps) are a backstop, not a perimeter.
- **WebSocket subscriptions are state.** Each one holds server resources for as long as the client stays connected; the server pings each idle connection every 30 seconds and closes one whose ping can't be delivered (a client that has stopped reading), and `send_queue_limit` (default 100) disconnects a client that falls too far behind.

## Admin isolation

- **Admin RPC and WebSocket on loopback only.** `ip = 127.0.0.1`, `admin = 127.0.0.1`. Keep admin on its own port: the `admin` list matches the address a connection comes from, so a proxy on the same host that forwards client traffic to a port with `admin = 127.0.0.1` makes every client an admin. Admin connections bypass the server's per-client limits and can run privileged commands; treat the admin port like a root shell.
- **Most monitoring doesn't need a remote admin port.** Public `server_info` and `server_state` cover ledger age and state. The inbound and outbound peer split (`peers`), `get_counts`, `node_size`, and the unsupported-amendment warning are admin only, so read those on the host over loopback, or push metrics out with `[insight]` (StatsD) so nothing connects in. If tooling must read server state remotely, give it a **separate non-admin port** on a private interface - a pattern home and professional operators both run - rather than widening admin.
- gRPC, if enabled, follows the same rule: loopback, or a private interface that only your Clio hosts can reach, never bare on a public interface. `secure_gateway` doesn't restrict who can connect to this port; it only lifts the rate limit for the addresses you list (and only when the request carries a user), so the bind address and the firewall do the restricting.

## The host

- Standard hardening applies and isn't this page's job: key-only SSH, default-deny firewall, least-privilege service user (the packages ship `xrpld` as an unprivileged user with a hardened unit). In Docker, remember that published ports bypass `ufw`. Publish admin and monitoring ports on `127.0.0.1` (`-p 127.0.0.1:5005:5005`) and restrict every other published port with a rule in the `DOCKER-USER` chain; see the [Security index](index.md). The `ip = 0.0.0.0` inside the container's `xrpld.cfg` is fine, because the publish flag is what decides who can reach it.
- **Shared infrastructure is the quiet killer for this role.** The measured failures of stock servers in production were not attacks: a shared VM whose neighbors consumed the disk, a co-tenant process that triggered memory pressure, a container cap that counted the page cache. If the server matters, give it dedicated resources or measured guarantees - and if it must share, cap the neighbors, not just the server.

## Keys and identity

A stock server holds no validator keys and its node identity is replaceable - which makes its custody rules short:

- Don't reuse a stock server's host for validator key material; the roles' exposure profiles are opposites.
- `wallet.db` carries the node's identity and persisted manifests between restarts. It is worth including in config backups mostly so a rebuilt server keeps its peer reservations - and worth knowing about when you migrate a server, because stale state there survives a move.
- Applications' signing keys are the real secrets in a submission setup, and they belong in your application's custody story, never on the ledger server. That includes secrets sent to it: leave `[signing_support]` off (the default), and sign in your application or a standalone signing tool rather than with `sign` or `submit` plus a secret. An admin connection can still use those commands, so this is another reason to keep admin on loopback.

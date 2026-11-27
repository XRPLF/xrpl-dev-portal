---
seo:
    description: Secure a Clio deployment - Clio is the public face, the xrpld behind it is not, and the database is never reachable from the internet.
labels:
  - Core Server
---
# Clio Security

A Clio deployment has three layers with three different exposure levels: Clio readers face clients, the feeding `xrpld` (formerly `rippled`) servers face only Clio, and the database faces only Clio and its own nodes. Most of Clio security is keeping those three layers from blurring into each other. Settings and defaults on this page are from Clio 2.8.0; check them against the release you run.

## Clio is the public face

Put a gateway in front of the readers and let it do the public-facing work: TLS termination, authentication where you need it, rate limiting per client, protocol rules (which methods, which API versions), and response caching. Restrict Clio's listener to the gateway so clients can't bypass it. Clio has its own protections, and they are a last line, not a policy:

- **DoS guard.** Clio rate-limits per client IP (`dos_guard`: concurrent connections, plus requests and fetched data per sweep interval). A client over its budget gets the `slowDown` error (HTTP 503 on HTTP, an error frame on WebSocket); the response that first crosses the fetch budget still arrives, carrying warning 2003, "You are about to be rate limited". New WebSocket connections from an address already over the limit are refused with HTTP 429 "Too many requests". Behind a load balancer every client arrives from the balancer's address and is treated as one client; the section below gives the two ways to handle that.
- **Request queue.** `server.max_queue_size` bounds queued requests (the default is 1000) and Clio rejects beyond it. Addresses in `dos_guard.whitelist` bypass the limit, another reason to keep that list short. Keep it bounded; an unbounded queue turns overload into memory exhaustion.
- **Admin access.** Clio treats requests whose client address is exactly `127.0.0.1` as administrative by default (IPv6 loopback `::1` doesn't count). A local proxy makes public traffic appear local, so on any Clio that a proxy reaches, set `server.admin_password` and `server.local_admin: false` together: Clio refuses to start with `local_admin` set to false and no password, and refuses a password together with `local_admin` set to true. Keep the password out of version control, and put the Prometheus metrics endpoint (which uses the same admin authorization) behind your monitoring network only.

Readers are the only Clio processes clients should ever reach. The writer can answer API requests, but it serves no clients and sits on no public route: keep it behind the firewall and out of every client-facing load balancer; see [Isolate the writer](../best-practices/clio.md#isolate-the-writer). In the [simple setup](../server-modes/clio-simple-setup.md), where one process does both jobs, bind its API to localhost or a private address and let only your own application reach it.

### Configure the DoS guard

`dos_guard` is a top-level object in the Clio configuration. These are the 2.8.0 defaults, shown so you know what you are tuning, not a capacity recommendation:

```json
{
  "dos_guard": {
    "max_connections": 20,
    "max_requests": 20,
    "max_fetches": 1000000,
    "sweep_interval": 1.0,
    "whitelist": []
  }
}
```

What each setting controls:

| Setting | What it controls |
|:--------|:-----------------|
| `max_connections` | Concurrent connections from one IP address. This count is live and the sweep doesn't reset it. |
| `max_requests` | Request budget for one IP per sweep interval. Each request counts 1 by default; per-method weights exist only through experimental, undocumented keys. |
| `max_fetches` | Bytes of response data returned to one IP per sweep interval. Clio sums the size of each response it sends, so the default 1,000,000 is roughly 1 MB per second. |
| `sweep_interval` | Seconds between resets of the request and fetch counters. |
| `whitelist` | Addresses exempt from the guard. Leave it empty unless the exemption is deliberate and equivalent limits exist in front. |

Test the limits against your own workload with controlled bursts and confirm that excess traffic is rejected before you rely on them.

Behind a load balancer you have two choices. Either whitelist the balancer and enforce limits at the gateway, or name the balancer in `server.proxy.ips` (or give it a token listed in `server.proxy.tokens`, sent in an `X-Proxy-Token` header) so Clio takes the real client address from the `Forwarded` header the proxy sets. Clio reads only `Forwarded`: a proxy that sets `X-Forwarded-For` alone isn't read, and every client still counts as the proxy's address. The proxy must replace any client-supplied forwarding headers with the address it saw.

### Protect the admin password

`server.admin_password` is stored as plaintext in the configuration, not as a hash, and it is separate from the database credentials; use different secrets for the two. Clio hashes the configured value with SHA-256 and compares it with the `Authorization: Password <SHA-256 hash>` header on each request, so the request hash is itself a reusable credential: protect it like the password, use TLS, and never expose either value to public clients. The file protections under [Supply and secure database credentials](#supply-and-secure-database-credentials) on this page apply to both secrets.

## The feeding servers are not public

The `xrpld` servers that feed Clio are ordinary stock servers whose gRPC and WebSocket ports are opened to Clio and to nothing else. Two settings carry the whole trust relationship:

- **`[port_grpc]` and the WebSocket port on the feeder** must list Clio's address in `secure_gateway`. Without it on the gRPC port, extraction still works but is throttled, and Clio logs a warning containing `is_unlimited is false`, the reliable sign that a feeder doesn't trust this Clio. Search for that phrase: during the initial download the line starts `AsyncGrpcCall is_unlimited is false`; for every ledger after that it is logged by `ETL_Grpc[ip:port]` without that prefix. On the WebSocket port the symptom is different and silent: `xrpld` ignores the client address Clio forwards and rate-limits everything Clio sends as one client.
- **The address must be the one the feeder actually sees.** In containers and behind NAT, the feeder sees the bridge or gateway address, not the host's address you expected to allow. One production deployment traced an `is_unlimited is false` warning to exactly this. Allow the observed source address, keep the list to the Clio processes that need it, and check the feeder's view rather than your diagram. On `[port_grpc]` each entry must be a single address: subnets and `0.0.0.0` are rejected at startup, while the WebSocket port accepts subnets, so a range that works on one can fail on the other.

Firewall the feeders so the gRPC and WebSocket ports accept connections only from Clio's addresses, and keep that link on a private network, because Clio's `etl_sources` entries take only `ip`, `ws_port`, and `grpc_port` and have no TLS options: the WebSocket connection uses TLS if the feeder port offers it, the gRPC connection is always plaintext. If a feeder or the database runs in Docker, `ufw` doesn't see published ports, and publishing on `127.0.0.1` isn't an option when Clio is on another host: publish on the private interface address and restrict the port with a rule in the `DOCKER-USER` chain. The feeders' peer port follows the normal [stock node](stock-node.md) rules. Clio forwards a fixed set of methods to a feeder (transaction submission, `fee`, `server_state`, path finding, channel authorization, `simulate`, `batch`, and any request for the current or closed ledger; methods it doesn't know get an error rather than being forwarded), so a feeder is indirectly reachable by clients through Clio; its admin ports must stay bound to loopback as shipped, and the ports Clio reaches must carry no `admin` entry.

## The database is never on the internet

The Cassandra or ScyllaDB cluster listens for Clio, for its own nodes, and for the management systems you approve. Nothing else.

- Bind the client port to a private network and allow only the Clio hosts and approved management systems. Restrict the inter-node ports to cluster members. Never publish database client, cluster, or management ports to the internet; the Docker rule above applies here too.
- Turn on encryption for inter-node traffic and for client connections, and authentication and authorization for the Clio account. The production deployment runs both; the Clio configuration carries the credentials and, in `database.cassandra.certfile`, the certificate that turns on TLS to the database (one trusted certificate; Clio has no client-certificate option).
- Replace default credentials, and give Clio a dedicated account with only the permissions its keyspace needs, not a superuser. Handle schema setup with separate permissions where you can.
- Place database hosts across failure domains and tell the database about it, so a replication factor of 3 means three copies in three places rather than three copies on one switch. Clio creates its keyspace with `SimpleStrategy`, which ignores racks and datacenters; for rack-aware placement, create the keyspace yourself with `NetworkTopologyStrategy` before the first writer starts. Clio then uses it as is, and `database.cassandra.replication_factor` is ignored.
- A database cluster is a high-value target in its own right: a full copy of ledger history that an attacker can corrupt rather than steal. Treat its admin access with the same seriousness as a validator's keys.

### Supply and secure database credentials

Clio uses its Cassandra-compatible backend for both Cassandra and ScyllaDB: `database.type` is `cassandra`, and the account's username and password go in `database.cassandra.username` and `database.cassandra.password`. The password is stored as supplied and passed to the database driver as is; it isn't hashed, and a database-side password hash doesn't protect this client-side file. Set both keys: if either is missing, Clio connects without credentials and doesn't warn.

Keep the configuration out of version control and out of any web-served directory, deliver secrets into it through a secret manager or a deployment secret, and limit file access to the Clio service account and administrators, for example mode `0600`. Protect backups and rendered container configuration the same way, never paste credentials into logs, screenshots, support bundles, or shared examples, and rotate anything that has been exposed.

## What you can lose

The components, what losing each one costs, and how you get it back:

| Component | If an attacker or a mistake takes it | Recovery |
|:----------|:-------------------------------------|:---------|
| A reader | Clients on it reconnect elsewhere; nothing stored. In the simple setup there is nowhere else to go | Redeploy from configuration |
| The writer | Ingestion stops, readers serve stale data within seconds, alerts fire; a combined writer and reader also stops serving clients | Restart or redeploy; it resumes from the last stored ledger |
| A feeding server | Clio fails over to another source if you listed more than one and it still holds the ledgers Clio needs | Resync the server; keep enough history on the others |
| The database | Historical service stops; anything after the last snapshot is lost, and everything is lost if there is none | Restore a tested snapshot, or rebuild and refill: weeks for full history. See [Clio Best Practices](../best-practices/clio.md#decide-the-backup-question-before-the-cluster-is-full) |

The table is the argument for two feeders, a writer nobody can reach, and a database nobody can see. If you suspect a compromise, contain it and rotate the affected credentials before you restore service.

## See also

- [Clio](../server-modes/clio.md)
- [Clio Simple Setup](../server-modes/clio-simple-setup.md) and [Clio Robust Setup](../server-modes/clio-robust-setup.md)
- [Clio Best Practices](../best-practices/clio.md)
- [Clio System Requirements](../../prerequisites/system-requirements/clio.md)
- [Stock Node Security](stock-node.md)
- In the Clio repository, at 2.8.0: the [configuration reference](https://github.com/XRPLF/clio/blob/2.8.0/docs/config-description.md), [admin verification](https://github.com/XRPLF/clio/blob/2.8.0/src/web/AdminVerificationStrategy.cpp), the [DoS guard](https://github.com/XRPLF/clio/blob/2.8.0/src/web/dosguard/DOSGuard.cpp), and [database credential handling](https://github.com/XRPLF/clio/blob/2.8.0/src/data/cassandra/impl/Cluster.cpp)

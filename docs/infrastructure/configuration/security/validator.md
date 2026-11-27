---
seo:
    description: Protect a validator's keys, hide its address, and harden the host it runs on.
labels:
  - Core Server
  - Security
---
# Validator Security

A validator has two assets: its master key and its uptime. The `xrpld` (formerly `rippled`) daemon itself isn't reachable by the public on a correctly configured validator, so the real attack surface is the operating system, SSH, whatever else runs on the host, and the operator. This page covers what to protect and how.

For the setup steps, see [Validator](../server-modes/validator.md). For day-to-day operation, see [Validator Best Practices](../best-practices/validator.md).

## Keys

### Where the master key lives

The validator master key is generated with the `validator-keys` tool on a machine that isn't the validator, and it stays off the validator forever. The server holds only a token, which the master key can revoke and replace at any time.

The strictest practice, and the recommended one, is to generate the key on an isolated machine and keep it on encrypted removable media in two physical locations. A softer practice some operators use is a key generated on a local virtual machine and stored in a password manager. What no experienced operator does is keep the only copy on the validator host. Check now that you haven't done exactly that; it is a common discovery.

Professional deployments go one step further: the token is stored in a secrets manager and fetched by the host at deploy time with audit logging, so it is never in a repository or an image. The master key never leaves cold storage.

### The three files that are your identity

Back up these three files, together, off the host:

| File | Default location | What it holds | If lost |
|:-----|:-----------------|:--------------|:--------|
| `validator-keys.json` | Wherever you ran `validator-keys create_keys` (not on the validator) | The master key pair and the current `token_sequence` | You can never issue another token or revoke the key. The validator identity is gone for good. |
| `xrpld.cfg` | `/etc/xrpld/xrpld.cfg` | The current `[validator_token]` and every setting | Rebuildable from the key file, with effort |
| `wallet.db` | `/var/lib/xrpld/db/wallet.db` by default (in `[database_path]`) | The server's node key pair, the manifests it trusts including its own, peer reservations, and your amendment votes | The server mints a new node identity; peer reservations and cluster trust must be redone; amendment votes revert to defaults |

Little else on the host needs backing up: `validators.txt` if you customized it, any `systemd` drop-ins and limits, and the log rotation file, all of which belong in your configuration management anyway. The ledger store is rebuilt from the network in hours, and restoring a stale copy is slower and riskier than a resync. Operators who restore for real report that the backup set above plus their configuration management rebuilds a validator completely.

Test the restore once. A backup you have never restored from is untested, and operators discover that at the worst possible moment.

### Rules for tokens

- **The sequence only goes up.** Every `create_token` and `set_domain` increments `token_sequence` in `validator-keys.json`. A token issued from an older copy of the file reuses a sequence the network has already seen, and the network ignores it. Update every backup copy after every token operation.
- **`set_domain` issues a new token.** Install it in `xrpld.cfg` and restart, or the domain claim never reaches the network. See [Provide domain verification](../server-modes/validator.md#6-provide-domain-verification).
- **`wallet.db` and `xrpld.cfg` must agree on the token.** At startup the server loads the manifests held in `wallet.db` first, then applies the token from `xrpld.cfg`, keeping whichever carries the higher sequence. An old data directory with a current configuration is therefore harmless: the configured token wins. The hazard runs the other way: a current `wallet.db` with an older `xrpld.cfg`, for example one restored from a backup, makes the server treat the configured manifest as stale and keep the newer manifest from `wallet.db`. It still signs with the key in the configured token, because `wallet.db` holds only public manifests, so the key it signs with and the manifest it holds disagree, and servers that hold the newer manifest no longer count its validations. The fix is to restore the current token in `xrpld.cfg`; `wallet.db` can't stand in for it. When you move a validator or rotate a token, carry `wallet.db` and `xrpld.cfg` together, or start with a fresh `wallet.db` (which changes the node key pair, peer reservations, and amendment votes, not the validator key).
- **Check the sequence before you issue.** If you aren't sure which copy of `validator-keys.json` is current, read the `seq` from the [validator_info method][] on the running validator first. The next token must carry a higher sequence.

### If you suspect exposure

- If the **host** or the **token** may be compromised but the master key was never on the host: isolate the host, generate a new token on a trusted offline machine, rebuild the host from scratch (or provision a clean replacement) on the assumption it is compromised, and only then install the new token and restart. Tell your UNL publishers early. Installing the replacement token on a host an attacker may still control exposes that token too.
- If the **master key** may be compromised: [revoke it](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md#key-revocation) immediately and permanently. Revocation is the reason the master key exists separately from the token.


## No high availability

Don't run two servers with the same validator key, ever, for any reason. Two servers signing with one key produce conflicting validations that harm every server that trusts you. This is the one operator error that damages other people's infrastructure rather than your own. The prohibition is on the key, not on the number of servers: running several validators, each with its own identity, is fine.

That rules out the usual high-availability patterns: orchestrators that keep N replicas alive, active-active pairs, automatic failover. Professional operators name "the usual HA setup doesn't work here" as their hardest early lesson.

What works instead:

- **A fast, rehearsed rebuild.** A tested configuration bundle, the three identity files above, and a procedure you have run. The unit of redundancy is recovery time, not concurrent uptime. Operators who have restored for real recommend a timed trigger: if the dead server isn't back within a set time, stop fixing it and provision a replacement.
- **A cold standby** that holds the configuration and can receive the key files, and is activated only after the primary is completely stopped or isolated. Never while it could still be running.
- **The Negative UNL**, which covers a trusted validator's downtime automatically; there is nothing to configure. See [Restart with care](../best-practices/validator.md#restart-with-care).

## Topology and exposure

How your validator reaches the network decides who can see its address and who can reach its ports. Four configurations are in production use. Each is described step by step in [Connect to the network](../server-modes/validator.md#4-connect-to-the-network).

| Topology | How it works | Exposure | Notes |
|:---------|:-------------|:---------|:------|
| Private behind your own proxies | Validator in a [cluster](../peering/cluster-xrpld-servers.md) with stock servers you run; `[peer_private]` on; validator firewalled to the proxies only | Validator IP known to your proxies, and to any site the validator contacts directly (the list publishers, unless outbound traffic leaves through a NAT you control) | The strongest configuration and the one professional operators converge on, on bare metal and in the cloud. Most work to build. Cloud versions add an isolated subnet with a dedicated NAT so the validator's address never appears outbound. |
| Private behind public hubs | `[ips_fixed]` lists trusted hubs; `[peer_private]` on | Validator IP known to the hubs | Simple. Depends on hub capacity; use several, and consider a [peer reservation](../peering/use-a-peer-reservation.md). |
| Public with protections | Discovered peers; low `[peers_max]`; `ip_limit` in `[overlay]`; provider DDoS mitigation; everything else firewalled | Validator IP advertised to the network | Runs at full agreement in production. The provider's mitigation is doing real work; targeted attacks on validators are rare but this configuration is the one that would receive them. |
| Outbound only | No `port_peer` entry in `[server]` at all; outbound connections to the peers listed in `[ips]` (discovered peers still allowed) or, with `[peer_private]` on, to `[ips_fixed]` only | No inbound peer port at all | Lowest bandwidth and no inbound surface. Contributes no peer capacity to the network. Run in production on a UNL validator for years. The server logs `Warning: No peer protocol configured` on every commandline call in this topology; that warning is expected and benign here. |

Two behaviors to know regardless of choice:

- **Private peering fails closed.** With `[peer_private]` set to `1`, the server connects only to `[ips_fixed]` and ignores `[ips]`. If every fixed peer is unreachable, the validator has zero peers and stops validating. Bring proxies or hubs up first, confirm they are reachable from outside, then switch the validator to private. After any change, confirm with the [peers method][] that the validator's peer list is exactly what you configured.
- **The peer crawler answers by default.** Any server can query your validator's peer port for its topology unless you [disable the peer crawler](../peering/configure-the-peer-crawler.md). On a validator, disable it. Separately, any server with a validator key asks its peers to leave its address out of their crawl results, even without `[peer_private]`. That doesn't hide it: with a peer port it still advertises itself in peer gossip and makes automatic connections. Only `[peer_private]` turns those off.

## Keep the address private

Real operators have been located, down to a home address, because something on the validator's IP answered HTTP. The validator's address isn't a secret you can un-leak.

- **The domain must not resolve to the validator.** Serve `xrp-ledger.toml` from static hosting elsewhere, never from the validator host. See [Provide domain verification](../server-modes/validator.md#6-provide-domain-verification).
- **Run nothing else on the address.** No web server, no explorer, no dashboard. If the host must serve a dashboard, serve it on a private network only.
- **Don't publish the IP** in configuration you share, in screenshots, or in support requests. Sanitize first.
- **Carrier-grade NAT isn't a privacy or security layer.** It also blocks inbound peering, which matters if you want to contribute peer capacity.

## Ports and admin access

A validator serves no clients. Apply the rules for client ports anyway, because the ports exist:

- **Admin commands on loopback or a private network only.** The `admin` setting in a `[port_*]` stanza grants privileged commands (`stop`, `sign`, `sign-and-submit`, `log_level`, peer management) to the listed addresses. A port bound to a public interface with `admin` enabled is the catastrophic pattern. Safe patterns: bind admin ports to `127.0.0.1`, or reach them over a private network or mesh VPN.
- **No public WebSocket or JSON-RPC.** The [Validator](../server-modes/validator.md) page's warning stands: a validator shouldn't be accessible to the public in any form.
- **Peer port only where the topology needs it.** Private-behind-proxies and outbound-only validators need no inbound peer port at all.
- **Audit what is actually listening.** Compare `ss -lntup` against your firewall rules. The packaged configuration binds gRPC and the admin ports to loopback; exposure comes from edited or generated configurations, for example a `[port_grpc]` bound to `0.0.0.0` with no firewall rule covering it.
- **Docker-published ports bypass `ufw`.** Docker writes its own packet filter rules, so a port published with `-p 6006:6006` is reachable even when the host firewall says it is closed. Publish admin ports on `127.0.0.1` only (`-p 127.0.0.1:6006:6006`), and filter any other published port in the `DOCKER-USER` chain.

## Harden the host

The validator should be a dedicated host. On shared hardware, the common cause of a halted validator is another process competing for disk or memory. If you must share, cap the other workloads with `systemd` resource limits and give the validator unit `OOMScoreAdjust=-900` so the kernel kills the co-tenant first.

A checklist that matches what long-running operators actually do:

- SSH with keys only, no root login, and an allowlist or a mesh VPN so SSH isn't reachable from the internet at all. A non-standard port and an automatic ban tool reduce log noise; they aren't the security. On a cloud provider you can remove SSH altogether and use the provider's identity-authenticated, logged session service, leaving the peer port as the host's only inbound port.
- Deny all inbound by default. Open only SSH (to your allowlist) and the peer port if your topology has one.
- Automatic security updates for the operating system, with an alert when a reboot is pending so kernel updates don't sit unapplied. Manual updates for `xrpld`.
- Minimal packages. Nothing on the host that isn't needed to validate.
- `xrpld.cfg` owned by `root:xrpld` with mode `0640`: readable by the service user, not by others. Not `0600`, which leaves the `xrpld` service unable to read a root-owned file. `validators.txt` holds no secrets and can stay `0644`.
- The packaged service runs as an unprivileged `xrpld` user with `NoNewPrivileges`, `ProtectSystem=full`, `ProtectHome`, `PrivateTmp`, `SystemCallArchitectures=native`, and a five-minute stop timeout. Don't weaken the unit, and check that no drop-in has.
- Verify the package signing key by fingerprint when you add the repository. The [installation steps](../../installation/install-xrpld-on-ubuntu.md) show the expected fingerprint.
- After the rename from `rippled` to `xrpld`, confirm every drop-in, limit, and hook moved to the new unit. Security that decays quietly is the failure mode: verify enforcement, don't trust the file.
- Network gear feeding the validator: automatic firmware updates off, applied manually in a quiet window.
- Log rotation configured on day one. A full disk is an outage.

A complete open-source implementation of the private-behind-proxies topology on AWS (Terraform and Ansible, isolated subnet, secrets handling) is published at [commonprefix/xrpl-validator](https://github.com/commonprefix/xrpl-validator). Community-maintained, not endorsed by the XRPL Foundation or Ripple; review anything before you run it.

## See also

- **Concepts:**
    - [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)
    - [Negative UNL](../../../concepts/consensus-protocol/negative-unl.md)
- **Tutorials:**
    - [Validator](../server-modes/validator.md)
    - [Validator Best Practices](../best-practices/validator.md)
    - [Configure a Private Server](../peering/configure-a-private-server.md)
    - [Cluster xrpld Servers](../peering/cluster-xrpld-servers.md)
    - [Configure the Peer Crawler](../peering/configure-the-peer-crawler.md)
    - [Migrate from rippled to xrpld](../../installation/migrate-to-xrpld.md)
- **References:**
    - [Validator Keys Tool Guide](https://github.com/ripple/validator-keys-tool/blob/master/doc/validator-keys-tool-guide.md)
    - [validator_info method][]
    - [peers method][]
    - [manifest method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

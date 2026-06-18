---
seo:
    description: Migrate a node operator's installation from the rippled package to the renamed xrpld package introduced in 3.2.0.
labels:
  - Core Server
---
# Migrate from rippled to xrpld

As part of [XLS-0095](https://xls.xrpl.org/xls/XLS-0095-rename-rippled-to-xrpld.html), the core server binary was renamed from `rippled` to `xrpld`, and its config file from `rippled.cfg` to `xrpld.cfg`. {% badge href="https://xrpl.org/blog/2026/xrpld-3.2.0" %}New in: xrpld 3.2.0{% /badge %}

This page describes how to migrate a node from `rippled` to `xrpld`, upgrading from 3.1.3 to 3.2.0.


## Prerequisites

Before you migrate:

- **Update the package-signing key.** The GPG key used to sign the `.deb` and `.rpm` packages changed earlier this year. For Debian-based distros, follow steps 1-5 of the [Ubuntu or Debian installation guide](install-xrpld-on-ubuntu.md) to update it. For RHEL-based distros, the package manager fetches the new key for you.
- **Update your installed packages.** On Debian-based systems, run:

    ```sh
    sudo apt-get update
    sudo apt-get upgrade
    ```

    On RHEL-based systems, run:

    ```sh
    sudo yum update
    ```

    On RHEL 8 and 9, `dnf` and `yum` are interchangeable - use whichever you prefer.


## Migration Steps

These steps assume a typical Debian/Ubuntu `rippled` install with:

- Binary config at `/opt/ripple/etc/rippled.cfg`
- Validator config at `/opt/ripple/etc/validators.txt`

Run these steps on each host you are migrating and adjust the paths to match your environment.

### 1. Back up

{% admonition type="warning" name="Back up first - or risk losing your config and data" %}
`apt-get remove` is *designed* to leave your config and data in place, but one wrong flag or path - `purge` instead of `remove`, a failed disk, an interrupted run - can irreversibly destroy your config, node identity, and validator keys. Copy the files below to a location **off this host** before you continue.
{% /admonition %}

Back up the following files. In a default install they live here:

**Configuration and identity** (cannot be regenerated - losing these loses your settings and, for validators, your on-ledger identity):

- `/opt/ripple/etc/rippled.cfg` - main server config, including your `[validator_token]` on validators.
- `/opt/ripple/etc/validators.txt` - your trusted validator list (UNL). Skip if your `[validators]` section lives inside `rippled.cfg`.
- `/var/lib/rippled/db/wallet.db` - your node's persistent identity (node keypair) and peer reservations.
- `validator-keys.json` (validators only) - your validator master keys, stored wherever you generated them with `validator-keys-tool` (often kept offline). Without this file you can never renew or rotate your validator token.

**Ledger data** (large, but re-syncable from the network - back up only to skip a long re-sync):

- `/var/lib/rippled/db/nudb/` - the NuDB node store, the bulk of your ledger data.
- `/var/lib/rippled/db/*.db` - the SQLite databases, such as `transaction.db` and `ledger.db`.
- `/var/lib/rippled/db/` - the whole data directory covers all of the above in one step.

**Logs** (optional):

- `/var/log/rippled/debug.log`

{% admonition type="info" name="Find your own paths" %}
The locations above are the defaults. Your real paths are whatever `[database_path]`, `[node_db]`, and `[debug_logfile]` point to in your `rippled.cfg`. If you customized them, back up those locations instead.
{% /admonition %}

Copy the config and identity files into a backup directory:

```sh
sudo mkdir -p /root/rippled-backup
sudo cp /opt/ripple/etc/rippled.cfg     /root/rippled-backup/
sudo cp /opt/ripple/etc/validators.txt  /root/rippled-backup/   # if present
sudo cp /var/lib/rippled/db/wallet.db   /root/rippled-backup/
```

Then copy that directory **off the host**, so a disk failure or a failed migration does not also destroy your backup. For example, pull it to your own machine over SSH:

```sh
# Replace user@your-node with your SSH login and host
scp -r user@your-node:/root/rippled-backup ./rippled-backup
```

{% admonition type="info" name="Optional: full-history and large-history nodes" %}
This is optional. In Step 6, full-history nodes keep their existing data in place, so the ledger store is preserved - not re-downloaded - and a separate snapshot usually isn't needed.

Still, if you have the disk space and any doubt, take a snapshot first as a safety net. Stop the node so the copy is consistent:

```sh
sudo systemctl stop rippled
sudo tar -czf /root/rippled-data-$(hostname).tar.gz -C /var/lib rippled
```

Validators and small-history nodes (a day or so) can skip this either way - they re-sync from the network in minutes.
{% /admonition %}

### 2. Stop and remove rippled

Once your backups are safely off the host, stop the service:

```sh
sudo systemctl stop rippled
```

Then remove the package. For Debian-based distros:

```sh
sudo apt-get remove -y rippled
```

For RHEL-based distros:

```sh
sudo yum remove -y rippled
```

{% admonition type="info" name="remove keeps your config" %}
`apt-get remove` (and `yum remove`) leaves your config and data in place. `apt-get purge` would delete the config, which is why you back up first.
{% /admonition %}

### 3. Install xrpld

For Debian-based distros, run:

```sh
sudo apt-get install -y xrpld
```

For RHEL-based distros, run:

```sh
sudo yum install -y xrpld
```

This installs the `xrpld` binary at `/usr/bin/xrpld`, creates the `xrpld` user and group, and installs a default mainnet config at `/etc/xrpld/xrpld.cfg`. The `xrpld` service starts automatically.

**Important: stop the auto-started service before continuing.** It is running on the default config and writing into a fresh `/var/lib/xrpld/`. Stop it so nothing changes those directories while you restore your config:

```sh
sudo systemctl stop xrpld
```

### 4. Migrate the binary config

Restore the config you backed up in Step 1 into the new `xrpld` location. It already holds your tuning, validators, and peers:

```sh
sudo cp /root/rippled-backup/rippled.cfg /etc/xrpld/xrpld.cfg
```

{% admonition type="info" name="The original also works" %}
Because `apt-get remove` leaves the original in place, `sudo cp /opt/ripple/etc/rippled.cfg /etc/xrpld/xrpld.cfg` also works. Restoring from `/root/rippled-backup` keeps the migration self-contained and independent of the old files surviving.
{% /admonition %}

### 5. Migrate the validators config

If you keep a separate `validators.txt`, restore it from your backup over the package-shipped copy:

```sh
sudo cp /root/rippled-backup/validators.txt /etc/xrpld/validators.txt
```

{% admonition type="info" name="No separate validators.txt?" %}
Some operators keep the `[validators]` and `[validator_token]` sections inside `xrpld.cfg` instead of a separate file. In that case there is nothing to restore here - remove the package-shipped list so it cannot override your embedded section:

```sh
sudo rm /etc/xrpld/validators.txt
```
{% /admonition %}

### 6. Migrate the data directories

There are two scenarios, depending on whether you need to keep your ledger data. Pick the one that matches your node.

#### Re-sync small-history nodes and validators from the network

For validators and nodes that keep only a small window of history (a day or so). Re-syncing from peers takes only minutes, so there is no need to carry the old data across - point `xrpld` at the new default paths so it rebuilds from the network.

Set these paths in `/etc/xrpld/xrpld.cfg` (they match the default config):

```
[node_db]
type=NuDB
path=/var/lib/xrpld/db/nudb

...

[database_path]
/var/lib/xrpld/db

...

[debug_logfile]
/var/log/xrpld/debug.log
```

#### Keep existing data on full-history nodes

For full-history and large-history nodes, where re-downloading the ledger store from peers can take many months to years - a full-history backfill is impractical to rebuild from scratch. The simplest and safest option is to leave your data where it is and hand ownership to the new `xrpld` user. The config you restored in Step 4 already points at `/var/lib/rippled` and `/var/log/rippled`, so no paths need to change:

```sh
sudo chown -R xrpld:xrpld /var/lib/rippled
sudo chown -R xrpld:xrpld /var/log/rippled
```

`xrpld` reads your existing data in place. The empty `/var/lib/xrpld/` the install created stays unused, and you can remove it whenever you like.

{% admonition type="info" name="Prefer the /var/lib/xrpld naming?" %}
Moving the data under the new path is optional and cosmetic - the service runs fine either way. If you do move it, update `[node_db]`, `[database_path]`, and `[debug_logfile]` in `/etc/xrpld/xrpld.cfg` to the `/var/lib/xrpld` values shown above, so the config matches where the data now lives. A config that points at the old path after the data has moved is the most common way to break the node on restart.
{% /admonition %}

### 7. Restart xrpld

You stopped `xrpld` in Step 3 to migrate safely. Bring it up now so it loads your restored config and reads your data with the right ownership:

```sh
sudo systemctl daemon-reload
sudo systemctl restart xrpld
```

### 8. Verify the server

Query `server_info` on your server's admin port to check sync status. The port is `5005` by default; if yours differs, check `[port_rpc_admin_local]` in `/etc/xrpld/xrpld.cfg`. A re-sync usually completes within 20 minutes, depending on how long the service was stopped and your database size.

```sh
curl -s localhost:5005 -d '{"method":"server_info"}' | \
  grep -oP '"(server_state|complete_ledgers)":"[^"]+"'
```

In a healthy server, `server_state` reads `full` (or `proposing` for validators), and `complete_ledgers` shows a contiguous range. If `server_state` is `disconnected`, or stays `connected` without progress after a few minutes, check:

- `journalctl -u xrpld -n 200` for startup errors.
- The `debug_logfile` (default `/var/log/xrpld/debug.log`) for runtime errors.
- That the paths in `/etc/xrpld/xrpld.cfg` exist and are owned by `xrpld:xrpld`.


## Post-Migration Tasks

After switching to `xrpld`, update anything that still references the old paths or service name:

- **Service references:** Update any tooling that runs `systemctl ... rippled` to use `xrpld`.
- **Log paths:** Repoint log shippers (such as alloy, vector, fluentbit, or filebeat), logrotate configs, and rotation cron jobs to use `/var/log/xrpld/` instead of `/var/log/rippled/`.
- **Metrics and monitoring:** Update Prometheus exporters and process-name matchers to recognize `xrpld`, and fix any Grafana dashboards with hardcoded process or service names.
- **Coredump handling:** Update coredump filename patterns and analysis scripts to include `xrpld` and the new binary path `/usr/bin/xrpld`.
- **Cron jobs:** Update any job that touches the data directory, such as online delete, to use the new paths.
- **Ownership and ACLs:** Update scripts that ran as `rippled:ripple` to run as `xrpld:xrpld`, or adjust group memberships to read the new paths.
- **Backup jobs:** Repoint snapshot and backup tooling to the new data path.
- **Firewalls and security groups:** The rename doesn't change port assignments, though a recent change set the example config's default port to the IANA-registered XRPL port `2459`. If you harden file permissions, account for the new user and group ownership.


## See Also

- **Troubleshooting:**
    - [xrpld Server Won't Start](../troubleshooting/server-wont-start.md)
    - [Understanding Log Messages](../troubleshooting/understanding-log-messages.md)
- **Configuration:**
    - [Configure xrpld](../configuration/index.md)
    - [Run xrpld as a Validator](../configuration/server-modes/run-xrpld-as-a-validator.md)
- **Installation:**
    - [Update Manually on Ubuntu or Debian](update-xrpld-manually-on-ubuntu.md)
    - [Update Manually on Red Hat Enterprise Linux](update-xrpld-manually-on-rhel.md)
- **References:**
    - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

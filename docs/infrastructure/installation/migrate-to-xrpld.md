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


## Migration Steps

These steps assume a typical Debian/Ubuntu `rippled` install with:

- Binary config at `/opt/ripple/etc/rippled.cfg`
- Validator config at `/opt/ripple/etc/validators.txt`

Run these steps on each host you are migrating and adjust the paths to match your environment.

### 1. Stop and remove rippled

Back up your config and data files (for example, `wallet.db`). Then stop the service and remove the package:

```sh
sudo systemctl stop rippled
sudo apt-get remove -y rippled
```

{% admonition type="info" name="Note" %}`apt-get remove` leaves the config files and your data directory in place.{% /admonition %}

### 2. Install xrpld

For Debian-based distros, run:

```sh
sudo apt-get install -y xrpld
```

For RHEL-based distros, run:

```sh
sudo yum install xrpld
```

This installs the `xrpld` binary at `/usr/bin/xrpld`, creates the `xrpld` user and group, and installs a default mainnet config at `/etc/xrpld/xrpld.cfg`. The `xrpld` service starts automatically.

### 3. Migrate the binary config

Your existing `rippled.cfg` already contains your tuning, validators, and peers. Copy it to the new location:

```sh
sudo cp /opt/ripple/etc/rippled.cfg /etc/xrpld/xrpld.cfg
```

### 4. Migrate the validators config

If you keep a separate `validators.txt`, replace the package-shipped copy with yours:

```sh
sudo cp /opt/ripple/etc/validators.txt /etc/xrpld/validators.txt
```

{% admonition type="info" name="Note" %}Some operators do not have a separate `validators.txt` file and instead have the `[validators]` and `[validator_xxx]` sections embedded within the `xrpld.cfg` file. In that case, delete the generic config file instead.{% /admonition %}

### 5. Migrate the data directories

Follow the scenario that matches your setup.

#### Connect to the XRPL only

Update the following paths in `/etc/xrpld/xrpld.cfg`. These are the same values that appear in the default config.

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

#### Keep your existing data

If your data is stored in `/var/lib/rippled/` and your logs in `/var/log/rippled/`, apply the path updates above. Once complete, move the directories to `/var/lib/xrpld/` and `/var/log/xrpld/`, respectively:

```sh
sudo mv /var/lib/rippled /var/lib/xrpld
sudo chown -R xrpld:xrpld /var/lib/xrpld

sudo mv /var/log/rippled /var/log/xrpld
sudo chown -R xrpld:xrpld /var/log/xrpld
```

If your data or logs are in a non-default location, you only need to update ownership:

```sh
sudo chown -R xrpld:xrpld [path to your data directory]
sudo chown -R xrpld:xrpld [path to your log directory]
```

### 6. Start xrpld

```sh
sudo systemctl daemon-reload
sudo systemctl start --now xrpld
```

### 7. Verify the server

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

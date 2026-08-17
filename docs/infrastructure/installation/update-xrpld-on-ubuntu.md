---
seo:
    description: Upgrade xrpld on Ubuntu or Debian Linux.
labels:
  - Core Server
  - Security
---
# Upgrade on Ubuntu or Debian

This page describes how to keep `xrpld` up to date on Ubuntu or Debian Linux. You can run an upgrade immediately when a new release is available, or configure automatic package upgrades with `unattended-upgrades`.

These instructions assume you have already [installed `xrpld` on a supported version of Ubuntu or Debian using Ripple's `deb` package](install-xrpld-on-ubuntu.md).

{% admonition type="info" name="Note" %}Upgrading the package does not restart the `xrpld` service. The server continues to run the old version until you restart it, so plan a restart after package upgrades are installed.{% /admonition %}


## Immediate Upgrade

To upgrade `xrpld` now, complete the following steps:

1. Update package lists:

    ```sh
    sudo apt -y update
    ```

2. Upgrade the `xrpld` package:

    ```sh
    sudo apt -y install --only-upgrade xrpld
    ```

3. Reload the `systemd` unit files:

    ```sh
    sudo systemctl daemon-reload
    ```

4. Restart the `xrpld` service:

    ```sh
    sudo systemctl restart xrpld.service
    ```


## Automatic Upgrades

On Ubuntu and Debian, use `unattended-upgrades` to install package upgrades from the Ripple `deb` repository. This configuration follows the repository channel you select, such as `stable`, `unstable`, or `develop`.

1. Install `unattended-upgrades`:

    ```sh
    sudo apt -y update
    sudo apt -y install unattended-upgrades
    ```

2. Choose what `unattended-upgrades` is allowed to upgrade.

    Create `/etc/apt/apt.conf.d/51xrpld-auto-upgrade` using one of the following configurations. You can control the upgrade scope from this file; you don't need to edit the default unattended-upgrades config.

    To upgrade only `xrpld`, use this configuration. The `#clear` directives remove the default unattended-upgrades origins from other APT config files, so this automatic upgrade configuration does not also install operating system upgrades.

    {% admonition type="warning" name="Important" %}The `#clear` lines are required if you want to upgrade only `xrpld`. They look like comments, but in APT configuration, `#clear` is a directive. Without those directives, unattended-upgrades can install upgrades for packages from any allowed origin configured on the system. On many systems, the default configuration also allows operating system security upgrades.{% /admonition %}

    ```sh
    # Keep the #clear lines below. In APT config, #clear is a directive, not a comment.
    cat <<'EOF' | sudo tee /etc/apt/apt.conf.d/51xrpld-auto-upgrade
    #clear Unattended-Upgrade::Allowed-Origins;
    #clear Unattended-Upgrade::Origins-Pattern;
    Unattended-Upgrade::Origins-Pattern:: "site=repos.ripple.com,component=stable";
    Unattended-Upgrade::Package-Whitelist:: "xrpld";
    EOF
    ```

    To let `unattended-upgrades` upgrade `xrpld` and any other packages from origins that are already allowed by the system, omit the `#clear` directives and the package whitelist:

    ```sh
    cat <<'EOF' | sudo tee /etc/apt/apt.conf.d/51xrpld-auto-upgrade
    Unattended-Upgrade::Origins-Pattern:: "site=repos.ripple.com,component=stable";
    EOF
    ```

    In either configuration, if you installed `xrpld` from the `unstable` or `develop` channel, replace `stable` with that channel name.

    To check the merged configuration, run:

    ```sh
    apt-config dump | grep -E 'Unattended-Upgrade::(Allowed-Origins|Origins-Pattern|Package-Whitelist)'
    ```

3. Make sure periodic package-list refreshes and unattended upgrades are enabled in `/etc/apt/apt.conf.d/20auto-upgrades`:

    ```txt
    APT::Periodic::Update-Package-Lists "1";
    APT::Periodic::Unattended-Upgrade "1";
    ```

4. Check the timers that run package-list refreshes and unattended upgrades:

    ```sh
    systemctl list-timers apt-daily.timer apt-daily-upgrade.timer
    ```

5. Optional: test or run unattended-upgrades immediately.

    To check what would happen without installing anything, run:

    ```sh
    sudo unattended-upgrade --dry-run --debug
    ```

    In the debug output, `Allowed origins` shows which repositories `unattended-upgrades` can use, and the `applying set` lines show the packages it would actually install. If you used the `xrpld`-only configuration above, `Allowed origins` should include only the Ripple repository and the `applying set` lines should include only `xrpld`.

    If you filter the debug output, include `applying set` in your filter so you don't hide packages that do not include `xrpld` in their names:

    ```sh
    sudo unattended-upgrade --dry-run --debug 2>&1 | \
        grep -iE 'allowed origins|initial whitelist|packages that will be upgraded|applying set|left to upgrade'
    ```

    To install matching upgrades now, run the same command without `--dry-run`:

    ```sh
    sudo unattended-upgrade --debug
    ```

6. After an upgrade is installed, restart `xrpld` during a maintenance window:

    ```sh
    sudo systemctl restart xrpld.service
    ```


## One-Time Automatic Upgrade

To run an automatic upgrade once, 30 minutes from now, use `systemd-run`:

```sh
sudo systemd-run \
    --on-active=30m \
    --unit=xrpld-upgrade-once \
    /usr/bin/unattended-upgrade --debug
```

This uses the `unattended-upgrades` configuration from the automatic upgrade steps, including the `xrpld` package whitelist. If an eligible `xrpld` upgrade is available, this command installs it.

To check when the one-time timer runs, use:

```sh
systemctl list-timers xrpld-upgrade-once.timer
```

To check the output after it runs, use:

```sh
journalctl -u xrpld-upgrade-once.service
```

After the upgrade runs, restart `xrpld` during a maintenance window if a new package version was installed.


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.md)
    - [Troubleshoot xrpld](../troubleshooting/index.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

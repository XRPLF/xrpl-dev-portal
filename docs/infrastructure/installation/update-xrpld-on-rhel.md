---
seo:
    description: Upgrade xrpld on Red Hat Enterprise Linux.
labels:
  - Core Server
  - Security
---
# Upgrade on Red Hat Enterprise Linux

This page describes how to keep `xrpld` up to date on Red Hat Enterprise Linux. You can run an upgrade immediately when a new release is available, or configure automatic package upgrades with `systemd`.

These instructions assume you have already [installed `xrpld` on a supported version of Red Hat Enterprise Linux using Ripple's `rpm` package distribution](install-xrpld-on-rhel.md).

{% admonition type="info" name="Note" %}Upgrading the package does not restart the `xrpld` service. The server continues to run the old version until you restart it, so plan a restart after package upgrades are installed.{% /admonition %}


## Immediate Upgrade

To upgrade `xrpld` now, complete the following steps:

1. Upgrade to the latest `xrpld` package:

    ```sh
    sudo dnf -y --refresh upgrade xrpld
    ```

    This upgrade procedure leaves your existing config files in place.

2. Reload the `systemd` unit files:

    ```sh
    sudo systemctl daemon-reload
    ```

3. Restart the `xrpld` service:

    ```sh
    sudo systemctl restart xrpld.service
    ```


## Automatic Upgrades

On RHEL, you can use a `systemd` service and timer to install package upgrades regularly. The service follows the Ripple RPM repository channel you configured when you installed `xrpld`, such as `stable`, `unstable`, or `develop`.

1. Create a service to upgrade the `xrpld` package:

    ```sh
    cat <<'EOF' | sudo tee /etc/systemd/system/xrpld-upgrade.service
    [Unit]
    Description=Install xrpld package upgrades
    Wants=network-online.target
    After=network-online.target

    [Service]
    Type=oneshot
    ExecStart=/usr/bin/dnf -y --refresh upgrade xrpld
    TimeoutStartSec=30min
    EOF
    ```

2. Create a timer to run the upgrade service daily:

    ```sh
    cat <<'EOF' | sudo tee /etc/systemd/system/xrpld-upgrade.timer
    [Unit]
    Description=Daily xrpld package upgrade

    [Timer]
    OnCalendar=daily
    RandomizedDelaySec=4h
    Persistent=true

    [Install]
    WantedBy=timers.target
    EOF
    ```

    The randomized delay helps avoid too many servers contacting package repositories at the same time.

3. Enable the timer:

    ```sh
    sudo systemctl daemon-reload
    sudo systemctl enable --now xrpld-upgrade.timer
    ```

4. Check when the timer runs next:

    ```sh
    systemctl list-timers xrpld-upgrade.timer
    ```

5. After an upgrade is installed, restart `xrpld` during a maintenance window:

    ```sh
    sudo systemctl restart xrpld.service
    ```


## One-Time Automatic Upgrade

To run an automatic upgrade once, 30 minutes from now, use `systemd-run`:

```sh
sudo systemd-run \
    --on-active=30m \
    --unit=xrpld-upgrade-once \
    systemctl start xrpld-upgrade.service
```

If an eligible `xrpld` upgrade is available, this command installs it. After the upgrade runs, restart `xrpld` during a maintenance window if a new package version was installed.


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

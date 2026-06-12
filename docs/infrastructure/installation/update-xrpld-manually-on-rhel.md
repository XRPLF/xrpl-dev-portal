---
seo:
    description: Manually update xrpld on CentOS or Red Hat Enterprise Linux.
labels:
  - Core Server
  - Security
---
# Update Manually on Red Hat Enterprise Linux

This page describes how to update manually to the latest release of `xrpld` on Red Hat Enterprise Linux. You can also set up [automatic updates](update-xrpld-automatically-on-linux.md).

These instructions assume you have already [installed `xrpld` on a supported version of Red Hat Enterprise Linux using Ripple's `rpm` package distribution](install-xrpld-on-rhel.md). If you are upgrading from `xrpld` 1.6.x or older, remove it and perform a fresh install instead.

{% admonition type="success" name="Tip" %}To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `xrpld` package. This script should be run as a `sudo` user.{% /admonition %}

To update manually, complete the following steps:

1. Download and install the latest `xrpld` package:

    ```
    sudo yum update xrpld
    ```

    This update procedure leaves your existing config files in place.

2. Reload the `systemd` unit files:

    ```
    sudo systemctl daemon-reload
    ```

3. Restart the `xrpld` service:

    ```
    sudo service xrpld restart
    ```


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Troubleshoot xrpld](../troubleshooting/index.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

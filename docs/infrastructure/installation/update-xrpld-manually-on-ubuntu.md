---
seo:
    description: Manually update xrpld on Ubuntu Linux.
labels:
  - Core Server
  - Security
---
# Update Manually on Ubuntu or Debian

This page describes how to manually update to the latest release of `xrpld` on Ubuntu Linux. You can also set up [automatic updates](update-xrpld-automatically-on-linux.md).

These instructions assume you have already [installed `xrpld` on a supported version of Ubuntu using Ripple's `deb` package](install-xrpld-on-ubuntu.md). If you are upgrading from `xrpld` 1.6.x or older, remove it and perform a fresh install instead.

{% admonition type="success" name="Tip" %}To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `xrpld` package and is compatible with Ubuntu and Debian. This script should be run as a `sudo` user.{% /admonition %}

To update manually, complete the following steps:

1. Update repositories:

    ```
    sudo apt -y update
    ```

2. Upgrade the `xrpld` package:

    ```
    sudo apt -y upgrade xrpld
    ```

3. Reload the `systemd` unit files:

    ```
    sudo systemctl daemon-reload
    ```

4. Restart the `xrpld` service:

    ```
    sudo systemctl restart xrpld
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

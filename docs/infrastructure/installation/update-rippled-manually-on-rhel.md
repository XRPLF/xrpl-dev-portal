---
seo:
    description: Manually update rippled on CentOS or Red Hat Enterprise Linux.
labels:
  - Core Server
  - Security
---
# Update Manually on Red Hat Enterprise Linux

This page describes how to update manually to the latest release of `rippled` on Red Hat Enterprise Linux. You can also set up [automatic updates](update-rippled-automatically-on-linux.md).

These instructions assume you have already [installed `rippled` on a supported version of Red Hat Enterprise Linux using Ripple's `rpm` package distribution](install-rippled-on-rhel.md). If you are upgrading from `rippled` 1.6.x or older, remove it and perform a fresh install instead.

{% admonition type="success" name="Tip" %}To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package. This script should be run as a `sudo` user.{% /admonition %}

To update manually, complete the following steps:

1. Download and install the latest `rippled` package:

    ```
    sudo yum update rippled
    ```

    This update procedure leaves your existing config files in place.

2. Reload the `systemd` unit files:

    ```
    sudo systemctl daemon-reload
    ```

3. Restart the `rippled` service:

    ```
    sudo service rippled restart
    ```


## See Also

- **Concepts:**
    - [The `rippled` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Troubleshoot rippled](../troubleshooting/index.md)
- **References:**
    - [rippled API Reference](../../references/http-websocket-apis/index.md)
        - [`rippled` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

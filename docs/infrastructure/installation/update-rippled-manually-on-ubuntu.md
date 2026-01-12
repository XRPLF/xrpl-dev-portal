---
seo:
  description: Manually update rippled on Ubuntu Linux.
labels:
  - Core Server
  - Security
---

# Update Manually on Ubuntu or Debian

This page describes how to manually update to the latest release of `rippled` on Ubuntu Linux. You can also set up [automatic updates](update-rippled-automatically-on-linux.md).

These instructions assume you have already [installed `rippled` on a supported version of Ubuntu using Ripple's `deb` package](install-rippled-on-ubuntu.md). If you are upgrading from `rippled` 1.6.x or older, remove it and perform a fresh install instead.

{% admonition type="success" name="Tip" %}To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package and is compatible with Ubuntu and Debian. This script should be run as a `sudo` user.{% /admonition %}

To update manually, complete the following steps:

1. Update repositories:

   ```
   sudo apt -y update
   ```

2. Upgrade the `rippled` package:

   ```
   sudo apt -y upgrade rippled
   ```

3. Reload the `systemd` unit files:

   ```
   sudo systemctl daemon-reload
   ```

4. Restart the `rippled` service:

   ```
   sudo systemctl restart rippled
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

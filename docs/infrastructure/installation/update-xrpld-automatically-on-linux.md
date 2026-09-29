---
seo:
    description: Set up automatic updates for xrpld on Linux.
labels:
  - Core Server
  - Security
---
# Update Automatically on Linux

On Linux, you can set up `xrpld` to automatically upgrade to the latest version with a one-time `cron` configuration.

These instructions assume you have already installed `xrpld` from a package on [Red Hat Enterprise Linux](install-xrpld-on-rhel.md), [Ubuntu Linux, or Debian Linux](install-xrpld-on-ubuntu.md).

To set up automatic updates, complete the following steps:

1. Check that `/opt/ripple/etc/update-rippled-cron` exists. If it does not, update manually ([Red Hat](update-xrpld-manually-on-rhel.md) or [Ubuntu/Debian](update-xrpld-manually-on-ubuntu.md)).

2. Create a symlink in your `cron.d` folder to the `/opt/ripple/etc/update-rippled-cron` config file:

    ```
    sudo ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
    ```

    This configuration runs a script to update the installed `xrpld` package within an hour of each new release. To avoid network instability from too many servers updating at the same time, this script does not automatically restart the server, so it continues to run the old version until it restarts.

3. **Whenever a new release comes out,** you must manually restart the `xrpld` service to switch to the updated software.

    ```
    sudo systemctl restart xrpld.service
    ```

{% admonition type="warning" name="Caution" %}The `xrpld` packages published at `packages.xrplf.org` do not include `update-rippled-cron` or its script. If the file exists on your server, it came from an older package; remove the symlink from `/etc/cron.d/` and update manually ([Red Hat](update-xrpld-manually-on-rhel.md) or [Ubuntu/Debian](update-xrpld-manually-on-ubuntu.md)) so that upgrades come from `packages.xrplf.org`.{% /admonition %}


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

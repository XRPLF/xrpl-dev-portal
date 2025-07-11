---
seo:
    description: Set up automatic updates for rippled on Linux.
labels:
  - Core Server
  - Security
---
# Update Automatically on Linux

On Linux, you can set up `rippled` to automatically upgrade to the latest version with a one-time `cron` configuration.

These instructions assume you have already installed `rippled` from a package on [Red Hat Enterprise Linux](install-rippled-on-rhel.md), [Ubuntu Linux, or Debian Linux](install-rippled-on-ubuntu.md).

To set up automatic updates, complete the following steps:

1. Check that `/opt/ripple/etc/update-rippled-cron` exists. If it does not, update manually ([Red Hat](update-rippled-manually-on-rhel.md) or [Ubuntu/Debian](update-rippled-manually-on-ubuntu.md)).

2. Create a symlink in your `cron.d` folder to the `/opt/ripple/etc/update-rippled-cron` config file:

    ```
    sudo ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
    ```

    This configuration runs a script to update the installed `rippled` package within an hour of each new release. To avoid network instability from too many servers updating at the same time, this script does not automatically restart the server, so it continues to run the old version until it restarts.

3. **Whenever a new release comes out,** you must manually restart the `rippled` service to switch to the updated software.

    ```
    sudo systemctl restart rippled.service
    ```

{% admonition type="warning" name="Caution" %}In the future, it is possible that changes to Ripple's repositories may require manual intervention to update the URLs where your script searches for updates. Stay tuned to the [XRP Ledger Blog](/blog/) or the [ripple-server mailing list](https://groups.google.com/forum/#!forum/ripple-server) for announcements on any required changes.{% /admonition %}


## See Also

- **Concepts:**
    - [The `rippled` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.md)
    - [Troubleshoot rippled](../troubleshooting/index.md)
- **References:**
    - [rippled API Reference](../../references/http-websocket-apis/index.md)
        - [`rippled` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

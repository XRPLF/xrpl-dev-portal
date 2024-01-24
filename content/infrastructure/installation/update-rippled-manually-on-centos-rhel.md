---
html: update-rippled-manually-on-centos-rhel.html
parent: install-rippled.html
seo:
    description: Manually update rippled on CentOS or Red Hat Enterprise Linux.
labels:
  - Core Server
  - Security
---
# Update Manually on CentOS/Red Hat

This page describes how to update manually to the latest release of `rippled` on CentOS or Red Hat Enterprise Linux. Ripple recommends setting up [automatic updates](update-rippled-automatically-on-linux.md) instead, where possible.

These instructions assume you have already [installed `rippled` from the `yum` repository](install-rippled-on-centos-rhel-with-yum.md).

**Tip:** To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package. This script should be run as a `sudo` user.

To update manually, complete the following steps:

1. If you are upgrading to `rippled` 1.7.0 from an earlier version, re-add the repository to get Ripple's updated GPG key. Otherwise, skip this step:

    ```
    $ cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    REPOFILE
    ```

1. Download and install the latest `rippled` package:

    ```
    $ sudo yum update rippled
    ```

    This update procedure leaves your existing config files in place.

2. Reload the `systemd` unit files:

    ```
    $ sudo systemctl daemon-reload
    ```

3. Restart the `rippled` service:

    ```
    $ sudo service rippled restart
    ```


## See Also

- **Concepts:**
    - [The `rippled` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [`rippled` v1.3.x Migration Instructions](rippled-1-3-migration-instructions.md) <!-- Note: remove when versions older than v1.3 are basically extinct -->
    - [Troubleshoot rippled](../troubleshooting/index.md)
- **References:**
    - [rippled API Reference](../../references/http-websocket-apis/index.md)
        - [`rippled` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/_snippets/common-links.md" /%}

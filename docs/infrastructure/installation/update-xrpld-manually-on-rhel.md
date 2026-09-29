---
seo:
    description: Manually update xrpld on CentOS or Red Hat Enterprise Linux.
labels:
  - Core Server
  - Security
---
# Update Manually on Red Hat Enterprise Linux

This page describes how to update manually to the latest release of `xrpld` on Red Hat Enterprise Linux. You can also set up [automatic updates](update-xrpld-automatically-on-linux.md).

These instructions assume you have already [installed `xrpld` on a supported version of Red Hat Enterprise Linux using the XRP Ledger Foundation's `rpm` package](install-xrpld-on-rhel.md). If you are still running `rippled` (3.1.3 or older), follow [Migrate from rippled to xrpld](migrate-to-xrpld.md) instead.

To update manually, complete the following steps:

1. Download the XRP Ledger Foundation's package-signing key and check its fingerprint:

    ```
    curl -fsS https://packages.xrplf.org/xrplf.asc -o /tmp/xrplf.asc
    gpg --show-keys /tmp/xrplf.asc
    ```

    The output should be:

    ```
    pub   rsa4096 2026-08-18 [SC]
          B655416741221F780FBCFBC9AA84D41A11D29FA9
    uid                      XRPLF Packages <distribution@xrplf.org>
    ```

2. Import the key:

    ```
    sudo rpm --import /tmp/xrplf.asc
    ```

3. Add the XRP Ledger Foundation repository:

    ```
    cat << REPOFILE | sudo tee /etc/yum.repos.d/xrplf.repo
    [xrplf]
    baseurl=https://packages.xrplf.org/repository/rpm-stable/x86_64/
    gpgkey=https://packages.xrplf.org/xrplf.asc
    gpgcheck=1
    REPOFILE
    ```

4. Download and install the latest `xrpld` package:

    ```
    sudo yum update xrpld
    ```

    This update procedure leaves your existing config files in place.

5. Reload the `systemd` unit files:

    ```
    sudo systemctl daemon-reload
    ```

6. Restart the `xrpld` service:

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

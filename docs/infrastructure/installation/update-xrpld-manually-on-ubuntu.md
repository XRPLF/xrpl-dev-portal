---
seo:
    description: Manually update xrpld on Ubuntu Linux.
labels:
  - Core Server
  - Security
---
# Update Manually on Ubuntu or Debian

This page describes how to manually update to the latest release of `xrpld` on Ubuntu Linux. You can also set up [automatic updates](update-xrpld-automatically-on-linux.md).

These instructions assume you have already [installed `xrpld` on a supported version of Ubuntu using the XRP Ledger Foundation's `deb` package](install-xrpld-on-ubuntu.md). If you are still running `rippled` (3.1.3 or older), follow [Migrate from rippled to xrpld](migrate-to-xrpld.md) instead.

To update manually, complete the following steps:

1. Add the XRP Ledger Foundation's package-signing key:

    ```
    sudo install -m 0755 -d /etc/apt/keyrings && \
        sudo wget -qO /etc/apt/keyrings/xrplf.asc https://packages.xrplf.org/xrplf.asc
    ```

2. Check the fingerprint of the key:

    ```
    gpg --show-keys /etc/apt/keyrings/xrplf.asc
    ```

    The output should be:

    ```
    pub   rsa4096 2026-08-18 [SC]
          B655416741221F780FBCFBC9AA84D41A11D29FA9
    uid                      XRPLF Packages <distribution@xrplf.org>
    ```

3. Add the XRP Ledger Foundation repository:

    ```
    echo "deb [signed-by=/etc/apt/keyrings/xrplf.asc] https://packages.xrplf.org/repository/deb-stable any main" | \
        sudo tee /etc/apt/sources.list.d/xrplf.list
    ```

4. Update repositories:

    ```
    sudo apt -y update
    ```

5. Upgrade the `xrpld` package. If `apt` asks what to do about `xrpld.cfg`, press Enter to keep your current file:

    ```
    sudo apt -y upgrade xrpld
    ```

6. Reload the `systemd` unit files:

    ```
    sudo systemctl daemon-reload
    ```

7. Restart the `xrpld` service:

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

---
html: install-xrpld-on-ubuntu.html
parent: install-xrpld.html
seo:
    description: Install a precompiled xrpld binary on Ubuntu Linux.
labels:
  - Core Server
---
# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `xrpld` on **Ubuntu Linux**, using a binary that has been compiled and published by the XRP Ledger Foundation as a `deb` package.

Currently, **Ubuntu 22.04 and Ubuntu 24.04 on x86_64 processors** have received the highest level of support and testing. Packages are also available for **Debian Linux 12 Bookworm**. You may be able to adapt these instructions to other Linux distributions that also use the `apt` package manager, but other configurations are not officially supported.


## Prerequisites

Before you install `xrpld`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Update repositories:

    ```
    sudo apt -y update
    ```

2. Install utilities:

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. Add the XRP Ledger Foundation's package-signing GPG key to your list of trusted keys:

    ```
    sudo install -m 0755 -d /etc/apt/keyrings && \
        sudo wget -qO /etc/apt/keyrings/xrplf.asc https://packages.xrplf.org/xrplf.asc
    ```

4. Check the fingerprint of the newly-added key:

    ```
    gpg --show-keys /etc/apt/keyrings/xrplf.asc
    ```

    The output should be:

    ```
    pub   rsa4096 2026-08-18 [SC]
          B655416741221F780FBCFBC9AA84D41A11D29FA9
    uid                      XRPLF Packages <distribution@xrplf.org>
    ```

    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the second line, starting with `B655`.)

5. Add the XRP Ledger Foundation repository:

    ```
    echo "deb [signed-by=/etc/apt/keyrings/xrplf.asc] https://packages.xrplf.org/repository/deb-stable any main" | \
        sudo tee /etc/apt/sources.list.d/xrplf.list
    ```

    The same line applies to every supported Ubuntu and Debian version; the suite is `any`, not your release's codename.

    If you want access to development or pre-release versions of `xrpld`, replace `deb-stable` with one of the following:

    - `deb-rc` - Release candidates
    - `deb-beta` - Beta builds
    - `deb-develop` - Every push to the `develop` branch

    {% admonition type="danger" name="Warning" %}Channels other than `stable` may be broken at any time. Do not use these builds for production servers.{% /admonition %}

6. Update the package index to include the new repository and install `xrpld`.

    ```
    sudo apt -y update && sudo apt -y install xrpld
    ```

7. Check the status of the `xrpld` service:

    ```
    systemctl status xrpld.service
    ```

    The `xrpld` service should start automatically. If not, you can start it manually:

    ```
    sudo systemctl start xrpld.service
    ```

8. Optional: allow `xrpld` to bind to privileged ports.

    This allows you to serve incoming API requests on port 80 or 443. (If you want to do so, you must also update the config file's port settings.)

    ```
    sudo setcap 'cap_net_bind_service=+ep' /usr/bin/xrpld
    ```

9. Optional: configure core dumps

    By default Ubuntu is not configured to produce core files useful for debugging crashes.
    First run:
    
    ```
    ulimit -c unlimited
    ```
    
    Now run `sudo systemctl edit rippled`. The default editor should open and add

    ```
    [Service]
    LimitCORE=infinity
    ```

    This creates the file `/etc/systemd/system/xrpld.service.d/override.conf` and configures the OS to save core dumps, without changing the service file provided by the `xrpld` package. If your server crashes, you can find the core dump in `/var/lib/apport/coredump/`. To load the core dump for inspection, use a command such as the following:

    ```
    gdb /usr/bin/xrpld /var/lib/apport/coredump/core
    ```

    {% admonition type="info" name="Note" %}To debug a core file this way, you must have the `xrpld-dbgsym` package installed, and you need permission to read files in the core dump directory.{% /admonition %}


## Next Steps

{% partial file="/docs/_snippets/post-xrpld-install.md" /%}



## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Configure xrpld](../configuration/index.md)
    - [Troubleshoot xrpld](../troubleshooting/index.md)
    - [Get Started with the xrpld API](../../tutorials/get-started/get-started-http-websocket-apis.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

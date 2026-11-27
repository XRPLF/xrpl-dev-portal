---
seo:
    description: Install a precompiled xrpld binary on Red Hat Enterprise Linux.
labels:
  - Core Server
---
# Install on Red Hat Enterprise Linux

This page describes the recommended instructions for installing the latest stable version of `xrpld` on **Red Hat Enterprise Linux**, using a binary that has been compiled and published by the XRP Ledger Foundation as an `rpm` package.

These packages require glibc 2.31 or later. The following distributions meet this requirement on x86_64:

- Red Hat Enterprise Linux 9 or later
- Rocky Linux 9 or later
- AlmaLinux 9 or later

Other RPM-based distributions with glibc >= 2.31 may also work but aren't officially recommended.

## Prerequisites

Before you install `xrpld`, you must meet the [System Requirements](../prerequisites/system-requirements/index.md).


## Installation Steps

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

3. Install the XRP Ledger Foundation RPM repository:

    Choose the appropriate RPM repository for the stability of releases you want:

    - `stable` - The latest stable release
    - `rc` - Release candidates
    - `beta` - Beta builds
    - `develop` - Every push to the `develop` branch

    {% admonition type="danger" name="Warning" %}Channels other than `stable` may be broken at any time. Don't use these builds for production servers.{% /admonition %}

    {% tabs %}

    ```{% label="Stable" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/xrplf.repo
    [xrplf]
    baseurl=https://packages.xrplf.org/repository/rpm-stable/x86_64/
    gpgkey=https://packages.xrplf.org/xrplf.asc
    gpgcheck=1
    REPOFILE
    ```

    ```{% label="Release candidate" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/xrplf.repo
    [xrplf]
    baseurl=https://packages.xrplf.org/repository/rpm-rc/x86_64/
    gpgkey=https://packages.xrplf.org/xrplf.asc
    gpgcheck=1
    REPOFILE
    ```

    ```{% label="Beta" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/xrplf.repo
    [xrplf]
    baseurl=https://packages.xrplf.org/repository/rpm-beta/x86_64/
    gpgkey=https://packages.xrplf.org/xrplf.asc
    gpgcheck=1
    REPOFILE
    ```

    ```{% label="Development" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/xrplf.repo
    [xrplf]
    baseurl=https://packages.xrplf.org/repository/rpm-develop/x86_64/
    gpgkey=https://packages.xrplf.org/xrplf.asc
    gpgcheck=1
    REPOFILE
    ```

    {% /tabs %}

4. Refresh the repository metadata:

    ```
    sudo yum makecache
    ```

5. Install the new `xrpld` package:

    ```
    sudo yum install xrpld
    ```

6. Reload systemd unit files:

    ```
    sudo systemctl daemon-reload
    ```

7. Configure the `xrpld` service to start on boot:

    ```
    sudo systemctl enable xrpld.service
    ```

8. Start the `xrpld` service:

    ```
    sudo systemctl start xrpld.service
    ```


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

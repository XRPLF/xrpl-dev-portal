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

Other RPM-based distributions with glibc >= 2.31 may also work but are not officially recommended.

## Prerequisites

Before you install `xrpld`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Add the XRP Ledger Foundation's package-signing key:

    ```
    sudo rpm --import https://packages.xrplf.org/xrplf.asc
    ```

2. Install the XRP Ledger Foundation RPM repository:

    Choose the appropriate RPM repository for the stability of releases you want:

    - `stable` - The latest stable release
    - `rc` - Release candidates
    - `beta` - Beta builds
    - `develop` - Every push to the `develop` branch

    {% admonition type="danger" name="Warning" %}Channels other than `stable` may be broken at any time. Do not use these builds for production servers.{% /admonition %}

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

3. Fetch the latest repo updates:

    ```
    sudo yum -y update
    ```

4. Install the new `xrpld` package:

    ```
    sudo yum install xrpld
    ```

5. Reload systemd unit files:

    ```
    sudo systemctl daemon-reload
    ```

6. Configure the `xrpld` service to start on boot:

    ```
    sudo systemctl enable xrpld.service
    ```

7. Start the `xrpld` service:

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

---
seo:
    description: Install a precompiled xrpld binary on Red Hat Enterprise Linux.
labels:
  - Core Server
---
# Install on Red Hat Enterprise Linux

This page describes the recommended instructions for installing the latest stable version of `xrpld` on **Red Hat Enterprise Linux**, using a binary that has been compiled and published by Ripple as an `rpm` package.

The following distributions are officially supported and recommended (x86_64):

| Distribution | Versions |
|---|---|
| Rocky Linux | 9 |
| AlmaLinux | 9 |
| Fedora | 42 |

You may also be able to adapt these instructions to Red Hat Enterprise Linux 9 or other compatible RPM-based distributions, but those configurations are not officially recommended.

## Prerequisites

Before you install `xrpld`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Install the Ripple RPM repository:

    Choose the appropriate RPM repository for the stability of releases you want:

    - `stable` - The latest stable release
    - `unstable` - Pre-release builds such as betas or release candidates
    - `nightly` - Nightly development builds

    {% tabs %}

    ```{% label="Stable" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-stable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/stable/
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/stable/repodata/repomd.xml.key
    REPOFILE
    ```

    ```{% label="Pre-release" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-unstable]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/unstable/
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/unstable/repodata/repomd.xml.key
    REPOFILE
    ```

    ```{% label="Development" %}
    cat << REPOFILE | sudo tee /etc/yum.repos.d/ripple.repo
    [ripple-nightly]
    name=XRP Ledger Packages
    enabled=1
    gpgcheck=0
    repo_gpgcheck=1
    baseurl=https://repos.ripple.com/repos/rippled-rpm/nightly/
    gpgkey=https://repos.ripple.com/repos/rippled-rpm/nightly/repodata/repomd.xml.key
    REPOFILE
    ```

    {% /tabs %}

2. Fetch the latest repo updates:

    ```
    sudo yum -y update
    ```

3. Install the new `xrpld` package:

    ```
    sudo yum install xrpld
    ```

4. Reload systemd unit files:

    ```
    sudo systemctl daemon-reload
    ```

5. Configure the `xrpld` service to start on boot:

    ```
    sudo systemctl enable xrpld.service
    ```

6. Start the `xrpld` service:

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

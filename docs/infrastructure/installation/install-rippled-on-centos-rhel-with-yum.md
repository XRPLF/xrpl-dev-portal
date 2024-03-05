---
html: install-rippled-on-centos-rhel-with-yum.html
parent: install-rippled.html
seo:
    description: Install a precompiled rippled binary on CentOS or Red Hat Enterprise Linux.
labels:
  - Core Server
---
# Install on CentOS/Red Hat with yum

This page describes the recommended instructions for installing the latest stable version of `rippled` on **CentOS 7** or **Red Hat Enterprise Linux 7**, using Ripple's [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) repository.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Install the Ripple RPM repository:

    Choose the appropriate RPM repository for the stability of releases you want:

    - `stable` for the latest production release (`master` branch)
    - `unstable` for pre-release builds (`release` branch)
    - `nightly` for experimental/development builds (`develop` branch)

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

3. Install the new `rippled` package:

    ```
    sudo yum install rippled
    ```

4. Reload systemd unit files:

    ```
    sudo systemctl daemon-reload
    ```

5. Configure the `rippled` service to start on boot:

    ```
    sudo systemctl enable rippled.service
    ```

6. Start the `rippled` service:

    ```
    sudo systemctl start rippled.service
    ```


## Next Steps

{% partial file="/docs/_snippets/post-rippled-install.md" /%}


## See Also

- **Concepts:**
    - [The `rippled` Server](../../concepts/networks-and-servers/index.md)
    - [Consensus](../../concepts/consensus-protocol/index.md)
- **Tutorials:**
    - [Configure rippled](../configuration/index.md)
    - [Troubleshoot rippled](../troubleshooting/index.md)
    - [Get Started with the rippled API](../../tutorials/http-websocket-apis/build-apps/get-started.md)
- **References:**
    - [rippled API Reference](../../references/http-websocket-apis/index.md)
        - [`rippled` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
html: install-rippled-on-ubuntu.html
parent: install-rippled.html
seo:
    description: Install a precompiled rippled binary on Ubuntu Linux.
labels:
  - Core Server
---
# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `rippled` on **Ubuntu Linux 18.04 or higher** or **Debian 10 or higher**, using the [`apt`](https://ubuntu.com/server/docs) utility.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.md).


## Installation Steps

1. Update repositories:

    ```
    sudo apt -y update
    ```

2. Install utilities:

    ```
    sudo apt -y install apt-transport-https ca-certificates wget gnupg
    ```

3. Add Ripple's package-signing GPG key to your list of trusted keys:

    ```
    sudo install -m 0755 -d /etc/apt/keyrings && \
        wget -qO- https://repos.ripple.com/repos/api/gpg/key/public | \
        sudo gpg --dearmor -o /etc/apt/keyrings/ripple.gpg
    ```


4. Check the fingerprint of the newly-added key:

    ```
    gpg --show-keys /etc/apt/keyrings/ripple.gpg
    ```

    The output should include an entry for Ripple such as the following:

    ```
    pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
        C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
    uid           TechOps Team at Ripple <techops+rippled@ripple.com>
    sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]
    ```


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the second line, starting with `C001`.)

5. Add the appropriate Ripple repository for your operating system version:

    ```
    echo "deb [signed-by=/etc/apt/keyrings/ripple.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    The above example is appropriate for **Ubuntu 20.04 Focal Fossa**. For other operating systems, replace the word `focal` with one of the following:

    - `buster` for **Debian 10 Buster**
    - `bullseye` for **Debian 11 Bullseye**
    - `bookworm` for **Debian 12 Bookworm**
    - `bionic` for **Ubuntu 18.04 Bionic Beaver**
    - `jammy` for **Ubuntu 22.04 Jammy Jellyfish**

    If you want access to development or pre-release versions of `rippled`, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds ([`release` branch](https://github.com/XRPLF/rippled/tree/release))
    - `nightly` - Experimental/development builds ([`develop` branch](https://github.com/XRPLF/rippled/tree/develop))

    **Warning:** Unstable and nightly builds may be broken at any time. Do not use these builds for production servers.

6. Update the package index to include Ripple's repo and install `rippled`.

    ```
    sudo apt -y update && sudo apt -y install rippled
    ```


7. Check the status of the `rippled` service:

    ```
    systemctl status rippled.service
    ```

    The `rippled` service should start automatically. If not, you can start it manually:

    ```
    sudo systemctl start rippled.service
    ```


8. Optional: allow `rippled` to bind to privileged ports.

    This allows you to serve incoming API requests on port 80 or 443. (If you want to do so, you must also update the config file's port settings.)

    ```
    sudo setcap 'cap_net_bind_service=+ep' /opt/ripple/bin/rippled
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

    This creates the file `/etc/systemd/system/rippled.service.d/override.conf` and configures the OS to save core dumps, without changing the service file provided by the `rippled` package. If your server crashes, you can find the core dump in `/var/lib/apport/coredump/`. To load the core dump for inspection, use a command such as the following:

    ```
    gdb /opt/ripple/bin/rippled /var/lib/apport/coredump/core
    ```

    **Note:** To debug a core file this way, you must have the `rippled-dbgsym` package installed, and you need permission to read files in the core dump directory.


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

---
html: install-xrpld-on-ubuntu.html
parent: install-xrpld.html
seo:
    description: Install a precompiled xrpld binary on Ubuntu Linux.
labels:
  - Core Server
---
# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `xrpld` on **Ubuntu Linux**, using a binary that has been compiled and published by Ripple as a `deb` package.

These packages require glibc 2.31 or later. The following distributions meet this requirement on x86_64:

- Ubuntu 20.04 (Focal) or later
- Debian 11 (Bullseye) or later

Other `apt`-based distributions with glibc >= 2.31 may also work but are not officially recommended.


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
    pub   ed25519 2026-02-16 [SC] [expires: 2033-02-14]
        E057C1CF72B0DF1A4559E8577DEE9236AB06FAA6
    uid   TechOps Team at Ripple <techops+xrpld@ripple.com>
    sub   ed25519 2026-02-16 [S] [expires: 2029-02-15]
    ```

    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the second line, starting with `C001`.)

5. Add the appropriate Ripple repository for your operating system version:

    ```
    echo "deb [signed-by=/etc/apt/keyrings/ripple.gpg] https://repos.ripple.com/repos/rippled-deb noble stable" | \
        sudo tee -a /etc/apt/sources.list.d/ripple.list
    ```

    The above example is appropriate for **Ubuntu 24.04 Noble Numbat**. For other operating systems, replace the word `noble` with one of the following:

    - `focal` for **Ubuntu 20.04 Focal Fossa**
    - `jammy` for **Ubuntu 22.04 Jammy Jellyfish**
    - `noble` for **Ubuntu 24.04 Noble Numbat**
    - `resolute` for **Ubuntu 26.04 Resolute Raccoon**
    - `bullseye` for **Debian 11 Bullseye**
    - `bookworm` for **Debian 12 Bookworm**
    - `trixie` for **Debian 13 Trixie**

    If you want access to development or pre-release versions of `xrpld`, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds such as betas or release candidates
    - `nightly` - Nightly development builds

    {% admonition type="danger" name="Warning" %}Unstable and nightly builds may be broken at any time. Do not use these builds for production servers.{% /admonition %}

6. Update the package index to include Ripple's repo and install `xrpld`.

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

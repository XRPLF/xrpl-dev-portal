---
html: install-rippled-on-ubuntu.html
parent: install-rippled.html
blurb: Install a precompiled rippled binary on Ubuntu Linux.
labels:
  - Core Server
---
# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `rippled` on **Ubuntu Linux 18.04 or higher** or **Debian 10 or higher**, using the [`apt`](https://ubuntu.com/server/docs) utility.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.html).


## Installation Steps

1. Update repositories:

        sudo apt -y update

2. Install utilities:

        sudo apt -y install apt-transport-https ca-certificates wget gnupg

3. Add Ripple's package-signing GPG key to your list of trusted keys:

        sudo mkdir /usr/local/share/keyrings/
        wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | gpg --dearmor > ripple-key.gpg
        sudo mv ripple-key.gpg /usr/local/share/keyrings/


4. Check the fingerprint of the newly-added key:

        gpg --import --import-options show-only /usr/local/share/keyrings/ripple-key.gpg

    The output should include an entry for Ripple such as the following:

        pub   rsa3072 2019-02-14 [SC] [expires: 2026-02-17]
            C0010EC205B35A3310DC90DE395F97FFCCAFD9A2
        uid           TechOps Team at Ripple <techops+rippled@ripple.com>
        sub   rsa3072 2019-02-14 [E] [expires: 2026-02-17]


    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the second line, starting with `C001`.)

4. Add the appropriate Ripple repository for your operating system version:

        echo "deb [signed-by=/usr/local/share/keyrings/ripple-key.gpg] https://repos.ripple.com/repos/rippled-deb focal stable" | \
            sudo tee -a /etc/apt/sources.list.d/ripple.list

    The above example is appropriate for **Ubuntu 20.04 Focal Fossa**. For other operating systems, replace the word `focal` with one of the following:

    - `bionic` for **Ubuntu 18.04 Bionic Beaver**
    - `buster` for **Debian 10 Buster**
    - `bullseye` for **Debian 11 Bullseye**
    - `jammy` for **Ubuntu 22.04 Jammy Jellyfish**

    If you want access to development or pre-release versions of `rippled`, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds ([`release` branch](https://github.com/XRPLF/rippled/tree/release))
    - `nightly` - Experimental/development builds ([`develop` branch](https://github.com/XRPLF/rippled/tree/develop))

    **Warning:** Unstable and nightly builds may be broken at any time. Do not use these builds for production servers.

5. Fetch the Ripple repository.

        sudo apt -y update

6. Install the `rippled` software package:

        sudo apt -y install rippled

7. Check the status of the `rippled` service:

        systemctl status rippled.service

    The `rippled` service should start automatically. If not, you can start it manually:

        sudo systemctl start rippled.service


8. Optional: allow `rippled` to bind to privileged ports.

    This allows you to serve incoming API requests on port 80 or 443. (If you want to do so, you must also update the config file's port settings.)

        sudo setcap 'cap_net_bind_service=+ep' /opt/ripple/bin/rippled


## Next Steps

{% include '_snippets/post-rippled-install.md' %}
<!--_ -->


## See Also

- **Concepts:**
    - [The `rippled` Server](xrpl-servers.html)
    - [Consensus](consensus.html)
- **Tutorials:**
    - [Configure rippled](configure-rippled.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
    - [Get Started with the rippled API](get-started-using-http-websocket-apis.html)
- **References:**
    - [rippled API Reference](http-websocket-apis.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

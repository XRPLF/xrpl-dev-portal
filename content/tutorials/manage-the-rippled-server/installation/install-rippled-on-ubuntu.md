# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `rippled` on **Ubuntu Linux 16.04 or higher** or **Debian 9 (Stretch)**, using the [`apt`](https://help.ubuntu.com/lts/serverguide/apt.html) utility.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.html).


## Installation Steps

1. Update repositories:

        $ sudo apt -y update

2. Install utilities:

        $ sudo apt -y install apt-transport-https ca-certificates wget gnupg

3. Add Ripple's package-signing GPG key to your list of trusted keys:

        $ wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | \
          sudo apt-key add -

4. Check the fingerprint of the newly-added key:

        $ apt-key finger

    The output should include an entry for Ripple such as the following:

        pub   rsa3072 2019-02-14 [SC] [expires: 2021-02-13]
              C001 0EC2 05B3 5A33 10DC 90DE 395F 97FF CCAF D9A2
        uid           [ unknown] TechOps Team at Ripple <techops+rippled@ripple.com>
        sub   rsa3072 2019-02-14 [E] [expires: 2021-02-13]

    In particular, make sure that the fingerprint matches. (In the above example, the fingerprint is on the second line, starting with `C001`.)

4. Add the appropriate Ripple repository for your operating system version:

        $ echo "deb https://repos.ripple.com/repos/rippled-deb bionic stable" | \
            sudo tee -a /etc/apt/sources.list.d/ripple.list

    The above example is appropriate for **Ubuntu 18.04 Bionic Beaver**. For other operating systems, replace the word `bionic` with one of the following:

    - `xenial` for **Ubuntu 16.04 Xenial Xerus**
    - `stretch` for **Debian 9 Stretch**

    If you want access to development or pre-release versions of `rippled`, use one of the following instead of `stable`:

    - `unstable` - Pre-release builds ([`release` branch](https://github.com/ripple/rippled/tree/release))
    - `nightly` - Experimental/development builds ([`develop` branch](https://github.com/ripple/rippled/tree/develop))

    **Warning:** Unstable and nightly builds may be broken at any time. Do not use these builds for production servers.

5. Fetch the Ripple repository.

        $ sudo apt -y update

6. Install the `rippled` software package:

        $ sudo apt -y install rippled

7. Check the status of the `rippled` service:

        $ systemctl status rippled.service

    The `rippled` service should start automatically. If not, you can start it manually:

        $ sudo systemctl start rippled.service

    To configure it to start automatically on boot:

        $ sudo systemctl enable rippled.service



## Next Steps

{% include '_snippets/post-rippled-install.md' %}
<!--_ -->


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Configure rippled](configure-rippled.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
    - [Get Started with the rippled API](get-started-with-the-rippled-api.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

# Install on Ubuntu or Debian Linux

This page describes the recommended instructions for installing the latest stable version of `rippled` on **Ubuntu Linux 16.04 or higher** or **Debian 9 (Stretch)**, using the [apt](https://help.ubuntu.com/lts/serverguide/apt.html) utility. [Updated in: rippled v1.3.0][]

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.html).


## Installation Steps

1. Update apt repositories:

        $ sudo apt -y update

2. Install utilities:

        $ sudo apt -y apt-transport-https ca-certificates wget gnupg

3. Add Ripple's package-signing GPG key to your list of trusted keys:

        $ wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | \
          sudo apt-key add -

    The key should match the following fingerprint:

        C001 0EC2 05B3 5A33 10DC 90DE 395F 97FF CCAF D9A2

4. Add the appropriate Ripple repository for your operating system version:

        $ sudo echo "deb https://repos.ripple.com/repos/rippled-deb bionic stable" > \
            /etc/apt/sources.list.d/ripple.list

    The above example is appropriate for **Ubuntu 18.04 Bionic Beaver**. For other operating systems, replace the word `bionic` with one of the following:

    - `xenial` for **Ubuntu 16.04 Xenial Xerus**
    - `stretch` for **Debian 9 Stretch**

5. Fetch the Ripple repository.

        $ sudo apt -y update

6. Install the `rippled` software package:

        $ sudo apt -y install rippled

7. Check the status of the `rippled` service:

        $ systemctl status rippled.service

    ***TODO: confirm it starts automatically***
    The `rippled` service should start automatically. If not, you can start it manually:

        $ sudo systemctl start rippled.service

    To configure it to start automatically on boot:

        $ sudo systemctl enable rippled.service



## Next Steps

{% include '_snippets/post-rippled-install.md' %}

# Install on CentOS/Red Hat with yum

This page describes the recommended instructions for installing the latest stable version of `rippled` on **CentOS 7** or **Red Hat Enterprise Linux 7**, using Ripple's [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) repository.

These instructions install a binary that has been compiled by Ripple.


## Prerequisites

Before you install `rippled`, you must meet the [System Requirements](system-requirements.html).


## Installation Steps

1. Install the Ripple RPM repository:

        $ sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm

2. Install the `rippled` software package:

        $ sudo yum install --enablerepo=ripple-stable rippled

3. Configure the `rippled` service to start on system boot:

        $ sudo systemctl enable rippled.service

4. Start the `rippled` service

        $ sudo systemctl start rippled.service


## Next Steps

{% include '_snippets/post-rippled-install.md' %}<!--_ -->

## See Also

- [Update Automatically on CentOS/Red Hat](update-rippled-automatically-on-centos-rhel.html)
- [Install rippled on Ubuntu Linux](install-rippled-on-ubuntu-with-alien.html) (Pre-built binary on Ubuntu)
- [Build and Run `rippled` on Ubuntu](build-run-rippled-ubuntu.html) (Compile `rippled` yourself on Ubuntu)
- [Compilation instructions for other platforms](https://github.com/ripple/rippled/tree/develop/Builds)

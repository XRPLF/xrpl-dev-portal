# Update Manually on CentOS/Red Hat

This page describes how to update manually to the latest release of `rippled` on CentOS or Red Hat Enterprise Linux. Ripple recommends setting up [automatic updates](update-rippled-automatically-on-linux.html) instead, where possible.

These instructions assume you have already [installed `rippled` from the `yum` repository](install-rippled-on-centos-rhel-with-yum.html).

**Tip:** To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package.

To update manually, complete the following steps:

1. Download and install the latest `rippled` package:

        $ sudo yum update rippled

2. Reload the `systemd` unit files:

        $ sudo systemctl daemon-reload

3. Restart the `rippled` service:

        $ sudo service rippled restart

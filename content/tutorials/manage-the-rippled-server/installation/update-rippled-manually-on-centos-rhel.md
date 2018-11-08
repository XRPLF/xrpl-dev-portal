# Update Manually on CentOS/Red Hat

This page describes how to update manually to the latest release of `rippled` on CentOS or Red Hat Enterprise Linux. Ripple recommends setting up [automatic updates](update-rippled-automatically-on-centos-rhel.html) instead, where possible.

These instructions assume you have already [installed `rippled` from the `yum` repository](install-rippled-on-centos-rhel-with-yum.html).

To update manually, complete the following steps:

1. Update the package list from Ripple's yum repository:

        $ sudo rpm -Uvh --replacepkgs https://mirrors.ripple.com/ripple-repo-el7.rpm

2. Download and install the latest `rippled` package:

        $ sudo yum update --enablerepo=ripple-stable rippled

3. Reload the `systemd` unit files:

        $ sudo systemctl daemon-reload

4. Restart the `rippled` service:

        $ sudo service rippled restart

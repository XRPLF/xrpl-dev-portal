# Update Manually on Ubuntu or Debian

This page describes how to update manually to the latest release of `rippled` on Ubuntu Linux. These instructions assume you have already [installed `rippled` using the native package](install-rippled-on-ubuntu.html). Ripple recommends setting up [automatic updates](update-rippled-automatically-on-linux.html) instead, where possible.

**Caution:** To upgrade from `rippled` 1.2.x to 1.3.0 or higher on Ubuntu Linux, you should follow the [1.3.0 migration instructions](rippled-1-3-0-migration-instructions.html). The following instructions assume you have already installed the native APT package provided with versions 1.3.0 and up.

**Tip:** To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package and is compatible with Ubuntu and Debian starting with `rippled` version 1.3.0.

To update manually, complete the following steps:

1. Update apt repositories:

        $ sudo apt -y update

2. Upgrade the `rippled` package:

        $ sudo apt -y upgrade rippled

3. Reload the `systemd` unit files:

        $ sudo systemctl daemon-reload

4. Restart the `rippled` service:

        $ sudo service rippled restart

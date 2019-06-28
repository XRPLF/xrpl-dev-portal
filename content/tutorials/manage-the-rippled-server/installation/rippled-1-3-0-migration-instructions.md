# rippled v1.3.0 Migration Instructions

This document describes the migration process for upgrading from `rippled` 1.2.4 or earlier to `rippled` v1.3.0 or later. This is necessary because the `rippled` install process has changed as of version 1.3.0.

This document provides migration steps for upgrading on supported platforms:

- [CentOS or Red Hat Enterprise Linux (RHEL)](#migration-on-centos-or-red-hat-enterprise-linux-rhel)
- [Ubuntu Linux](#migration-on-ubuntu-linux)

For other platforms, see the updated instructions for compiling from source. ([Ubuntu](build-run-rippled-ubuntu.html), [macOS](build-run-rippled-macos.html), or [Windows](https://github.com/ripple/rippled/tree/develop/Builds/VisualStudio2017))

# Migration on CentOS or Red Hat Enterprise Linux (RHEL)

***TODO: Test. Might be same as manual install steps***

Ripple's official RPM repository and instructions for using it have changed. To migrate from the old repository to the new one, complete the following steps:

1. Stop the `rippled` server.

        $ sudo systemctl stop rippled.service

2. Back up your configuration files.

    Copy your configuration files to a temporary directory. For example:

        $ mkdir ~/rippled_config_backup
        $ cp /opt/ripple/etc/rippled.cfg ~/rippled_config_backup
        $ cp /opt/ripple/etc/validators.txt ~/rippled_config_backup

    You may need to adjust the paths to the `rippled.cfg` and `validators.txt` files to match your configuration.

3. Back up your data files.

    Copy your rippled server's database files to a temporary directory. For example:

        $ mkdir ~/rippled_data_backup
        $ cp -r /var/lib/rippled/db/ ~/rippled_data_backup

    You may need to adjust the path to your database files to match your configuration. You should be sure to copy all database files, including SQLite databases (`.sqlite` and `.db` files), NuDB or RocksDB files for the [ledger store](ledger-history.html), and the [shard store](history-sharding.html) if you have history sharding enabled.

    This process may take a long time, depending on how much data you have stored.

    **Caution:** You can choose to skip this step if you do not need the ledger history data. Your server can download the necessary amount of ledger data from the peer-to-peer network after it comes back online. Validators and simple stock servers do not need large amounts of historical data to keep up with the progress of the XRP Ledger.

4. Update the

***TODO: instructions per https://github.com/ripple/ripple-dev-portal/issues/544***

Roughly:

- stop rippled
- backup data & config
- uninstall package w/ `rpm -e` or `yum remove`
- install 1.3 the standard way
- stop rippled
- restore config & data files
- start rippled, check status


# Migration on Ubuntu Linux

Prior to version 1.3.0, the supported way to install `rippled` on Ubuntu Linux was using Alien to install the RPM package. Starting with `rippled` v1.3.0, Ripple provides a native package for Ubuntu and Debian Linux, which is the recommended way of installing it. If you already have the RPM package installed, complete the [installation steps](install-rippled-on-ubuntu.html) to upgrade the package and switch over to the native APT (`.deb`) package.

If you have made any changes to your config files (`/opt/ripple/etc/rippled.cfg` and `/opt/ripple/etc/validators.txt`), `apt` may prompt you during installation asking if you want to overwrite your config files with the newest versions from the packages. Version 1.3.0 does not require any changes to the config file, so you can safely keep your existing config files unchanged.

After installing the new package, if you no longer need Alien for any other packages, you may optionally uninstall it and its dependencies using the following steps:

1. Uninstall Alien:

        $ sudo apt -y remove alien

2. Uninstall unused dependencies:

        $ sudo apt -y autoremove


## Automatic Updates

The `rippled` v1.3.0 package includes an updated auto-update script that works on Ubuntu and Debian Linux. For more information, see [Update `rippled` Automatically on Linux](update-rippled-automatically-on-linux.html).

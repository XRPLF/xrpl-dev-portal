# Update Automatically on Linux

On Linux, you can set up `rippled` to automatically upgrade to the latest version with a one-time `cron` configuration. Ripple recommends enabling automatic updates if possible.

These instructions assume you have already installed `rippled` [from the `yum` repository (CentOS/RedHat)](install-rippled-on-centos-rhel-with-yum.html) or [using `apt`(Ubuntu/Debian)](install-rippled-on-ubuntu.html).

**Warning:** The install and upgrade process for for `rippled` 1.3.0 has changed. If you have `rippled` v1.2.4 or lower installed, follow the [rippled 1.3.0 migration instructions](rippled-1-3-0-migration-instructions.html)

To set up automatic updates, complete the following steps:

1. Check that `/opt/ripple/etc/update-rippled-cron` exists. If it does not, update manually ([CentOS/Red Hat](update-rippled-manually-on-centos-rhel.html) or [Ubuntu/Debian](update-rippled-manually-on-ubuntu.html)).

2. Create a symlink in your `cron.d` folder

The script updates the installed `rippled` package within an hour of each new release. To reduce the chance of outages from all servers updating simultaneously, the script delays the update for a random number of minutes, up to 59.

# Update Automatically on CentOS/Red Hat

On CentOS and Red Hat Enterprise Linux, you can set up `rippled` to automatically upgrade to the latest version with a one-time `cron` configuration. Ripple recommends enabling automatic updates if possible.

These instructions assume you have already [installed `rippled` from the `yum` repository](install-rippled-on-centos-rhel-with-yum.html).

To set up automatic updates, complete the following steps:

1. Check that `/opt/ripple/bin/update-rippled.sh` exists. If it does not, [update manually](update-rippled-manually-on-centos-rhel.html).

2. Install `crond`:

        $ sudo yum install cronie

3. Open the crontab file for editing

        $ sudo crontab -e

4. Add the following to the crontab file. Be sure to add a blank line at the end of the file.

        RANDOM_DELAY=59
        0 * * * * /opt/ripple/bin/update-rippled.sh


The script updates the installed `rippled` package within an hour of each new release. To reduce the chance of outages from all servers updating simultaneously, the script delays the update for a random number of minutes, up to 59.

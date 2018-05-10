# Update rippled

You can subscribe to the [rippled Google Group](https://groups.google.com/forum/#!forum/ripple-server) to receive notifications of new `rippled` releases.

## Automatic Update on CentOS/Red Hat

Automatic rippled updates can be enabled with a one-time Cron configuration:

1. Check that `/opt/ripple/bin/update-rippled.sh` exists. If it does not, [update manually](#manual-update-on-centosred-hat).

2. Install `crond`:

        $ sudo yum install cronie

3. Open the crontab file for editing

        $ sudo crontab -e

4. Add the following to the crontab file. Be sure to add a blank line at the end of the file.

        RANDOM_DELAY=59
        0 * * * * /opt/ripple/bin/update-rippled.sh


The script updates the installed `rippled` package within an hour of each new release.

## Manual Update on CentOS/Red Hat

Run the following commands to update to the latest release of `rippled`:

        $ sudo rpm -Uvh --replacepkgs https://mirrors.ripple.com/ripple-repo-el7.rpm
        $ sudo yum update --enablerepo=ripple-stable rippled
        $ sudo systemctl daemon-reload
        $ sudo service rippled restart

## Manual Update on Ubuntu

Run the following commands to update to the latest release of `rippled`:

        $ sudo rpm -Uvh --replacepkgs https://mirrors.ripple.com/ripple-repo-el7.rpm
        $ yumdownloader --enablerepo=ripple-stable --releasever=el7 rippled
        $ rpm -K rippled*.rpm
        $ sudo alien -i --scripts rippled*.rpm
        $ sudo systemctl daemon-reload
        $ sudo service rippled restart

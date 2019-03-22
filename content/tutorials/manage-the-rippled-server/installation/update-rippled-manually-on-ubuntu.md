# Update Manually on Ubuntu

This page describes how to update manually to the latest release of `rippled` on Ubuntu Linux. These instructions assume you have already [installed `rippled` using Alien](install-rippled-on-ubuntu-with-alien.html).

To update manually, complete the following steps:

1. Update the package list from Ripple's yum repository:

        $ sudo rpm -Uvh --replacepkgs https://mirrors.ripple.com/ripple-repo-el7.rpm

2. Download the latest `rippled` package:

        $ yumdownloader --enablerepo=ripple-stable --releasever=el7 rippled

3. Verify the signatures on the downloaded packages:

        $ rpm -K rippled*.rpm

4. Use Alien to upgrade to the new `rippled` package:

        $ sudo alien -i --scripts rippled*.rpm

5. Reload the `systemd` unit files:

        $ sudo systemctl daemon-reload

6. Restart the `rippled` service:

        $ sudo service rippled restart

7. Delete the downloaded `rippled` package file:
        
        $ rm rippled*.rpm
        
    (This does not affect the installation, but prevents later updates from trying to re-install the old version.)

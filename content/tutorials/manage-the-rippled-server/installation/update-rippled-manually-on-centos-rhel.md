# Update Manually on CentOS/Red Hat

This page describes how to update manually to the latest release of `rippled` on CentOS or Red Hat Enterprise Linux. Ripple recommends setting up [automatic updates](update-rippled-automatically-on-linux.html) instead, where possible.

These instructions assume you have already [installed `rippled` from the `yum` repository](install-rippled-on-centos-rhel-with-yum.html).

**Tip:** To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package. This script should be run as a `sudo` user.

To update manually, complete the following steps:

1. Download and install the latest `rippled` package:

        $ sudo yum update rippled

2. Reload the `systemd` unit files:

        $ sudo systemctl daemon-reload

3. Restart the `rippled` service:

        $ sudo service rippled restart


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [`rippled` v1.3.x Migration Instructions](rippled-1-3-migration-instructions.html) <!-- Note: remove when versions older than v1.3 are basically extinct -->
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

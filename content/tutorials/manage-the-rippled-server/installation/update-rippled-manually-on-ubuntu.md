# Update Manually on Ubuntu or Debian

This page describes how to update manually to the latest release of `rippled` on Ubuntu Linux. These instructions assume you have already [installed `rippled` using the native package](install-rippled-on-ubuntu.html). Ripple recommends setting up [automatic updates](update-rippled-automatically-on-linux.html) instead, where possible.

**Caution:** To upgrade from `rippled` 1.2.x to 1.3.1 or higher on Ubuntu Linux, you should follow the [1.3.1 migration instructions](rippled-1-3-migration-instructions.html). The following instructions assume you have already installed the native APT package provided with versions 1.3.1 and up.

**Tip:** To perform these steps all at once, you can run the `/opt/ripple/bin/update-rippled.sh` script, which is included with the `rippled` package and is compatible with Ubuntu and Debian starting with `rippled` version 1.3.1. This script should be run as a `sudo` user.

To update manually, complete the following steps:

1. Update repositories:

        $ sudo apt -y update

2. Upgrade the `rippled` package:

        $ sudo apt -y upgrade rippled

3. Reload the `systemd` unit files:

        $ sudo systemctl daemon-reload

4. Restart the `rippled` service:

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

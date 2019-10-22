# Update Automatically on Linux

On Linux, you can set up `rippled` to automatically upgrade to the latest version with a one-time `cron` configuration. Ripple recommends enabling automatic updates if possible.

These instructions assume you have already installed `rippled` [from the `yum` repository (CentOS/RedHat)](install-rippled-on-centos-rhel-with-yum.html) or [using `apt` (Ubuntu/Debian)](install-rippled-on-ubuntu.html).

To set up automatic updates, complete the following steps:

1. Check that `/opt/ripple/etc/update-rippled-cron` exists. If it does not, update manually ([CentOS/Red Hat](update-rippled-manually-on-centos-rhel.html) or [Ubuntu/Debian](update-rippled-manually-on-ubuntu.html)).

2. Create a symlink in your `cron.d` folder to the `/opt/ripple/etc/update-rippled-cron` config file:

        $ sudo ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/

    This cron configuration runs a script to update the installed `rippled` package within an hour of each new release. To reduce the chance of outages from all servers updating simultaneously, the script delays the update for a random number of minutes, up to 59.

**Caution:** In the future, it is possible that changes to Ripple's repositories may require manual intervention to update the URLs where your script searches for updates. Stay tuned to the [XRP Ledger Blog](/blog/) or the [ripple-server mailing list](https://groups.google.com/forum/#!forum/ripple-server) for announcements on any required changes.


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Capacity Planning](capacity-planning.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

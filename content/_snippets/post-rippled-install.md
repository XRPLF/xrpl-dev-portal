It can take several minutes for `rippled` to sync with the rest of the network, during which time it outputs warnings about missing ledgers.

For information about `rippled` log messages, see [Understanding Log Messages](understanding-log-messages.html).

After your `rippled` has synchronized with the rest of the network, you have a fully functional stock `rippled` server that you can use for local signing and API access to the XRP Ledger. Use [`rippled` server states](rippled-server-states.html) to tell whether your `rippled` server has synchronized with the network. You can use the [`rippled` commandline interface](get-started-with-the-rippled-api.html#commandline) to test this quickly:

{% if currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md" or
      currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md" %}
    $ ./rippled server_info
{% else %}
    $ /opt/ripple/bin/rippled server_info
{% endif %}

For more information about communicating with your `rippled` server using the rippled APIs, see the [rippled API reference](rippled-api.html).

Once you have your stock `rippled` server running, you may want to consider running it as a validating server. For information about validating servers and why you might want to run one, see [Run rippled as a Validator](run-rippled-as-a-validator.html).

Having trouble getting your `rippled` server started? See [rippled Server Won't Start](server-wont-start.html).

### Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file. For recommendations about configuration settings, see [Capacity Planning](capacity-planning.html).

{% include '_snippets/conf-file-location.md' %}<!--_ -->

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) for a description of all configuration options.

You must restart `rippled` for any configuration changes to take effect:


{% if currentpage.md == "tutorials/manage-the-rippled-server/installation/install-rippled-on-ubuntu.md" or
      currentpage.md == "tutorials/manage-the-rippled-server/installation/install-rippled-on-centos-rhel-with-yum" %}
        $ sudo systemctl restart rippled.service

{% elif currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md" or
        currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md" %}

  * Use Ctrl-C to stop `rippled`, then start it again:

        $ ./rippled

{% endif %}

If you change the `[debug_logfile]` or `[database_path]` sections, you may need to grant ownership of the new configured path to the user you run `rippled` as.


### Updates

You must update `rippled` regularly to remain synced with the rest of the XRP Ledger network. You can subscribe to the [rippled Google Group](https://groups.google.com/forum/#!forum/ripple-server) to receive notifications of new `rippled` releases.

The `rippled` package includes a script you can use to [enable automatic updates on Linux](update-rippled-automatically-on-linux.html). On other platforms, you must update manually.

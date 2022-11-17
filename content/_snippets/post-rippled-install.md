It can take several minutes to sync with the rest of the XRP Ledger network, during which time the server outputs various warnings. For information about log messages, see [Understanding Log Messages](understanding-log-messages.html).

You can use the [`rippled` commandline interface](get-started-using-http-websocket-apis.html#commandline) to see if your server is synced with the network:

{% if currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md" or
      currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md" %}
    ./rippled server_info
{% else %}
    /opt/ripple/bin/rippled server_info
{% endif %}

If the `server_state` in the response is `full` or `proposing`, then your server is fully synced to the network. Otherwise, you may need to wait longer. Fresh servers usually sync within 15 minutes; servers that already have [ledger history](ledger-history.html) stored can take longer.

After your server has synchronized with the rest of the network, you have a fully functional XRP Ledger peer-to-peer server that you can use to submit transactions or get API access to the XRP Ledger. See [Client Libraries](client-libraries.html) or [HTTP / WebSocket APIs](http-websocket-apis.html) for different ways to communicate with the server.

If you use the XRP Ledger for your business or you just want to contribute to the stability of the network, you should run one server as a validator. For information about validating servers and why you might want to run one, see [Run rippled as a Validator](run-rippled-as-a-validator.html).

Having trouble getting your server started? See [rippled Server Won't Start](server-wont-start.html).

### Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file. For recommendations about configuration settings, see [Capacity Planning](capacity-planning.html).

{% include '_snippets/conf-file-location.md' %}<!--_ -->

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) for a description of all configuration options.

You must restart `rippled` for any configuration changes to take effect:


{% if currentpage.md == "tutorials/manage-the-rippled-server/installation/install-rippled-on-ubuntu.md" or
      currentpage.md == "tutorials/manage-the-rippled-server/installation/install-rippled-on-centos-rhel-with-yum" %}
        sudo systemctl restart rippled.service

{% elif currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-ubuntu.md" or
        currentpage.md == "tutorials/manage-the-rippled-server/installation/build-run-rippled-macos.md" %}

  * Use Ctrl-C to stop `rippled`, then start it again:

        ./rippled

{% endif %}

If you change the `[debug_logfile]` or `[database_path]` sections, you may need to grant ownership of the new configured path to the user you run `rippled` as.


### Updates

You must update `rippled` regularly to remain synced with the rest of the XRP Ledger network. You can subscribe to the [rippled Google Group](https://groups.google.com/forum/#!forum/ripple-server) to receive notifications of new `rippled` releases.

The `rippled` package includes a script you can use to [enable automatic updates on Linux](update-rippled-automatically-on-linux.html). On other platforms, you must update manually.

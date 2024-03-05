It can take several minutes to sync with the rest of the XRP Ledger network, during which time the server outputs various warnings. For information about log messages, see [Understanding Log Messages](../infrastructure/troubleshooting/understanding-log-messages.md).

You can use the [`rippled` commandline interface](../tutorials/http-websocket-apis/build-apps/get-started.md#commandline) to see if your server is synced with the network:

```sh
rippled server_info
```

If the `server_state` in the response is `full` or `proposing`, then your server is fully synced to the network. Otherwise, you may need to wait longer. Fresh servers usually sync within 15 minutes; servers that already have [ledger history](../concepts/networks-and-servers/ledger-history.md) stored can take longer.

After your server has synchronized with the rest of the network, you have a fully functional XRP Ledger peer-to-peer server that you can use to submit transactions or get API access to the XRP Ledger. See [Client Libraries](../references/client-libraries.md) or [HTTP / WebSocket APIs](../references/http-websocket-apis/index.md) for different ways to communicate with the server.

If you use the XRP Ledger for your business or you want to contribute to the stability of the network, you should run one server as a validator. For information about validating servers and why you might want to run one, see [Run rippled as a Validator](../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md).

Having trouble getting your server started? See [rippled Server Won't Start](../infrastructure/troubleshooting/server-wont-start.md).

### Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file. For recommendations about configuration settings, see [Capacity Planning](../infrastructure/installation/capacity-planning.md).

{% partial file="/docs/_snippets/conf-file-location.md" /%}

See [the `rippled` GitHub repository](https://github.com/XRPLF/rippled/blob/master/cfg/rippled-example.cfg) for a description of all configuration options.

You must restart `rippled` for any configuration changes to take effect.

If you change the `[debug_logfile]` or `[database_path]` sections, you may need to grant ownership of the new configured path to the user you run `rippled` as.


### Updates

You must update `rippled` regularly to remain synced with the rest of the XRP Ledger network. You can subscribe to the [rippled Google Group](https://groups.google.com/forum/#!forum/ripple-server) to receive notifications of new `rippled` releases.

The `rippled` package includes a script you can use to [enable automatic updates on Linux](../infrastructure/installation/update-rippled-automatically-on-linux.md). On other platforms, you must update manually.

# Load a Saved Ledger in Stand-Alone Mode

You can start with a ledger version that was saved to disk if your `rippled` server was previously synced with the XRP Ledger peer-to-peer network (either the production network or the [Test Net](parallel-networks.html)).

## 1. Start `rippled` normally.

To load an existing ledger, you must first retrieve that ledger from the network. Start `rippled` in online mode as normal:

```
rippled --conf=/path/to/rippled.cfg
```

## 2. Wait until `rippled` is synced.

Use the [server_info method][] to check the state of your server relative to the network. Your server is synced when the `server_state` value shows any of the following values:

* `full`
* `proposing`
* `validating`

For more information, see [Possible Server States](rippled-server-states.html).

## 3. (Optional) Retrieve specific ledger versions.

If you only want the most recent ledger, you can skip this step.

If you want to load a specific historical ledger version, use the [ledger_request method][] to make `rippled` fetch it. If `rippled` does not already have the ledger version, you may have to run the `ledger_request` command multiple times until it has finished retrieving the ledger.

If you want to replay a specific historical ledger version, you must fetch both the ledger version to replay and the ledger version before it. (The previous ledger version sets up the initial state upon which you apply the changes described by the ledger version you replay.)

## 4. Shut down `rippled`.

Use the [stop method][]:

```
rippled stop --conf=/path/to/rippled.cfg
```

## 5. Start `rippled` in stand-alone mode.

To load the most recent ledger version, start the server with the `-a` and `--load` options:

```
rippled -a --load --conf=/path/to/rippled.cfg
```

To load a specific historical ledger, start the server with the `--load` parameter along with the `--ledger` parameter, providing the ledger index or identifying hash of the ledger version to load:

```
rippled -a --load --ledger 19860944 --conf=/path/to/rippled.cfg
```

For more information on the options you can use when starting `rippled` in stand-alone mode, see [Commandline Usage: Stand-Alone Mode Options](commandline-usage.html#stand-alone-mode-options).

## 6. Manually advance the ledger.

When you load a ledger with `--ledger` in stand-alone mode, it goes to the current open ledger, so you must [manually advance the ledger](advance-the-ledger-in-stand-alone-mode.html):

```
rippled ledger_accept --conf=/path/to/rippled.cfg
```

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

---
html: server-wont-start.html
parent: troubleshoot-the-xrpld-server.html
seo:
    description: A collection of problems that would cause an xrpld server not to start, and how to fix them.
labels:
  - Core Server
---
# xrpld Server Won't Start

This page explains possible reasons [the `xrpld` server](../../concepts/networks-and-servers/index.md) doesn't start and how to fix them.

These instructions assume you have [installed `xrpld`](../installation/index.md) on a supported platform.


## File Descriptors Limit

On some Linux variants, you may get an error message such as the following when trying to run `xrpld`:

```text
Insufficient number of file descriptors: 1224 are needed, but only 1024 are available.
```

This occurs because the system has a security limit on the number of files a single process may open, but the limit is set too low for `xrpld`. To fix the problem, **root access is required**. Increase the number of files `xrpld` is allowed to open with the following steps:

1. If you run `xrpld` under `systemd` (the packaged unit already sets `LimitNOFILE=65536`), set `LimitNOFILE=65536` in a drop-in for the service. `limits.conf` applies to login sessions, not services. If you start `xrpld` from a shell, add the following lines to the end of your `/etc/security/limits.conf` file:

    ```
    *                soft    nofile          65536
    *                hard    nofile          65536
    ```

2. Check that the [hard limit on number of files that can be opened](https://ss64.com/bash/ulimit.html) is now `65536`:

    ```
    ulimit -Hn
    ```

    The command should output `65536`.

3. Try starting `xrpld` again.

    ```
    systemctl start xrpld
    ```

4. If `xrpld` still doesn't start, check the kernel-level limit with `sysctl fs.file-max`. Only if it is below `65536`, open `/etc/sysctl.conf` and append the following setting:

    ```
    fs.file-max = 65536
    ```


## Failed to read xrpld.cfg

If `xrpld` crashes on startup with an error such as the following, it means that `xrpld` can't read its config file:

```text
Loading: "/etc/xrpld/xrpld.cfg"
Failed to read '"/etc/xrpld/xrpld.cfg"'.2: No such file or directory
terminate called after throwing an instance of 'std::runtime_error'
  what():  Can not create /var/lib/xrpld
```

A missing config file isn't fatal by itself: the server continues with defaults and crashes only when it can't create its default data directory. Started from a root shell, it can therefore come up on default settings instead of failing, so check which file it loaded. The lines around the `what():` message vary by platform; search for the message itself.

Possible solutions:

- Check that the config file exists (the default location is `/etc/xrpld/xrpld.cfg`) and the user that runs your `xrpld` process (usually `xrpld`) has read permissions to the file.

- Create a config file that can be read by the `xrpld` user at `$HOME/.config/xrpld/xrpld.cfg` (where `$HOME` points to the `xrpld` user's home directory).

    {% admonition type="success" name="Tip" %}The `rippled` repository contains {% source-link name="an example xrpld.cfg file" path="cfg/xrpld-example.cfg" /%} which is provided as the default config when you do an installation from a binary package. If you don't have the file, you can copy it from there.{% /admonition %}

- Specify the path to your preferred config file using the `--conf` [commandline option](../commandline-usage.md).

## Failed to open validators file

If `xrpld` crashes on startup with an error such as the following, it means it can read its primary config file, but that config file specifies a separate validators config file (typically named `validators.txt`), which `xrpld` can't read.

```text
Loading: "/home/xrpld/.config/xrpld/xrpld.cfg"
terminate called after throwing an instance of 'std::runtime_error'
  what():  The file specified in [validators_file] does not exist: /home/xrpld/.config/xrpld/validators.txt
```

Possible solutions:

- Check that the `validators.txt` file exists and the `xrpld` user has permissions to read it.

    {% admonition type="success" name="Tip" %}The `rippled` repository contains {% source-link name="an example validators.txt file" path="cfg/validators-example.txt" /%} which is provided as the default config when you do an installation from a binary package. If you don't have the file, you can copy it from there.{% /admonition %}

- Edit your `xrpld.cfg` file and modify the `[validators_file]` setting to have the correct path to your `validators.txt` (or equivalent) file. Check for extra whitespace before or after the filename.

- Edit your `xrpld.cfg` file and remove the `[validators_file]` setting. Add validator settings directly to your `xrpld.cfg` file. For example:

    ```
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```


## Cannot create database path

If `xrpld` crashes on startup with an error such as the following, it means the server doesn't have write permissions to the `[database_path]` from its config file.

```text
Loading: "/home/xrpld/.config/xrpld/xrpld.cfg"
terminate called after throwing an instance of 'std::runtime_error'
  what():  Can not create /var/lib/xrpld/db
```

The paths to the configuration file (`/home/xrpld/.config/xrpld/xrpld.cfg`) and the database path (`/var/lib/xrpld/db`) may vary depending on your system.

Possible solutions:

- Run `xrpld` as a different user that has write permissions to the database path printed in the error message.

- Edit your `xrpld.cfg` file and change the `[database_path]` setting to use a path that the `xrpld` user has write permissions to.

- Grant the `xrpld` user write permissions to the configured database path.


## State DB Error

The following error can occur if the `xrpld` server's state database is corrupted. This can occur as the result of being shutdown unexpectedly, or if you change the type of database from RocksDB to NuDB without changing the `path` and `[database_path]` settings in the config file.

```text
2018-Aug-21 23:06:38.675117810 SHAMapStore:ERR state db error:
  writableDbExists false archiveDbExists false
  writableDb '/var/lib/xrpld/db/nudb/rippledb.11a9' archiveDb '/var/lib/xrpld/db/nudb/rippledb.2d73

The existing data is in a corrupted state.
To resume operation, remove the files matching /var/lib/xrpld/db/state* and contents of the directory /var/lib/xrpld/db/nudb
Optionally, you can move those files to another
location if you wish to analyze or back up the data.
However, there is no guarantee that the data in its
existing form is usable.
terminate called after throwing an instance of 'std::runtime_error'
  what():  state db error
```

Move aside only what the error names: the files matching `state*` in your `[database_path]` and the contents of the `[node_db]` `path` directory. For example:

```sh
sudo mkdir -p /var/lib/xrpld/db-bak
mv /var/lib/xrpld/db/state* /var/lib/xrpld/db-bak/
mv /var/lib/xrpld/db/nudb /var/lib/xrpld/db-bak/
```

Keep `wallet.db`. It holds the node key, peer reservations, and amendment votes. On a full history server, removing the store means a full resync, so back it up rather than deleting it.

{% admonition type="success" name="Tip" %}It is generally safe to delete the `xrpld` ledger store, because any individual server can re-download ledger history from other servers in the XRP Ledger network.{% /admonition %}

Alternatively, you can change the paths to the databases in the config file. For example:

```
[node_db]
type=NuDB
path=/var/lib/xrpld/custom_nudb_path

[database_path]
/var/lib/xrpld/custom_sqlite_db_path
```


## Online Delete is Less Than Ledger History

An error message such as the following indicates that the `xrpld.cfg` file has contradictory values for `[ledger_history]` and `online_delete`.

```text
terminate called after throwing an instance of 'std::runtime_error'
  what():  online_delete must not be less than ledger_history (currently 3000)
```

The `[ledger_history]` setting represents how many ledgers of history the server should seek to back-fill. The `online_delete` field (in the `[node_db]` stanza) indicates how many ledgers of history to keep when dropping older history. The `online_delete` value must be equal to or larger than `[ledger_history]` to prevent the server from deleting historical ledgers that it is also trying to download.

To fix the problem, edit the `xrpld.cfg` file and change or remove either the `[ledger_history]` or `online_delete` options. (If you omit `[ledger_history]`, it uses a default of 256 ledger versions. If you specify the `online_delete` field, it must be at least 256. If you omit `online_delete`, it disables automatic deletion of old ledger versions.)


## Bad node_size value

An error such as the following indicates that the `xrpld.cfg` file has an improper value for the `node_size` setting:

```text
terminate called after throwing an instance of 'beast::BadLexicalCast'
  what():  std::bad_cast
```

Valid parameters for the `node_size` field are `tiny`, `small`, `medium`, `large`, or `huge` (case doesn't matter). A number from 0 to 4 also works, and larger numbers are treated as 4; only a word that isn't one of the five names produces this error. For more information see [Node Size](../prerequisites/capacity-planning.md#node-size).


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Technical FAQ](/about/faq.md)
- **Tutorials:**
    - [Understanding Log Messages](understanding-log-messages.md)
    - [Capacity Planning](../prerequisites/capacity-planning.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

<!-- SPELLING_IGNORE: cfg, node_size -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}

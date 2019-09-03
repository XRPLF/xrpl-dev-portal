# rippled Server Won't Start

This page explains possible reasons [the `rippled` server](the-rippled-server.html) does not start and how to fix them.

These instructions assume you have [installed `rippled`](install-rippled.html) on a supported platform.


## File Descriptors Limit

On some Linux variants, you may get an error message such as the following when trying to run `rippled`:

```text
WARNING: There are only 1024 file descriptors (soft limit) available, which
limit the number of simultaneous connections.
```

This occurs because the system has a security limit on the number of files a single process may open, but the limit is set too low for `rippled`. To fix the problem, **root access is required**. Increase the number of files `rippled` is allowed to open with the following steps:

1. Add the following lines to the end of your `/etc/security/limits.conf` file:

        *                soft    nofile          65536
        *                hard    nofile          65536

2. Check that the [hard limit on number of files that can be opened](https://ss64.com/bash/ulimit.html) is now `65536`:

        ulimit -Hn

    The command should output `65536`.

3. Try starting `rippled` again.

        systemctl start rippled

4. If `rippled` still does not start, open `/etc/sysctl.conf` and append the following kernel-level setting:

        fs.file-max = 65536


## Failed to open /etc/opt/ripple/rippled.cfg

If `rippled` crashes on startup with an error such as the following, it means that `rippled` cannot read its config file:

```text
Loading: "/etc/opt/ripple/rippled.cfg"
Failed to open '"/etc/opt/ripple/rippled.cfg"'.
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/opt/ripple"'
Aborted (core dumped)
```

Possible solutions:

- Check that the config file exists (the default location is `/etc/opt/ripple/rippled.cfg`) and the user that runs your `rippled` process (usually `rippled`) has read permissions to the file.

- Create a config file that can be read by the `rippled` user at `$HOME/.config/ripple/rippled.cfg` (where `$HOME` points to the `rippled` user's home directory).

    **Tip:** The `rippled` repository contains [an example `rippled.cfg` file](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) which is provided as the default config when you do an RPM installation. If you do not have the file, you can copy it from there.

- Specify the path to your preferred config file using the `--conf` [commandline option](commandline-usage.html).

## Failed to open validators file

If `rippled` crashes on startup with an error such as the following, it means it can read its primary config file, but that config file specifies a separate validators config file (typically named `validators.txt`), which `rippled` cannot read.

```text
Loading: "/home/rippled/.config/ripple/rippled.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'The file specified in [validators_file] does not exist: /home/rippled/.config/ripple/validators.txt'
Aborted (core dumped)
```

Possible solutions:

- Check that the `[validators.txt]` file exists and the `rippled` user has permissions to read it.

    **Tip:** The `rippled` repository contains [an example `validators.txt` file](https://github.com/ripple/rippled/blob/master/cfg/validators-example.txt) which is provided as the default config when you do an RPM installation. If you do not have the file, you can copy it from there.

- Edit your `rippled.cfg` file and modify the `[validators_file]` setting to have the correct path to your `validators.txt` (or equivalent) file. Check for extra whitespace before or after the filename.

- Edit your `rippled.cfg` file and remove the `[validators_file]` setting. Add validator settings directly to your `rippled.cfg` file. For example:

        [validator_list_sites]
        https://vl.ripple.com

        [validator_list_keys]
        ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734


## Cannot create database path

If `rippled` crashes on startup with an error such as the following, it means the server does not have write permissions to the `[database_path]` from its config file.

```text
Loading: "/home/rippled/.config/ripple/rippled.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/lib/rippled/db"'
Aborted (core dumped)
```

The paths to the configuration file (`/home/rippled/.config/ripple/rippled.cfg`) and the database path (`/var/lib/rippled/db`) may vary depending on your system.

Possible solutions:

- Run `rippled` as a different user that has write permissions to the database path printed in the error message.

- Edit your `rippled.cfg` file and change the `[database_path]` setting to use a path that the `rippled` user has write permissions to.

- Grant the `rippled` user write permissions to the configured database path.


## State DB Error

The following error can occur if the `rippled` server's state database is corrupted. This can occur as the result of being shutdown unexpectedly, or if you change the type of database from RocksDB to NuDB without changing the `path` and `[database_path]` settings in the config file.

```text
2018-Aug-21 23:06:38.675117810 SHAMapStore:ERR state db error:
  writableDbExists false archiveDbExists false
  writableDb '/var/lib/rippled/db/rocksdb/rippledb.11a9' archiveDb '/var/lib/rippled/db/rocksdb/rippledb.2d73'

To resume operation, make backups of and remove the files matching /var/lib/rippled/db/state* and contents of the directory /var/lib/rippled/db/rocksdb

Terminating thread rippled: main: unhandled St13runtime_error 'state db error'
```

The easiest way to fix this problem is to delete the databases entirely. You may want to back them up elsewhere instead. For example:

```sh
mv /var/lib/rippled/db /var/lib/rippled/db-bak
```

Or, if you are sure you don't need the databases:

```sh
rm -r /var/lib/rippled/db
```

**Tip:** It is generally safe to delete the `rippled` databases, because any individual server can re-download ledger history from other servers in the XRP Ledger network.

Alternatively, you can change the paths to the databases in the config file. For example:

```
[node_db]
type=NuDB
path=/var/lib/rippled/custom_nudb_path

[database_path]
/var/lib/rippled/custom_sqlite_db_path
```


## Online Delete is Less Than Ledger History

An error message such as the following indicates that the `rippled.cfg` file has contradictory values for `[ledger_history]` and `online_delete`.

```text
Terminating thread rippled: main: unhandled St13runtime_error 'online_delete must not be less than ledger_history (currently 3000)
```

The `[ledger_history]` setting represents how many ledgers of history the server should seek to back-fill. The `online_delete` field (in the `[node_db]` stanza) indicates how many ledgers of history to keep when dropping older history. The `online_delete` value must be equal to or larger than `[ledger_history]` to prevent the server from deleting historical ledgers that it is also trying to download.

To fix the problem, edit the `rippled.cfg` file and change or remove either the `[ledger_history]` or `online_delete` options. (If you omit `[ledger_history]`, it defaults to 256 ledger versions, so `online_delete`, if present, must be larger than 256. If you omit `online_delete`, it disables automatic deletion of old ledger versions.)


## Bad node_size value

An error such as the following indicates that the `rippled.cfg` file has an improper value for the `node_size` setting:

```text
Terminating thread rippled: main: unhandled N5beast14BadLexicalCastE 'std::bad_cast'
```

Valid parameters for the `node_size` field are `tiny`, `small`, `medium`, `large`, or `huge`. For more information see [Node Size](capacity-planning.html#node-size).


## Shard path missing

An error such as the following indicates that the `rippled.cfg` has an incomplete [history sharding](history-sharding.html) configuration:

```text
Terminating thread rippled: main: unhandled St13runtime_error 'shard path missing'
```

If your config includes a `[shard_db]` stanza, it must contain a `path` field, which points to a directory where `rippled` can write the data for the shard store. This error means the `path` field is missing or located in the wrong place. Check for extra whitespace or typos in your config file, and compare against the [Shard Configuration Example](configure-history-sharding.html#2-edit-rippledcfg).

## Unsupported shard store type: RocksDB

RocksDB is no longer supported as a backend for [history sharding](history-sharding.html). If you have an existing configuration that defines a RocksDB shard store, the server fails to start. [New in: rippled 1.3.1][]

In this case, the process dies shortly after the log startup command, with a message such as the following appearing earlier in the output log:

```text
ShardStore:ERR Unsupported shard store type: RocksDB
```


To fix this problem, do one of the following, then restart the server:

- Change your shard store to use NuDB instead.
- Disable history sharding.


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Technical FAQ](technical-faq.html)
- **Tutorials:**
    - [Understanding Log Messages](understanding-log-messages.html)
    - [Capacity Planning](capacity-planning.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

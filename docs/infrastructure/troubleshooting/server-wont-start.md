---
html: server-wont-start.html
parent: troubleshoot-the-xrpld-server.html
seo:
    description: A collection of problems that would cause an xrpld server not to start, and how to fix them.
labels:
  - Core Server
---
# xrpld Server Won't Start

This page explains possible reasons [the `xrpld` server](../../concepts/networks-and-servers/index.md) does not start and how to fix them.

These instructions assume you have [installed `xrpld`](../installation/index.md) on a supported platform.


## File Descriptors Limit

On some Linux variants, you may get an error message such as the following when trying to run `xrpld`:

```text
WARNING: There are only 1024 file descriptors (soft limit) available, which
limit the number of simultaneous connections.
```

This occurs because the system has a security limit on the number of files a single process may open, but the limit is set too low for `xrpld`. To fix the problem, **root access is required**. Increase the number of files `xrpld` is allowed to open with the following steps:

1. Add the following lines to the end of your `/etc/security/limits.conf` file:

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

4. If `rippled` still does not start, open `/etc/sysctl.conf` and append the following kernel-level setting:

    ```
    fs.file-max = 65536
    ```


## Failed to open /etc/xrpld/xrpld.cfg

If `xrpld` crashes on startup with an error such as the following, it means that `xrpld` cannot read its config file:

```text
Loading: "/etc/xrpld/xrpld.cfg"
Failed to open '"/etc/xrpld/xrpld.cfg"'.
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/opt/ripple"'
Aborted (core dumped)
```

Possible solutions:

- Check that the config file exists (the default location is `/etc/xrpld/xrpld.cfg`) and the user that runs your `rippled` process (usually `rippled`) has read permissions to the file.

- Create a config file that can be read by the `xrpld` user at `$HOME/.config/xrpld/xrpld.cfg` (where `$HOME` points to the `xrpld` user's home directory).

    {% admonition type="success" name="Tip" %}The `rippled` repository contains {% source-link name="an example xrpld.cfg file" path="cfg/xrpld-example.cfg" /%} which is provided as the default config when you do an installation from a binary package. If you do not have the file, you can copy it from there.{% /admonition %}

- Specify the path to your preferred config file using the `--conf` [commandline option](../commandline-usage.md).

## Failed to open validators file

If `xrpld` crashes on startup with an error such as the following, it means it can read its primary config file, but that config file specifies a separate validators config file (typically named `validators.txt`), which `xrpld` cannot read.

```text
Loading: "/home/rippled/.config/xrpld/xrpld.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'The file specified in [validators_file] does not exist: /home/rippled/.config/xrpld/validators.txt'
Aborted (core dumped)
```

Possible solutions:

- Check that the `validators.txt` file exists and the `xrpld` user has permissions to read it.

    {% admonition type="success" name="Tip" %}The `rippled` repository contains {% source-link name="an example validators.txt file" path="cfg/validators-example.txt" /%} which is provided as the default config when you do an installation from a binary package. If you do not have the file, you can copy it from there.{% /admonition %}

- Edit your `xrpld.cfg` file and modify the `[validators_file]` setting to have the correct path to your `validators.txt` (or equivalent) file. Check for extra whitespace before or after the filename.

- Edit your `xrpld.cfg` file and remove the `[validators_file]` setting. Add validator settings directly to your `xrpld.cfg` file. For example:

    ```
    [validator_list_sites]
    https://vl.ripple.com

    [validator_list_keys]
    ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
    ```


## Cannot create database path

If `xrpld` crashes on startup with an error such as the following, it means the server does not have write permissions to the `[database_path]` from its config file.

```text
Loading: "/home/rippled/.config/xrpld/xrpld.cfg"
Terminating thread rippled: main: unhandled St13runtime_error 'Can not create "/var/lib/xrpld/db"'
Aborted (core dumped)
```

The paths to the configuration file (`/home/rippled/.config/xrpld/xrpld.cfg`) and the database path (`/var/lib/xrpld/db`) may vary depending on your system.

Possible solutions:

- Run `xrpld` as a different user that has write permissions to the database path printed in the error message.

- Edit your `xrpld.cfg` file and change the `[database_path]` setting to use a path that the `xrpld` user has write permissions to.

- Grant the `xrpld` user write permissions to the configured database path.


## State DB Error

The following error can occur if the `xrpld` server's state database is corrupted. This can occur as the result of being shutdown unexpectedly, or if you change the type of database from RocksDB to NuDB without changing the `path` and `[database_path]` settings in the config file.

```text
2018-Aug-21 23:06:38.675117810 SHAMapStore:ERR state db error:
  writableDbExists false archiveDbExists false
  writableDb '/var/lib/xrpld/db/rocksdb/rippledb.11a9' archiveDb '/var/lib/xrpld/db/rocksdb/rippledb.2d73'

To resume operation, make backups of and remove the files matching /var/lib/xrpld/db/state* and contents of the directory /var/lib/xrpld/db/rocksdb

Terminating thread rippled: main: unhandled St13runtime_error 'state db error'
```

The easiest way to fix this problem is to delete the databases entirely. You may want to back them up elsewhere instead. For example:

```sh
mv /var/lib/xrpld/db /var/lib/xrpld/db-bak
```

Or, if you are sure you don't need the databases:

```sh
rm -r /var/lib/xrpld/db
```

{% admonition type="success" name="Tip" %}It is generally safe to delete the `xrpld` databases, because any individual server can re-download ledger history from other servers in the XRP Ledger network.{% /admonition %}

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
Terminating thread rippled: main: unhandled St13runtime_error 'online_delete must not be less than ledger_history (currently 3000)
```

The `[ledger_history]` setting represents how many ledgers of history the server should seek to back-fill. The `online_delete` field (in the `[node_db]` stanza) indicates how many ledgers of history to keep when dropping older history. The `online_delete` value must be equal to or larger than `[ledger_history]` to prevent the server from deleting historical ledgers that it is also trying to download.

To fix the problem, edit the `xrpld.cfg` file and change or remove either the `[ledger_history]` or `online_delete` options. (If you omit `[ledger_history]`, it uses a default of 256 ledger versions. If you specify the `online_delete` field, it must be larger than 256. If you omit `online_delete`, it disables automatic deletion of old ledger versions.)


## Bad node_size value

An error such as the following indicates that the `xrpld.cfg` file has an improper value for the `node_size` setting:

```text
Terminating thread rippled: main: unhandled N5beast14BadLexicalCastE 'std::bad_cast'
```

Valid parameters for the `node_size` field are `tiny`, `small`, `medium`, `large`, or `huge`. For more information see [Node Size](../installation/capacity-planning.md#node-size).


## See Also

- **Concepts:**
    - [The `xrpld` Server](../../concepts/networks-and-servers/index.md)
    - [Technical FAQ](/about/faq.md)
- **Tutorials:**
    - [Understanding Log Messages](understanding-log-messages.md)
    - [Capacity Planning](../installation/capacity-planning.md)
- **References:**
    - [xrpld API Reference](../../references/http-websocket-apis/index.md)
        - [`xrpld` Commandline Usage](../commandline-usage.md)
        - [server_info method][]

<!-- SPELLING_IGNORE: cfg, node_size -->

{% raw-partial file="/docs/_snippets/common-links.md" /%}

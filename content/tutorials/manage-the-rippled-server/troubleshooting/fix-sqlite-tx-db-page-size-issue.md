# Fix SQLite Transaction Database Page Size Issue

`rippled` servers with full [ledger history](ledger-history.html) (or a very large amount of transaction history) and a database that was initially created with a `rippled` version earlier than 0.40.0 (released January 2017) may encounter a problem with their SQLite database page size that stops the server from operating properly. Servers that store only recent transaction history (the default configuration) and servers whose database files were created with `rippled` version 0.40.0 and later are not likely to encounter this problem.

This document describes steps to detect and correct this problem if it occurs.

## Background

`rippled` servers store a copy of their transaction history in a SQLite database. Before version 0.40.0, `rippled` configured this database to have a capacity of roughly 2TB. For most uses, this is plenty. However, full transaction history back to ledger 32570 (the oldest ledger version available in the production XRP Ledger history) is likely to exceed this exceed the SQLite database capacity. `rippled` servers version 0.40.0 and later create their SQLite database files with a larger capacity, so they are unlikely to encounter this problem.

The capacity of the SQLite database is a result of the database's _page size_ parameter, which cannot be easily changed after the database is created. (For more information on SQLite's internals, see [the official SQLite documentation](https://www.sqlite.org/fileformat.html).) The database can reach its capacity even if there is still free space on the disk and filesystem where it is stored. As described in the [Fix](#fix) below, reconfiguring the page size to avoid this problem requires a somewhat time-consuming migration process.

**Tip:** Full history is not necessary to operate a `rippled` server for most use cases. Servers with full transaction history may be useful for long-term analysis and archive purposes or as a precaution against disasters. For a less resource-intense way to contribute to the storage of transaction history, see [History Sharding](history-sharding.html).


## Detection

If your server is vulnerable to this problem, you can detect it two ways:

- You can detect the problem [proactively](#proactive-detection) (before it causes problems) if your `rippled` server is [version 1.1.0][New in: rippled 1.1.0] or later.
- You can identify the problem [reactively](#reactive-detection) (when your server is crashing) on any `rippled` version.

In both cases, detection of the problem requires access to `rippled`'s server logs.

**Tip:** The location of the debug log depends on your `rippled` server's config file. The [default configuration](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg#L1139-L1142) writes the server's debug log to the file `/var/log/rippled/debug.log`.

### Proactive Detection

To detect the SQLite page size problem proactively, you must be running **[rippled 1.1.0][New in: rippled 1.1.0] or later**. The `rippled` server writes a message such as the following in its debug log periodically, at least once every 2 minutes. (The exact numeric values from the log entry and the path to your transaction database depend on your environment.)

```text
Transaction DB pathname: /opt/rippled/transaction.db; SQLite page size: 1024
  bytes; Free pages: 247483646; Free space: 253423253504 bytes; Note that this
  does not take into account available disk space.
```

The value `SQLite page size: 1024 bytes` indicates that your transaction database is configured with a smaller page size and does not have capacity for full transaction history. If the value is already 4096 bytes or higher, then your SQLite database should already have adequate capacity to store full transaction history and you do not need to perform the migration described in this document.

The `rippled` server halts if the `Free space` described in this log message becomes less than 524288000 bytes (500MB). If your free space is approaching that threshold, [fix the problem](#fix) to avoid an unexpected outage.

### Reactive Detection

If your server's SQLite database capacity has already been exceeded, the `rippled` service writes a log message indicating the problem and halts.

#### rippled 1.1.0 and Later

On `rippled` versions 1.1.0 and later, the server shuts down gracefully with a message such as the following in the server's debug log:

```text
Free SQLite space for transaction db is less than 512MB. To fix this, rippled
  must be executed with the vacuum <sqlitetmpdir> parameter before restarting.
  Note that this activity can take multiple days, depending on database size.
```

#### Earlier than rippled 1.1.0

On `rippled` versions before 1.1.0, the server crashes repeatedly with messages such as the following in the server's debug log:

```text
Terminating thread doJob: AcquisitionDone: unhandled
  N4soci18sqlite3_soci_errorE 'sqlite3_statement_backend::loadOne: database or
  disk is full while executing "INSERT INTO [...]
```


## Fix

You can fix this issue using `rippled` on supported Linux systems according to the steps described in this document. In the case of a full-history server with system specs approximately matching the [recommended hardware configuration](capacity-planning.html#recommendation-1), the process may take more than two full days.

### Prerequisites

- You must be running **[rippled version 1.1.0][New in: rippled 1.1.0] or later**.

    - [Upgrade rippled](install-rippled.html) to the latest stable version before starting this process.

    - You can check what version of `rippled` you have installed locally by running the following command:

            rippled --version

- You must have enough free space to temporarily store a second copy of the transaction database, in a directory that is writable by the `rippled` user. This free space does not need to be in the same filesystem as the existing transaction database.

    The transaction database is stored in the `transaction.db` file in the folder specified by your configuration's `[database_path]` setting. You can check the size of this file to see how much free space you need. For example:

        ls -l /var/lib/rippled/db/transaction.db

### Migration Process

To migrate your transaction database to a larger page size, perform the following steps:

1. Check that you meet all the [prerequisites](#prerequisites).

2. Create a folder to store temporary files during the migration process.

        mkdir /tmp/rippled_txdb_migration

3. Grant the `rippled` user ownership of the temporary folder so it can write files there. (This is not necessary if your temporary folder is somewhere the `rippled` user already has write access to.)

        chown rippled /tmp/rippled_txdb_migration

4. Confirm that your temporary folder has enough free space to store a copy of the transaction database.

    For example, compare the `Avail` output from the `df` command to the [size of your `transaction.db` file](#prerequisites).

        df -h /tmp/rippled_txdb_migration

        Filesystem      Size  Used Avail Use% Mounted on
        /dev/sda2       5.4T  2.6T  2.6T  50% /tmp

5. If `rippled` is still running, stop it:

        sudo systemctl stop rippled

6. Open a `screen` session (or other similar tool) so that the process does not stop when you log out:

        screen

7. Become the `rippled` user:

        sudo su - rippled

8. Run `rippled` executable directly, providing the `--vacuum` command with the path to the temporary directory:

        /opt/ripple/bin/rippled -q --vacuum /tmp/rippled_txdb_migration

    The `rippled` executable immediately displays the following message:

        VACUUM beginning. page_size: 1024

9. Wait for the process to complete. This can take more than two full days.

    When the process is complete, the `rippled` executable displays the following message, then exits:

        VACUUM finished. page_size: 4096

    While you wait, you can detach your `screen` session by pressing **CTRL-A**, then **D**. Later, you can reattach your screen session with a command such as the following:

        screen -x -r

    When the process is over, exit the screen session:

        exit

    For more information on the `screen` command, see [the official Screen User's Manual](https://www.gnu.org/software/screen/manual/screen.html) or any of the other many resources available online.

10. Restart the `rippled` service.

        sudo systemctl start rippled

11. Confirm that the `rippled` service started successfully.

    You can use the [commandline interface](get-started-with-the-rippled-api.html#commandline) to check the server status (unless you have configured your server not to accept JSON-RPC requests). For example:

        /opt/ripple/bin/rippled server_info

    For a description of the expected response from this command, see the [server_info method][] documentation.

12. Watch the server's debug log to confirm that the `SQLite page size` is now 4096:

        tail -F /var/log/rippled/debug.log

    The [periodic log message](#proactive-detection) should also show significantly more free pages and free pages than it did before the migration.

13. Optionally, you may now remove the temporary folder you created for the migration process.

        rm -r /tmp/rippled_txdb_migration

    If you mounted additional storage to hold the temporary copy of the transaction database, you can unmount and remove it now.


## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Ledger History](ledger-history.html)
- **Tutorials:**
    - [Understanding Log Messages](understanding-log-messages.html)
    - [Configure Full History](configure-full-history.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

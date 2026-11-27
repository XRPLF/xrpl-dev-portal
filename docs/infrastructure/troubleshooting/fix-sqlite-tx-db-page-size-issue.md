---
html: fix-sqlite-tx-db-page-size-issue.html
parent: troubleshoot-the-xrpld-server.html
seo:
    description: Check and fix the SQLite transaction database size ceiling on servers with large transaction history.
labels:
  - Core Server
---
# Fix SQLite Transaction Database Page Size

An `xrpld` (formerly `rippled`) server's transaction database (`transaction.db`) has a hard maximum size, fixed by the SQLite **page size** chosen when the database file is first created. The server raises the page *count* limit automatically, but the page size itself can't change without rebuilding the database - so the ceiling is set on day one, and nothing reminds you of it until the server stops.

- At the default page size (4096 bytes), the ceiling is about **17.6 TB**.
- At the maximum page size (65536), the ceiling is about **281 TB**.

Servers that keep the default amount of transaction history never approach these numbers. Servers with [full history](../configuration/data-retention/configure-full-history.md), or years of large retention, do: in 2026 one production full history deployment measured its `transaction.db` at **68% of the default ceiling**. The server gives no early warning. When less than 512 MB of page headroom is left it logs a fatal message and stops cleanly, and it stays down until you rebuild the database:

```text
SQLiteDatabase:FTL Free SQLite space for transaction db is less than 512MB. To fix this, xrpld must be executed with the vacuum parameter before restarting. Note that this activity can take multiple days, depending on database size.
Application:WRN Server stopping: Out of transaction DB space
```

The exit status is 0, so a `systemd` unit with `Restart=on-failure` doesn't restart it. Treat the ceiling minus 512 MB as your practical limit.

This page shows how to check your ceiling and, if you need to, how to rebuild the database at a larger page size using the server's built-in `--vacuum` mode.

## Check your ceiling

On the server (the database directory is your `[database_path]`):

```
$ sqlite3 /var/lib/xrpld/db/transaction.db "PRAGMA page_size;"
4096
$ ls -l /var/lib/xrpld/db/transaction.db
```

Your maximum database size in bytes is `page_size x 4,294,967,294`. Compare the file's current size against it:

| Page size | Ceiling |
|:----------|:--------|
| 4096 (default) | ~17.6 TB |
| 8192 | ~35.2 TB |
| 16384 | ~70.4 TB |
| 32768 | ~141 TB |
| 65536 | ~281 TB |

If you run large retention, put this check in your monitoring and alert on projected runway, the same way you watch free disk; see [Full History Best Practices](../configuration/best-practices/full-history.md#watch-the-ceilings).

## Prevention: set the page size before first start

If you are building a server that will hold deep history, set the page size in the config **before the server ever creates its databases**:

```
[sqlite]
page_size=32768
```

The value must be a power of two between 512 and 65536. The setting applies when the database is first created (server versions 2.3.0 and later; databases created by older versions are 4096 regardless of config). On an existing database this setting alone does nothing - only a rebuild applies it.

## Fix: rebuild with `--vacuum`

The server has a built-in rebuild mode that runs SQLite's `VACUUM` on `transaction.db`, applying the page size from your config. A larger page size only raises the SQLite limit; the filesystem must also allow a file that big. ext4 with 4 KiB blocks caps a single file at 16 TiB, which is the same as the default ceiling, so on ext4 the rebuild buys nothing: use XFS or ZFS, as [Full History System Requirements](../prerequisites/system-requirements/full-history.md) says for the ledger store. Verified behavior and requirements:

- **Set `journal_mode=delete` in `[sqlite]` for the vacuum run.** SQLite doesn't change the page size of a database in WAL mode (the server's default), so a vacuum without this produces a rebuilt database with the **old** page size and no error. Remove the setting again after the rebuild so the server returns to its normal journal mode. (Both behaviors confirmed by the XRPLF's technical team.)
- Plan for **about twice the database's current size in free space** (the SQLite documentation says "as much as twice"). The server's own pre-check only enforces 1x on the database filesystem, and it forces temporary files onto disk. SQLite uses the first of these that exists and is writable: `SQLITE_TMPDIR`, `TMPDIR`, `/var/tmp`, `/usr/tmp`, `/tmp`. That is usually the root filesystem, or the container's own layer if you run in Docker. Before you start, point `SQLITE_TMPDIR` at a directory with at least 1x the database size free, writable by the service account (step 4 shows how).
- The server is **offline for the entire rebuild**. At multi-terabyte sizes this is a long window: plan it like any major maintenance, and on a multi-server deployment do one server at a time.
- Not available in standalone mode.

Procedure:

1. Rehearse on your smallest affected server first.
2. Add (or change) the `[sqlite]` stanza in the config, including the journal mode for this run:

    ```
    [sqlite]
    page_size=32768
    journal_mode=delete
    ```

3. Stop the server:

    ```
    $ sudo systemctl stop xrpld
    ```

4. Run the vacuum as the service account, with the temporary directory on a volume that has room, and wait for it to complete. The packaged service runs as `xrpld` with its state directory at mode 0750; a rebuild run as root leaves root-owned files that the service may not be able to open or roll back, and the database and temporary directories must both be writable by that account:

    ```
    $ sudo -u xrpld env SQLITE_TMPDIR=/mnt/scratch /usr/bin/xrpld --conf /etc/xrpld/xrpld.cfg --vacuum
    ```

5. The vacuum prints its own result. Check that the second line shows the new size:

    ```text
    VACUUM beginning. page_size: 4096
    VACUUM finished. page_size: 32768
    ```

    If both lines show the old size, the database was still in WAL mode and nothing changed (SQLite's VACUUM documentation: in WAL mode only `auto_vacuum` can be changed). Confirm the page size, remove the `journal_mode` line from `[sqlite]`, then start the server normally:

    ```
    $ sqlite3 /var/lib/xrpld/db/transaction.db "PRAGMA page_size;"
    32768
    $ sudo systemctl start xrpld
    ```

## See Also

- [Configure Full History](../configuration/data-retention/configure-full-history.md)
- [Full History System Requirements](../prerequisites/system-requirements/full-history.md)
- [Full History Best Practices](../configuration/best-practices/full-history.md)

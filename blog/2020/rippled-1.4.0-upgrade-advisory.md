---
category: 2020
date: 2020-01-13
labels:
    - Advisories
theme:
    markdown:
        editPage:
            hide: true
---
# XRP Ledger version 1.4.0 Upgrade Advisory

Version 1.4.0 of the XRP Ledger core server (`rippled`) contains a change that can cause upgrades to take much longer than usual.

When upgrading to version 1.4.0, `rippled` automatically reorganizes its SQL databases to remove some unused data. This happens during startup the first time the server runs after upgrading to 1.4.0. The SQL reorganization should complete within 10 to 20 minutes for most servers. For servers that have been running for longer than a few months, the operation may take significantly longer. During this time, your server will not be usable.

Plan accordingly for the time that this upgrade may take.

If you currently use a single `rippled` server, consider instead running two or more independent `rippled` servers to avoid downtime while one server is being upgraded. (Do not run more than one validator.)

## Database Reorganization Details

Previous releases stored data in a "Validations" table in the SQLite data store. This data is not needed, so `rippled` 1.4.0 drops (deletes) the Validations table, if it exists. Dropping the Validations table can take many, many hours, depending on how large the Validations table is. This varies based on the server's configuration and how long it has been collecting past history. During this time, the rippled server is unable to operate or serve requests.

If needed, a workaround is possible. However, we do not recommend this procedure if you are not familiar with sqlite3.

## Workaround

The following workaround can reduce `rippled`'s initial startup time after upgrading to version 1.4.0. It requires making changes to one of the SQL databases maintained by the server. Instead of deleting the unneeded data, this workaround renames the table. The old data continues to take up disk space on the server.

{% admonition type="danger" name="WARNING" %}
We do not recommend this procedure to anyone not familiar with sqlite3.
{% /admonition %}

1. Install the required tool: `sqlite3`. This is operating-system dependent.
    
    On Ubuntu you can use the following commands:

    ```sh
    sudo apt-get update
    sudo apt-get install sqlite3
    ```

2. Stop your `rippled` instance.

    This is operating-system dependent. On Linux, you can use the following commands:

    ```sh
    sudo systemctl stop rippled.service
    ```

3. Read your configuration file and find the `[database_path]` stanza.

    On Linux, the configuration file is usually located at `/opt/ripple/etc/rippled.cfg`.
    
    The directory in the `[database_path]` stanza is where your server stores its SQL databases.
    
4. Change to a user that has permissions to read and write files in the SQL database directory you found in the previous step. 

    On Linux, you can use the `sudo -i` command.
    
5. Open the `ledger.db` file using the SQLite commandline:
    
    ```sh
    sqlite3 ledger.db
    ```
    
6. Execute the following command (the trailing semicolon is required):

    ```sql
    ALTER TABLE Validations RENAME TO OldValidations;
    ```
    
7. Execute the following command (the leading period is required):

    ```text
    .quit
    ```

8. You should now be able to start `rippled` without experiencing any delay.

    ```sh
    sudo systemctl start rippled.service
    ```

For general instructions on upgrading `rippled` on supported platforms, see [Install `rippled`](https://xrpl.org/install-rippled.html).

## Learn, ask questions, and discuss

To receive email updates whenever there are important releases or changes to the XRP Ledger server software subscribe to the [ripple-server Google Group](https://groups.google.com/forum/#!forum/ripple-server).

Related documentation is available in the [XRP Ledger Dev Portal](https://xrpl.org/), including detailed example API calls and web tools for API testing.

Other resources:

* [The XRP Ledger Dev Blog](https://xrpl.org/blog/)
* Ripple Technical Services: <support@ripple.com>
* [XRP Chat Forum](http://www.xrpchat.com/)

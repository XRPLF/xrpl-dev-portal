---
html: configure-advisory-deletion.html
parent: data-retention.html
seo:
    description: Use advisory deletion to delete older ledger history on a schedule rather than as new history becomes available.
labels:
  - Core Server
  - Data Retention
---
# Configure Advisory Deletion

The default config file sets [`xrpld`](../../../concepts/networks-and-servers/index.md) to automatically delete outdated [history](../../../concepts/networks-and-servers/ledger-history.md) of XRP Ledger state and transactions as new ledger versions become available. If your server uses most of its hardware resources during peak hours, you can configure the server to delete ledgers only when prompted by a command scheduled to run during off-peak hours, so that online deletion is less likely to impact [server performance](../../prerequisites/capacity-planning.md).

## Prerequisites

This tutorial assumes your server meets the following prerequisites:

- You are on a supported operating system: Ubuntu Linux, Red Hat Enterprise Linux (RHEL), or CentOS.

- The `xrpld` server is already [installed](../../installation/index.md) and [online deletion](online-deletion.md) is enabled.

    The default config file enables online deletion after 512 ledger versions.

- A `cron` daemon is installed and running.

    Ubuntu Linux runs a `cron` daemon by default.

    On RHEL or CentOS, you can install the `cronie` package:

    ```
    $ sudo yum install cronie
    ```

- Your server has enough disk space to store your chosen amount of history in its ledger store.

    See [Capacity Planning](../../prerequisites/capacity-planning.md) for details of how much storage is required for different configurations. With advisory deletion enabled, a rotation runs only after at least `online_delete` ledger versions have passed since the last one. Just before it runs, the server holds about two of those periods, so plan for at least twice the `online_delete` value in ledger versions. If you prompt less often than that, the periods are longer, and the disk figure grows with them.

- You know which hours are least busy for your server.

## Configuration Steps

To configure advisory deletion with a daily schedule, perform the following steps:

1. Enable `advisory_delete` in the `[node_db]` stanza of your `xrpld`'s config file.

    ```
    [node_db]
    # Other settings unchanged ...
      online_delete=300000
      advisory_delete=1
    ```

    - Set `advisory_delete` to `1` to run online deletion only when prompted. (Set it to `0` to run online deletion automatically as new ledger versions become available.)
    - Set `online_delete` to the minimum number of ledger versions to keep after running online deletion. The server accumulates more history than this until online deletion runs.

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

2. Test running the [can_delete method][] to prompt the server to run online deletion.

    You can use the [`xrpld` commandline interface](../../../tutorials/get-started/get-started-http-websocket-apis.md#commandline) to run this command. For example:

    ```
    $ xrpld --conf=/etc/xrpld/xrpld.cfg can_delete now
    ```

    The response indicates the ledger index that deletion may go up to. For `now`, that is the ledger index of the last rotation, so the number doesn't move toward the newest ledger. For example, the following message indicates that ledger versions before ledger index 43633667 can be deleted in the next rotation:

    ```
    {
      "result": {
        "can_delete": 43633667,
        "status": "success"
      }
    }
    ```

    The server only runs a rotation once the validated ledger is at least `online_delete` ledger versions past the previous rotation.

3. Configure your `cron` daemon to run the `can_delete` method you tested in the previous step at a scheduled time.

    Edit your `cron` configuration:

    ```
    $ crontab -e
    ```

    The following example sets the server to run deletion at 1:05 AM server time daily:

    ```
    5 1 * * * xrpld --conf /etc/xrpld/xrpld.cfg can_delete now
    ```

    Be sure that you schedule the command to run based on your server's configured time zone.

    With advisory deletion nothing deletes unless this job runs. If it stops (a removed crontab, a changed path, a disabled cron service), the ledger store keeps growing until the disk is full. Alert on disk usage or on the lowest ledger in `complete_ledgers` not moving for longer than your schedule.

    {% admonition type="success" name="Tip" %}You don't need to schedule a `cron` job to run online deletion if you have `advisory_delete` disabled. In that case, `xrpld` runs online deletion automatically when the validated ledger is at least `online_delete` ledger versions past the previous rotation.{% /admonition %}

4. Start (or restart) the `xrpld` service.

    ```
    $ sudo systemctl restart xrpld
    ```

5. Periodically check your server's `complete_ledgers` range using the [server_info method][] to confirm that ledgers are being deleted as scheduled.

    The lowest ledger index in `complete_ledgers` should increase after online deletion.

    Deletion may take several minutes to complete when it runs, depending on how busy your server is and how much history you delete at a time.

## Troubleshooting

If online deletion doesn't seem to be running after configuring it, try the following:

- Check that the user who configured the `cron` job has permissions to run the `xrpld` server as a commandline client.
- Check the syntax of your `cron` job and the time when it is supposed to run.
- Check that the `xrpld` executable is available at the path specified in your `cron` configuration. If necessary, specify the absolute path to the executable, such as `/usr/bin/xrpld`.
- Check your `xrpld` logs for messages that begin with `SHAMapStore:WRN`. This can indicate that [online deletion is being interrupted](online-deletion.md#interrupting-online-deletion) because your server fell out of sync with the network.

## See Also

- **Concepts:**
    - [Ledger History](../../../concepts/networks-and-servers/ledger-history.md)
        - [Online Deletion](online-deletion.md)
- **Tutorials:**
    - [Configure Online Deletion](configure-online-deletion.md)
    - [Diagnosing Problems with xrpld](../../troubleshooting/diagnosing-problems.md)
    - [Understanding Log Messages](../../troubleshooting/understanding-log-messages.md)
- **References:**
    - [server_info method][]
    - [can_delete method][]
    - [logrotate method][]
    - [Ledger Data Formats](../../../references/protocol/ledger-data/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

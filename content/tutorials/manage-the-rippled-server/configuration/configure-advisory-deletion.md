# Configure Advisory Deletion

The default config file sets [`rippled`](the-rippled-server.html) to automatically delete outdated [history](ledger-history.html) of XRP Ledger state and transactions as new ledger versions become available. If your server uses most of its hardware resources during peak hours, you can configure the server to delete ledgers only when prompted by a command scheduled to run during off-peak hours, so that online deletion is less likely to impact [server performance](capacity-planning.html).

## Prerequisites

This tutorial assumes your server meets the following prerequisites:

- You are on a supported operating system: Ubuntu Linux, Red Hat Enterprise Linux (RHEL), or CentOS.

- The `rippled` server is already [installed](install-rippled.html) and [online deletion](online-deletion.html) is enabled.

    The default config file enables online deletion after 2000 ledger versions.

- A `cron` daemon is installed and running.

    Ubuntu Linux runs a `cron` daemon by default.

    On RHEL or CentOS, you can install the `cronie` package:

        $ sudo yum install cronie

- Your server has enough disk space to store your chosen amount of history in its ledger store.

    See [Capacity Planning](capacity-planning.html) for details of how much storage is required for different configurations. With advisory deletion enabled, the maximum history a server may accumulate before deletion is equal to the number of ledger versions configured in the `online_delete` setting **plus** the amount of time between online deletion prompts.

- You know which hours are least busy for your server.

## Configuration Steps

To configure advisory deletion with a daily schedule, perform the following steps:

1. Enable `advisory_delete` in the `[node_db]` stanza of your `rippled`'s config file.

        [node_db]
        # Other settings unchanged ...
      	online_delete=2000
      	advisory_delete=1

    - Set `advisory_delete` to `1` to run online deletion only when prompted. (Set it to `0` to run online deletion automatically as new ledger versions become available.)
    - Set `online_delete` to the minimum number of ledger versions to keep after running online deletion. The server accumulates more history than this until online deletion runs.

    {% include '_snippets/conf-file-location.md' %}<!--_ -->

2. Test running the [can_delete method][] to prompt the server to run online deletion.

    You can use the [`rippled` commandline interface](get-started-with-the-rippled-api.html#commandline) to run this command. For example:

        $ rippled --conf=/etc/opt/ripple/rippled.cfg can_delete now

    The response indicates the maximum ledger index that the server may delete from its ledger store. For example, the following message indicates that ledger versions up to and including ledger index 43633667 can be deleted:

        {
          "result": {
            "can_delete": 43633667,
            "status": "success"
          }
        }

    The server only deletes those ledger versions if the number of _newer_ validated ledger versions it has is equal to or greater than the `online_delete` setting.

3. Configure your `cron` daemon to run the `can_delete` method you tested in the previous step at a scheduled time.

    Edit your `cron` configuration:

        $ crontab -e

    The following example sets the server to run deletion at 1:05 AM server time daily:

        5 1 * * * rippled --conf /etc/opt/ripple/rippled.cfg can_delete now

    Be sure that you schedule the command to run based on your server's configured time zone.

    **Tip:** You do not need to schedule a `cron` job to run online deletion if you have `advisory_delete` disabled. In that case, `rippled` runs online deletion automatically when the difference between the server's oldest and current validated ledger versions is at least the value of `online_delete`.

4. Start (or restart) the `rippled` service.

        $ sudo systemctl restart rippled

5. Periodically check your server's `complete_ledgers` range using the [server_info method][] to confirm that ledgers are being deleted as scheduled.

    The lowest ledger index in `complete_ledgers` should increase after online deletion.

    Deletion may take several minutes to complete when it runs, depending on how busy your server is and how much history you delete at a time.

## Troubleshooting

If online deletion does not seem to be running after configuring it, try the following:

- Check that the user who configured the `cron` job has permissions to run the `rippled` server as a commandline client.
- Check the syntax of your cron job and the time when it is supposed to run.
- Check that the `rippled` executable is available at the path specified in your `cron` configuration. If necessary, specify the absolute path to the executable, such as `/opt/ripple/bin/rippled`.
- Check your `rippled` logs for messages that begin with `SHAMapStore::WRN`. This can indicate that [online deletion is being interrupted](online-deletion.html#interrupting-online-deletion) because your server fell out of sync with the network.

## See Also

- **Concepts:**
    - [Ledger History](ledger-history.html)
        - [Online Deletion](online-deletion.html)
- **Tutorials:**
    - [Configure Online Deletion](configure-online-deletion.html)
    - [Diagnosing Problems with rippled](diagnosing-problems.html)
    - [Understanding Log Messages](understanding-log-messages.html)
- **References:**
    - [server_info method][]
    - [can_delete method][]
    - [logrotate method][]
    - [Ledger Data Formats](ledger-data-formats.html)

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

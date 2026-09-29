---
html: configure-online-deletion.html
parent: data-retention.html
seo:
    description: Configure how far back your server should store transaction history.
labels:
  - Core Server
  - Data Retention
---
# Configure Online Deletion

In its default configuration, [the `xrpld` server](../../../concepts/networks-and-servers/index.md) [deletes history](online-deletion.md) older than the most recent 2000 [ledger versions](../../../concepts/ledgers/index.md), keeping approximately 15 minutes of [ledger history](../../../concepts/networks-and-servers/ledger-history.md) (based on the current rate between ledgers). This page describes how to configure the amount of history your `xrpld` server stores before deleting.

## Prerequisites

This tutorial assumes your server meets the following prerequisites:

- You are on a supported operating system: Ubuntu Linux, Red Hat Enterprise Linux (RHEL), or CentOS.

- The `xrpld` server is already [installed](../../installation/index.md) and [online deletion](online-deletion.md) is enabled.

    If you followed the installation instructions for a recommended platform, online deletion is enabled by default.

- Your server has [enough disk space](../../installation/capacity-planning.md#disk-space) to store your chosen amount of history in its ledger store.


## Configuration Steps

To change the amount of history your server stores, perform the following steps:

1. Decide how many ledger versions' worth of history to store.

    New ledger versions are usually validated 3 to 4 seconds apart, so the number of ledger versions corresponds roughly to the amount of time you want to store. See [Capacity Planning](../../installation/capacity-planning.md) for details of how much storage is required for different configurations.

    Online deletion is based on how many ledger versions to keep _after_ deleting history, so you should have enough disk space to store twice as many ledgers as you set it to keep.

0. In your `xrpld`'s config file, edit the `online_delete` field of the `[node_db]` stanza.

    ```
    [node_db]
    # Other settings unchanged ...
      online_delete=500000
      advisory_delete=0
      # Optional:
      # max_waiting_ledgers=300000
    ```

    Set `online_delete` to the minimum number of ledger versions to keep after running online deletion. With automatic deletion (the default), the server typically runs deletion when it has accumulated about twice this many ledger versions.

    Optionally, you can configure `max_waiting_ledgers` to limit how long the deletion process waits for the server to resync. If additional ledgers are validated during that time, the process aborts the current attempt and retries later. The minimum is 64, and it defaults to your `online_delete` value. This limit only includes ledgers validated while waiting on a stalled rotation, not normal forward progress.

    During the deletion process, the validated ledger is verified to ensure it is not older than `age_threshold_seconds` and that all recent ledgers are available without gaps. If these checks fail, the process waits and retries after a short period (default: 2 seconds).

    {% partial file="/docs/_snippets/conf-file-location.md" /%}

1. Start (or restart) the `xrpld` service.

    ```
    $ sudo systemctl restart xrpld
    ```

2. Wait for your server to sync to the network.

    Depending on your network and system capabilities and how long your server was offline, it may take between 5 and 15 minutes to fully sync.

    When your server is synced with the network, the [server_info method][] reports a `server_state` value of `"full"`, `"proposing"`, or `"validating"`.

3. Periodically check your server's `complete_ledgers` range using the [server_info method][] to confirm that ledgers are being deleted.

    After online deletion runs, the `complete_ledgers` range reflects that older ledgers are no longer available. As your server accumulates history, the total number of ledgers available should slowly increase to twice the `online_delete` value you configured, then decrease when online deletion runs.

4. Monitor your `xrpld` logs for messages that begin with `SHAMapStore:WRN`. This can indicate that [online deletion is being interrupted](online-deletion.md#interrupting-online-deletion) because your server fell out of sync with the network, or because there are gaps in your recent ledger history.

    Normal progress also logs under the same prefix, so the prefix alone doesn't identify an issue. For descriptions of these log messages, see [Understanding Log Messages](../../troubleshooting/understanding-log-messages.md#rotating-validatedseq).

    The deletion process waits for the node to fully sync and fill any gaps. If it waits too long (specifically, if the network validates more ledgers than your `max_waiting_ledgers` limit during this pause), the deletion attempt is aborted and retried later.

    If this happens regularly, your server may not have sufficient specifications to keep up with the ledger while running online deletion. Check that other services on the same hardware (such as scheduled backups or security scans) aren't competing with the `xrpld` server for resources. You may want to try any of the following:

    - Increase your system specs. See [System Requirements](../../installation/system-requirements.md) for recommendations.
    - Change your configuration to store less history. (Step 2 of this tutorial)
    - Change your server's [`node_size` parameter](../../installation/capacity-planning.md).
    - Use [NuDB instead of RocksDB](../../installation/capacity-planning.md) for the ledger store.
    - [Schedule online deletion using Advisory Deletion](configure-advisory-deletion.md).


## See Also

- **Concepts:**
    - [Ledger History](../../../concepts/networks-and-servers/ledger-history.md)
        - [Online Deletion](online-deletion.md)
- **Tutorials:**
    - [Configure Advisory Deletion](configure-advisory-deletion.md)
    - [Capacity Planning](../../installation/capacity-planning.md)
- **References:**
    - [server_info method][]
    - [Ledger Data Formats](../../../references/protocol/ledger-data/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

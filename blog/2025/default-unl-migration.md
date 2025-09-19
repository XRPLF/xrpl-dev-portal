---
category: 2025
date: "2025-09-18"
template: '../../@theme/templates/blogpost'
seo:
    description: If you run a rippled node that uses the default UNL, you must migrate your configuration to the new XRPL Foundation's list by 2025-09-30.
labels:
    - Advisories
markdown:
    editPage:
        hide: true
---
# Default UNL Migration

As [previously announced](./move-to-the-new-xrpl-foundation-commences.md), stewardship of the XRP Ledger has moved to a new XRPL Foundation. As part of the migration, the default UNL for XRP Ledger servers is now served from a new URL and uses a new key pair. If you run a server on the XRP Ledger mainnet and uses the default UNL, you must migrate to the new UNL settings before the old UNL publisher shuts down on September 30 (2025-09-30), to maintain service continuity.

## Background

As part of the XRP Ledger's consensus process, each server is configured with a Unique Node List (UNL), which is a set of validators that it trusts not to collude. To maintain the necessary safety of the network and to balance the priorities of overlap and independence in a UNL, the XRP Ledger Foundation publishes a default UNL (dUNL) with a list of vetted, independent node operators that exist in a diverse selection of countries, data centers, and so on. Node operators are not required to use the dUNL to maintain sync with the XRP Ledger, but it is widely recommended as the safest, most reliable set of validators to trust. To ensure its integrity, the dUNL is signed with a cryptographic key pair under the control of the XRP Ledger Foundation.

As part of the migration from the old XRP Ledger Foundation to the new one, the new Foundation has begun publishing a default UNL using a new key pair from a new URL. The old Foundation is no longer publishing new dUNL updates, and the URL serving the old dUNL is scheduled to be shut down at the end of this month, on 2025-09-30.

## Action Needed

If you run a node (a core XRPL server, such as `rippled`) that uses the old dUNL, you must update your configuration to use the new key pair and URL. This is the case for most servers that connect to the XRP Ledger Mainnet and have been upgraded from `rippled` **2.3.x or lower**. If you created a fresh install with new config files using `rippled` version 2.4.0 or higher, your config files should already have the new Foundation's key and URL, so no update is needed.

{% admonition type="danger" name="Warning" %}
The standard package install does not overwrite existing configuration files, so these steps are necessary if you are carrying over a config that was created under an older version, even if you have upgraded the server software.
{% /admonition %}

This process is two steps:

1. Edit your server's `validators.txt` file. This file is typically located at `/etc/opt/ripple/validators.txt` by default. In some configurations, it could be located at `$HOME/.config/ripple/validators.txt` (where `$HOME` is the home directory of the user running `rippled`), `$HOME/.local/ripple/validators.txt`, or the current working directory from where you start the `rippled` server.

    Update the `[validator_list_keys]` and `[validator_list_sites]` sections of the config file to remove the key and URL of the old Foundation and add the key and URL of the new Foundation, as in the following table:

    |              | URL in `[validator_list_sites]` | Key in `[validator_list_keys]` |
    |--------------|-------------------------|-----|
    | Old (remove) | `https://vl.xrplf.org`  | `ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B` |
    | New (add)    | `https://unl.xrplf.org` | `ED42AEC58B701EEBB77356FFFEC26F83C1F0407263530F068C7C73D392C7E06FD1` |

    Keys and URLs for other validator publishers (such as `vl.ripple.com`) can remain the same.

    {% admonition type="success" name="Tip: HTTP vs HTTPS" %}
    The URLs can also use unsecured `http://` in case there is a problem with TLS certificates. The contents of the validator list are cryptographically signed by the key listed above, so SSL/TLS is not strictly necessarity to ensure the integrity of the contents.
    {% /admonition %}

2. Restart your server.

    ```sh
    sudo systemctl restart rippled.service
    ```

3. Confirm new settings.

    After restarting, you can use the `validators` admin command to confirm the new settings.

    ```sh
    /opt/ripple/bin/rippled validators
    ```

    If you are using a non-default configuration, change the path to your `rippled` executable as needed.

    The response should display the updated values in the `publisher_lists` key. The new list should be available with an expiration on 2026-02-13 (February 13, 2026). For example (response trimmed for length):

    ```json
    {
    "result": {
        "local_static_keys": [],
        "publisher_lists": [
        {
            "available": true,
            "expiration": "2026-Feb-13 14:15:03.000000000 UTC",
            ...
            "list": [
            ...
            ],
            "pubkey_publisher": "ED42AEC58B701EEBB77356FFFEC26F83C1F0407263530F068C7C73D392C7E06FD1",
            "seq": 1,
            "uri": "https://unl.xrplf.org",
            "version": 1
        },
        ...
        ]
        ...
    }
    ```

    For more information and troubleshooting steps, see [Configuration Guidance for Using the new UNL (discussion on rippled GitHub)](https://github.com/XRPLF/rippled/discussions/5463).

## Impact of not updating the configuration

If you do not change to the new settings, your node may stop loading the XRPL Foundation's trusted validators list on 2025-09-30 when the old URL is shut down, and your node's configured UNL will expire on 2026-01-18 (January 18, 2026). **After the list expires, your server will stop syncing with the network, but it could also lose sync as early as 2025-09-30, depending on other factors.**

- If you have a `[validator_list_threshold]` configured, validators are only trusted if they are in more than half of your configured lists. Depending on the changes in the other lists, your server may not trust enough validators to reach a consensus with the rest of the network.
- If your server only relies on the XRPL Foundation's list and does not have the old list cached, it may not be able to determine a set of trusted validators to sync with the network during startup.

### Log Messages

You may see log messages such as the following in your server log:

```text
WRN:Ignored 1 stale validator list(s) from https://vl.ripple.com
WRN:Ignored 1 untrusted validator list(s) from https://unl.ripple.com
```

Updating the config with the new key and site should stop or reduce the log messages.

### Validator stuck in full state

If you have a validator whose server state stays as `full` instead of `proposing`, it could be a symptom that your configuration is not updated appropriately. In this case, the response from the `server_info` command shows a very high validation quorum value:

```json
"validation_quorum": 4294967295,
```

Updating the config with the new key and site should fix the problem.

## Next Steps

For more information and troubleshooting steps, see [Configuration Guidance for Using the new UNL (discussion on rippled GitHub)](https://github.com/XRPLF/rippled/discussions/5463).

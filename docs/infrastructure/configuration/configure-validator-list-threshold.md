---
seo:
    description: Set the minimum number of UNL publisher lists a validator must be on for your server to use it.
labels:
  - Core Server
  - Blockchain
---
# Configure Validator List Threshold

A `xrpld` server uses validators that meet a minimum intersection threshold between UNL publishers. This means a server only uses validators that exist on a number of validator lists, as defined by the server owner. {% badge href="https://github.com/XRPLF/rippled/releases/tag/2.4.0" %}New in: rippled 2.4.0{% /badge %}

By default, the minimum threshold is calculated as follows:

- floor(`validator_list_keys` / 2) + 1
- If there are only 1 or 2 `validator_list_keys`, the threshold is `1`.

The packaged `validators.txt` lists two publishers, so the default threshold is `1`. A validator that appears on either list is trusted. Set the threshold to `2` to trust only the validators that appear on both lists. Run `xrpld validators` and check `validator_list_threshold` to see the value the server is using.


## Modify the Validators File

1. Edit the `validators.txt` file. The recommended installation places this file at:
    ```
    /etc/xrpld/validators.txt
    ```

2. Find the `[validator_list_threshold]` stanza in the file and change its value to your threshold. If the stanza isn't there, add it. The stanza takes a single value. For example:

    ```
    [validator_list_threshold]
    2
    ```

Be sure to save the changes and restart your server.

{% admonition type="info" name="Note" %}If this value is `0` or isn't set, the threshold will be calculated using the default method. The value also can't be larger than the number of `validator_list_keys`.{% /admonition %}

## See Also

- [validators method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

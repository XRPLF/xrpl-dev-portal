---
html: configure-amendment-voting.html
parent: configure-rippled.html
blurb: Set your server's votes on protocol amendments.
---
# Configure Amendment Voting

Servers configured as validators can vote on [amendments](amendments.html) to the XRP Ledger protocol using the [feature method][]. (This method requires [admin access](get-started-using-http-websocket-apis.html#admin-access).)

For example, to vote against the "SHAMapV2" amendment, run the following command:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "any_id_here",
  "command": "feature",
  "feature": "SHAMapV2",
  "vetoed": true
}
```

*JSON-RPC*

```json
{
    "method": "feature",
    "params": [
        {
            "feature": "SHAMapV2",
            "vetoed": true
        }
    ]
}
```

*Commandline*

```sh
rippled feature SHAMapV2 reject
```

<!-- MULTICODE_BLOCK_END -->

**Note:** The short name of the amendment is case-sensitive. You can also use an amendment's ID as hexadecimal, which is not case sensitive.

## Using the Config File

If you prefer to use the config file to configure amendment voting, you can add a line to the `[rpc_startup]` stanza to run the command automatically on startup for each explicit vote. For example:

```
[rpc_startup]
{ "command": "feature", "feature": "SHAMapV2", "vetoed": true }
```

Be sure to restart your server for changes to take effect.

**Caution:** Any commands in the `[rpc_startup]` stanza run each time the server starts up, which can override voting settings you configured while the server was running.

## See Also

- [Amendments](amendments.html)
    - [Known Amendments](known-amendments.html)
- [feature method][]

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

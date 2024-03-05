---
html: configure-amendment-voting.html
parent: configure-rippled.html
seo:
    description: Set your server's votes on protocol amendments.
labels:
  - Core Server
  - Blockchain
---
# Configure Amendment Voting

Servers configured as validators can vote on [amendments](../../concepts/networks-and-servers/amendments.md) to the XRP Ledger protocol using the [feature method][]. (This method requires [admin access](../../tutorials/http-websocket-apis/build-apps/get-started.md#admin-access).)

For example, to vote against the "SHAMapV2" amendment, run the following command:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "any_id_here",
  "command": "feature",
  "feature": "SHAMapV2",
  "vetoed": true
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
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
{% /tab %}

{% tab label="Commandline" %}
```sh
rippled feature SHAMapV2 reject
```
{% /tab %}

{% /tabs %}

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

- [Amendments](../../concepts/networks-and-servers/amendments.md)
    - [Known Amendments](/resources/known-amendments.md)
- [feature method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

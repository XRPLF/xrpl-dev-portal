---
html: configure-amendment-voting.html
parent: configure-xrpld.html
seo:
    description: Set your server's votes on protocol amendments.
labels:
  - Core Server
  - Blockchain
---
# Configure Amendment Voting

Servers configured as validators can vote on [amendments](../../concepts/networks-and-servers/amendments.md) to the XRP Ledger protocol using the [feature method][]. (This method requires [admin access](../../tutorials/get-started/get-started-http-websocket-apis.md#admin-access).)

For example, to vote against an amendment, run the following command. Replace `AmendmentName` with the amendment's short name or its ID, as listed by `xrpld feature`:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "any_id_here",
  "command": "feature",
  "feature": "AmendmentName",
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
            "feature": "AmendmentName",
            "vetoed": true
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
xrpld feature AmendmentName reject
```
{% /tab %}

{% /tabs %}

{% admonition type="info" name="Note" %}The short name of the amendment is case-sensitive. You can also use an amendment's ID as hexadecimal, which isn't case sensitive.{% /admonition %}

## Using the Config File

If you prefer to use the config file to configure amendment voting, you can add a line to the `[rpc_startup]` stanza to run the command automatically on startup for each explicit vote. For example:

```
[rpc_startup]
{ "command": "feature", "feature": "AmendmentName", "vetoed": true }
```

Be sure to restart your server for changes to take effect.

{% admonition type="warning" name="Caution" %}Any commands in the `[rpc_startup]` stanza run each time the server starts up, which can override voting settings you configured while the server was running.{% /admonition %}

A vote you set with `feature` is saved in `wallet.db` and survives a restart, so you only need `[rpc_startup]` if you want the config file to be your record of the votes.

Every amendment that a release supports has a built-in default vote. Most default to voting against, and a few default to voting for. After each upgrade, run `xrpld feature` and check the `vetoed` field of every amendment you care about. A new release can change what your validator votes for without any change to your config.

## See Also

- [Amendments](../../concepts/networks-and-servers/amendments.md)
    - [Known Amendments](/resources/known-amendments.md)
- [feature method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

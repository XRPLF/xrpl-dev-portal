# json

The `json` method is a proxy to running other commands, and accepts the parameters for the command as a JSON value. It is *exclusive to the Commandline client*, and intended for cases where the commandline syntax for specifying parameters is inadequate or undesirable.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*Commandline*

```
# Syntax: json method json_stanza
rippled -q json ledger_closed '{}'
```

<!-- MULTICODE_BLOCK_END -->

## Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
   "result" : {
      "ledger_hash" : "8047C3ECF1FA66326C1E57694F6814A1C32867C04D3D68A851367EE2F89BBEF3",
      "ledger_index" : 390308,
      "status" : "success"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with whichever fields are appropriate to the type of command made.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}

# TODO_method_name
[[Source]](TODO_URL "Source")

The `{{currentpage.name}}` method TODO_description.

_The `{{currentpage.name}}` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users._


### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    TODO
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
        TODO
    }]
}
```

*Commandline*

```sh
#Syntax: {{currentpage.name}} TODO
rippled {{currentpage.name}}
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`     | Type                      | Description                        |
|:------------|:--------------------------|:-----------------------------------|
TODO_request_params


### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    TODO
}
```

*JSON-RPC*

```json
{
  TODO
}
```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  TODO
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
TODO_response_params


### Possible Errors

- Any of the [universal error types][].
- TODO_errors
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

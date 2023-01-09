---
html: manifest.html
parent: server-info-methods.html
blurb: Look up the public information about a known validator.
labels:
  - Blockchain
---
# manifest
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Manifest.cpp "Source")

The `{{currentpage.name}}` method reports the current "manifest" information for a given validator public key. The "manifest" is a block of data that authorizes an ephemeral signing key with a signature from the validator's master key pair. [Updated in: rippled 1.7.0][]


### Request Format

An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "command": "{{currentpage.name}}",
    "public_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p"
}
```

*JSON-RPC*

```json
{
    "method": "{{currentpage.name}}",
    "params": [{
        "public_key":"nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p"
    }]
}
```

*Commandline*

```sh
#Syntax: {{currentpage.name}} public_key
rippled {{currentpage.name}} nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`      | Type   | Description                        |
|:-------------|:-------|:-----------------------------------|
| `public_key` | String | The [base58][]-encoded public key of the validator to look up. This can be the master public key or ephemeral public key. |

**Note:** The commandline format for this method does not work in rippled v1.5.0. See [issue #3317](https://github.com/ripple/rippled/issues/3317) for details.

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "result": {
    "details": {
      "domain": "",
      "ephemeral_key": "n9J67zk4B7GpbQV5jRQntbgdKf7TW6894QuG7qq1rE5gvjCu6snA",
      "master_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "seq": 1
    },
    "manifest": "JAAAAAFxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAhRmvCZmWZXlwShVE9qXs2AVCvhVuA/WGYkTX/vVGBGwdkYwRAIgGnYpIGufURojN2cTXakAM7Vwa0GR7o3osdVlZShroXQCIH9R/Lx1v9rdb4YY2n5nrxdnhSSof3U6V/wIHJmeao5ucBJA9D1iAMo7YFCpb245N3Czc0L1R2Xac0YwQ6XdGT+cZ7yw2n8JbdC3hH8Xu9OUqc867Ee6JmlXtyDHzBdY/hdJCQ==",
    "requested": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p"
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
200 OK

{
  "result": {
    "details": {
      "domain": "",
      "ephemeral_key": "n9J67zk4B7GpbQV5jRQntbgdKf7TW6894QuG7qq1rE5gvjCu6snA",
      "master_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "seq": 1
    },
    "manifest": "JAAAAAFxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAhRmvCZmWZXlwShVE9qXs2AVCvhVuA/WGYkTX/vVGBGwdkYwRAIgGnYpIGufURojN2cTXakAM7Vwa0GR7o3osdVlZShroXQCIH9R/Lx1v9rdb4YY2n5nrxdnhSSof3U6V/wIHJmeao5ucBJA9D1iAMo7YFCpb245N3Czc0L1R2Xac0YwQ6XdGT+cZ7yw2n8JbdC3hH8Xu9OUqc867Ee6JmlXtyDHzBdY/hdJCQ==",
    "requested": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
    "status": "success"
  }
}
```

*Commandline*

```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "details": {
      "domain": "",
      "ephemeral_key": "n9J67zk4B7GpbQV5jRQntbgdKf7TW6894QuG7qq1rE5gvjCu6snA",
      "master_key": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "seq": 1
    },
    "manifest": "JAAAAAFxIe3AkJgOyqs3y+UuiAI27Ff3Mrfbt8e7mjdo06bnGEp5XnMhAhRmvCZmWZXlwShVE9qXs2AVCvhVuA/WGYkTX/vVGBGwdkYwRAIgGnYpIGufURojN2cTXakAM7Vwa0GR7o3osdVlZShroXQCIH9R/Lx1v9rdb4YY2n5nrxdnhSSof3U6V/wIHJmeao5ucBJA9D1iAMo7YFCpb245N3Czc0L1R2Xac0YwQ6XdGT+cZ7yw2n8JbdC3hH8Xu9OUqc867Ee6JmlXtyDHzBdY/hdJCQ==",
    "requested": "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
    "status": "success"
  }
}
```

<!-- MULTICODE_BLOCK_END -->

<!-- Note, the CLI response above is mocked up to compensate for https://github.com/ripple/rippled/issues/3317 -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`     | Type   | Description                                           |
|:------------|:-------|:------------------------------------------------------|
| `details`   | Object | _(May be omitted)_ The data contained in this manifest. Omitted if the server does not have a manifest for the `public_key` from the request. See **Details Object** below for a full description of its contents. |
| `manifest`  | String | _(May be omitted)_ The full manifest data in base64 format. This data is [serialized](serialization.html) to binary before being base64-encoded. Omitted if the server does not have a manifest for the `public_key` from the request. |
| `requested` | String | The `public_key` from the request.                    |

#### Details Object

If provided, the `details` object contains the following fields:

| `Field`         | Type   | Description                                       |
|:----------------|:-------|:--------------------------------------------------|
| `domain`        | String | The domain name this validator claims to be associated with. If the manifest does not contain a domain, this is an empty string. |
| `ephemeral_key` | String | The ephemeral public key for this validator, in [base58][]. |
| `master_key`    | String | The master public key for this validator, in [base58][]. |
| `seq`           | Number | The sequence number of this manifest. This number increases whenever the validator operator updates the validator's token to rotate ephemeral keys or change settings. |


### Possible Errors

- Any of the [universal error types][].
- `invalidParams` - The `public_key` field was missing or specified incorrectly.
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

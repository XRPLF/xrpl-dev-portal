# validation_seed
[[Source]](https://github.com/ripple/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ValidationSeed.cpp "Source")

The `validation_seed` command temporarily sets the secret value that rippled uses to sign validations. This value resets based on the config file when you restart the server. [Disabled since: rippled 0.29.1](https://github.com/ripple/rippled/releases/tag/0.29.1-rc1 "BADGE_RED")

*The `validation_seed` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": "set_seed_1",
    "command": "validation_seed",
    "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```

*Commandline*

```
#Syntax: validation_seed [secret]
rippled validation_seed 'BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE'
```

<!-- MULTICODE_BLOCK_END -->

The request includes the following parameters:

| `Field`  | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `secret` | String | _(Optional)_ If present, use this value as the secret value for the validating key pair. Valid formats include the XRP Ledger's [base58][] format, [RFC-1751](https://tools.ietf.org/html/rfc1751), or as a passphrase. If omitted, disables proposing validations to the network. |

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*JSON-RPC*

```
200 OK
{
   "result" : {
      "status" : "success",
      "validation_key" : "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE",
      "validation_public_key" : "n9Jx6RS6zSgqsgnuWJifNA9EqgjTKAywqYNReK5NRd1yLBbfC3ng",
      "validation_seed" : "snjJkyBGogTem5dFGbcRaThKq2Rt3"
   }
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
   "result" : {
      "status" : "success",
      "validation_key" : "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE",
      "validation_public_key" : "n9Jx6RS6zSgqsgnuWJifNA9EqgjTKAywqYNReK5NRd1yLBbfC3ng",
      "validation_seed" : "snjJkyBGogTem5dFGbcRaThKq2Rt3"
   }
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                 | Type   | Description                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_key`        | String | (Omitted if proposing disabled) The secret key for these validation credentials, in [RFC-1751](https://tools.ietf.org/html/rfc1751) format. |
| `validation_public_key` | String | (Omitted if proposing disabled) The public key for these validation credentials, in the XRP Ledger's [base58][] encoded string format. |
| `validation_seed`       | String | (Omitted if proposing disabled) The secret key for these validation credentials, in the XRP Ledger's [base58][] encoded string format. |

### Possible Errors

* Any of the [universal error types][].
* `badSeed` - The request provided an invalid secret value. This usually means that the secret value appears to be a valid string of a different format, such as an account address or validation public key.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

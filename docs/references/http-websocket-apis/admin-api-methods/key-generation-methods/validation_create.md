---
html: validation_create.html
parent: key-generation-methods.html
seo:
    description: Generate keys for a rippled server to identify itself to the network.
labels:
  - Security
  - Core Server
---
# validation_create
[[Source]](https://github.com/XRPLF/rippled/blob/315a8b6b602798a4cff4d8e1911936011e12abdb/src/ripple/rpc/handlers/ValidationCreate.cpp "Source")

Use the `validation_create` command to generate [cryptographic keys a `rippled` server can use to identify itself to the network](../../../../concepts/networks-and-servers/peer-protocol.md#node-key-pair). Similar to the [wallet_propose method][], this method only generates a set of keys in the proper format. It does not any makes changes to the XRP Ledger data or server configuration.

_The `validation_create` method is an [admin method](../index.md) that cannot be run by unprivileged users._

You can configure your server to use the generated key pair to sign validations (validation key pair) or regular peer-to-peer communications ([node key pair](../../../../concepts/networks-and-servers/peer-protocol.md#node-key-pair)).

**Tip:** For configuring a robust validator, you should use the `validator-keys` tool (included in the `rippled` RPM) to generate validator tokens (which can be rotated) with an offline master key. For more information, see [Validator Setup](../../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-enable-validation-on-your-rippled-server).


### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 0,
    "command": "validation_create",
    "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "validation_create",
    "params": [
        {
            "secret": "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: validation_create [secret]
rippled validation_create "BAWL MAN JADE MOON DOVE GEM SON NOW HAD ADEN GLOW TIRE"
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`  | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| `secret` | String | _(Optional)_ Use this value as a seed to generate the credentials. The same secret always generates the same credentials. You can provide the seed in [RFC-1751](https://tools.ietf.org/html/rfc1751) format or the XRP Ledger's [base58][] format. If omitted, generate a random seed. |

**Note:** The security of your validator depends on the entropy of your seed. Do not use a secret value for real business purposes unless it is generated with a strong source of randomness. Ripple recommends omitting the `secret` when generating new credentials for the first time.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
   "result" : {
      "status" : "success",
      "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
      "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
      "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
   }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "status" : "success",
      "validation_key" : "FAWN JAVA JADE HEAL VARY HER REEL SHAW GAIL ARCH BEN IRMA",
      "validation_public_key" : "n9Mxf6qD4J55XeLSCEpqaePW4GjoCR5U1ZeGZGJUCNe3bQa4yQbG",
      "validation_seed" : "ssZkdwURFMBXenJPbrpE14b6noJSu"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                 | Type   | Description                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_key`        | String | The secret key for these validation credentials, in [RFC-1751](https://tools.ietf.org/html/rfc1751) format. |
| `validation_public_key` | String | The public key for these validation credentials, in the XRP Ledger's [base58][] encoded string format. |
| `validation_seed`       | String | The secret key for these validation credentials, in the XRP Ledger's [base58][] encoded string format. |

### Possible Errors

* Any of the [universal error types][].
* `badSeed` - The request provided an invalid seed value. This usually means that the seed value appears to be a valid string of a different format, such as an account address or validation public key.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

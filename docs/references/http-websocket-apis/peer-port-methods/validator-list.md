---
html: validator-list.html
parent: peer-port-methods.html
seo:
    description: Special API method for sharing recommended validator lists.
labels:
  - Core Server
  - Blockchain
---
# Validator List Method

The validator list method is a special API endpoint that fetches a current, trusted validator list a `rippled` server is using. This often represents the exact list of validators a server trusts.

Like the [Peer Crawler](peer-crawler.md), the validator list method is available by default on a non-privileged basis through the [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md) port, which is also used for `rippled` servers' peer-to-peer communications.

## Request Format

To request the Validator List information, make the following HTTP request:

- **Protocol:** https
- **HTTP Method:** GET
- **Host:** (any `rippled` server, by hostname or IP address)
- **Port:** (the port number where the `rippled` server uses the Peer Protocol, typically 51235)
- **Path:** `/vl/{public_key}`

    The `{public_key}` is the list publisher's public key, in hexadecimal. This key identifies the publisher and is also used to verify that the contents of the list are authentic and complete.

- **Security:** Most `rippled` servers use a self-signed TLS certificate to respond to the request. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers.

    The validator list contents are signed with a separate cryptographic key, so you can verify their integrity regardless of the TLS certificate used.


## Response Format

The response has the status code **200 OK** and a JSON object in the message body. The response body is very similar to the format used for validator list sites such as <https://vl.ripple.com/>.

The JSON object has the following fields:

| `Field`          | Value  | Description                                      |
|:-----------------|:-------|:-------------------------------------------------|
| `manifest`       | String | The list publisher's [manifest data](#manifest-data), in either base64 or hexadecimal. |
| `blob`           | String | Base64-encoded JSON data representing the validator list. |
| `signature`      | String | The signature of the `blob` data, in hexadecimal. |
| `version`        | Number | The version of the validator list protocol this object uses. The current version is **1**. A higher version number indicates backwards-incompatible changes with a previous version of the validator list protocol. |
| `public_key`     | String | The public key used to verify this validator list data, in hexadecimal. This is a 32-byte Ed25519 public key prefixed with the byte `0xED`.  |

### Manifest Data
[[Source]](https://github.com/XRPLF/rippled/blob/97712107b71a8e2089d2e3fcef9ebf5362951110/src/ripple/app/misc/impl/Manifest.cpp#L43-L66 "Source")

A "manifest" contains information uniquely identifying a person or organization involved in the consensus process, either a **validator** or a **list publisher**. A validator's manifest contains the _public_ information from that [validator's token](../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-enable-validation-on-your-rippled-server). A list publisher's manifest provides information about the list publisher. Both are typically encoded to binary in the XRP Ledger's standard [binary serialization format](../../protocol/binary-format.md). (There is no standard JSON representation of a manifest.)

One of the main purposes of manifests relates to rotating validator keys. When a validator changes its ephemeral key pair, the validator publishes a new manifest to share its new ephemeral public key, using the validator's master key pair to sign the manifest to prove its authenticity. A validator uses its ephemeral key pair to sign validations as part of the [consensus process](../../../concepts/consensus-protocol/index.md) and uses its master key pair only to sign new manifests. (The manifest is incorporated into a validator token, alongside private data, that [the validator administrator adds to the `rippled.cfg` config file](../../../infrastructure/configuration/server-modes/run-rippled-as-a-validator.md#3-enable-validation-on-your-rippled-server).)

The data encoded in a manifest is as follows:

| Field               | Internal Type | Description                              |
|:--------------------|:--------------|:-----------------------------------------|
| `sfPublicKey`       | Blob          | The master public key that uniquely identifies this person or organization. This can be a 33-byte secp256k1 public key, or a 32-byte Ed25519 public key prefixed with the byte `0xED`. |
| `sfMasterSignature` | Blob          | A signature of this manifest data from the master key pair. This proves the authenticity of the manifest. |
| `sfSequence`        | UInt32        | A sequence number for this manifest. A higher number indicates a newer manifest that invalidates all older manifests from the same master public key. |
| `sfVersion`         | UInt16        | A version number indicating the manifest format used. A higher number indicates a newer manifest format, including breaking changes compared to the previous manifest format. |
| `sfDomain`          | Blob          | _(Optional)_ A domain name owned by this person or organization, ASCII-encoded. |
| `sfSigningPubKey`   | Blob          | _(Optional)_ The ephemeral public key of the key pair that this person or organization is currently using. This must be a 33-byte secp256k1 public key. |
| `sfSignature`       | Blob          | _(Optional)_ A signature of this manifest data from the ephemeral key pair. |

The `sfMasterSignature` and `sfSignature` signatures are created from signing the [serialized](../../protocol/binary-format.md) binary data of the manifest, excluding the signature fields (`sfMasterSignature` and `sfSignature`) themselves.


### Blob Data

If you decode the `blob` from base64, the result is a JSON object with the following fields:

| `Field`      | Value  | Description                                          |
|:-------------|:-------|:-----------------------------------------------------|
| `sequence`   | Number | Unique sequence number for this list. A larger sequence number indicates a newer list; only the newest list is valid at a time. |
| `expiration` | Number | The time this list expires, in [seconds since the Ripple Epoch][]. |
| `validators` | Array  | A list of recommended validators.                    |

Each member of the `validators` array has the following fields:

| `Field`                 | Value  | Description                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_public_key` | String | The master public key that uniquely identifies this validator. |
| `manifest`              | String | This validator's [manifest data](#manifest-data), in either base64 or hexadecimal. |


#### Example Decoded Blob

{% code-snippet file="/_api-examples/vl/vl-blob.json" language="json" /%}

## Example

Request:

{% tabs %}

{% tab label="HTTP" %}
```
GET https://localhost:51235/vl/ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
```
{% /tab %}

{% tab label="cURL" %}
```
curl --insecure https://localhost:51235/vl/ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734
```
{% /tab %}

{% /tabs %}

Response:

{% code-snippet file="/_api-examples/vl/vl.json" language="json" prefix="200 OK\n\n" /%}


## See Also

- [Peer Protocol](../../../concepts/networks-and-servers/peer-protocol.md)
- [Consensus](../../../concepts/consensus-protocol/index.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

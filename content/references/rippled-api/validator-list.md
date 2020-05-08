# Validator List Method

The validator list method is a special API endpoint for reporting a current trusted validator list a `rippled` server is using. This often represents the exact list of validators a server trusts.

Like the [Peer Crawler](peer-crawler.html), the validator list method is available by default on a non-privileged basis through the [Peer Protocol](peer-protocol.html) port, which is also used for `rippled` servers' peer-to-peer communications.

## Request Format

To request the Peer Crawler information, make the following HTTP request:

- **Protocol:** https
- **HTTP Method:** GET
- **Host:** (any `rippled` server, by hostname or IP address)
- **Port:** (the port number where the `rippled` server uses the Peer Protocol, typically 51235)
- **Path:** `/vl/{public_key}`

    The `{public_key}` is the list publisher's public key, in hexadecimal. This key identifies the publisher and is also used to verify that the contents of the list are authentic and complete.

- **Security:** Most `rippled` servers use a self-signed TLS certificate to respond to the request. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers.

    The validator list contents are signed with a separate cryptographic key, so you can verify their integrity regardless of the TLS certificate used.

**Tip:** Since this request uses the GET method, you can test this request using just the URL bar of your web browser. For example, <https://s1.ripple.com:51235/vl/ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734> requests Ripple's recommended list from one of Ripple's public servers.

## Response Format

The response has the status code **200 OK** and a JSON object in the message body. The response body is very similar to the format used for validator list sites such as <https://vl.ripple.com/>.

The JSON object has the following fields:

| `Field`          | Value  | Description                                      |
|:-----------------|:-------|:-------------------------------------------------|
| `manifest`       | String | ***TODO*** base64-encoded. |
| `blob`           | String | Base64-encoded JSON data representing the validator list. |
| `signature`      | String | The signature of the `blob` data, in hexadecimal. |
| `version`        | Number | The version of the validator list protocol this object uses. The current version is **1**. A higher version number indicates backwards-incompatible changes with a previous version of the validator list protocol. |
<!--{# This field isn't included in the rippled response, but should be.
| `public_key`     | String | The public key used to verify this validator list data, in hexadecimal. This is a 32-byte Ed25519 public key prefixed with the byte `0xED`. |
#}-->

### Blob Data

If you decode the `blob` from base64, the result is a JSON object with the following fields:

| `Field`      | Value  | Description                                          |
|:-------------|:-------|:-----------------------------------------------------|
| `sequence`   | Number | Unique sequence number for this list. A larger sequence number indicates a newer list; only the newest list is valid at a time. |
| `expiration` | Number | The time this list expires, in [seconds since the Ripple Epoch][]. |
| `validators  | Array  | A list of recommended validators.                    |

Each member of the `validators` array has the following fields:

| `Field`                 | Value  | Description                               |
|:------------------------|:-------|:------------------------------------------|
| `validation_public_key` | String | The ephemeral(***TODO:?***) public key of this validator. |
| `manifest`              | String | This validator's base64-encoded "manifest" data. |

***TODO: describe what's in the manifest data exactly***

#### Example Decoded Blob

```json
{% include '_code-samples/vl/vl-blob.json' %}
```

## Example

Request:

<!-- MULTICODE_BLOCK_START -->

*HTTP*

```
GET https://localhost:51235/vl
```

*cURL*

```
curl --insecure https://localhost:51235/vl
```

<!-- MULTICODE_BLOCK_END -->

Response:

```json
200 OK

{% include '_code-samples/vl/vl.json' %}
```


## See Also

- [Peer Protocol](peer-protocol.html)
- [Consensus](consensus.html)

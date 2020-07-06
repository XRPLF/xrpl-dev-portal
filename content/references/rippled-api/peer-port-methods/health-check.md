# Health Check
[[Source]](https://github.com/ripple/rippled/blob/de0c52738785de8bf837f9124da65c7905e7bb5a/src/ripple/overlay/impl/OverlayImpl.cpp#L1084-L1168 "Source")

The Health Check is a special [peer port method](peer-port-methods.html) for reporting on the health of an individual `rippled` server. This method is intended for use in automated monitoring to recognize outages and prompt automated or manual interventions such as restarting the server. [New in: rippled 1.6.0][]

This method checks several metrics to see if they are in ranges generally considered healthy. If all metrics are in normal ranges, this method reports that the server is healthy. If any metric is outside normal ranges, this method reports that the server is unhealthy and reports the metric(s) that were unhealthy. Since some metrics may rapidly fluctuate into and out of unhealthy ranges, it is recommended not to raise alerts unless the health check fails multiple times in a row.

**Note:** Since the health check is a [peer port method](peer-port-methods.html), it is not available when testing the server in [stand-alone mode](rippled-server-modes.html#reasons-to-run-a-rippled-server-in-stand-alone-mode).


## Request Format

To request the Peer Crawler information, make the following HTTP request:

- **Protocol:** https
- **HTTP Method:** GET
- **Host:** (any `rippled` server, by hostname or IP address)
- **Port:** (the port number where the `rippled` server uses the Peer Protocol, typically 51235)
- **Path:** `/health`
- **Security:** Most `rippled` servers use a self-signed certificate to respond to the request. By default, most tools (including web browsers) flag or block such responses for being untrusted. You must ignore the certificate checking (for example, if using cURL, add the `--insecure` flag) to display a response from those servers.

<!-- TODO: link a tutorial for how to run rippled with a non-self-signed TLS cert -->

## Example Response

```json
HTTP/1.1 503 Service Unavailable
Server: rippled-1.6.0
Content-Type: application/json
Connection: close
Transfer-Encoding: chunked

{
    "info": {
        "load_factor": 256,
        "server_state": "connected",
        "validated_ledger": 2147483647
    }
}
```

## Response Format

If the server is in a **critical** state, the response has the status code **503 Service Unavailable**. If the server is **healthy** or in a **warning** state, the response has the status code **200 OK**.

In either case, the response body is a JSON object with a single `info` object at the top level. The info object contains values for each metric that is in a warning or critical range. The response omits metrics that are in a healthy range, so a fully healthy server has an empty object.

The `info` object may contain the following fields:

| `Field`             | Value   | Description                                  |
|:--------------------|:--------|:---------------------------------------------|
| `amendment_blocked` | Boolean | _(May be omitted)_ If `true`, the server is [amendment blocked](amendments.html#amendment-blocked) and must be upgraded to remain synced with the network; this state is critical. If the server is not amendment blocked, this field is omitted. |
| `load_factor`       | Number | _(May be omitted)_ A measure of the overall load the server is under. This reflects I/O, CPU, and memory limitations. This is a warning if the load factor is over 100, or critical if the load factor is 1000 or higher. |
| `peers`             | Number | _(May be omitted)_ The number of [peer servers](peer-protocol.html) this server is connected to. This is a warning if connected to 7 or fewer peers, and critical if connected to zero peers. |
| `server_state`      | String | _(May be omitted)_ The current [server state](rippled-server-states.html). This is a warning if the server is in the `tracking`, `syncing`, or `connected` states. This is critical if the server is in the `disconnected` state. |
| `validated_ledger`  | Number | _(May be omitted)_ The number of seconds since the last time a ledger was validated by consensus. If there is no validated ledger available, this is a very large integer value such as `2147483647` (architecture-dependent). This is a warning if the last validated ledger was at least 7 seconds ago, and critical if the last validated ledger was at least 20 seconds ago. |

## See Also

For guidance interpreting the results of the health check, see [Health Check Interventions](health-check-interventions.html).


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

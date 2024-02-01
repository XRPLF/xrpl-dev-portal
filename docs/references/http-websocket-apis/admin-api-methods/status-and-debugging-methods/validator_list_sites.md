---
html: validator_list_sites.html
parent: status-and-debugging-methods.html
seo:
    description: Get information about sites that publish validator lists.
labels:
  - Core Server
  - Blockchain
---
# validator_list_sites
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/ValidatorListSites.cpp "Source")

The `validator_list_sites` command returns status information of sites serving validator lists.

*The `validator_list_sites` method is an [admin method](../index.md) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 1,
    "command": "validator_list_sites"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "validator_list_sites",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: validator_list_sites
rippled validator_list_sites
```
{% /tab %}

{% /tabs %}

The request includes no parameters.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id":5,
    "status":"success",
    "type":"response",
    "result": {
        "validator_sites": [
            {
                "last_refresh_status": "accepted",
                "last_refresh_time": "2017-Oct-13 21:26:37",
                "refresh_interval_min": 5,
                "uri": "http://127.0.0.1:51447/validators"
            }
        ]
    }
}
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
    "result": {
        "status": "success",
        "validator_sites": [
            {
                "last_refresh_status": "accepted",
                "last_refresh_time": "2017-Oct-13 21:26:37",
                "refresh_interval_min": 5,
                "uri": "http://127.0.0.1:51447/validators"
            }
        ]
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
    "result": {
        "status": "success",
        "validator_sites": [
            {
                "last_refresh_status": "accepted",
                "last_refresh_time": "2017-Oct-13 21:26:37",
                "refresh_interval_min": 5,
                "uri": "http://127.0.0.1:51447/validators"
            }
        ]
    }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following field:

| `Field`           | Type  | Description                      |
|:------------------|:------|----------------------------------|
| `validator_sites` | Array | Array of validator site objects. |

Each member of the `validator_sites` field array is an object with the following fields:

| `Field`                | Type             | Description                     |
|:-----------------------|:-----------------|:--------------------------------|
| `last_refresh_status`  | String           | If present, shows the status of the most recent refresh of the site. If missing, the site has not yet been successfully queried. See **Site Status Values** below for possible states and their meanings. |
| `last_refresh_time`    | String           | Human readable time when the site was last queried. If missing, the site has not yet been successfully queried. |
| `refresh_interval_min` | Unsigned Integer | The number of minutes between refresh attempts. |
| `uri`                  | String           | The URI of the site. |

#### Site Status Values

The `last_refresh_status` field can have the following values:

| Value                 | Meaning                                              |
|:----------------------|:-----------------------------------------------------|
| `accepted`            | The site provided a valid list, which your server is now using. |
| `same_sequence`       | The site provided a list with the same sequence number as your existing list, so your server continued using its existing list. |
| `unsupported_version` | The site provided a list, but your server does not support the list format version number in the list. You might need to [update `rippled`](../../../../infrastructure/installation/index.md) to a newer software version. |
| `untrusted`           | The site provided a list from the site that is signed by a cryptographic key pair your server is not configured to trust. You may want to check for typos in your `validators.txt` file and check to see if the list publisher changed their cryptographic keys. |
| `stale`               | The site provided a list with a lower sequence number than the list your server is already using. |
| `invalid`             | The site provided a list or signature that was not validly formed. |

### Possible Errors

- Any of the [universal error types][].
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

# validators
[[Source]](https://github.com/ripple/rippled/blob/master/src/ripple/rpc/handlers/Validators.cpp "Source")

The `validators` command returns human readable information about the current list of published and trusted validators used by the server. [New in: rippled 0.80.1][]

*The `validators` method is an [admin method](admin-rippled-methods.html) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id": 1,
    "command": "validators"
}
```

*JSON-RPC*

```
{
    "method": "validators",
    "params": [
        {}
    ]
}
```

*Commandline*

```
#Syntax: validators
rippled validators
```

<!-- MULTICODE_BLOCK_END -->

The request includes no parameters.

### Response Format

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```
{
    "id":5,
    "status":"success",
    "type":"response",
    "result":{
        "local_static_keys": [],
        "publisher_lists":[
            {
                "available":true,
                "expiration":"2017-Oct-13 14:56:00",
                "list":[
                    "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H",
                    "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1"
                ],
                "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
                "seq":1,
                "version":1
            }
        ],
        "signing_keys":{},
        "status":"success",
        "trusted_validator_keys":[
            "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1",
            "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H"
        ],
        "validation_quorum":2,
        "validator_list_expires":"2017-Oct-13 14:56:00"
    }
}
```

*JSON-RPC*

```
200 OK
{
    "result":{
        "local_static_keys": [],
        "publisher_lists":[
            {
                "available":true,
                "expiration":"2017-Oct-13 14:56:00",
                "list":[
                    "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H",
                    "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1"
                ],
                "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
                "seq":1,
                "version":1
            }
        ],
        "signing_keys":{},
        "status":"success",
        "trusted_validator_keys":[
            "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1",
            "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H"
        ],
        "validation_quorum":2,
        "validator_list_expires":"2017-Oct-13 14:56:00"
    },
    "status":"success"
}
```

*Commandline*

```
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005
{
    "result":{
        "local_static_keys": [],
        "publisher_lists":[
            {
                "available":true,
                "expiration":"2017-Oct-13 14:56:00",
                "list":[
                    "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H",
                    "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1"
                ],
                "pubkey_publisher":"ED58ED4AA543B524F16771F6E1367BAA220D99DCF22CD8CF7A11309E9EAB1B647B",
                "seq":1,
                "version":1
            }
        ],
        "signing_keys":{},
        "status":"success",
        "trusted_validator_keys":[
            "n94D73ZKSUaTDCnUqYW5ugJ9fHPNxda9GQVoWA6BGtcKuuhozrD1",
            "n9Ltz6ZxPRWTkqwBbpvgbaXPgm6GYCxCJRqFgNXhWVUebgezo28H"
        ],
        "validation_quorum":2,
        "validator_list_expires":"2017-Oct-13 14:56:00"
    },
    "status":"success"
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                  | Type   | Description                              |
|:-------------------------|:-------|:-----------------------------------------|
| `listed_static_keys`     | Array  | Array of public keys for validators always eligible for inclusion in the trusted list. |
| `publisher_lists`        | Array  | Array of publisher list objects.         |
| `signing_keys`           | Object | Mapping from master public key to current signing key for listed validators that use validator manifests. |
| `trusted_validator_keys` | Array  | Array of public keys for currently trusted validators. |
| `validation_quorum`      | Number | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires` | String | Either the human readable time when the current validator list will expire, the string `unknown` if the server has yet to load a published validator list or the string `never` if the server uses a static validator list. |

Each member of the `publisher_lists` array is an object with the following fields:

| `Field`            | Type             | Description                          |
|:-------------------|:-----------------|:-------------------------------------|
| `available`        | Boolean          | If `false`, the validator keys in `list` may no longer be supported by this publisher. |
| `expiration`       | String           | The human readable time when this published list will expire. |
| `list`             | Array            | Array of published validator keys.   |
| `pubkey_publisher` | String           | Ed25519 or ECDSA public key of the list publisher, as hexadecimal. |
| `seq`              | Unsigned Integer | The sequence number of this published list. |
| `version`          | Unsigned Integer | The version of the list format.      |

### Possible Errors

* Any of the [universal error types][].

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

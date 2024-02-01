---
html: consensus_info.html
parent: status-and-debugging-methods.html
seo:
    description: Get information about the state of consensus as it happens.
labels:
  - Blockchain
  - Core Server
---
# consensus_info
[[Source]](https://github.com/XRPLF/rippled/blob/a61ffab3f9010d8accfaa98aa3cacc7d38e74121/src/ripple/rpc/handlers/ConsensusInfo.cpp "Source")

The `consensus_info` command provides information about the [consensus process](../../../../concepts/consensus-protocol/index.md) for debugging purposes.

_The `consensus_info` method is an [admin method](../index.md) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": 99,
    "command": "consensus_info"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "consensus_info",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: consensus_info
rippled consensus_info
```
{% /tab %}

{% /tabs %}

The request has no parameters.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
{
   "result" : {
      "info" : {
         "acquired" : {
            "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
         },
         "close_granularity" : 10,
         "close_percent" : 50,
         "close_resolution" : 10,
         "close_times" : {
            "486082972" : 1,
            "486082973" : 4
         },
         "current_ms" : 1003,
         "have_time_consensus" : false,
         "ledger_seq" : 13701086,
         "our_position" : {
            "close_time" : 486082973,
            "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
            "propose_seq" : 0,
            "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
         },
         "peer_positions" : {
            "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
               "close_time" : 486082972,
               "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
               "close_time" : 486082973,
               "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
               "close_time" : 486082973,
               "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
               "close_time" : 486082973,
               "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "EFC49EB648E557CC50A72D715249B80E071F7705" : {
               "close_time" : 486082973,
               "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            }
         },
         "previous_mseconds" : 2005,
         "previous_proposers" : 5,
         "proposers" : 5,
         "proposing" : false,
         "state" : "consensus",
         "synched" : true,
         "validating" : false
      },
      "status" : "success"
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
      "info" : {
         "acquired" : {
            "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306" : "acquired"
         },
         "close_granularity" : 10,
         "close_percent" : 50,
         "close_resolution" : 10,
         "close_times" : {
            "486082972" : 1,
            "486082973" : 4
         },
         "current_ms" : 1003,
         "have_time_consensus" : false,
         "ledger_seq" : 13701086,
         "our_position" : {
            "close_time" : 486082973,
            "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
            "propose_seq" : 0,
            "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
         },
         "peer_positions" : {
            "0A2EAF919033A036D363D4E5610A66209DDBE8EE" : {
               "close_time" : 486082972,
               "peer_id" : "n9KiYM9CgngLvtRCQHZwgC2gjpdaZcCcbt3VboxiNFcKuwFVujzS",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "1567A8C953A86F8428C7B01641D79BBF2FD508F3" : {
               "close_time" : 486082973,
               "peer_id" : "n9LdgEtkmGB9E2h3K4Vp7iGUaKuq23Zr32ehxiU8FWY7xoxbWTSA",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "202397A81F20B44CF44EA99AF761295E5A8397D2" : {
               "close_time" : 486082973,
               "peer_id" : "n9MD5h24qrQqiyBC8aeqqCWvpiBiYQ3jxSr91uiDvmrkyHRdYLUj",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "5C29005CF4FB479FC49EEFB4A5B075C86DD963CC" : {
               "close_time" : 486082973,
               "peer_id" : "n9L81uNCaPgtUJfaHh89gmdvXKAmSt5Gdsw2g1iPWaPkAHW5Nm4C",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            },
            "EFC49EB648E557CC50A72D715249B80E071F7705" : {
               "close_time" : 486082973,
               "peer_id" : "n949f75evCHwgyP4fPVgaHqNHxUVN15PsJEZ3B3HnXPcPjcZAoy7",
               "previous_ledger" : "0BB01379B51234BAAF501A71C7AB147F595460B689BB9E8252A0B87B5A483623",
               "propose_seq" : 0,
               "transaction_hash" : "4BC2CE596CBD1321775320E2067F9C06D3862826212C16EF42ABB6A2B0414306"
            }
         },
         "previous_mseconds" : 2005,
         "previous_proposers" : 5,
         "proposers" : 5,
         "proposing" : false,
         "state" : "consensus",
         "synched" : true,
         "validating" : false
      },
      "status" : "success"
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field` | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `info`  | Object | Information that may be useful for debugging consensus. This output is subject to change without notice. |

The following is an incomplete summary of fields that may be contained in the `info` object:

| `Field`          | Type    | Description                                     |
|:-----------------|:--------|:------------------------------------------------|
| `ledger_seq`     | Number  | The [ledger index][Ledger Index] of the [ledger](../../../../concepts/ledgers/index.md) currently in the consensus process |
| `our_position`   | Object  | This server's expectation for the ledger in the consensus process. |
| `peer_positions` | Object  | Map of peers and their proposed versions of the ledger in the consensus process. |
| `proposers`      | Number  | The number of trusted validators participating in this consensus process. Which validators are trusted depends on this server's configuration. |
| `synched`        | Boolean | Whether this server considers itself in sync with the network. |
| `state`          | String  | What part of the consensus process is currently in progress: `open`, `consensus`, `finished`, or `accepted`. |

It is also normal to get a minimal result where the only field in `info` is `"consensus": "none"`. This indicates that the server is in between consensus rounds.

The results of the `consensus_info` command can vary dramatically if you run it several times, even in short succession.


### Possible Errors

- Any of the [universal error types][].
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

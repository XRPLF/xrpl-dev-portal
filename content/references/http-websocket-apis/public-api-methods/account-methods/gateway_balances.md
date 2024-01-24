---
html: gateway_balances.html
parent: account-methods.html
seo:
    description: Calculate total amounts issued by an account.
labels:
  - Tokens
  - Accounts
---
# gateway_balances
[[Source]](https://github.com/XRPLF/rippled/blob/9111ad1a9dc37d49d085aa317712625e635197c0/src/ripple/rpc/handlers/GatewayBalances.cpp "Source")

The `gateway_balances` command calculates the total balances issued by a given account, optionally excluding amounts held by [operational addresses](../../../../concepts/accounts/account-types.md).

**Caution:** Some public servers disable this API method because it can require a large amount of processing.

## Request Format
An example of the request format:

{% partial file="/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "example_gateway_balances_1",
    "command": "gateway_balances",
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
    "strict": true,
    "hotwallet": ["rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ","ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"],
    "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "gateway_balances",
    "params": [
        {
            "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
            "hotwallet": [
                "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ",
                "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"
            ],
            "ledger_index": "validated",
            "strict": true
        }
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
rippled json gateway_balances ' {"account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q", "hotwallet": ["rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ", "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt"],"ledger_index": "validated","strict": true} '
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| `Field`        | Type                       | Description                    |
|:---------------|:---------------------------|:-------------------------------|
| `account`      | String                     | The [Address][] to check. This should be the [issuing address](../../../../concepts/accounts/account-types.md) |
| `strict`       | Boolean                    | _(Optional)_ If true, only accept an address or public key for the account parameter. Defaults to false. |
| `hotwallet`    | String or Array            | _(Optional)_ An [operational address](../../../../concepts/accounts/account-types.md) to exclude from the balances issued, or an array of such addresses. |
| `ledger_hash`  | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Unsigned Integer | _(Optional)_ The [ledger index][] of the ledger version to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 3,
  "status": "success",
  "type": "response",
  "result": {
    "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
    "assets": {
      "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
        {
          "currency": "BTC",
          "value": "5444166510000000e-26"
        }
      ],
      "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
        {
          "currency": "EUR",
          "value": "4000000000000000e-27"
        }
      ],
      "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
        {
          "currency": "BTC",
          "value": "1029900000000000e-26"
        }
      ],
      "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
        {
          "currency": "BTC",
          "value": "4000000000000000e-30"
        }
      ],
      "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
        {
          "currency": "BTC",
          "value": "8700000000000000e-30"
        }
      ]
    },
    "balances": {
      "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
        {
          "currency": "EUR",
          "value": "29826.1965999999"
        }
      ],
      "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
        {
          "currency": "USD",
          "value": "13857.70416"
        }
      ]
    },
    "ledger_hash": "61DDBF304AF6E8101576BF161D447CA8E4F0170DDFBEAFFD993DC9383D443388",
    "ledger_index": 14483195,
    "obligations": {
      "BTC": "5908.324927635318",
      "EUR": "992471.7419793958",
      "GBP": "4991.38706013193",
      "USD": "1997134.20229482"
    },
    "validated": true
  }
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK
{
    "result": {
        "account": "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
        "assets": {
            "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH": [
                {
                    "currency": "BTC",
                    "value": "5444166510000000e-26"
                }
            ],
            "rPFLkxQk6xUGdGYEykqe7PR25Gr7mLHDc8": [
                {
                    "currency": "EUR",
                    "value": "4000000000000000e-27"
                }
            ],
            "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj": [
                {
                    "currency": "BTC",
                    "value": "1029900000000000e-26"
                }
            ],
            "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ": [
                {
                    "currency": "BTC",
                    "value": "4000000000000000e-30"
                }
            ],
            "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6": [
                {
                    "currency": "BTC",
                    "value": "8700000000000000e-30"
                }
            ]
        },
        "balances": {
            "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ": [
                {
                    "currency": "EUR",
                    "value": "29826.1965999999"
                }
            ],
            "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt": [
                {
                    "currency": "USD",
                    "value": "13857.70416"
                }
            ]
        },
        "ledger_hash": "980FECF48CA4BFDEC896692C31A50D484BDFE865EC101B00259C413AA3DBD672",
        "ledger_index": 14483212,
        "obligations": {
            "BTC": "5908.324927635318",
            "EUR": "992471.7419793958",
            "GBP": "4991.38706013193",
            "USD": "1997134.20229482"
        },
        "status": "success",
        "validated": true
    }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
   "result" : {
      "account" : "rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q",
      "assets" : {
         "r9F6wk8HkXrgYWoJ7fsv4VrUBVoqDVtzkH" : [
            {
               "currency" : "BTC",
               "value" : "5444166510000000e-26"
            }
         ],
         "rPU6VbckqCLW4kb51CWqZdxvYyQrQVsnSj" : [
            {
               "currency" : "BTC",
               "value" : "1029900000000000e-26"
            }
         ],
         "rpR95n1iFkTqpoy1e878f4Z1pVHVtWKMNQ" : [
            {
               "currency" : "BTC",
               "value" : "4000000000000000e-30"
            }
         ],
         "rwmUaXsWtXU4Z843xSYwgt1is97bgY8yj6" : [
            {
               "currency" : "BTC",
               "value" : "8700000000000000e-30"
            }
         ]
      },
      "balances" : {
         "rKm4uWpg9tfwbVSeATv4KxDe6mpE9yPkgJ" : [
            {
               "currency" : "EUR",
               "value" : "144816.1965999999"
            }
         ],
         "ra7JkEzrgeKHdzKgo4EUUVBnxggY4z37kt" : [
            {
               "currency" : "USD",
               "value" : "6677.38614"
            }
         ]
      },
      "frozen_balances" : {
         "r4keXr5myiU4iTLh68ZqZ2CgsJ8dM9FSW6" : [
            {
               "currency" : "BTC",
               "value" : "0.091207822800868"
            }
         ]
      },
      "ledger_hash" : "6C789EAF25A931565E5936042EED037F287F3348B61A70777649552E0385B0E4",
      "ledger_index" : 57111383,
      "obligations" : {
         "BTC" : "1762.700511879441",
         "EUR" : "813792.4267005104",
         "GBP" : "4974.337212333351",
         "USD" : "6739710.218284974"
      },
      "status" : "success",
      "validated" : true
   }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                | Type                      | Description             |
|:-----------------------|:--------------------------|:------------------------|
| `account`              | String - [Address][]      | The address of the account that issued the balances. |
| `obligations`          | Object                    | (Omitted if empty) Total amounts issued to addresses not excluded, as a map of currencies to the total value issued. |
| `balances`             | Object                    | _(Omitted if empty)_ Amounts issued to the `hotwallet` addresses from the request. The keys are addresses and the values are arrays of currency amounts they hold. |
| `assets`               | Object                    | _(Omitted if empty)_ Total amounts held that are issued by others. In the recommended configuration, the [issuing address](../../../../concepts/accounts/account-types.md) should have none. |
| `ledger_hash`          | String - [Hash][]         | _(May be omitted)_ The identifying hash of the ledger version that was used to generate this response. |
| `ledger_index`         | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the ledger version that was used to generate this response. |
| `ledger_current_index` | Number - [Ledger Index][] | _(Omitted if `ledger_current_index` is provided)_ The [ledger index][] of the current in-progress ledger version, which was used to retrieve this information. |

## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `invalidHotWallet` - One or more of the addresses specified in the `hotwallet` field is not the [Address][] of an account holding currency issued by the account from the request.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/_snippets/common-links.md" /%}

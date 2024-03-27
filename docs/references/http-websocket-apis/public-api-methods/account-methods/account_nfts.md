---
html: account_nfts.html
parent: account-methods.html
seo:
    description: Get a list of all NFTs for an account.
labels:
  - Non-fungible Tokens, NFTs
---
# account_nfts
[[Source]](https://github.com/xrplf/rippled/blob/master/src/ripple/rpc/handlers/AccountObjects.cpp "Source")

The `account_nfts` method returns a list of `NFToken` objects for the specified account.

_(Added by the [NonFungibleTokensV1_1 amendment][].)_

## Request Format
An example of the request format:

{% raw-partial file="/docs/_snippets/no-cli-syntax.md" /%}

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "command": "account_nfts",
  "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
  "ledger_index": "validated"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_nfts",
  "params": [{
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "ledger_index": "validated"
  }]
}
```
{% /tab %}

{% /tabs %}

[Try it! >](/resources/dev-tools/websocket-api-tool#account_nfts)

The request includes the following parameters:

| Field          | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `account`      | String           | The unique identifier of an account, typically the account's [Address][]. The request returns a list of NFTs owned by this account. |
| `ledger_hash`  | String           | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers][]) |
| `ledger_index` | String or Number | _(Optional)_ The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. (See [Specifying Ledgers][]) |
| `limit`        | Integer          | _(Optional)_ Limit the number of [token pages][NFTokenPage object] to retrieve. Each page can contain up to 32 NFTs. The `limit` value cannot be lower than 20 or more than 400. Positive values outside this range are replaced with the closest valid option. The default is 100. |
| `marker`       | [Marker][]       | _(Optional)_ Value from a previous paginated response. Resume retrieving data where that response left off. |


## Response Format
An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "result": {
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "account_nfts": [
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE0875B974D9F00000004",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 4
      },
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE087727D1EA000000005",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 5
      }
    ],
    "ledger_hash": "7971093E67341E325251268A5B7CD665EF450B126F67DF8384D964DF834961E8",
    "ledger_index": 2380540,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "account": "rsuHaTvJh1bDmDoxX9QcKP7HEBSBt4XsHx",
    "account_nfts": [
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE0875B974D9F00000004",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 4
      },
      {
        "Flags": 1,
        "Issuer": "rGJUF4PvVkMNxG6Bg6AKg3avhrtQyAffcm",
        "NFTokenID": "00010000A7CAD27B688D14BA1A9FA5366554D6ADCF9CE087727D1EA000000005",
        "NFTokenTaxon": 0,
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469",
        "nft_serial": 5
      }
    ],
    "ledger_hash": "46497E9FF17A993324F1A0A693DC068B467184023C7FD162812265EAAFEB97CB",
    "ledger_index": 2380559,
    "status": "success",
    "validated": true
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `account` | String | The account that owns the list of NFTs. |
| `account_nfts` | Array | A list of NFTs owned by the account, formatted as **NFT Objects** (see below). |
| `ledger_hash`          | String                    | _(May be omitted)_ The identifying hash of the ledger that was used to generate this response. |
| `ledger_index`         | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the ledger that was used to generate this response. |
| `ledger_current_index` | Number - [Ledger Index][] | _(May be omitted)_ The ledger index of the current in-progress ledger version, which was used to generate this response. |
| `validated`            | Boolean                   | If included and set to `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |
| `marker`       |  [Marker][]               |  _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. Omitted when there are no additional pages after this one. |

### NFT Objects

Each object in the `account_nfts` array represents one [NFToken][] and has the following fields:

| `Field`        | Type                 | Description                          |
|:---------------|:---------------------|:-------------------------------------|
| `Flags`        | Number               | A bit-map of boolean flags enabled for this NFToken. See [NFToken Flags](../../../protocol/data-types/nftoken.md#nftoken-flags) for possible values. |
| `Issuer`       | String - [Address][] | The account that issued this NFToken. |
| `NFTokenID`    | String               | The unique identifier of this NFToken, in hexadecimal. |
| `NFTokenTaxon` | Number               | The unscrambled version of this token's [taxon](../../../protocol/data-types/nftoken.md#nftokentaxon). Several tokens with the same taxon might represent instances of a limited series. |
| `URI`          | String               | The URI data associated with this NFToken, in hexadecimal. |
| `nft_serial`   | Number               | The token sequence number of this NFToken, which is unique for its issuer. |


## Possible Errors

* Any of the [universal error types][].
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `actNotFound` - The [Address][] specified in the `account` field of the request does not correspond to an account in the ledger.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

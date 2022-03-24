---
html: account_nfts.html
parent: nft-methods.html
blurb: Get a list of all NFTs for an account.
labels:
  - Non-fungible Tokens, NFTs
---
# account_nfts
[[Source]](https://github.com/ripple/rippled/blob/xls20/src/ripple/rpc/handlers/AccountObjects.cpp "Source")
{% include '_snippets/nfts-disclaimer.md' %}

The `account_nfts` method returns a list of `NFToken` objects for the specified account.

## Request Format
An example of the request format:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
   "id": 1,
   "command": "account_nfts",
   "params": [{
   		"account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
   }]
}
```

*JSON-RPC*

```json
{
    "method": "account_nfts",
    "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
}
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](websocket-api-tool.html#account_nfts)

The request includes the following parameters:

| Field                 | Type                       | Description             |
|:----------------------|:---------------------------|:------------------------|
| `account`             | String                     | The unique identifier of an account, typically the account's [Address][]. The request returns a list of NFTs owned by this account. |
|
## Response Format
An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 1,
  "status": "success",
  "type": "response",
  {
    "result": {
      "account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
      "account_nfts": Array(1)
      0:
        "Flags": 1
        "Issuer": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
        "TokenID": "000100002252403649165C1748D1DC71A713A9C40B292AD60000099B00000000"
        "TokenTaxon": 0
        "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
      "nft_serial": 0
      "ledger_current_index": 57855
      "validated": false
    }
  }
}
```

*JSON-RPC*

```json
{
  "result": {
	"account": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
    "account_nfts": Array(1)
       0:
         "Flags": 1
         "Issuer": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
         "TokenID": "000100002252403649165C1748D1DC71A713A9C40B292AD60000099B00000000"
         "TokenTaxon": 0
         "URI": "697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469"
         "nft_serial": 0
    "ledger_current_index": 57855
    "validated": false
	}
}
```

<!-- MULTICODE_BLOCK_END -->

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`        | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `account` | String | The account that owns the list of NFTs |
| `account_nfts` | Array | The list of NFTs owned by the account |
| `ledger_current_index` | Unsigned Integer | The [ledger index][] of this ledger version.           |
| 'validated' | boolean | Validation status of the current ledger. |

## Possible Errors

* Any of the [universal error types][].
* `rpcACT_NOT_FOUND` - The account string is not found on the ledger.


{% include '_snippets/rippled_versions.md' %}
{% include '_snippets/rippled-api-links.md' %}

---
html: freeze-a-trust-line.html
parent: use-tokens.html
blurb: Freeze an individual holder of a token.
filters:
  - include_code
labels:
  - Tokens
  - Security
---
# Freeze a Trust Line

This tutorial shows the steps to [freeze an individual trust line](freezes.html#individual-freeze). The issuer of a token in the XRP Ledger may freeze the trust line to a particular counterparty if that account is engaged in suspicious activity.

**Tip:** As a reminder, freezes only apply to issued tokens, not XRP.


## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](get-started-using-javascript.html) for setup steps.
- This tutorial assumes **you have already [issued a token](issue-a-fungible-token.html)** in the XRP Ledger.
- You **cannot** have enabled the [No Freeze setting](freezes.html#no-freeze), which gives up your ability to freeze individual trust lines.


## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Freeze](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/freeze/) in the source repository for this website.

## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. If you use the best practice of having separate ["cold" and "hot" addresses](issuing-and-operational-addresses.html), you need the keys to the _cold address_, which is the **issuer** of the token.

### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

<!-- MULTICODE_BLOCK_END -->


### {{n.next()}}. Send TrustSet Transaction to Freeze the Trust Line

To enable or disable an Individual Freeze on a specific trust line, send a [TrustSet transaction][] with the [`tfSetFreeze` flag enabled](trustset.html#trustset-flags). The fields of the transaction should be as follows:

| Field                    | Value  | Description |
|--------------------------|--------|-------------|
| `Account`                | String | Your issuing account's address. |
| `TransactionType`        | String | `TrustSet` |
| `LimitAmount`            | Object | Object defining the trust line to freeze. |
| `LimitAmount`.`currency` | String | Currency of the trust line (cannot be XRP) |
| `LimitAmount`.`issuer`   | String | The XRP Ledger address of the counterparty to freeze |
| `LimitAmount`.`value`    | String | The amount of currency you trust this counterparty to issue to you, as a quoted number. As an issuer, this is typically `"0"`. |
| `Flags`                  | Number | To enable a freeze, turn on the `tfSetFreeze` bit (`0x00100000`). |

As always, to send a transaction, you _prepare_ it by filling in all the necessary fields, _sign_ it with your cryptographic keys, and _submit_ it to the network. For example:

***TODO: start_with / end_before on JS code sample as appropriate***

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/set-individual-freeze.js", language="js") }}

_WebSocket_

```json
{
  "id": "example_freeze_individual_line",
  "command": "submit",
  "tx_json": {
    "TransactionType": "TrustSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Flags": 1048576,
    "LastLedgerSequence": 18103014,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "0"
    },
    "Sequence": 340
  },
  "secret": "s████████████████████████████"
}
```

<!-- MULTICODE_BLOCK_END -->


### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)


### {{n.next()}}. Check Trust Line Freeze Status

At this point, the trust line from the counterparty should be frozen. You can check the freeze status of any trust line using the [account_lines method][] with the following fields:

| Field     | Value  | Description                                        |
|:----------|:-------|:---------------------------------------------------|
| `account` | String | Your address. (In this case, the issuing address.) |
| `peer`    | String | The address of the counterparty.                   |

**Caution:** The response includes _all_ trust lines between the two accounts. (Each different currency code uses a different trust line.) Be sure to check the one for the right token.

In the response, the field `"freeze": true` indicates that the account from the request has enabled an Individual Freeze on that trust line. The field `"freeze_peer": true` indicates that the counterparty (`peer`) from the request has frozen the trust line.

***TODO: start_with / end_before on JS code sample as appropriate***

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/check-individual-freeze.js", language="js") }}

_WebSocket_

```json
Example Request:

{
  "id": "example_check_individual_freeze",
  "command": "account_lines",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger": "validated",
  "peer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
}

Example Response:

{
  "id": "example_check_individual_freeze",
  "status": "success",
  "type": "response",
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "lines": [
      {
        "account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "balance": "10",
        "currency": "USD",
        "freeze": true,
        "limit": "0",
        "limit_peer": "110",
        "quality_in": 0,
        "quality_out": 0
      }
    ]
  }
}
```

<!-- MULTICODE_BLOCK_END -->

### {{n.next()}}. (Optional) Send TrustSet Transaction to End the Freeze

If you decide that the trust line no longer needs to be frozen (for example, you investigated and decided that the suspicious activity was benign), you can end the individual freeze in much the same way that you froze the trust line in the first place. To end an individual freeze, send a [TrustSet transaction][] with the [`tfClearFreeze` flag enabled](trustset.html#trustset-flags). The other fields of the transaction should be the same as when you froze the trust line:

| Field                    | Value  | Description |
|--------------------------|--------|-------------|
| `Account`                | String | Your issuing account's address. |
| `TransactionType`        | String | `TrustSet` |
| `LimitAmount`            | Object | Object defining the trust line to unfreeze. |
| `LimitAmount`.`currency` | String | Currency of the trust line (cannot be XRP) |
| `LimitAmount`.`issuer`   | String | The XRP Ledger address of the counterparty to unfreeze |
| `LimitAmount`.`value`    | String | The amount of currency you trust this counterparty to issue to you, as a quoted number. As an issuer, this is typically `"0"`. |
| `Flags`                  | Number | To end an individual freeze, turn on the `tfClearFreeze` bit (`0x00200000`) |

As always, to send a transaction, you _prepare_ it by filling in all the necessary fields, _sign_ it with your cryptographic keys, and _submit_ it to the network. For example:

***TODO: start_with / end_before on JS code sample as appropriate***

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/set-individual-freeze.js", language="js") }}

_WebSocket_

```json
{
  "id": "example_end_individual_freeze",
  "command": "submit",
  "tx_json": {
    "TransactionType": "TrustSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Flags": 2097152,
    "LastLedgerSequence": 18105115,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
      "value": "0"
    },
    "Sequence": 341
  },
  "secret": "s████████████████████████████"
}
```

<!-- MULTICODE_BLOCK_END -->


### {{n.next()}}. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.


## See Also

- **Concepts:**
    - [Freezing Issued Currencies](freezes.html)
    - [Trust Lines and Issuing](trust-lines-and-issuing.html)
- **Tutorials:**
    - [Enable No Freeze](enable-no-freeze.html)
    - [Enact Global Freeze](enact-global-freeze.html)
    - [Change or Remove a Regular Key Pair](change-or-remove-a-regular-key-pair.html)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](accountroot.html#accountroot-flags)
    - [RippleState (trust line) Flags](ripplestate.html#ripplestate-flags)


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}			
{% include '_snippets/tx-type-links.md' %}			
{% include '_snippets/rippled_versions.md' %}

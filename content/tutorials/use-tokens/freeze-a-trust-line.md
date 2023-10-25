---
html: freeze-a-trust-line.html
parent: use-tokens.html
blurb: Freeze an individual holder of a token.
embed_xrpl_js: true
filters:
  - interactive_steps
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

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="static/js/tutorials/freeze-individual-line.js"></script>


## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Freeze](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/freeze/) in the source repository for this website.

## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. If you use the best practice of having separate ["cold" and "hot" addresses](account-types.html), you need the keys to the _cold address_, which is the **issuer** of the token.

{% include '_snippets/interactive-tutorials/generate-step.md' %}

### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

_WebSocket_

```
(Connect to wss:// URL of an XRP Ledger server using your preferred client.)
```

<!-- MULTICODE_BLOCK_END -->

For purposes of this tutorial, use the following interface to connect and perform setup:

{% include '_snippets/interactive-tutorials/connect-step.md' %}


### {{n.next()}}. Choose Trust Line

You can only freeze one trust line per transaction, so you need to know which trust line you want. Each of your trust lines is uniquely identified by these 3 things:

- Your own address.
- The address of the account linked to yours via the trust line.
- The currency code of the trust line.

There can be multiple [trust lines](trust-lines-and-issuing.html) between two accounts, each for a different currency. If you suspect a particular account is behaving maliciously, you may want to freeze all the trust lines between your accounts, one at a time. Use the [account_lines method][] with a pair of accounts to find all trust lines between those accounts, then choose a trust line to freeze from among the results. For example:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/set-individual-freeze.js", language="js", start_with="// Look up current trust lines", end_before="// Send a TrustSet") }}

_WebSocket_

```json
Example Request:

{
  "id": "example_look_up_trust_lines",
  "command": "account_lines",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "peer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
  "ledger_index": "validated"
}

// Example Response:

{
  "id": "example_look_up_trust_lines",
  "result": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "ledger_hash": "AF5C6E6FBC44183D8662C7F5BF88D52F99738A0E66FF07FC7B5A516AC8EA1B37",
    "ledger_index": 67268474,
    "lines": [
      {
        "account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
        "balance": "0",
        "currency": "USD",
        "limit": "0",
        "limit_peer": "110",
        "quality_in": 0,
        "quality_out": 0
      }
    ],
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```

<!-- MULTICODE_BLOCK_END -->

For purposes of this tutorial, a second test address has created a trust line to the test address for the currency "FOO", which you can see in the following example:

{{ start_step("Choose Trust Line")}}
<div class="loader collapse" id="trust-line-setup-loader"><img class="throbber" src="static/img/xrp-loader-96.png">Waiting for setup to complete...</div>
<input type="hidden" id="peer-seed" value="" />
<button id="look-up-trust-lines" class="btn btn-primary" disabled="disabled" title="Wait for setup to complete...">Choose Trust Line</button>
<div class="loader loader-looking collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Looking...</div>
<div class="output-area"></div>
{{ end_step() }}


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

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/set-individual-freeze.js", language="js", start_with="// Send a TrustSet", end_before="// Investigate") }}

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

{{ start_step("Send TrustSet to Freeze") }}
<button class="btn btn-primary previous-steps-required send-trustset" data-wait-step-name="Wait" data-action="start_freeze">Send TrustSet (Freeze)</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

**Note:** If you want to freeze multiple trust lines in different currencies with the same counterparty, repeat this step for each trust line. It is possible to send several transactions in a single ledger if you use a different [sequence number](basic-data-types.html#account-sequence) for each transaction. <!--{# TODO: link rapid/batch submission guidelines when https://github.com/XRPLF/xrpl-dev-portal/issues/1025 is done #}-->


### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}

### {{n.next()}}. Check Trust Line Freeze Status

At this point, the trust line from the counterparty should be frozen. You can check the freeze status of any trust line using the [account_lines method][] with the following fields:

| Field     | Value  | Description                                        |
|:----------|:-------|:---------------------------------------------------|
| `account` | String | Your address. (In this case, the issuing address.) |
| `peer`    | String | The address of the counterparty.                   |

**Caution:** The response includes _all_ trust lines between the two accounts. (Each different currency code uses a different trust line.) Be sure to check the one for the right token.

In the response, the field `"freeze": true` indicates that the account from the request has enabled an Individual Freeze on that trust line. The field `"freeze_peer": true` indicates that the counterparty (`peer`) from the request has frozen the trust line. For example:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/set-individual-freeze.js", language="js", start_with="// Confirm trust line status", end_before="// Investigate") }}

_WebSocket_

```json
Example Request:

{
  "id": "example_check_individual_freeze",
  "command": "account_lines",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated",
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

{{ start_step("Check Freeze Status") }}
<button id="confirm-settings" class="btn btn-primary previous-steps-required">Check Trust Line</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Checking...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. (Optional) Send TrustSet Transaction to End the Freeze

If you decide that the trust line no longer needs to be frozen (for example, you investigated and decided that the suspicious activity was benign), you can end the individual freeze in almost the same way that you froze the trust line in the first place. To end an individual freeze, send a [TrustSet transaction][] with the [`tfClearFreeze` flag enabled](trustset.html#trustset-flags). The other fields of the transaction should be the same as when you froze the trust line:

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

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/set-individual-freeze.js", language="js", start_with="// Clear the individual", end_before="// End main") }}

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

{{ start_step("Send TrustSet to End Freeze") }}
<button class="btn btn-primary previous-steps-required send-trustset" data-wait-step-name="Wait (again)" data-action="end_freeze">Send TrustSet (End Freeze)</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Wait for Validation

As before, wait for the transaction to be validated by consensus.

{{ start_step("Wait (again)") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}



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

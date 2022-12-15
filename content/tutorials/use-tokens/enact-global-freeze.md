---
html: enact-global-freeze.html
parent: use-tokens.html
blurb: Freeze all tokens issued by your address.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Tokens
  - Security
---
# Enact Global Freeze

If you [issue tokens](issued-currencies.html) in the XRP Ledger, can enact a [Global Freeze](freezes.html#global-freeze) to prevent users from sending your tokens to each other and trading your token in the [decentralized exchange](decentralized-exchange.html). This tutorial shows how to enact and end a Global Freeze. You might want to do this, for example, if you see signs of suspicious activity related to your issuing address in the ledger, or to off-ledger systems you use to manage your token. (For example, if your token is a stablecoin and you process withdrawals and deposits from the ledger, you may want to freeze your token while you investigate if you suspect your systems have been hacked.) You can later disable the Global Freeze setting unless you have also enabled the [No Freeze setting](freezes.html#no-freeze).

**Tip:** As a reminder, freezes only apply to issued tokens, not XRP, and do not prevent users from sending the tokens _directly_ back to the issuer.

## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](get-started-using-javascript.html) for setup steps.
- You don't need to have [issued a token](issue-a-fungible-token.html) in the XRP Ledger to enact a Global Freeze, but the main reason you would do so is if you have already issued such a token.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/enact-global-freeze.js"></script>

## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Freeze](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/freeze/) in the source repository for this website.

## Steps
{% set n = cycler(* range(1,99)) %}


### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. If you use the best practice of having separate ["cold" and "hot" addresses](issuing-and-operational-addresses.html), you need the keys to the _cold address_, which is the **issuer** of the token. Only the issuer's Global Freeze setting has any effect on a token.

**Tip:** Unlike the No Freeze setting, you _can_ enable and disable a Global Freeze using a [regular key pair](cryptographic-keys.html) or [multi-signing](multi-signing.html).

For this tutorial, you can get credentials from the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).


### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

<!-- MULTICODE_BLOCK_END -->

For this tutorial, click the following button to connect:

{% include '_snippets/interactive-tutorials/connect-step.md' %}


### {{n.next()}}. Send AccountSet Transaction to Start the Freeze

To enable the Global Freeze setting, send an [AccountSet transaction][] with a `SetFlag` field containing the [`asfGlobalFreeze` value (`7`)](accountset.html#accountset-flags). To send the transaction, you first _prepare_ it to fill out all the necessary fields, then _sign_ it with your account's secret key, and finally _submit_ it to the network.

**Caution:** Enacting a global freeze affects _all tokens issued by the address._ Furthermore, if you use the No Freeze setting, you cannot undo this action.

For example:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/set-global-freeze.js", language="js", start_with="// Prepare an AccountSet", end_before="// Investigate") }}

_WebSocket_

```json
{
  "id": "example_enable_global_freeze",
  "command": "submit",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Flags": 0,
    "SetFlag": 7,
    "LastLedgerSequence": 18122753,
    "Sequence": 349
  },
  "secret": "s████████████████████████████"
}
```

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Send AccountSet (Start Freeze)") }}
<button class="btn btn-primary previous-steps-required send-accountset" data-wait-step-name="Wait" data-action="start_freeze">Send AccountSet</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

{{ start_step("Wait") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Confirm Account Settings

After the transaction is validated, you can check your issuing account's settings to confirm that the Global Freeze flag is enabled. You can do this by calling the [account_info method][] and checking the value of the account's `Flags` field to see if the [`lsfGlobalFreeze` bit (`0x00400000`)](accountroot.html#accountroot-flags) is on.

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/check-global-freeze.js", language="js", start_with="// Request account info", end_before="await client.disconnect()") }}

_WebSocket_

```json
Request:

{
  "id": 1,
  "command": "account_info",
  "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}

Response:

{
  "id": 4,
  "status": "success",
  "type": "response",
  "result": {
    "account_data": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "41320138CA9837B34E82B3B3D6FB1E581D5DE2F0A67B3D62B5B8A8C9C8D970D0",
      "Balance": "100258663",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 12582912,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 4,
      "PreviousTxnID": "41320138CA9837B34E82B3B3D6FB1E581D5DE2F0A67B3D62B5B8A8C9C8D970D0",
      "PreviousTxnLgrSeq": 18123095,
      "Sequence": 352,
      "TransferRate": 1004999999,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
      "urlgravatar": "http://www.gravatar.com/avatar/98b4375e1d753e5b91627516f6d70977"
    },
    "ledger_hash": "A777B05A293A73E511669B8A4A45A298FF89AD9C9394430023008DB4A6E7FDD5",
    "ledger_index": 18123249,
    "validated": true
  }
}
```

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Confirm Settings") }}
<button id="confirm-settings" class="btn btn-primary previous-steps-required">Confirm Settings</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### Intermission: While Frozen

At this point all token issued by your address are frozen. During this time, you may want to investigate the potential security breach or take a snapshot of the balances of your token, depending on your reasons for enacting the global freeze.

Keep in mind that while a token is frozen, it is still possible for the frozen token to be sent _directly to_ or _directly from_ the issuer, so you may still want to disable any systems you have that are configured to send such transactions, and you may want to track incoming transactions without processing them so that you can eventually process the legitimate ones.

If you use a [hot wallet or operational address](issuing-and-operational-addresses.html), it has no special status compared to other users, so it also cannot send and receive the frozen tokens except when dealing directly with the issuer. <!-- STYLE_OVERRIDE: wallet, hot wallet -->

If you use the [No Freeze setting](freezes.html#no-freeze) then the Global Freeze continues forever. If you want to resume issuing tokens, you must create a new account and start over from there.

Otherwise, you can continue to the next step whenever you're ready.


### {{n.next()}}. Send AccountSet Transaction to End the Freeze

To end the Global Freeze, send an [AccountSet transaction][] with a `ClearFlag` field containing the [`asfGlobalFreeze` value (`7`)](accountset.html#accountset-flags). As always, you first _prepare_ the transaction, _sign_ it, and finally _submit_ it to the network.

For example:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/freeze/js/set-global-freeze.js", language="js", start_with="// Now we disable", end_before="// Global freeze disabled") }}

_WebSocket_

```json
{
  "id": "example_disable_global_freeze",
  "command": "submit",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Fee": "12",
    "Flags": 0,
    "ClearFlag": 7,
    "LastLedgerSequence": 18122788,
    "Sequence": 350
  },
  "secret": "s████████████████████████████"
}
```

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Send AccountSet (End Freeze)") }}
<button class="btn btn-primary previous-steps-required send-accountset" data-wait-step-name="Wait (again)" data-action="end_freeze">Send AccountSet (end the freeze)</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{{ start_step("Wait (again)") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Confirm Account Settings

After the transaction is validated, you can confirm the status of the Global Freeze flag in the same way as before: by calling the [account_info method][] and checking the value of the account's `Flags` field to see if the [`lsfGlobalFreeze` bit (`0x00400000`)](accountroot.html#accountroot-flags) is **off**.

{{ start_step("Confirm Settings (After Freeze)") }}
<button id="confirm-settings-end" class="btn btn-primary previous-steps-required">Confirm Settings (After Freeze)</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


## See Also

- **Concepts:**
    - [Freezing Issued Currencies](freezes.html)
    - [Trust Lines and Issuing](trust-lines-and-issuing.html)
- **Tutorials:**
    - [Enable No Freeze](enable-no-freeze.html)
    - [Freeze a Trust Line](freeze-a-trust-line.html)
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

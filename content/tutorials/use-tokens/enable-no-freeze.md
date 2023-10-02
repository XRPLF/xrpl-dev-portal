---
html: enable-no-freeze.html
parent: use-tokens.html
blurb: Permanently give up your account's ability to freeze tokens it issues.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Tokens
steps: ['Generate', 'Connect', 'Send AccountSet', 'Wait', 'Confirm Settings']
---

# Enable No Freeze

If you [issue tokens](issued-currencies.html) in the XRP Ledger, can enable the [No Freeze setting](freezes.html#no-freeze) to permanently limit your own ability to use the token freezing features of the XRP Ledger. (As a reminder, this only applies to issued tokens, not XRP.) This tutorial shows how to enable the No Freeze setting on your issuing account.

## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
  - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](get-started-using-javascript.html) for setup steps.
- You don't need to have [issued a token](issue-a-fungible-token.html) in the XRP Ledger to enable No Freeze, but the main reason you would do so is if you intend to or have already issued such a token.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/enable-no-freeze.js"></script>

## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Freeze](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/freeze/) in the source repository for this website.

## Steps

### 1. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. If you use the best practice of having separate ["cold" and "hot" addresses](account-types.html), you need the **master keys** to the _cold address_, which is the **issuer** of the token. Only the issuer's No Freeze setting has any effect on a token.

**Caution:** You cannot use a [regular key pair](cryptographic-keys.html) or [multi-signing](multi-signing.html) to enable the No Freeze setting.

For this tutorial, you can get credentials from the following interface:

{% partial file="/_snippets/interactive-tutorials/_generate-step.md" /%}

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](secure-signing.html).

### 2. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](client-libraries.html):

{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}

For this tutorial, click the following button to connect:

{% partial file="/_snippets/interactive-tutorials/_connect-step.md" /%}

### 3. Send AccountSet Transaction

To enable the No Freeze setting, send an [AccountSet transaction][] with a `SetFlag` field containing the [`asfNoFreeze` value (`6`)](accountset.html#accountset-flags). To send the transaction, you first _prepare_ it to fill out all the necessary fields, then _sign_ it with your account's secret key, and finally _submit_ it to the network.

For example:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/freeze/js/set-no-freeze.js" startWith="// Submit an AccountSet transaction" endBefore="// Done" language="js" /%}
{% /tab %}
{% tab label="WebSocket" %}
```json
{
  "id": 12,
  "command": "submit",
  "tx_json": {
    "TransactionType": "AccountSet",
    "Account": "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n",
    "Fee": "12",
    "Flags": 0,
    "SetFlag": 6,
    "LastLedgerSequence": 18124917,
    "Sequence": 4
  },
  "secret": "s████████████████████████████"
}
```
{% /tab %}
{% /tabs %}

{% start-step stepIdx=2 steps=$frontmatter.steps %}

<button id="send-accountset" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Send AccountSet</button>
<div class="loader collapse"><img class="throbber" src="/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>

{% /start-step %}

### 4. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](reliable-transaction-submission.html).)

{% partial file="/_snippets/interactive-tutorials/_wait-step.md" /%}

### 5. Confirm Account Settings

After the transaction is validated, you can check your account's settings to confirm that the No Freeze flag is enabled. You can do this by calling the [account_info method][] and checking the value of the account's `Flags` field to see if the [`lsfNoFreeze` bit (`0x00200000`)](accountroot.html#accountroot-flags) is enabled.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/freeze/js/check-no-freeze.js" startWith="// Request account info" endBefore="await client.disconnect()" language="js" /%}
{% /tab %}
{% tab label="WebSocket" %}
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
{% /tab %}
{% /tabs %}


{% start-step stepIdx=4 steps=$frontmatter.steps %}

<button id="confirm-settings" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait">Confirm Settings</button>

<div class="loader collapse"><img class="throbber" src="/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>

{% /start-step %}

## See Also

- **Concepts:**
  - [Freezing Issued Currencies](freezes.html)
  - [Trust Lines and Issuing](trust-lines-and-issuing.html)
- **Tutorials:**
  - [Enact Global Freeze](enact-global-freeze.html)
  - [Freeze a Trust Line](freeze-a-trust-line.html)
- **References:**
  - [account_lines method][]
  - [account_info method][]
  - [AccountSet transaction][]
  - [TrustSet transaction][]
  - [AccountRoot Flags](accountroot.html#accountroot-flags)
  - [RippleState (trust line) Flags](ripplestate.html#ripplestate-flags)

<!--{# common link defs #}-->

{% partial file="/_snippets/rippled-api-links.md" %}
{% partial file="/_snippets/tx-type-links.md" %}
{% partial file="/_snippets/rippled_versions.md" %}

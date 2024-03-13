---
html: enact-global-freeze.html
parent: use-tokens.html
seo:
    description: Freeze all tokens issued by your address.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Tokens
  - Security
steps: ['Generate', 'Connect', 'Send AccountSet (Start Freeze)', 'Wait', 'Confirm Settings', 'Send AccountSet (End Freeze)', 'Wait (again)', 'Confirm Settings (After Freeze)']
---
# Enact Global Freeze

If you [issue tokens](../../../concepts/tokens/index.md) in the XRP Ledger, can enact a [Global Freeze](../../../concepts/tokens/fungible-tokens/freezes.md#global-freeze) to prevent users from sending your tokens to each other and trading your token in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md). This tutorial shows how to enact and end a Global Freeze. You might want to do this, for example, if you see signs of suspicious activity related to your issuing address in the ledger, or to off-ledger systems you use to manage your token. (For example, if your token is a stablecoin and you process withdrawals and deposits from the ledger, you may want to freeze your token while you investigate if you suspect your systems have been hacked.) You can later disable the Global Freeze setting unless you have also enabled the [No Freeze setting](../../../concepts/tokens/fungible-tokens/freezes.md#no-freeze).

**Tip:** As a reminder, freezes only apply to issued tokens, not XRP, and do not prevent users from sending the tokens _directly_ back to the issuer.

## Prerequisites

- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../../javascript/build-apps/get-started.md) for setup steps.
- You don't need to have [issued a token](issue-a-fungible-token.md) in the XRP Ledger to enact a Global Freeze, but the main reason you would do so is if you have already issued such a token.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/enact-global-freeze.js"></script>

## Example Code

Complete sample code for all of the steps of this tutorial is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Freeze](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/freeze/) in the source repository for this website.

## Steps

### 1. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. If you use the best practice of having separate ["cold" and "hot" addresses](../../../concepts/accounts/account-types.md), you need the keys to the _cold address_, which is the **issuer** of the token. Only the issuer's Global Freeze setting has any effect on a token.

**Tip:** Unlike the No Freeze setting, you _can_ enable and disable a Global Freeze using a [regular key pair](../../../concepts/accounts/cryptographic-keys.md) or [multi-signing](../../../concepts/accounts/multi-signing.md).

For this tutorial, you can get credentials from the following interface:

{% partial file="/docs/_snippets/interactive-tutorials/generate-step.md" /%}

When you're building production-ready software, you should use an existing account, and manage your keys using a [secure signing configuration](../../../concepts/transactions/secure-signing.md).


### 2. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server a supported [client library](../../../references/client-libraries.md):

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}
{% /tab %}

{% /tabs %}

For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%}


### 3. Send AccountSet Transaction to Start the Freeze

To enable the Global Freeze setting, send an [AccountSet transaction][] with a `SetFlag` field containing the [`asfGlobalFreeze` value (`7`)](../../../references/protocol/transactions/types/accountset.md#accountset-flags). To send the transaction, you first _prepare_ it to fill out all the necessary fields, then _sign_ it with your account's secret key, and finally _submit_ it to the network.

**Caution:** Enacting a global freeze affects _all tokens issued by the address._ Furthermore, if you use the No Freeze setting, you cannot undo this action.

For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/freeze/js/set-global-freeze.js" from="// Prepare an AccountSet" before="// Investigate" language="js" /%}
{% /tab %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% /tabs %}

{% interactive-block label="Send AccountSet (Start Freeze)" steps=$frontmatter.steps %}

<button class="btn btn-primary previous-steps-required send-accountset" data-wait-step-name="Wait" data-action="start_freeze">Send AccountSet</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 4. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. If the XRP Ledger is busy or poor network connectivity delays a transaction from being relayed throughout the network, a transaction may take longer to be confirmed. (For information on how to set an expiration for transactions, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).)

{% interactive-block label="Wait" steps=$frontmatter.steps %}

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" /%}

{% /interactive-block %}


### 5. Confirm Account Settings

After the transaction is validated, you can check your issuing account's settings to confirm that the Global Freeze flag is enabled. You can do this by calling the [account_info method][] and checking the value of the account's `Flags` field to see if the [`lsfGlobalFreeze` bit (`0x00400000`)](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags) is on.

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/freeze/js/check-global-freeze.js" from="// Request account info" before="await client.disconnect()" language="js" /%}
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

{% interactive-block label="Confirm Settings" steps=$frontmatter.steps %}

<button id="confirm-settings" class="btn btn-primary previous-steps-required">Confirm Settings</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### Intermission: While Frozen

At this point all token issued by your address are frozen. During this time, you may want to investigate the potential security breach or take a snapshot of the balances of your token, depending on your reasons for enacting the global freeze.

Keep in mind that while a token is frozen, it is still possible for the frozen token to be sent _directly to_ or _directly from_ the issuer, so you may still want to disable any systems you have that are configured to send such transactions, and you may want to track incoming transactions without processing them so that you can eventually process the legitimate ones.

If you use a [hot wallet or operational address](../../../concepts/accounts/account-types.md), it has no special status compared to other users, so it also cannot send and receive the frozen tokens except when dealing directly with the issuer. <!-- STYLE_OVERRIDE: wallet, hot wallet -->

If you use the [No Freeze setting](../../../concepts/tokens/fungible-tokens/freezes.md#no-freeze) then the Global Freeze continues forever. If you want to resume issuing tokens, you must create a new account and start over from there.

Otherwise, you can continue to the next step whenever you're ready.


### 6. Send AccountSet Transaction to End the Freeze

To end the Global Freeze, send an [AccountSet transaction][] with a `ClearFlag` field containing the [`asfGlobalFreeze` value (`7`)](../../../references/protocol/transactions/types/accountset.md#accountset-flags). As always, you first _prepare_ the transaction, _sign_ it, and finally _submit_ it to the network.

For example:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/freeze/js/set-global-freeze.js" from="// Now we disable" before="// Global freeze disabled" language="js" /%}
{% /tab %}

{% tab label="WebSocket" %}
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
{% /tab %}

{% /tabs %}

{% interactive-block label="Send AccountSet (End Freeze)" steps=$frontmatter.steps %}

<button class="btn btn-primary previous-steps-required send-accountset" data-wait-step-name="Wait (again)" data-action="end_freeze">Send AccountSet (end the freeze)</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 7. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait (again)"} /%}


### 8. Confirm Account Settings

After the transaction is validated, you can confirm the status of the Global Freeze flag in the same way as before: by calling the [account_info method][] and checking the value of the account's `Flags` field to see if the [`lsfGlobalFreeze` bit (`0x00400000`)](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags) is **off**.

{% interactive-block label="Confirm Settings (After Freeze)" steps=$frontmatter.steps %}

<button id="confirm-settings-end" class="btn btn-primary previous-steps-required">Confirm Settings (After Freeze)</button>

{% loading-icon message="Sending..." /%}

<div class="output-area"></div>

{% /interactive-block %}


## See Also

- **Concepts:**
    - [Freezing Issued Currencies](../../../concepts/tokens/fungible-tokens/freezes.md)
    - [Trust Lines](../../../concepts/tokens/fungible-tokens/index.md)
- **Tutorials:**
    - [Enable No Freeze](enable-no-freeze.md)
    - [Freeze a Trust Line](freeze-a-trust-line.md)
    - [Change or Remove a Regular Key Pair](../manage-account-settings/change-or-remove-a-regular-key-pair.md)
- **References:**
    - [account_lines method][]
    - [account_info method][]
    - [AccountSet transaction][]
    - [TrustSet transaction][]
    - [AccountRoot Flags](../../../references/protocol/ledger-data/ledger-entry-types/accountroot.md#accountroot-flags)
    - [RippleState (trust line) Flags](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#ripplestate-flags)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

---
html: issue-a-fungible-token.html
parent: use-tokens.html
blurb: Create your own token and issue it on the XRP Ledger Testnet.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Tokens
---
# Issue a Fungible Token

Anyone can issue various types of tokens in the XRP Ledger, ranging from informal "IOUs" to fiat-backed stablecoins, purely digital fungible and semi-fungible tokens, and more. This tutorial shows the technical steps of creating a token in the ledger. For more information on how XRP Ledger tokens work, see [Issued Currencies](issued-currencies.html); for more on the business decisions involved in issuing a stablecoin, see [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html). <!-- STYLE_OVERRIDE: ious -->

## Prerequisites

- You need two funded XRP Ledger accounts, each with an address, secret key, and some XRP. For this tutorial, you can generate new test credentials as needed.
    - Each address needs enough XRP to satisfy the [reserve requirement](reserves.html) including the additional reserve for a trust line.
- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](get-started-using-javascript.html) for setup steps.
    - **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](get-started-using-python.html) for setup steps.
    - **Java** with the [xrpl4j library](https://github.com/XRPLF/xrpl4j). See [Get Started Using Java](get-started-using-java.html) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/issue-a-token.js"></script>

## Example Code

Complete sample code for all of the steps of these tutorials is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Issue a Fungible Token](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/issue-a-token/) in the source repository for this website.

## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. You also need one or more recipients who are willing to hold the tokens you issue: unlike in some other blockchains, in the XRP Ledger you cannot force someone to hold a token they do not want.

The best practice is to use ["cold" and "hot" addresses](issuing-and-operational-addresses.html). The cold address is the **issuer** of the token. The hot address is like a regular user's address that you control. It receives tokens from the cold address, which you can then transfer to other users. A hot address is not strictly necessary, since you could send tokens directly to users from the cold address, but it is good practice for security reasons. In production, you should take extra care of the cold address's cryptographic keys (for example, keeping them offline) because it is much harder to replace a cold address than a hot address.

In this tutorial, the hot address receives the tokens you issue from the cold address. You can get the keys for two addresses using the following interface.

<!-- Special version of generate-step.md for getting sender AND receiver credentials -->
{% if use_network is undefined or use_network == "Testnet" %}
  {% set use_network = "Testnet" %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% elif use_network == "Devnet" %}
  {% set faucet_url = "https://faucet.devnet.rippletest.net/accounts" %}
{# No faucet for Mainnet! #}
{% endif %}
{{ start_step("Generate") }}
<button id="generate-2x-creds-button" class="btn btn-primary" data-fauceturl="{{faucet_url}}">Get {{use_network}} credentials</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Generating Keys...</div>
<div class="output-area"></div>
{{ end_step() }}

**Caution:** Ripple provides the [Testnet and Devnet](parallel-networks.html) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, **do not** use the same addresses on Testnet/Devnet and Mainnet.

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).


### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server with a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/get-started/js/base.js", language="js") }}

_Python_

{{ include_code("_code-samples/issue-a-token/py/issue-a-token.py", start_with="# Connect", end_before="# Get credentials", language="py") }}

_Java_

{{ include_code("_code-samples/issue-a-token/java/IssueToken.java", start_with="// Construct a network client", end_before="// Create cold", language="java") }}

<!-- MULTICODE_BLOCK_END -->


**Note:** The JavaScript code samples in this tutorial use the [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, click the following button to connect:

{% include '_snippets/interactive-tutorials/connect-step.md' %}


### {{n.next()}}. Configure Issuer Settings

First, configure the settings for your cold address (which will become the issuer of your token). Most settings can be reconfigured later, with the following exceptions: <!-- STYLE_OVERRIDE: will -->

- [Default Ripple][]: **This setting is required** so that users can send your token to each other. It's best to enable it _before_ setting up any trust lines or issuing any tokens.
- [Authorized Trust Lines][]: (Optional) This setting (also called "Require Auth") limits your tokens to being held _only_ by accounts you've explicitly approved. You cannot enable this setting if you already have any trust lines or offers for _any_ token.
    **Note:** To use authorized trust lines, you must perform additional steps that are not shown in this tutorial.

[Default Ripple]: rippling.html
[Authorized Trust Lines]: authorized-trust-lines.html

Other settings you may want to, optionally, configure for your cold address (issuer):

| Setting                      | Recommended Value   | Summary                 |
|:-----------------------------|:--------------------|:------------------------|
| [Require Destination Tags][] | Enabled or Disabled | Enable if you process withdrawals of your token to outside systems. (For example, your token is a stablecoin.) |
| Disallow XRP                 | Enabled or Disabled | Enable if this address isn't meant to process XRP payments. |
| [Transfer Fee][]             | 0–1%                | Charge a percentage fee when users send your token to each other. |
| [Tick Size][]                | 5                   | Limit the number of decimal places in exchange rates for your token in the [decentralized exchange](decentralized-exchange.html). A tick size of 5-6 reduces churn of almost-equivalent offers and speeds up price discovery compared to the default of 15. |
| [Domain][]                   | (Your domain name)  | Set to a domain you own so can [verify ownership of the accounts](xrp-ledger-toml.html#account-verification). This can help reduce confusion or impersonation attempts. |

[Require Destination Tags]: require-destination-tags.html
[Transfer Fee]: transfer-fees.html
[Tick Size]: ticksize.html
[Domain]: accountset.html#domain

You can change these settings later as well.

**Note:** Many issuing settings apply equally to all tokens issued by an address, regardless of the currency code. If you want to issue multiple types of tokens in the XRP Ledger with different settings, you should use a different address to issue each different token.

The following code sample shows how to send an [AccountSet transaction][] to enable the recommended cold address settings:


<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/issue-a-token/js/issue-a-token.js", start_with="// Configure issuer", end_before="// Configure hot", language="js") }}

_Python_

{{ include_code("_code-samples/issue-a-token/py/issue-a-token.py", start_with="# Configure issuer", end_before="# Configure hot", language="py") }}

_Java_

{{ include_code("_code-samples/issue-a-token/java/IssueToken.java", start_with="// Configure issuer", end_before="// Configure hot", language="java") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Configure Issuer") }}
<form>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="cold-default-ripple" disabled="disabled" checked title="The issuer MUST enable Default Ripple first." />
      <label for="cold-default-ripple" class="col-form-label" title="The issuer MUST enable Default Ripple first.">Default Ripple</label>
    </div>
  </div>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="cold-require-dest" />
      <label for="cold-require-dest" class="col-form-label">Require Destination Tags</label>
    </div>
  </div>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="cold-disallow-xrp" checked />
      <label for="cold-disallow-xrp" class="col-form-label">Disallow XRP</label>
    </div>
  </div>
  <div class="form-group row">
    <label for="cold-transfer-fee" class="col-form-label col-sm-3">Transfer Fee</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="cold-transfer-fee" value="0" step="0.0000001" min="0" max="100" />
      <div class="input-group-append">
        <div class="input-group-text">%</div>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label for="cold-tick-size" class="col-form-label col-sm-3">Tick Size</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="cold-tick-size" value="5" step="1" min="0" max="15" />
    </div>
  </div>
  <div class="form-group row">
    <label for="cold-domain-text" class="col-form-label col-sm-3">Domain</label>
    <div class="input-group col">
      <div>
        <input type="text" class="form-control" value="example.com" pattern="([a-z0-9][a-z0-9-]{0,62}[.])+[a-z]{2,6}" id="cold-domain-text" title="lower-case domain name of the account owner" />
        <small class="form-text">(text)</small>
      </div>
    </div>
    <div class="input-group col">
      <div class="col">
        <label class="form-control-plaintext" id="cold-domain-hex" for="cold-domain-text">6578616D706C652E636F6D</label>
        <small class="form-text">(hexadecimal)</small>
      </div>
    </div>
  </div>
</form>
<button id="config-issuer-button" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait (Issuer Setup)">Configure issuer</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. You should wait for your earlier transactions to be fully validated before proceeding to the later steps, to avoid unexpected failures from things executing out of order. For more information, see [Reliable Transaction Submission](reliable-transaction-submission.html).

The code samples in this tutorial use helper functions to wait for validation when submitting a transaction:

- **JavaScript:** The `submit_and_verify()` function, as defined in the [submit-and-verify code sample](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/submit-and-verify).
- **Python:** The `send_reliable_submission()` [method of the xrpl-py library](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.send_reliable_submission).
- **Java:** The `submitAndWaitForValidation()` method in the [sample Java class](https://github.com/XRPLF/xrpl-dev-portal/blob/master/content/_code-samples/issue-a-token/java/IssueToken.java).

**Tip:** Technically, you can configure the hot address in parallel with configuring the issuer address. For simplicity, this tutorial waits for each transaction one at a time.

{{ start_step("Wait (Issuer Setup)") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Configure Hot Address Settings

The hot address does not strictly require any settings changes from the default, but the following are recommended as best practices:

| Setting                      | Recommended Value   | Summary                 |
|:-----------------------------|:--------------------|:------------------------|
| [Default Ripple][]           | Disabled            | Leave this setting **disabled.** (This is the default.) |
| [Authorized Trust Lines][]   | Enabled             | Enable this setting on the hot address—and never approve any trust lines to the hot address—to prevent accidentally issuing tokens from the wrong address. (Optional, but recommended.) |
| [Require Destination Tags][] | Enabled or Disabled | Enable if you process withdrawals of your token to outside systems. (For example, your token is a stablecoin.) |
| Disallow XRP                 | Enabled or Disabled | Enable if this address isn't meant to process XRP payments. |
| [Domain][]                   | (Your domain name)  | Set to a domain you own so can [verify ownership of the accounts](xrp-ledger-toml.html#account-verification). This can help reduce confusion or impersonation attempts. |

The following code sample shows how to send an [AccountSet transaction][] to enable the recommended hot address settings:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/issue-a-token/js/issue-a-token.js", start_with="// Configure hot address", end_before="// Create trust line", language="js") }}

_Python_

{{ include_code("_code-samples/issue-a-token/py/issue-a-token.py", start_with="# Configure hot address", end_before="# Create trust line", language="py") }}

_Java_

{{ include_code("_code-samples/issue-a-token/java/IssueToken.java", start_with="// Configure hot address", end_before="// Create trust line", language="java") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Configure Hot Address") }}
<form>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="hot-default-ripple" disabled="disabled" title="Default Ripple must remain disabled on the hot address." />
      <label for="hot-default-ripple" class="form-check-label" title="Default Ripple must remain disabled on the hot address.">Default Ripple</label>
    </div>
  </div>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="hot-require-auth" disabled="disabled" checked="checked" title="The hot address should enable Authorized Trust Lines as a precaution." />
      <label for="hot-default-ripple" class="form-check-label" title="The hot address should enable Authorized Trust Lines as a precaution.">Authorized Trust Lines</label>
    </div>
  </div>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="hot-require-dest" />
      <label for="hot-require-dest" class="form-check-label">Require Destination Tags</label>
    </div>
  </div>
  <div class="form-inline">
    <div class="input-group form-check">
      <input type="checkbox" class="form-check-input mr-3" value="" id="hot-disallow-xrp" checked="checked" />
      <label for="hot-disallow-xrp" class="form-check-label">Disallow XRP</label>
    </div>
  </div>
  <div class="form-group row">
    <label for="hot-domain-text" class="col-form-label col-sm-3">Domain</label>
    <div class="input-group col">
      <div>
        <input type="text" class="form-control" value="example.com" pattern="([a-z0-9][a-z0-9-]{0,62}[.])+[a-z]{2,6}" id="hot-domain-text" title="lower-case domain name of the account owner" />
        <small class="form-text">(text)</small>
      </div>
    </div>
    <div class="input-group col">
      <div class="col">
        <label class="form-control-plaintext" id="hot-domain-hex" for="hot-domain-text">6578616D706C652E636F6D</label>
        <small class="form-text">(hexadecimal)</small>
      </div>
    </div>
  </div>
</form>
<button id="config-hot-address-button" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait (Hot Address Setup)">Configure hot address</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{{ start_step("Wait (Hot Address Setup)") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Create Trust Line from Hot to Cold Address

Before you can receive tokens, you need to create a [trust line](trust-lines-and-issuing.html) to the token issuer. This trust line is specific to the [currency code](currency-formats.html#currency-codes) of the token you want to issue, such as USD or FOO. You can choose any currency code you want; each issuer's tokens are treated as separate in the XRP Ledger protocol. However, users' balances of tokens with the same currency code can [ripple](rippling.html) between different issuers if the users enable rippling settings.

The hot address needs a trust line like this before it can receive tokens from the issuer. Similarly, each user who wants to hold your token must also create a trust line[¹](#footnotes). Each trust line increases the [reserve requirement](reserves.html) of the hot address, so you must hold enough spare XRP to pay for the increased requirement. Your reserve requirement goes back down if you remove the trust line.

**Tip:** A trust line has a "limit" on how much the recipient is willing to hold; others cannot send you more tokens than your specified limit. For community credit systems, you may want to configure limits per individual based on how much you trust that person. For other types and uses of tokens, it is normally OK to set the limit to a very large number.

To create a trust line, send a [TrustSet transaction][] from the **hot address** with the following fields:

| Field                  | Value                                               |
|:-----------------------|:----------------------------------------------------|
| `TransactionType`      | `"TrustSet"`                                        |
| `Account`              | The hot address. (More generally, this is the account that wants to receive the token.) |
| `LimitAmount`          | An object specifying how much, of which token, from which issuer, you are willing to hold. |
| `LimitAmount.currency` | The currency code of the token.                     |
| `LimitAmount.issuer`   | The cold address.             |
| `LimitAmount.value`    | The maximum amount of the token you are willing to hold. |

The following code sample shows how to send a [TrustSet transaction][] from the hot address, trusting the issuing address for a limit of 1 billion FOO:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/issue-a-token/js/issue-a-token.js", start_with="// Create trust line", end_before="// Send token", language="js") }}

_Python_

{{ include_code("_code-samples/issue-a-token/py/issue-a-token.py", start_with="# Create trust line", end_before="# Send token", language="py") }}

_Java_

{{ include_code("_code-samples/issue-a-token/java/IssueToken.java", start_with="// Create trust line", end_before="// Send token", language="java") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Make Trust Line") }}
<form>
  <p>Currency code:</p>
  <div class="container">
    <div class="input-group row">
      <div class="input-group-prepend">
        <div class="input-group-text form-check bg-transparent">
          <input type="radio" id="use-std-code" name="currency-code-type" checked="checked" />
        </div>
      </div>
      <label for="use-std-code" class="input-group-text col-lg-3">Standard:</label>
      <input type="text" id="currency-code-std" pattern="[A-Za-z0-9?!@#$%*(){}|\x26\x3c\x3e]{3}" value="FOO" class="form-control col-lg-8" title="3 character code (letters, numbers, and some symbols)" />
    </div>

    <div class="input-group row mt-2">
      <div class="input-group-prepend">
        <div class="input-group-text form-check bg-transparent">
          <input type="radio" id="use-hex-code" name="currency-code-type" />
        </div>
      </div>
      <label for="use-hex-code" class="input-group-text col-lg-3">Non-standard:</label>
      <input type="text" id="currency-code-hex" pattern="[0-9A-F]{40}" value="015841551A748AD2C1F76FF6ECB0CCCD00000000" title="40 hexadecimal characters" class="form-control col-lg-8" />
    </div>

    <div class="input-group row mt-4">
      <label for="trust-limit" class="input-group-text col-lg-3">Limit:</label>
      <input type="number" id="trust-limit" min="0" value="1000000000" title="Maximum amount the hot address can hold" class="form-control col-lg-9" />
    </div>
  </div>
</form>
<button id="create-trust-line-button" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait (TrustSet)">Create Trust Line</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}

**Note:** If you use [Authorized Trust Lines][], there is an extra step after this one: the cold address must approve the trust line from the hot address. For details of how to do this, see [Authorizing Trust Lines](authorized-trust-lines.html#authorizing-trust-lines).


### {{n.next()}}. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{{ start_step("Wait (TrustSet)") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Send Token

Now you can create tokens by sending a [Payment transaction][] from the cold address to the hot address. This transaction should have the following attributes (dot notation indicates nested fields):

| Field | Value |
|---|---|
| `TransactionType` | `"Payment"` |
| `Account` | The cold address issuing the token. |
| `Amount` | An [token amount](basic-data-types.html#specifying-currency-amounts) specifying how much of which token to create. |
| `Amount.currency` | The currency code of the token. |
| `Amount.value` | Decimal amount of the token to issue, as a string. |
| `Amount.issuer` | The cold address issuing the token. |
| `Destination` | The hot address (or other account receiving the token) |
| `Paths` | Omit this field when issuing tokens. |
| `SendMax` | Omit this field when issuing tokens. |
| `DestinationTag` | Any whole number from 0 to 2<sup>32</sup>-1. You must specify _something_ here if you enabled [Require Destination Tags][] on the hot address. |

You can use [auto-filled values](transaction-common-fields.html#auto-fillable-fields) for all other required fields.

The following code sample shows how to send a [Payment transaction][] to issue 88 FOO from the cold address to the hot address:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/issue-a-token/js/issue-a-token.js", start_with="// Send token", end_before="// Check balances", language="js") }}

_Python_

{{ include_code("_code-samples/issue-a-token/py/issue-a-token.py", start_with="# Send token", end_before="# Check balances", language="py") }}

_Java_

{{ include_code("_code-samples/issue-a-token/java/IssueToken.java", start_with="// Send token", end_before="// Check balances", language="java") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Send Token") }}
<form>
  <div class="form-inline mt-2">
    <div class="input-group">
      <label for="send-amount" class="input-group-text">Send amount:</label>
      <input type="number" id="send-amount" min="0" value="123.45" step="0.01" title="How much to send to the hot address" class="form-control" />
      <div class="input-group-append">
        <span class="input-group-text" id="send-currency-code">FOO</span>
      </div>
    </div>
  </div>
  <div class="form-inline mt-2">
    <div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text bg-transparent">
          <input type="checkbox" id="use-dest-tag" class="mr-2" checked="checked" />
        </div>
      </div>
      <label for="dest-tag" class="input-group-text">DestinationTag:</label>
      <input type="number" id="dest-tag" value="0" min="0" max="4294967295" class="form-control" title="Any 32-bit integer" />
    </div>
  </div>
</form>
<button id="send-token-button" class="btn btn-primary previous-steps-required" data-wait-step-name="Wait (Payment)">Send Token</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{{ start_step("Wait (Payment)") }}
{% include '_snippets/interactive-tutorials/wait-step.md' %}
{{ end_step() }}


### {{n.next()}}. Confirm Token Balances

You can check the balances of your token from the perspective of either the token issuer or the hot address. Tokens issued in the XRP Ledger always have balances that sum to 0: negative from the perspective of the issuer and positive from the perspective of the holder.

Use the [account_lines method][] to look up the balances from the perspective of the holder. This lists each trust line along with its limit, balance, and settings.

Use the [gateway_balances method][] to look up balances from the perspective of a token issuer. This provides a sum of all tokens issued by a given address.

**Tip:** Since the XRP Ledger is fully public, you can check the balances of any account at any time without needing any cryptographic keys.

The following code sample shows how to use both methods:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/issue-a-token/js/issue-a-token.js", start_with="// Check balances", end_before="// End of", language="js") }}

_Python_

{{ include_code("_code-samples/issue-a-token/py/issue-a-token.py", start_with="# Check balances", language="py") }}

_Java_

{{ include_code("_code-samples/issue-a-token/java/IssueToken.java", start_with="// Check balances", end_before="// Helper", language="java") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Confirm Balances") }}
<button id="confirm-balances-button" class="btn btn-primary previous-steps-required">Confirm Balances</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Checking...</div>
<div class="output-area"></div>
{{ end_step() }}


### Next Steps

Now that you've created the token, you can explore how it fits into features of the XRP Ledger:

- Send tokens from the hot address to other users.
- Trade it in the decentralized exchange.
- Monitor for incoming payments of your token.
- Create an [xrp-ledger.toml file](xrp-ledger-toml.html) and set up domain verification for your token's issuer.
- Learn about other [features of XRP Ledger tokens](issued-currencies.html).


## Footnotes

¹ Users can hold your token without explicitly creating a trust line if they buy your token in the [decentralized exchange](decentralized-exchange.html). Buying a token in the exchange [automatically creates the necessary trust lines](offers.html#offers-and-trust). This is only possible if someone is selling your token in the decentralized exchange.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

---
html: issue-a-fungible-token.html
parent: use-tokens.html
seo:
    description: Create your own token and issue it on the XRP Ledger Testnet.
embed_xrpl_js: true
filters:
  - interactive_steps
labels:
  - Tokens
steps: ['Generate', 'Connect', 'Configure Issuer', 'Wait (Issuer Setup)', 'Configure Hot Address', 'Wait (Hot Address Setup)', 'Make Trust Line', 'Wait (TrustSet)', 'Send Token', 'Wait (Payment)', 'Confirm Balances']
---
# Issue a Fungible Token

Anyone can issue various types of tokens in the XRP Ledger, ranging from informal "IOUs" to fiat-backed stablecoins, purely digital fungible and semi-fungible tokens, and more. This tutorial shows the technical steps of creating a token in the ledger. For more information on how XRP Ledger tokens work, see [Issued Currencies](../../../concepts/tokens/index.md); for more on the business decisions involved in issuing a stablecoin, see [Stablecoin Issuer](../../../use-cases/tokenization/stablecoin-issuer.md). <!-- STYLE_OVERRIDE: ious -->

## Prerequisites

- You need two funded XRP Ledger accounts, each with an address, secret key, and some XRP. For this tutorial, you can generate new test credentials as needed.
    - Each address needs enough XRP to satisfy the [reserve requirement](../../../concepts/accounts/reserves.md) including the additional reserve for a trust line.
- You need a connection to the XRP Ledger network. As shown in this tutorial, you can use public servers for testing.
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/). See [Get Started Using JavaScript](../../javascript/build-apps/get-started.md) for setup steps.
    - **Python** with the [`xrpl-py` library](https://xrpl-py.readthedocs.io/). See [Get Started using Python](../../python/build-apps/get-started.md) for setup steps.
    - **Java** with the [xrpl4j library](https://github.com/XRPLF/xrpl4j). See [Get Started Using Java](../../java/build-apps/get-started.md) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="/js/interactive-tutorial.js"></script>
<script type="application/javascript" src="/js/tutorials/issue-a-token.js"></script>

## Example Code

Complete sample code for all of the steps of these tutorials is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Issue a Fungible Token](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/issue-a-token/) in the source repository for this website.

## Steps

### 1. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. You also need one or more recipients who are willing to hold the tokens you issue: unlike in some other blockchains, in the XRP Ledger you cannot force someone to hold a token they do not want.

The best practice is to use ["cold" and "hot" addresses](../../../concepts/accounts/account-types.md). The cold address is the **issuer** of the token. The hot address is like a regular user's address that you control. It receives tokens from the cold address, which you can then transfer to other users. A hot address is not strictly necessary, since you could send tokens directly to users from the cold address, but it is good practice for security reasons. In production, you should take extra care of the cold address's cryptographic keys (for example, keeping them offline) because it is much harder to replace a cold address than a hot address.

In this tutorial, the hot address receives the tokens you issue from the cold address. You can get the keys for two addresses using the following interface.

<!-- Special version of generate-step.md for getting sender AND receiver credentials -->

{% interactive-block label="Generate" steps=$frontmatter.steps %}

<button id="generate-2x-creds-button" class="btn btn-primary" data-fauceturl="https://faucet.altnet.rippletest.net/accounts">Get Testnet credentials</button>

{% loading-icon message="Generating Keys..." /%}

<div class="output-area"></div>

{% /interactive-block %}

**Caution:** Ripple provides the [Testnet and Devnet](../../../concepts/networks-and-servers/parallel-networks.md) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, **do not** use the same addresses on Testnet/Devnet and Mainnet.

When you're building production-ready software, you should use an existing account, and manage your keys using a [secure signing configuration](../../../concepts/transactions/secure-signing.md).


### 2. Connect to the Network

You must be connected to the network to submit transactions to it. The following code shows how to connect to a public XRP Ledger Testnet server with a supported [client library](../../../references/client-libraries.md):

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/get-started/js/base.js" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-a-token/py/issue-a-token.py" from="# Connect" before="# Get credentials" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/issue-a-token/java/IssueToken.java" from="// Construct a network client" before="// Create cold" language="java" /%}
{% /tab %}

{% /tabs %}


**Note:** The JavaScript code samples in this tutorial use the [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, click the following button to connect:

{% partial file="/docs/_snippets/interactive-tutorials/connect-step.md" /%}


### 3. Configure Issuer Settings

First, configure the settings for your cold address (which will become the issuer of your token). Most settings can be reconfigured later, with the following exceptions: <!-- STYLE_OVERRIDE: will -->

- [Default Ripple][]: **This setting is required** so that users can send your token to each other. It's best to enable it _before_ setting up any trust lines or issuing any tokens.
- [Authorized Trust Lines][]: (Optional) This setting (also called "Require Auth") limits your tokens to being held _only_ by accounts you've explicitly approved. You cannot enable this setting if you already have any trust lines or offers for _any_ token.
    **Note:** To use authorized trust lines, you must perform additional steps that are not shown in this tutorial.

[Default Ripple]: ../../../concepts/tokens/fungible-tokens/rippling.md
[Authorized Trust Lines]: ../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md

Other settings you may want to, optionally, configure for your cold address (issuer):

| Setting                      | Recommended Value   | Summary                 |
|:-----------------------------|:--------------------|:------------------------|
| [Require Destination Tags][] | Enabled or Disabled | Enable if you process withdrawals of your token to outside systems. (For example, your token is a stablecoin.) |
| Disallow XRP                 | Enabled or Disabled | Enable if this address isn't meant to process XRP payments. |
| [Transfer Fee][]             | 0–1%                | Charge a percentage fee when users send your token to each other. |
| [Tick Size][]                | 5                   | Limit the number of decimal places in exchange rates for your token in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md). A tick size of 5-6 reduces churn of almost-equivalent offers and speeds up price discovery compared to the default of 15. |
| [Domain][]                   | (Your domain name)  | Set to a domain you own so can [verify ownership of the accounts](../../../references/xrp-ledger-toml.md#account-verification). This can help reduce confusion or impersonation attempts. |

[Require Destination Tags]: ../manage-account-settings/require-destination-tags.md
[Transfer Fee]: ../../../concepts/tokens/transfer-fees.md
[Tick Size]: ../../../concepts/tokens/decentralized-exchange/ticksize.md
[Domain]: ../../../references/protocol/transactions/types/accountset.md#domain

You can change these settings later as well.

**Note:** Many issuing settings apply equally to all tokens issued by an address, regardless of the currency code. If you want to issue multiple types of tokens in the XRP Ledger with different settings, you should use a different address to issue each different token.

The following code sample shows how to send an [AccountSet transaction][] to enable the recommended cold address settings:


{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-a-token/js/issue-a-token.js" from="// Configure issuer" before="// Configure hot" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-a-token/py/issue-a-token.py" from="# Configure issuer" before="# Configure hot" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/issue-a-token/java/IssueToken.java" from="// Configure issuer" before="// Configure hot" language="java" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Configure Issuer" steps=$frontmatter.steps %}

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
        <input type="text" class="form-control" value="example.com" pattern="([a-z0-9][a-z0-9\-]{0,62}[.])+[a-z]{2,6}" id="cold-domain-text" title="lower-case domain name of the account owner" />
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

{% loading-icon message="Sending transaction..." /%}

<div class="output-area"></div>

{% /interactive-block %}

### 4. Wait for Validation

Most transactions are accepted into the next ledger version after they're submitted, which means it may take 4-7 seconds for a transaction's outcome to be final. You should wait for your earlier transactions to be fully validated before proceeding to the later steps, to avoid unexpected failures from things executing out of order. For more information, see [Reliable Transaction Submission](../../../concepts/transactions/reliable-transaction-submission.md).

The code samples in this tutorial use helper functions to wait for validation when submitting a transaction:

- **JavaScript:** The `submit_and_verify()` function, as defined in the [submit-and-verify code sample](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/submit-and-verify).
- **Python:** The `submit_and_wait()` [method of the xrpl-py library](https://xrpl-py.readthedocs.io/en/stable/source/xrpl.transaction.html#xrpl.transaction.submit_and_wait).
- **Java:** The `submitAndWaitForValidation()` method in the [sample Java class](https://github.com/XRPLF/xrpl-dev-portal/blob/master/_code-samples/issue-a-token/java/IssueToken.java).

**Tip:** Technically, you can configure the hot address in parallel with configuring the issuer address. For simplicity, this tutorial waits for each transaction one at a time.

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait (Issuer Setup)"} /%}


### 5. Configure Hot Address Settings

The hot address does not strictly require any settings changes from the default, but the following are recommended as best practices:

| Setting                      | Recommended Value   | Summary                 |
|:-----------------------------|:--------------------|:------------------------|
| [Default Ripple][]           | Disabled            | Leave this setting **disabled.** (This is the default.) |
| [Authorized Trust Lines][]   | Enabled             | Enable this setting on the hot address—and never approve any trust lines to the hot address—to prevent accidentally issuing tokens from the wrong address. (Optional, but recommended.) |
| [Require Destination Tags][] | Enabled or Disabled | Enable if you process withdrawals of your token to outside systems. (For example, your token is a stablecoin.) |
| Disallow XRP                 | Enabled or Disabled | Enable if this address isn't meant to process XRP payments. |
| [Domain][]                   | (Your domain name)  | Set to a domain you own so can [verify ownership of the accounts](../../../references/xrp-ledger-toml.md#account-verification). This can help reduce confusion or impersonation attempts. |

The following code sample shows how to send an [AccountSet transaction][] to enable the recommended hot address settings:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-a-token/js/issue-a-token.js" from="// Configure hot address" before="// Create trust line" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-a-token/py/issue-a-token.py" from="# Configure hot address" before="# Create trust line" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/issue-a-token/java/IssueToken.java" from="// Configure hot address" before="// Create trust line" language="java" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Configure Hot Address" steps=$frontmatter.steps %}

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
        <input type="text" class="form-control" value="example.com" pattern="([a-z0-9][a-z0-9\-]{0,62}[.])+[a-z]{2,6}" id="hot-domain-text" title="lower-case domain name of the account owner" />
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

{% loading-icon message="Sending transaction..." /%}

<div class="output-area"></div>

{% /interactive-block %}

### 6. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait (Hot Address Setup)"} /%}


### 7. Create Trust Line from Hot to Cold Address

Before you can receive tokens, you need to create a [trust line](../../../concepts/tokens/fungible-tokens/index.md) to the token issuer. This trust line is specific to the [currency code](../../../references/protocol/data-types/currency-formats.md#currency-codes) of the token you want to issue, such as USD or FOO. You can choose any currency code you want; each issuer's tokens are treated as separate in the XRP Ledger protocol. However, users' balances of tokens with the same currency code can [ripple](../../../concepts/tokens/fungible-tokens/rippling.md) between different issuers if the users enable rippling settings.

The hot address needs a trust line like this before it can receive tokens from the issuer. Similarly, each user who wants to hold your token must also create a trust line[¹](#footnotes). Each trust line increases the [reserve requirement](../../../concepts/accounts/reserves.md) of the hot address, so you must hold enough spare XRP to pay for the increased requirement. Your reserve requirement goes back down if you remove the trust line.

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

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-a-token/js/issue-a-token.js" from="// Create trust line" before="// Send token" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-a-token/py/issue-a-token.py" from="# Create trust line" before="# Send token" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/issue-a-token/java/IssueToken.java" from="// Create trust line" before="// Send token" language="java" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Make Trust Line" steps=$frontmatter.steps %}

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
      <input type="text" id="currency-code-std" pattern="[A-Za-z0-9?!@#$%*\(\)\{\}\|\x26\x3c\x3e]{3}" value="FOO" class="form-control col-lg-8" title="3 character code (letters, numbers, and some symbols)" />
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

{% loading-icon message="Sending transaction..." /%}

<div class="output-area"></div>

{% /interactive-block %}

**Note:** If you use [Authorized Trust Lines][], there is an extra step after this one: the cold address must approve the trust line from the hot address. For details of how to do this, see [Authorizing Trust Lines](../../../concepts/tokens/fungible-tokens/authorized-trust-lines.md#authorizing-trust-lines).


### 8. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait (TrustSet)"} /%}


### 9. Send Token

Now you can create tokens by sending a [Payment transaction][] from the cold address to the hot address. This transaction should have the following attributes (dot notation indicates nested fields):

| Field | Value |
|---|---|
| `TransactionType` | `"Payment"` |
| `Account` | The cold address issuing the token. |
| `Amount` | An [token amount](../../../references/protocol/data-types/basic-data-types.md#specifying-currency-amounts) specifying how much of which token to create. |
| `Amount.currency` | The currency code of the token. |
| `Amount.value` | Decimal amount of the token to issue, as a string. |
| `Amount.issuer` | The cold address issuing the token. |
| `Destination` | The hot address (or other account receiving the token) |
| `Paths` | Omit this field when issuing tokens. |
| `SendMax` | Omit this field when issuing tokens. |
| `DestinationTag` | Any whole number from 0 to 2<sup>32</sup>-1. You must specify _something_ here if you enabled [Require Destination Tags][] on the hot address. |

You can use [auto-filled values](../../../references/protocol/transactions/common-fields.md#auto-fillable-fields) for all other required fields.

The following code sample shows how to send a [Payment transaction][] to issue 88 FOO from the cold address to the hot address:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-a-token/js/issue-a-token.js" from="// Send token" before="// Check balances" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-a-token/py/issue-a-token.py" from="# Send token" before="# Check balances" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/issue-a-token/java/IssueToken.java" from="// Send token" before="// Check balances" language="java" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Send Token" steps=$frontmatter.steps %}

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

{% loading-icon message="Sending transaction..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### 10. Wait for Validation

As before, wait for the previous transaction to be validated by consensus before continuing.

{% partial file="/docs/_snippets/interactive-tutorials/wait-step.md" variables={label: "Wait (Payment)"} /%}


### 11. Confirm Token Balances

You can check the balances of your token from the perspective of either the token issuer or the hot address. Tokens issued in the XRP Ledger always have balances that sum to 0: negative from the perspective of the issuer and positive from the perspective of the holder.

Use the [account_lines method][] to look up the balances from the perspective of the holder. This lists each trust line along with its limit, balance, and settings.

Use the [gateway_balances method][] to look up balances from the perspective of a token issuer. This provides a sum of all tokens issued by a given address.

**Tip:** Since the XRP Ledger is fully public, you can check the balances of any account at any time without needing any cryptographic keys.

The following code sample shows how to use both methods:

{% tabs %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/issue-a-token/js/issue-a-token.js" from="// Check balances" before="// End of" language="js" /%}
{% /tab %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/issue-a-token/py/issue-a-token.py" from="# Check balances" language="py" /%}
{% /tab %}

{% tab label="Java" %}
{% code-snippet file="/_code-samples/issue-a-token/java/IssueToken.java" from="// Check balances" before="// Helper" language="java" /%}
{% /tab %}

{% /tabs %}

{% interactive-block label="Confirm Balances" steps=$frontmatter.steps %}

<button id="confirm-balances-button" class="btn btn-primary previous-steps-required">Confirm Balances</button>

{% loading-icon message="Checking..." /%}

<div class="output-area"></div>

{% /interactive-block %}


### Next Steps

Now that you've created the token, you can explore how it fits into features of the XRP Ledger:

- Send tokens from the hot address to other users.
- Trade it in the decentralized exchange.
- Monitor for incoming payments of your token.
- Create an [xrp-ledger.toml file](../../../references/xrp-ledger-toml.md) and set up domain verification for your token's issuer.
- Learn about other [features of XRP Ledger tokens](../../../concepts/tokens/index.md).


## Footnotes

¹ Users can hold your token without explicitly creating a trust line if they buy your token in the [decentralized exchange](../../../concepts/tokens/decentralized-exchange/index.md). Buying a token in the exchange [automatically creates the necessary trust lines](../../../concepts/tokens/decentralized-exchange/offers.md#offers-and-trust). This is only possible if someone is selling your token in the decentralized exchange.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

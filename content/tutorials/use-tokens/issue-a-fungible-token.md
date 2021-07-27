---
html: issue-a-fungible-token.html
parent: use-tokens.html
blurb: Create your own token and issue it on the XRP Ledger Testnet.
embed_ripple_lib: true
filters:
  - interactive_steps
labels:
  - Tokens
---
# Issue a Fungible Token

Anyone can issue various types of tokens in the XRP Ledger, ranging from informal "IOUs" to fiat-backed stablecoins, purely digital fungible and semi-fungible tokens, and more. This tutorial demonstrates the technical steps of creating a token in the ledger. For more information on how XRP Ledger tokens work, see [Issued Currencies](issued-currencies.html); for more on the business decisions involved in issuing a stablecoin, see [Become an XRP Ledger Gateway](become-an-xrp-ledger-gateway.html).


## Prerequisites

- You need two funded XRP Ledger accounts, each with an address, secret key, and some XRP. For this tutorial, you can generate new test credentials as needed.
    - Each address needs enough XRP to satisfy the [reserve requirement](reserves.html) including the additional reserve for a trust line.
- You need a connection to the XRP Ledger network.

This page provides examples that use [ripple-lib for JavaScript](get-started-with-rippleapi-for-javascript.html). Since JavaScript works in the web browser, you can read along and use the interactive steps without any setup.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/issue-a-token.js"></script>


## Steps
{% set n = cycler(* range(1,99)) %}

### {{n.next()}}. Get Credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. You also need one or more recipients who are willing to hold the tokens you issue: unlike in some other blockchains, in the XRP Ledger you cannot force someone to hold a token they do not want.

The best practice is to use ["cold" and "hot" addresses](issuing-and-operational-addresses.html). The cold address is the **issuer** of the token. The hot address is like a regular user's address that you control. It receives tokens from the cold address, which you can then transfer to other users. A hot address is not strictly necessary, since you could send tokens directly to users from the cold address, but it is useful for this tutorial since you need _someone_ to accept the tokens you issue. In production, you should take extra care of the cold address's cryptographic keys (for example, keeping them offline) because it is much harder to replace a cold address than a hot address, if its cryptographic keys are compromised.



For purposes of this tutorial, you can get the keys for two addresses using the following interface.

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


When you're [building actual production-ready software](production-readiness.html), you'll instead use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html).

### {{n.next()}}. Connect to the Network

You must be connected to the network to submit transactions to it.

The following code uses a [ripple-lib for JavaScript](rippleapi-reference.html) instance to connect to a public XRP Ledger Testnet server:

```js
ripple = require('ripple-lib') // Node.js only. Use a <script> tag in browsers.

async function main() {
  api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
  await api.connect()

  // Code in the following examples continues here...
}

main()
```

**Note:** The code samples in this tutorial use JavaScript's [`async`/`await` pattern](https://javascript.info/async-await). Since `await` needs to be used from within an `async` function, the remaining code samples are written to continue inside the `main()` function started here. You can also use Promise methods `.then()` and `.catch()` instead of `async`/`await` if you prefer.

For this tutorial, you can connect directly from your browser by pressing the following button:

{% include '_snippets/interactive-tutorials/connect-step.md' %}


### {{n.next()}}. Configure Issuer Settings

First, configure the settings for your cold address (which will become the issuer of your token). Most settings can be reconfigured later, with the following exceptions: <!-- STYLE_OVERRIDE: will -->

- [Default Ripple][]: **This setting is required** so that users can send your token to each other. It's best to enable it _before_ setting up any trust lines or issuing any tokens.
- [Authorized Trust Lines][]: (Optional) This setting (also called "Require Auth") limits your tokens to being held _only_ by accounts you've explicitly approved. You cannot enable this setting if you already have any trust lines or offers for _any_ token.

[Default Ripple]: rippling.html
[Authorized Trust Lines]: authorized-trust-lines.html

Other settings you may want to, optionally, configure for your cold address (issuer):

| Setting                      | Recommended Value   | Summary                 |
|:-----------------------------|:--------------------|:------------------------|
| [Require Destination Tags][] | Enabled or Disabled | Enable if you process withdrawals of your token to outside systems. (For example, your token is a stablecoin.) |
| Disallow XRP                 | Enabled             | Enable if this address isn't meant to process XRP payments. |
| [Transfer Fee][]             | 0–1%                | Charge a percentage fee when users send your token to each other. |
| [Tick Size][]                | 5                   | Limit the number of decimal places in exchange rates for your token in the [decentralized exchange](decentralized-exchange.html). Reduces churn of almost-equivalent offers and speeds up price discovery. |
| [Domain][]                   | (Your domain name)  | Set to a domain you own so can [verify ownership of the accounts](xrp-ledger-toml.html#account-verification). This can help reduce confusion or impersonation attempts. |

[Require Destination Tags]: require-destination-tags.html
[Transfer Fee]: transfer-fees.html
[Tick Size]: tick-size.html

**Note:** Many issuing settings apply equally to all tokens issued by an address, regardless of the currency code. If you want to issue multiple types of tokens in the XRP Ledger with different settings, you should use a different address to issue each different token.

The following code sample shows how to send an [AccountSet transaction][] to enable the recommended cold address settings:

```
TODO: CODE SAMPLE
```

{{ start_step("Configure Issuer") }}
<form>
  <div class="form-group row">
  <label for="cold-default-ripple" class="col-form-label col-sm-3">Default Ripple</label>
    <div class="input-group col">
      <input type="checkbox" class="form-control form-check-input" value="" id="cold-default-ripple" disabled="disabled" checked/>
    </div>
  </div>
  <!--<div class="form-group row">
    <label for="cold-require-auth" class="col-form-label col-sm-3">Require Authorization</label>
    <div class="input-group col">
      <input type="checkbox" class="form-control form-check-input" value="" id="cold-require-auth" />
    </div>
  </div>-->
  <div class="form-group row">
    <label for="cold-require-dest" class="col-form-label col-sm-3">Require Destination Tags</label>
    <div class="input-group col">
      <input type="checkbox" class="form-control form-check-input" value="" id="cold-require-dest" />
    </div>
  </div>
  <div class="form-group row">
    <label for="cold-disallow-xrp" class="col-form-label col-sm-3">Disallow XRP</label>
    <div class="input-group col">
      <input type="checkbox" class="form-control form-check-input" value="" id="cold-disallow-xrp" checked />
    </div>
  </div>
  <div class="form-group row">
    <label for="cold-transfer-fee" class="col-form-label col-sm-3">Transfer Fee</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="cold-transfer-fee" value="0" step="0.01" min="0" max="100" />
      <div class="input-group-append">
        <div class="input-group-text">%</div>
      </div>
    </div>
  </div><!--/.form-inline-->
  <div class="form-group row">
    <label for="cold-tick-size" class="col-form-label col-sm-3">Tick Size</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="cold-tick-size" value="5" step="1" min="0" max="15" />
    </div>
  </div><!--/.form-inline-->
</form>
<button id="config-issuer-button" class="btn btn-primary">Send AccountSet</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Configure Hot Address Settings

The hot address does not strictly require any settings changes from the default, but the following are recommended as best practices:

| Setting                    | Recommended Value | Summary                     |
|:---------------------------|:------------------|:----------------------------|
| [Default Ripple][]         | Disabled          | Leave this setting **disabled.** (This is the default.) |
| [Authorized Trust Lines][] | Enabled           | Users sometimes make trust lines to the hot address by mistake. This setting makes this trust lines unusable, which helps to prevent accidentally issuing tokens from the wrong address. |
| Disallow XRP               | Enabled           | Enable if this address isn't meant to process XRP payments. |

The following code sample shows how to send an [AccountSet transaction][] to enable the recommended hot address settings:

```
TODO: code
```


{{ start_step("Configure Hot Address") }}
<form>
  <div class="form-inline">
    <div class="input-group">
      <label for="hot-disallow-xrp" class="form-check-label mr-3">Disallow XRP</label>
      <input type="checkbox" class="form-control form-check-input" value="" id="hot-disallow-xrp" checked="checked" />
    </div>
  </div>
</form>
<button id="config-hot-address-button" class="btn btn-primary">Send AccountSet</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Create Trust Line from Hot to Cold Address

Before you can receive tokens, you need to create a [trust line](trust-lines-and-issuing.html) to the token issuer. This trust line is specific to the [currency code](currency-formats.html#currency-codes) of the token you want to issue, such as USD or FOO. You can choose any currency code you want; each issuer's tokens are treated as separate in the XRP Ledger protocol. However, users' balances of tokens with the same currency code can [ripple](rippling.html) between different issuers if the users enable rippling settings.

The hot address needs a trust line like this before it can receive tokens from the issuer. Similarly, each user who wants to hold your token must also create a trust line[¹](#footnotes).

**Tip:** A trust line has a "limit" on how much the recipient is willing to hold; others cannot send you more tokens than your specified limit. For community credit systems, you may want to configure limits per individual based on how much you trust that person. For other types and uses of tokens, it is normally OK to set the limit to a very large number.

The following code sample shows how to send a [TrustSet transaction][] from the hot address, trusting the issuing address for a limit of 1 billion FOO:

```
TODO: code
```

{{ start_step("Make Trust Line") }}
<form>
  <h4>Currency code:</h4>
  <div class="container">
    <div class="input-group row">
      <input type="radio" id="use-std-code" name="currency-code-type" class="mr-2" checked="checked" />
      <label for="use-std-code" class="input-group-text col-lg-3">Standard:</label>
      <input type="text" id="currency-code-std" pattern="[A-Za-z0-9?!@#$%*(){}|\x26\x3c\x3e]{3}" value="FOO" class="form-control col-lg-8" title="3 character code (letters, numbers, and some symbols)" />
    </div>

    <div class="input-group row">
      <input type="radio" id="use-hex-code" name="currency-code-type" class="mr-2" />
      <label for="use-hex-code" class="input-group-text col-lg-3">Non-standard:</label>
      <input type="text" id="currency-code-hex" pattern="[0-9A-F]{40}" value="015841551A748AD2C1F76FF6ECB0CCCD00000000" title="40 hexadecimal characters" class="form-control col-lg-8" />
    </div>

    <div class="input-group row mt-2">
      <label for="trust-limit" class="input-group-text col-lg-3">Limit:</label>
      <input type="number" id="trust-limit" min="0" value="1000000000" title="Maximum amount the hot address can hold" class="form-control col-lg-8" />
    </div>
  </div>
</form>
<button id="make-trust-line-button" class="btn btn-primary">Send TrustSet</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}

**Note**: If you use [Authorized Trust Lines][], there is an extra step after this one: the cold address must approve the trust line from the hot address. For details of how to do this, see [Authorizing Trust Lines](authorized-trust-lines.html#authorizing-trust-lines).


### {{n.next()}}. Send Token

Now you can create tokens by sending a [Payment transaction][] from the cold address to the hot address. This transaction should have the following attributes (dot notation indicates nested fields):

| Field | Value |
|---|---|
| `TransactionType` | `"Payment"` |
| `Account` | The cold address issuing the token. |
| `Amount` | An [issued currency amount](basic-data-types.html#specifying-currency-amounts) specifying how much of which token to create. |
| `Amount.currency` | The currency code of the token. |
| `Amount.value` | Decimal amount of the token to issue, as a string. |
| `Amount.issuer` | The cold address issuing the token. |
| `Destination` | The hot address (or other account receiving the token) |
| `Paths` | Omit this field when issuing tokens. |
| `SendMax` | Omit this field when issuing tokens. |

You can use [auto-filled values](transaction-common-fields.html#auto-fillable-fields) for all other required fields.

The following code sample shows how to send a [Payment transaction][] to issue 88 FOO from the cold address to the hot address:

```
TODO: code
```

{{ start_step("Send Token") }}
<button id="send-token-button" class="btn btn-primary">Send Token</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending transaction...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Confirm Token Balances

You can check the balances of your token from the perspective of either the token issuer or the hot wallet. Tokens issued in the XRP Ledger always have balances that sum to 0: negative from the perspective of the issuer and positive from the perspective of the holder.

Use the [account_lines method][] to look up the balances from the perspective of the holder. This lists each trust line along with its limit, balance, and settings.

Use the [gateway_balances method][] to look up balances from the perspective of a token issuer. This provides a sum of all tokens issued by a given address.

**Tip:** Since the XRP Ledger is fully public, you can check the balances of any account at any time without needing any cryptographic keys.

The following code sample shows how to use both methods:

```
TODO: code
```

{{ start_step("Confirm Balances") }}
<button id="check-balances-button" class="btn btn-primary">Confirm Balances</button>
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

¹ Users can hold your token without explicitly creating a trust line if they purchase your token in the [decentralized exchange](decentralized-exchange.html). Buying a token in the exchange [automatically creates the necessary trust lines](offers.html#offers-and-trust). This is only possible if someone is selling your token in the decentralized exchange.


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

---
parent: use-tokens.html
blurb: Set up an Automated Market Maker (AMM)
embed_xrpl_js: true
status: not_enabled
filters:
  - interactive_steps
labels:
  - Decentralized Exchange
  - Tokens
  - AMM
---
# Create an Automated Market Maker

_(Requires the [AMM amendment][] :not_enabled:)_

An [Automated Market Maker (AMM)](automated-market-makers.html) can be an efficient way to facilitate exchanges between two assets while earning its liquidity providers passive income. This tutorial shows how to create an AMM for a given asset pair.

<!-- Source for this specific tutorial's interactive bits: -->
<script type="application/javascript" src="assets/js/tutorials/create-amm.js"></script>

## Prerequisites

- You must have an XRP Ledger address and some XRP. For development and testing purposes, you can get these from a [Faucet](xrp-testnet-faucet.html).
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/) **version 2.11.0 or later**. See [Get Started Using JavaScript](get-started-using-javascript.html) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.
- You should have a basic understanding of how [tokens](tokens.html) work in the XRP Ledger.
- You may want to read about [Automated Market Makers in the XRP Ledger](automated-market-makers.html) first.


## Example Code

Complete sample code for all of the steps of these tutorials is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Create an AMM](https://github.com/XRPLF/xrpl-dev-portal/tree/master/content/_code-samples/create-amm/) in the source repository for this website.


## Steps
{% set n = cycler(* range(1,99)) %}
{% set use_network = "Devnet" %}

### {{n.next()}}. Connect to the network

You must be connected to the network to query it and submit transactions. The following code shows how to connect to a public {{use_network}} server using a supported [client library](client-libraries.html):

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/connect.js", language="js") }}

<!-- MULTICODE_BLOCK_END -->

For this tutorial, click the following button to connect:

{% include '_snippets/interactive-tutorials/connect-step.md' %}

### {{n.next()}}. Get credentials

To transact on the XRP Ledger, you need an address, a secret key, and some XRP. For development and testing purposes, you can get these on the [{{use_network}}](parallel-networks.html) using the following interface:

{% include '_snippets/interactive-tutorials/generate-step.md' %}

When you're [building production-ready software](production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](set-up-secure-signing.html). The following code shows how to get a `Wallet` instance using either the faucet or a seed provided by environment variable:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Get credentials", end_before="// Acquire tokens") }}

<!-- MULTICODE_BLOCK_END -->


### {{n.next()}}. Select and acquire assets

As the creator of an AMM, you are also the first liquidity provider and you have to supply it with a starting pool of assets. Other users of the XRP Ledger can also become liquidity providers by supplying assets after the AMM exists. It's crucial to choose assets carefully because, as a liquidity provider for an AMM, you are supplying some amounts of both for users to swap between. If one of the AMM's assets becomes worthless, other users can use the AMM to trade for the other asset, leaving the AMM (and thus, its liquidity providers including you) holding only the worthless one. Technically, the AMM always holds some positive amount of both assets, but the amounts can be very small.

You can choose any pair of fungible assets in the XRP Ledger, including XRP or tokens, as long as they meet the [restrictions on AMM assets](automated-market-makers.html#restrictions-on-assets).

For each of the two assets, you need to know its currency code and issuer; as an exception, XRP has no issuer. For each of the assets, you must hold a balance of the asset (or _be_ the issuer). The following sample code acquires two assets, "TST" (which it buys using XRP) and "FOO" (which it receives from the issuer).

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Acquire tokens", end_before="// Check if AMM already exists") }}

<!-- MULTICODE_BLOCK_END -->

This tutorial includes some example code to issue FOO tokens from a second test address. This is not realistic for a production scenario, because tokens do not inherently have value, but it makes it possible to demonstrate creating a new AMM for a unique currency pair. In production, you would acquire a second token in some other way, such as making an off-ledger deposit with the [stablecoin issuer](stablecoin-issuer.html), or buying it in the [decentralized exchange](decentralized-exchange.html).

The helper function for issuing follows an abbreviated version of the steps in the [Issue a Fungible Token](issue-a-fungible-token.html) tutorial:

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="/* Issue tokens") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Acquire tokens") }}
<button id="buy-tst" class="btn btn-primary previous-steps-required">Buy TST</button>
<button id="get-foo" class="btn btn-primary previous-steps-required">Get FOO</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Working...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Check if the AMM exists

Since there can only be one AMM for a specific pair of assets, it's best to check first before trying to create one. Use the [amm_info method][] to check whether the AMM already exists. For the request, you specify the two assets. The response should be an `actNotFound` error if the AMM does not exist.

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Check if AMM already exists", end_before="// Look up AMM transaction cost") }}

<!-- MULTICODE_BLOCK_END -->

If the AMM does already exist, you should double-check that you specified the right pair of assets. If someone else has already created this AMM, you can deposit to it instead. <!-- TODO: link to a tutorial about depositing to and withdrawing from an AMM when one exists -->

{{ start_step("Check for AMM") }}
<button id="check-for-amm" class="btn btn-primary previous-steps-required">Check AMM</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Look up the AMMCreate transaction cost

Creating an AMM has a special [transaction cost][] to prevent spam: since it creates objects in the ledger that no one owns, you must burn at least one [owner reserve increment](reserves.html) of XRP to send the AMMCreate transaction. The exact value can change due to [fee voting](https://xrpl.org/fee-voting.html), so you should look up the current incremental reserve value using the [server_state method][].

It is also a good practice to display this value and give a human operator a chance to stop before you send the transaction. Burning an owner reserve is typically a much higher cost than sending a normal transaction, so you don't want it to be a surprise. (Currently, on both Mainnet and Devnet, the cost of sending a typical transaction is 0.000010 XRP but the cost of AMMCreate is 2 XRP.)

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Look up AMM transaction cost", end_before="// Create AMM") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Look up AMMCreate cost") }}
<button id="look-up-ammcreate-cost" class="btn btn-primary previous-steps-required">Check cost</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


### {{n.next()}}. Send AMMCreate transaction

Send an [AMMCreate transaction][] to create the AMM. Important aspects of this transaction include:

| Field | Value | Description |
|-------|--------|-------------|
| `Asset` | [Currency Amount][] | Starting amount of one asset to deposit in the AMM. |
| `Asset2` | [Currency Amount][] | Starting amount of the other asset to deposit in the AMM. |
| `TradingFee` | Number | The fee to charge when trading against this AMM instance. The maximum value is `1000`, meaning a 1% fee; the minimum value is `0`. If you set this too high, it may be too expensive for users to trade against the AMM; but the lower you set it, the more you expose yourself to currency risk from the AMM's assets changing in value relative to one another. |
| `Fee` | String - XRP Amount | The transaction cost you looked up in a previous step. Client libraries may require that you add a special exception or reconfigure a setting to specify a `Fee` value this high. |

For the two starting assets, it does not matter which is `Asset` and which is `Asset2`, but you should specify amounts that are about equal in total value, because otherwise other users can profit at your expense by trading against the AMM.

**Tip:** Use `fail_hard` when submitting this transaction, so you don't have to pay the high transaction cost if the transaction initially fails. (It's still _possible_ that the transaction could tentatively succeed, and then fail and still burn the transaction cost, but this protects you from burning XRP on many of types of failures.)

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Create AMM", end_before="// Confirm that AMM exists") }}

<!-- MULTICODE_BLOCK_END -->

{{ start_step("Create AMM") }}
<form>
  <div class="form-group row">
    <label for="trading-fee" class="col-form-label col-sm-3">Trading Fee</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="trading-fee" value="0.5" step="0.001" min="0" max="1" />
      <div class="input-group-append">
        <div class="input-group-text">%</div>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label for="asset-amount" class="col-form-label col-sm-3">Amount</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="asset-amount" value="15" step="any" min="0" />
      <div class="input-group-append">
        <div class="input-group-text">TST.rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd</div>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label for="asset2-amount" class="col-form-label col-sm-3">Amount2</label>
    <div class="input-group col">
      <input type="number" class="form-control" id="asset2-amount" value="100" step="any" min="0" />
      <div class="input-group-append">
        <div class="input-group-text">FOO.<span class="foo-issuer">(issuer)</span></div>
      </div>
    </div>
  </div>
</form>
<button id="create-amm" class="btn btn-primary previous-steps-required">Create AMM</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

### {{n.next()}}. Check AMM info

If the AMMCreate transaction succeeded, it creates the AMM and related objects in the ledger. You _could_ check the metadata of the AMMCreate transaction, but it is often easier to call the [amm_info method][] again to get the status of the newly-created AMM.

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Confirm that AMM exists", end_before="// Check token balances") }}

<!-- MULTICODE_BLOCK_END -->

In the result, the `amm` object's `lp_token` field is particularly useful because it includes the issuer and currency code of the AMM's LP Tokens, which you need to know for many other AMM-related transactions. LP Tokens always have a hex currency code starting with `03`, and the rest of the code is derived from the issuers and currency codes of the tokens in the AMM's pool. The issuer of the LP Tokens is the AMM address, which is randomly chosen when you create an AMM.

Initially, the AMM's total outstanding LP Tokens, reported in the `lp_token` field of the `amm_info` response, match the tokens you hold as its first liquidity provider. However, after other accounts deposit liquidity to the same AMM, the amount shown in `amm_info` updates to reflect the total issued to all liquidity providers. Since others can deposit at any time, even potentially in the same ledger version where the AMM was created, you shouldn't assume that this amount represents your personal LP Tokens balance.

{{ start_step("Check AMM info") }}
<button id="check-amm-info" class="btn btn-primary previous-steps-required">Check AMM</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}

###  {{n.next()}}. Check trust lines

You can also use the [account_lines method][] to get an updated view of your token balances. Your balances should be decreased by the amounts you deposited, but you now have a balance of LP Tokens that you received from the AMM.

<!-- MULTICODE_BLOCK_START -->

_JavaScript_

{{ include_code("_code-samples/create-amm/js/create-amm.js", language="js", start_with="// Check token balances", end_before="// Disconnect") }}

<!-- MULTICODE_BLOCK_END -->

The `account_lines` response shows only the tokens held by the account you looked up (probably yours). If you have a lot of tokens, you may want to specify the AMM address as the `peer` in the request so you don't have to [paginate](markers-and-pagination.html) over multiple requests to find the AMM's LP Tokens. In this tutorial, your account probably only holds the three different tokens, so you can see all three in the same response.

**Tip:** If one of the assets in the AMM's pool is XRP, you need to call the [account_info method][] on your account to see the difference in your balance (the `Balance` field of the account object).

{{ start_step("Check trust lines") }}
<button id="check-trust-lines" class="btn btn-primary previous-steps-required">Check trust lines</button>
<div class="loader collapse"><img class="throbber" src="assets/img/xrp-loader-96.png">Sending...</div>
<div class="output-area"></div>
{{ end_step() }}


## Next Steps

At this point the AMM is up and running, and [trades in the DEX](trade-in-the-decentralized-exchange.html) automatically use this AMM in combination with Offers to achieve the best exchange rate possible between the two assets in the AMM's pool. If the flow of funds between the two assets is relatively balanced and there are no major shifts in the value of one asset compared to the other, this can become a source of passive income for you and anyone else who deposits liquidity into the AMM's pool.

When you want to withdraw liquidity from the AMM, you can use [AMMDeposit][] to cash in your LP Tokens to receive a share of the AMM's assets. You can also use LP Tokens like any other tokens in the XRP Ledger, which means you can trade them, use them in payments, or even deposit them in another AMM.

However, you should keep an eye on market conditions, and use tools like [AMMBid][] and [AMMVote][] to insulate yourself from losses due to changes in the relative value of the two assets in the pool.

<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}

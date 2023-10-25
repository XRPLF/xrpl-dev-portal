{% if use_network is undefined or use_network == "Testnet" %}
  {% set use_network = "Testnet" %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% elif use_network == "Devnet" %}
  {% set faucet_url = "https://faucet.devnet.rippletest.net/accounts" %}
{# No faucet for Mainnet! #}
{% endif %}

{{ start_step("Generate") }}
<button id="generate-creds-button" class="btn btn-primary" data-fauceturl="{{faucet_url}}">Get {{use_network}} credentials</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">Generating Keys...</div>
<div class="output-area"></div>
{{ end_step() }}

**Caution:** Ripple provides the [Testnet and Devnet](parallel-networks.html) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, **do not** use the same addresses on Testnet/Devnet and Mainnet.

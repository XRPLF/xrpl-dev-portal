<!-- {% if use_network is undefined or use_network == "Testnet" %}
  {% set use_network = "Testnet" %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% elif use_network == "Devnet" %}
  {% set faucet_url = "https://faucet.devnet.rippletest.net/accounts" %}
{# No faucet for Mainnet! #}
{% endif %} -->

{% start-step stepIdx=0 steps=$frontmatter.steps %}

<button id="generate-creds-button" class="btn btn-primary" data-fauceturl="{% $env.PUBLIC_FAUCET_URL %}">Get {% $env.PUBLIC_USE_NETWORK %} credentials</button>
<div class="loader collapse"><img class="throbber" src="/img/xrp-loader-96.png">Generating Keys...</div>
<div class="output-area"></div>

{% /start-step %}

**Caution:** Ripple provides the [Testnet and Devnet](parallel-networks.html) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, **do not** use the same addresses on Testnet/Devnet and Mainnet.

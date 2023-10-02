<!-- {% if use_network is undefined or use_network == "Testnet" %}
  {% set ws_url = "wss://s.altnet.rippletest.net:51233" %}
  {% set explorer_url = "https://testnet.xrpl.org" %}
  {% set use_network = "Testnet" %}
{% elif use_network == "Devnet" %}
  {% set ws_url = "wss://s.devnet.rippletest.net:51233" %}
  {% set explorer_url = "https://devnet.xrpl.org" %}
{% elif use_network == "Mainnet" %}
  {% set ws_url = "wss://xrplcluster.com" %}
  {% set explorer_url = "https://livenet.xrpl.org" %}
{% endif %} -->

{% start-step stepIdx=1 steps=$frontmatter.steps %}

<button id="connect-button" class="btn btn-primary" data-wsurl="{% $env.PUBLIC_WS_URL %}" data-explorer="{% $env.PUBLIC_EXPLORER_URL %}">Connect to {% $env.PUBLIC_USE_NETWORK %}</button>
<div>
  <strong>Connection status: </strong>
  <span id="connection-status">Not connected</span>
  <div class="loader collapse" id="loader-connect"><img class="throbber" src="/img/xrp-loader-96.png"></div>
</div>

{% /start-step %}

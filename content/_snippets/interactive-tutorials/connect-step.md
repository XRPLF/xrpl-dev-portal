{% if use_network is undefined or use_network == "Testnet" %}
  {% set ws_url = "wss://s.altnet.rippletest.net:51233" %}
  {% set explorer_url = "https://testnet.xrpl.org" %}
  {% set use_network = "Testnet" %}
{% elif use_network == "Devnet" %}
  {% set ws_url = "wss://s.devnet.rippletest.net:51233" %}
  {% set explorer_url = "https://devnet.xrpl.org" %}
{% elif use_network == "Mainnet" %}
  {% set ws_url = "wss://xrplcluster.com" %}
  {% set explorer_url = "https://livenet.xrpl.org" %}
{% endif %}

{{ start_step("Connect") }}
<button id="connect-button" class="btn btn-primary" data-wsurl="{{ws_url}}" data-explorer="{{explorer_url}}">Connect to {{use_network}}</button>
<div>
  <strong>Connection status:</strong>
  <span id="connection-status">Not connected</span>
  <div class="loader collapse" id="loader-connect"><img class="throbber" src="assets/img/xrp-loader-96.png"></div>
</div>
{{ end_step() }}

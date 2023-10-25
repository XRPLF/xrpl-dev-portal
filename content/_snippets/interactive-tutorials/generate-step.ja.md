{% if use_network is undefined or use_network == "Testnet" %}
  {% set use_network = "Testnet" %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% elif use_network == "Devnet" %}
  {% set faucet_url = "https://faucet.devnet.rippletest.net/accounts" %}
{# No faucet for Mainnet! #}
{% endif %}

{{ start_step("Generate") }}
<button id="generate-creds-button" class="btn btn-primary" data-fauceturl="{{faucet_url}}">{{use_network}}の暗号鍵を作成する</button>
<div class="loader collapse"><img class="throbber" src="static/img/xrp-loader-96.png">暗号鍵を作成しています…</div>
<div class="output-area"></div>
{{ end_step() }}

**注意:** Rippleは[TestnetとDevnet](parallel-networks.html)をテストの目的でのみ運用しており、その状態とすべての残高を定期的にリセットしています。予防措置として、Testnet、DevnetとMainnetで同じアドレスを使用**しない**ことをお勧めします。

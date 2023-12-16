{% if use_network is undefined or use_network == "Testnet" %}
  {% set explorer_url = "https://testnet.xrpl.org" %}
{% elif use_network == "Devnet" %}
  {% set explorer_url = "https://devnet.xrpl.org" %}
{% elif use_network == "Mainnet" %}
  {% set explorer_url = "https://livenet.xrpl.org" %}
{% endif %}

<table class="wait-step" data-explorerurl="{{explorer_url}}">
  <tr>
    <th>トランザクションのID:</th>
    <td class="waiting-for-tx">(無）</td>
  <tr>
    <th>最新の検証レジャーインデックス：</th>
    <td class="validated-ledger-version">接続されていません</td>
  </tr>
  <tr>
    <th>送信時のレジャーインデックス：</th>
    <td class="earliest-ledger-version">（まだ送信されません）</td>
  </tr>
  <tr>
    <th>トランザクションの<code>LastLedgerSequence</code>:</th>
    <td class="lastledgersequence">(準備されません）</td>
  </tr>
  <tr class="tx-validation-status">
  </tr>
</table>

{% interactive-block label=default($label, "Wait") steps=$frontmatter.steps %}

<table class="wait-step" data-explorerurl="https://testnet.xrpl.org">
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

{% /interactive-block %}

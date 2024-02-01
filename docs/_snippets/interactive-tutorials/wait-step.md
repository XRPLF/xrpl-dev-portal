{% interactive-block label=default($label, "Wait") steps=$frontmatter.steps %}

<table class="wait-step" data-explorerurl="https://testnet.xrpl.org"><tbody>
  <tr>
    <th>Transaction ID:</th>
    <td class="waiting-for-tx">(None)</td>
  <tr>
    <th>Latest Validated Ledger Index:</th>
    <td class="validated-ledger-version">(Not connected)</td>
  </tr>
  <tr>
    <th>Ledger Index at Time of Submission:</th>
    <td class="earliest-ledger-version">(Not submitted)</td>
  </tr>
  <tr>
    <th>Transaction <code>LastLedgerSequence</code>:</th>
    <td class="lastledgersequence">(Not prepared)</td>
  </tr>
  <tr class="tx-validation-status">
  </tr>
</tbody></table>

{% /interactive-block %}

<!-- {% if use_network is undefined or use_network == "Testnet" %}
  {% set explorer_url = "https://testnet.xrpl.org" %}
{% elif use_network == "Devnet" %}
  {% set explorer_url = "https://devnet.xrpl.org" %}
{% elif use_network == "Mainnet" %}
  {% set explorer_url = "https://livenet.xrpl.org" %}
{% endif %} -->

{% start-step stepIdx=3 steps=$frontmatter.steps %}

<table class="wait-step" data-explorerurl="{% $env.PUBLIC_EXPLORER_URL %}">
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
</table>

{% /start-step %}

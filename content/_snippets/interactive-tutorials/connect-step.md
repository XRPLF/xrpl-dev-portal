<!-- Interactive tutorials are hard-coded to Testnet for now due to Redocly 
     limitations. They'll be replaced with new-style tutorials next anyway. -->

{% interactive-block label=default($label, "Connect") steps=$frontmatter.steps %}

<button id="connect-button" class="btn btn-primary" data-wsurl="wss://s.altnet.rippletest.net:51233" data-explorer="https://testnet.xrpl.org">Connect to Testnet</button>
<div>
  <strong>Connection status: </strong>
  <span id="connection-status">Not connected</span>

  {% loading-icon /%}

</div>

{% /interactive-block %}

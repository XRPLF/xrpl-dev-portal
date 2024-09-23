<!-- Interactive tutorials are hard-coded to Testnet for now due to Redocly 
     limitations. They'll be replaced with new-style tutorials next anyway.
     Localized step names don't currently work due to problems with unicode
     in regexes. -->

{% interactive-block label=default($label, "Connect") steps=$frontmatter.steps %}

<button id="connect-button" class="btn btn-primary" data-wsurl="wss://s.altnet.rippletest.net:51233" data-explorer="https://testnet.xrpl.org">Testnetに接続する</button>
<div>
  <strong>接続ステータス：</strong>
  <span id="connection-status">接続されていません</span>

  {% loading-icon /%}

</div>

{% /interactive-block %}

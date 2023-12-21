{% interactive-block label=default($label, "Generate") steps=$frontmatter.steps %}

<button id="generate-creds-button" class="btn btn-primary" data-fauceturl="https://faucet.altnet.rippletest.net/accounts">Testnetの暗号鍵を作成する</button>
{% loading-icon message="暗号鍵を作成しています…" /%}
<div class="output-area"></div>

{% /interactive-block %}

**注意:** Rippleは[TestnetとDevnet](../../concepts/networks-and-servers/parallel-networks.md)をテストの目的でのみ運用しており、その状態とすべての残高を定期的にリセットしています。予防措置として、Testnet、DevnetとMainnetで同じアドレスを使用**しない**ことをお勧めします。

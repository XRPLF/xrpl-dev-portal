{% interactive-block label=default($label, "Generate") steps=$frontmatter.steps %}

<button id="generate-creds-button" class="btn btn-primary" data-fauceturl="https://faucet.altnet.rippletest.net/accounts">Get Testnet credentials</button>
{% loading-icon message="Generating Keys..." /%}
<div class="output-area"></div>

{% /interactive-block %}

**Caution:** Ripple provides the [Testnet and Devnet](../../concepts/networks-and-servers/parallel-networks.md) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, **do not** use the same addresses on Testnet/Devnet and Mainnet.

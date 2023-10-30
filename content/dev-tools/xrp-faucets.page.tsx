import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { useState } from 'react';

function onFaucetRadioClick() {

}

export default function XRPFaucets() {
  const currentpage = { prefix: "" } // TODO: Figure out what currentpage should actually be (seems to be Dactyl related) - Jackson

  const faucets = [
    {
      "id": "faucet-select-testnet",
      "ws_url": "wss://s.altnet.rippletest.net:51233/",
      "jsonrpc_url": "https://s.altnet.rippletest.net:51234/",
      "shortname": "Testnet",
      "faucet": "https://faucet.altnet.rippletest.net/accounts",
      "desc": "Mainnet-like network for testing applications."
    },
    {
      "id": "faucet-select-devnet",
      "ws_url": "wss://s.devnet.rippletest.net:51233/",
      "jsonrpc_url": "https://s.devnet.rippletest.net:51234/",
      "shortname": "Devnet",
      "faucet": "https://faucet.devnet.rippletest.net/accounts",
      "desc": "Preview of upcoming amendments."
    },
    {
      "id": "faucet-select-ammdevnet",
      "ws_url": "wss://amm.devnet.rippletest.net:51233/",
      "jsonrpc_url": "https://amm.devnet.rippletest.net:51234/",
      "shortname": "AMM-Devnet",
      "faucet": "https://ammfaucet.devnet.rippletest.net/accounts",
      "desc": "XLS-30d Automated Market Makers preview network."
    }
  ]

  const [selectedFaucet, setSelectedFaucet] = useState(faucets[0])

  const { translate } = useTranslate();

  return (
    <div className="">
      <section className="container-fluid pt-3 p-md-3">
        <h1>XRP Faucets</h1>
        <div className="content">
            <p>These <a href="parallel-networks.html">parallel XRP Ledger test networks</a> provide platforms for testing changes to the XRP Ledger and software built on it, without using real funds.</p>
            <p>These funds are intended for <strong>testing</strong> only. Test networks' ledger history and balances are reset as necessary. Devnets may be reset without warning.</p>
            <p>All balances and XRP on these networks are separate from Mainnet. As a precaution, do not use the Testnet or Devnet credentials on the Mainnet.</p>
            <h3>Choose Network:</h3>
            { faucets.map((net, index) => (
            <div className="form-check">
                <input onClick={() => setSelectedFaucet(net)} className="form-check-input" type="radio" name="faucet-selector" id={net.id} defaultValue={net.faucet} data-jsonrpcurl={net.jsonrpc_url} data-wsurl={net.ws_url} data-shortname={net.shortname} checked={selectedFaucet.shortname == net.shortname} />
                <label className="form-check-label" htmlFor={net.id}><strong>{net.shortname}</strong>: {net.desc}</label>
            </div>
            )) }
            <p className="mb-3"><strong>Hooks Testnet</strong>: <a href="https://hooks-testnet-v3.xrpl-labs.com/" className="external-link">See the Hooks Faucet</a></p>
            <div className="btn-toolbar" role="toolbar" aria-label="Button">
                <button id="generate-creds-button" className="btn btn-primary mr-2 mb-2">Generate {selectedFaucet.shortname} credentials</button>
            </div>
            {/* Displays after account is funded */}
            <div id="your-credentials" />
            <div id="loader" style={{display: 'none'}}><img alt="(loading)" className="throbber" src={currentpage.prefix + "static/img/xrp-loader-96.png"} /> Generating Keys...</div>
            <div id="address" />
            <div id="secret" />
            <div id="balance" />
            <div id="sequence"> <div id="loader" style={{display: 'none'}}><img alt="(loading)" className="throbber" src={currentpage.prefix + "static/img/xrp-loader-96.png"} /> Waiting...</div></div>
        </div>
      </section>
    </div>
  )
}

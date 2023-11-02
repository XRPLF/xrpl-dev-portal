import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { useState } from 'react';

import { Client, Wallet } from 'xrpl'; // - TODO: Uncomment when xrpl.js is working

const { translate } = useTranslate();

// TODO - Use `translate` on all text - Jackson
interface FaucetInfo {
  id: string,
  wsUrl: string,
  jsonRpcUrl: string,
  shortName: string,
  desc: string,
}

async function waitForSequence(client, address) {
  let response;
  while (true) {
    try {
      response = await client.request({
        command: "account_info",
        account: address,
        ledger_index: "validated"
      })
      break
    } catch(e) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log(response)

  return { sequence: response.result.account_data.Sequence, balance: response.result.account_data.Balance}
}

function FaucetEndpoints({ faucet, key } : { faucet: FaucetInfo, key: string}) {
  return (<div key={key}>
    <h4>{faucet.shortName} Servers</h4>
    <pre>
      <code>// WebSocket
        {faucet.wsUrl}

        // JSON-RPC
        {faucet.jsonRpcUrl}
      </code>
    </pre>
  </div>)
}

function FaucetSidebar({ faucets }: { faucets: FaucetInfo[]}) {
  return (<aside className="right-sidebar col-lg-3 order-lg-4" role="complementary">
    {faucets.map(
      (faucet) => <FaucetEndpoints faucet={faucet} key={faucet.shortName + " Endpoints"}/>
    )}
  </aside>)
}

export default function XRPFaucets() {

  const faucets: FaucetInfo[] = [
    {
      id: "faucet-select-testnet",
      wsUrl: "wss://s.altnet.rippletest.net:51233/",
      jsonRpcUrl: "https://s.altnet.rippletest.net:51234/",
      shortName: "Testnet",
      desc: "Mainnet-like network for testing applications."
    },
    {
      id: "faucet-select-devnet",
      wsUrl: "wss://s.devnet.rippletest.net:51233/",
      jsonRpcUrl: "https://s.devnet.rippletest.net:51234/",
      shortName: "Devnet",
      desc: "Preview of upcoming amendments."
    },
    {
      id: "faucet-select-ammdevnet",
      wsUrl: "wss://amm.devnet.rippletest.net:51233/",
      jsonRpcUrl: "https://amm.devnet.rippletest.net:51234/",
      shortName: "AMM-Devnet",
      desc: "XLS-30d Automated Market Makers preview network."
    }
  ]

  const [selectedFaucet, setSelectedFaucet] = useState(faucets[0])

  return (
    <div>
      <FaucetSidebar faucets={faucets}/>
      <section className="container-fluid pt-3 p-md-3">
        <h1>{translate("XRP Faucets")}</h1>
        <div className="content">
            <p>{translate("These ")}<a href="parallel-networks.html">{translate("parallel XRP Ledger test networks")}</a> {translate("provide platforms for testing changes to the XRP Ledger and software built on it, without using real funds.")}</p>
            <p>{translate("These funds are intended for")} <strong>{translate("testing")}</strong> {translate("only. Test networks' ledger history and balances are reset as necessary. Devnets may be reset without warning.")}</p>
            <p>{translate("All balances and XRP on these networks are separate from Mainnet. As a precaution, do not use the Testnet or Devnet credentials on the Mainnet.")}</p>
            <h3>{translate("Choose Network:")}</h3>
            { faucets.map((net) => (
            <div className="form-check" key={"network-" + net.shortName}>
                <input onChange={() => setSelectedFaucet(net)} className="form-check-input" type="radio" name="faucet-selector" id={net.id} data-jsonrpcurl={net.jsonRpcUrl} data-wsurl={net.wsUrl} data-shortName={net.shortName} checked={selectedFaucet.shortName == net.shortName} />
                <label className="form-check-label" htmlFor={net.id}><strong>{translate(net.shortName)}</strong>: {translate(net.desc)}</label>
            </div>
            )) }
            <p className="mb-3"><b>{translate("Hooks Testnet")}</b>: <a href="https://hooks-testnet-v3.xrpl-labs.com/" className="external-link">{translate("See the Hooks Faucet")}</a></p>
            <TestCredentials selectedFaucet={selectedFaucet}/>
        </div>
      </section>
    </div>
  )
}

async function generateFaucetCredentials(selectedFaucet, setGeneratedCredentialsFaucet, setAddress, setSecret, setBalance, setSequence) {
  // Clear existing credentials
  setGeneratedCredentialsFaucet(selectedFaucet.shortName)
  setAddress("")
  setSecret("")
  setBalance("")
  setSequence("")

  const wallet = Wallet.generate() // { address: "r123...", seed: "s123..." } // TODO - Replace when xrpl.js is working - Wallet.generate()

  const client = new Client(selectedFaucet.url)
  await client.connect()

  try {

    setAddress(wallet.address)
    setSecret(wallet.seed)

    await client.fundWallet(wallet, { usageContext: "xrpl.org-faucet" })

    const response = await waitForSequence(client, wallet.address)
    setSequence(response.sequence)
    setBalance(response.balance)

  } catch (e) {
    alert("There was an error with the " + selectedFaucet.shortName + " faucet. Please try again.")
  }
}

function TestCredentials({selectedFaucet}) {
  const [generatedCredentialsFaucet, setGeneratedCredentialsFaucet] = useState("")
  const [address, setAddress] = useState("")
  const [secret, setSecret] = useState("")
  const [balance, setBalance] = useState("")
  const [sequence, setSequence] = useState("")

  return (<div>
    <div className="btn-toolbar" role="toolbar" aria-label="Button"> 
      <button id="generate-creds-button" onClick={() => generateFaucetCredentials(selectedFaucet, setGeneratedCredentialsFaucet, setAddress, setSecret, setBalance, setSequence)} className="btn btn-primary mr-2 mb-2">Generate {selectedFaucet.shortName} credentials</button>
    </div>

    {/* Displays after account is funded */}
    {generatedCredentialsFaucet && <div id="your-credentials"><h2>Your {generatedCredentialsFaucet} Credentials</h2></div>}
    <div id="loader" style={{display: address ? "inline" : "none"}}><img alt="(loading)" className="throbber" src="/img/xrp-loader-96.png" /> {translate("Generating Keys...")}</div>
    {address && <div id="address"><h3>{translate("Address")}</h3>{address}</div>}
    {secret && <div id="secret"><h3>{translate("Secret")}</h3>{secret}</div>}
    {balance && <div id="balance"><h3>{translate("Balance")}</h3>{(Number(balance) * 0.000001).toLocaleString("en")} {translate("XRP")}</div>}
    {sequence && <div id="sequence"><h3>{translate("Sequence Number")}</h3>{sequence}
      ((secret && !sequence) && (<img className="throbber" src="assets/img/xrp-loader-96.png"/> {translate("Waiting...")}))
    </div>}
    <div id="loader" style={{display: sequence ? "inline" : "none"}}><img alt="(loading)" className="throbber" src="/img/xrp-loader-96.png" />{translate("Waiting...")}</div>
  </div>)
}

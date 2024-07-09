import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { useState } from 'react';
import { Client, dropsToXrp, Wallet } from 'xrpl'; 
import * as faucetData from './faucets.json'
import XRPLoader from '../../@theme/components/XRPLoader';

export const frontmatter = {
  seo: {
    title: 'XRP Faucets',
    description: "Get test XRP for use on various non-production networks.",
  }
};

interface FaucetInfo {
  id: string,
  wsUrl: string,
  jsonRpcUrl: string,
  faucetUrl: string,
  shortName: string,
  desc: string,
}

async function waitForSequence(client: Client, address: string): 
  Promise<{ sequence: string, balance: string }> 
  {
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

function FaucetEndpoints({ faucet, givenKey } : { faucet: FaucetInfo, givenKey: string}) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (<div key={givenKey}>
    <h4>{faucet.shortName} {translate(`Servers`)}</h4>
    <pre>
      <code>
        // WebSocket<br/>
        {faucet.wsUrl}<br/>
        <br/>
        // JSON-RPC<br/>
        {faucet.jsonRpcUrl}
      </code>
    </pre>
  </div>)
}

function FaucetSidebar({ faucets }: { faucets: FaucetInfo[] }): React.JSX.Element {
  return (<aside className="right-sidebar col-lg-6 order-lg-4" role="complementary"> 
    {faucets.map(
      (faucet) => <FaucetEndpoints faucet={faucet} key={faucet.shortName + " Endpoints"} givenKey={faucet.shortName + " Endpoints"}/>
    )}
  </aside>)
}

export default function XRPFaucets(): React.JSX.Element {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const faucets: FaucetInfo[] = faucetData.knownFaucets

  const [selectedFaucet, setSelectedFaucet] = useState(faucets[0])

  return (
    <div className="container-fluid" role="document" id="main_content_wrapper">
      <div className="row">
        <FaucetSidebar faucets={faucets}/>
        <main className="main col-md-7 col-lg-6 order-md-3" role="main" id="main_content_body">
          <section className="container-fluid pt-3 p-md-3">
            <h1>{translate("XRP Faucets")}</h1>
            <div className="content">
                <p>{translate("resources.dev-tool.faucet.content.part1", "These ")}<a href="parallel-networks.html">{translate("resources.dev-tool.faucet.content.part2", "parallel XRP Ledger test networks")}</a> {translate("resources.dev-tool.faucet.content.part3", "provide platforms for testing changes to the XRP Ledger and software built on it, without using real funds.")}</p>
                <p>{translate("resources.dev-tool.faucet.content.part4", "These funds are intended for")} <strong>{translate("resources.dev-tool.faucet.content.part5", "testing")}</strong> {translate("resources.dev-tool.faucet.content.part6", "only. Test networks' ledger history and balances are reset as necessary. Devnets may be reset without warning.")}</p>
                <p>{translate("resources.dev-tool.faucet.content.part7", "All balances and XRP on these networks are separate from Mainnet. As a precaution, do not use the Testnet or Devnet credentials on the Mainnet.")}</p>

                <h3>{translate("Choose Network:")}</h3>
                { faucets.map((net) => (
                <div className="form-check" key={"network-" + net.shortName}>
                    <input onChange={() => setSelectedFaucet(net)} className="form-check-input" type="radio" 
                      name="faucet-selector" id={net.id} checked={selectedFaucet.shortName == net.shortName} />
                    <label className="form-check-label" htmlFor={net.id}>
                      <strong>{translate(net.shortName)}</strong>: {translate(net.desc)}
                    </label>
                </div>
                )) }

                <br/>
                <TestCredentials selectedFaucet={selectedFaucet} translate={translate}/>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

async function generateFaucetCredentialsAndUpdateUI(
  selectedFaucet: FaucetInfo, 
  setButtonClicked: React.Dispatch<React.SetStateAction<boolean>>,
  setGeneratedCredentialsFaucet: React.Dispatch<React.SetStateAction<string>>, 
  setAddress: React.Dispatch<React.SetStateAction<string>>, 
  setSecret: React.Dispatch<React.SetStateAction<string>>, 
  setBalance: React.Dispatch<React.SetStateAction<string>>, 
  setSequence: React.Dispatch<React.SetStateAction<string>>,
  translate: (key: string, options?: string) => string): Promise<void> {

  setButtonClicked(true)

  // Clear existing credentials
  setGeneratedCredentialsFaucet(selectedFaucet.shortName)
  setAddress("")
  setSecret("")
  setBalance("")
  setSequence("")


  const wallet = Wallet.generate()
  
  const client = new Client(selectedFaucet.wsUrl)
  await client.connect()

  try {
    setAddress(wallet.address)
    setSecret(wallet.seed)

    await client.fundWallet(wallet, { faucetHost: selectedFaucet.faucetUrl, usageContext: "xrpl.org-faucet" })

    const response = await waitForSequence(client, wallet.address)

    setSequence(response.sequence)
    setBalance(response.balance)

  } catch (e) {
    alert(`${translate('resources.dev-tools.faucet.error.part1', 'There was an error with the ')}${selectedFaucet.shortName}${translate('resources.dev-tools.faucet.error.part2', ' faucet. Please try again.')}`)
  }
  setButtonClicked(false)
}

function TestCredentials({selectedFaucet, translate}) {

  const [generatedCredentialsFaucet, setGeneratedCredentialsFaucet] = useState("")
  const [address, setAddress] = useState("")
  const [secret, setSecret] = useState("")
  const [balance, setBalance] = useState("")
  const [sequence, setSequence] = useState("")
  const [buttonClicked, setButtonClicked] = useState(false)

  return (<div>
      {/* <XRPLGuard> TODO: Re-add this once we find a good way to avoid browser/server mismatch errors */}
        <div className="btn-toolbar" role="toolbar" aria-label="Button"> 
          <button id="generate-creds-button" onClick={
              () => generateFaucetCredentialsAndUpdateUI(
                selectedFaucet,
                setButtonClicked, 
                setGeneratedCredentialsFaucet, 
                setAddress, 
                setSecret, 
                setBalance, 
                setSequence,
                translate)
            } className="btn btn-primary mr-2 mb-2">
              {`${translate('resources.dev-tools.faucet.cred-btn.part1', 'Generate ')}${selectedFaucet.shortName}${translate('resources.dev-tools.faucet.cred-btn.part2', ' credentials')}`}
          </button>
        </div>
      {/* </XRPLGuard> */}


      {generatedCredentialsFaucet && <div id="your-credentials">
        <h2>{`${translate('resources.dev-tools.faucet.your-cred.part1', 'Your ')}${generatedCredentialsFaucet}${translate('resources.dev-tools.faucet.your-cred.part2', ' Credentials')}`}</h2>
      </div>}

      {(buttonClicked && address === "") && <XRPLoader message={translate("Generating keys..")}/>}

      {address && <div id="address"><h3>{translate("Address")}</h3>{address}</div>}

      {secret && <div id="secret"><h3>{translate("Secret")}</h3>{secret}</div>}
      
      {(address && !balance) && (<div>
        <br/>
        <XRPLoader message={translate("Funding account...")}/>
      </div>)}
      
      {balance && <div id="balance">
        <h3>{translate("Balance")}</h3>
        {dropsToXrp(balance).toLocaleString("en")} {translate("XRP")}
      </div>}
      
      {sequence && <div id="sequence">
        <h3>{translate("Sequence Number")}</h3>
        {sequence}
      </div>}
      
      {(secret && !sequence) && <XRPLoader message={translate("Waiting...")}/>}

    </div>
  )
}

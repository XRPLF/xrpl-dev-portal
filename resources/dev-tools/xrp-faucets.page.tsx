import { Link } from "@redocly/theme/components/Link/Link";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Client, dropsToXrp, Wallet } from 'xrpl';
import XRPLoader from '../../@theme/components/XRPLoader';
import CopyableUrl from "../../@theme/components/CopyableUrl"
import * as faucetData from './faucets.json';

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
  faucetHost: string,
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

  return (
    <div className="quick-ref-group">
      <span className="quick-ref-key"><strong>{faucet.shortName}</strong></span>
      <div className="quick-ref-urls">
        <span className="quick-ref-protocol">{translate("WebSocket")}</span>
        <CopyableUrl url={faucet.wsUrl} translate={translate} />
        <span className="quick-ref-protocol">{translate("JSON-RPC")}</span>
        <CopyableUrl url={faucet.jsonRpcUrl} translate={translate} />
      </div>
    </div>
  )
}

function FaucetSidebar({ faucets }: { faucets: FaucetInfo[] }): React.JSX.Element {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (<aside className="right-sidebar col-lg-6 order-4" role="complementary">
    <div className="quick-ref-card">
      <h4 className="quick-ref-label">{translate("Public Servers")}</h4>
      {faucets.map(
        (faucet) => <FaucetEndpoints faucet={faucet} key={faucet.shortName + " Endpoints"} givenKey={faucet.shortName + " Endpoints"}/>
      )}
    </div>
  </aside>)
}

export default function XRPFaucets(): React.JSX.Element {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const faucets: FaucetInfo[] = faucetData.knownFaucets

  const [selectedFaucet, setSelectedFaucet] = useState(faucets[0])
  const [selectedMode, setSelectedMode] = useState(FaucetMode.generate)
  const [requestedAmount, setRequestedAmount] = useState('10')
  const [refillAddress, setRefillAddress] = useState('')
  useEffect( () => {
    setRefillAddress(localStorage.getItem('faucet-saved-address') || "")
  }, [])

  return (
    <div className="container-fluid page-faucet" role="document" id="main_content_wrapper">
      <div className="row">
        <FaucetSidebar faucets={faucets}/>
        <main className="main col-md-7 col-lg-6 order-1" role="main" id="main_content_body">
          <section className="container-fluid pt-3 p-md-3">
            <h1>{translate("XRP Faucets")}</h1>
            <div className="content">
                <p>{translate("resources.dev-tool.faucet.content.part1", "These ")}<Link to="../../docs/concepts/networks-and-servers/parallel-networks">{translate("resources.dev-tool.faucet.content.part2", "parallel XRP Ledger test networks")}</Link> {translate("resources.dev-tool.faucet.content.part3", "provide platforms for testing changes to the XRP Ledger and software built on it, without using real funds.")}</p>
                <p>{translate("resources.dev-tool.faucet.content.part4", "These funds are intended for")} <strong>{translate("resources.dev-tool.faucet.content.part5", "testing")}</strong> {translate("resources.dev-tool.faucet.content.part6", "only. Test networks' ledger history and balances are reset as necessary. Devnets may be reset without warning.")}</p>
                <p>{translate("resources.dev-tool.faucet.content.part7", "All balances and XRP on these networks are separate from Mainnet. As a precaution, do not use the same credentials on Mainnet.")}</p>
                
                <h3>{translate("Choose network:")}</h3>
                { faucets.map((net) => (
                <div className="form-check" key={"network-" + net.shortName}>
                    <input onChange={() => setSelectedFaucet(net)} className="form-check-input" type="radio" 
                      name="faucet-selector" id={net.id} checked={selectedFaucet.shortName == net.shortName} />
                    <label className="form-check-label" htmlFor={net.id}>
                      <strong>{translate(net.shortName)}</strong>: {translate(net.desc)}
                    </label>
                </div>
                )) }

                <h3>{translate("Request amount")}</h3>
                <div className="input-group my-2">
                  <input type="number" className="form-control" id="request-xrp-amount" value={requestedAmount} min="1" max="10000"
                   onChange={(e) => setRequestedAmount(e.target.value)} />
                   <label className="input-group-text" htmlFor="request-xrp-amount">{translate("XRP")}</label>
                </div>

                <h3>{translate("Fund wallet:")}</h3>
                <div className="form-group">
                  <div className="input-group">
                    <div className="form-check form-check-inline">
                      <label className="input-group-text" htmlFor='mode-generate'>
                        <input onChange={() => setSelectedMode(FaucetMode.generate)} className="form-check-input" type="radio" 
                        name="faucet-mode-selector" id='mode-generate' defaultChecked={true} />
                        {translate("Generate keys")}</label>
                    </div>
                  
                    <div className="form-check form-check-inline mr-0 pr-0 col">
                      <label className="input-group-text" htmlFor="mode-refill">
                        <input onChange={() => setSelectedMode(FaucetMode.refill)} className="form-check-input" type="radio" 
                        name="faucet-mode-selector" id='mode-refill' defaultChecked={false} />
                        {translate("Refill wallet:")}
                      </label>
                      <div className="input-group">
                        <input type="text" className="form-control form-control-inline" id="refill-wallet-id" onChange={(e) => setRefillAddress(e.target.value)}
                          placeholder="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" value={refillAddress} pattern="^r[A-HJ-NP-Za-km-z1-9]{24,34}$" />
                      </div>
                    </div>
                  </div>
                </div>

                <br/>
                <TestCredentials selectedFaucet={selectedFaucet} selectedMode={selectedMode} requestedAmount={requestedAmount} refillAddress={refillAddress} setRefillAddress={setRefillAddress} translate={translate}/>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

enum FaucetMode {
  generate = "generate",
  refill = "refill",
}

interface FaucetOptions {
  selectedFaucet: FaucetInfo,
  selectedMode: FaucetMode,
  requestedAmount: string,
  refillAddress: string,
  setRefillAddress: React.Dispatch<React.SetStateAction<string>>,
  translate: (key: string, options?: string) => string
}

function TestCredentials({ selectedFaucet, selectedMode, requestedAmount, refillAddress, setRefillAddress, translate }: FaucetOptions) {
  const [generatedCredentialsFaucet, setGeneratedCredentialsFaucet] = useState("")
  const [address, setAddress] = useState("")
  const [secret, setSecret] = useState("")
  const [balance, setBalance] = useState("")
  const [sequence, setSequence] = useState("")
  const [buttonClicked, setButtonClicked] = useState(false)
  const [waitingForSeq, setWaitingForSeq] = useState(false)

  const clickGetXrp = async () => {
    setButtonClicked(true)

    // Clear existing credentials
    setGeneratedCredentialsFaucet(selectedFaucet.shortName)
    setAddress("")
    setSecret("")
    setBalance("")
    setSequence("")

    if (selectedMode === FaucetMode.refill && !refillAddress) {
      alert(translate("Please provide an address to refill or choose 'Generate keys'."))
      setButtonClicked(false)
      return
    }

    const fundingOpts = {
      amount: requestedAmount,
      faucetHost: selectedFaucet.faucetHost,
      usageContext: "xrpl.org-faucet"
    }

    if (selectedMode === FaucetMode.generate) {
      const wallet = Wallet.generate()

      try {
        const client = new Client(selectedFaucet.wsUrl)
        client.apiVersion = 1 // Workaround for networks that don't support APIv2
        await client.connect()

        setAddress(wallet.address)
        setSecret(wallet.seed)

        await client.fundWallet(wallet, fundingOpts)
        localStorage.setItem("faucet-saved-address", wallet.address)
        setRefillAddress(wallet.address)

        setWaitingForSeq(true)
        const response = await waitForSequence(client, wallet.address)
        setSequence(response.sequence)
        setBalance(response.balance)
        setWaitingForSeq(false)

      } catch (e) {
        alert(`${translate('resources.dev-tools.faucet.error.part1', 'There was an error with the ')}${selectedFaucet.shortName}${translate('resources.dev-tools.faucet.error.part2', ' faucet. Please try again.')}`)
        console.error(e)
      }
    } else {
      const client = new Client(selectedFaucet.wsUrl)
      client.apiVersion = 1 // Workaround for networks that don't support APIv2
      await client.connect()

      const walletToFund = {classicAddress: refillAddress} // fake Wallet class
      try {
        setAddress(refillAddress)
        await client.fundWallet(walletToFund, fundingOpts)
        const response = await waitForSequence(client, refillAddress)

        setWaitingForSeq(true)
        setSequence(response.sequence)
        setBalance(response.balance)
        setWaitingForSeq(false)

      } catch (e) {
        alert(`${translate('resources.dev-tools.faucet.error.part1', 'There was an error with the ')}${selectedFaucet.shortName}${translate('resources.dev-tools.faucet.error.part2', ' faucet. Please try again.')}`)
        console.error(e)
      }
    }
    setButtonClicked(false)
  }

  return (
    <div>
      <div className="btn-toolbar" role="toolbar" aria-label="Button"> 
        <button id="generate-creds-button" onClick={clickGetXrp} className="btn btn-primary mr-2 mb-2">
            {translate('Get Test XRP')}
        </button>
      </div>


      {generatedCredentialsFaucet && <div id="your-credentials">
        <h2>{`${translate('resources.dev-tools.faucet.your-cred.part1', 'Your ')}${generatedCredentialsFaucet}${translate('resources.dev-tools.faucet.your-cred.part2', ' Credentials')}`}</h2>
      </div>}

      {address && <div id="address"><h3>{translate("Address")}</h3>{address}</div>}

      {secret && <div id="secret"><h3>{translate("Secret")}</h3>{secret}</div>}
      
      <XRPLoader message={translate("Waiting for faucet...")} show={buttonClicked} />
      
      {balance && <div id="balance">
        <h3>{translate("Balance")}</h3>
        {dropsToXrp(balance).toLocaleString("en")} {translate("XRP")}
      </div>}
      
      {sequence && <div id="sequence">
        <h3>{translate("Sequence Number")}</h3>
        {sequence}
      </div>}
      
      <XRPLoader message={translate("Waiting for sequence number...")} show={waitingForSeq} />

    </div>
  )
}

import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { useState } from 'react';

import { Client, Wallet } from 'xrpl'; // - TODO: Uncomment when xrpl.js is working


// TODO - Use `translate` on all text - Jackson

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

export default function XRPFaucets() {

  const faucets = [
    {
      "id": "faucet-select-testnet",
      "wsUrl": "wss://s.altnet.rippletest.net:51233/",
      "jsonRpcUrl": "https://s.altnet.rippletest.net:51234/",
      "shortName": "Testnet",
      "faucet": "https://faucet.altnet.rippletest.net/accounts",
      "desc": "Mainnet-like network for testing applications."
    },
    {
      "id": "faucet-select-devnet",
      "wsUrl": "wss://s.devnet.rippletest.net:51233/",
      "jsonRpcUrl": "https://s.devnet.rippletest.net:51234/",
      "shortName": "Devnet",
      "faucet": "https://faucet.devnet.rippletest.net/accounts",
      "desc": "Preview of upcoming amendments."
    },
    {
      "id": "faucet-select-ammdevnet",
      "wsUrl": "wss://amm.devnet.rippletest.net:51233/",
      "jsonRpcUrl": "https://amm.devnet.rippletest.net:51234/",
      "shortName": "AMM-Devnet",
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
            { faucets.map((net) => (
            <div className="form-check" key={"network-" + net.shortName}>
                <input onChange={() => setSelectedFaucet(net)} className="form-check-input" type="radio" name="faucet-selector" id={net.id} defaultValue={net.faucet} data-jsonrpcurl={net.jsonRpcUrl} data-wsurl={net.wsUrl} data-shortName={net.shortName} checked={selectedFaucet.shortName == net.shortName} />
                <label className="form-check-label" htmlFor={net.id}><strong>{net.shortName}</strong>: {net.desc}</label>
            </div>
            )) }
            <p className="mb-3"><b>Hooks Testnet</b>: <a href="https://hooks-testnet-v3.xrpl-labs.com/" className="external-link">See the Hooks Faucet</a></p>
            <TestCredentials selectedFaucet={selectedFaucet}/>
        </div>
      </section>
    </div>
  )
}

// onClick={() => console.log(waitForSequence(selectedFaucet.wsUrl, Wallet.generate()))}
// TODO - Jackson (Makes this component get updated when clicking "generate faucet")
// $(document).ready(function() {
//   $('#generate-creds-button').click( (evt) => {
//     const checked_network = $("input[name='faucet-selector']:checked")
//     const url = checked_network.val()
//     const net_name = checked_network.data("shortName")
//     const wsUrl = checked_network.data("wsurl")
//     TestNetCredentials(url, net_name, wsUrl)
//   });
// })

// function TestNetCredentials(url, altnet_name, wsUrl) {

//   const credentials = $('#your-credentials')
//   const address = $('#address')
//   const secret = $('#secret')
//   const balance = $('#balance')
//   const sequence = $('#sequence')
//   const loader = $('#loader')

//   //reset the fields initially and for re-generation
//   credentials.hide()
//   address.html('')
//   secret.html('')
//   balance.html('')
//   sequence.html('')
//   loader.css('display', 'inline')

//   // generate the test wallet
//   const test_wallet = xrpl.Wallet.generate();

//   //call the alt-net and get key generations
//   $.ajax({
//     url: url,
//     type: 'POST',
//     contentType: "application/json; charset=utf-8",
//     data: JSON.stringify({
//       destination: test_wallet.address,
//       memos: [ 
//         {
//           data: "xrpl.org-faucet",
//         },
//       ],
//     }),
//     success: function(data) {
//       //hide the loader and show results
//       loader.hide();
//       credentials.hide().html('<h2>Your '+altnet_name+' Credentials</h2>').fadeIn('fast')
//       address.hide().html('<h3>Address</h3> ' +
//         test_wallet.address).fadeIn('fast')
//       secret.hide().html('<h3>Secret</h3> ' +
//       test_wallet.seed).fadeIn('fast')
//       // TODO: currently the faucet api doesn't return balance unless the account is generated server side, need to make upates when faucet repo is updated. 
//       balance.hide().html('<h3>Balance</h3> ' +
//         Number(data.amount).toLocaleString('en') + ' XRP').fadeIn('fast')
//       sequence.html('<h3>Sequence</h3> <img class="throbber" src="assets/img/xrp-loader-96.png"> Waiting...').fadeIn('fast')
//       wait_for_seq(wsUrl, test_wallet.address)

// // TODO - Use the updated wait_for_seq with this additional section outside of the function! 
// $("#sequence").html('<h3>Sequence Number</h3> '+response.result.account_data.Sequence)
// $("#balance").html(
//   "<h3>Balance</h3> " +
//     (Number(response.result.account_data.Balance) * 0.000001).toLocaleString(
//       "en"
//     ) +
//     " XRP"
// )

//     },
//     error: function() {
//       loader.hide();
//       alert("There was an error with the "+altnet_name+" faucet. Please try again.");
//     }
//   })
// }

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
  const currentpage = { prefix: "" } // TODO: Figure out what currentpage should actually be (seems to be Dactyl related) - Jackson
  const [generatedCredentialsFaucet, setGeneratedCredentialsFaucet] = useState("")
  const [address, setAddress] = useState("")
  const [secret, setSecret] = useState("")
  const [balance, setBalance] = useState("")
  const [sequence, setSequence] = useState("")

  // What's the best way to go about this? (I'd like to conditionally display these, and update them when the button is pressed)
  // 1st - Show the loading icon
  // 2nd - Generate the credentials
  // 3rd - Populate the page with the address / secret / etc.
  // 4th - Show the loading icon under the Sequence Number section
  // 5th - Send out the request to the faucet
  // 6th - Populate everything with the results

  // 1. Why did bringing in the button break the auto updates from changing the text via setState? (Do I need to pass it as a pointer via a prop object?)
  // 2. Is there a better way to initialize all these variables up top?
  // 3. I'm not supposed to setState within this class (infinite loop) - so is setState only used in things like onClick / conditional functions?
  // 4. If I pass the setter to sub-functions, they can update this component right?

  return (<div>
    <div className="btn-toolbar" role="toolbar" aria-label="Button"> 
      <button id="generate-creds-button" onClick={() => generateFaucetCredentials(selectedFaucet, setGeneratedCredentialsFaucet, setAddress, setSecret, setBalance, setSequence)} className="btn btn-primary mr-2 mb-2">Generate {selectedFaucet.shortName} credentials</button>
    </div>

    {/* Displays after account is funded */}
    {generatedCredentialsFaucet && <div id="your-credentials"><h2>Your {generatedCredentialsFaucet} Credentials</h2></div>}
    <div id="loader" style={{display: address ? "inline" : "none"}}><img alt="(loading)" className="throbber" src={currentpage.prefix + "static/img/xrp-loader-96.png"} /> Generating Keys...</div>
    {address && <div id="address"><h3>Address</h3>{address}</div>}
    {secret && <div id="secret"><h3>Secret</h3>{secret}</div>}
    {balance && <div id="balance"><h3>Balance</h3>{(Number(balance) * 0.000001).toLocaleString("en")} XRP</div>}
    {sequence && <div id="sequence"><h3>Sequence Number</h3>{sequence}
      ((secret && !sequence) && (<img className="throbber" src="assets/img/xrp-loader-96.png"/> Waiting...'))
    </div>}
    <div id="loader" style={{display: sequence ? "inline" : "none"}}><img alt="(loading)" className="throbber" src={currentpage.prefix + "static/img/xrp-loader-96.png"} /> Waiting...</div>
  </div>)
}

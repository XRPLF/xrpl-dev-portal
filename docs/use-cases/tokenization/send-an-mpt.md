---
seo:
    description: Issue an asset-backed token such as a US Treasury bill using multi-purpose tokens.
labels:
  - Tokens
  - MPT
---
# Sending an MPT

_As an XRPL holder, I want to send multi-purpose tokens to another account in order to complete an offline transaction._

To send an MPT to another account, the receiving account must first authorize the receipt of the MPT, based on its MPToken Issuance ID. This is to prevent malicious users from spamming accounts with unwanted tokens that could negatively impact storage and XRP reserves.

## Send MPT Utility

The Send MPT utility embedded on the page below lets you create an account to receive an MPT, authorize it to receive a specific MPT issuance, then send an MPT from an issuer or holder account. (You can issue an MPT using the [MPT Generator](./creating-an-asset-backed-multi-purpose-token.md) utility.)

![MPT Generator Utility](../../img/uc-mpt2-mpt-sender-empty-form.png)

You can download a [standalone version of the MPT Sender](../../../_code-samples/mpt-sender/mpt-sender.zip) as sample code, or use the embedded form that follows.

<div>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script> 
<script>
    if (typeof module !== "undefined") {
    const xrpl = require("xrpl")
}
    document.addEventListener("DOMContentLoaded", function() {
        getHolderAccountFromSeedButton.addEventListener("click", getHolderFromSeed)
        getReceiverAccountButton.addEventListener("click", getAccount)
        getReceiverFromSeedButton.addEventListener("click", getReceiverFromSeed)
        authorizeMPTButton.addEventListener("click", authorizeMPT)
        sendMPTButton.addEventListener("click", sendMPT)
        getMPTsButton.addEventListener("click", getMPTs)
 })
function getNet() {
    let net
    if (document.getElementById("tn").checked) net = "wss://s.altnet.rippletest.net:51233"
    if (document.getElementById("dn").checked) net = "wss://s.devnet.rippletest.net:51233"
    return net
  } // End of getNet()           
  // *******************************************************
  // ************* Get Account *****************************
  // *******************************************************
  async function getAccount() {
    let net = getNet()
    const client = new xrpl.Client(net)
    receiverAccountField.value = "Getting a new account..."
    results = 'Connecting to ' + net + '....'
  //-------------------------------This uses the default faucet for Testnet/Devnet.
    let faucetHost = null
    await client.connect()
    results += '\nConnected, funding wallet.'
  // ----------------------------------------Create and fund a test account wallet.
    const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet
    results += '\nGot a wallet.'
  // ------------------------------------------------------Get the current balance.
    receiverAccountField.value = my_wallet.address
    receiverSeedField.value = my_wallet.seed
    results += '\nAccount created.'
    console.log(results)
    client.disconnect()
  } // End of getAccount()
// **********************************************************
// *********** Get Holder from Seed *************************
// **********************************************************
  async function getHolderFromSeed() {
    let net = getNet()
    const client = new xrpl.Client(net)
    holderAccountField.value = "Getting holder account from seed..."
    results = 'Connecting to ' + getNet() + '....'
    await client.connect()
    results += '\nConnected, finding wallets.\n'
    console.log(results)
  // --------------------------------------------------Find the test account wallet.    
    const my_wallet = xrpl.Wallet.fromSeed(holderSeedField.value)    
  // -------------------------------------------------------Get the current balance.
    holderAccountField.value = my_wallet.address
    holderSeedField.value = my_wallet.seed      
    client.disconnect()
  } // End of getHolderFromSeed()
// **********************************************************
// *********** Get Receiver from Seed *************************
// **********************************************************
  async function getReceiverFromSeed() {
    let net = getNet()
    const client = new xrpl.Client(net)
    receiverAccountField.value = "Getting receiver account from seed..."
    results = 'Connecting to ' + getNet() + '....'
    await client.connect()
    results += '\nConnected, finding wallets.\n'
    resultsArea.value = results
  // --------------------------------------------------Find the test account wallet.    
    const my_wallet = xrpl.Wallet.fromSeed(receiverSeedField.value)    
  // -------------------------------------------------------Get the current balance.
    receiverAccountField.value = my_wallet.address
    receiverSeedField.value = my_wallet.seed 
    resultsArea.value = results     
    client.disconnect()
  } // End of getReceiverFromSeed()
  // *******************************************************
  // *************** Send MPT **********************
  // *******************************************************
async function sendMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  resultsArea.value = results
  await client.connect()
  results += '\nConnected.'
  resultsArea.value = results  
  const holder_wallet = xrpl.Wallet.fromSeed(holderSeedField.value)
  const mpt_issuance_id = mptIssuanceIDField.value
  const mpt_quantity = quantityField.value
  const send_mpt_tx = {
    "TransactionType": "Payment",
    "Account": holder_wallet.address,
    "Amount": {
      "mpt_issuance_id": mpt_issuance_id,
      "value": mpt_quantity,
    },
    "Destination": receiverAccountField.value,
  }
  const pay_prepared = await client.autofill(send_mpt_tx)
  const pay_signed = holder_wallet.sign(pay_prepared)
  results += `\n\nSending ${mpt_quantity} ${mpt_issuance_id} to ${receiverAccountField.value} ...`
  resultsArea.value = results
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        results += 'Transaction succeeded.\n\n'
        results += JSON.stringify(pay_result.result, null, 2)
    resultsArea.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    results += JSON.stringify(pay_result.result, null, 2)
    resultsArea.value = results
  }
  client.disconnect()
} // end of sendMPT()
// *******************************************************
// ******************** Get MPTs *************************
// *******************************************************
async function getMPTs() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  resultsArea.value = results
  await client.connect()
  const receiver_wallet = xrpl.Wallet.fromSeed(receiverSeedField.value)
  results += '\nConnected.'
  resultsArea.value = results
  const mpts = await client.request({
      command: "account_objects",
      account: receiver_wallet.address,
      ledger_index: "validated",
      type: "mptoken"
    })
  let JSONString = JSON.stringify(mpts.result, null, 2)
  let JSONParse = JSON.parse(JSONString)
  let numberOfMPTs = JSONParse.account_objects.length
  let x = 0
  while (x < numberOfMPTs){
  results += "\n\nMPT Issuance ID: " + JSONParse.account_objects[x].MPTokenIssuanceID
             + "\nMPT Amount: " + JSONParse.account_objects[x].MPTAmount
    x++
  }
  results += "\n\n" + JSONString
  resultsArea.value = results
  client.disconnect()
} // End of getMPTs()
// **********************************************************************
// ****** MPTAuthorize Transaction ***************************************
// **********************************************************************
async function authorizeMPT() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  resultsArea.value = results
  await client.connect()
  const receiver_wallet = xrpl.Wallet.fromSeed(receiverSeedField.value)
  const mpt_issuance_id = mptIssuanceIDField.value
  const auth_mpt_tx = {
    "TransactionType": "MPTokenAuthorize",
    "Account": receiver_wallet.address,
    "MPTokenIssuanceID": mpt_issuance_id,
  }
  const auth_prepared = await client.autofill(auth_mpt_tx)
  const auth_signed = receiver_wallet.sign(auth_prepared)
  results += `\n\nSending authorization...`
  resultsArea.value = results
  const auth_result = await client.submitAndWait(auth_signed.tx_blob)
  console.log(JSON.stringify(auth_result.result, null, 2))
  if (auth_result.result.meta.TransactionResult == "tesSUCCESS") {
    results += `Transaction succeeded`
    resultsArea.value = results
  } else {
    results += 'Transaction failed: See JavaScript console for details.'
    resultsArea.value = results
  }
  client.disconnect()
} // end of MPTAuthorize()
</script>
<div>
<form>
    <link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
    <script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script> 
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <div class="container">
      <div class="row">
        <div class="col align-self-start">
        <h4>MPT Sender</h4>
        </div>
      </div>
        <div class="row">
            <div class="col align-self-start">
              <b>1. Choose your preferred network.</b>
            </div>
            <div class="col align-self-center">
              <input type="radio" id="tn" name="server"
                  value="wss://s.altnet.rippletest.net:51233">
              <label for="tn">Testnet</label>
              <br/>
              <input type="radio" id="dn" name="server"
                  value="wss://s.devnet.rippletest.net:51233" checked>
              <label for="dn">Devnet</label>
            </div>
        </div>
        <div class="row">
            <div class="col align-self-start">
              <b>2. Get the holder (or issuer) account from its seed.<br/>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <label for="holderSeedField">Holder Seed</label>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <input type="text" id="holderSeedField" size="40"></input>
              <br/><br/>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <label for="holderAccountField">Holder Account</label>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <input type="text" id="holderAccountField" size="40"></input>
            </div>
          </div>
          <br/>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <button type="button" id="getHolderAccountFromSeedButton" class="btn btn-primary">Get Holder Account From Seed</button>
              <br/><br/>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <b>3. Get a new receiver account or retrieve one from its seed.</b>
                  <div class="row">
            <div class="col align-self-start">
              <label for="receiverSeedField">Receiver Seed</label>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <input type="text" id="receiverSeedField" size="40"></input>
              <br/><br/>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <label for="receiverAccountField">Receiver Account</label>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <input type="text" id="receiverAccountField" size="40"></input>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-start">
              <button type="button" id="getReceiverAccountButton" class="btn btn-primary">Get New Receiver Account</button>
              </div>
              <div class="col align-self-start">
              <button type="button" id="getReceiverFromSeedButton" class="btn btn-primary">Get Receiver Account From Seed</button>
              <br/><br/>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col align-self-start">
            <b>4. Enter the <i>MPT Issuance ID</i>.</b>
          </div>
        </div>
        <div class="row">
            <div class="col align-self-start">
                <label for="mptIssuanceIDField">MPT Issuance ID</label>
            </div>
        </div>
        <div class="row">
            <div class="col align-self-start">
              <input type="text" id="mptIssuanceIDField" size="40"></input>
              <br/><br/>
            </div>
        </div>
        <div class="row">
          <div class="col align-self-start">
            <b>5. Click <i>Authorize MPT</i> to authorize the MPT for the receiver.</b>
          </div>
        </div>
        <div class="row">
            <button type="button" id="authorizeMPTButton" class="btn btn-primary">Authorize MPT</button>
        </div>
        <br/>
        </div>
        <div class="row">
          <div class="col align-self-start">
            <b>5. Enter the <i>Quantity</i> of MPTs to send.</b>
          </div>
        </div>
        <div class="row">
            <div class="col align-self-start">
                <label for="quantity">Quantity</label>
            </div>
        </div>
        <div class="row">
            <div class="col align-self-start">
                <input type="text" id="quantityField" size="40"></input>
            </div>
        </div>
    <div class="row">
        <div class="col-align-items-left">
        <br/>
          <p><b>6. Click Send MPTs</b><br/>
             <button type="button" id="sendMPTButton" class="btn btn-primary">Send MPTs</button>
          </p>
          </div>
    </div>
    <div class="row">
        <div class="col-align-self-start">
          <p><b>Results</b></p>
          <textarea class="form-control" id="resultsArea" rows="18" cols="40"></textarea>
        </div>
    </div>
    <div class="row">
        <div class="col-align-self-start">
            <br/>
            <p><b>7. Click Get MPTs</b><br/>
            <button type = "button" id="getMPTsButton" class="btn btn-primary">Get MPTs</button>
          </p>
      </div>
    </div>
  </div>
</div>
</form>
</div>
<hr/>


const allFlags = [
  "empty",
  "asfRequireDest",
  "asfRequireAuth",
  "asfDisallowXRP",
  "asfDisableMaster",
  "asfAccountTxnID",
  "asfNoFreeze",
  "asfGlobalFreeze",
  "asfDefaultRipple",
  "asfDepositAuth",
  "asfAuthorizedNFTokenMinter",
  "hooksReserved",
  "asfDisallowIncomingNFTokenOffer",
  "asfDisallowIncomingCheck",
  "asfDisallowIncomingPayChan",
  "asfDisallowIncomingTrustline",
  "asfAllowTrustLineClawback",
  ]

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("issuer_additional_fields").style.display="none"
});


// ******************************************************
// ************* Get the Preferred Network **************
// ******************************************************   

function getNet() {
  let net
  if (document.getElementById("mn").checked) net = "wss://xrplcluster.com/"
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
  results = 'Connecting to ' + net + '....'

//-------------------------------This uses the default faucet for Testnet/Devnet.
  let faucetHost = null
  resultField.value = results
  await client.connect()
  results += '\nConnected, funding wallet.'
// ----------------------------------------Create and fund a test account wallet.
  const my_wallet = (await client.fundWallet(null, { faucetHost })).wallet
  results += '\nGot a wallet.'

// ------------------------------------------------------Get the current balance.
  accountField.value = my_wallet.address
  seedField.value = my_wallet.seed
  results += '\nAccount created.\n'
  client.disconnect()
  results+=JSON.stringify(my_wallet)
  resultField.value = results
} // End of getAccount()
      
// *******************************************************
// ************ Get Account from Seed ******************** 
// *******************************************************

async function getAccountFromSeed() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  await client.connect()
  results += '\nConnected, finding wallets.\n'
  resultField.value = results
// --------------------------------------------------Find the test account wallet.    
  const my_wallet = xrpl.Wallet.fromSeed(seedField.value)
      
// -------------------------------------------------------Get the current balance.
  accountField.value = my_wallet.address
  seedField.value = my_wallet.seed      
  client.disconnect()
  getAccountInfo()
} // End of getAccountFromSeed()

// *******************************************************
// ***************** Get Account Info ******************** 
// *******************************************************

async function getAccountInfo() {
  let net = getNet()
  const client = new xrpl.Client(net)
  results = 'Connecting to ' + getNet() + '....'
  await client.connect()   
  results += '\nConnected.'
  results+= "\nGetting account info...\n"
  const my_acct_info = await client.request({
    command: "account_info",
    account: accountField.value,
    ledger_index: "validated",
    signer_lists: true
  })
  results = JSON.stringify(my_acct_info, null, 2)
  resultField.value += results
  var parsedResults = JSON.parse(results)
  try {
  document.getElementById("tickSizeField").value = parsedResults.result.account_data.TickSize
  document.getElementById("transferRateField").value = parsedResults.result.account_data.TransferRate
  document.getElementById("domainField").value = xrpl.convertHexToString(parsedResults.result.account_data.Domain)
  } catch (error ) {
  }
  document.getElementById("defaultRipple").checked = parsedResults.result.account_flags.defaultRipple
  document.getElementById("allowTrustLineClawback").checked = parsedResults.result.account_flags.allowTrustLineClawback
  document.getElementById("depositAuth").checked = parsedResults.result.account_flags.depositAuth
  document.getElementById("disableMasterKey").checked = parsedResults.result.account_flags.disableMasterKey
  document.getElementById("disallowIncomingCheck").checked = parsedResults.result.account_flags.disallowIncomingCheck
  document.getElementById("disallowIncomingNFTokenOffer").checked = parsedResults.result.account_flags.disallowIncomingNFTokenOffer
  document.getElementById("disallowIncomingPayChan").checked = parsedResults.result.account_flags.disallowIncomingPayChan
  document.getElementById("disallowIncomingTrustline").checked = parsedResults.result.account_flags.disallowIncomingTrustline
  document.getElementById("disallowIncomingXRP").checked = parsedResults.result.account_flags.disallowIncomingXRP
  document.getElementById("globalFreeze").checked = parsedResults.result.account_flags.globalFreeze
  document.getElementById("noFreeze").checked = parsedResults.result.account_flags.noFreeze
  document.getElementById("requireAuthorization").checked = parsedResults.result.account_flags.requireAuthorization
  document.getElementById("requireDestinationTag").checked = parsedResults.result.account_flags.requireDestinationTag
  try {
    let signerEntries_variable = parsedResults.result.account_data.signer_lists[0].SignerEntries
      document.getElementById("signer1AccountField").value = signerEntries_variable[0]["SignerEntry"]["Account"]
      document.getElementById("signer1WeightField").value = signerEntries_variable[0]["SignerEntry"]["SignerWeight"]
      document.getElementById("signer2AccountField").value = signerEntries_variable[1]["SignerEntry"]["Account"]
      document.getElementById("signer2WeightField").value = signerEntries_variable[1]["SignerEntry"]["SignerWeight"]
      document.getElementById("signer3AccountField").value = signerEntries_variable[2]["SignerEntry"]["Account"]
      document.getElementById("signer3WeightField").value = signerEntries_variable[2]["SignerEntry"]["SignerWeight"]
      document.getElementById("signerQuorumField").value = parsedResults.result.account_data.signer_lists[0].SignerQuorum
  } catch (error) {
  }
  client.disconnect()
} // End of getAccountInfo()

// *******************************************************
// **************** Configure Account ********************
// *******************************************************

async function configureAccount() {
  let net = getNet()
  const client = new xrpl.Client(net)
  resultField.value = `Connecting to ${net}.`
  await client.connect()
  my_wallet = xrpl.Wallet.fromSeed(seedField.value)
  const my_acct_info = await client.request({
    command: "account_info",
    account: accountField.value,
    ledger_index: "validated",
  })

  json_results = JSON.stringify(my_acct_info, null, 2)
  var parsedResults = JSON.parse(json_results)
  let defRipBool = document.getElementById("defaultRipple").checked 
  if (defRipBool != parsedResults.result.account_flags.defaultRipple) {
    if(defRipBool) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDefaultRipple)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDefaultRipple)
    }
  }

  if (document.getElementById("allowTrustLineClawback").checked != parsedResults.result.account_flags.allowTrustLineClawback) {
    if(document.getElementById("allowTrustLineClawback").checked) {
            await setFlag(16)
    } else {
      await clearFlag(16)
    }
  }

  if (document.getElementById("depositAuth").checked != parsedResults.result.account_flags.depositAuth) {
    if(document.getElementById("depositAuth").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDepositAuth)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDepositAuth)
    }
  }
  
  if (document.getElementById("disableMasterKey").checked != parsedResults.result.account_flags.disableMasterKey) {
    if(document.getElementById("disableMasterKey").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDisableMaster)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDisableMaster)
    }
  }
  
  if (document.getElementById("disallowIncomingCheck").checked != parsedResults.result.account_flags.disallowIncomingCheck) {
    if(document.getElementById("disallowIncomingCheck").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingCheck)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingCheck)
    }
  }
  
  if (document.getElementById("disallowIncomingNFTokenOffer").checked != parsedResults.result.account_flags.disallowIncomingNFTokenOffer) {
    if(document.getElementById("disallowIncomingNFTokenOffer").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingNFTokenOffer)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingNFTokenOffer)
    }
  }

  if (document.getElementById("disallowIncomingPayChan").checked != parsedResults.result.account_flags.disallowIncomingPayChan) {
    if(document.getElementById("disallowIncomingPayChan").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingPayChan)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingPayChan)
    }
  }

  if (document.getElementById("disallowIncomingTrustline").checked != parsedResults.result.account_flags.disallowIncomingTrustline) {
    if(document.getElementById("disallowIncomingTrustline").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingTrustline)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDisallowIncomingTrustline)
    }
  }

  if (document.getElementById("disallowIncomingXRP").checked != parsedResults.result.account_flags.disallowIncomingXRP) {
    if(document.getElementById("disallowIncomingXRP").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfDisallowXRP)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfDisallowXRP)
    }
  }

  if (document.getElementById("globalFreeze").checked != parsedResults.result.account_flags.globalFreeze) {
    if(document.getElementById("globalFreeze").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfGlobalFreeze)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfGlobalFreeze)
    }
  }

  if (document.getElementById("noFreeze").checked != parsedResults.result.account_flags.noFreeze) {
    if(document.getElementById("noFreeze").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfNoFreeze)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfNoFreeze)
    }
  }

  if (document.getElementById("requireAuthorization").checked != parsedResults.result.account_flags.requireAuthorization) {
    if(document.getElementById("requireAuthorization").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfRequireAuth)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfRequireAuth)
    }
  }

  if (document.getElementById("requireDestinationTag").checked != parsedResults.result.account_flags.requireDestinationTag) {
    if(document.getElementById("requireDestinationTag").checked) {
      await setFlag(xrpl.AccountSetAsfFlags.asfRequireDest)
    } else {
      await clearFlag(xrpl.AccountSetAsfFlags.asfRequireDest)
    }
  }

  if(!document.getElementById("is").checked) {
    my_config = {
      "TransactionType": "AccountSet",
      "Account" : my_wallet.address,
      "TickSize": 0,
      "TransferRate": 1000000000,
      "Domain": ""
    }
    const preparedAccount = await client.autofill(my_config)
    const signedAccount = my_wallet.sign(preparedAccount)
    const resultAccount = await client.submitAndWait(signedAccount.tx_blob)
  } else {
    my_config = {
      "TransactionType": "AccountSet",
      "Account" : my_wallet.address,
      "TickSize": parseInt(document.getElementById("tickSizeField").value),
      "TransferRate": parseInt(document.getElementById("transferRateField").value),
      "Domain": xrpl.convertStringToHex(document.getElementById("domainField").value),
    }
    const preparedAccount = await client.autofill(my_config)
    const signedAccount = my_wallet.sign(preparedAccount)
    const resultAccount = await client.submitAndWait(signedAccount.tx_blob)
    resultField.value += JSON.stringify(resultAccount, null, 2)
    if(signer1AccountField.value!=""){
      my_signers= {
          "Flags": 0,
          "TransactionType": "SignerListSet",
          "Account": my_wallet.address,
          "Fee": "12",
          "SignerQuorum": parseInt(signerQuorumField.value),
          "SignerEntries": [
            {"SignerEntry":
            {"Account": signer1AccountField.value,
            "SignerWeight": parseInt(signer1WeightField.value)
            }},
            {"SignerEntry":
            {"Account": signer2AccountField.value,
            "SignerWeight": parseInt(signer2WeightField.value)}
            },
            {"SignerEntry":
              {"Account": signer3AccountField.value,
              "SignerWeight": parseInt(signer3WeightField.value)
              }
            }
          ]
        }
      
      const preparedSigner = await client.autofill(my_signers)
      const signedSigner = my_wallet.sign(preparedSigner)
      const resultSigner = await client.submitAndWait(signedSigner.tx_blob)
      resultField.value += JSON.stringify(resultSigner, null, 2)
    }
  }
  client.disconnect()
  if(!document.getElementById("is").checked) {
    document.getElementById("issuer_additional_fields").style.display="none"
  }
  getAccountInfo()
} // End of configureAccount()

/*****************************************
 ************** Set Flag *****************
 *****************************************/

 async function setFlag(my_flag) {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let my_wallet = xrpl.Wallet.fromSeed(seedField.value)
  settings_tx = {
    "TransactionType": "AccountSet",
    "Account": my_wallet.address,
    "SetFlag": my_flag
  }
  resultField.value += '\nSetting flag ' + allFlags[my_flag] + "."
  const prepared = await client.autofill(settings_tx)
  const signed = my_wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    resultField.value += '\nAccount setting succeeded.'
  } else {
    throw `Error sending transaction: ${result}`
  }
  client.disconnect()
 } // End setFlag()

 /*****************************************
 ************* Clear Flag *****************
 *****************************************/

 async function clearFlag(my_flag) {
  let net = getNet()
  const client = new xrpl.Client(net)
  await client.connect()
  let my_wallet = xrpl.Wallet.fromSeed(seedField.value)
  settings_tx = {
    "TransactionType": "AccountSet",
    "Account": my_wallet.address,
    "ClearFlag": my_flag
  }
 resultField.value += '\nClearing flag ' + allFlags[my_flag] + "."
  const prepared = await client.autofill(settings_tx)
  const signed = my_wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob) 
  if (result.result.meta.TransactionResult == "tesSUCCESS") {
    results += '\nAccount setting succeeded.'
  } else {
    throw `Error sending transaction: ${result}`
  } 
  client.disconnect()
}

 /*****************************************
 ************* Set Issuer *****************
 *****************************************/

 function setIssuer() {
  document.getElementById("defaultRipple").checked = true
  document.getElementById("allowTrustLineClawback").checked = false
  document.getElementById("depositAuth").checked = true
  document.getElementById("disableMasterKey").checked = false
  document.getElementById("disallowIncomingCheck").checked = true
  document.getElementById("disallowIncomingNFTokenOffer").checked = true
  document.getElementById("disallowIncomingPayChan").checked = true
  document.getElementById("disallowIncomingTrustline").checked = false
  document.getElementById("disallowIncomingXRP").checked = true
  document.getElementById("globalFreeze").checked = false
  document.getElementById("noFreeze").checked = false
  document.getElementById("requireAuthorization").checked = false
  document.getElementById("requireDestinationTag").checked = false
  document.getElementById("account_flags").style.display="block"
  document.getElementById("issuer_additional_fields").style.display="block"
}

 /*****************************************
 *********** Set Exchanger ****************
 *****************************************/

 function setExchanger() {
  document.getElementById("defaultRipple").checked = true
  document.getElementById("allowTrustLineClawback").checked = false
  document.getElementById("depositAuth").checked = false
  document.getElementById("disableMasterKey").checked = false
  document.getElementById("disallowIncomingCheck").checked = false
  document.getElementById("disallowIncomingNFTokenOffer").checked = true
  document.getElementById("disallowIncomingPayChan").checked = true
  document.getElementById("disallowIncomingTrustline").checked = false
  document.getElementById("disallowIncomingXRP").checked = false
  document.getElementById("globalFreeze").checked = false
  document.getElementById("noFreeze").checked = false
  document.getElementById("requireAuthorization").checked = false
  document.getElementById("requireDestinationTag").checked = true
  document.getElementById("account_flags").style.display="block"
  document.getElementById("issuer_additional_fields").style.display="none"
  document.getElementById("domainField").value = ""
  document.getElementById("transferRateField").value = ""
  document.getElementById("tickSizeField").value = ""
}

 /*****************************************
 ************* Set Holder *****************
 *****************************************/

 function setHolder()
 {
  document.getElementById("defaultRipple").checked = false
  document.getElementById("allowTrustLineClawback").checked = false
  document.getElementById("depositAuth").checked = false
  document.getElementById("disableMasterKey").checked = false
  document.getElementById("disallowIncomingCheck").checked = false
  document.getElementById("disallowIncomingNFTokenOffer").checked = false
  document.getElementById("disallowIncomingPayChan").checked = false
  document.getElementById("disallowIncomingTrustline").checked = false
  document.getElementById("disallowIncomingXRP").checked = false
  document.getElementById("globalFreeze").checked = false
  document.getElementById("noFreeze").checked = false
  document.getElementById("requireAuthorization").checked = false
  document.getElementById("requireDestinationTag").checked = false
  document.getElementById("domainField").value = ""
  document.getElementById("transferRateField").value = ""
  document.getElementById("tickSizeField").value = ""
  document.getElementById("issuer_additional_fields").style.display="none"
}

 /*****************************************
 ************* Remove Signers *************
 *****************************************/

async function removeSigners() {
  let net = getNet()
  const client = new xrpl.Client(net)
  resultField.value = `Connecting to ${net}.`
  await client.connect()
  my_wallet = xrpl.Wallet.fromSeed(seedField.value)

  signer1AccountField.value = ""
  signer2AccountField.value = ""
  signer3AccountField.value = ""
  signer1WeightField.value = ""
  signer2WeightField.value= ""
  signer3WeightField.value = ""
  signerQuorumField.value = ""
  my_signers= {
    "Flags": 0,
    "TransactionType": "SignerListSet",
    "Account": my_wallet.address,
    "Fee": "12",
    "SignerQuorum": 0
  }
const preparedSigner = await client.autofill(my_signers)
const signedSigner = my_wallet.sign(preparedSigner)
const resultSigner = await client.submitAndWait(signedSigner.tx_blob)
resultField.value += JSON.stringify(resultSigner, null, 2)
client.disconnect()
}
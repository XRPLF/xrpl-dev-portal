---
seo:
    description: Common configurations for an XRP Ledger account.
labels:
  - Accounts
  - Configuration
---
# Configuring Accounts

There are three basic account configurations on the XRP Ledger.

- [Holder](#holder)
- [Exchanger](#exchanger)
- [Issuer](#issuer)

Each of these accounts has different operational and security requirements for their function. You can start by configuring special behaviors that support the use case for each.

You can use the [Account Configurator](#using-the-account-configurator) to create new accounts on Testnet or Devnet and try out different permissions and configurations. You can also get information about accounts on Mainnet and see their real-time settings.

## Holder

To configure an account that is essentially going to hold and spend value on the XRPL, you can use the default settings that come with a new account. No special configuration is required.

[![Account Configurator Holder Settings](../../img/cpt-account-configurator1.png)](../../img/cpt-account-configurator1.png)

## Exchanger

If the primary purpose of an account is to facilitate exchange of value between third parties, you will likely start with these four settings:

| Flag | Description |
|------|-------------|
| `defaultRipple` | Allow rippling on trust lines by default. Rippling is necessary in order for accounts to trade tokens you exchange with third-party accounts. See [Rippling](../tokens/fungible-tokens/rippling.md). |
| `disallowIncomingNFTokenOffer` | Prevent other accounts from sending NFT buy or sell offers to this account. This avoids unsolicited offers unrelated to the primary purpose of the exchanger account. See [Trading NFTs](../tokens/nfts/trading.md). |
| `disallowIncomingPayChan` | Prevent other accounts from creating payment channels to this account. While you might want to create payment channels to other accounts yourself, you typically wouldn't want other accounts to create a payment channel to an exchange account. See [Payment Channels](../payment-types/payment-channels.md). |
| `requireDestinationTag` | Require that all incoming payments have a destination tag. Destination tags provide a more lightweight mechanism for sending payments to a specific customer at a general receiver account. See [Source and Destination Tags](../transactions/source-and-destination-tags.md). |

[![Account Configurator Exchanger Settings](../../img/cpt-account-configurator2.png)](../../img/cpt-account-configurator2.png)

## Issuer

An account intended for issuing tokens requires configuration of both fields and flags in the `Account` object.

### Issuer Fields

| Field | Description |
|-------|-------------|
| `Domain` | The domain is the URL to the server where you serve the xrp-ledger.toml file. It is recommended that you serve a human-readable website from the same domain as the `xrp-ledger.toml` file. The website can provide further information about your identity and how you use the XRP Ledger, which helps to build trust toward you and your services. See [Domain](../../references/xrp-ledger-toml.md). |
| `TransferRate` | The `TransferRate` value specifies a fee to charge whenever counterparties transfer the currency you issue. The value is sent in 1 billion units. For example, 1200000000 represents a transfer fee of 20%. Note that the values _0_ and _1000000000_ represent the default (no fee); if you explicitly set either value, the value is not stored, but assumed. See [Transfer Fees](../tokens/fungible-tokens/transfer-fees.md). |
| `TickSize` | The `TickSize` value truncates the number of significant digits in the exchange rate of an offer when it gets placed in an order book. See [TickSize](../tokens/decentralized-exchange/ticksize.md). |

### Signers

Multi-signing in the XRP Ledger is a method of authorizing transactions by using a combination of multiple secret keys. You create a list of signer accounts. Each signer account has a weight that represents its relative authority. The signer quorum represents the minimum weight total required to authorize a transaction. For example, if Ashad and Betty each have a signer weight of 1, Ceresia has a signer weight of 2, and the signer quorum is 3, Ashad and Ceresia can approve a transaction (weight total of 3), Betty and Ceresia can approve a transaction (weight total of 3), but Ashad and Betty cannot approve a transaction on their own (their combined signer weight is 2, 1 less than the required signer weight). See [Multi-Signing](./multi-signing.md).

### Issuer Flags

| Flag | Description |
|------|-------------|
| `defaultRipple` | Allow rippling on trust lines by default. Rippling is necessary in order for accounts to trade tokens you issue through this account. See [Rippling](../tokens/fungible-tokens/rippling.md). |
| `depositAuth` | Deposit Authorization prevents unauthorized third parties from sending you payments. See [Deposit Authorization](./depositauth.md).
| `disallowIncomingCheck` | Prevent other accounts from sending checks to this account. See [Checks](../payment-types/checks.md).
| `disallowIncomingNFTokenOffer` | Prevent other accounts from sending NFT buy or sell offers to this account. This avoids unsolicited offers unrelated to the primary purpose of the exchanger account. See [Trading NFTs](../tokens/nfts/trading.md). |
| `disallowIncomingPayChan` | Prevent other accounts from creating payment channels to this account. While you might want to create payment channels to other accounts yourself, you typically wouldn't want other accounts to create a payment channel to an exchange account. See [Payment Channels](../payment-types/payment-channels.md). |
| `disallowIncomingXRP` | Prevent other accounts from sending XRP to this account. (This is advisory, and not enforced by the protocol). See [Direct XRP Payments](../payment-types/direct-xrp-payments.md). |

[![Account Configurator Issuer Settings](../../img/cpt-account-configurator3.png)](../../img/cpt-account-configurator3.png)

## Other Configuration Flags

All of the configuration flags can be helpful for specific use cases. The following are the account configuration flags not used in the standard Holder, Exchanger, and Issuer configurations.

| Flag | Description |
|------|-------------|
| `allowTrustLineClawback` | Allow account to claw back tokens it has issued. See [Clawing Back Tokens](../tokens/fungible-tokens/clawing-back-tokens.md). |
| `disableMasterKey` | Disallow use of the master key pair. Can only be enabled if the account has configured another way to sign transactions, such as a regular key or a signer list. See [Master Key Pair](./cryptographic-keys.md#master-key-pair). |
| `disallowIncomingTrustLine` | Block incoming trust lines. See [Trust Lines](../tokens/fungible-tokens/index.md#trust-lines). |
| `globalFreeze` | Freeze all tokens issued by this account. See [Global Freeze](../tokens/fungible-tokens/freezes.md#global-freeze).
| `noFreeze` | Permanently remove the ability to freeze individual trust lines or end a global freeze. See [Freezing Tokens](../tokens/fungible-tokens/freezes.md). |
| `requireAuthorization` | Requires authorized trust lines for other accounts to hold tokens issued by this account. See [Authorized Trust Lines](../tokens/fungible-tokens/authorized-trust-lines.md).

## Using the Account Configurator

You can download a copy of the [Account Configurator](../../../_code-samples/account-configurator/js/account-configurator.zip) from the `_code_samples` directory.

Expand the archive and open `account_configurator.html` in a browser window.

<!--
You can also use the form embedded here.
<!-- Account Configurator Form - - >
<div class="container">
<link href='https://fonts.googleapis.com/css?family=Work Sans' rel='stylesheet'>
<script src='https://unpkg.com/xrpl@4.1.0/build/xrpl-latest.js'></script> 
<script>
    if (typeof module !== "undefined") {
      const xrpl = require('xrpl')
    }
</script>
<script>
   document.addEventListener("DOMContentLoaded", function() {
      getNewAccountButton.addEventListener("click", getAccount)
      getAccountFromSeedButton.addEventListener("click", getAccountFromSeed)
      getAccountInfoButton.addEventListener("click", getAccountInfo)
      configureAccountButton.addEventListener("click", configureAccount)
      removeSignersButton.addEventListener("click", removeSigners)
   })
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
  getNewAccountButton.addEventListener("click", getAccount)
  getAccountFromSeedButton.addEventListener("click", getAccountFromSeed)
  hd.addEventListener("click", setHolder)
  ex.addEventListener("click", setExchanger)
  is.addEventListener("click", setIssuer)
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
  accountField.value="Getting new account..."
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
  results += '\nAccount created.'
  resultField.value = results
  client.disconnect()
  getAccountInfo()
} // End of getAccount()
// *******************************************************
// ************ Get Account from Seed ******************** 
// *******************************************************
async function getAccountFromSeed() {
    accountField.value="Getting account from a seed..."
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
  } catch (error) { }
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
  document.getElementById("domainField").value = ""
  document.getElementById("transferRateField").value = ""
  document.getElementById("tickSizeField").value = ""
}
 /*****************************************
 ************* Set Holder *****************
 *****************************************/
 function setHolder() {
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
</script> -->
<!-- ************************************************************** -->
<!-- ********************** The Form ****************************** -->
<!-- ************************************************************** -->
<!--
<div class="container">
  <h3>Account Configurator</h3>
  <div class="form-group" id="theForm">
      <div class="row">
         <div class="col align-self-start">
            <h5>Choose your ledger instance</h5>
         </div>
      </div>
      <div class="row">
         <div class="col align-self-start">
               <input type="radio" id="mn" name="server" value="wss://xrplcluster.com">
               <label for="mn">Mainnet</label>
         </div>
         <div class="col align-self-start">
               <input type="radio" id="tn" name="server" value="wss://s.altnet.rippletest.net:51233">
               <label for="tn">Testnet</label>
                     </div>
         <div class="col align-self-start">
               <input type="radio" id="dn" name="server" value="wss://s.devnet.rippletest.net:51233" checked>
               <label for="dn">Devnet</label>
         </div>
      </div>
      <div class="row">
         <div class="col align-right">
            <label for="accountField">Account</label>
         </div>
         <div class="col align-self-start">
            <input type="text" id="accountField" size="40"></input><br/>
         </div>
      </div>
      <div class="row">
         <div class="col align-right">
            <label for="seedField">Seed</label>
         </div>
         <div class="col align-self-start">
            <input type="text" id="seedField" size="40"></input>
         </div>
      </div>
      <br/>
      <div class="row">
         <div class="col align-self-start">
            <button type="button" id="getNewAccountButton" class="btn btn-primary">Get New Account</button>
         </div>
         <div class="col align-self-start">
            <button type="button" id="getAccountFromSeedButton" class="btn btn-primary">Get Account From Seed</button>
         </div>
         <div class="col-align-self-center">
            <button type="button" id="getAccountInfoButton" class="btn btn-primary">Get Account Info</button>
         </div>
      </div>
      <div class="row">
         <div class="col-align-self-start">
            <h5>Account Configuration Templates</h5>
         </div>
      </div>
      <div class="row">
         <div class="col align-self-start">
            <input type="radio" id="hd" name="accountType" value="hd">
            <label for="hd">Holder</label>
         </div>
         <div class="col align-self-start">
            <input type="radio" id="ex" name="accountType" value="ex">
            <label for="ex">Exchanger</label>
         </div>
         <div class="col align-self-start">
            <input type="radio" id="is" name="accountType" value="is">
            <label for="issuer">Issuer</label>
         </div>
      </div>
   <div class="row">
      <div class="col align-right">
         <label for="domainField">Domain</label>
      </div>
      <div class="col align-self-start">
         <input type="text" id="domainField" size="40"></input>
      </div>
   </div>
   <div class="row">
      <div class="col align-right">
         <label for="transferRateField">Transfer Rate</label>
      </div>
      <div class="col align-self-start">
         <input type="text" id="transferRateField" size="40"></input>
      </div>
   </div>
   <div class="row">
      <div class="col align-right">
         <label for="tickSizeField">Tick Size</label>
      </div>
      <div class="col align-self-start">
         <input type="text" id="tickSizeField" size="40"></input>
      </div>
   </div>
   <div class="row">
      <div class="col align-self-start"><button type="button" id="removeSignersButton" class="btn btn-primary">Remove Signers</button>
         <br/><br/>
      </div>
   </div>
   <div>
      <div class="row">
         <div class="col align-right"><label for="signer1AccountField">Signer1 Account</label>
         </div>
         <div class="col align-self-start"><input type="text" id="signer1AccountField" size="40"></input>
         </div>
         <div class="col align-right"><label for="signer1WeightField">Signer1 Weight</label>
         </div>
         <div class="col align-right"><input type="text"  id="signer1WeightField" size="5"></input>
          </div>
      </div>
      <div class="row">
         <div class="col align-right"><label for="signer2AccountField">Signer2 Account</label>
         </div>
         <div class="col align-self-start"><input type="text" id="signer2AccountField" size="40"></input>
         </div>
         <div class="col align-right"><label for="signer2WeightField">Signer2 Weight</label>
         </div>
         <div class="col align-right"><input type="text" id="signer2WeightField" size="5"></input>
          </div>
      </div>
      <div class="row">
         <div class="col align-right"><label for="signer3AccountField">Signer3 Account</label>
         </div>
         <div class="col align-self-start"><input type="text" id="signer3AccountField" size="40"></input>
         </div>
         <div class="col align-right"><label for="signer3WeightField">Signer3 Weight</label>
         </div>
         <div class="col align-right"><input type="text" id="signer3WeightField" size="5"></input>
          </div>
      </div>
      <div class="row">
         <div class="col align-self-start">
            <label for="signerQuorumField">Signer Quorum</label>
         </div>
         <div class="col align-right">
            <input type="text" id="signerQuorumField" size="5"></input>
         </div>
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="defaultRipple">defaultRipple</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="defaultRipple">
      </div>
    </div>
    <div class="row">
        <div class="col align-self-start">
          <label for="allowTrustLineClawback">allowTrustLineClawback</label>
        </div>
        <div class="col align-self-start">
                <input type="checkbox" id="allowTrustLineClawback">
        </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="depositAuth">depositAuth</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="depositAuth">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="disableMasterKey">disableMasterKey</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="disableMasterKey">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="disallowIncomingCheck">disallowIncomingCheck</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="disallowIncomingCheck">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="disallowIncomingNFTokenOffer">disallowIncomingNFTokenOffer</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="disallowIncomingNFTokenOffer">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="disallowIncomingPayChan">disallowIncomingPayChan</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="disallowIncomingPayChan">
      </div>
    </div> 
    <div class="row">
      <div class="col align-self-start">
         <label for="disallowIncomingTrustline">disallowIncomingTrustline</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="disallowIncomingTrustline">
      </div>
    </div>  
    <div class="row">
      <div class="col align-self-start">
         <label for="disallowIncomingXRP">disallowIncomingXRP</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="disallowIncomingXRP">
      </div>
    </div> 
    <div class="row">
      <div class="col align-self-start">
         <label for="globalFreeze">globalFreeze</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="globalFreeze">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="noFreeze">noFreeze</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="noFreeze">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="requireAuthorization">requireAuthorization</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="requireAuthorization">
      </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
         <label for="requireDestinationTag">requireDestinationTag</label>
      </div>
      <div class="col align-self-start">
              <input type="checkbox" id="requireDestinationTag">
      </div>
    </div>
    <div class="row">
        <div class="col align-self-start">
            <button type="button" id="configureAccountButton" class="btn btn-primary">Configure Account</button>
        </div>
    </div>
    <div class="row">
      <div class="col align-self-start">
        <textarea class="form-control" id="resultField" cols="80" rows="15"></textarea>
      </div>
    </div>
  </div>
</div>
</div>
<!-- End of Account Configurator Form -->


### Getting Account Information

You can use the Account Configurator to view information about accounts on Mainnet, Testnet, and Devnet.

To get Account information:

1. Choose the account's ledger instance (_Mainnet_, _Testnet_ or _Devnet_).
2. Enter the account number in the **Account** field.
3. Click **Get Account Info**.

The response is displayed in the **Results** field.

[![Account Configurator Get Account Info Results](../../img/cpt-account-configurator6.png)](../../img/cpt-account-configurator6.png)

### Getting a New Account

You can create sandbox accounts on _Testnet_ or _Devnet_. To create an account on _Mainnet_, see [Creating Accounts](../accounts/index.md#creating-accounts).

To get a new Account:

1. Choose the account's ledger instance (_Testnet_ or _Devnet_).
2. Click **Get New Account**.

Be sure to capture the **Seed** value for your new account so that you can easily retrieve it.

### Getting an Account from Its Seed

You can reload information for an existing account based on its seed value.

To get an account from its seed:

1. Choose the account's ledger instance (_Testnet_ or _Devnet_).
2. Enter the value in the **Seed** field.
3. Click **Get Account From Seed**.

[![Account Configurator Get Account from Seed](../../img/cpt-account-configurator7.png)](../../img/cpt-account-configurator7.png)

### Configuring a Holder Account

A Holder account requires no configuration (default settings). If the account previously had configuration changes, you can revert them and return the account to default status.

To configure a Holder account:

1. Choose the account's ledger instance (_Testnet_ or _Devnet_).
2. Click **Get New Account** or:
   1. Enter an existing seed value in the **Seed** field.
   2. Click **Get Account From Seed**.
3. Choose the _Holder_ **Account Configuration Template**.
4. Click **Configure Account**.

If the account has never been configured, the response in the **Results** field is identical to the original account information, less the nominal transaction fee.

[![Account Configurator Holder Results](../../img/cpt-account-configurator1.png)](../../img/cpt-account-configurator1.png)

### Configuring an Exchanger Account

The standard Exchanger account configuration requires only four flags.

To configure an Exchanger account:

1. Choose the account's ledger instance (_Testnet_ or _Devnet_).
2. Click **Get New Account** or: 
   1. Enter an existing seed value in the **Seed** field.
   2. Click **Get Account From Seed**.
3. Choose the _Exchanger_ **Account Configuration Template**.
   The configuration flag checkboxes update with the 4 standard configuration choices. You can choose more or fewer configuration settings to customize the account to your needs.
4. Click **Configure Account**.

[![Account Configurator Exchanger Results](../../img/cpt-account-configurator2.png)](../../img/cpt-account-configurator2.png)

### Configuring an Issuer Account

Configure an Issuer account by filling in additional fields and selecting flags that serve your needs.

To configure an Issuer account:

1. Choose the account's ledger instance (_Testnet_ or _Devnet_).
2. Click **Get New Account** or: 
   1. Enter an existing seed value in the **Seed** field.
   2. Click **Get Account From Seed**.
3. Choose the _Issuer_ **Account Configuration Template**.
   The configuration flag checkboxes update with the 6 standard configuration choices. You can choose more or fewer 
   configuration settings to customize the account to your needs.
4. Enter the **Domain**, a URL to the server where your `xrp-ledger.toml` resides. Note that you enter a human readable URL, which is converted to a hexidecimal string when you get the account information. If you want to reconfigure the account, you'll need to re-enter the **Domain** URL.
5. Enter the **Transfer Rate**, a percentage fee to charge whenever counterparties transfer the currency you issue.
6. Enter the **Tick Size**, which truncates the number of significant digits in the exchange.
7. If you choose to include signers, this example module requires that you add valid account IDs in **Signer1 Account**, **Signer2 Account**, and **Signer3 Account**, a **Signer Weight** for each, and a **Signer Quorum** value. 
8. Click **Configure Account**.

[![Account Configurator Issuer Results](../../img/cpt-account-configurator3.png)](../../img/cpt-account-configurator3.png)

### Removing Signers

Click **Remove Signers** to remove all signers for the current account.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

/// Create permissioned domain
async function createDomain() {

  let net = getNet()
  const client = new xrpl.Client(net)
  results = `\n\n===Creating Permissioned Domain===\n\nConnecting to ${getNet()} ...`
  updateResults()
  await client.connect()  
  results = `\n\nConnected.`
  updateResults()

  // Gather transaction info
  try {
    
    // Get account wallet from seed
    const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
    
    // Get Domain ID
    const domainID = domainIDField.value
    
    // Get credential type - convert string to hex if needed
    let credentialType = credentialTypeField.value;
    if (!/^[0-9A-F]+$/i.test(credentialType)) {
      let hex = '';
      for (let i = 0; i < credentialType.length; i++) {
        const charCode = credentialType.charCodeAt(i);
        const hexCharCode = charCode.toString(16).padStart(2, '0');
        hex += hexCharCode;
      }
      credentialType = hex.toUpperCase();
    }
    
    // Prepare transaction
    const transaction = {
      "TransactionType": "PermissionedDomainSet",
      "Account": wallet.address,
      "AcceptedCredentials": [
        {
          "Credential": {
            "Issuer": wallet.address,
            "CredentialType": credentialType
          }
        }
      ]
    }

    if (domainID) {
      transaction.DomainID = domainID
    }
    
    results = `\n\n===Preparing and Sending Transaction===\n\n${JSON.stringify(transaction, null, 2)}`
    updateResults()
    
    // Submit transaction
    const tx = await client.submitAndWait(transaction, {autofill: true, wallet: wallet})
    
    if (tx.result.meta.TransactionResult == "tesSUCCESS") {
      // Parse for domain info
      if (domainID) {
        results = `\n\n===Create Permissioned Domain Result===\n\n${JSON.stringify(tx.result.tx_json, null, 2)}`
      } else {
        const parsedResponse = JSON.parse(JSON.stringify(tx.result.meta.AffectedNodes, null, 2))
        const domainInfo = parsedResponse.find( node => node.CreatedNode && node.CreatedNode.LedgerEntryType === "PermissionedDomain" )
        results = `\n\n===Create Permissioned Domain Result===\n\n${JSON.stringify(domainInfo.CreatedNode, null, 2)}`
      }
    } else {
    results = `\n\n===Error===\n\n${JSON.stringify(tx.result.meta.TransactionResult, null, 2)}: Check codes at https://xrpl.org/docs/references/protocol/transactions/types/permissioneddomainset#error-cases`
    }
    updateResults()

    } catch (error) {
        results = `\n\n===Error===\n\n${error}`
        updateResults()
    }
  
  client.disconnect()
}
// End create permissioned domain


// Delete permissioned domain
async function deleteDomain() {

  let net = getNet()
  const client = new xrpl.Client(net)
  results = `\n\n===Delete Permissioned Domain===\n\nConnecting to ${getNet()} ...`
  updateResults()
  await client.connect()  
  results = `\n\nConnected.`
  updateResults()

  // Get delete domain transaction info
  try {
  
  // Get account wallet from seed
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  
  // Get Domain ID
  const domainID = domainIDField.value
  
  // Prepare transaction
  const transaction = {
    "TransactionType": "PermissionedDomainDelete",
    "Account": wallet.address,
    "DomainID": domainID
  }
 
  results = `\n\n===Preparing and Sending Transaction===\n\n${JSON.stringify(transaction, null, 2)}`
  updateResults()
  
  // Submit delete domain transaction
  const tx = await client.submitAndWait(transaction, {autofill: true, wallet: wallet})
  
  if (tx.result.meta.TransactionResult == "tesSUCCESS") {
    results = `\n\n===Delete Permissioned Domain Result===\n\nSuccessfully deleted the permissioned domain.`
  } else {
  results = `\n\n===Error===\n\n${JSON.stringify(tx.result.meta.TransactionResult, null, 2)}: Check codes at https://xrpl.org/docs/references/protocol/transactions/types/permissioneddomaindelete#error-cases`
  }
  updateResults()

  } catch (error) {
      results = `\n\n===Error===\n\n${error}`
      updateResults()
  }
  
  client.disconnect()
}

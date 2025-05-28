/// Create credential function
async function createCredential() {

  let net = getNet()
  const client = new xrpl.Client(net)
  results = `\n\n===Creating Credential===\n\nConnecting to ${getNet()} ...`
  updateResults()
  await client.connect()  
  results = `\n\nConnected.`
  updateResults()

  // Gather transaction info
  try {
  
  // Get account wallet from seed
  const wallet = xrpl.Wallet.fromSeed(accountSeedField.value)
  
  // Get subject
  const subject = subjectField.value
  
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
    "TransactionType": "CredentialCreate",
    "Account": wallet.address,
    "Subject": subject,
    "CredentialType": credentialType
  }
  
  results = `\n\n===Preparing and Sending Transaction===\n\n${JSON.stringify(transaction, null, 2)}`
  updateResults()
  
  // Submit transaction
  const tx = await client.submitAndWait(transaction, {autofill: true, wallet: wallet})
  
  if (tx.result.meta.TransactionResult == "tesSUCCESS") {
    // Parse for credential info
    const parsedResponse = JSON.parse(JSON.stringify(tx.result.meta.AffectedNodes, null, 2))
    const credentialInfo = parsedResponse.find( node => node.CreatedNode && node.CreatedNode.LedgerEntryType === "Credential" )
    results = `\n\n===Create Credential Result===\n\n${JSON.stringify(credentialInfo.CreatedNode, null, 2)}`
    } else {
    results = `\n\n===Error===\n\n${JSON.stringify(tx.result.meta.TransactionResult, null, 2)}: Check codes at https://xrpl.org/docs/references/protocol/transactions/types/credentialcreate#error-cases`
    }

  updateResults()

  } catch (error) {
      results = `\n\n===Error===\n\n${error}`
      updateResults()
  }
  
  client.disconnect()
}

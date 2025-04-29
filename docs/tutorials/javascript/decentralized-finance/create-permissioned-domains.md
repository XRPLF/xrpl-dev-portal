---
seo:
    description: Create a permissioned domain to restrict access to financial services that meet compliance requirements.
labels:
  - Decentralized Finance
  - Permissioned Domains
---
# Create Permissioned Domains

Permissioned domains are controlled environments within the broader ecosystem of the XRP Ledger blockchain. Domains restrict access to other features such as Permissioned DEXes and Lending Protocols, only allowing access to them for accounts with specific credentials.

This example shows how to:

1. Issue a credential to an account.
2. Create a permissioned domain with the issued credential.
3. Delete the permissioned domain.

[![Create Permissioned Domain Test Harness](/docs/img/create-permissioned-domain-1.png)](/docs/img/create-permissioned-domain-1.png)

Download the [Modular Tutorials](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/modular-tutorials/)<!-- {.github-code-download} --> folder.

{% admonition type="info" name="Note" %}
Without the Modular Tutorial Samples, you will not be able to try the examples that follow. 
{% /admonition %}

## Get Accounts

To get test accounts:

1. Open `create-permissioned-domains.html` in a browser.
2. Get test accounts.
    - If you copied the gathered information from another tutorial:
        1. Paste the gathered information to the **Result** field.
        2. Click **Distribute Account Info**.
    - If you have an existing account seed:
        1. Paste the account seed to the **Account 1 Seed** or **Account 2 Seed** field.
        2. Click **Get Account 1 from Seed** or **Get Account 2 from Seed**.
    - If you do not have existing accounts:
        1. Click **Get New Account 1**.
        2. Click **Get New Account 2**.

[![Created Accounts](/docs/img/create-permissioned-domain-2.png)](/docs/img/create-permissioned-domain-2.png)


## Issue a Credential

1. Click the **Account 1** radial button. This account will the credential issuer.
2. Copy the account 2 address into **Subject**.
3. Enter a **Credential Type**. For example, _KYC_.
4. Click **Create Credential**.

[![Created Credential](/docs/img/create-permissioned-domain-3.png)](/docs/img/create-permissioned-domain-3.png)


## Create a Permissioned Domain

1. Click **Create Permissioned Domain**.
2. Copy the _LedgerIndex_ value from the metadata response.
3. (Optional) Update the permissioned domain with a different credential.
   1. Change the **Credential Type**.
   2. Click **Create Credential**
   3. Copy the _LedgerIndex_ value into **DomainID**.
   4. Click **Create Permissioned Domain**.

[![Created Domain](/docs/img/create-permissioned-domain-4.png)](/docs/img/create-permissioned-domain-4.png)


## Delete a Permissioned Domain

1. Copy the _LedgerIndex_ value into **DomainID**.
2. Click **Delete Permissioned Domain**..

[![Deleted Domain](/docs/img/create-permissioned-domain-5.png)](/docs/img/create-permissioned-domain-5.png)



# Code Walkthrough

## credential-manager.js

### Create Credential

Define a function that issues a credential to a subject, converting strings to hex if necessary.

```javascript
async function createCredential() {

```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = `\n\n===Creating Credential===\n\nConnecting to ${getNet()} ...`
  updateResults()
  await client.connect()  
  results = `\n\nConnected.`
  updateResults()
```

Gather the issuer information, subject, and credential type. Convert the credential type value to a hex string if not already in hex. Wrap the code in a `try-catch` block to handle errors.

```javascript
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
```

Submit the `CredentialCreate` transaction and report the results. Parse the metadata response to return only relevant credential info.

```javascript
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
```


## permissioned-domain-manager.js

### Create Permissioned Domain

Define a function that creates a permissioned domain.

```javascript
async function createDomain() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = `\n\n===Creating Permissioned Domain===\n\nConnecting to ${getNet()} ...`
  updateResults()
  await client.connect()  
  results = `\n\nConnected.`
  updateResults()
```

Gather issuer information, credential type, and domain ID. Format the transaction depending on if the optional domain ID field is included. Wrap the code in a `try-catch` block to handle errors.

```javascript
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
```

Submit the `PermissionedDomainSet` transaction and report the results. The metadata is formed differently if a domain ID was included; parse the response accordingly.

```javascript
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
```

### Delete Permissioned Domain

Define a function to delete a permissioned domain.

```javascript
async function deleteDomain() {
```

Connect to the XRP Ledger.

```javascript
  let net = getNet()
  const client = new xrpl.Client(net)
  results = `\n\n===Delete Permissioned Domain===\n\nConnecting to ${getNet()} ...`
  updateResults()
  await client.connect()  
  results = `\n\nConnected.`
  updateResults()
```

Gather account information and domain ID values. Wrap the code in a `try-catch` block to handle errors.

```javascript
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
```

Submit the `PermissionedDomainDelete` transaction and report the results.

```javascript
  results = `\n\n===Preparing and Sending Transaction===\n\n${JSON.stringify(transaction, null, 2)}`
  updateResults()
  
  // Submit transaction
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
```

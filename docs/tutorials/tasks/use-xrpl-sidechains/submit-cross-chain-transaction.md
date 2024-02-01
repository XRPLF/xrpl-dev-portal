---
html: submit-cross-chain-transactions.html
parent: use-xrpl-sidechains.html
seo:
    description: Steps to submit a cross-chain transaction, using a bridge.
labels:
  - Interoperability
---
# Submit Cross-chain Transactions

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

This tutorial explains how to create a test account on a locking chain (_Devent_), and transfer XRP to an issuing chain (_Sidechain-Devnet_), using a supported [client library](../../../references/client-libraries.md) to query and submit transactions. Witness servers are already set up to monitor the XRP-XRP bridge and submit attestations.

## Prerequisites

- The locking and issuing chains are both up and running.
- The witness servers are up and running.
- Set up the XRP-XRP bridge.


## Steps

### 1. Connect to the locking chain (Devnet) and issuing chain (Sidechain-Devnet).

```javascript
const xrpl = require('xrpl')

const WS_URL_lockingchain = 'wss://s.devnet.rippletest.net:51233/' // Locking chain
const WS_URL_issuingchain = 'wss://sidechain-net2.devnet.rippletest.net:51233/' // Issuing chain

// Define the XChainBridge
const xchainbridge = {
  "LockingChainDoor": "rnQAXXWoFNN6PEqwqsdTngCtFPCrmfuqFJ", // Locking chain door account
  "LockingChainIssue": {
    "currency": "XRP"
  },
  "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", // Use the genesis address hardcoded in rippled
  "IssuingChainIssue": {
    "currency": "XRP"
  }
}

async function main() {
  // Define the network clients.
  const client_lockingchain = new xrpl.Client(WS_URL_lockingchain)
  await client_lockingchain.connect()

  const client_issuingchain = new xrpl.Client(WS_URL_issuingchain)
  await client_issuingchain.connect()

  // ... custom code goes here

  // Disconnect when done (If you omit this, Node.js won't end the process)
  await client_lockingchain.disconnect()
  await client_issuingchain.disconnect()
}

main()
```

### 2. Fund a wallet on Devnet and generate a wallet address for Sidechain-Devnet.

```javascript
  // Create a wallet and fund it using the XRP faucet on Devnet.
  const wallet_lockingchain = (await client_lockingchain.fundWallet()).wallet
  console.log(wallet_lockingchain.address)

  // Generate a wallet to create and fund on the issuing chain.
  const wallet_issuingchain = await xrpl.Wallet.generate()
  console.log(wallet_issuingchain.address)
```

### 3. Submit an `XChainAccountCreateCommit` transaction from the Devnet wallet.

```javascript
  const createwallet_issuingchain = await client_lockingchain.submitAndWait({
    "TransactionType": "XChainAccountCreateCommit",
    "Account": wallet_lockingchain.address,
    "Destination": wallet_issuingchain.address,
    "XChainBridge": xchainbridge,
    "SignatureReward": "100",
    "Amount": "5000000000"
  }, {autofill: true, wallet: wallet_lockingchain})
```

### 4. Create a claim ID with `XChainCreateClaimID`, using your account on the issuing chain.

```javascript
  const createclaim = await client_issuingchain.submitAndWait({
    "TransactionType": "XChainCreateClaimID",
    "Account": wallet_issuingchain.address,
    "OtherChainSource": wallet_lockingchain.address,
    "SignatureReward": "100",
    "XChainBridge": xchainbridge
  }, {autofill: true, wallet: wallet_issuingchain})
```

### 5. Retrieve the claim ID from the transaction metadata.

```javascript
  let metadata = createclaim.result.meta.AffectedNodes

  let claimnode = null;

  for (const item of metadata) {
    if (item.CreatedNode && item.CreatedNode.LedgerEntryType === 'XChainOwnedClaimID') {
      claimnode = item.CreatedNode
      break
    }
  }

  const claimID = claimnode.NewFields.XChainClaimID
```

### 6. Submit an `XChainCommit` transaction with the claim ID, using your account on the locking chain.

If you don't specify an "OtherChainDestination", the account that submitted the `XChainCreateClaimID` transaction needs to submit an `XChainClaim` transaction to claim the funds.

```javascript
  const xchaincommit = await client_lockingchain.submitAndWait({
    "TransactionType": "XChainCommit",
    "Account": wallet_lockingchain.address,
    "OtherChainDestination": wallet_issuingchain.address,
    "Amount": "10000",
    "XChainBridge": xchainbridge,
    "XChainClaimID": claimID
  }, {autofill: true, wallet: wallet_lockingchain})
```

**Note:** When enough `XChainAddClaimAttestation` signatures are submitted by the witness servers to reach quorum, the funds are released on the issuing chain to the `OtherChainDestination`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

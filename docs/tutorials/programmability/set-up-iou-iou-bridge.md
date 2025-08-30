---
html: set-up-iou-iou-bridge.html
parent: use-xrpl-sidechains.html
seo:
    description: Steps to set up an IOU-IOU bridge.
labels:
  - Interoperability
---
# Set Up an IOU-IOU Bridge

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

Setting up an IOU-IOU bridge enables you to move tokens between chains.

**Note**: The code samples on this page illustrate how to bridge a hypotethical "TST" token from *Devnet* to *Sidechain-Devnet*, using a supported [client library](/docs/references/client-libraries.md) to query and submit transactions.

## Prerequisites

- An XRP-XRP bridge must be set up between the locking and issuing chain.
- Ensure the witnesses' transaction submission accounts are funded on the locking and issuing chains.
- Set up an issuer on the issuing chain to mint and burn a wrapped version of the token you want to bridge. See: [Issue a Fungible Token](../use-tokens/issue-a-fungible-token.md)

## Steps

### 1. Connect to the locking chain (Devnet) and issuing chain (Sidechain-Devnet).

```javascript
const xrpl = require('xrpl')

const WS_URL_lockingchain = 'wss://s.devnet.rippletest.net:51233/' // Locking chain
const WS_URL_issuingchain = 'wss://sidechain-net2.devnet.rippletest.net:51233/' // Issuing chain

// Define the XChainBridge, using the "TST" token.
const xchainbridge = {
  "LockingChainDoor": "rn895gh1MHnnAgL4hR9q464PJSFiYwQYcV",
  "LockingChainIssue": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
  },
  "IssuingChainDoor": "ra1MsW5s6Qg4NXUAJVKw8f21ZghSYG1DQw", // Use the account issuing the wrapped token
  "IssuingChainIssue": {
    "currency": "TST",
    "issuer": "ra1MsW5s6Qg4NXUAJVKw8f21ZghSYG1DQw"
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

### 2. Submit an `XChainCreateBridge` transaction from the door account on the locking chain.

Don't include a `MinAccountCreateAmount` value.

```javascript
  const wallet_lockingchain = xrpl.Wallet.fromSeed('s████████████████████████████') // Locking chain door account
  const xchaincreatebridge_lockingchain = await client_lockingchain.submitAndWait({
    "TransactionType": "XChainCreateBridge",
    "Account": wallet_lockingchain.address,
    "XChainBridge": xchainbridge,
  "SignatureReward": 200
  }, {autofill: true, wallet: wallet_lockingchain})
```

### 3. Submit a `SignerListSet` transaction from the door account on the locking chain.

```javascript
  const signerlistset_lockingchain = await client_lockingchain.submitAndWait({
    "TransactionType": "SignerListSet",
    "Account": wallet_lockingchain.address,
    "Fee": "12",
    "SignerQuorum": 2,    
    // Use the witness servers' submitting accounts on the locking chain.
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
                "SignerWeight": 1
            }
        },
        {
            "SignerEntry": {
                "Account": "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v",
                "SignerWeight": 1
            }
        }
    ]
  }, {autofill: true, wallet: wallet_lockingchain})
```

### 4. Disable the master key on the locking chain's door account with an `AccountSet` transaction.

```javascript
const disablekey_lockingchain = await client_lockingchain.submitAndWait({
    "TransactionType": "AccountSet",
    "Account": wallet_lockingchain.address,
    "SetFlag": 4
  }, {autofill: true, wallet: wallet_lockingchain})
```

### 5. Submit an `XChainCreateBridge` transaction from the door account on the issuing chain.

Don't include a `MinAccountCreateAmount` value.

```javascript
  const wallet_issuingchain = xrpl.Wallet.fromSeed('s████████████████████████████') // The account issuing the wrapped token
  const xchaincreatebridge_issuingchain = await client_issuingchain.submitAndWait({
    "TransactionType": "XChainCreateBridge",
    "Account": wallet_issuingchain.address,
    "XChainBridge": xchainbridge,
  "SignatureReward": 200
  }, {autofill: true, wallet: wallet_issuingchain})
```

### 6. Submit a `SignerListSet` transaction from the door account on the issuing chain.

```javascript
  const signerlistset_issuingchain = await client_issuingchain.submitAndWait({
    "TransactionType": "SignerListSet",
    "Account": wallet_issuingchain.address,
    "Fee": "12",
    "SignerQuorum": 2,    
    // Use the witness servers' submitting accounts on the issuing chain.
    "SignerEntries": [
        {
            "SignerEntry": {
                "Account": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
                "SignerWeight": 1
            }
        },
        {
            "SignerEntry": {
                "Account": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd",
                "SignerWeight": 1
            }
        }
    ]
  }, {autofill: true, wallet: wallet_issuingchain})
```

### 7. Disable the master key on the issuing chain's door account with an `AccountSet` transaction.

```javascript
const disablekey_issuingchain = await client_issuingchain.submitAndWait({
    "TransactionType": "AccountSet",
    "Account": wallet_issuingchain.address,
    "SetFlag": 4
  }, {autofill: true, wallet: wallet_issuingchain})
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}

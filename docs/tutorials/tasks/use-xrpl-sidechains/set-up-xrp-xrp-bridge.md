---
html: set-up-xrp-xrp-bridge.html
parent: use-xrpl-sidechains.html
seo:
    description: Steps to create an XRP-XRP bridge with a new sidechain.
labels:
  - Interoperability
---
# Set Up an XRP-XRP Bridge

_(Requires the [XChainBridge amendment][] {% not-enabled /%})_

Setting up an XRP-XRP bridge enables you to move XRP between chains. The set up requires using the genesis account on the issuing chain as a door account to submit attestations and create transaction submission accounts for witnesses.

**Note**: The code samples on this page illustrate how a bridge was set up between *Devnet* and *Sidechain-Devnet*, using a supported [client library](/docs/references/client-libraries.md) to query and submit transactions. This bridge is already created, so the process can't be reproduced on these networks.


## Prerequisites

- The issuing chain is set up and active. Validators must be running and successfully closing ledgers.
- The witnesses' accounts on the locking chain are funded, so they can submit transactions.
- A door account for the bridge exists on the locking chain.


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

### 2. Submit an `XChainCreateBridge` transaction from the door account on the locking chain.

```javascript
  const wallet_lockingchain = xrpl.Wallet.fromSeed('s████████████████████████████') // Locking chain door account
  const xchaincreatebridge_lockingchain = await client_lockingchain.submitAndWait({
    "TransactionType": "XChainCreateBridge",
    "Account": wallet_lockingchain.address,
    "XChainBridge": xchainbridge,
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000 // This value should at least be equal to the account reserve on the issuing chain.
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

### 5. Submit an `XChainCreateBridge` transaction from the genesis account on the issuing chain.

```javascript
  const wallet_issuingchain = xrpl.Wallet.fromSeed('snoPBrXtMeMyMHUVTgbuqAfg1SUTb') // Use the genesis secret hardcoded in rippled.
  const xchaincreatebridge_issuingchain = await client_issuingchain.submitAndWait({
    "TransactionType": "XChainCreateBridge",
    "Account": wallet_issuingchain.address,
    "XChainBridge": xchainbridge,
  "SignatureReward": 200,
  "MinAccountCreateAmount": 1000000
  }, {autofill: true, wallet: wallet_issuingchain})
```

### 6. Submit `XChainAccountCreateCommit` transactions from the witnesses' locking chain accounts to create corresponding accounts on the issuing chain.

```javascript
  const wallet_witness_1 = xrpl.Wallet.fromSeed('s████████████████████████████') // Witness server 1 from `SignerListSet`: rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW
  const wallet_witness_2 = xrpl.Wallet.fromSeed('s████████████████████████████') // Witness server 2 from `SignerListSet`: rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v

  const xchainaccountcreatecommit_witness_1 = await client_lockingchain.submitAndWait({
    "TransactionType": "XChainAccountCreateCommit",
    "Account": wallet_witness_1.address,
    "Destination": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo", // The account to create and fund for witness 1 on the issuing chain.
    "TransactionType": "XChainAccountCreateCommit",
    "Amount": "20000000",
    "SignatureReward": "100",
    "XChainBridge": xchainbridge
  }, {autofill: true, wallet: wallet_witness_1})

    const xchainaccountcreatecommit_witness_2 = await client_lockingchain.submitAndWait({
    "TransactionType": "XChainAccountCreateCommit",
    "Account": wallet_witness_2.address,
    "Destination": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd", // The account to create and fund for witness 2 on the issuing chain.
    "TransactionType": "XChainAccountCreateCommit",
    "Amount": "20000000",
    "SignatureReward": "100",
    "XChainBridge": xchainbridged
  }, {autofill: true, wallet: wallet_witness_1})
```

### 7. Submit attestations for each `XChainAccountCreateCommit` transaction.

Use the `XChainAddAccountCreateAttestation` transaction to submit each attestation on the issuing chain. Sign these transactions with the genesis account on the issuing chain.

```javascript
  // Witness 1 attestation
  const xchainaddaccountcreateattestation_witness_1 = await client_issuingchain.submitAndWait({
    "TransactionType": "XChainAddAccountCreateAttestation",
    "Account": wallet_issuingchain.address,
    "OtherChainSource": wallet_witness_1.address,
    "Destination": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
    "Amount": "2000000000",
    "PublicKey": wallet_witness_1.publicKey,
    "Signature": xchainaccountcreatecommit_witness_1.result.TxnSignature,
    "WasLockingChainSend": 1,
    "AttestationRewardAccount": "rD323VyRjgzzhY4bFpo44rmyh2neB5d8Mo",
    "AttestationSignerAccount": wallet_witness_1.address,
    "XChainAccountCreateCount": "1",
    "SignatureReward": "204",
    "XChainBridge": xchainbridge,
    "Fee": "20"
  }, {autofill: true, wallet: wallet_issuingchain})

  // Witness 2 attestation
    const xchainaddaccountcreateattestation_witness_2 = await client_issuingchain.submitAndWait({
    "TransactionType": "XChainAddAccountCreateAttestation",
    "Account": wallet_issuingchain.address,
    "OtherChainSource": wallet_witness_2.address,
    "Destination": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd",
    "Amount": "2000000000",
    "PublicKey": wallet_witness_2.publicKey,
    "Signature": xchainaccountcreatecommit_witness_2.result.TxnSignature,
    "WasLockingChainSend": 1,
    "AttestationRewardAccount": "rJMfWNVbyjcCtds8kpoEjEbYQ41J5B6MUd",
    "AttestationSignerAccount": wallet_witness_2.address,
    "XChainAccountCreateCount": "1",
    "SignatureReward": "204",
    "XChainBridge": xchainbridge,
    "Fee": "20"
  }, {autofill: true, wallet: wallet_issuingchain})
```

### 8. Submit a `SignerListSet` transaction from the genesis account on the issuing chain.

```javascript
  const signerlistset_issuingchain = await client_issuingchain.submitAndWait({
    "TransactionType": "SignerListSet",
    "Account": wallet_issuingchain.address,
    "Fee": "12",
    "SignerQuorum": 2,    
    // Use the witness servers' submitting accounts on the issuing chain created in step 7
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

### 9. Disable the master key on the issuing chain's genesis account with an `AccountSet` transaction.

```javascript
const disablekey_issuingchain = await client_issuingchain.submitAndWait({
    "TransactionType": "AccountSet",
    "Account": wallet_issuingchain.address,
    "SetFlag": 4
  }, {autofill: true, wallet: wallet_issuingchain})
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}

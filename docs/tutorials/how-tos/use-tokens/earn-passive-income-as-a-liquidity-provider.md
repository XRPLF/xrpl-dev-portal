---
parent: use-tokens.html
seo:
    description: Provide liquidity for an Automated Market Maker (AMM) and earn income from trading fees.
embed_xrpl_js: true
status: not_enabled
filters:
  - interactive_steps
labels:
  - Decentralized Exchange
  - Tokens
  - AMM
steps: ['Connect', 'Generate', 'Acquire tokens', 'Deposit to the AMM', 'Vote on fees', 'Withdraw from the AMM']
---
# Earn Passive Income as a Liquidity Provider

_(Requires the [AMM amendment][])_

Providing liquidity for an [Automated Market Maker (AMM)](../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) can be a great way to earn passive income. By depositing assets into an AMM pool, you'll earn a percentage of the trading fees generated. This tutorial shows how to deposit assets, vote on fees, and withdraw assets.


## Prerequisites

- You must have an XRP Ledger address and some XRP. This tutorial will use a funded address generated from the `Testnet` [Faucet](/resources/dev-tools/xrp-faucets).
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/) **version 2.11.0 or later**. See [Get Started Using JavaScript](../../javascript/build-apps/get-started.md) for setup steps.
    - You can also read along and use the interactive steps in your browser without any setup.
- You should have a basic understanding of how [tokens](../../../concepts/tokens/index.md) work in the XRP Ledger.
- You may want to read about [Automated Market Makers in the XRP Ledger](../../../concepts/tokens/decentralized-exchange/automated-market-makers.md) first.
- This tutorial uses a pre-existing `XRP/TST` AMM pool on `Testnet`.

      currency: "TST",
      issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",

Offers for XRP at a rate of 10 XRP ≈ 1 TST (+15% fee each way)


## Example Code

Complete sample code for all of the steps of these tutorials is available under the [MIT license](https://github.com/XRPLF/xrpl-dev-portal/blob/master/LICENSE).

- See [Code Samples: Create an AMM](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/create-amm/) in the source repository for this website.


## Steps

### 1. Connect to the network

```javascript
const xrpl = require('xrpl')

const WS_URL = 'wss://s.devnet.rippletest.net:51233/'
const EXPLORER = 'devnet.xrpl.org' // Optional, for linking

async function main() {
  // Define the network client
  const client = new xrpl.Client(WS_URL)
  await client.connect()

  // ... custom code goes here

  // Disconnect when done (If you omit this, Node.js won't end the process)
  await client.disconnect()
}

main()
```


### 2. Generate credentials

```javascript
// Get an address funded with XRP from the Faucet -------------------------------------------
console.log("Requesting address from the faucet...")
const wallet = (await client.fundWallet()).wallet

// To use an existing account, use code such as the following:
// const wallet = xrpl.Wallet.fromSeed(process.env['USE_SEED'])
```


### 3. Acquire TST tokens

```javascript
const offer = {
  "TransactionType": "OfferCreate",
  "Account": wallet.address,
  "TakerPays": {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "5"
  },
  // Drops calculation is (amount to buy * price per token * amm trading fees)
  "TakerGets": xrpl.xrpToDrops(57.5)
}

const prepared_offer = await client.autofill(offer)
console.log("Prepared transaction:", JSON.stringify(prepared_offer, null, 2))
const signed_offer = wallet.sign(prepared_offer)
console.log("Sending OfferCreate transaction...")
const result_offer = await client.submitAndWait(signed_offer.tx_blob)
console.log(result_offer)
if (result_offer.result.meta.TransactionResult == "tesSUCCESS") {
  console.log(`Transaction succeeded:
    https://${EXPLORER}/transactions/${signed_offer.hash}`)
} else {
  throw `Error sending transaction: ${result_offer}`
}
```


### 4. Deposit assets to the AMM

You can contribute either one or both assets to an AMM pool. Contributing just one asset can be easier, but incurs a fee that is debited from the LP Tokens paid out. If you contribute both assets in the pool, you aren't charged a fee.

```javascript
console.log("------- Put more assets into the AMM -------")
  
const ammdeposit = {
  "TransactionType": "AMMDeposit",
  "Asset": {
    currency: "XRP"
  },
  "Asset2": {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
  },
  "Account": wallet.address,
  // Drops calculation is (amount to deposit * price per token)
  "Amount": xrpl.xrpToDrops(10),
  "Amount2": {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "1"
  },
  "Flags": 0x00100000
}

const prepared_deposit = await client.autofill(ammdeposit)
console.log("Prepared transaction:", JSON.stringify(prepared_deposit, null, 2))
const signed_deposit = wallet.sign(prepared_deposit)
console.log(`Sending AMMDeposit transaction ...`)
const lp_deposit = await client.submitAndWait(signed_deposit.tx_blob)
console.log(lp_deposit)

if (lp_deposit.result.meta.TransactionResult == "tesSUCCESS") {
  console.log(`Transaction succeeded:
    https://${EXPLORER}/transactions/${signed_deposit.hash}`)
} else {
  throw `Error sending transaction: ${lp_deposit}`
}
```


### 5. Vote on trading fees

This step isn't required, but you're encouraged to submit a vote for a fee structure you believe makes sense.

```javascript
console.log("------- Vote for a 0.6% trading fee -------")
  
const ammvote = {
  "TransactionType": "AMMVote",
  "Asset": {
    "currency": "XRP"
  },
  "Asset2": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
  },
  "Account": wallet.address,
  "TradingFee": 600
}

const prepared_vote = await client.autofill(ammvote)
console.log("Prepared transaction:", JSON.stringify(prepared_vote, null, 2))
const signed_vote = wallet.sign(prepared_vote)
console.log(`Sending AMMVote transaction ...`)
const response_vote = await client.submitAndWait(signed_vote.tx_blob)
if (response_vote.result.meta.TransactionResult == "tesSUCCESS") {
  console.log(`Transaction succeeded:
    https://${EXPLORER}/transactions/${signed_vote.hash}`)
} else {
  console.error("Error sending transaction:", response_vote)
}
```


### 6. Withdraw assets from the AMM

Similar to depositing assets, you can withdraw either one or both assets from the AMM pool. Withdrawing a single asset incurs a fee, while withdrawing both does not. When you withdraw by redeeming LP Tokens, you are paid out in both assets.

```javascript
console.log("------- Pull some money out of AMM -------")
  
// Withdraw by redeeming LP tokens.
const ammwithdraw = {
  "TransactionType": "AMMWithdraw",
  "Asset": {
    "currency": "XRP"
  },
  "Asset2": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
  },
  "Account": wallet.address,
  "LPTokenIn": {
    currency: "039C99CD9AB0B70B32ECDA51EAAE471625608EA2",
    issuer: "rhQWjbT5CQJ2fgHKn6FjRrYbGPKmoS3EhD",
    value: "2940"
  },
  "Flags": 0x00010000
}

const prepared_withdraw = await client.autofill(ammwithdraw)
console.log("Prepared transaction:", JSON.stringify(prepared_withdraw, null, 2))
const signed_withdraw = wallet.sign(prepared_withdraw)
console.log(`Sending AMMWithdraw transaction ...`)
const response_withdraw = await client.submitAndWait(signed_withdraw.tx_blob)

if (response_withdraw.result.meta.TransactionResult == "tesSUCCESS") {
  console.log(`Transaction succeeded:
    https://${EXPLORER}/transactions/${signed_withdraw.hash}`)
} else {
  console.error("Error sending transaction:", response_withdraw)
}
```
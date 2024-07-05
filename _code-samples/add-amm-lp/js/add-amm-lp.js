const xrpl = require('xrpl')

const WS_URL = 'wss://s.altnet.rippletest.net:51233/'
const EXPLORER = 'testnet.xrpl.org' // Optional, for linking

async function main() {

// Define the network client
const client = new xrpl.Client(WS_URL)
await client.connect()

// Get an address funded with XRP from the Faucet
console.log("Requesting address from the faucet...")
const wallet = (await client.fundWallet()).wallet

// To use an existing account, use code such as the following:
// const wallet = xrpl.Wallet.fromSeed(process.env['USE_SEED'])

// Acquire TST tokens
console.log("------- Acquire TST tokens ---------")

const offer = {
  "TransactionType": "OfferCreate",
  "Account": wallet.address,
  "TakerPays": {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "5"
  },
  // Drops calculation is (amount to buy * price per token * amm trading fees)
  "TakerGets": xrpl.xrpToDrops(58)
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

// Deposit assets into AMM
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
  "Amount": xrpl.xrpToDrops(25),
  "Amount2": {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "2.5"
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

// Vote on fees
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

// Get LP tokens value
console.log("------- Calculate value of my LP tokens -------")

const lp_deposit_data = lp_deposit.result.meta.AffectedNodes

let LPTokens = null;

for (const node of lp_deposit_data) {
  if (node.CreatedNode) {
    LPTokens = Math.abs(node.CreatedNode.NewFields.Balance.value);
    break;
  }
}

const amm_info = (await client.request({
  "command": "amm_info", 
  "asset": {
    "currency": "XRP"
  },
  "asset2": {
    "currency": "TST",
    "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
  }
}))

const my_share = LPTokens / amm_info.result.amm.lp_token.value

const my_asset1 = (amm_info.result.amm.amount * my_share) / 1000000
const my_asset2 = amm_info.result.amm.amount2.value * my_share

console.log(`My ${LPTokens} LP tokens are worth:
  XRP: ${my_asset1}
  ${amm_info.result.amm.amount2.currency}: ${my_asset2}`)

// Withdraw by redeeming LP tokens
console.log("------- Pull some money out of AMM -------")
  
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

// Disconnect when done (If you omit this, Node.js won't end the process)
await client.disconnect()

}

main()

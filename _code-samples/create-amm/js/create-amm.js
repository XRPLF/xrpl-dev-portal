'use strict'
// Code to set up an AMM instance between
// "TST.rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" and novel "FOO" tokens.

// Dependencies for Node.js; this if statement lets the code run unmodified
// in browsers, as long as you provide a <script> tag (see example demo.html),
// as well as in Node.js.
if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
  // Configure console.log to print deeper into nested objects so you can
  // better see properties of the AMM:
  require('util').inspect.defaultOptions.depth = 5
}

// Connect to the network -----------------------------------------------------
const WS_URL = 'wss://s.devnet.rippletest.net:51233'
const EXPLORER = 'https://devnet.xrpl.org'

async function main() {
  const client = new xrpl.Client(WS_URL);
  await client.connect()

  // Get credentials from the Faucet -------------------------------------------
  console.log("Requesting address from the faucet...")
  const wallet = (await client.fundWallet()).wallet
  const issuer = (await client.fundWallet()).wallet

  // To use an existing account, use code such as the following:
  // const wallet = xrpl.Wallet.fromSeed(process.env['USE_SEED'])

  // Acquire tokens ------------------------------------------------------------
  const offer_result = await client.submitAndWait({
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerPays": {
      currency: "TST",
      issuer: issuer.address,
      value: "25"
    },
    "TakerGets": xrpl.xrpToDrops(25*10*1.16)
  }, {autofill: true, wallet: wallet})
  if (offer_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`TST offer placed: ${EXPLORER}/transactions/${offer_result.result.hash}`)
    const balance_changes = xrpl.getBalanceChanges(offer_result.result.meta)
    for (const bc of balance_changes) {
      if (bc.account != wallet.address) {continue}
      for (const bal of bc.balances) {
        if (bal.currency == "TST") {
          console.log(`Got ${bal.value} ${bal.currency}.${bal.issuer}.`)
          break
        }
      }
      break
    }

  } else {
    throw `Error sending transaction: ${offer_result}`
  }
  // Successfully placing the offer doesn't necessarily mean that you have TST,
  // but for now, let's assume it matched existing Offers on ledger so you do.

  // Call helper function to set up a new "FOO" issuer, create a trust line
  // to them, and receive 1000 FOO from them.
  const foo_amount = await get_new_token(client, wallet, "FOO", "1000")

  // Check if AMM already exists ----------------------------------------------
  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": "TST",
      "issuer": issuer.address,
    },
    "asset2": {
      "currency": foo_amount.currency,
      "issuer": foo_amount.issuer
    },
    "ledger_index": "validated"
  }
  try {
    const amm_info_result = await client.request(amm_info_request)
    console.log(amm_info_result)
  } catch(err) {
    if (err.data.error === 'actNotFound') {
      console.log(`No AMM exists yet for the pair
                   ${foo_amount.currency}.${foo_amount.issuer} /
                   TST.rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd.
                   (This is probably as expected.)`)
    } else {
      throw(err)
    }
  }

  // Look up AMM transaction cost ---------------------------------------------
  // AMMCreate requires burning one owner reserve. We can look up that amount
  // (in drops) on the current network using server_state:
  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()
  console.log(`Current AMMCreate transaction cost:
               ${xrpl.dropsToXrp(amm_fee_drops)} XRP`)


  // Create AMM ---------------------------------------------------------------
  // This example assumes that 15 TST ≈ 100 FOO in value.
  const ammcreate_result = await client.submitAndWait({
    "TransactionType": "AMMCreate",
    "Account": wallet.address,
    "Amount": {
      currency: "TST",
      issuer: issuer.address,
      value: "15"
    },
    "Amount2": {
      "currency": foo_amount.currency,
      "issuer": foo_amount.issuer,
      "value": "100"
    },
    "TradingFee": 500, // 0.5%
    "Fee": amm_fee_drops
  }, {autofill: true, wallet: wallet, fail_hard: true})
  // Use fail_hard so you don't waste the tx cost if you mess up
  if (ammcreate_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`AMM created: ${EXPLORER}/transactions/${ammcreate_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${ammcreate_result}`
  }

  // Confirm that AMM exists --------------------------------------------------
  // Make the same amm_info request as earlier, but this time it should succeed
  const amm_info_result2 = await client.request(amm_info_request)
  console.log(amm_info_result2)
  const lp_token = amm_info_result2.result.amm.lp_token
  const amount = amm_info_result2.result.amm.amount
  const amount2 = amm_info_result2.result.amm.amount2
  console.log(`The AMM account ${lp_token.issuer} has ${lp_token.value} total
               LP tokens outstanding, and uses the currency code ${lp_token.currency}.`)
  console.log(`In its pool, the AMM holds ${amount.value} ${amount.currency}.${amount.issuer}
               and ${amount2.value} ${amount2.currency}.${amount2.issuer}`)

  // Check token balances
  const account_lines_result = await client.request({
    "command": "account_lines",
    "account": wallet.address,
    // Tip: To look up only the new AMM's LP Tokens, uncomment:
    // "peer": lp_token.issuer,
    "ledger_index": "validated"
  })
  console.log(account_lines_result)

  // Disconnect when done -----------------------------------------------------
  await client.disconnect()
}
main()


/* Issue tokens ---------------------------------------------------------------
 * Fund a new issuer using the faucet, and issue some fungible tokens
 * to the specified address. In production, you would not do this; instead,
 * you would acquire tokens from an existing issuer (for example, you might
 * buy them in the DEX, or make an off-ledger deposit at a stablecoin issuer).
 * For a more thorough explanation of this process, see
 * "Issue a Fungible Token": https://xrpl.org/issue-a-fungible-token.html
 * Params:
 * client: an xrpl.Client instance that is already connected to the network
 * wallet: an xrpl.Wallet instance that should hold the new tokens
 * currency_code: string currency code (3-char ISO-like or hex code)
 * issue_quantity: string number of tokens to issue. Arbitrarily capped
 *                 at "10000000000"
 * Resolves to: an "Amount"-type JSON object, such as:
 * {
 *   "currency": "TST",
 *   "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
 *   "value": "123.456"
 * }
 */
async function get_new_token(client, wallet, currency_code, issue_quantity) {
  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Funding an issuer address with the faucet...")
  const issuer = (await client.fundWallet()).wallet
  console.log(`Got issuer address ${issuer.address}.`)

  // Enable issuer DefaultRipple ----------------------------------------------
  const issuer_setup_result = await client.submitAndWait({
    "TransactionType": "AccountSet",
    "Account": issuer.address,
    "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
  }, {autofill: true, wallet: issuer} )
  if (issuer_setup_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Issuer DefaultRipple enabled: ${EXPLORER}/transactions/${issuer_setup_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${issuer_setup_result}`
  }

  // Create trust line to issuer ----------------------------------------------
  const trust_result = await client.submitAndWait({
    "TransactionType": "TrustSet",
    "Account": wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": issuer.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }, {autofill: true, wallet: wallet})
  if (trust_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Trust line created: ${EXPLORER}/transactions/${trust_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${trust_result}`
  }

  // Issue tokens -------------------------------------------------------------
  const issue_result = await client.submitAndWait({
    "TransactionType": "Payment",
    "Account": issuer.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": issuer.address
    },
    "Destination": wallet.address
  }, {autofill: true, wallet: issuer})
  if (issue_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Tokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${issue_result}`
  }

  return {
    "currency": currency_code,
    "value": issue_quantity,
    "issuer": issuer.address
  }
}

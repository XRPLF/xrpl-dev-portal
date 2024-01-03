'use strict'

require('dotenv').config();
var xrpl = require('xrpl')
// Configure console.log to print deeper into nested objects so you can
// better see properties of the AMM:
require('util').inspect.defaultOptions.depth = 5
import {
  AmmInfo,
  TokenInfo,
  acquireTokens,
  bidAmm,
  checkExistsAmm,
  confirmAmm,
  createAmm,
  depositAmm,
  getAmmcost,
  get_new_token,
  swap,
  voteAmm,
  withdrawAmm
} from './lib/amm';
import {
  WS_URL
} from './util/consts';

/**
 * Script for demonstrating AMM functionality, both token/token and token/XRP
 * AMM機能を試すためのスクリプト
 */
async function main() {
  const client = new xrpl.Client(WS_URL);
  await client.connect()
  
  // Get credentials from the Faucet ------------------------------------------
  console.log("Requesting address from the faucet...")
  const wallet = (await client.fundWallet()).wallet

  // To use an existing account, use code such as the following:
  // const wallet = xrpl.Wallet.fromSeed(process.env.SECRET_FEED!)

  // Token<->Token AMM (FOO/MSH) example ======================================
  // Issue tokens
  // トークンを発行
  const msh_amount = await get_new_token(client, wallet, "MSH", "10000")
  const foo_amount = await get_new_token(client, wallet, "FOO", "1000")

  // Acquire tokens -----------------------------------------------------------
  await acquireTokens(client, wallet, msh_amount);
  await acquireTokens(client, wallet, foo_amount);

  // create AMM Info
  const amm_info_request: AmmInfo = {
    "command": "amm_info",
    "asset": {
      "currency": msh_amount.currency!,
      "issuer": msh_amount.issuer!,
    },
    "asset2": {
      "currency": foo_amount.currency!,
      "issuer": foo_amount.issuer!
    },
    "ledger_index": "validated"
  }

  // Check if AMM already exists ----------------------------------------------
  await checkExistsAmm(client, amm_info_request, msh_amount, foo_amount);

  // Look up AMM transaction cost ---------------------------------------------
  const amm_fee_drops = await getAmmcost(client);

  // Create AMM ---------------------------------------------------------------
  // This example assumes that 15 TST ≈ 100 FOO in value.
  await createAmm(client, wallet, msh_amount, foo_amount, amm_fee_drops)
  
  // Confirm that AMM exists --------------------------------------------------
  const {
    account_lines_result: account_lines_result,
    ammInfo: ammInfo
  } = await confirmAmm(client, wallet, amm_info_request);
  
  // console.log("account_lines_result:", account_lines_result)
  console.log("ammAddress:", ammInfo.issuer)

  // deposit AMM
  await depositAmm(client, wallet, msh_amount, "15", foo_amount, "100")
  // withdraw AMM
  await withdrawAmm(client, wallet, msh_amount, "5", foo_amount, "5")
  // BidAMM
  await bidAmm(client, wallet, msh_amount, foo_amount, ammInfo)
  // VoteAMM
  await voteAmm(client, wallet, msh_amount, foo_amount, 500)
  // Swap (payment Transaction)
  await swap(client, wallet, ammInfo.issuer, msh_amount, foo_amount, "1", "2")

  // confirm AMM again
  const {
    account_lines_result: account_lines_result2,
  } = await confirmAmm(client, wallet, amm_info_request);

  // Token<->XRP AMM (FOO/XRP) example ========================================

  // create AMM Info (another XRP pattern)
  const amm_info_request2: AmmInfo = {
    "command": "amm_info",
    "asset": {
      "currency": msh_amount.currency!,
      "issuer": msh_amount.issuer!,
    },
    "asset2": {
      "currency": "XRP",
      "issuer": null
    },
    "ledger_index": "validated"
  }

  // create XRP Amount info
  const xrpInfo: TokenInfo = {
    "currency": null,
    "value": "10000000",
    "issuer": null
  }

  // Check if AMM already exists ----------------------------------------------
  await checkExistsAmm(client, amm_info_request2, msh_amount, xrpInfo);
  // Create AMM ---------------------------------------------------------------
  // This example assumes that 15 TST ≈ 100 FOO in value.
  await createAmm(client, wallet, msh_amount, xrpInfo, amm_fee_drops)
  
  // Confirm that AMM exists --------------------------------------------------
  const {
    ammInfo: ammInfo2
  } = await confirmAmm(client, wallet, amm_info_request2);
  
  // console.log("account_lines_result:", account_lines_result)
  console.log("ammAddress2:", ammInfo2.issuer)
  // deposit AMM
  await depositAmm(client, wallet, msh_amount, "15", xrpInfo, "10")
  // withdraw AMM
  await withdrawAmm(client, wallet, msh_amount, "5", xrpInfo, "5")
  // Swap (payment Transaction) XRP ->> MSH
  await swap(client, wallet, ammInfo2.issuer, msh_amount, xrpInfo, "1", "2000000")
  // Swap (payment Transaction) MSH ->> XRP
  await swap(client, wallet, ammInfo2.issuer, xrpInfo, msh_amount, "2000", "1")


  // Disconnect when done -----------------------------------------------------
  await client.disconnect()
}

main()

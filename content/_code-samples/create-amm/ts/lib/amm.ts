var xrpl = require('xrpl')
import {
  EXPLORER
} from './../util/consts';

export type TokenInfo = {
  "currency": string | null;
  "value": string;
  "issuer": string | null;
}

export type AmmInfo = {
  "command": string;
  "asset": {
    "currency": string;
    "issuer": string;
  },
  "asset2": {
    "currency": string;
    "issuer": string | null;
  } | null,
  "ledger_index": "validated"
}

/**
 * get token method
 */
export const acquireTokens = async(
  client: any,
  wallet: any,
  token: TokenInfo,
) => {
  try {
    const offer_result = await client.submitAndWait({
      "TransactionType": "OfferCreate",
      "Account": wallet.address,
      "TakerPays": {
        currency: token.currency,
        issuer: token.issuer,
        value: "1000"
      },
      "TakerGets": xrpl.xrpToDrops(25*10*1.16)
    }, {
      autofill: true, 
      wallet: wallet
    })

    // get metaData & TransactionResult
    const metaData: any = offer_result.result.meta!;
    const transactionResult = metaData.TransactionResult;
  
    if (transactionResult == "tesSUCCESS") {
      console.log(`MSH offer placed: ${EXPLORER}/transactions/${offer_result.result.hash}`)
      const balance_changes = xrpl.getBalanceChanges(metaData)
  
      for (const bc of balance_changes) {
        if (bc.account != wallet.address) {continue}
        for (const bal of bc.balances) {
          if (bal.currency == "MSH") {
            console.log(`Got ${bal.value} ${bal.currency}.${bal.issuer}.`)
            break
          }
        }
        break
      }
  
    } else {
      throw `Error sending transaction: ${offer_result}`
    }
  } catch(err) {
    console.error("Acquire tokens err: ", err)
  }
};

/**
 * check Amm pair is existed
 */
export const checkExistsAmm = async (
  client: any,
  amm_info_request: AmmInfo, 
  token1Info: TokenInfo,
  token2Info: TokenInfo,
) => {

  try {
    const amm_info_result = await client.request(amm_info_request)
    console.log(amm_info_result)
  } catch(err: any) {
    if (err.data.error === 'actNotFound') {
      if(token2Info.issuer != null) {
        console.log(`No AMM exists yet for the pair
          ${token2Info.currency}.${token2Info.issuer} /
          ${token1Info.currency}.${token1Info.issuer}
          (This is probably as expected.)`)
      } else {
        console.log(`No AMM exists yet for the pair
          XRP /
          ${token1Info.currency}.${token1Info.issuer}
          (This is probably as expected.)`)
      }
    } else {
      throw(err)
    }
  }
};

/**
 * get const info for craete carete AMM pair
 */
export const getAmmcost = async(
  client: any
): Promise<string> => {
  const ss = await client.request({
    "command": "server_state"
  })
  const amm_fee_drops = ss.result.state.validated_ledger!.reserve_inc.toString()
  console.log(`Current AMMCreate transaction cost: ${xrpl.dropsToXrp(amm_fee_drops)} XRP`)

  return amm_fee_drops;
}

/**
 * create AMM method
 */
export const createAmm = async(
  client: any,
  wallet: any,
  token1Info: TokenInfo,
  token2Info: TokenInfo,
  amm_fee_drops: string,
) => {
  try {
    var ammcreate_result;
    if(token2Info.currency != null) {
      ammcreate_result = await client.submitAndWait({
        "TransactionType": "AMMCreate",
        "Account": wallet.address,
        "Amount": {
          currency: token1Info.currency,
          issuer: token1Info.issuer,
          value: "15"
        },
        "Amount2": {
          "currency": token2Info.currency,
          "issuer": token2Info.issuer,
          "value": "100"
        },
        "TradingFee": 500, // 0.5%
        "Fee": amm_fee_drops
      }, {
        autofill: true, 
        wallet: wallet, 
        failHard: true
      })
    } else {
      ammcreate_result = await client.submitAndWait({
        "TransactionType": "AMMCreate",
        "Account": wallet.address,
        "Amount": {
          currency: token1Info.currency,
          issuer: token1Info.issuer,
          value: "15"
        },
        "Amount2": token2Info.value,
        "TradingFee": 500, // 0.5%
        "Fee": amm_fee_drops
      }, {
        autofill: true, 
        wallet: wallet, 
        failHard: true
      })
    }

    // get metaData & TransactionResult
    const metaData: any = ammcreate_result.result.meta!;
    const transactionResult = metaData.TransactionResult;
  
    // Use fail_hard so you don't waste the tx cost if you mess up
    if (transactionResult == "tesSUCCESS") {
      console.log(`AMM created: ${EXPLORER}/transactions/${ammcreate_result.result.hash}`)
    } else {
      throw `Error sending transaction: ${JSON.stringify(ammcreate_result)}`
    }
  } catch(err) {
    console.error("create amm err:", err)
  }
}

/**
 * confirm AMM method
 */
export const confirmAmm = async(
  client: any,
  wallet: any,
  amm_info_request: AmmInfo
): Promise<any> => {
  try {
    // get AMM info
    const amm_info_result2 = await client.request(amm_info_request)
    console.log("amm_info_result2:", amm_info_result2)

    const results = amm_info_result2.result as any;

    const lp_token = results.amm.lp_token
    const amount = results.amm.amount
    const amount2 = results.amm.amount2

    const ammInfo: TokenInfo = {
      "currency": lp_token.currency,
      "issuer": lp_token.issuer,
      "value": "0"
    }

    console.log(`The AMM account ${lp_token.issuer} has ${lp_token.value} total
                LP tokens outstanding, and uses the currency code ${lp_token.currency}.`)
    if(amount2.currency != undefined) {
      console.log(`In its pool, the AMM holds ${amount.value} ${amount.currency}.${amount.issuer}
                   and ${amount2.value} ${amount2.currency}.${amount2.issuer}`)
    } else {
      console.log(`In its pool, the AMM holds ${amount.value} ${amount.currency}.${amount.issuer}
                   and ${amount2} XRP`)
    }

    // check balanse
    const account_lines_result = await client.request({
      "command": "account_lines",
      "account": wallet.address,
      // Tip: To look up only the new AMM's LP Tokens, uncomment:
      // "peer": lp_token.issuer,
      "ledger_index": "validated"
    })
    return {
      account_lines_result,
      ammInfo
    };
  } catch(err) {
    console.error("Check token balances err:", err)
    return null;
  }
}

/**
 * bid AMM method
 */
export const bidAmm = async(
  client: any,
  wallet: any,
  token1Info: TokenInfo,
  token2Info: TokenInfo,
  ammInfo: TokenInfo
) => {
  try {
    const result = await client.submitAndWait({
      "TransactionType": "AMMBid",
      "Account": wallet.address,
      "Asset": {
        currency: token1Info.currency,
        issuer: token1Info.issuer,
      },
      "Asset2": {
        "currency": token2Info.currency,
        "issuer": token2Info.issuer,
      },
      "BidMax" : {
        "currency" : ammInfo.currency,
        "issuer" : ammInfo.issuer,
        "value" : "5"
      },
    }, {
      autofill: true, 
      wallet: wallet, 
      failHard: true
    })

    // get metaData & TransactionResult
    const metaData: any = result.result.meta!;
    const transactionResult = metaData.TransactionResult;
  
    // Use fail_hard so you don't waste the tx cost if you mess up
    if (transactionResult == "tesSUCCESS") {
      console.log(`AMM bid: ${EXPLORER}/transactions/${result.result.hash}`)
    } else {
      throw `Error sending transaction: ${JSON.stringify(result)}`
    }
  } catch(err) {
    console.error("error occuered while bidAmm:", err)
  }
};

/**
 * vote AMM method
 */
export const voteAmm = async(
  client: any,
  wallet: any,
  token1Info: TokenInfo,
  token2Info: TokenInfo,
  tradingFee: number
) => {
  try {
    const result = await client.submitAndWait({
      "TransactionType": "AMMVote",
      "Account": wallet.address,
      "Asset": {
        currency: token1Info.currency,
        issuer: token1Info.issuer,
      },
      "Asset2": {
        "currency": token2Info.currency,
        "issuer": token2Info.issuer,
      },
      "TradingFee" : tradingFee,
    }, {
      autofill: true, 
      wallet: wallet, 
      failHard: true
    })

    // get metaData & TransactionResult
    const metaData: any = result.result.meta!;
    const transactionResult = metaData.TransactionResult;
  
    // Use fail_hard so you don't waste the tx cost if you mess up
    if (transactionResult == "tesSUCCESS") {
      console.log(`AMM vote: ${EXPLORER}/transactions/${result.result.hash}`)
    } else {
      throw `Error sending transaction: ${JSON.stringify(result)}`
    }
  } catch(err) {
    console.error("error occuered while voteAmm:", err)
  }
};

/**
 * deposit AMM 
 */
export const depositAmm = async(
  client: any,
  wallet: any,
  token1Info: TokenInfo,
  token1Amount: string,
  token2Info: TokenInfo,
  token2Amount: string,
) => {
  try {
    var result;
    if(token2Info.currency != null) {
      result = await client.submitAndWait({
        "TransactionType": "AMMDeposit",
        "Account": wallet.address,
        "Amount": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
          "value": token1Amount
        },
        "Amount2": {
          "currency": token2Info.currency,
          "issuer": token2Info.issuer,
          "value": token2Amount
        },
        "Asset": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
        },
        "Asset2": {
          "currency": token2Info.currency,
          "issuer": token2Info.issuer,
        },
        "Flags" : 1048576,
      }, {
        autofill: true, 
        wallet: wallet, 
        failHard: true
      })
    } else {
      result = await client.submitAndWait({
        "TransactionType": "AMMDeposit",
        "Account": wallet.address,
        "Amount": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
          "value": token1Amount
        },
        "Amount2": token2Amount,
        "Asset": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
        },
        "Asset2": { 
          "currency": "XRP"
        },
        "Flags" : 1048576,
      }, {
        autofill: true, 
        wallet: wallet, 
        failHard: true
      })
    }
    

    // get metaData & TransactionResult
    const metaData: any = result.result.meta!;
    const transactionResult = metaData.TransactionResult;
  
    // Use fail_hard so you don't waste the tx cost if you mess up
    if (transactionResult == "tesSUCCESS") {
      console.log(`AMM deposit: ${EXPLORER}/transactions/${result.result.hash}`)
    } else {
      throw `Error sending transaction: ${JSON.stringify(result)}`
    }
  } catch(err) {
    console.error("error occuered while depositAmm:", err)
  }
};

/**
 * Withdraw AMM
 */
export const withdrawAmm = async(
  client: any,
  wallet: any,
  token1Info: TokenInfo,
  token1Amount: string,
  token2Info: TokenInfo,
  token2Amount: string,
) => {
  try {
    var result;
    
    if(token2Info.currency != null) { 
      result = await client.submitAndWait({
        "TransactionType": "AMMWithdraw",
        "Account": wallet.address,
        "Amount": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
          "value": token1Amount
        },
        "Amount2": {
          "currency": token2Info.currency,
          "issuer": token2Info.issuer,
          "value": token2Amount
        },
        "Asset": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
        },
        "Asset2": {
          "currency": token2Info.currency,
          "issuer": token2Info.issuer,
        },
        "Fee" : "10",
        "Flags" : 1048576,
      }, {
        autofill: true, 
        wallet: wallet, 
        failHard: true
      })
    } else {
      result = await client.submitAndWait({
        "TransactionType": "AMMWithdraw",
        "Account": wallet.address,
        "Amount": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
          "value": token1Amount
        },
        "Amount2": token2Amount,
        "Asset": {
          "currency": token1Info.currency,
          "issuer": token1Info.issuer,
        },
        "Asset2": {
          "currency": "XRP"
        },
        "Fee" : "10",
        "Flags" : 1048576,
      }, {
        autofill: true, 
        wallet: wallet, 
        failHard: true
      })
    }

    // get metaData & TransactionResult
    const metaData: any = result.result.meta!;
    const transactionResult = metaData.TransactionResult;
  
    // Use fail_hard so you don't waste the tx cost if you mess up
    if (transactionResult == "tesSUCCESS") {
      console.log(`AMM withdraw: ${EXPLORER}/transactions/${result.result.hash}`)
    } else {
      throw `Error sending transaction: ${JSON.stringify(result)}`
    }
  } catch(err) {
    console.error("error occuered while withdrawAmm:", err)
  }
};

/**
 * Swap method
 */
export const swap = async(
  client: any,
  wallet: any,
  ammAddress: string,
  token1Info: TokenInfo,
  token2Info: TokenInfo,
  token1Value: string,
  token2Value: string
) => {
  client.on('path_find', (stream: any) => {
    console.log(JSON.stringify(stream.alternatives, null, '  '))
  })
  // path find
  var result; 
  
  if(token1Info.currency != null && token2Info.currency != null) { 
    result = await client.request({
      command: 'path_find',
      subcommand: 'create',
      source_account: wallet.address,
      source_amount: {
        "currency": token2Info.currency,  
        "value": token2Value,                   
        "issuer": token2Info.issuer
      },
      destination_account: wallet.address,
      destination_amount: {
        "currency": token1Info.currency,  
        "value": token1Value,                   
        "issuer": token1Info.issuer
      }
    });
  } else if(token2Info.currency == null) {
    result = await client.request({
      command: 'path_find',
      subcommand: 'create',
      source_account: wallet.address,
      source_amount: {
        "currency": "XRP",
      },
      destination_account: wallet.address,
      destination_amount: {
        "currency": token1Info.currency,  
        "value": token1Value,                   
        "issuer": token1Info.issuer
      }
    });
  } 

  console.log("path find:", result)

  // create swap transaction data
  var swapTxData;
  if(token1Info.currency != null && token2Info.currency != null) { 
    swapTxData = {
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Destination": wallet.address,      
      "Amount": {
        "currency": token1Info.currency,        
        "value": token1Value,                   
        "issuer": token1Info.issuer
      },
      "SendMax": {
        "currency": token2Info.currency,  
        "value": token2Value,
        "issuer": token2Info.issuer
      },
      "Paths": [
        [
          {
            "account": token2Info.issuer,
            "type": 1
          },
          {
            "currency": token1Info.currency,
            "issuer": token1Info.issuer,
            "type": 48
          }
        ]
      ]
    }
  } else if (token2Info.currency == null) { // XRP > other token
    swapTxData = {
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Destination": wallet.address,      
      "Amount": {
        "currency": token1Info.currency,       
        "value": token1Value,                  
        "issuer": token1Info.issuer
      },
      "SendMax": token2Value,
      "Paths": [
        [
          {
            "currency": token1Info.currency,
            "issuer": token1Info.issuer,
            "type": 48
          }
        ]
      ]
    }
  } else if (token1Info.currency == null) { // other token > XRP
    swapTxData = {
      "TransactionType": "Payment",
      "Account": wallet.address,
      "Destination": wallet.address,      
      "Amount": token1Value,
      "SendMax": {
        "currency": token2Info.currency,        
        "value": token2Value,                   
        "issuer": token2Info.issuer
      },
      "Paths": [
        [
          {
            "currency": "XRP",
            "type": 16
          }
        ]
      ]
    }
  }
  
  try {
    const pay_prepared = await client.autofill(swapTxData);
    
    const pay_signed = wallet.sign(pay_prepared);
    
    if (token1Info.currency != null) {
      console.log(`Sending ${token1Info.value} ${token1Info.currency} to ${ammAddress}...`)
    } else if(token2Info.currency == null) {
      console.log(`Sending ${token2Info.value} ${token2Info.currency} to ${ammAddress}...`)
    }
    
    const pay_result = await client.submitAndWait(pay_signed.tx_blob);

    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Transaction succeeded: ${EXPLORER}/transactions/${pay_signed.hash}`)
    } else {
      throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
    };

    // Check balances ------------------------------------------------------------
    console.log("Getting hot address balances...");
    // get hot address data
    const balances = await client.request({
      command: "account_lines",
      account: wallet.address,
      ledger_index: "validated"
    })
    console.log("wallet address's balance:", balances.result);
  } catch(err) {
    console.error("error occuered while swaping:", err);
  }
};

/* Issue tokens function ---------------------------------------------------------------
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
 * 
 * @param client 
 * @param wallet 
 * @param currency_code 
 * @param issue_quantity 
 * @returns 
 */
export const get_new_token = async (
  client: any,
  wallet: any,
  currency_code: string, 
  issue_quantity: string
) => {
  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Funding an issuer address with the faucet...")
  const issuer = (await client.fundWallet()).wallet
  console.log(`Got issuer address ${issuer.address}.`)

  // Enable issuer DefaultRipple ----------------------------------------------
  const issuer_setup_result = await client.submitAndWait({
    "TransactionType": "AccountSet",
    "Account": issuer.address,
    "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
  }, {
    autofill: true, 
    wallet: issuer
  } )

  // get metaData & TransactionResult
  const metaData: any = issuer_setup_result.result.meta!;
  const transactionResult = metaData.TransactionResult;

  if (transactionResult == "tesSUCCESS") {
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
  }, {
    autofill: true, 
    wallet: wallet
  })

  // get metaData & TransactionResult
  const metaData2: any = issuer_setup_result.result.meta!;
  const transactionResult2 = metaData2.TransactionResult;

  if (transactionResult2 == "tesSUCCESS") {
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
  }, {
    autofill: true, 
    wallet: issuer
  })

  if (transactionResult == "tesSUCCESS") {
    console.log(`Tokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${issue_result}`
  }

  const tokenInfo: TokenInfo = {
    "currency": currency_code,
    "value": issue_quantity,
    "issuer": issuer.address
  }

  return tokenInfo;
}
/*
 * Create, claim and verify a Payment Channel.
 * Reference: https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/paychannel
 */
import {
  AccountObjectsRequest,
  Client,
  PaymentChannelCreate,
  PaymentChannelClaim,
  hashes,
} from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233')

// The snippet walks us through creating and claiming a Payment Channel.
async function claimPayChannel(): Promise<void> {
  await client.connect()

  // Creating wallets as prerequisite
  const { wallet: wallet1 } = await client.fundWallet()
  const { wallet: wallet2 } = await client.fundWallet()

  console.log('Balances of wallets before Payment Channel is claimed:')
  console.log(`Balance of ${wallet1.address} is ${await client.getXrpBalance(wallet1.address)} XRP`)
  console.log(`Balance of ${wallet2.address} is ${await client.getXrpBalance(wallet2.address)} XRP`)

  // Create a Payment Channel and submit and wait for tx to be validated
  const paymentChannelCreate: PaymentChannelCreate = {
    TransactionType: 'PaymentChannelCreate',
    Account: wallet1.classicAddress,
    Amount: '100', // 10 XRP
    Destination: wallet2.classicAddress,
    SettleDelay: 86400,  // 1 day in seconds
    PublicKey: wallet1.publicKey,
  }
  
  console.log("Submitting a PaymentChannelCreate transaction...")
  const paymentChannelResponse = await client.submitAndWait(
    paymentChannelCreate,
    { wallet: wallet1 },
  )
  console.log("PaymentChannelCreate transaction response:")
  console.log(paymentChannelResponse)

  // Check that the object was actually created
  const accountObjectsRequest: AccountObjectsRequest = {
    command: 'account_objects',
    account: wallet1.classicAddress,
  }

  const accountObjects = (await client.request(accountObjectsRequest)).result
    .account_objects
  console.log("Account Objects:", accountObjects)

  // Destination claims the Payment Channel and we see the balances to verify.
  const paymentChannelClaim: PaymentChannelClaim = {
    Account: wallet2.classicAddress,
    TransactionType: 'PaymentChannelClaim',
    Channel: hashes.hashPaymentChannel(
      wallet1.classicAddress,
      wallet2.classicAddress,
      paymentChannelResponse.result.tx_json.Sequence ?? 0, 
    ),
    Amount: '100',
  }

  console.log("Submitting a PaymentChannelClaim transaction...")
  const channelClaimResponse = await client.submit(paymentChannelClaim, {
    wallet: wallet2,
  })
  console.log("PaymentChannelClaim transaction response:")
  console.log(channelClaimResponse)

  console.log('Balances of wallets after Payment Channel is claimed:')
  console.log(`Balance of ${wallet1.address} is ${await client.getXrpBalance(wallet1.address)} XRP`)
  console.log(`Balance of ${wallet2.address} is ${await client.getXrpBalance(wallet2.address)} XRP`)

  await client.disconnect()
}

void claimPayChannel()

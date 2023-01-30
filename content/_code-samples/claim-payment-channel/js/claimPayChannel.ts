import {
  AccountObjectsRequest,
  Client,
  PaymentChannelCreate,
  PaymentChannelClaim,
  hashes,
} from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233')

void claimPayChannel()

// The snippet walks us through creating and claiming a Payment Channel.
async function claimPayChannel(): Promise<void> {
  await client.connect()

  // creating wallets as prerequisite
  const { wallet: wallet1 } = await client.fundWallet()
  const { wallet: wallet2 } = await client.fundWallet()

  console.log('Balances of wallets before Payment Channel is claimed:')
  console.log(await client.getXrpBalance(wallet1.classicAddress))
  console.log(await client.getXrpBalance(wallet2.classicAddress))

  // create a Payment Channel and submit and wait for tx to be validated
  const paymentChannelCreate: PaymentChannelCreate = {
    TransactionType: 'PaymentChannelCreate',
    Account: wallet1.classicAddress,
    Amount: '100',
    Destination: wallet2.classicAddress,
    SettleDelay: 86400,
    PublicKey: wallet1.publicKey,
  }

  const paymentChannelResponse = await client.submitAndWait(
    paymentChannelCreate,
    { wallet: wallet1 },
  )
  console.log(paymentChannelResponse)

  // check that the object was actually created
  const accountObjectsRequest: AccountObjectsRequest = {
    command: 'account_objects',
    account: wallet1.classicAddress,
  }

  const accountObjects = (await client.request(accountObjectsRequest)).result
    .account_objects

  console.log(accountObjects)

  // destination claims the Payment Channel and we see the balances to verify.
  const paymentChannelClaim: PaymentChannelClaim = {
    Account: wallet2.classicAddress,
    TransactionType: 'PaymentChannelClaim',
    Channel: hashes.hashPaymentChannel(
      wallet1.classicAddress,
      wallet2.classicAddress,
      paymentChannelResponse.result.Sequence ?? 0,
    ),
    Amount: '100',
  }

  const channelClaimResponse = await client.submit(paymentChannelClaim, {
    wallet: wallet1,
  })
  console.log(channelClaimResponse)

  console.log('Balances of wallets after Payment Channel is claimed:')
  console.log(await client.getXrpBalance(wallet1.classicAddress))
  console.log(await client.getXrpBalance(wallet2.classicAddress))

  await client.disconnect()
}

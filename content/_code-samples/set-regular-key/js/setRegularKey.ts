/*
 * Use `SetRegularKey` to assign a key pair to a wallet and make a payment signed using the regular key wallet.
 * Reference: https://xrpl.org/setregularkey.html
 */
import { Client, Payment, SetRegularKey } from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233')

async function setRegularKey(): Promise<void> {
  await client.connect()
  const { wallet: wallet1 } = await client.fundWallet()
  const { wallet: wallet2 } = await client.fundWallet()
  const { wallet: regularKeyWallet } = await client.fundWallet()

  console.log('Balances before payment')
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`)
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`)

  // assigns key-pair(regularKeyWallet) to wallet1 using `SetRegularKey`.
  const tx: SetRegularKey = {
    TransactionType: 'SetRegularKey',
    Account: wallet1.classicAddress,
    RegularKey: regularKeyWallet.classicAddress,
  }

  console.log('Submitting a SetRegularKey transaction...')
  const response = await client.submitAndWait(tx, {
    wallet: wallet1,
  })

  console.log('Response for successful SetRegularKey tx')
  console.log(response)

  /*
   * when wallet1 sends payment to wallet2 and
   * signs using the regular key wallet, the transaction goes through.
   */
  const payment: Payment = {
    TransactionType: 'Payment',
    Account: wallet1.classicAddress,
    Destination: wallet2.classicAddress,
    Amount: '1000',
  }

  const submitTx = await client.submit(payment, {
    wallet: regularKeyWallet,
  })
  console.log('Response for tx signed using Regular Key:')
  console.log(submitTx)
  console.log('Balances after payment:')
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`)
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`)

  await client.disconnect()
}
void setRegularKey()

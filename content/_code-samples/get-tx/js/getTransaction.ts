/*
 * Retrieve and display a transaction on the ledger.
 * Reference: https://xrpl.org/tx.html
 */
import { Client, LedgerResponse, TxResponse } from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233')

async function getTransaction(): Promise<void> {
  await client.connect()
  const ledger: LedgerResponse = await client.request({
    command: 'ledger',
    transactions: true,
    ledger_index: 'validated',
  })
  console.log("Latest validated ledger:", ledger)

  const transactions = ledger.result.ledger.transactions
  if (transactions) {
    const tx: TxResponse = await client.request({
      command: 'tx',
      transaction: transactions[0],
    })
    console.log("First transaction in the ledger:")
    console.log(tx)

    // The meta field would be a string(hex) when the `binary` parameter is `true` for the `tx` request.
    if (tx.result.meta == null) {
      throw new Error('meta not included in the response')
    }
    /*
     * delivered_amount is the amount actually received by the destination account.
     * Use this field to determine how much was delivered, regardless of whether the transaction is a partial payment.
     * https://xrpl.org/transaction-metadata.html#delivered_amount
     */
    if (typeof tx.result.meta !== 'string') {
      console.log('delivered_amount:', tx.result.meta.delivered_amount)
    }
  }

  await client.disconnect()
}

void getTransaction()

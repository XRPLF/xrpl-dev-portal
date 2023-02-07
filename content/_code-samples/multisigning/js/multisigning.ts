/*
 * Create and submit a SignerListSet and multisign a transaction.
 * Reference: https://xrpl.org/multi-signing.html
*/
import {
  multisign,
  Client,
  AccountSet,
  convertStringToHex,
  SignerListSet,
} from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233')

async function multisigning(): Promise<void> {
  await client.connect()
  /*
   * This wallet creation is for demonstration purposes.
   * In practice, users generally will not have all keys in one spot,
   * hence, users need to implement a way to get signatures.
   */
  const { wallet: wallet1 } = await client.fundWallet()
  const { wallet: wallet2 } = await client.fundWallet()
  const { wallet: walletMaster } = await client.fundWallet()
  const signerListSet: SignerListSet = {
    TransactionType: 'SignerListSet',
    Account: walletMaster.classicAddress,
    SignerEntries: [
      {
        SignerEntry: {
          Account: wallet1.classicAddress,
          SignerWeight: 1,
        },
      },
      {
        SignerEntry: {
          Account: wallet2.classicAddress,
          SignerWeight: 1,
        },
      },
    ],
    SignerQuorum: 2,
  }

  const signerListResponse = await client.submit(signerListSet, {
    wallet: walletMaster,
  })
  console.log('SignerListSet constructed successfully:')
  console.log(signerListResponse)

  const accountSet: AccountSet = {
    TransactionType: 'AccountSet',
    Account: walletMaster.classicAddress,
    Domain: convertStringToHex('example.com'),
  }
  const accountSetTx = await client.autofill(accountSet, 2)
  console.log('AccountSet transaction is ready to be multisigned:')
  console.log(accountSetTx)
  const { tx_blob: tx_blob1 } = wallet1.sign(accountSetTx, true)
  const { tx_blob: tx_blob2 } = wallet2.sign(accountSetTx, true)
  const multisignedTx = multisign([tx_blob1, tx_blob2])
  const submitResponse = await client.submit(multisignedTx)

  if (submitResponse.result.engine_result === 'tesSUCCESS') {
    console.log('The multisigned transaction was accepted by the ledger:')
    console.log(submitResponse)
    if (submitResponse.result.tx_json.Signers) {
      console.log(
        `The transaction had ${submitResponse.result.tx_json.Signers.length} signatures`,
      )
    }
  } else {
    console.log(
      "The multisigned transaction was rejected by rippled. Here's the response from rippled:",
    )
    console.log(submitResponse)
  }

  await client.disconnect()
}

void multisigning()
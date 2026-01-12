const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
  await client.connect()

  console.log('Funding new wallets from faucet...')
  const delegator_wallet = (await client.fundWallet()).wallet
  console.log('Delegator account:')
  console.log('  Address:', delegator_wallet.address)
  const delegate_wallet = (await client.fundWallet()).wallet
  console.log('Delegate account:')
  console.log('  Address:', delegate_wallet.address)
  console.log('  Seed:', delegate_wallet.seed)
  console.log('Please note these values for later.')

  // Define the transaction
  const delegateset = {
    TransactionType: 'DelegateSet',
    Account: delegator_wallet.address,
    Authorize: delegate_wallet.address,
    Permissions: [
      {
        Permission: {
          PermissionValue: 'AccountDomainSet',
        },
      },
    ],
  }

  // Prepare, sign, and submit the transaction
  const result = await client.submitAndWait(delegateset, {
    wallet: delegator_wallet,
    autofill: true,
  })

  // Check transaction results
  console.log(result)
  if (result.result.meta.TransactionResult === 'tesSUCCESS') {
    console.log('Delegate successfully set.')
  }

  // Confirm presence of Delegate ledger entry using account_objects
  response = await client.request({
    command: 'account_objects',
    account: delegator_wallet.address,
    type: 'delegate',
    ledger_index: 'validated',
  })
  console.log(JSON.stringify(response, null, 2))

  client.disconnect()
}

main()

const { validate } = require('xrpl');
const xrpl = require('xrpl')

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
  });

  // Generates a test account
  const { wallet, balance } = await client.fundWallet()

  const issuing_address = wallet.classicAddress
  const address_to_freeze = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v';
  const currency_to_freeze = 'USD';

  // Look up current state of trust line
  const account_lines = {
    command: 'account_lines',
    account: issuing_address,
    peer: address_to_freeze,
  };

  console.log('Looking up', currency_to_freeze, 'trust line from',
              issuing_address, 'to', address_to_freeze);

  const data = await client.request(account_lines)
  const trustlines = data.result.lines

  // There can only be one trust line per currency code per account, 
  // so we stop after the first match
  let trustline = null;
  for (let i = 0; i < trustlines.length; i++) {
    if(trustlines[i].currency === currency_to_freeze) {
      trustline = trustlines[i]
      break
    }
  }

  let limit = null;
  if(trustline === null) {
    console.log('Trustline not found, making a default one');
    
    limit = {
      value: '0',
      currency: currency_to_freeze,
      issuer: address_to_freeze,
    }
  } else {
    console.log('Found existing trustline: ', trustline)

    limit = {
      value: trustline.limit,
      currency: trustline.currency,
      issuer: trustline.account
    }
  }

  const trust_set = {
    TransactionType: 'TrustSet',
    Account: issuing_address,
    LimitAmount: limit,
    // Signal to freeze the individual trust line
    Flags: xrpl.TrustSetFlags.tfSetFreeze
  }

  // For JS users, validate lets you check if your transaction is well-formed
  validate(trust_set) 

  console.log('Submitting TrustSet tx:', trust_set);
  const result = await client.submitReliable(wallet, trust_set)

  console.log('Submitted tx!')
  client.disconnect()
}

main().catch(console.error)

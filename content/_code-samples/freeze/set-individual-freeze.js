const { validate } = require('xrpl');
const xrpl = require('xrpl')

async function main() {
  // Connect -------------------------------------------------------------------
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  client.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
  });

  const { wallet, balance } = await client.fundWallet()
  const issuing_address = wallet.classicAddress

  //const issuing_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';
  const address_to_freeze = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v';
  const currency_to_freeze = 'USD';

  // Look up current state of trust line
  const account_lines = {
    command: 'account_lines',
    account: issuing_address,
    peer: address_to_freeze,
  };

  console.log('looking up', currency_to_freeze, 'trust line from',
              issuing_address, 'to', address_to_freeze);

  const data = await client.request(account_lines)

  let trustset = {};
  if (data.length !== 1) {
    console.log('trustline not found, making a default one');
    
    // Prepare a TrustSet transaction to create a trust line
    trustset = {
      TransactionType: 'TrustSet',
      Account: issuing_address,
      LimitAmount: {
        value: '0',
        currency: currency_to_freeze,
        issuer: address_to_freeze,
      }
    };

    // For JS users, this lets you check if your transaction is well-formed
    validate(trustset) 

  } else {
    trustset = data[0].specification;
    console.log('trustline found. previous state:', trustline);
  }

  trustset.Flags = xrpl.TrustSetFlags.tfSetFreeze;

  console.log('submitting tx:', trustset);
  await client.submitReliable(wallet, trustset)

  client.disconnect()
}

main().catch(console.error)

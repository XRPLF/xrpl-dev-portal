const {RippleAPI} = require('ripple-lib');

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});
api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});

const issuing_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';
const issuing_secret = 's████████████████████████████';
    // Best practice: get your secret from an encrypted
    //  config file instead
const address_to_freeze = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v';
const currency_to_freeze = 'USD';

api.connect().then(() => {

  // Look up current state of trust line
  const options = {counterparty: address_to_freeze,
                 currency: currency_to_freeze};
  console.log('looking up', currency_to_freeze, 'trust line from',
              issuing_address, 'to', address_to_freeze);
  return api.getTrustlines(issuing_address, options);

}).then(data => {

  // Prepare a trustline transaction to enable freeze
  let trustline = {};
  if (data.length !== 1) {
    console.log('trustline not found, making a default one');
    trustline = {
      currency: currency_to_freeze,
      counterparty: address_to_freeze,
      limit: 0
    };
  } else {
    trustline = data[0].specification;
    console.log('trustline found. previous state:', trustline);
  }

  trustline.frozen = true;

  console.log('preparing trustline transaction for line:', trustline);
  return api.prepareTrustline(issuing_address, trustline);

}).then(prepared_tx => {

  // Sign and submit the trustline transaction
  console.log('signing tx:', prepared_tx.txJSON);
  const signed1 = api.sign(prepared_tx.txJSON, issuing_secret);
  console.log('submitting tx:', signed1.id);

  return api.submit(signed1.signedTransaction);
}).then(() => {
  return api.disconnect();
}).catch(console.error);

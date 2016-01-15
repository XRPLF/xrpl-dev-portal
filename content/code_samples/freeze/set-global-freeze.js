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

api.connect().then(() => {

  // Prepare a settings transaction to enable global freeze
  const settings = {
    'globalFreeze': true
  };

  console.log('preparing settings transaction for account:',
              issuing_address);
  return api.prepareSettings(issuing_address, settings);

}).then(prepared_tx => {

  // Sign and submit the settings transaction
  console.log('signing tx:', prepared_tx.txJSON);
  const signed1 = api.sign(prepared_tx.txJSON, issuing_secret);
  console.log('submitting tx:', signed1.id);

  return api.submit(signed1.signedTransaction);

}).then(() => {
  return api.disconnect();
}).catch(console.error);

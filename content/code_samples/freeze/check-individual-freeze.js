const {RippleAPI} = require('ripple-lib');

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});
api.on('error', (errorCode, errorMessage) => {
  console.log(errorCode + ': ' + errorMessage);
});

const my_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';
const counterparty_address = 'rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v';
const frozen_currency = 'USD';

api.connect().then(() => {

  // Look up current state of trust line
  const options = {counterparty: counterparty_address,
                   currency: frozen_currency};
  console.log('looking up', frozen_currency, 'trust line from',
              my_address, 'to', counterparty_address);
  return api.getTrustlines(my_address, options);

}).then(data => {

  if (data.length !== 1) {
    throw 'should only be 1 trust line per counterparty+currency pair';
  }

  const trustline = data[0];
  console.log('Trust line frozen from our side?',
              trustline.specification.frozen === true);
  console.log('Trust line frozen from counterparty\'s side?',
              trustline.counterparty.frozen === true);

}).then(() => {
  return api.disconnect();
}).catch(console.error);

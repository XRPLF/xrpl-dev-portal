'use strict';
/* import RippleAPI and support libraies*/
const {RippleAPI} = require('ripple-lib');
const assert = require('assert');

/* Credentials of the account placing the offer */
const my_addr = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';
const my_secret = 's████████████████████████████';

/* Define the order to place here */
const my_order = {
  'direction': 'buy',
  'quantity': {
    'currency': '',
    'counterparty': '',
    'value': ''
  },
  'totalPrice': {
    'currency': '',
    'counterparty': '',
    'value': ''
  }
};

/* milliseconds to wait between ledger checks*/
const INTERVAL = 1000;
/* Instantiate RippleAPI */
const api = new RippleAPI({server: 'wss://s1.ripple.com'});
/* number of ledgers to check for valid transaction before fail */
const ledgerOffset = 5;
const my_instructions = {maxLedgerVersionOffset: ledgerOffset};


/* function to verify a transaction is on the RCL */
function verifyTransaction(hash, options) {
  console.log('Verifing Transaction');
  return api.getTransaction(hash, options).then(data => {
    console.log('Result: ', data.outcome.result);
    console.log('Validated in Ledger: ', data.outcome.ledgerVersion);
    console.log('Sequence: ', data.sequence);
    return data.outcome.result === 'tesSUCCESS';
  }).catch(error => {
    /* if transaction not on current ledger try again until max ledger hit */
    if (error instanceof api.errors.PendingLedgerVersionError) {
      return new Promise((resolve, reject) => {
        setTimeout(() => verifyTransaction(hash, options)
		.then(resolve, reject), INTERVAL);
      });
    }
    return result;// TODO: Fix this. It's currently undefined.
  });
}


/* function to prepare, sign, and submit a transaction to the RCL
success verifies the transaction is being considered for the next ledger.
Still requires vlaidation */
function submitTransaction(lastClosedLedgerVersion, prepared, secret) {
  const signedData = api.sign(prepared.txJSON, secret);
  return api.submit(signedData.signedTransaction).then(data => {
    console.log('Result: ', data.resultCode);
    console.log('Message: ', data.resultMessage);
    /* if transaction was not successfully submitted throw error */
    assert.strictEqual(data.resultCode, 'tesSUCCESS');
    /* if successfully submitted fire off validation workflow */
    const options = {
      minLedgerVersion: lastClosedLedgerVersion,
      maxLedgerVersion: prepared.instructions.maxLedgerVersion
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => verifyTransaction(signedData.id, options)
	.then(resolve, reject), INTERVAL);
    });
  });
}


api.connect().then(() => {
  console.log('Connected');
  return api.prepareOrder(my_addr, my_order, my_instructions);
}).then(prepared => {
  console.log('Order Prepared');
  return api.getLedger().then(ledger => {
    console.log('Current Ledger', ledger.ledgerVersion);
    return submitTransaction(ledger.ledgerVersion, prepared, my_secret);
  });
}).then(() => {
  api.disconnect().then(() => {
    console.log('api disconnected');
    process.exit();
  });
}).catch(console.error);


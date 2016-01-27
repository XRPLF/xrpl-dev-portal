'use strict';
const {RippleAPI} = require('ripple-lib');

const api = new RippleAPI({
  server: 'wss://s1.ripple.com' // Public rippled server
});
api.connect().then(() => {
  /* begin custom code ------------------------------------ */
  const my_address = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn';

  console.log('getting account info for', my_address);
  return api.getAccountInfo(my_address);

// info => {...} is just a shorter syntax for function(info) {...}
}).then(info => {
  console.log(info);
  console.log('getAccountInfo done');

  /* end custom code -------------------------------------- */
}).then(() => {
  return api.disconnect();
}).then(()=> {
  console.log('done and disconnected.');
}).catch(console.error);

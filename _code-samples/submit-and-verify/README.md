# Submit and Verify

Submit a signed transaction blob and wait until it has a final result.

- [submit-and-verify.js](js/submit-and-verify.js): ripple-lib 1.x version.
- [submit-and-verify2.js](js/submit-and-verify2.js): xrpl.js 2.x version. Unlike the submitAndWait() method built into xrpl.js, this checks the server's available history and returns a different code when the transaction's status is unknowable with the server's available history versus if the transaction was _definitely_ not confirmed by consensus.

Example usage (ripple-lib 1.x):

```js
// example testnet creds. Don't use for real
const address = "raXDGCShEGqYz2d94qkv1UmAh2uJd3UTea"
const secret = "ssNBEKCkEY3W6YFfrjcSoNit91Vvj"
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
api.on('connected', async () => {
  const prepared = await api.prepareTransaction({
    "TransactionType": "AccountSet",
    "Account": address
  })
  const signed = api.sign(prepared.txJSON, secret)

  const result = await submit_and_verify(api, signed.signedTransaction)

  if (result == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${signed.id}`)
  } else if (result == "unknown") {
    console.log(`Transaction status unknown. `)
  } else if (result == "tefMAX_LEDGER") {
    console.log(`Transaction failed to achieve a consensus.`)
  } else {
    console.log(`Transaction failed with code ${result}: https://testnet.xrpl.org/transactions/${signed.id}`)
  }
}
```

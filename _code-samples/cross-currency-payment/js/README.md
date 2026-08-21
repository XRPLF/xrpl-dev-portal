# Cross-Currency Payment Examples (JavaScript)

Sends a cross-currency payment where the source spends XRP and the destination is credited in USD, converted through the DEX order book.

## Setup

```sh
npm i
```

## Send a Cross-Currency Payment

```sh
node sendCrossCurrency.js
```

Delivers 100 USD to the receiver, spending up to 30 XRP from the source, and prints the `delivered_amount` from the transaction metadata. If `crossCurrencySetup.json` is missing, the script runs `crossCurrencySetup.js` first to create the issuer, market maker, sender, and receiver accounts and to post the XRP/USD liquidity.

```sh
Sender address:   rSENDER...
Receiver address: rRECEIVER...

=== Preparing cross-currency Payment ===

{
  "TransactionType": "Payment",
  "Account": "rSENDER...",
  "Destination": "rRECEIVER...",
  "Amount": {
    "currency": "USD",
    "issuer": "rISSUER...",
    "value": "100"
  },
  "SendMax": "30000000",
  "DeliverMin": {
    "currency": "USD",
    "issuer": "rISSUER...",
    "value": "95"
  },
  "Flags": 131072
}

=== Submitting cross-currency Payment ===

=== Payment delivered ===

delivered_amount: { currency: 'USD', issuer: 'rISSUER...', value: '100' }
```

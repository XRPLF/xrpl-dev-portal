# Cross-Currency Payment Examples (Python)

Sends a cross-currency payment where the source spends XRP and the destination is credited in USD, converted through the DEX order book.

## Setup

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Send a Cross-Currency Payment

```sh
python3 send_cross_currency.py
```

Delivers 100 USD to the receiver, spending up to 30 XRP from the source, and prints the `delivered_amount` from the transaction metadata. If `cross_currency_setup.json` is missing, the script runs `cross_currency_setup.py` first to create the issuer, market maker, sender, and receiver accounts and to post the XRP/USD liquidity.

```sh
Sender address:   rSENDER...
Receiver address: rRECEIVER...

=== Preparing cross-currency Payment ===

{
  "Account": "rSENDER...",
  "TransactionType": "Payment",
  "Amount": {
    "currency": "USD",
    "issuer": "rISSUER...",
    "value": "100"
  },
  "Destination": "rRECEIVER...",
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

delivered_amount: {'currency': 'USD', 'issuer': 'rISSUER...', 'value': '100'}
```

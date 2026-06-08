# Send an MPT Examples (Go)

Example code for sending a Multi-Purpose Token (MPT) between non-issuer holders on testnet with [xrpl-go](https://github.com/Peersyst/xrpl-go).

All commands should be run from this `go/` directory.

## Setup

```sh
go mod tidy
```

## Send an MPT

```sh
go run ./send-mpt
```

You should see output like the following:

```sh
Sender address:   r3zgkbXnCMbboeTR1j6B2pmhXbSM4X7j77
MPT issuance ID:  01146CC7A59998C1C53000D7D7D9B6139433E524DD2E3EFA

Creating and funding receiver wallet...
Receiver address: rMoJmBRpBKik9imVCYGdsnhogyLr7ECJHo

=== Authorizing receiver to hold the MPT... ===

{
  "Account": "rMoJmBRpBKik9imVCYGdsnhogyLr7ECJHo",
  "MPTokenIssuanceID": "01146CC7A59998C1C53000D7D7D9B6139433E524DD2E3EFA",
  "TransactionType": "MPTokenAuthorize"
}
Receiver authorized to hold the MPT!
Explorer link: https://testnet.xrpl.org/transactions/EB9D332E135FC13FB61E91D23D12B4CEA7EFAC9F1DEC07346028D940013BCFEE

=== Checking initial MPT balances for issuance 01146CC7A59998C1C53000D7D7D9B6139433E524DD2E3EFA... ===

Sender balance:   400
Receiver balance: 0

=== Sending MPT payment... ===

{
  "Account": "r3zgkbXnCMbboeTR1j6B2pmhXbSM4X7j77",
  "Amount": {
    "mpt_issuance_id": "01146CC7A59998C1C53000D7D7D9B6139433E524DD2E3EFA",
    "value": "100"
  },
  "Destination": "rMoJmBRpBKik9imVCYGdsnhogyLr7ECJHo",
  "TransactionType": "Payment"
}
Payment successful!
Explorer link: https://testnet.xrpl.org/transactions/3CBEC91ED27A2FC6674DAEB586DA960D25660F32C4190D03FED77ADFFC3154E8

=== Checking final MPT balances for issuance 01146CC7A59998C1C53000D7D7D9B6139433E524DD2E3EFA... ===

Sender balance:   300
Receiver balance: 100
```

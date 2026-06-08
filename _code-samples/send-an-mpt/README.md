# Send an MPT Examples

Sample code for the [Send a Multi-Purpose Token (MPT)](https://xrpl.org/docs/tutorials/payments/send-an-mpt) tutorial. Each tutorial script funds a fresh receiver, authorizes it to hold the MPT, snapshots both accounts' MPT balances, has a preconfigured sender forward 100 MPT units to the receiver, and reads both balances again from the validated ledger to confirm the transfer.

| Language | Folder |
|---|---|
| JavaScript (xrpl.js) | [`js/`](./js) |
| Python (xrpl-py) | [`py/`](./py) |
| Go (xrpl-go) | [`go/`](./go) |

Each subfolder has its own README with run instructions. All three implementations target testnet.

Every tutorial script is paired with a setup script that creates an issuer, issues an MPT with the `Can Transfer` flag, funds a sender, authorizes the sender, and seeds the sender with MPTs. The setup script writes a `<topic>-setup.json` (gitignored) that the tutorial script reads on launch. The tutorial script runs the setup script automatically if that JSON file is missing — so the first run sets everything up, and subsequent runs reuse the same issuer, MPT, and sender.

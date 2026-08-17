# Inspect Fungible Token Properties

Read-only code samples that inspect the on-chain properties of the two XRP Ledger
fungible token types:

- **Trust line tokens** — settings stored on the issuer's `AccountRoot` (transfer
  fee, auth requirement, other flags) plus per-line data on `RippleState` entries.
- **Multi-Purpose Tokens (MPTs)** — settings stored on the `MPTokenIssuance` entry
  (transfer fee, flags, XLS-89 metadata).

The Trust Line inspector also fetches the issuer's historical `TransferRate`
changes via `account_tx`, filtered to `AccountSet` transactions.

The scripts default to the Devnet example tokens referenced in
[XRPLF/xrpl-dev-portal#3740](https://github.com/XRPLF/xrpl-dev-portal/issues/3740).

## Layout

```
inspect-fungible-token/
├── js/    inspect-trust-line-token.js       inspect-mpt.js
├── py/    inspect_trust_line_token.py       inspect_mpt.py
└── go/    inspect-trust-line-token/main.go  inspect-mpt/main.go
```

## Run

### JavaScript

```sh
cd js
npm install
node inspect-trust-line-token.js [issuer] [currency]
node inspect-mpt.js [mpt_issuance_id]
```

### Python

```sh
cd py
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python inspect_trust_line_token.py [issuer] [currency]
python inspect_mpt.py [mpt_issuance_id]
```

### Go

```sh
cd go
go mod tidy
go run ./inspect-trust-line-token [issuer] [currency]
go run ./inspect-mpt [mpt_issuance_id]
```

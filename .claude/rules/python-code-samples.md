---
paths:
  - "_code-samples/**/*.py"
---

# XRPL Python Code Sample Conventions

Code samples come in **two flavors** with very different conventions. Identify which you're writing first.

| Flavor | Filename pattern | Audience | Priority |
|---|---|---|---|
| **Tutorial** | `<verb>_<thing>.py` (e.g., `create_loan_broker.py`) | A dev reading & learning the protocol | Clarity over speed |
| **Setup** | `<area>_setup.py` (e.g., `lending_setup.py`) | A dev who never opens this file — runs to prep accounts/credentials/MPT/vault | Speed over clarity |

If a file isn't clearly one or the other, default to tutorial conventions.

---

## Shared across both flavors

- Library: `xrpl-py>=4.5.0` in `requirements.txt`
- File names use `snake_case`
- Variables use `snake_case` (e.g., `loan_broker`, `mpt_id`, `vault_id`, `loan_broker_id`)
- Tutorial scripts read setup data; setup scripts write it. Both use the same JSON key style (`snake_case`: `loan_broker`, `credential_issuer`, `mpt_id`, `domain_id`, `loan_broker_id`).

---

## Tutorial files

### Client and runtime
- **Sync API only** — `from xrpl.clients import JsonRpcClient`, `from xrpl.transaction import submit_and_wait`, `from xrpl.wallet import Wallet`. No `asyncio`.
- Devnet RPC endpoint: `https://s.devnet.rippletest.net:51234`
- No `main()` function, no `if __name__ == "__main__":` — script runs top-to-bottom

### Structure
1. Multi-line `# IMPORTANT:` header explaining what the script demonstrates and any preconditions (e.g., "uses an existing account that has a PRIVATE vault")
2. Imports
3. Client setup
4. Auto-run setup script if the JSON data is missing:
   ```python
   if not os.path.exists("lending_setup.json"):
       print("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n")
       subprocess.run([sys.executable, "lending_setup.py"], check=True)
   ```
5. Load wallets and IDs from setup JSON via `Wallet.from_seed(setup_data["..."]["seed"])`
6. One transaction per major step, each with its own visible `=== Header ===`

### Output style
- Section comments in code use `# Section description ----------------------` (with the dash visual)
- Print a `=== Section Name ===` banner before each major step:
  ```python
  print("\n=== Preparing LoanBrokerSet transaction ===\n")
  ```
- Print every transaction as JSON before submitting: `print(json.dumps(tx.to_xrpl(), indent=2))`
- Print a `=== Section Name ===` banner before extracting results too

### Result handling
- Always check `submit_response.result["meta"]["TransactionResult"]` explicitly:
  ```python
  if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
      result_code = submit_response.result["meta"]["TransactionResult"]
      print(f"Error: Unable to create loan broker: {result_code}")
      sys.exit(1)
  ```
- Don't wrap in try/except — let failures be visible

---

## Setup files

### Client and runtime
- **Async API only** — `from xrpl.asyncio.clients import AsyncWebsocketClient`, `xrpl.asyncio.wallet.generate_faucet_wallet`, `xrpl.asyncio.transaction` (`submit_and_wait`, `autofill`, `sign`)
- Devnet WebSocket endpoint: `wss://s.devnet.rippletest.net:51233`
- Wrap in `async def main(): ...` with `async with AsyncWebsocketClient(URL) as client:` at the top, and `asyncio.run(main())` at the bottom

### Speed-first patterns (required when possible)
- Run independent transactions concurrently with `await asyncio.gather(...)`
- When fanning out parallel transactions from the same account, batch them first via `TicketCreate(ticket_count=N)`, then pass `ticket_sequence=...` and `sequence=0` on each parallel tx
- (Future) When the `Batch` transaction is re-enabled, prefer it over tickets for atomic multi-tx groups
- Imports of models go in one alphabetized parenthesized block

### Output style
- Top comment: single line, `# Setup script for lending protocol tutorials`
- Only output is a carriage-return progress indicator: `print("Setting up tutorial: N/7", end="\r")` between phases
- No `=== Section ===` banners, no transaction dumps — the user never sees this file's output beyond the progress counter
- Section comments in code are short: `# Section description` (no dash visual)

### Output file
At the end, write all wallet/ID data the tutorials will need:
```python
with open("lending_setup.json", "w") as f:
    json.dump(setup_data, f, indent=2)
```

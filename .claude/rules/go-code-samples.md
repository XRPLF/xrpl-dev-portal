---
paths:
  - "_code-samples/**/*.go"
---

# XRPL Go Code Sample Conventions

Code samples come in **two flavors** with very different conventions. Identify which you're writing first.

| Flavor | Folder pattern | Audience | Priority |
|---|---|---|---|
| **Tutorial** | `<verb>-<thing>/main.go` (e.g., `create-loan-broker/main.go`) | A dev reading & learning the protocol | Clarity over speed |
| **Setup** | `<area>-setup/main.go` (e.g., `lending-setup/main.go`) | A dev who never opens this file — runs to prep accounts/credentials/MPT/vault | Speed over clarity |

If a file isn't clearly one or the other, default to tutorial conventions.

---

## Shared across both flavors

- Library: `github.com/Peersyst/xrpl-go v0.1.17` in `go.mod`
- `go 1.24.3` minimum
- Each command is its own `kebab-case` subdir with one `main.go`; users run with `go run ./<command-name>` from the language root
- One `go.mod` per sample folder at the language root (e.g., `_code-samples/lending-protocol/go/go.mod`)
- Variables: `camelCase` with acronyms uppercased — `loanBrokerWallet`, `mptID`, `vaultID`, `loanBrokerID`, `credIssuerWallet`
- Wallet variables always end in `Wallet` (e.g., `loanBrokerWallet`) to distinguish from `loanBrokerID`
- Setup JSON keys use `camelCase` (`loanBroker`, `credentialIssuer`, `mptID`, `vaultID`, `loanBrokerID`) — matches the JS convention

### Pointer helper
For any `main.go` that sets optional pointer fields, include this helper near the top:
```go
// ptr is a helper that returns a pointer to the given value,
// used for setting optional transaction fields in Go.
func ptr[T any](v T) *T { return &v }
```

---

## Tutorial files

### Transport
- **WebSocket** — `github.com/Peersyst/xrpl-go/xrpl/websocket`
- Devnet endpoint: `wss://s.devnet.rippletest.net:51233`
- Pattern:
  ```go
  client := websocket.NewClient(
      websocket.NewClientConfig().
          WithHost("wss://s.devnet.rippletest.net:51233"),
  )
  defer client.Disconnect()
  if err := client.Connect(); err != nil { panic(err) }
  ```

### Structure
1. Multi-line `// IMPORTANT:` header explaining what the script demonstrates and any preconditions (e.g., "uses an existing account that has a PRIVATE vault")
2. `package main` + imports
3. Client connection (with `defer client.Disconnect()`)
4. Auto-run setup if data is missing:
   ```go
   if _, err := os.Stat("lending-setup.json"); os.IsNotExist(err) {
       fmt.Printf("\n=== Lending tutorial data doesn't exist. Running setup script... ===\n\n")
       cmd := exec.Command("go", "run", "./lending-setup")
       cmd.Stdout = os.Stdout
       cmd.Stderr = os.Stderr
       if err := cmd.Run(); err != nil { panic(err) }
   }
   ```
5. Load wallet seeds and IDs from setup JSON via `wallet.FromSecret(setup["loanBroker"].(map[string]any)["seed"].(string))`
6. One transaction per major step, each with its own visible `=== Header ===`

### Output style
- Section comments in code use `// Section description ----------------------` (with the dash visual)
- Print a `=== Section Name ===` banner before each major step:
  ```go
  fmt.Printf("\n=== Preparing LoanBrokerSet transaction ===\n\n")
  ```
- Print every transaction as JSON before submitting:
  ```go
  flatTx := tx.Flatten()
  txJSON, _ := json.MarshalIndent(flatTx, "", "  ")
  fmt.Printf("%s\n", string(txJSON))
  ```
- Submit with the explicit options form: `client.SubmitTxAndWait(flatTx, &wstypes.SubmitOptions{Autofill: true, Wallet: &w})`

### Result handling
- Always check `Meta.TransactionResult` explicitly:
  ```go
  if resp.Meta.TransactionResult != "tesSUCCESS" {
      fmt.Printf("Error: Unable to create loan broker: %s\n", resp.Meta.TransactionResult)
      os.Exit(1)
  }
  ```
- Use `panic(err)` for unexpected errors (network/marshal failures), `os.Exit(1)` for expected protocol failures with a printed message

---

## Setup files

### Transport
- **RPC, not WebSocket** — `github.com/Peersyst/xrpl-go/xrpl/rpc`
- Devnet endpoint: `https://s.devnet.rippletest.net:51234`
- Pattern:
  ```go
  cfg, err := rpc.NewClientConfig(
      "https://s.devnet.rippletest.net:51234",
      rpc.WithFaucetProvider(faucet.NewDevnetFaucetProvider()),
  )
  if err != nil { panic(err) }
  client := rpc.NewClient(cfg)

  submitOpts := func(w *wallet.Wallet) *rpctypes.SubmitOptions {
      return &rpctypes.SubmitOptions{Autofill: true, Wallet: w}
  }
  ```
- No `defer client.Disconnect()` — RPC is HTTP

### Speed-first patterns (required when possible)
- Use goroutines + buffered channels for fan-out parallelism (not `errgroup` or `sync.WaitGroup`)
- Each goroutine handles one transaction and sends its result (or `struct{}{}` for void) into a channel; main drains the channels in order
- When fanning out parallel transactions from the same account, create tickets first via `TicketCreate` with `TicketCount: N`, then set `Sequence: 0` and `TicketSequence: ...` on the `BaseTx` of each parallel tx
- (Future) When the `Batch` transaction is re-enabled, prefer it over tickets for atomic multi-tx groups
- `FundWallet` returns before the account is queryable on ledger — poll `account.InfoRequest` with `LedgerIndex: common.Validated` (up to ~20 seconds) before using the wallet

### Output style
- Top comment: single line, `// Setup script for lending protocol tutorials` above `package main`
- Only output is a carriage-return progress indicator: `fmt.Print("Setting up tutorial: N/7\r")` between phases
- No `=== Section ===` banners, no transaction dumps — the user never sees this file's output beyond the progress counter
- Section comments in code are short: `// Section description` (no dash visual)

### Output file
At the end, write all wallet/ID data the tutorials will need. Use an anonymous struct with `json:"camelCase"` tags so field order is preserved:
```go
setupData := struct {
    Description  string `json:"description"`
    LoanBroker   any    `json:"loanBroker"`
    DomainID     string `json:"domainID"`
    MptID        string `json:"mptID"`
    VaultID      string `json:"vaultID"`
    LoanBrokerID string `json:"loanBrokerID"`
}{ ... }
jsonData, _ := json.MarshalIndent(setupData, "", "  ")
os.WriteFile("lending-setup.json", jsonData, 0644)
```
- Output filename uses `kebab-case` (matches the subdir name): `lending-setup.json`

### Error handling
- Use `panic(err)` on every error path — these are tutorial samples and a panic surfaces the failing line clearly. Don't silently `continue` or `_ = err`.

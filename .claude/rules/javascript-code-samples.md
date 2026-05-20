---
paths:
  - "_code-samples/**/*.js"
---

# XRPL JavaScript Code Sample Conventions

Code samples come in **two flavors** with very different conventions. Identify which you're writing first.

| Flavor | Filename pattern | Audience | Priority |
|---|---|---|---|
| **Tutorial** | `<verb><Thing>.js` (e.g., `createLoanBroker.js`) | A dev reading & learning the protocol | Clarity over speed |
| **Setup** | `<area>Setup.js` (e.g., `lendingSetup.js`) | A dev who never opens this file — runs to prep accounts/credentials/MPT/vault | Speed over clarity |

If a file isn't clearly one or the other, default to tutorial conventions.

## Shared across both flavors

- Library: `xrpl ^4.6.0` in `package.json`
- ESM modules: `"type": "module"`; `import xrpl from 'xrpl'`
- Top-level `await` (Node 18+); no `main()` wrapper
- Devnet WebSocket: `wss://s.devnet.rippletest.net:51233`
- Style: 2-space indent, single quotes, no semicolons
- File names: `camelCase` (e.g., `createLoan.js`)
- Variables: `camelCase` with acronyms uppercased — `loanBroker`, `mptID`, `vaultID`, `loanBrokerID`, `credentialIssuer`
- Transaction object keys are XRPL native PascalCase (`TransactionType`, `Account`, `Amount`) — never transform them
- Setup JSON keys use `camelCase` (`loanBroker`, `credentialIssuer`, `mptID`, `vaultID`, `loanBrokerID`)
- End with `await client.disconnect()`

## Tutorial files

### Structure
1. Multi-line `// IMPORTANT:` header explaining what the script demonstrates and any preconditions (e.g., "uses an existing account that has a PRIVATE vault")
2. Imports
3. `const client = new xrpl.Client('wss://...')` + `await client.connect()`
4. Auto-run setup script if the JSON data is missing:
   ```js
   if (!fs.existsSync('lendingSetup.json')) {
     console.log(`\n=== Lending tutorial data doesn't exist. Running setup script... ===\n`)
     execSync('node lendingSetup.js', { stdio: 'inherit' })
   }
   ```
5. Load wallets and IDs from setup JSON via `xrpl.Wallet.fromSeed(setupData.X.seed)`
6. One transaction per major step, each with its own visible `=== Header ===`

### Output style
- Section comments in code use `// Section description ----------------------` (with the dash visual)
- Print a `=== Section Name ===` banner before each major step:
  ```js
  console.log(`\n=== Preparing LoanBrokerSet transaction ===\n`)
  ```
- Build transactions as plain object literals; validate before submitting:
  ```js
  xrpl.validate(loanBrokerSetTx)
  console.log(JSON.stringify(loanBrokerSetTx, null, 2))
  ```
- Submit with the explicit options form: `await client.submitAndWait(tx, { wallet, autofill: true })`

### Result handling
- Always check `result.meta.TransactionResult` explicitly:
  ```js
  if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
    const resultCode = submitResponse.result.meta.TransactionResult
    console.error('Error: Unable to create loan broker:', resultCode)
    await client.disconnect()
    process.exit(1)
  }
  ```
- Always `await client.disconnect()` before `process.exit(1)`
- Don't wrap in try/catch — let failures be visible

### Dual-signed transactions
For `LoanSet`-style transactions that require both broker and counterparty signatures:
```js
const tx = await client.autofill({ ... })
const brokerSigned = loanBroker.sign(tx)
const decoded = xrpl.decode(brokerSigned.tx_blob)
const fullySigned = xrpl.signLoanSetByCounterparty(borrower, decoded)
await client.submitAndWait(fullySigned.tx)
```

## Setup files

### Speed-first patterns (required when possible)
- Run independent transactions concurrently with `await Promise.all([...])`
- When fanning out parallel transactions from the same account, batch them first via `TicketCreate` with `TicketCount: N`, then pass `Sequence: 0` and `TicketSequence: ticketArr[i]` on each parallel tx
- (Future) When the `Batch` transaction is re-enabled, prefer it over tickets for atomic multi-tx groups
- Destructure response arrays: `const [{ wallet: loanBroker }, { wallet: borrower }] = await Promise.all([client.fundWallet(), client.fundWallet()])`
- Use object property shorthand when key and variable match: `{ domainID, mptID, vaultID, loanBrokerID }`

### Output style
- Top comment: single line, `// Setup script for lending protocol tutorials`
- Only output is a carriage-return progress indicator: `process.stdout.write('Setting up tutorial: N/7\r')` between phases
- No `=== Section ===` banners, no `xrpl.validate(tx)`, no transaction dumps — the user never sees this file's output beyond the progress counter
- Section comments in code are short: `// Section description` (no dash visual)
- If a library call emits a warning the reader doesn't need (e.g., `LoanSet` autofill warning), silence it locally with a one-line comment explaining why: `console.warn = () => {}`

### Output file
At the end, write all wallet/ID data the tutorials will need:
```js
fs.writeFileSync('lendingSetup.json', JSON.stringify(setupData, null, 2))
```

# OWS — Open Wallet Standard: XRPL Integration Reference

> **Audience:** Developers integrating AI agents with XRPL signing via OWS.  
> **OWS version:** `@open-wallet-standard/core` v1.x  
> **Scope:** SDK-level integration. Time-based and network-based policy enforcement
> are available today. Amount and destination enforcement land in OWS v3 (see
> [V3 Roadmap](#v3-roadmap)).

---

## Contents

1. [What OWS is](#1-what-ows-is)
2. [SDK reference](#2-sdk-reference)
3. [XRPL signing flow](#3-xrpl-signing-flow)
4. [Policy setup](#4-policy-setup)
5. [What OWS enforces (v2)](#5-what-ows-enforces-v2)
6. [Application-layer enforcement](#6-application-layer-enforcement)
7. [Python integration](#7-python-integration)
8. [Migrating from env-var (Pattern 1) to OWS (Pattern 3)](#8-migrating-from-env-var-to-ows)
9. [Access modes: SDK vs MCP/REST](#9-access-modes-sdk-vs-mcprest)
10. [Error reference](#10-error-reference)
11. [V3 roadmap](#v3-roadmap)

---

## 1. What OWS is

The Open Wallet Standard (OWS) is a local, policy-gated signing standard for AI
agents and developer tools. It provides a single interface for key management,
policy enforcement, and transaction signing across multiple chains. XRPL is a
first-class supported chain: wallets derive XRPL addresses at `m/44'/144'/0'/0/0`
(secp256k1), and `signTransaction` applies XRPL's canonical signing algorithm
internally.

In the XRPL AI Starter Kit, OWS is **the signing layer for production deployments**.
The agent constructs unsigned transactions, the XRPL Agent Wallet skill evaluates
policies and calls OWS for signing, and OWS decrypts the key, signs, then wipes
the key immediately. The agent never holds raw key material.

```
AI Agent
    │  constructs unsigned tx (xrpl.js / xrpl-py)
    │  applies source tag
    ▼
XRPL Agent Wallet skill
    │  autofill → human preview → confirm
    ▼
OWS signTransaction("xrpl", txHex)
    │
    ├── Policy Engine  ← registered policy executables
    │       │
    │       ├── PASS → decrypt key → sign → wipe key → return { signature }
    │       └── FAIL → throw (key never decrypted)
    │
    ▼
Wallet skill applies TxnSignature → encodes signed tx → submitAndWait
```

**OWS is not a session-based adapter.** There is no `connect()` / `disconnect()`
on the SDK. Functions are stateless and operate on the local vault
(`~/.ows/wallets/`).

Install:

```bash
npm install @open-wallet-standard/core
```

---

## 2. SDK Reference

### Core types

```typescript
interface AccountInfo {
  chainId:        string; // CAIP-2, e.g. "xrpl:mainnet"
  address:        string; // XRPL base58check, e.g. "r..."
  derivationPath: string; // "m/44'/144'/0'/0/0"
}

interface WalletInfo {
  id:        string;
  name:      string;
  accounts:  AccountInfo[];
  createdAt: string;       // ISO 8601
}

interface SignResult {
  signature:   string;  // hex-encoded DER secp256k1 signature
  recoveryId?: number;
}

interface ApiKeyResult {
  token: string; // raw token — shown once, save immediately
  id:    string;
  name:  string;
}
```

### Wallet management

```typescript
import {
  createWallet, getWallet, listWallets,
  importWalletMnemonic, importWalletPrivateKey,
} from "@open-wallet-standard/core";

// Create (derives XRPL address automatically)
const wallet: WalletInfo = createWallet("xrpl-agent", passphrase);

// Retrieve by name or ID
const wallet: WalletInfo = getWallet("xrpl-agent");

// Get the XRPL address
const xrplAccount = wallet.accounts.find(a => a.chainId.startsWith("xrpl"));
// xrplAccount.address => "r..."
```

### Signing

```typescript
import { signTransaction, signAndSend } from "@open-wallet-standard/core";

// Sign only — returns raw DER signature.
// Caller applies TxnSignature and re-encodes (see §3).
const { signature }: SignResult = signTransaction(
  "xrpl-agent",  // wallet name or ID
  "xrpl",        // chain identifier
  txHex,         // XRPL canonical binary hex (from xrpl.js encode())
  passphrase,    // vault passphrase — load from env, never hardcode
  0,             // derivation index (default: 0)
);

// Sign and broadcast in one call (skips Wallet skill submission step).
// Prefer signTransaction + manual submitAndWait in agentic flows to preserve
// the Wallet skill's hash-persistence and error-handling discipline.
const sent = signAndSend("xrpl-agent", "xrpl", txHex, passphrase, 0, "wss://xrplcluster.com");
```

### Policy management

```typescript
import { createPolicy, listPolicies, deletePolicy } from "@open-wallet-standard/core";

createPolicy(JSON.stringify({
  id:         "business-hours",
  name:       "Business Hours UTC",
  executable: "/usr/local/bin/ows-policy-time-window",
  config:     { start: "09:00", end: "17:00", timezone: "UTC",
                days: ["monday","tuesday","wednesday","thursday","friday"] },
  action:     "deny",
}));
```

### API key management

```typescript
import { createApiKey } from "@open-wallet-standard/core";

const key = createApiKey(
  "xrpl-ai-agent-prod",     // key name
  [wallet.id],               // wallet IDs this key can access
  ["business-hours"],        // policy IDs evaluated per request
  passphrase,
  "2027-01-01T00:00:00Z",   // optional expiry
);
// key.token is shown once — save to your secrets manager immediately.
```

---

## 3. XRPL Signing Flow

OWS returns the raw DER-encoded secp256k1 signature, not a complete signed blob.
The Wallet skill assembles the signed transaction:

1. **Encode** the autofilled transaction with xrpl.js `encode()`
2. Call `signTransaction("xrpl", txHex)` → receive `{ signature }`
3. **Apply** `TxnSignature = signature.toUpperCase()` to the transaction object
4. **Re-encode** the complete signed transaction
5. **Submit** via `client.submitAndWait(signedBlob)`

OWS handles XRPL-specific internals: prepends signing prefix `0x53545800`,
computes SHA-512 half (XRPL's signing hash), signs with secp256k1 (DER-encoded).

### Complete example (TypeScript)

```typescript
import { signTransaction, getWallet } from "@open-wallet-standard/core";
import { Client, encode, xrpToDrops } from "xrpl";

const OWS_PASSPHRASE = process.env.OWS_PASSPHRASE ?? "";  // never hardcode

async function signAndSubmitPayment(params: {
  walletName:  string;
  sender:      string;
  destination: string;
  amountXRP:   string;
  client:      Client;
}) {
  const { walletName, sender, destination, amountXRP, client } = params;

  // 1. Build unsigned transaction (SourceTag set by Wallet skill if absent)
  const tx = {
    TransactionType: "Payment",
    Account:         sender,
    Destination:     destination,
    Amount:          xrpToDrops(amountXRP),
  };

  // 2. Autofill Fee, Sequence, LastLedgerSequence
  const prepared = await client.autofill(tx as any);

  // 3. Encode to XRPL canonical binary hex
  const txHex = encode(prepared as Record<string, unknown>);

  // 4. OWS: evaluate policies → decrypt key → sign → wipe key
  const { signature } = signTransaction(walletName, "xrpl", txHex, OWS_PASSPHRASE);

  // 5. Apply signature and re-encode
  const signedTx   = { ...prepared, TxnSignature: signature.toUpperCase() };
  const signedBlob = encode(signedTx as Record<string, unknown>);

  // 6. Submit
  return client.submitAndWait(signedBlob);
}
```

---

## 4. Policy Setup

### How policies work

OWS invokes each registered policy executable with a `PolicyContext` on stdin
and reads `{ allow: boolean, reason?: string }` from stdout. If any policy with
`action: "deny"` returns `allow: false`, signing is rejected and the key is
never decrypted.

```typescript
// PolicyContext (passed to each executable on stdin)
interface PolicyContext {
  transaction: string;           // serialized tx hex
  chainId:     string;           // "xrpl"
  wallet:      WalletInfo;
  timestamp:   string;           // ISO 8601
  apiKeyId:    string;
}
```

### Time-window policy

```typescript
createPolicy(JSON.stringify({
  id:         "business-hours",
  executable: "/usr/local/bin/ows-policy-time-window",
  config: {
    start: "09:00", end: "17:00", timezone: "UTC",
    days:  ["monday","tuesday","wednesday","thursday","friday"],
  },
  action: "deny",
}));
```

### Network/chain restriction policy

```typescript
createPolicy(JSON.stringify({
  id:         "mainnet-only",
  executable: "/usr/local/bin/ows-policy-chain-allowlist",
  config:     { allowedChains: ["xrpl:mainnet"] },
  action:     "deny",
}));
```

---

## 5. What OWS Enforces (v2)

| Policy type | Enforced today | Notes |
| :---- | :---- | :---- |
| Time-window restrictions | ✓ | Per-day or per-weekday, any IANA timezone |
| Network / chain restrictions | ✓ | Via chain-allowlist policy executable |
| Source tag presence | ✗ | Application-layer responsibility (see §6) |
| Amount limits | ✗ | V3 roadmap |
| Destination allow/block list | ✗ | V3 roadmap |
| Transaction type restrictions | ✗ | V3 roadmap |
| TakerPays / TakerGets limits | ✗ | V3 roadmap |

OWS v2 policy executables receive the full serialized transaction hex but
built-in policies only parse metadata (timestamp, chain). Custom executables can
parse XRPL binary themselves — this is how v3 built-ins will work.

---

## 6. Application-Layer Enforcement

### Source tag (required)

OWS does not enforce source tag presence. The XRPL Agent Wallet skill applies
`SourceTag = 20260530` to every transaction that passes through the signing
ceremony if no `SourceTag` is already set. Domain skills (Trading, Payments) may
override with a custom value before handoff.

**All transactions from the XRPL AI Starter Kit must carry a `SourceTag`.**

### Domain skill guardrails

Domain skills apply pre-flight checks before calling the Wallet skill:

- **Trading skill:** reserve adequacy, trust line existence, expiry sanity, flag conflicts
- **Payments skill:** trust line existence, destination tag requirements, reserve checks

These are application-layer checks — not ledger-enforced. They only apply when
the skill is loaded. OWS v3 will add equivalent enforcement at the vault layer.

---

## 7. Python Integration

The OWS SDK is Node.js only. Python agents have two options:

### Option A: OWS CLI subprocess (simple, no server required)

```python
import json, subprocess

def ows_sign(wallet_name: str, tx_hex: str) -> str:
    """Returns uppercase DER signature hex."""
    proc = subprocess.run(
        ["ows", "sign", "tx",
         "--wallet", wallet_name,
         "--chain",  "xrpl",
         "--tx",     tx_hex],
        capture_output=True, text=True, check=True,
    )
    return json.loads(proc.stdout)["signature"].upper()
```

Apply the signature and submit:

```python
from xrpl.core.binarycodec import encode, decode

signed_dict = decode(tx_hex)             # start from the autofilled hex
signed_dict["TxnSignature"] = ows_sign(wallet_name, tx_hex)
signed_blob = encode(signed_dict)
# → client.request(SubmitOnly(tx_blob=signed_blob))  or use submitAndWait equivalent
```

### Option B: OWS MCP/REST server

```bash
# Start the OWS MCP server (built into OWS)
ows mcp

# Or REST server
ows rest --port 8080
```

Then call the signing endpoint from Python via `httpx` or `requests`. See the
OWS documentation at https://docs.openwallet.sh for the API spec.

---

## 8. Migrating from Env-Var to OWS

Migrating from Pattern 1 (env-var) to Pattern 3 (OWS) does **not** require
generating a new XRPL wallet. Import the existing seed:

```typescript
import { importWalletPrivateKey } from "@open-wallet-standard/core";

// Import the existing seed (Pattern 1 → Pattern 3)
const wallet = importWalletPrivateKey(
  "xrpl-agent",                           // new wallet name in OWS vault
  process.env.XRPL_SEED!,                 // your existing seed
  passphrase,                             // new OWS vault passphrase
);
// wallet.accounts[n].address matches your existing XRPL address
```

After migration:
1. Remove `XRPL_SEED` from `.env` and your secrets store — the key now lives in the OWS vault
2. Add `OWS_PASSPHRASE` to your secrets store
3. Replace `Wallet.fromSeed(process.env.XRPL_SEED)` + `wallet.sign()` calls with the OWS signing flow (§3)
4. Register your policies (§4)
5. Create an API key if using the MCP/REST access mode (§9)

**Code change summary:**

| Before (Pattern 1) | After (Pattern 3) |
| :---- | :---- |
| `Wallet.fromSeed(process.env.XRPL_SEED)` | `getWallet("xrpl-agent")` → extract address |
| `wallet.sign(prepared)` → `{ tx_blob }` | `encode(prepared)` → `signTransaction(...)` → apply `TxnSignature` → `encode(signedTx)` |
| `client.submitAndWait(tx_blob)` | `client.submitAndWait(signedBlob)` |

The autofill, preview, and submission steps in the Wallet skill are unchanged.

---

## 9. Access Modes: SDK vs MCP/REST

| | Direct SDK | OWS MCP / REST |
| :---- | :---- | :---- |
| Auth | Vault passphrase | API key (token) |
| Policy binding | All registered policies | Policies scoped to the API key |
| Key exposure | Passphrase in agent process | Agent never sees passphrase or key |
| Setup complexity | Low | Requires running OWS MCP/REST server |
| Recommended for | Development, trusted processes | Production agents |

**Open question (Starter Kit v3):** Whether to ship the OWS MCP server as part
of the Starter Kit deployment is an outstanding decision. The MCP server
(`ows mcp`) is built into OWS. This decision gates v3 architecture.

---

## 10. Error Reference

OWS throws JavaScript `Error` instances. Classify by message content:

| Scenario | Thrown message (partial) | Recommended handling |
| :---- | :---- | :---- |
| Policy `deny` fires | Contains policy's `reason` | Surface to operator; do not retry |
| Vault passphrase wrong | Decryption error | Fix passphrase; do not retry |
| Wallet not found | "wallet not found" | Check wallet name/ID |
| `txHex` not valid XRPL binary | Serialization error | Fix tx construction; re-simulate |
| Source tag missing (app check) | `SourceTagMissingError` | Add `SourceTag` before signing |
| `signAndSend` RPC failure | XRPL engine result | Inspect for `tec*` codes |

---

## V3 Roadmap

OWS v3 will extend the policy engine to parse XRPL binary payloads natively,
enabling transaction-aware rules without custom executables.

| Capability | Description |
| :---- | :---- |
| XRPL payload parsing | Built-in parsing of XRPL canonical binary in the policy engine |
| Amount rules | Max XRP drops or IOU value per transaction, per transaction type |
| Session spend limits | Cumulative XRP cap per API key session |
| Destination rules | Allow / block lists on the `Destination` field |
| Transaction type rules | Permit or deny specific `TransactionType` values |
| OfferCreate limits | Max `TakerPays` / `TakerGets` values |

### Impact on domain skill guardrails

Domain skills (Trading, Payments) provide interim enforcement at the application
layer for v2. When OWS v3 covers the same rules at the vault layer — where
enforcement is stronger and cannot be bypassed by loading a different skill —
the domain skill guardrails for those rule types will be deprecated. Application-
specific logic (pre-trade summaries, multi-step checks) will remain in the skills.

### Migration

v3 is minor-compatible. Existing `createPolicy` JSON configs remain valid.
Code compiled against v1 OWS SDK functions continues to work against a v3 vault.

---

*OWS specification: https://docs.openwallet.sh — `@open-wallet-standard/core` v1.x*

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
9. [Error reference](#10-error-reference)
10. [V3 roadmap](#v3-roadmap)

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
OWS signTransaction("xrpl-testnet", txHex)
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
  chainId:        string; // CAIP-2, e.g. "xrpl:testnet"
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

OWS returns a **bare DER signature**, not a signed transaction blob. Two calls
matter for XRPL:

```typescript
import { signTransaction, signHash } from "@open-wallet-standard/core";

// Sign a transaction. The tx hex MUST NOT contain SigningPubKey — OWS supplies
// it internally when it builds the signing payload. Passing one throws
// "unsigned transaction must not contain SigningPubKey".
const { signature } = signTransaction(
  "xrpl-agent",   // wallet name or ID
  "xrpl",         // chain identifier
  txHex,          // xrpl.js encode() output, WITHOUT SigningPubKey
  credential,     // vault passphrase OR ows_key_… token — see §9
  0,              // derivation index (default: 0)
  vaultPath,      // optional; defaults to ~/.ows
);

// Sign an arbitrary 32-byte hash. Used to recover the account public key (§3).
const { signature } = signHash("xrpl-agent", "xrpl", hashHex, credential, 0, vaultPath);
```

`signAndSend` exists but has no XRPL transport — use `signTransaction` plus
`client.submitAndWait()` so the Wallet skill keeps its hash-persistence and
error-handling discipline.

### Policy management

```typescript
import { createPolicy, listPolicies, deletePolicy } from "@open-wallet-standard/core";

createPolicy(JSON.stringify({
  id:         "xrpl-only",
  name:       "XRPL only",
  version:    1,                              // required
  created_at: new Date().toISOString(),       // required
  rules: [
    { type: "allowed_chains", chain_ids: ["xrpl:mainnet"] },
  ],
  action: "deny",                             // applied when a rule fails
}), vaultPath);
```

`version` and `created_at` are mandatory. `action` is what happens when a rule
**fails**, so the example above allows XRPL and denies everything else.

**Use one chain string consistently.** `xrpl`, `xrpl:mainnet`, `xrpl:testnet`
and `xrpl-testnet` all resolve to the same key and produce identical
signatures — an XRPL account is the same on every network. But the string you
pass becomes the chain id the **policy engine** evaluates, and `AccountInfo`
reports `xrpl:mainnet`. So an `xrpl:mainnet` allowlist plus a
`signTransaction("xrpl-testnet", …)` call is denied:

```
policy denied: chain xrpl:testnet not in allowlist
```

Same key, same address, rejected. Allowlist `xrpl:mainnet` and pass `"xrpl"`.

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

## 3. XRPL Signing Flow

XRPL requires two fields on a submitted transaction: `TxnSignature` **and**
`SigningPubKey`. OWS returns only the signature, and — as of 1.4.2 — exposes no
way to read the account's public key (`AccountInfo` is
`{ chainId, address, derivationPath }`).

This creates a catch-22 you must know about:

- Include `SigningPubKey` before signing → OWS throws
  `unsigned transaction must not contain SigningPubKey`.
- Omit it after signing → the ledger rejects an unsigned transaction.

**Do not resolve this with `exportWallet()`.** That pulls the mnemonic into the
agent process and destroys the property the vault exists to provide.

Instead, recover the public key from a signature. Sign a fixed, meaningless
32-byte probe, recover the candidate keys, and keep the one whose derived XRPL
address matches the account. The seed never leaves the vault. Recover once and
cache it — it never changes for a given wallet.

The flow:

1. **Build** the transaction and `autofill()` it — no `SigningPubKey`
2. **Encode** with xrpl.js `encode()`
3. **Sign** via `signTransaction(...)` → `{ signature }`
4. **Resolve** the public key (recovered once, then cached)
5. **Assemble** `SigningPubKey` + `TxnSignature` and re-encode
6. **Submit** via `client.submitAndWait(signedBlob)`

OWS handles the XRPL internals of step 3: it prepends the `0x53545800` signing
prefix, computes the SHA-512 half, and signs with secp256k1. Its output is
byte-identical to `ripple-keypairs` signing the same payload.

### Complete example (TypeScript)

```typescript
import { getWallet, signHash, signTransaction } from "@open-wallet-standard/core";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { deriveAddress } from "ripple-keypairs";
import { Client, encode, hashes, xrpToDrops } from "xrpl";

// Prefer a scoped agent token — it is policy-checked. A passphrase is owner
// mode and bypasses every policy. See §9.
const OWS_CREDENTIAL = process.env.OWS_AGENT_TOKEN ?? process.env.OWS_PASSPHRASE ?? "";

/** Fixed, non-secret payload used only to recover the public key. */
const PUBKEY_PROBE =
  "6f77732d7872706c2d7075626b65792d70726f62652d76310000000000000000";

const hexToBytes = (hex: string) =>
  Uint8Array.from(Buffer.from(hex.replace(/^0x/, ""), "hex"));

/** Recovers the compressed secp256k1 public key without exporting the seed. */
function resolvePublicKey(walletName: string, address: string): string {
  const cached = process.env.OWS_XRPL_PUBLIC_KEY;
  if (cached) return cached.toUpperCase();

  const { signature } = signHash(walletName, "xrpl", PUBKEY_PROBE, OWS_CREDENTIAL);
  const sig = secp256k1.Signature.fromBytes(hexToBytes(signature), "der");

  for (let bit = 0; bit < 4; bit++) {
    try {
      const point = sig.addRecoveryBit(bit).recoverPublicKey(hexToBytes(PUBKEY_PROBE));
      const candidate = Buffer.from(point.toBytes(true)).toString("hex").toUpperCase();
      if (deriveAddress(candidate) === address) return candidate;
    } catch {
      // Not every recovery bit yields a valid point; try the next.
    }
  }
  throw new Error(`could not recover a public key matching ${address}`);
}

export async function signAndSubmitPayment(params: {
  walletName:  string;
  destination: string;
  amountXRP:   string;
  client:      Client;
}) {
  const { walletName, destination, amountXRP, client } = params;

  const wallet  = getWallet(walletName);
  const account = wallet.accounts.find((a) => a.chainId.startsWith("xrpl"));
  if (!account) throw new Error("wallet has no XRPL account");

  // 1. Build — SourceTag applied by the Wallet skill if absent
  const tx = {
    TransactionType: "Payment",
    Account:         account.address,
    Destination:     destination,
    Amount:          xrpToDrops(amountXRP),
  };

  // 2. Autofill Fee, Sequence, LastLedgerSequence
  const prepared = await client.autofill(tx as any);

  // 3. Encode WITHOUT SigningPubKey, then sign
  const txHex = encode(prepared as Record<string, unknown>);
  const { signature } = signTransaction(walletName, "xrpl", txHex, OWS_CREDENTIAL);

  // 4. Resolve the public key (cache it in OWS_XRPL_PUBLIC_KEY after first run)
  const publicKey = resolvePublicKey(walletName, account.address);

  // 5. Assemble BOTH required fields and re-encode
  const signedBlob = encode({
    ...(prepared as Record<string, unknown>),
    SigningPubKey: publicKey,
    TxnSignature:  signature.replace(/^0x/, "").toUpperCase(),
  } as Record<string, unknown>);

  // 6. Submit and wait for a validated ledger
  const hash = hashes.hashSignedTx(signedBlob);   // persist before submitting
  return { hash, result: await client.submitAndWait(signedBlob) };
}
```

<!-- **Upstream gap.** A `getPublicKey(wallet, chain)` — or a `publicKey` field on `AccountInfo` — would remove step 4 entirely. Until then, every XRPL integrator must reimplement this recovery or export the seed. -->

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
  chainId:     string;           // "xrpl-testnet"
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
  config:     { allowedChains: ["xrpl:testnet"] },
  action:     "deny",
}));
```

---

## 5. What OWS Enforces (v2)

| Policy type | Enforced today | Notes |
| :---- | :---- | :---- |
| Network / chain restrictions | ✓ | Built-in declarative rule `allowed_chains`. Denies before key decryption with `policy denied: chain xrpl:mainnet not in allowlist` |
| Key expiry | ✓ | Built-in declarative rule `expires_at` |
| Time-window restrictions | ✓ (executable) | Requires a custom policy executable |
| Source tag presence | ✗ | Application-layer responsibility (see §6) |
| Amount limits | ✗ | V3 roadmap |
| Destination allow/block list | ✗ | V3 roadmap |
| Transaction type restrictions | ✗ | V3 roadmap |
| TakerPays / TakerGets limits | ✗ | V3 roadmap |

Built-in declarative rules in 1.4.2 are `allowed_chains`, `expires_at`, and
`allowed_typed_data_contracts` (EVM-only). Anything transaction-aware —
amount caps, destination allowlists — needs a custom executable, which receives
the full serialized transaction hex and must parse XRPL binary itself.

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

The OWS SDK is Node.js only. 

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

{% admonition type="Info" name="Important" %}
Only use secp256k1 seeds and do not use Ed25519 seeds. 
{% !admonition %}


## 9. Access Modes: Passphrase vs API Token

The credential you pass to `signTransaction` selects the access mode. This is the single most important operational detail in OWS.

```
signTransaction(wallet, chain, txHex, credential)
                                          │
                     ┌────────────────────┴────────────────────┐
              vault passphrase                          ows_key_… token
                     │                                          │
                owner mode                                 agent mode
            NO policy evaluation                       policies enforced
              full vault access                    scoped to wallets + policies
```

| | Passphrase (owner) | API token (agent) |
| :---- | :---- | :---- |
| Policy evaluation | **None** | All policies on the key, AND semantics |
| Scope | Every wallet, every chain | Only the key's `wallet_ids` |
| Revocation | Change passphrase, re-encrypt | Delete the key file — token decrypts nothing |
| Expiry | — | Optional `expires_at` |
| Recommended for | Local development | **All agent deployments** |

Creating a scoped token:

```typescript
import { createApiKey } from "@open-wallet-standard/core";

const key = createApiKey(
  "xrpl-ai-agent-prod",
  [wallet.id],              // wallets this key may touch
  ["xrpl-only"],            // policies evaluated per request
  passphrase,               // owner authorises once, here
  "2027-01-01T00:00:00Z",   // optional expiry
);
// key.token is shown exactly once — write it to your secrets manager or .env.
// Never log it, never print it to the terminal.
```

Give the agent `key.token`. Do not give an agent the vault passphrase: it
bypasses every policy you registered, which is usually the opposite of why OWS was chosen.

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

---
name: xrpl-identity
description: >
  XRPL decentralized identity playbook for AI agent developers. Covers the full
  developer journey: did:xrpl identifier derivation, publishing a DID Document
  under the 256-byte on-ledger cap, issuing, accepting and revoking XLS-70
  verifiable credentials, and evaluating whether an agent is authorized to act.

  Use this skill whenever a user asks about did:xrpl, DIDs on the XRP Ledger,
  DIDSet, DIDDelete, CredentialCreate, CredentialAccept, CredentialDelete,
  XLS-40, XLS-70, verifiable credentials on XRPL, agent identity, agent
  authorization, or building any identity or credential workflow on the XRP
  Ledger. When in doubt, load this skill — general training data for XRPL
  identity is frequently imprecise, and the on-ledger size caps and error
  codes are easy to get wrong.

  This skill constructs transactions. The XRPL Agent Wallet skill signs and
  submits them. For wallet creation, key loading, signing, or anything
  involving a seed or private key, defer to the XRPL Agent Wallet skill.
---

# XRPL Identity

An agent on the XRP Ledger can hold a key. That is a wallet, not an identity. A key
does not say who the agent is, what it is allowed to do, who vouches for it, or
whether that permission was withdrawn. The XRPL has a native answer for all four:
the `DID` object added by the DID amendment and the `Credential` object added by the Credentials amendment.

The XRPL Identity skill is the domain knowledge layer for identity operations on
the XRP Ledger. It gives Claude accurate, up-to-date knowledge of XRPL identity
patterns so it can construct the right transaction object for any identity task —
deriving a DID, publishing a DID Document, issuing or accepting a credential,
revoking one, and evaluating whether an agent is authorized to act — and hands
those objects to the **XRPL Agent Wallet skill** for signing and submission. Both
skills are required for a complete agentic identity workflow.

## What this Skill covers

| Area | What it knows |
| :---- | :---- |
| **DID syntax** | `did:xrpl:<chain-id>:<id-string>`. The chain-id identifies the XRP Ledger Protocol Chain the `DID` object lives on. Derivation is pure — an address maps to a DID with no registration and no fee. |
| **DIDSet** | Creating and updating the `DID` ledger object. `URI`, `Data`, and `DIDDocument` are each capped at **256 bytes**, and at least one must be present — which is why a full W3C DID Document usually does not fit, and the URI pattern is the usual answer. |
| **DID Document** | DID Core 1.0 vocabulary — `verificationMethod`, `authentication`, `service`. The `Multikey` / `publicKeyMultibase` form, and the `publicKey` form used in the XLS-40d Appendix 1 example and still shown on xrpl.org. |
| **DIDDelete** | Removing a `DID` object and releasing its reserve. |
| **Credential objects** | `CredentialCreate` (issuer), `CredentialAccept` (subject), `CredentialDelete` (revocation). The `CredentialType` and `Issuer` fields, why the type is hex-encoded on-ledger, and its 64-byte cap. |
| **Authorization decisions** | Evaluating an agent against a policy and returning **allow/deny with a reason code** — `AGENT_BANNED`, `CONTROLLER_BANNED`, `NO_CREDENTIALS`, `CREDENTIAL_MISSING`, `CREDENTIAL_REVOKED` — rather than a bare boolean. |
| **Deny lists** | Address bans and controller bans (a banned signer on a multi-sig account denies the account). |
| **Error handling** | The `tec*` and `tem*` codes identity transactions can return, and which of them charge a fee — only `tec*` codes do; `tem*` transactions are rejected before they are applied and cost nothing. |
| **Security** | Key management deferred to the Wallet skill. Pre-flight checks run *before* the user is asked to approve, and are re-asserted before handoff. |

## Works with

| Skill | Role |
| :---- | :---- |
| **XRPL Agent Wallet** | Required — handles wallet creation, key loading, and signs and submits every transaction this skill constructs. Supports env-var (development), external signer (HSM/KMS), and OWS (Open Wallet Standard) signing paths. |

The Identity skill is one of a growing set of XRPL domain skills. All domain skills
pair with the same shared Wallet skill. See
[AI Tooling](https://xrpl.org/resources/dev-tools/ai-tools) for the full list.

**Need a wallet first?** If the user doesn't have an XRPL wallet yet, load the
**XRPL Agent Wallet skill** — it handles wallet generation, writes the seed safely to `.env`, and never shows it in chat. Return here once the wallet is ready.

## Default behavior and stack decisions

- **Languages:** Python (`xrpl-py`) and TypeScript/JavaScript (`xrpl.js`) are both first-class. Use whichever the developer's project already uses; if there is no existing codebase, ask.
- **Transaction submission:** Handled entirely by the XRPL Agent Wallet skill. This skill builds transaction objects; it does not call `submit_and_wait` or `submitAndWait` directly.
- **Signing path:** Determined by the XRPL Agent Wallet skill configuration — env-var (development), external signer (HSM/KMS), or OWS (Open Wallet Standard). See [The XRPL Agent Wallet Skill](https://xrpl.org/docs/agents/xrpl-agent-wallet-skill/) for setup.
- **Amount handling:** Not applicable to identity transactions — `DIDSet`, `DIDDelete`, `CredentialCreate`, `CredentialAccept`, and `CredentialDelete` do not carry an `Amount`. They do carry a fee and a reserve.
- **Reserve:** Every `DID` and `Credential` object adds an owner reserve to the account that created it. Deleting the object releases it. Check reserve adequacy before creating, and say so in the summary.
- **Source tag:** The XRPL Agent Wallet skill automatically applies `SourceTag = 20260530` to every transaction that passes through the signing ceremony. Override by setting `SourceTag` on the transaction object before handoff. You do not need to set `SourceTag` — the Wallet skill applies it. Set it only for a deliberate custom tag, or `0` to opt out.
- **Network:** Testnet (`https://s.altnet.rippletest.net:51234`) by default. Switching to Mainnet is a one-line URL change. The chain-id in a DID must identify the network the `DID` object actually lives on — a DID derived for one chain does not resolve on another. Published chain IDs are Mainnet `0`, Testnet `1`, Devnet `2`; XLS-40d's own examples all use `1`, so confirm the expected value before shipping against mainnet.
- **Simulate before the summary:** Where the node supports it, call `simulate` on the built transaction before showing the summary. It returns the ledger's own `engine_result` with `applied: false` and costs no fee. Recommended, not required: fall back to the local guardrails if `simulate` is unavailable.

## Operating procedure

1. **Identify the operation** — `derive_did`, `publish_did_set`, `delete_did`, `issue_credential`, `accept_credential`, `revoke_credential`, or `check_authorization`. Check the [identity.md reference](references/identity.md) for full patterns and edge cases.
2. **Check prerequisites** — For a publish: is there room in the 256-byte budget for the document, or does this need the URI pattern? For an issue: does the issuer hold a credential of that type for this subject already, and is the subject's account funded for the reserve? For an authorization check: is the agent on a deny list, and does it hold a non-expired accepted credential of the required type?
3. **Build** — Construct the transaction object. Do not set `Fee`, `Sequence`, or `LastLedgerSequence` — the Wallet skill's autofill populates these from the live node.
4. **Run built-in guardrails** — Apply pre-flight checks *before* asking the user to approve anything: reserve adequacy, document size against the 256-byte cap, credential expiry, and whether the subject already holds a credential of that type from that issuer. Stop and surface a clear error if any check fails — never ask a user to approve a transaction already known to fail, because a `tec*` failure charges a fee.
5. **Show the summary** — For `publish_did_set`, show the account, the resulting DID, the document or URI being published, and its byte size against the 256 cap. For `issue_credential`, show issuer, subject, credential type, and expiry. For `check_authorization`, show the decision and the reason code. Collect user acknowledgement before proceeding.
6. **Hand off to the Wallet skill** — Re-assert the guardrails against current ledger state, then pass the transaction object to the XRPL Agent Wallet skill. It will autofill, preview, sign, and submit via `submitAndWait`.
7. **Parse and surface result** — Handle `tec*` errors explicitly — every `tec*` code means a fee was charged and the transaction did not take effect. On success, surface the transaction hash and, for a publish, the DID that now resolves.

## Working with credentials

Credential issuance is two transactions, and the split matters:

```json
// CredentialCreate — signed by the ISSUER
{
  "TransactionType": "CredentialCreate",
  "Account": "rIssuer...",
  "Subject": "rSubject...",
  "CredentialType": "A1B2C3...",     // hex-encoded type identifier, max 64 bytes
  "Expiration": 1793206158
}
```

```json
// CredentialAccept — signed by the SUBJECT
{
  "TransactionType": "CredentialAccept",
  "Account": "rSubject...",
  "Issuer": "rIssuer...",
  "CredentialType": "A1B2C3..."
}
```

A credential only becomes *accepted* when the subject signs the acceptance. An
issued-but-unaccepted credential exists on-ledger but is not a credential the
subject holds. Authorization decisions that count "credentials the agent holds"
must count accepted ones only.

The owner reserve moves with it. Before acceptance the **issuer** carries the
reserve for the `Credential` object; after a successful `CredentialAccept` the
**subject** does. If the issuer created the credential and the subject later
accepts it, the subject needs the reserve, and a subject that cannot cover it
will fail the acceptance.

`CredentialDelete` revokes a credential. The reason code `CREDENTIAL_REVOKED` is
what an authorization check returns for a subject whose credential was revoked.

## Publishing a DID Document

The 256-byte cap on `DIDSet.DIDDocument` is the reason the URI pattern exists.
The exact size of a DID Document depends on its contents *and* its
serialization — a document with `@context`, `id`, one `verificationMethod` and
an `authentication` array, pretty-printed with two-space indent, is about 500
bytes; the same document serialized compactly is about 420; a minimal document
with only identifiers can fit under the cap. Measure the document you actually
have, in the serialization you intend to publish, rather than assuming.

The XLS-40d pattern that always works is to publish a URI and host the full
document behind it:

```json
{
  "TransactionType": "DIDSet",
  "Account": "rSubject...",
  "URI": "68747470733A2F2F..."          // hex-encoded URI
}
```

A URI of `https://example.com/did/rSubject...` encodes to 118 hex characters and
fits comfortably. Resolving a URI-only `DIDSet` yields the account's DID and an
implicit document; the full document is fetched from the URI by the party that
wants it. Say this plainly in the summary rather than implying the ledger holds
the whole document.

## What this skill does not do

- **Create wallets or handle keys.** Wallet generation, seed storage, key loading, signing, and all key management belong to the XRPL Agent Wallet skill.
- **Sign or submit transactions.** That is the Wallet skill's responsibility. This skill never calls `submit_and_wait`, `submitAndWait`, or any equivalent directly.
- **Fetch a DID Document over HTTP.** Resolution returns what the ledger holds. If the document lives behind a URI, retrieving it is the caller's decision.
- **Construct identity transactions on its own initiative.** The skill responds to developer and user instructions; it does not publish DIDs or issue credentials unprompted.
- **Retry automatically.** Any `tec*` failure or user cancellation requires explicit user instruction before retrying.

## Reference files

The identity skill references these files for full transaction patterns and edge cases:

- [identity.md](references/identity.md) — DIDSet, DIDDelete, CredentialCreate, CredentialAccept, CredentialDelete, DID Document shape, authorization decisions, error codes, reserves

## Where to go next

- [The XRPL Agent Wallet Skill](https://xrpl.org/docs/agents/xrpl-agent-wallet-skill/) — Security model, signing ceremony, and key handling patterns including OWS.
- [Decentralized Identifiers](https://xrpl.org/docs/concepts/decentralized-storage/decentralized-identifiers/) — XRPL DID concepts.
- [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials/) — XRPL credential objects and the XLS-70 model.
- [Manage Credentials](https://xrpl.org/docs/tutorials/compliance-features/manage-credentials/) — A walkthrough of the credential lifecycle.
- [DIDSet](https://xrpl.org/docs/references/protocol/transactions/types/didset/) · [DIDDelete](https://xrpl.org/docs/references/protocol/transactions/types/diddelete/) — The `DID` object transactions.
- [CredentialCreate](https://xrpl.org/docs/references/protocol/transactions/types/credentialcreate/) · [CredentialAccept](https://xrpl.org/docs/references/protocol/transactions/types/credentialaccept/) · [CredentialDelete](https://xrpl.org/docs/references/protocol/transactions/types/credentialdelete/) — The credential transactions.
- [DID](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/did/) · [Credential](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/credential/) — The ledger entry types.
- [NetworkID Field](https://xrpl.org/docs/references/protocol/transactions/common-fields#networkid-field) — Chain IDs for the known networks.
- [View AI Tooling](https://xrpl.org/resources/dev-tools/ai-tools) — The full set of XRPL skills and MCP servers for Claude agents.


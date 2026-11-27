# XRPL Identity — reference

Full transaction patterns, edge cases, and error codes for the XRPL Identity
skill. Read the sections you need; do not load all of it at once.

## 1. DID derivation

A DID is derived from an address. There is no registration step and no fee.

```
did:xrpl:<network-id>:<address>
```

The `network-id` component of a `did:xrpl` is a **chain ID** — an identifier
of the XRP Ledger Protocol Chain the `DID` object lives on. XLS-40d §4.2.1
defines it that way and points at XLS-37, where "the Network ID should match
the chosen peer port".

The published chain IDs for the main networks are:

| Network | Chain ID |
| :--- | :--- |
| Mainnet | 0 |
| Testnet | 1 |
| Devnet | 2 |

Source: the [`NetworkID` field](https://xrpl.org/docs/references/protocol/transactions/common-fields#networkid-field)
in the XRPL protocol reference, and `server_info` on each network.

**One thing to check before relying on it.** XLS-40d's own worked example is
`did:xrpl:1:rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`, and every DID example in
the spec and on xrpl.org uses `1`. Under the chain-ID table above, `1` is
Testnet. XLS-40d does not reconcile this with its own example. If you are
building against mainnet, confirm which value the ecosystem expects for the
chain ID component before shipping — it is worth an issue on the standards
repo.

The `xrpl-specific-idstring` may also be the hex-encoded public key rather than
the classic address. Both resolve to the same account.

Deriving a DID is string formatting. There is no call to make.

```python
def did_from_account(address: str, chain_id: int) -> str:
    return f"did:xrpl:{chain_id}:{address}"


did = did_from_account("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", chain_id=0)
# did:xrpl:0:rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh
```

The `xrpl-specific-idstring` may also be the hex of the account's master
public key rather than the classic address. Both identify the same account.

**The network-id must match where the `DID` object lives.** A mainnet address
derived on testnet produces a DID that resolves to nothing.

## 2. DIDSet — publishing a DID Document

### The 256-byte cap

`URI`, `Data`, and `DIDDocument` are each limited to **256 bytes**, and at least
one must be present or the transaction fails.

The size of a DID Document depends on its contents *and* its serialization.
A document with `@context`, `id`, one `verificationMethod` and an
`authentication` array, pretty-printed with two-space indent, is about 500
bytes; the same document compactly serialized is about 420; a minimal
document with only identifiers can fit under the cap. Measure the document
you actually have before deciding it will not fit.

Two ways to handle it:

**URI pattern (recommended).** Put the full document behind an HTTPS or IPFS URI
and publish only the URI.

```json
{
  "TransactionType": "DIDSet",
  "Account": "rSubject...",
  "URI": "68747470733A2F2F6578616D706C652E636F6D2F6469642F..."
}
```

The URI is hex-encoded. `https://example.com/did/rSubject...` encodes to about
118 hex characters — comfortably inside the cap.

**Minimal document on-ledger.** A document carrying only identifiers, with the
public key left to be derived from the account's master key. This can fit
inside 256 bytes, but only when it is serialized compactly — measure it
rather than assuming, and keep an eye on how much the `id` and
`verificationMethod` values contribute.

### Verifying the size before submitting

```python
import json
doc = json.dumps(did_document, separators=(",", ":")).encode("utf-8").hex().upper()
print(len(doc), "hex chars;", len(doc) // 2, "bytes; cap is 256")
```

If the hex string exceeds 256 characters, the transaction will be rejected.

### DIDSet JSON

```json
{
  "TransactionType": "DIDSet",
  "Account": "rSubject...",
  "URI": "68747470733A2F2F...",
  "Data": ""
}
```

Do not set `Fee`, `Sequence`, or `LastLedgerSequence` — the Wallet skill autofills
them. `SigningPubKey` is added by the signer during the signing ceremony.

## 3. DIDDelete — removing a DID

```json
{
  "TransactionType": "DIDDelete",
  "Account": "rSubject..."
}
```

Releases the owner reserve the `DID` object was holding.

## 4. Credential objects

### CredentialCreate — signed by the issuer

```json
{
  "TransactionType": "CredentialCreate",
  "Account": "rIssuer...",
  "Subject": "rSubject...",
  "CredentialType": "A1B2C3...",
  "Expiration": 1793206158
}
```

| Field | Notes |
| :--- | :--- |
| `CredentialType` | Hex-encoded type identifier from the issuer. **Max 64 bytes.** |
| `Expiration` | Optional. When a transaction touches an expired credential, the object is deleted and the transaction fails with `tecEXPIRED`. Deletion happens on that transaction, not automatically at the expiry instant. |
| `URI` | Optional. A link to the Verifiable Credential document, capped at 256 bytes — the bridge to the off-ledger VC that XLS-70d describes. |

The credential is not yet accepted. The issuer carries the owner reserve.

One exception: if `Subject` is the same account as `Account` — an issuer
issuing to itself — `lsfAccepted` is set immediately, because there is no
separate acceptance step to wait for.

### CredentialAccept — signed by the subject

```json
{
  "TransactionType": "CredentialAccept",
  "Account": "rSubject...",
  "Issuer": "rIssuer...",
  "CredentialType": "A1B2C3..."
}
```

Sets the `lsfAccepted` flag and **moves the owner reserve from the issuer to the
subject**. The subject must be able to cover it.

### CredentialDelete — revocation

```json
{
  "TransactionType": "CredentialDelete",
  "Account": "rIssuer...",
  "Subject": "rSubject...",
  "CredentialType": "A1B2C3..."
}
```

Revoked credentials stop satisfying authorization. A check against a revoked
credential returns `CREDENTIAL_REVOKED`.

### How the pieces fit

```
CredentialCreate  ──▶  credential object exists, issuer holds reserve
                            │
CredentialAccept   ──▶  lsfAccepted set, subject holds reserve
                            │
CredentialDelete   ──▶  revoked, no longer satisfies authorization
```

## 5. Authorization decisions

An authorization check answers allow or deny **with a reason code**. The reason
code is the part worth logging — a bare boolean cannot be audited later.

| Reason code | Meaning |
| :--- | :--- |
| `AGENT_BANNED` | The agent's address is on the deny list. |
| `CONTROLLER_BANNED` | A controller (signer on a multi-sig account) is on the deny list. |
| `NO_CREDENTIALS` | The agent holds zero credentials on the ledger. |
| `CREDENTIAL_MISSING` | The agent does not hold a credential of the required type from a permitted issuer. |
| `CREDENTIAL_REVOKED` | A required credential was on the ledger but has been revoked. |

A policy says which issuers are trusted, for which credential type. A rule with a
set of issuers is satisfied by a credential from **any** of them — the result
reports one missing entry per rule, not one per issuer.

A policy layer is not part of any XRPL SDK — it is application logic you
write on top of the ledger. The shape worth copying:

```python
# A rule: the agent must hold an accepted credential of this type from any
# one of these issuers.
POLICY = {
    "issuer": {"rIssuerA...", "rIssuerB..."},
    "credential_type": b"https://example.com/credentials/accreditation",
}

# Evaluate it against what the agent actually holds on the ledger.
held = credentials_held_by("rSubject...")   # your read, see below
satisfied = any(
    issuer in POLICY["issuer"] and ctype == POLICY["credential_type"]
    for issuer, ctype in held
    if accepted(issuer, ctype)               # lsfAccepted must be set
)
```

The reason codes below are **this skill's vocabulary**, not XRPL protocol
terms. Nothing on the ledger defines `AGENT_BANNED` or `NO_CREDENTIALS`;
they are names an application gives its own decision outcomes so the result
can be logged and audited.

### Deny lists

A ban denies the **subject**. A controller ban denies the account when any
signer on it is banned — read controllers from the account's `SignerList`.

Evaluate bans **before** anything else, and without a ledger call. The one
rule that must always apply should not depend on the ledger being reachable,
or a ledger outage would fail it open. This is a design choice for an
application's policy layer, not a property of the protocol.

### Checking the ledger directly

```python
from xrpl.models.requests import AccountObjects, LedgerEntry

client = get_client("mainnet")

# 1. Find the credential objects the subject owns.
resp = client.request(AccountObjects(
    account="rSubject...",
    type="credential",
))

# 2. Read each one as a ledger entry to get its Flags.
for obj in resp.result["account_objects"]:
    entry = client.request(LedgerEntry(
        index=obj["index"]
    )).result["node"]
    accepted = bool(entry["Flags"] & 0x00010000)
    print(entry["CredentialType"], "accepted" if accepted else "not accepted")
```

The `lsfAccepted` flag (`0x00010000`) is what marks a credential as held
rather than merely issued. An unaccepted credential is not one the subject
holds — existence is not acceptance, and treating it as acceptance is a
common way to get a false positive out of an authorization check.

`account_objects` returns a summary that does not include `Flags`; the
`ledger_entry` request is what exposes it. If you only need to know *that*
a credential exists, the summary is enough.

## 6. Reserves

| Object | Owner reserve |
| :--- | :--- |
| `DID` | 0.2 XRP |
| `Credential` | 0.2 XRP |

One account can hold many credentials, which keeps the lockup down. Deleting the
object releases the reserve.

## 7. Error codes

| Code | Meaning | Fee charged |
| :--- | :--- | :--- |
| `tecINSUFFICIENT_RESERVE` | The account cannot cover the owner reserve for the object. | Yes |
| `tecNO_PERMISSION` | The signer is not allowed to create, accept, or delete this object. | Yes |
| `tecEXPIRED` | The credential has expired. The object is deleted and the transaction fails. | Yes |
| `tecEMPTY_DID` | A `DIDSet` update would leave the object with no `URI`, `Data`, or `DIDDocument`. | Yes |
| `temEMPTY_DID` | A `DIDSet` creation names none of `URI`, `Data`, or `DIDDocument`. | No |
| `temMALFORMED` | The transaction is missing a required field. | No |
| `temINVALID_ACCOUNT_ID` | A supplied account-ID field is invalid — for example `ACCOUNT_ZERO`. | No |

Only `tec*` codes destroy the transaction cost. `tem*` transactions are
rejected before they are applied to a ledger: they change no state and cost
nothing. Guardrails run before the user approves, precisely so the user is
never asked to approve a transaction already known to fail.

## 8. Common mistakes

| Mistake | What happens | Instead |
| :--- | :--- | :--- |
| Publishing a full DID Document on-ledger | Exceeds 256 bytes, transaction rejected | URI pattern |
| Deriving a DID on the wrong network | DID resolves to nothing | Match the network-id to where the `DID` lives |
| Counting an unaccepted credential | False positive on authorization | Require the `lsfAccepted` flag (`0x00010000`) |
| Forgetting the reserve moves on acceptance | Subject's `CredentialAccept` fails with `tecINSUFFICIENT_RESERVE` | Check the subject can cover the reserve |
| `CredentialType` as a plain string | Not the hex-encoded on-ledger form | Hex-encode it, max 64 bytes |
| Treating a DID as an identity proof | A DID says who, not whether they may act | Combine with a credential and an authorization check |

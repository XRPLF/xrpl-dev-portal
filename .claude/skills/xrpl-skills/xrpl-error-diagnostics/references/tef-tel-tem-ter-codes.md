# `tef*` / `tel*` / `tem*` / `ter*` codes — pre-flight, local, malformed, retry

Unlike `tec*`, these codes mean the transaction **did not make the ledger** (with one
exception: `terQUEUED` means it's in the local queue). **No fee was charged. No
sequence was consumed.** The fix is usually to correct the transaction and resubmit.

| Family | Range | Meaning | Resubmit? |
| :---- | :---- | :---- | :---- |
| `tes*` | 0 | Success (`tesSUCCESS` only) | — |
| `tec*` | 100–199 | Failed but on-ledger | New tx with new sequence |
| `tef*` | -199 to -100 | Failed final (won't apply to any ledger) | Usually no — fix issue, new tx |
| `ter*` | -99 to -1 | Retry (transient, queue, sequence) | Yes, often automatic |
| `tel*` | -399 to -300 | Local error — this node rejected it | Yes, possibly different node |
| `tem*` | -299 to -200 | Malformed — won't be accepted anywhere | Fix the tx, resubmit |

> Authoritative source: <https://xrpl.org/docs/references/protocol/transactions/transaction-results>

---

## `tef*` — failed final

These are final rejections (not malformed enough for `tem`, not retryable as `ter`). The transaction will never apply.

### `tefMASTER_DISABLED`

**Cause:** The transaction was signed by the master key, but the master key is disabled (`lsfDisableMaster` flag set on the account).

**Diagnose:** `account_info` on the sender → check `Flags` for `lsfDisableMaster` (0x00100000).

**Fix:** Re-sign using the regular key (`SetRegularKey`) or a SignerList. If you genuinely need master access back, use `SetRegularKey` / `SignerListSet` from the existing auth method to re-enable master via an `AccountSet` with the `asfDisableMaster` flag cleared — and that AccountSet must itself be signed by the master, which means a path back requires the master key to still be reachable.

### `tefBAD_AUTH`

**Cause:** The signing key isn't a known authorization method on the account (not master, not the current regular key, not in the SignerList).

**Diagnose:**
1. `account_info` → get `RegularKey` field.
2. `account_objects` filtered by `type: signer_list` → enumerate signers.
3. Compare the public key in the tx's `SigningPubKey` against all three.

**Fix:** Sign with a recognized key, or update the auth methods on the account.

### `tefBAD_AUTH_MASTER`

**Cause:** The transaction was signed by the master key, but the public key doesn't match the account address. Usually means a wrong seed was used.

**Fix:** Re-check the seed. The address derived from the master key must equal the `Account` field.

### `tefBAD_SIGNATURE`

**Cause:** The signature is cryptographically invalid for the signing public key.

**Fix:** Re-sign. Often caused by serialization bugs or modifying the tx after signing.

### `tefBAD_QUORUM`

**Cause:** Multi-signed transaction, but the combined weight of the signers doesn't meet `SignerQuorum`.

**Diagnose:** `account_objects` → read the `SignerList` and its `SignerQuorum`. Sum the weights of the signers actually present.

**Fix:** Collect more signatures until weight ≥ quorum.

### `tefNOT_MULTI_SIGNING`

**Cause:** Multi-signed transaction submitted to an account with no SignerList.

**Fix:** Set up a SignerList first (`SignerListSet`), or single-sign.

### `tefPAST_SEQ`

**Cause:** The transaction's `Sequence` is **less than** the account's current sequence — it's already been used by an earlier transaction.

**Diagnose:** `account_info` on the sender → current `Sequence`. Compare to the tx's `Sequence`. If `tx.Sequence < account_info.Sequence`, that's the cause.

**Fix:** Update to the current sequence (autofill handles this) or use a Ticket. Often happens when client code caches sequences and another tx submitted in between.

### `tefMAX_LEDGER`

**Cause:** `LastLedgerSequence` is in the past (current `ledger_index` is already beyond it). The tx is expired before it could be applied.

**Diagnose:** `ledger` → current `ledger_index`. Compare to `tx.LastLedgerSequence`.

**Fix:** Resubmit with a higher `LastLedgerSequence` (typically current + 20).

### `tefALREADY`

**Cause:** Identical transaction (same hash) was already submitted.

**Fix:** Check `account_tx` to confirm the original result. If you wanted a different action, change at least one field (Sequence, Fee, etc.) so the hash differs.

### `tefNO_AUTH_REQUIRED`

**Cause:** `TrustSet` with `tfSetfAuth`, but the issuer hasn't enabled `lsfRequireAuth`. Authorizing a line is meaningless if auth isn't required.

**Fix:** Either issuer enables `lsfRequireAuth` first, or drop the `tfSetfAuth` flag.

### `tefINTERNAL`, `tefEXCEPTION`, `tefFAILURE`

Internal errors. If reproducible, file a rippled issue.

### `tefWRONG_PRIOR`

**Cause:** `AccountTxnID` (linking to a prior tx) doesn't match the account's last committed transaction ID. Used for strict-sequence wallets.

**Fix:** Update `AccountTxnID` to the actual prior hash.

### `tefINVARIANT_FAILED`

Internal invariant check failed. Report.

---

## `ter*` — retry / transient

These are not failures so much as **try again later**. Most submission libraries handle them automatically.

### `terQUEUED`

**Not actually an error.** The transaction has been accepted into the local node's queue (because it had a low fee or because the open ledger is full). It will be applied in a future ledger when the fee escalates enough.

**Diagnose:** `account_info` with `queue: true` → see queued transactions for this account and their projected fees.

**Action:** Wait. If you need it to land sooner, resubmit with a higher `Fee`.

### `terPRE_SEQ`

**Cause:** Transaction `Sequence` is **higher** than the account's current sequence — there's a gap. The node holds it until a lower-sequence tx arrives.

**Diagnose:** `account_info` → current `Sequence`. Tx sequence is `> Sequence`. The missing tx hasn't been seen yet.

**Action:** Submit the missing transactions, or wait. Tickets bypass this constraint entirely.

### `terPRE_TICKET`

**Cause:** Transaction references a `TicketSequence` that doesn't exist yet (Ticket not created).

**Fix:** Create the Ticket first (`TicketCreate`).

### `terNO_ACCOUNT`

**Cause:** The source account doesn't exist on the ledger. Common after sending from a wallet that was never funded.

**Diagnose:** `account_info` → `actNotFound`.

**Fix:** Fund the source with ≥ the base reserve in XRP (1 XRP on Mainnet at time of writing — verify via `server_state.reserve_base_xrp`).

### `terNO_LINE`

**Cause:** Retry version of `tecNO_LINE` — the line doesn't exist, the node will retry next ledger in case it gets created.

### `terNO_AUTH`

Retry version of `tecNO_AUTH`.

### `terNO_RIPPLE`

**Cause:** Payment path requires rippling through an account that has `lsfNoRipple` set on the relevant trust line.

**Fix:** Use a different path, or have the account clear `NoRipple` on that side (only matters if you're the operator).

### `terNO_AMM`

**Cause:** Path references an AMM that doesn't exist.

### `terOWNERS`

Retry version of `tecOWNERS`.

### `terINSUF_FEE_B`

**Cause:** Insufficient fee balance — sender doesn't have enough XRP to pay the `Fee`. (See also `tecINSUFF_FEE`, which is the post-distribution version.)

**Diagnose:** `account_info` → `Balance` must exceed `Fee` + reserve floor.

**Fix:** Fund, or lower `Fee` (rarely a good idea — current open-ledger fee should be respected).

### `terRETRY`

Generic "try again." Often follows transient node state.

### `terLAST`

Deprecated internal state. You shouldn't normally see it surfaced.

---

## `tel*` — local error (this node only)

These mean **this specific rippled rejected the tx** before distributing it. A different node, or a future ledger, might accept it.

### `telCAN_NOT_QUEUE`, `telCAN_NOT_QUEUE_BALANCE`, `telCAN_NOT_QUEUE_BLOCKS`, `telCAN_NOT_QUEUE_BLOCKED`, `telCAN_NOT_QUEUE_FEE`, `telCAN_NOT_QUEUE_FULL`

**Cause:** The transaction couldn't be queued. Each variant says why:

| Variant | Specific reason |
| :---- | :---- |
| `telCAN_NOT_QUEUE` | Generic queue rejection (often: too many txs for this account already queued, or `Fee` too low). |
| `telCAN_NOT_QUEUE_BALANCE` | Account's queued txs would consume too much balance combined. |
| `telCAN_NOT_QUEUE_BLOCKS` | A queued tx for this account is "blocker-type" (`SetRegularKey`, `SignerListSet`, etc.) and no new txs can be queued behind it. |
| `telCAN_NOT_QUEUE_BLOCKED` | Same idea — blocked by an existing blocker tx. |
| `telCAN_NOT_QUEUE_FEE` | `Fee` is below what the queue requires right now. |
| `telCAN_NOT_QUEUE_FULL` | The whole node's queue is full. |

**Diagnose:** `fee` method → see current queue stats. `account_info` with `queue: true` → see this account's queued txs.

**Fix:** Raise `Fee`, wait, or remove existing queued txs (replace by submitting same `Sequence` with higher fee).

### `telINSUF_FEE_P`

**Cause:** Specified `Fee` is below the current open-ledger reference fee at this node.

**Diagnose:** `fee` method → `drops.open_ledger_fee`. Compare.

**Fix:** Raise `Fee`. Autofill via `Wallet.sign` usually handles this correctly.

### `telLOCAL_ERROR`

Generic local rejection.

### `telBAD_DOMAIN`

**Cause:** `Domain` field on AccountSet is malformed (not valid hex, too long, etc.).

### `telBAD_PUBLIC_KEY`

**Cause:** `SigningPubKey`, `MessagePubKey`, or similar is not a valid public key.

### `telBAD_PATH_COUNT`

**Cause:** Too many paths in `Paths` (max is 6).

### `telNO_DST_PARTIAL`

**Cause:** Payment with `tfPartialPayment` but no destination given.

### `telWRONG_NETWORK`

**Cause:** `NetworkID` field doesn't match this node's network. Common when submitting a sidechain tx to Mainnet or vice versa.

**Diagnose:** `server_info` → `network_id`. Compare to tx's `NetworkID`.

**Fix:** Set the correct `NetworkID` (Mainnet has no `NetworkID` requirement; networks with `NetworkID ≥ 1024` require the field).

### `telREQUIRES_NETWORK_ID`

**Cause:** This network requires `NetworkID` (it's ≥ 1024) but the tx didn't set one.

**Fix:** Add `NetworkID` matching the network.

### `telNETWORK_ID_MAKES_TX_NON_CANONICAL`

**Cause:** Set `NetworkID` on a network that doesn't require it (canonical form must omit it on Mainnet etc.).

**Fix:** Remove `NetworkID`.

### `telFAILED_PROCESSING`

Generic local processing failure.

---

## `tem*` — malformed

The transaction is structurally invalid and will never be accepted by **any** node. Always a client-side bug.

For the full list of `tem*` codes with definitions, see <https://xrpl.org/docs/references/protocol/transactions/transaction-results/tem-codes>.

### Diagnostic approach for any `tem*`

1. Re-serialize the transaction with a current client library (`xrpl-py`, `xrpl.js`) — most `tem*` failures originate from manual JSON assembly, custom binary codecs, or stale field names.
2. Check the field named in `error_message` against the [transaction reference](https://xrpl.org/docs/references/protocol/transactions). Common offenders: missing required field, wrong type (string vs. number for `Amount`), invalid address checksum, currency code malformed.
3. Compare against a known-good transaction of the same type from a recent ledger (`tx` on any successful one of the same type).

### `tem` for SendMax variants (cross-currency)

The `temBAD_SEND_XRP_*` family (`temBAD_SEND_XRP_LIMIT`, `temBAD_SEND_XRP_MAX`, `temBAD_SEND_XRP_NO_DIRECT`, `temBAD_SEND_XRP_PARTIAL`, `temBAD_SEND_XRP_PATHS`) all indicate the same root confusion: an XRP-only Payment that has cross-currency fields set.

**Common fix:** Either you meant a same-currency XRP payment (remove `SendMax` / `Paths` / `tfPartialPayment` / `tfNoRippleDirect`) or you meant a cross-currency one (set `Amount` to the destination currency object and `SendMax` to the source). See the [Payment reference](https://xrpl.org/docs/references/protocol/transactions/types/payment) for the legal combinations.

For codes that mean the tx **did** make the ledger but failed there, see [tec-codes.md](tec-codes.md).

# Semantic failures: `tesSUCCESS` but wrong outcome

The hardest XRPL bugs aren't the errors — they're transactions that return `tesSUCCESS` and **don't do what the developer expected**. Common symptoms: destination didn't receive funds, balance is wrong, exchange didn't credit a deposit, LP tokens came back tiny.

Every case below needs the same first step: **read the transaction metadata**, not just the result code.

```python
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import Tx
res = JsonRpcClient("https://xrplcluster.com").request(Tx(transaction=tx_hash)).result
print("Result:    ", res["meta"]["TransactionResult"])
print("Delivered: ", res["meta"].get("delivered_amount"))  # canonical "what actually moved"
print("Flags:     ", res.get("Flags"))
for node in res["meta"]["AffectedNodes"]:
    kind = list(node.keys())[0]
    print(" ", kind, node[kind].get("LedgerEntryType"))
```

`delivered_amount`, the tx `Flags`, and the `AffectedNodes` per-entry deltas are almost always enough to identify which case below applies.

---

## Payment delivery surprises

### 1. Partial payment delivered tiny / zero amount

**Symptom:** `Amount: "100000000"` (100 XRP) but the destination's balance only changed by 0.000001 XRP.

**Cause:** `tfPartialPayment` (0x00020000) was set and the path had thin liquidity. The engine delivers what it can and reports `tesSUCCESS` — no "needed more" signal.

**Diagnose:** Read `meta.delivered_amount`. If it's much less than `Amount`, partial-payment behavior is responsible.

**Fix:** Always parse `delivered_amount` on cross-currency or token payments. Set `DeliverMin` to fail (`tecPATH_PARTIAL`) below a threshold, or drop `tfPartialPayment` for strict full-amount semantics.

> Crediting users from `Amount` instead of `delivered_amount` is the canonical XRPL theft vector. See [Partial Payments](https://xrpl.org/docs/concepts/payment-types/partial-payments).

### 2. Transfer fee eaten the payment

**Symptom:** Sent 100 USD, destination received less. Looks like partial payment but isn't.

**Cause:** Issuer's `TransferRate` > 1.0. IOU movement between trust lines of the same issuer takes a fee.

**Diagnose:** `account_info` on issuer → `TransferRate` (1_000_000_000 = no fee; 1_002_000_000 = 0.2%). `meta.AffectedNodes` shows the per-line deltas.

**Fix:** Set `SendMax ≥ Amount × TransferRate / 1e9`. Transfer fees don't apply when sender or destination is the issuer.

### 3. Auto-bridging through XRP

**Symptom:** Cross-currency payment found a better rate than the direct book. Unexpected fills in XRP-paired books.

**Cause:** XRPL auto-bridges cross-currency payments through XRP when XRP-paired books offer better rates.

**Diagnose:** `meta.AffectedNodes` shows hops through XRP DEX offers.

**Fix:** Set `tfNoRippleDirect` to prevent direct routing, or set explicit `Paths`. Generally accept auto-bridging — it's optimizing for you.

---

## Account configuration surprises

### 4. Payment to exchange without `DestinationTag`

**Symptom:** Sent XRP to an exchange, exchange says they didn't receive it. On-ledger the tx is `tesSUCCESS` and the omnibus account is credited.

**Cause:** Exchanges pool deposits into one address and identify customers by `DestinationTag`. Without one, the exchange holds the XRP but can't credit any account.

**Diagnose:** Check `tx.DestinationTag`. Check destination's `lsfRequireDestTag` (0x00020000) — if set, the tx should have failed with `tecDST_TAG_NEEDED`, but some exchanges require tags without setting the flag.

**Fix:** Contact the exchange with the tx hash; recovery is at their discretion. Prevent by always including `DestinationTag` for exchange / custodian destinations.

### 5. Default rippling causes unintended IOU movement

**Symptom:** Operator account's IOU balances change without it initiating any transactions.

**Cause:** `lsfDefaultRipple` (0x00800000) is set, or trust lines lack `lsfNoRipple` on either side. The DEX routes payments through this account, swapping equivalent IOUs across counterparties.

**Diagnose:** `account_info` → `Flags` for `lsfDefaultRipple`. `account_lines` → `no_ripple` / `no_ripple_peer` per line. `account_tx` → Payments where this account is in `AffectedNodes` but isn't `Account` or `Destination` are ripple-through events.

**Fix:** Non-issuer operator accounts should clear `lsfDefaultRipple` and set `lsfNoRipple` on every line they hold. Issuers typically set `lsfDefaultRipple` but don't hold balances elsewhere. See [No Ripple](https://xrpl.org/docs/concepts/tokens/fungible-tokens/rippling).

### 6. RegularKey set but signing still failing

**Symptom:** Signing with a regular key returns `tefBAD_AUTH`.

**Cause:** The signing public key doesn't derive to the address recorded as `RegularKey` (common when pasting a public key whose wallet derives differently), or the regular key was replaced and you're using the stale one.

**Diagnose:** `account_info` → record `RegularKey`. Derive the address from the signing public key (xrpl-py: `derive_classic_address(public_key)`). Compare.

**Fix:** Sign with the seed matching the current `RegularKey`, or re-set `RegularKey` to a key you control.

### 7. `DisallowXRP` is advisory — the XRP payment succeeds anyway

**Symptom:** You sent XRP to an account that has "DisallowXRP" set and expected it to bounce — but the Payment returned `tesSUCCESS` and the XRP was delivered. (Or: a client library refused to build the payment, masking that the ledger would have accepted it.)

**Cause:** `asfDisallowXRP` (AccountSet flag `3`, which sets the ledger flag `lsfDisallowXRP`, `0x00080000`) is **advisory only** — the protocol does not enforce it, so XRP Payments still succeed on-ledger. Only client applications are expected to honor it; even `EscrowCreate` / `PaymentChannelCreate` to such a destination are not blocked by the protocol.

**Diagnose:** `account_info` on destination → `Flags` for `lsfDisallowXRP` (`0x00080000`). If set, treat it as informational; any XRP already delivered is really there.

**Fix:** Respect the flag in your own client (don't send XRP when it's set) rather than relying on the ledger to reject it. If you control the destination and want XRP, clear the flag.

---

## Trust line surprises

### 8. Frozen trust line — payment succeeds but token won't move

**Symptom:** IOU payment returns `tesSUCCESS` with no balance change (the semantic case) — or `tecFROZEN` outright.

**Cause:** The issuer froze the trust line, or set a global freeze on their own account.

**Diagnose & fix:** Same recipe whether the freeze surfaces as a silent `tesSUCCESS` or as `tecFROZEN` — see [`tecFROZEN`](tec-codes.md#tecfrozen-137) in tec-codes.md.

### 9. Trust line `LimitAmount` zero — line still exists

**Symptom:** Set `LimitAmount` to zero hoping to remove the trust line; it's still in `account_lines`.

**Cause:** Trust lines only delete when **both sides** are in default state (limit zero, balance zero, no flags, no auth granted).

**Diagnose:** `account_lines` from both sides. If only one shows default state, the other's holding it open.

**Fix:** Both sides reset their limit, or wait for the holder's balance to clear.

### 10. Auto-created trust line leaves dust line

**Symptom:** Cross-currency Payment delivered USD; `account_lines` now shows a USD line you didn't ask to create.

**Cause:** Payments that deliver an IOU auto-create the destination's trust line (with `LimitAmount = 0` and `Balance = delivered_amount`). It can't be deleted while balance > 0.

**Fix:** Spend or return the balance, then reset the limit. The auto-created line costs an owner reserve increment until removed.

---

## Escrow surprises

### 11. Escrow not yet finishable

**Symptom:** `EscrowFinish` returns `tecNO_PERMISSION` though the developer thinks it should be ready.

**Cause:** `FinishAfter` hasn't arrived. XRPL uses its own epoch (seconds since 2000-01-01T00:00:00 UTC, **not** Unix epoch).

**Diagnose:** `account_objects` on owner, type `escrow` → `FinishAfter`. Convert: `unix_time = ripple_time + 946_684_800` (or `xrpl.utils.ripple_time_to_datetime`). Compare to current `ledger.close_time`.

**Fix:** Wait. EscrowFinish can only succeed at or after `FinishAfter`.

### 12. Conditional escrow needs `Fulfillment`, not just `Condition`

**Symptom:** `EscrowFinish` on a conditional escrow returns `tecCRYPTOCONDITION_ERROR` or `temMALFORMED`.

**Cause:** Conditional escrows require the `Condition` (hash) on **EscrowCreate** and the `Fulfillment` (preimage) on **EscrowFinish**. Submitting `EscrowFinish` without `Fulfillment` always fails.

**Fix:** Include both `Condition` and `Fulfillment` on the finish. Public submission of the fulfillment is part of the design.

---

## Other surprises

### 13. AccountDelete dust — last few XRP unrecoverable

**Symptom:** Account deleted, but only some of the XRP arrived at the destination.

**Cause:** `AccountDelete` charges a special transaction cost equal to the owner reserve amount (currently 0.2 XRP = 200,000 drops; confirm via `server_state.reserve_inc_xrp`). The destination receives `balance − fee`.

**Diagnose:** Compare source's pre-delete balance to `delivered_amount` on the destination.

**Fix:** Expected behavior. Plan for the fee.

### 14. Wrong network — looks like data is missing

**Symptom:** `account_info` returns `actNotFound` for an address you know exists.

**Cause:** Wrong network. Mainnet, Testnet, and Devnet have distinct account states.

**Diagnose:** `server_info` → `network_id` (0 = Mainnet, 1 = Testnet, 2 = Devnet, ≥1024 for sidechains). Compare to where you expect the account.

**Fix:** Switch endpoint. Mainnet `wss://xrplcluster.com`, Testnet `wss://s.altnet.rippletest.net:51233`, Devnet `wss://s.devnet.rippletest.net:51233`.

### 15. Reserve held by stale Offers eating spendable balance

**Symptom:** Account "has" 50 XRP but can only spend a few. No active orders the developer set.

**Cause:** Each Offer costs one owner reserve increment. Stale partially-filled offers accumulate.

**Diagnose:** `account_info` → `OwnerCount`. `account_objects` → enumerate; cancel offers without an immediate use.

**Fix:** `OfferCancel` for each stale offer. Spendable balance recovers `reserve_inc` per cancellation.

# `tec*` codes — finalized transaction failures

A `tec*` result means the transaction **was applied to a ledger**, the **fee was destroyed**, and the **sequence number was consumed**. The transaction is on-ledger — you can fetch it by hash and read its metadata. Fixing a `tec*` failure requires submitting a **new** transaction.

> Authoritative source: <https://xrpl.org/docs/references/protocol/transactions/transaction-results/tec-codes>

---

## Hot codes — read these first

Most `tec*` reports in practice resolve to one of these. Jump straight to the linked section; if the diagnosis matches, stop reading.

| Code | Root cause in one line | Section |
| :---- | :---- | :---- |
| `tecINSUFFICIENT_RESERVE` | New object would push balance below `reserve_base + OwnerCount × reserve_inc`. | [Reserve family](#reserve-family) |
| `tecINSUF_RESERVE_LINE` | Same as above, emitted by `TrustSet`. | [Reserve family](#reserve-family) |
| `tecUNFUNDED_PAYMENT` | Sender doesn't hold the asset (or enough of it) at execution time. | [Funding / balance family](#funding--balance-family) |
| `tecPATH_DRY` | No liquidity along any path the engine tried. | [`tecPATH_DRY` (128)](#tecpath_dry-128) |
| `tecPATH_PARTIAL` | Liquidity exists but not enough to deliver `DeliverMin` / `Amount`. | [`tecPATH_PARTIAL` (101)](#tecpath_partial-101) |
| `tecNO_LINE` | Destination has no trust line for the IOU being sent. | [`tecNO_LINE` (135)](#tecno_line-135) |
| `tecNO_AUTH` | Trust line exists but issuer hasn't authorized it (`lsfRequireAuth`). | [`tecNO_AUTH` (134)](#tecno_auth-134) |
| `tecFROZEN` | Issuer froze the trust line (global, individual, or deep freeze). | [`tecFROZEN` (137)](#tecfrozen-137) |
| `tecDST_TAG_NEEDED` | Destination requires `DestinationTag` and the tx omitted one. | [`tecDST_TAG_NEEDED` (143)](#tecdst_tag_needed-143) |
| `tecNO_DST` / `tecNO_DST_INSUF_XRP` | Destination account doesn't exist (or under-funded for activation). | [`tecNO_DST` (124)](#tecno_dst-124) |
| `tecNO_PERMISSION` | Permission/DepositAuth/Credentials gate denied the tx. | [`tecNO_PERMISSION` (139)](#tecno_permission-139) |
| `tecKILLED` | Immediate-or-cancel offer that filled nothing (post-`ImmediateOfferKilled`). | [`tecKILLED` (150)](#teckilled-150) |
| `tecEXPIRED` | Object had an `Expiration` already in the past. | [`tecEXPIRED` (148)](#tecexpired-148) |

For each code, the section below describes which queries answer it. For live numbers about a specific account (balance, owner count, computed reserve gap, recent-failure patterns), run `scripts/diagnose.py account <address>` or `scripts/diagnose.py patterns <address>`.

---

## Reserve family

These all mean the same root cause — adding a new object would push the account below the reserve requirement — but they're emitted by different transaction paths.

### `tecINSUFFICIENT_RESERVE` (141)

**Emitted by:** `SignerListSet`, `PaymentChannelCreate`, `PaymentChannelFund`, `EscrowCreate`, and other transactions that create owned objects.

**Cause:** The new object would push the sender below `reserve_base + OwnerCount × reserve_inc`.

**Diagnose:**
1. `account_info` → record `Balance` (drops) and `OwnerCount`.
2. `server_state` → record `reserve_base_xrp` and `reserve_inc_xrp` (or fetch them in drops via `reserve_base` / `reserve_inc`).
3. Compute: `required_after_tx = reserve_base + (OwnerCount + 1) × reserve_inc + tx_cost`. Compare to `Balance`.

**Fix:** Fund the sender with the gap amount, or free up an owner object (delete an unused trust line, offer, check, escrow, etc.). Use `account_objects` to enumerate what's currently held.

### `tecINSUF_RESERVE_LINE` (122)

**Emitted by:** `TrustSet`.

**Cause:** The sender doesn't have enough XRP to add a new trust line. Specifically: the **counterparty already has a trust line in a non-default state to this account**, and adding the reciprocal would push the sender below reserve. (For the other side of this, see `tecNO_LINE_INSUF_RESERVE`.)

**Diagnose:** Same as `tecINSUFFICIENT_RESERVE`. Then run `account_lines` on the counterparty with `peer: <sender>` to confirm the existing non-default trust line.

**Fix:** Fund the sender, or have the counterparty reset their trust line to default first.

### `tecINSUF_RESERVE_OFFER` (123)

**Emitted by:** `OfferCreate`.

**Cause:** The sender lacks the reserve to add a new Offer object, **and the transaction didn't fill any amount** at execution. (If it filled partially, the result is `tesSUCCESS` and no offer is left on the books.)

**Diagnose:** Same reserve calculation. Also check `book_offers` for the pair — if the order book is dry on the side you're hitting, no fill happens, no offer can be placed.

**Fix:** Fund the sender, or send an Immediate-or-Cancel offer (`tfImmediateOrCancel`) that doesn't need to persist.

### `tecNO_LINE_INSUF_RESERVE` (126)

**Emitted by:** Payments that need to auto-create a trust line on the **destination** to deliver tokens.

**Cause:** The **destination** doesn't have enough XRP to support a new trust line. (Different from `tecINSUF_RESERVE_LINE`, which is the sender's side.)

**Diagnose:** `account_info` on the destination. Compute the same way.

**Fix:** Fund the destination, or have them create the trust line themselves with `LimitAmount` already set.

### `tecINSUF_RESERVE_LINE` vs. `tecNO_LINE_INSUF_RESERVE` — which side?

| If you see… | The problem account is… |
| :---- | :---- |
| `tecINSUF_RESERVE_LINE` | The **sender** of the `TrustSet` |
| `tecNO_LINE_INSUF_RESERVE` | The **destination** of a Payment that would auto-create a line |

---

## Funding / balance family

### `tecUNFUNDED_PAYMENT` (104)

**Cause:** The sender doesn't hold enough of the source currency to deliver the `Amount` (or `SendMax`, if set).

**Diagnose:**
- **XRP payment:** `account_info` → check `Balance` ≥ `Amount + Fee + (reserve floor)`. Remember: the available balance is `Balance − (reserve_base + OwnerCount × reserve_inc)`.
- **IOU payment:** `account_lines` on sender → find the line for `{currency, issuer}` and check `balance` is sufficient. If the sender **is** the issuer, balance check differs (issuers can issue freely up to trust line `limit_peer`).

**Fix:** Fund the source, lower the `Amount`, or use `tfPartialPayment` if a partial delivery is acceptable.

### `tecUNFUNDED_OFFER` (103)

**Cause:** The sender doesn't hold a positive amount of the `TakerGets` currency. (Exception: if `TakerGets` is a token that the sender issues, this is allowed.)

**Diagnose:** `account_lines` on the sender for the `TakerGets` currency/issuer. If the line doesn't exist or balance is zero, you're unfunded.

### `tecUNFUNDED` (129)

Older / generic version. Now usually surfaces as `tecUNFUNDED_PAYMENT` or `tecUNFUNDED_OFFER`.

### `tecINSUFFICIENT_FUNDS` (159)

**Cause:** One of the accounts involved doesn't hold enough of a necessary asset. Surfaces in NFT, Check, AMM, and complex payment paths.

**Diagnose:** Look at the tx body — identify every account/asset combination it touches and check holdings for each.

### `tecINSUFFICIENT_PAYMENT` (161)

**Cause:** The amount specified isn't enough to cover all fees (e.g., NFT broker fee + sell amount). Common in `NFTokenAcceptOffer` with broker.

### `tecINSUFF_FEE` (136)

**Cause:** The sender's balance dropped below the specified `Fee` **after** the tx was distributed to enough of the network to be in a consensus set. In this case, the entire remaining balance is destroyed (not just the fee).

**Diagnose:** `account_tx` on the sender — look for the prior transactions that drained the account between submission and consensus.

**Fix:** Always submit with a `Fee` you can comfortably afford and avoid racing multiple txs through tight balances.

---

## Path / liquidity family

### `tecPATH_DRY` (128)

**Cause:** The payment found **no path with any liquidity at all** at execution time. Common causes: missing trust line, no DEX offers exist for the pair, or all candidate paths have been frozen since submission.

**Diagnose:**
1. `tx` → read the `Paths` field and `SendMax`.
2. `account_lines` on **source** with `peer: <issuer>` — does the source actually hold the send currency?
3. `account_lines` on **destination** with `peer: <issuer>` — does the destination trust the deliver currency? (No trust line → can't receive IOUs.)
4. `book_offers` for the cross-currency hop(s) — is there liquidity on the books?
5. `path_find` (or `ripple_path_find`) with the same source/destination/amount — does it find any path now?

**Fix:** Establish the missing trust line, set `tfPartialPayment` if any delivery is acceptable, supply explicit `Paths`, or split into a different route (e.g., via a different issuer).

### `tecPATH_PARTIAL` (101)

**Cause:** A path existed but didn't have enough liquidity to deliver the **full** `Amount`. Only emitted when `tfPartialPayment` is **not** set.

**Diagnose:** Same as `tecPATH_DRY`, plus: `path_find` with successively smaller amounts to find where liquidity actually exists.

**Fix:** Lower the `Amount`, set `tfPartialPayment` (then check `delivered_amount` afterward), or supply better explicit `Paths`.

> **Why two codes?** `tecPATH_DRY` = zero delivered. `tecPATH_PARTIAL` = some path existed but it bottomed out before reaching the full amount.

---

## Destination existence family

### `tecNO_DST` (124)

**Cause:** The destination account doesn't exist on the ledger (it has never been funded). For TrustSet, this means the issuer doesn't exist yet.

### `tecNO_DST_INSUF_XRP` (125)

**Cause:** Destination doesn't exist **and** the Payment doesn't send enough XRP to create it (must be ≥ the base reserve, currently 1 XRP on most networks — confirm via `server_state.reserve_base_xrp`).

**Diagnose:** `account_info` on the destination → expect `actNotFound`. `server_state` → confirm `reserve_base_xrp`.

**Fix:** Send a Payment of at least the base reserve in XRP to create the account, then proceed with the original transaction.

> **Heads-up:** Sending exactly the reserve doesn't leave the new account with any spendable balance. Send `reserve_base + a margin` (e.g., 2 XRP) if the account will need to do anything immediately.

---

## Trust line family

### `tecNO_LINE` (135)

**Cause varies by tx type:**
- **OfferCreate:** the issuer requires authorized trust lines (`lsfRequireAuth`) and the sender doesn't have a trust line for `TakerPays`.
- **Payment delivering an IOU:** destination has no trust line for the currency/issuer **and** the issuer requires authorization.
- **Generic:** trust line doesn't exist where one is required.

**Diagnose:** `account_lines` on the involved account, filtered by `peer: <issuer>` for that currency. If the line is missing, that's the cause.

**Fix:** Submit a `TrustSet` from the holder to the issuer establishing the line first.

### `tecNO_AUTH` (134)

**Cause:** The issuer has `lsfRequireAuth` set. The trust line **exists** but hasn't been authorized by the issuer.

**Diagnose:** `account_lines` → find the line. Check whether the issuer's side has `authorized` flag. Cross-reference with `account_info` on the issuer → look for `lsfRequireAuth` in `Flags`.

**Fix:** Issuer submits a `TrustSet` with `tfSetfAuth` to authorize the holder's line.

### `tecNO_LINE_REDUNDANT` (127)

**Cause:** A `TrustSet` tried to set the line to its default state, but no line exists to reset.

**Fix:** Either do nothing (no line is already the default), or set a non-default `LimitAmount` to actually create the line.

### `tecNO_ISSUER` (133)

**Cause:** The `issuer` address in an Amount object doesn't exist on the ledger.

**Diagnose:** `account_info` on the issuer address → expect `actNotFound`.

**Fix:** Verify the issuer address (common copy-paste / network mismatch error). Issuer addresses for popular tokens differ between Mainnet and Testnet — check the docs.

### `tecFROZEN` (137)

**Cause:** A trust line involved in the transaction is frozen — either an individual freeze, a global freeze (`lsfGlobalFreeze` on the issuer), or a deep freeze on the `TakerPays` side of an OfferCreate.

**Diagnose:**
1. `account_info` on the issuer → check `Flags` for `lsfGlobalFreeze` (0x00400000) and `lsfNoFreeze`.
2. `account_lines` on the holder, filtered by issuer → look for `freeze` or `freeze_peer` on the line.

**Fix:** Issuer must clear the freeze. If the issuer set `lsfNoFreeze` they can't freeze anymore — but past freezes still apply. Wait for unfreeze or route around the issuer.

---

## Destination tag / authorization family

### `tecDST_TAG_NEEDED` (143)

**Cause:** The destination has `lsfRequireDestTag` (often set by exchanges and custodians), but the Payment didn't include a `DestinationTag`.

**Diagnose:** `account_info` on destination → confirm `Flags` includes `lsfRequireDestTag` (0x00020000).

**Fix:** Resubmit with the correct `DestinationTag`. **Always check with the destination operator before guessing** — sending a payment with the wrong tag to an exchange can land in someone else's account.

### `tecNO_PERMISSION` (139)

**Cause:** Several distinct sub-cases:
- **DepositAuth:** Payment to an account with `lsfDepositAuth` set, and the sender isn't pre-authorized via `DepositPreauth`.
- **EscrowFinish:** Trying to finish before `FinishAfter` time.
- **PaymentChannelFund:** Sender isn't the channel owner.
- **OfferCreate with DomainID:** Sender isn't a member of that domain.

**Diagnose:** Check the tx type, then the specific blocker:
- DepositAuth → `account_info` on destination, look for `lsfDepositAuth` (0x01000000). `account_objects` filtered for `DepositPreauth` to see who's pre-authorized.
- Escrow → `account_objects` of the source for `Escrow` entries, check `FinishAfter` vs. current `ledger_close_time`.

**Fix depends on subcase:** Use `DepositPreauth` for DepositAuth gating, wait for `FinishAfter` for escrows, transfer ownership for channels, join the domain for permissioned DEX.

---

## Account deletion family

### `tecHAS_OBLIGATIONS` (151)

**Cause:** `AccountDelete` failed because the account holds objects that can't be deleted (e.g., trust lines with non-zero balance, NFTs, unfinished escrows where this account is the destination).

**Diagnose:** `account_objects` on the source — enumerate what's left. Cross-reference with the [deletable objects list](https://xrpl.org/docs/concepts/accounts/deleting-accounts#requirements-for-deletion).

**Fix:** Settle each outstanding obligation, then retry. Trust lines need balances at zero; NFTs must be transferred or burned; pending escrows pointing at this account must finish or cancel first.

### `tecTOO_SOON` (152)

**Cause:** `AccountDelete` requires the current `ledger_index` to be at least 256 higher than the account's `Sequence`. Brand-new (or recently very active) accounts can't be deleted immediately.

**Diagnose:** `account_info` on the source → record `Sequence`. `ledger` → current `ledger_index`. Compute `ledger_index − Sequence ≥ 256`.

**Fix:** Wait. Ledgers close every ~3.5 s, so 256 ledgers ≈ 15 minutes.

### `tecOWNERS` (132)

**Cause:** Trying to enable `lsfRequireAuth` on an account that already owns objects (trust lines, offers). This flag can only be set on a clean account.

**Diagnose:** `account_objects` → expect non-empty.

**Fix:** Remove all owned objects first, then set the flag, then re-establish them.

---

## Offer-specific

### `tecKILLED` (150)

**Cause:** `OfferCreate` with `tfFillOrKill` couldn't be filled in full and was killed. With the **ImmediateOfferKilled** amendment, also returns when `tfImmediateOrCancel` is set and the offer executed without moving any funds.

**Diagnose:** `book_offers` for the pair to see actual liquidity.

**Fix:** Use `tfImmediateOrCancel` if partial fill is OK, or place a passive offer (no fill-or-kill) to wait on the books.

### `tecEXPIRED` (148)

**Cause:** The tx tried to create an object (Offer, Check, NFTokenOffer) whose `Expiration` is in the past.

**Diagnose:** Convert `Expiration` (XRPL epoch seconds since 2000-01-01) → wall time. Compare to current ledger close time.

**Fix:** Set `Expiration` further into the future, or omit it.

### `tecDIR_FULL` (121)

**Cause:** Owner directory or order book directory full. Now effectively impossible if the `fixDirectoryLimit` amendment is enabled (it is, on Mainnet).

---

## AMM family

`tecUNFUNDED_AMM`, `tecAMM_BALANCE`, `tecAMM_FAILED`, `tecAMM_INVALID_TOKENS`, `tecAMM_EMPTY`, `tecAMM_NOT_EMPTY`, `tecAMM_ACCOUNT`.

For per-code definitions and numeric values, see <https://xrpl.org/docs/references/protocol/transactions/transaction-results/tec-codes>.

**Diagnostic recipe (applies to all `tecAMM_*`):** `amm_info` for the pool to see current pool balances and LP Token supply. `account_lines` to verify the sender's holdings of both pool assets. Cross-check the enabled status of the `AMM`, `fixAMMv1_1`, `fixAMMOverflowOffer`, and `AMMClawback` amendments via `feature` — several `tecAMM_FAILED` and rounding cases are amendment-dependent.

---

## NFT family

`tecNFTOKEN_BUY_SELL_MISMATCH`, `tecNFTOKEN_OFFER_TYPE_MISMATCH`, `tecCANT_ACCEPT_OWN_NFTOKEN_OFFER`, `tecNO_SUITABLE_NFTOKEN_PAGE`, `tecMAX_SEQUENCE_REACHED`.

For per-code definitions, see <https://xrpl.org/docs/references/protocol/transactions/transaction-results/tec-codes>.

**Diagnostic recipe:** `nft_sell_offers` / `nft_buy_offers` on the NFT's `nft_id` to inspect both sides of an `NFTokenAcceptOffer`. `account_nfts` on the owner to confirm the NFT is still held and not burned.

---

## Key-management family

### `tecNEED_MASTER_KEY` (142)

**Cause:** The transaction needs to be signed by the **master key specifically** (disabling the master, giving up freeze ability, etc.) but was signed by a regular key or signer list.

**Diagnose:** Read the tx — look at which flags it sets. Master-only operations are documented per transaction type.

**Fix:** Re-sign with the master key.

### `tecNO_ALTERNATIVE_KEY` (130)

**Cause:** Tried to remove the only remaining authorization method (e.g., delete a SignerList when master is already disabled).

**Diagnose:** `account_info` → check `Flags` for `lsfDisableMaster`. `account_objects` for `SignerList`. `RegularKey` field in `account_info`.

**Fix:** Set up another auth method first, then remove the one you wanted to remove.

### `tecNO_REGULAR_KEY` (131)

Deprecated since multi-signing. Same idea as `tecNO_ALTERNATIVE_KEY`.

---

## Other `tec*` codes

For codes not covered above — `tecCLAIM`, `tecFAILED_PROCESSING`, `tecINTERNAL`, `tecINVARIANT_FAILED`, `tecOVERSIZE`, `tecMAX_SEQUENCE_REACHED`, `tecCRYPTOCONDITION_ERROR`, `tecNO_ENTRY`, `tecNO_TARGET`, `tecOBJECT_NOT_FOUND`, `tecDUPLICATE`, `tecEMPTY_DID`, `tecINVALID_UPDATE_TIME`, and any newer codes — see <https://xrpl.org/docs/references/protocol/transactions/transaction-results/tec-codes>.

**`tecINTERNAL` and `tecINVARIANT_FAILED` specifically:** these indicate a rippled-side bug. If you can reproduce, file at <https://github.com/XRPLF/rippled/issues> with the tx hash and network.

For codes that mean the tx **never made it on-ledger** (no fee charged), see [tef-tel-tem-ter-codes.md](tef-tel-tem-ter-codes.md).

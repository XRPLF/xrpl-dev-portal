**Repo Settlement Tutorial: Storyboard & Variables**

**1\. The Story**

AlphaFund (an asset manager) has tokenized its money market fund as TMMF on XRPL. InvestCo (a primary investor) buys TMMF from AlphaFund. InvestCo then enters a repo trade with TradeDesk (the repo counterparty): InvestCo sells 100 TMMF to TradeDesk in exchange for 1,000 USD, holds for 10 days, and buys it back with interest. Both legs settle atomically and confidentially. xSecurities orchestrates the swap.

Orchestrator to blanket fund every transaction and object for AlphaFund, InvestCo, and TradeDesk.

---

**2\. Players**

| Name | Role | What They Do |
| :---- | :---- | :---- |
| AlphaFund | Issuer | Issues TMMF. Authorizes holders. Does not participate in the swap. |
| InvestCo | Buyer (from issuer) → Repo Seller | Buys TMMF from AlphaFund. Then sells TMMF to TradeDesk in the repo (near leg) and buys it back (far leg). |
| TradeDesk | Repo Counterparty (Buyer) | Holds USD. Buys TMMF from InvestCo in the near leg, returns it in the far leg. |
| xSecurities | Orchestrator | Constructs batches, collects signatures, submits. Holds nothing. |
| StableCorp | USD Issuer | Issues USD. Distributes to TradeDesk. Not active after setup. |

---

**3\. Deal Terms**

| Field | Value |
| :---- | :---- |
| Collateral asset | TMMF (issued by AlphaFund) |
| Cash asset | USD (issued by StableCorp) |
| Near leg | InvestCo sends 100 TMMF → TradeDesk, TradeDesk sends 1,000 USD → InvestCo |
| Tenor | 10 days |
| Interest rate | 5% annualized (tracked off-chain) |
| Far leg | TradeDesk returns 100 TMMF → InvestCo, InvestCo returns 1,001.37 USD → TradeDesk |

---

**4\. The Flow**

**Step 1: Issue TMMF (AlphaFund)**

AlphaFund creates TMMF using MPTokenIssuanceCreate with flags: lsfMPTRequireAuth, lsfMPTCanTransfer, lsfMPTCanHoldConfidentialBalance. Generates ElGamal keypair, registers via MPTokenIssuanceSet.

Transactions: MPTokenIssuanceCreate, MPTokenIssuanceSet.

**Step 2: Issue USD (StableCorp)**

StableCorp creates/or already has USD using MPTokenIssuanceCreate with flag: lsfMPTCanHoldConfidentialBalance. Generates ElGamal keypair, registers via MPTokenIssuanceSet. Sends 1,000 USD to TradeDesk.

Transactions: MPTokenIssuanceCreate, MPTokenIssuanceSet, Payment.

**Step 3: Authorize Holdings (AlphaFund as gatekeeper)**

Both InvestCo and TradeDesk need to be authorized by AlphaFund to hold TMMF. Both also need to be able to hold USD.

* InvestCo sends MPTokenAuthorize to opt in to TMMF.  
* AlphaFund sends MPTokenAuthorize to approve InvestCo for TMMF.  
* TradeDesk sends MPTokenAuthorize to opt in to TMMF.  
* AlphaFund sends MPTokenAuthorize to approve TradeDesk for TMMF.  
* InvestCo sends MPTokenAuthorize to opt in to USD (so InvestCo can receive USD in the swap).

After this step: InvestCo and TradeDesk are both authorized to hold TMMF. InvestCo can hold USD.

Transactions: MPTokenAuthorize (x5).

**Step 4: Primary Purchase (InvestCo buys TMMF from AlphaFund)**

InvestCo buys 100 TMMF from AlphaFund. This is a standard MPT transfer (the primary market purchase, not part of the repo). Payment happens off-chain (fiat) or wallet to wallet transaction (stabelcoin); AlphaFund sends TMMF on-ledger upon confirmation.

After this step: InvestCo holds 100 TMMF.

Transaction: Payment (AlphaFund → InvestCo, 100 TMMF).

**Step 5: Convert to Confidential Balances (InvestCo \+ TradeDesk)**

Both parties generate ElGamal keypairs and convert their balances to confidential:

* InvestCo: ConfidentialMPTConvert moves 100 TMMF from public balance to CB-spendable.  
* TradeDesk: ConfidentialMPTConvert moves 1,000 USD from public balance to CB-spendable.

Transactions: ConfidentialMPTConvert (x2).

**Step 6: Construct the Near Leg Batch (xSecurities)**

xSecurities constructs a Batch (ALLORNOTHING mode):

* Inner Tx A: ConfidentialMPTSend — InvestCo sends 100 TMMF to TradeDesk.  
* Inner Tx B: ConfidentialMPTSend — TradeDesk sends 1,000 USD to InvestCo.

Each inner transaction includes encrypted amounts and a ZK proof.

**Callout:** In production, xSecurities routes the unsigned batch hash to each party's custodian for signing. There is no standard cross-custodian signing API. This is an application-layer concern. In this tutorial, signing is simulated client-side with Devnet wallets.

No transaction, construction only.

**Step 7: Co-Sign (InvestCo \+ TradeDesk)**

InvestCo signs the batch. TradeDesk signs the batch. xSecurities assembles the BatchSigners array (sorted by AccountID ascending).

No transaction, off-chain signing.

**Step 8: Submit Near Leg (xSecurities)**

xSecurities submits the fully signed batch. XRPL verifies signatures, validates ZK proofs, checks balances, executes atomically.

Result: InvestCo has 1,000 USD in CB-inbox. TradeDesk has 100 TMMF in CB-inbox.

Transaction: Batch.

**Step 9: Merge Inbox (InvestCo \+ TradeDesk)**

Both parties merge received tokens from CB-inbox to CB-spendable:

* InvestCo: ConfidentialMPTMergeInbox for USD.  
* TradeDesk: ConfidentialMPTMergeInbox for TMMF.

**Callout:** This step is required before the far leg. Tokens in CB-inbox cannot be spent. Skipping merge will cause the far leg to fail.

Transactions: ConfidentialMPTMergeInbox (x2).

**Step 10: Construct the Far Leg Batch (xSecurities)**

10 days later. Directions is reversed and interest is added:

* Inner Tx A: ConfidentialMPTSend: TradeDesk returns 100 TMMF to InvestCo.  
* Inner Tx B: ConfidentialMPTSend: InvestCo returns 1,001.37 USD to TradeDesk.

**Callout:** The interest (5% annualized × 10/365 × 1,000 \= 1.37 USD) is computed off-chain. The ledger does not calculate interest. The orchestrator embeds the agreed total in the transaction amount.

No transaction, construction only.

**Step 11: Sign \+ Submit Far Leg (InvestCo \+ TradeDesk \+ xSecurities)**

Same signing and submission as Steps 7-8.

Result: InvestCo has 100 TMMF in CB-inbox. TradeDesk has 1,001.37 USD in CB-inbox.

Transaction: Batch.

**Step 12: Final Merge Inbox (InvestCo \+ TradeDesk)**

* InvestCo: ConfidentialMPTMergeInbox for TMMF.  
* TradeDesk: ConfidentialMPTMergeInbox for USD.

Final state: InvestCo holds 100 TMMF in CB-spendable. TradeDesk holds 1,001.37 USD in CB-spendable. Repo complete.

Transactions: ConfidentialMPTMergeInbox (x2).

---

**5\. Transaction Summary**

| Step | Who | Transaction | Count |
| ----- | ----- | ----- | ----- |
| 1 | AlphaFund | MPTokenIssuanceCreate, MPTokenIssuanceSet | 2 |
| 2 | StableCorp | MPTokenIssuanceCreate, MPTokenIssuanceSet, Payment | 3 |
| 3 | AlphaFund \+ InvestCo \+ TradeDesk | MPTokenAuthorize | 5 |
| 4 | AlphaFund → InvestCo | Payment | 1 |
| 5 | InvestCo \+ TradeDesk | ConfidentialMPTConvert | 2 |
| 6-7 | xSecurities \+ InvestCo \+ TradeDesk | (construction \+ signing) | 0 |
| 8 | xSecurities | Batch (near leg) | 1 |
| 9 | InvestCo \+ TradeDesk | ConfidentialMPTMergeInbox | 2 |
| 10-11 | xSecurities \+ InvestCo \+ TradeDesk | Batch (far leg) | 1 |
| 12 | InvestCo \+ TradeDesk | ConfidentialMPTMergeInbox | 2 |
| **Total** |  |  | **19** |

---

**6\. Key Callouts for Tutorial**

* **Off-chain signing coordination:** Steps 6-7 and 10-11. In production, each party's custodian signs independently. No standard API exists. Application-layer concern.  
* **ZKP freshness:** Proofs in Steps 6 and 10 are bound to CB-spendable state. Any intervening transaction invalidates them. Generate late, submit immediately.  
* **Interest is off-chain:** The 1.37 USD in Step 10 is computed by the orchestrator, not the ledger.  
* **Merge inbox is mandatory between legs:** Step 9 must happen before Step 10 or the far leg fails.  
* **Issuer is not a swap participant:** AlphaFund's role ends after Step 4\. The repo is between InvestCo and TradeDesk. AlphaFund only gates who can hold TMMF.


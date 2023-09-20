---
html: stablecoin-precautions.html
parent: trust-lines-and-issuing.html
blurb: Precautions to consider when transferring stablecoin funds in and out of the XRPL.
labels:
  - Tokens
---
# Stablecoin Precautions

Processing payments to and from the XRP Ledger naturally comes with some risks, so an issuer should be sure to take care in implementing these processes. As a stablecoin issuer, you should consider the following precautions:

- Protect yourself against reversible deposits. XRP Ledger payments are irreversible, but many digital payments are not. Scammers can abuse this to take their fiat money back by canceling a deposit after receiving tokens in the XRP Ledger.
- When sending into the XRP Ledger, always specify your issuing address as the issuer of the token. Otherwise, you might accidentally use paths that deliver the same currency issued by other addresses.
- Before sending a payment into the XRP Ledger, double check the cost of the payment. A payment from your operational address to a customer should not cost more than the destination amount plus any transfer fee you have set.
- Before processing a payment out of the XRP Ledger, make sure you know the customer's identity. This makes it harder for anonymous attackers to scam you. Most anti-money-laundering regulations require this anyway. This is especially important because the users sending money from the XRP Ledger could be different than the ones that initially received the money in the XRP Ledger.
- Follow the guidelines for reliable transaction submission when sending XRP Ledger transactions.
- Robustly monitor for incoming payments, and read the correct amount. Don't mistakenly credit someone the full amount if they only sent a [partial payment](partial-payments.html). See [Robustly monitoring for payments](robustly-monitoring-for-payments.html).
- Track your obligations and balances within the XRP Ledger, and compare with the assets in your collateral account. If they do not match up, stop processing withdrawals and deposits until you resolve the discrepancy.
- Avoid ambiguous situations. We recommend the following:
    - Enable the `Disallow XRP` flag for the issuing address and all operational addresses, so customers do not accidentally send you XRP. (Private exchanges should *not* set this flag, since they trade XRP normally.)
    - Enable the [`RequireDest` flag](require-destination-tags.html) for the issuing address and all operational addresses, so customers do not accidentally send a payment without the destination tag to indicate who should be credited.
    - Enable the `RequireAuth` flag on all operational addresses so they cannot issue tokens by accident.
- Monitor for suspicious or abusive behavior. For example, a user could repeatedly send funds into and out of the XRP Ledger, as a denial of service attack that effectively empties an operational address's balance. Suspend customers whose addresses are involved in suspicious behavior by not processing their XRP Ledger payments.
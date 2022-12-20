---
html: escrow-uc.html
parent: payments-uc.html
blurb: Transactions allow accounts to modify the XRP Ledger.
labels:
  - Ledgers
---
# Escrow Use Case

A traditional escrow is a contract between two parties to facilitate financial transactions. A sender delivers funds to an impartial third party to hold, guaranteeing its availability to a recipient. The third party only releases the funds to the recipient when conditions specified by the contract are met. This method ensures both parties meet their obligations.

The XRP Ledger takes escrow a step further, removing the need for a third party to hold the funds. Instead, an escrow locks up XRP on the ledger itself, which can't be used or destroyed until conditions are met.

Learn about [Escrow](escrow.html) on the XRP Ledger.

---

## Use Cases

### Time-based Escrow

**Background:** Ripple holds a large amount of the total XRP, which it sells methodically as a way to fund and incentivize the healthy development of the XRP Ledger and related technologies. At the same time, owning such a large chunk of XRP causes problems for the company, such as:

- Individuals and businesses who use the XRP Ledger worry that their investments in XRP could be diluted or devalued if Ripple floods the market. Flooding the market would be a long-term loss for Ripple, but the possibility the company could do so exerts downward pressure on the price of XRP and decreases the value of the company's assets.
- Ripple must carefully manage ownership of its accounts to protect against digital theft and other forms of malicious behavior--even by insiders.

**Solution:** By placing 55 billion XRP into time-based escrows, Ripple ensures that the supply of XRP in circulation is predictable and increases at a slow and steady rate. Anyone who holds XRP knows that Ripple can't flood the market, even if the company's priorities or strategy changes.

Placing the money into escrow sharply limits the amount of XRP that can be stolen or redirected if a malicious actors gains temporary control over Ripple's XRP account. This reduces the risk of catastrophic losses of XRP and increases the time for Ripple to detect, prevent, and track down unintended uses of Ripple's XRP assets.

To get started with time-based escrows, see: [Create Time-based Escrows](time-escrows.html).


### Escrow Smart Contract

**Background:** Need good example here.

**Solution:** Ditto

To get started with escrow smart contracts, see: [Create Conditionally-held Escrows]().
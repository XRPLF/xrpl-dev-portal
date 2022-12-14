---
title: XRP Ledger Use Cases
---
import { XRPLCardDeck, DeckCard } from "_components/XRPLCardDeck";

# Payments

These use cases focus on payment capabilities of the XRP Ledger.

<XRPLCardDeck cols="1/3">
  <DeckCard title="Payment Channels" to="payment-channels-uc.md">
    As an individual buying items in bulk, I want to set up a payment channel to send "asynchronous" XRP payments to a vendor, such that the payment can be divided into very small increments and settled later.
  </DeckCard>
  <DeckCard title="Cross-Currency Payments" to="cross-currency-payments-uc.md">
    As an individual buyer, I want to set up a payment channel to send cross-currency payments that exchange tokens, XRP, or both.
  </DeckCard>
  <DeckCard title="Escrow" to="escrow-uc.md">
    As an individual making a payment for a physical asset, I want to set up an escrow (conditional payments) and set aside XRP, then deliver the XRP later when certain conditions are met.
  </DeckCard>
</XRPLCardDeck>
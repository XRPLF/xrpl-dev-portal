---
seo:
    description: Deep Freeze ensures that frozen token holders can neither send nor receive frozen funds until their trust line is unfrozen.
labels:
  - Tokens
  - Freeze
  - Deep Freeze
---
# Deep Freeze

Deep Freeze lets token issuers on the XRP Ledger prevent token misuse by frozen account holders. It enhances interactions between frozen assets and payments, ensuring that frozen token holders cannot receive funds until or unless their trust line is unfrozen. These changes enable token issuers to more easily comply with regulations on the XRPL. For example, it prevents tokens from flowing to wallets identified on sanctions lists, thereby enhancing regulatory compliance for use cases such as regulated stablecoins and real-world assets (RWA).

Deep Freeze impacts trust lines that interact with payments, offers, DEX, and AMM. Issuers can block sending and receiving of funds for holders in deep freeze.

{% amendment-disclaimer name="DeepFreeze" /%}

## Deep Freeze Mechanism

Deep Freeze is a setting on a trust line. It requires that the issuer implement a standard freeze on the trust line before enacting a deep freeze. The issuer cannot enact a deep freeze if they have enabled `No Freeze` on their account.

When an issuer enacts a deep freeze, the following rules apply to the tokens in that trust line:

- Payments can still occur directly between the two parties of the deep-frozen trust line.
- The counterparty of that trust line can no longer increase or decrease its balance on the deep-frozen trust line, except in direct payments to the issuer. The counterparty can only send the deep-frozen currencies directly to the issuer.
- The counterparty can neither send nor receive from others on the deep-frozen trust line.
- The counterparty's offers to buy or sell the tokens in the deep-frozen trust line are considered unfunded.

An individual address can deep freeze its trust line to an issuer or financial institution. This has no effect on transactions between the institution and other users. However, it does the following:

- It prevents other addresses from sending that financial institution's tokens to the individual address.
- It also prevents the individual address from sending the token to other non-issuer addresses.

### RippleState Object

Deep Freeze introduces two flags, `lsfLowDeepFreeze` and `lsfHighDeepFreeze`, in the `RippleState` (trust line) object.

| Flag Name	| Flag Value	| Description |
|-----------|-------------|-------------|
| `lsfLowDeepFreeze`	| `0x02000000`	| The low account has deep-frozen the trust line, preventing the high account from sending and receiving the asset. |
| `lsfHighDeepFreeze`	| `0x04000000`	| The high account has deep-frozen the trust line, preventing the low account from sending and receiving the asset. |

See [High vs. Low Account](../../../references/protocol/ledger-data/ledger-entry-types/ripplestate.md#high-vs-low-account).

### TrustSet Transaction

Deep Freeze introduces two flags, `tfSetDeepFreeze` and `tfClearDeepFreeze`, in the `TrustSet` transaction.

| Flag Name	| Flag Value	| Description |
|-----------|-------------|-------------|
| `tfSetDeepFreeze`	| `0x00400000`	| Deep freeze the trust line. |
| `tfClearDeepFreeze`	| `0x00800000` | Clear a deep-freeze on the trust line. |

A `TrustSet` transaction trying to set `tfSetDeepFreeze` succeeds if and only if one of the following is true:

- The holder is already frozen, indicated by `lsfLowFreeze`/`lsfHighFreeze` on the trust line.
- `tfSetFreeze` is also set in the same `TrustSet` transaction.

Deep Freeze introduces an additional restriction on `TrustSet`:

If the trust line is deep-frozen by the issuer (indicated by `lsfLowDeepFreeze`/`lsfHighDeepFreeze`), the `TrustSet` transaction fails if the issuer sets the `tfClearFreeze` flag without also setting the `tfClearDeepFreeze` flag. In other words, the issuer cannot clear the regular freeze on a trust line without also clearing the deep freeze.

## Payment Engine

Payment Engine executes paths that are made of steps to connect the sender to the receiver. In general, funds can be deposited into a trust line through one of two steps:

- [Rippling](#rippling)
- [Order book or AMM](#order-book)

### Rippling

Receipt of funds in a deep-frozen trust line as a result of a rippling step will fail.

### Order Book

If an offer owner is deep-frozen for the `TakerPays` token (buy amount), any offer is considered to be unfunded and the offer fails.

## OfferCreate transaction

Deep Freeze requires a change to the `OfferCreate` transaction:

`OfferCreate` returns `tecFROZEN` if the `TakerPays` (buy amount) token has been deep-frozen by the issuer.
Moreover, any existing offers where the owner has been deep-frozen on the `TakerPays` token can no longer be consumed. It is considered an unfunded offer that is implicitly cancelled by new offers that cross it.

## How does MPT freeze/lock behavior differ from IOU?

The Multi-Purpose Token (MPT) freeze/lock functionality differs somewhat from how IOUs work. When an MPT holder is locked, they cannot send or receive MPT payments, so a single flag is sufficient.

For IOUs, the regular freeze only disallows sending. If the issuer wants to block receiving as well, they must apply a deep freeze.

{% raw-partial file="/docs/_snippets/common-links.md" /%}

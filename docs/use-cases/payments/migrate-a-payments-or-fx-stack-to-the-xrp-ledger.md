---
seo:
    description: Learn how to migrate your payments or FX stack to the XRP Ledger.
labels:
  - Payments
  - Cross-Currency
---

# Migrate a Payments or FX Stack to the XRP Ledger

The XRP Ledger simplifies your [payments or FX stack](../payments/) migration by reducing the number of components you have to build, secure, and maintain yourself. There's no smart-contract layer to write; those capabilities are built into the protocol.

If you're already running a payments or FX stack and want to move it to the XRP Ledger, this guide is for you. It assumes familiarity with your current payment flows and a basic understanding of core XRP Ledger concepts, such as [accounts](../../concepts/accounts/index.md) and [transactions](../../concepts/transactions/index.md).

Migrating mainly involves mapping your existing stack to native primitives, not rebuilding it. The seven steps below walk you through that mapping to a live pilot.

## 1. Map Your Stack to XRP Ledger Primitives

Many features that you'd implement as a smart contract on other chains are supported as native transaction types on the XRP Ledger, so the behavior is already built into the protocol. Before you port anything, examine which capabilities your stack uses and compare them to the XRP Ledger's built-in primitives:

| What You Need | XRP Ledger Native Capability |
| --- | --- |
| Conditional or time-locked release of funds | [Escrow](../../concepts/payment-types/escrow.md) |
| Shared/multi-party control of an account | [Multi-signing](../../concepts/accounts/multi-signing.md) |
| Currency or asset issuance and management | [Trust Line Tokens](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) / [Multi-Purpose Tokens (MPTs)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) |
| On-chain currency conversion | [DEX](../../concepts/tokens/decentralized-exchange/index.md) order book, [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md), and [pathfinding](../../concepts/tokens/fungible-tokens/paths.md) |
| Rate quoting and price discovery | [Pathfinding](../../concepts/tokens/fungible-tokens/paths.md) and order book queries |
| Market making and liquidity provision | [DEX offers](../../concepts/tokens/decentralized-exchange/offers.md) and [AMMs](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) |
| Compliance-gated trading | [Permissioned DEXes][]] |

See [Transaction Types](../../references/protocol/transactions/types/index.md) for a comprehensive list of built-in transaction types. Some primitives depend on recently enabled [amendments](../../concepts/networks-and-servers/amendments.md), so check the [amendment status](/resources/known-amendments.md) on your target network before you design around it.

## 2. Choose Your Infrastructure Path

Once you've mapped the capabilities to XRP Ledger primitives, you have to decide how to connect to the network.

- Run your own ([`xrpld`](../../concepts/networks-and-servers/xrpld-server-modes.md) and [Clio](../../concepts/networks-and-servers/the-clio-server.md)): Most control over ledger history, query privacy, and throughput, without third-party dependencies. Requires high operational overhead for hardware and maintaining synced servers. See [Install and Run](../../infrastructure/index.md).
- Use a managed provider: Fastest way to ship with low upfront costs; someone else runs the nodes while you hold your keys and signing. Provides less control over [history retention](../../concepts/networks-and-servers/ledger-history.md), query privacy, and configuration, and you depend on their SLA.
- Use a custodial abstraction: Lowest security load and fastest integration, with the custodian holding keys and signing on your behalf. Provides least control over funds and features, vendor lock-in, and potential compliance implications.

The best path depends on your team's infrastructure experience and custody preferences. See the [payments overview](../payments/) for build-versus-partner guidance.

## 3. Pick a Client Library

After selecting your infrastructure, you need to decide which [library](../../references/client-libraries.md) you'll use to build, sign, and submit transactions and read the ledger state.

If you're using a custodial abstraction, the custodian's API is typically your client library, so you can skip ahead to [Step 5](#5-build-your-integration).

The best place to start is by matching the library to your backend's primary language. XRPLF maintains `xrpl.js` (JavaScript/TypeScript), `xrpl-py` (Python), and `xrpl4j` (Java), which track new [amendments](../../concepts/networks-and-servers/amendments.md) the fastest.

Other libraries, such as `xrpl-go` (Go) and `XRPL_PHP` (PHP), are community-maintained. Check the repositories for recent releases and confirm they support the amendments and features your integration needs before committing to one.

If you don't find a library that matches your backend, you can connect to the XRP Ledger using the [HTTP / WebSocket APIs](../../references/http-websocket-apis/index.md).

<!--
TODO(simpleXRPL): Re-enable this section when simpleXRPL is publicly released.
If you are using a custodian, `simpleXRPL` is the most direct path. It's an opinionated JavaScript client library that enables you to write business operations rather than protocol mechanics.

It routes each operation through the API of the custodian you've configured, so it executes natively through their existing approval and policy flow.

`simpleXRPL` is currently JavaScript-only and complements the low-level SDKs rather than replacing them. For complete protocol access, use `xrpl.js` or `xrpl-py` directly.
-->

## 4. Set Up Your Accounts

With your chosen client library, you can create and fund the accounts your integration will use to submit transactions and hold balances. On the XRP Ledger, a few things about accounts work differently:
- An account doesn't exist until it's funded. You can generate a [key pair](../../concepts/accounts/cryptographic-keys.md) offline, but the address isn't active on the ledger until it receives the [base reserve](../../concepts/accounts/reserves.md).
- Its reserve has two parts: a fixed [base reserve](../../concepts/accounts/reserves.md) every account holds, plus an owner reserve that adds a set amount for each ledger entry it owns (for example, a trust line, offer, or escrow). You can't spend below the two combined, which doubles as one of the ledger's anti-spam mechanisms.
- Holding and receiving issued tokens requires opting into each one, and every opt-in creates a ledger entry that adds to the account's [owner](../../concepts/accounts/reserves.md#owner-reserves). How an account opts in depends on the token type:
  - **Trust Line Tokens**: The account creates a trust line to the issuer.
  - **MPTs**: The account sends an MPTokenAuthorize transaction.

You can fund accounts on Testnet and Devnet using a [faucet](/resources/dev-tools/xrp-faucets). On [Mainnet](../../concepts/networks-and-servers/parallel-networks.md), you fund an account by sending it XRP from an exchange or an already-funded account. See [Accounts](../../concepts/accounts/index.md) for more on account creation and configuration.

On a test network, creating and funding an account is a single call:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/multisigning/js/set-up-multi-signing.js" language="js" from="Funding new wallet" before="// Generate key pairs" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/set-up-multi-signing.py" language="py" from="Funding new wallet" before="# Generate key pairs" /%}
{% /tab %}
{% /tabs %}

{% partial file="/docs/_snippets/testnet-seed-warning.md" /%}

Many operators separate roles across multiple accounts, using a treasury for reserves and balances, operating accounts for submission, and a [SignerList](../../concepts/accounts/multi-signing.md) where an account needs multi-party control. These accounts hold real funds, and on-ledger actions are irreversible, so give them a key strategy from the start. Generate each master key pair with [offline account setup](../../tutorials/best-practices/key-management/offline-account-setup.md), operate through a [regular key](../../tutorials/best-practices/key-management/assign-a-regular-key-pair.md), and [disable the master key](../../tutorials/best-practices/key-management/disable-master-key-pair.md) so a compromised regular key can be rotated without losing the account. See [Send a Multi-Signed Transaction](../../tutorials/best-practices/key-management/send-a-multi-signed-transaction.md) to set up multi-signing.

If you operate with a custodian, they create and manage these accounts and their keys. The steps outlined here only apply when you hold your own keys.

## 5. Build Your Integration

Now that your accounts are funded, you can port your business logic into native transaction types. Every transaction type follows the same lifecycle: construction, autofill, signing, submission, and verification. Once you understand this pattern, the rest of your integration will follow it.

Some common Web2 payments concepts work like this on the XRP Ledger:

| Web2 Concept | XRP Ledger Field |
| --- | --- |
| Nonce | [`Sequence`][Sequence Number] numbers order transactions serially per account. |
| Gas | [`Fee`][Transaction cost] is a low base cost that rises with network load. |
| Mempool | [`LastLedgerSequence`](../../concepts/transactions/reliable-transaction-submission.md) bounds how long a transaction stays pending; the XRP Ledger has no shared mempool. |
| Retries | [`Sequence`][Sequence Number]makes a resubmitted transaction apply at most once. |

For the guarantees behind these, see [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).

### Send a Payment

This example runs the entire payment lifecycle by autofilling `Fee`, `Sequence`, and `LastLedgerSequence`, signing locally, submitting, and waiting for a validated result before reading the outcome from the metadata.

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/send-xrp/js/send-xrp.js" language="js" from="// Prepare transaction" before="// End of main()" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/send-xrp/py/send-xrp.py" language="py" from="# Prepare transaction" /%}
{% /tab %}
{% /tabs %}

{% partial file="/docs/_snippets/testnet-seed-warning.md" /%}

### Convert Across Currencies

The previous example sends XRP, but [cross-currency payments](../../concepts/payment-types/cross-currency-payments.md) follow the same lifecycle, with two differences:
- `Amount` names a different currency and issuer than the source spends.
- `SendMax` caps the source spend.

{% admonition type="info" name="Note" %}
Cross-currency payments currently support only XRP and trust line tokens. MPTs require the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2), which is still in development.
{% /admonition%}

Both the sending and receiving accounts need a [trust line](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) to the issuer of any non-XRP currency they handle. Issuers can restrict who holds their currency with [authorized trust lines](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md).

The ledger automatically routes through the [DEX](../../concepts/tokens/decentralized-exchange/index.md) and [bridges through XRP](../../concepts/tokens/decentralized-exchange/autobridging.md) when that's cheaper. This collapses any external routing and conversion layer into just two fields, so there is no router to integrate.

A cross-currency payment can name a [domain ID](../../concepts/tokens/decentralized-exchange/permissioned-dexes.md) so it consumes only offers from the matching permissioned DEX, which keeps the conversion from trading against accounts you haven't approved. Accounts qualify for that domain by holding [credentials](../../tutorials/compliance-features/manage-credentials.md) from an issuer the domain trusts. Authorized trust lines keep an unauthorized account from receiving your issued balance in the first place. A payment that names a domain ID can't use AMM liquidity, so it has less to draw on than an unrestricted conversion.

On-chain conversion draws on both the order book and the [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md), and [pathfinding](../../concepts/tokens/fungible-tokens/paths.md) estimates the route rather than guaranteeing it. Bound each conversion: `SendMax` caps what the source spends, and a `DeliverMin` with the [`tfPartialPayment`](../../concepts/payment-types/partial-payments.md) flag floors what the destination receives.

The following example spends XRP and delivers USD to the destination, with both bounds set:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/cross-currency-payment/js/sendCrossCurrency.js" language="js" from="Prepare cross-currency Payment" before="End cross-currency payment" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/cross-currency-payment/py/send_cross_currency.py" language="py" from="Prepare cross-currency Payment" before="End cross-currency payment" /%}
{% /tab %}
{% /tabs %}

### Receive and Credit

Sending is only half of the integration. Your stack also has to detect payments arriving in your accounts and credit the correct user. Subscribe to your accounts with [transaction streams](../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#transaction-streams) to see payments as they validate. Before you rely on this in production, see [Robustly Monitoring for Payments](../../concepts/payment-types/robustly-monitoring-for-payments.md).

{% admonition type="warning" name="Caution" %}
Handle two XRP Ledger specifics before crediting anyone:

- **Credit the amount that actually arrived.** A [partial payment](../../concepts/payment-types/partial-payments.md) can deliver less than the `Amount` field shows. Read the `delivered_amount` metadata field, never `Amount`, or you expose the [partial payments exploit](../../concepts/payment-types/partial-payments.md#partial-payments-exploit).
- **Attribute pooled funds with destination tags.** When many users share one treasury or operating account, require [destination tags](../../concepts/transactions/source-and-destination-tags.md) with [`RequireDest`](../../tutorials/compliance-features/require-destination-tags.md) so each payment maps to the right user.
{% /admonition %}

### Supply Liquidity

If you supply the liquidity that payments consume, [ripple_path_find][ripple_path_find_method] and [book_offers][book_offers method] quote a rate, while [OfferCreate][OfferCreate transaction] and [OfferCancel][OfferCancel transaction] publish and pull your own offers. You can also supply liquidity passively by depositing into an [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) pool.

Every offer you leave in the ledger sets aside some XRP toward your [owner reserve](../../concepts/accounts/reserves.md). Issuers can also set a [tick size](../../concepts/tokens/decentralized-exchange/ticksize.md) that limits how many significant digits your offer's exchange rate can have, which sets the minimum increment needed to beat an existing offer. See [Trade in the Decentralized Exchange](../../tutorials/defi/dex/trade-in-the-decentralized-exchange.md) for more information.

## 6. Test on Testnet or Devnet

Before going live, complete your end-to-end testing on a public test network:
- [Testnet](../../concepts/networks-and-servers/parallel-networks.md): Mirrors Mainnet's amendment status and behavior. Primary environment for pre-launch validation.
- [Devnet](../../concepts/networks-and-servers/parallel-networks.md): Preview version for testing pre-release features or amendments that are not yet on Mainnet.

Neither uses real money, but both test networks are centralized and can be reset at any time. Don't rely on persistence or treat them like stable environments.

Then exercise the XRP Ledger-specific behaviors that can lose or misattribute funds, such as:
- Crediting `delivered_amount` on partial payments.
- Attributing pooled funds with destination tags.
- Enforcing reserve and trust line limits.
- Holding `SendMax`/`DeliverMin` under thin liquidity.
- Clearing submissions when the fee rises under load.

A submitted transaction isn't final until it's in a validated ledger, and being included is not the same as succeeding. Only `tesSUCCESS` and `tec` results are final. Both consume the `Fee`, but `tesSUCCESS` indicates that the transaction succeeded, while a `tec` indicates failure.

You can resubmit a transaction if it expires without validation. If you use `submitAndWait` and `autofill` (as in the previous step), the library waits for the validated result and sets the bounding fields for you. See [Transaction Results][result code] and [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).

## 7. Pilot a Live Corridor and Launch

After testing on Testnet or Devnet, run a live pilot with real traffic through one narrow corridor (or a single partner), and confirm reconciliation matches your expectations before you scale.

To do so:

1. Switch your endpoint from a test network to Mainnet.
2. Use real, funded Mainnet accounts.
3. Send real transactions through the same lifecycle (see [Build Your Integration](#5-build-your-integration)) and verify each reached a validated ledger.
4. Verify on-ledger results against your internal records. Query transaction history with [`account_tx`][account_tx method] (or via your Clio server) for reconciliation, and subscribe to [transaction streams](../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#transaction-streams) for real-time monitoring instead of polling. See [Robustly Monitoring for Payments](../../concepts/payment-types/robustly-monitoring-for-payments.md). At volume:
   - Page through `account_tx` with the returned `marker`.
   - Backfill with a bounded `account_tx` query if a stream disconnects.
   - Make reconciliation idempotent so replaying a ledger range never double-counts.
5. Enforce any KYC or travel-rule obligations for the corridor. See [Require Destination Tags](../../tutorials/compliance-features/require-destination-tags.md), and use [credentials](../../tutorials/compliance-features/manage-credentials.md) to attest a holder's verified status on-ledger.
6. Widen scope once verified. If reconciliation fails, delay the cutover and keep your existing rail live as the fallback.

Reconciliation is cleaner than on many networks. Once a transaction is in a validated ledger it's immutable and can't be reversed, so there's no probabilistic-settlement tail to account for. See [Finality of Results](../../concepts/transactions/finality-of-results/index.md) and [Consensus](../../concepts/consensus-protocol/index.md). That makes the verify step in your pilot straightforward.

How you cut over depends on your custody model:
- Custodial setups switch in a single window: snapshot your balances, fund the accounts on the XRP Ledger, and flip the payment engine.
- Self-custodial flows rely on users moving their own balances, so plan for a longer arc. User communication is usually the slowest piece.

Your payments stack now runs on native XRP Ledger primitives, giving you fewer components to build, secure, and maintain than the one you migrated from.

## See Also

- **Concepts:**
    - [Cross-Currency Payments](../../concepts/payment-types/cross-currency-payments.md)
    - [Decentralized Exchange](../../concepts/tokens/decentralized-exchange/index.md)
    - [Multi-Signing](../../concepts/accounts/multi-signing.md)
    - [Stablecoins](../../concepts/tokens/fungible-tokens/stablecoins/index.md)
- **Tutorials:**
    - [Get Started with the XRP Ledger](../../tutorials/get-started/get-started-javascript.md)
    - [Send a Multi-Signed Transaction](../../tutorials/best-practices/key-management/send-a-multi-signed-transaction.md)
    - [Trade in the Decentralized Exchange](../../tutorials/defi/dex/trade-in-the-decentralized-exchange.md)
- **References:**
    - [Transaction Types](../../references/protocol/transactions/types/index.md)
    - [Client Libraries](../../references/client-libraries.md)

{% raw-partial file="/docs/_snippets/common-links.md" /%}

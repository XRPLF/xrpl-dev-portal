---
seo:
    description: Learn how to migrate your payments or FX stack to the XRP Ledger.
labels:
  - Payments
  - Cross-Currency
---

# Migrate a Payments or FX Stack to the XRP Ledger

If you're already running a [payments or FX stack](../payments/) on another chain and want to move it to the XRP Ledger, this guide is for you. The XRP Ledger simplifies your migration by reducing the number of components you have to build, secure, and maintain yourself. Many of the capabilities you'd implement as smart contracts on other chains are built into the protocol, so there's less to write, deploy, or audit.

This guide assumes familiarity with your current payment flows and a basic understanding of core XRP Ledger concepts, such as [fungible tokens](../../concepts/tokens/fungible-tokens/index.md) and [payment types](../../concepts/payment-types/index.md). The six steps below walk you through the path from mapping your stack to a live pilot.

## 1. Map Your Stack to XRP Ledger Primitives

Many features that you'd implement as a smart contract on other chains are supported as native transaction types on the XRP Ledger. Before you port anything, examine which capabilities your stack uses and compare them to the built-in primitives:

| What You Need | XRP Ledger Native Capability |
| --- | --- |
| Conditional or time-locked release of funds | [Escrow](../../concepts/payment-types/escrow.md) |
| Shared/multi-party control of an account | [Multi-signing](../../concepts/accounts/multi-signing.md) |
| Currency or asset issuance and management | [Trust Line Tokens](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) / [Multi-Purpose Tokens (MPTs)](../../concepts/tokens/fungible-tokens/multi-purpose-tokens.md) |
| On-chain currency conversion | [DEX](../../concepts/tokens/decentralized-exchange/index.md) order book, [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md), and [pathfinding](../../concepts/tokens/fungible-tokens/paths.md) |
| Rate quoting and price discovery | [Pathfinding](../../concepts/tokens/fungible-tokens/paths.md) ([`ripple_path_find`][ripple_path_find method]) and order book queries ([`book_offers`][book_offers method]) |
| Market making and liquidity provision | [DEX offers](../../concepts/tokens/decentralized-exchange/offers.md) and [AMMs](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) |
| Compliance-gated trading | [Permissioned DEXes][] |

See [Transaction Types](../../references/protocol/transactions/types/index.md) for a comprehensive list of built-in transaction types. Some primitives depend on recently enabled [amendments](../../concepts/networks-and-servers/amendments.md), so be sure to check the [amendment status](/resources/known-amendments.md) on your target network before you design around it. For logic that doesn't map to a primitive, such as custom business rules, you still need off-ledger code.

## 2. Choose Your Infrastructure Path

Once you've mapped the capabilities to XRP Ledger primitives, you have to decide how to connect to the network. You can choose one of two paths, depending on your infrastructure experience and custody preferences (see the [payments overview](../payments/) for more).

- **Custodian integration:** Your provider's API handles keys, signing, submission, and node access in the background. Lowest security load and fastest integration, but provides least control over funds and features, vendor lock-in, and potential compliance implications.
- **Direct XRP Ledger integration:** You hold your own keys and use a [client library](../../references/client-libraries.md) to interact with the XRP Ledger. Choose one of the following methods:
  - **Managed node provider:** Fastest way to ship with low upfront costs. Someone else runs the nodes while you hold your keys and signing. Provides less control over [history retention](../../concepts/networks-and-servers/ledger-history.md), query privacy, and configuration, and you depend on their SLA.
  - **Self-hosted [`xrpld`](../../concepts/networks-and-servers/xrpld-server-modes.md) and [Clio](../../concepts/networks-and-servers/the-clio-server.md) servers:** Most control over ledger history, query privacy, and throughput, without third-party dependencies. Requires high operational overhead for hardware and maintaining synced servers. Suited to teams with higher volume or strict SLA needs. See [Install and Run](../../infrastructure/index.md).

### Pick a Client Library

After selecting your infrastructure, decide which [library](../../references/client-libraries.md) you'll use. The library builds, signs, and submits native transactions and reads the ledger state, so there is no smart-contract layer to call. If you use a custodian integration, the custodian's API is typically your client library, so you can skip ahead to [Step 4](#4-build-your-integration).

The best place to start is by matching the library to your backend's primary language. XRPLF maintains `xrpl.js` (JavaScript/TypeScript), `xrpl-py` (Python), and `xrpl4j` (Java). You can use `xrpl.js` if you currently build with `viem` or `ethers`, `xrpl-py` if you build with `web3.py`, or `xrpl4j` if you build with `web3j`.

Other libraries, such as `xrpl-go` (Go) and `XRPL_PHP` (PHP), vary in release cadence and amendment support. Check the repositories for recent releases and confirm they support the amendments and features your integration needs before committing to one.

If you don't find a library that matches your backend, you can connect to the XRP Ledger using the [HTTP / WebSocket APIs](../../references/http-websocket-apis/index.md).

<!--
TODO(simpleXRPL): Re-enable this section when simpleXRPL is publicly released.
If you are using a custodian, `simpleXRPL` is the most direct path. It's an opinionated JavaScript client library that enables you to write business operations rather than protocol mechanics.

It routes each operation through the API of the custodian you've configured, so it executes natively through their existing approval and policy flow.

`simpleXRPL` is currently JavaScript-only and complements the low-level SDKs rather than replacing them. For complete protocol access, use `xrpl.js` or `xrpl-py` directly.
-->

## 3. Set Up Your Accounts

With your chosen client library, you can create and fund the accounts your integration will use to submit transactions and hold balances. On the XRP Ledger, a few things about accounts work differently:
- An account doesn't exist until it's funded. You can generate a [key pair](../../concepts/accounts/cryptographic-keys.md) offline, but the address isn't active on the ledger until it receives the [base reserve](../../concepts/accounts/reserves.md).
- Its reserve has two parts: a fixed [base reserve](../../concepts/accounts/reserves.md) every account holds, plus an owner reserve that adds a set amount for each ledger entry it owns (for example, a trust line, offer, or escrow). You can't spend below the two combined, which doubles as one of the ledger's anti-spam mechanisms.
- Each account must opt in to a token before it can receive it, unlike many EVM chains where tokens can arrive unsolicited. If the issuer requires authorization, they must also approve the holder. Every opt-in creates a ledger entry that adds to the account's [owner reserve](../../concepts/accounts/reserves.md#owner-reserves). The way an account opts in depends on the token type:
  - **Trust Line Tokens**: The account creates a trust line to the issuer with a [TrustSet transaction](../../references/protocol/transactions/types/trustset.md).
  - **MPTs**: The account sends an [MPTokenAuthorize transaction](../../references/protocol/transactions/types/mptokenauthorize.md).
- Other chains frequently use one deposit address per customer, while the XRP Ledger uses [destination tags](../../concepts/transactions/source-and-destination-tags.md) to route an incoming payment to the correct customer in a single shared (omnibus) account. Since every address needs its own reserve, one account per customer ties up XRP for each customer (see [Receive and Credit](#receive-and-credit)).

{% admonition type="info" name="Note" %}
If you use a custodian integration, your custodian creates and manages these accounts and keys. The rest of this section only applies when you hold your own keys.
{% /admonition %}

### Fund Your Account

You can fund accounts on Testnet and Devnet using a [faucet](/resources/dev-tools/xrp-faucets). On [Mainnet](../../concepts/networks-and-servers/parallel-networks.md), you fund an account by sending it XRP from an exchange or an already-funded account. See [Accounts](../../concepts/accounts/index.md) for more on account creation and configuration.

On a test network, creating and funding an account is a single call (in Python, import `generate_faucet_wallet` from `xrpl.wallet`):

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/multisigning/js/set-up-multi-signing.js" language="js" before="// Generate key pairs" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/multisigning/py/set-up-multi-signing.py" language="py" from="client = JsonRpcClient" before="# Generate key pairs" /%}
{% /tab %}
{% /tabs %}

{% partial file="/docs/_snippets/testnet-seed-warning.md" /%}

### Plan Account Roles and Keys

You might separate roles across multiple accounts, using a treasury for reserves and balances, operating accounts for submission, and a [SignerList](../../concepts/accounts/multi-signing.md) where an account needs multi-party control. Because these accounts hold real funds and on-ledger actions are irreversible, protect their keys from the start:
- Generate each master key pair with [offline account setup](../../tutorials/best-practices/key-management/offline-account-setup.md).
- Operate through a [regular key](../../tutorials/best-practices/key-management/assign-a-regular-key-pair.md), and keep the offline master key as your recovery path.
- Optionally, [disable the master key](../../tutorials/best-practices/key-management/disable-master-key-pair.md) if you want transactions signed only by a regular key or multi-signing. Confirm that your regular key or signer list works first, because disabling the master key removes the default way to authorize transactions and your offline recovery path.

## 4. Build Your Integration

Now that your accounts are funded, you can port your business logic into built-in transaction types.

{% admonition type="info" name="Note" %}
If you use a custodian integration, your custodian's API replaces the client library calls in the code samples below, so you don't build, sign, or submit transactions yourself. The concepts still apply, so check your custodian's documentation for how it reports transaction results, partial payments, and incoming payments.
{% /admonition %}

Some common Web2 payments concepts work like this on the XRP Ledger:

| Web2 Concept | XRP Ledger Field |
| --- | --- |
| Nonce | [`Sequence`][Sequence Number] numbers order transactions serially per account. |
| Gas | [`Fee`][Transaction cost] is a low base cost that rises with network load. |
| Mempool | [`LastLedgerSequence`](../../concepts/transactions/reliable-transaction-submission.md) bounds how long a transaction stays pending. After that ledger, the transaction expires and can never be applied. |
| Retries | [`Sequence`][Sequence Number] makes a resubmitted transaction apply at most once. |

For more on how these fields work together, see [Reliable Transaction Submission](../../concepts/transactions/reliable-transaction-submission.md).

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

[Cross-currency payments](../../concepts/payment-types/cross-currency-payments.md) follow the same lifecycle as sending payments, with two differences:
- `Amount` names the currency and issuer the destination receives (this differs from what the source spends).
- `SendMax` caps the source spend.

{% admonition type="info" name="Note" %}
Cross-currency payments currently support only XRP and trust line tokens. MPTs require the [MPTokensV2 amendment](/resources/known-amendments.md#mptokensv2), which is still in development.
{% /admonition %}

Both the sending and receiving accounts need a [trust line](../../concepts/tokens/fungible-tokens/trust-line-tokens.md) to the issuer of any non-XRP currency they handle. Issuers can restrict who holds their currency with [authorized trust lines](../../concepts/tokens/fungible-tokens/authorized-trust-lines.md).

By default, a payment converts directly through the [DEX](../../concepts/tokens/decentralized-exchange/index.md) order book or [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) between the two currencies. For better routes, including ones [bridged through XRP](../../concepts/tokens/decentralized-exchange/autobridging.md), pass the result of [`ripple_path_find`][ripple_path_find method] in `Paths`. There's no external router to integrate.

On-chain conversion draws on both the order book and the [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md), and [pathfinding](../../concepts/tokens/fungible-tokens/paths.md) estimates the route rather than guaranteeing it. Bound each conversion: `SendMax` caps what the source spends, and a `DeliverMin` with the [`tfPartialPayment`](../../concepts/payment-types/partial-payments.md) flag floors what the destination receives.

The following example spends XRP and delivers USD to the destination, with `SendMax` and `DeliverMin` set:

{% tabs %}
{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/cross-currency-payment/js/sendCrossCurrency.js" language="js" from="Prepare cross-currency Payment" before="End cross-currency payment" /%}
{% /tab %}
{% tab label="Python" %}
{% code-snippet file="/_code-samples/cross-currency-payment/py/send_cross_currency.py" language="py" from="Prepare cross-currency Payment" before="End cross-currency payment" /%}
{% /tab %}
{% /tabs %}

A cross-currency payment can also name a [domain ID](../../concepts/tokens/decentralized-exchange/permissioned-dexes.md) to keep the conversion from trading against accounts you haven't approved, by consuming only offers from the matching permissioned DEX. An account can trade in a domain if it owns the domain or holds a [credential](../../tutorials/compliance-features/manage-credentials.md) that the domain accepts. A payment that names a domain ID can't use AMM liquidity, so it has less to draw on than an unrestricted conversion.

### Receive and Credit

Your stack also has to detect payments arriving in your accounts and credit the correct customer. Subscribe to your accounts with [transaction streams](../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#transaction-streams) to see payments as they validate. For production monitoring, see [Robustly Monitoring for Payments](../../concepts/payment-types/robustly-monitoring-for-payments.md).

{% admonition type="warning" name="Caution" %}
Avoid three common mistakes that can cause you to credit the wrong amount or the wrong customer:

- **Credit the amount that actually arrived.** A [partial payment](../../concepts/payment-types/partial-payments.md) can deliver less than the `Amount` field shows. Read the `delivered_amount` metadata field, not `Amount`, to avoid the [partial payments exploit](../../concepts/payment-types/partial-payments.md#partial-payments-exploit).
- **Attribute pooled funds with destination tags.** When many customers share one treasury or operating account, require [destination tags](../../concepts/transactions/source-and-destination-tags.md) with [`RequireDest`](../../tutorials/compliance-features/require-destination-tags.md) so each payment maps to the right customer.
- **Only credit successful transactions.** Validated ledgers include `tec` results, which are final and consume the `Fee` but deliver nothing. Credit a customer only when the result is `tesSUCCESS`.
{% /admonition %}

### Supply Liquidity

If you supply the liquidity that payments consume, you can publish and manage your own offers on the DEX (see [Trade in the Decentralized Exchange](../../tutorials/defi/dex/trade-in-the-decentralized-exchange.md)). Each offer you leave in the ledger counts toward your [owner reserve](../../concepts/accounts/reserves.md#owner-reserves). Issuers can also set a [tick size](../../concepts/tokens/decentralized-exchange/ticksize.md) that limits the precision of your offers' exchange rates.

You can also supply liquidity passively by depositing into an [AMM](../../concepts/tokens/decentralized-exchange/automated-market-makers.md) pool.

## 5. Test on Testnet or Devnet

Before going live, complete your end-to-end testing on a public test network:
- [Testnet](../../concepts/networks-and-servers/parallel-networks.md): Closely mirrors Mainnet's amendment status and behavior. Primary environment for pre-launch validation.
- [Devnet](../../concepts/networks-and-servers/parallel-networks.md): Runs beta releases, so use it only to test pre-release features or amendments that are not yet on Mainnet.

Neither test network uses real money, but both are usually centralized and come with no stability guarantees. Don't rely on persistence or treat them like stable environments.

Then, test how your integration handles XRP Ledger-specific cases that can cause failed, stuck, or misattributed payments, such as:
- Crediting `delivered_amount` on partial payments.
- Attributing pooled funds with destination tags.
- Enforcing reserve and trust line limits.
- Holding `SendMax`/`DeliverMin` under thin liquidity.
- Clearing submissions when the fee rises under load.

A validated ledger includes both successful transactions and `tec` failures. `tesSUCCESS` and `tec` [result codes][result code] are both final and consume the `Fee`, but only `tesSUCCESS` means the transaction succeeded.

If a transaction expires without validation, build a replacement with the same `Sequence` and a new `LastLedgerSequence`.

## 6. Pilot a Live Corridor and Launch

After testing on Testnet or Devnet, run a live pilot with real traffic through one narrow corridor (or a single partner), and verify results against your internal records before scaling.

To do so:

1. Switch your endpoint from a test network to Mainnet, and use funded accounts.
2. Send real transactions through the same lifecycle (see [Build Your Integration](#4-build-your-integration)) and verify each one reached a validated ledger.
3. Verify on-ledger results against your internal records. Reconcile with [`account_tx`][account_tx method], using `marker` to page through results. Make reconciliation idempotent so replaying a ledger range never double-counts. Subscribe to [transaction streams](../../references/http-websocket-apis/public-api-methods/subscription-methods/subscribe.md#transaction-streams) for real-time monitoring instead of polling (see [Robustly Monitoring for Payments](../../concepts/payment-types/robustly-monitoring-for-payments.md)).
4. Enforce any KYC or travel-rule obligations for the corridor. For example, use [credentials](../../tutorials/compliance-features/manage-credentials.md) to attest a holder's verified status on-ledger.
5. Widen scope once verified. If reconciliation fails, delay the cutover and keep your existing rail live as the fallback.

Once a transaction is in a validated ledger, it's immutable and can't be reversed, so there's no probabilistic-settlement tail to account for (see [Finality of Results](../../concepts/transactions/finality-of-results/index.md)).

Your custody model impacts the way you cut over:
- Custodial setups switch in a single window: snapshot your balances, fund the accounts on the XRP Ledger with the tokens you plan to hold (see [Stablecoins](../../concepts/tokens/fungible-tokens/stablecoins/index.md)), and flip the payment engine.
- Self-custodial flows rely on end users who move their own balances, so plan for a longer arc. Customer communication is usually the slowest piece.

Once your pilot cleanly reconciles, you have a repeatable path to map the stack, choose infrastructure, set up accounts, build, test, and pilot. Use the same path for each additional corridor.

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

import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from '@redocly/theme/components/Link/Link';
import { BenefitsSection } from 'shared/components/benefits-section';

export const frontmatter = {
  seo: {
    title: 'Agentic Transactions on the XRP Ledger — Autonomous Blockchain Payments & Financial Automation',
    description:
      'Learn how AI agents discover, set up, and execute agentic transactions on the XRP Ledger. Deterministic finality, predictable fees, and RLUSD stablecoin rails provide purpose-built infrastructure for autonomous financial automation — with a Claude Skills file, MCP server, and step-by-step starter kit.',
  },
};

// ── Why XRPL ──────────────────────────────────────────────────────────────────
const whyCards = [
  {
    id: 'finality',
    title: 'Deterministic Finality',
    description:
      'Every transaction either confirms with tesSUCCESS or expires cleanly — no hanging states, no retry loops. Agents know the outcome in 3–5 seconds and can move on.',
  },
  {
    id: 'costs',
    title: 'Predictable Transaction Costs',
    description:
      'Transaction costs are tiny and stable — fractions of a cent. Agents can plan and budget autonomously without worrying about gas spikes disrupting operations.',
  },
  {
    id: 'multicurrency',
    title: 'Native Multi-Currency & DEX',
    description:
      'Send XRP, RLUSD, or any issued token. The built-in DEX enables atomic cross-currency settlement without bridges or third-party swap contracts.',
  },
  {
    id: 'uptime',
    title: '14 Years of Uninterrupted Uptime',
    description:
      'The XRP Ledger has processed transactions continuously since 2012. Agents can rely on always-on infrastructure with no planned downtime.',
  },
  {
    id: 'no-smart-contracts',
    title: 'No Smart Contract Risk',
    description:
      'Core payment and escrow logic lives at the protocol layer — not in user-deployed contracts. There is no bytecode to audit, no upgrade risk, and no re-entrancy vulnerability.',
  },
  {
    id: 'compliance',
    title: 'Compliance-Friendly Controls',
    description:
      'DepositAuth, multi-sig, escrow with time locks, SourceTag for agent attribution, and the Memo field for audit trails are all built in — ready for institutional workflows.',
  },
];

// ── How It Works steps ────────────────────────────────────────────────────────
const howItWorksSteps = [
  {
    id: 'trigger',
    number: '01',
    title: 'Trigger',
    description:
      'An event arrives — an API call, a scheduled task, a webhook, or a threshold being crossed in a data feed.',
  },
  {
    id: 'decision',
    number: '02',
    title: 'Decision',
    description:
      'The agent evaluates the event against its instructions: amount, destination, currency, conditions, and any compliance rules.',
  },
  {
    id: 'transaction',
    number: '03',
    title: 'Transaction',
    description:
      'The agent signs and submits the transaction using xrpl-py (or another SDK). No intermediary, no approval queue.',
  },
  {
    id: 'validation',
    number: '04',
    title: 'Validation',
    description:
      'The XRP Ledger validates the transaction within 3–5 seconds and returns a deterministic result: tesSUCCESS or a clean expiry. No retry logic needed.',
  },
  {
    id: 'logging',
    number: '05',
    title: 'Logging',
    description:
      'The agent records the transaction hash, outcome, and any relevant metadata. SourceTag and Memo fields make every payment attributable and auditable.',
  },
];

// ── See it first — two example cards ─────────────────────────────────────────
const seeItFirstCards = [
  {
    id: 'xrp-payment',
    eyebrow: 'XRP · Simplest path',
    prompt: 'Send 10 XRP from the operations wallet to rDestinationAddress. Log the transaction hash.',
    response: `→ Payment confirmed.
Hash: A1B2C3D4E5F6...
Amount: 10 XRP
Status: tesSUCCESS`,
    note: 'Settles in 3–5 seconds. No gas estimation.',
  },
  {
    id: 'rlusd-payment',
    eyebrow: 'RLUSD · Dollar-denominated',
    prompt:
      'Pay 250 RLUSD from the operations wallet to rAcmeCorpWalletAddress. Log the transaction hash to the audit trail.',
    response: `→ Payment confirmed.
Hash: B2C3D4E5F6A1...
Amount: 250 RLUSD
Status: tesSUCCESS`,
    note: 'Same finality guarantee. RLUSD is a Ripple-issued USD stablecoin on the XRP Ledger.',
  },
];

// ── Requirements card-deck ────────────────────────────────────────────────────
const requirementCards = [
  {
    title: 'A Wallet',
    description:
      'An XRPL account with a funded balance. On Testnet, use the faucet. In production, generate a key pair and store it securely in a KMS or HSM.',
  },
  {
    title: 'Network Access',
    description:
      'A connection to an XRPL node via JSON-RPC or WebSocket. Public Testnet endpoints are available at altnet.rippletest.net.',
  },
  {
    title: 'A Transaction Library',
    description:
      'xrpl-py (Python) or xrpl.js (JavaScript/TypeScript) handle serialization, signing, and submission. No raw RPC calls required.',
  },
  {
    title: 'Machine-Readable Docs',
    description:
      'The XRPL Docs MCP Server exposes the full developer documentation as tool-callable context, so your LLM always has accurate, up-to-date reference material.',
    href: 'https://context7.com/websites/xrpl',
  },
  {
    title: 'LLM Tool Interface',
    description:
      'Optional but powerful: the XRPL Claude Skills file gives Claude pre-built tools for common operations — wallet creation, payments, escrow, and more.',
    href: '/resources/dev-tools/ai-tools',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function AgenticTransactions() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing page-agentic-transactions">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="container-new pb-26-until-sm mt-10 mb-10-sm text-center">
        <div className="col-lg-8 offset-lg-2">
          <div className="chip-green mb-8 d-inline-block">
            {translate('XRPL AI Starter Kit')}
          </div>
          <h1 className="mb-10">
            {translate('Agentic Transactions on the XRP Ledger')}
          </h1>
          <p className="mb-10 longform">
            {translate(
              'AI agents can discover, set up, and execute financial transactions autonomously. The XRP Ledger provides the infrastructure they need: deterministic finality, predictable costs, native multi-currency support, and compliance-ready controls — all without smart contract risk.'
            )}
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              className="btn btn-primary btn-arrow"
              to="/docs/tutorials/get-started-with-llms/"
            >
              {translate('Get Started')}
            </Link>
            <Link
              className="btn btn-outline-secondary"
              to="/resources/dev-tools/ai-tools"
            >
              {translate('View AI Tooling')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY XRPL FOR AI AGENTS ───────────────────────────────────────── */}
      <BenefitsSection
        eyebrow={translate('Purpose-Built for Autonomous Finance')}
        title={translate('Why AI Agents Choose the XRP Ledger')}
        cards={whyCards}
        showImages={false}
      />

      {/* ── HOW AGENTIC PAYMENTS WORK ────────────────────────────────────── */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h2 className="h3 h2-sm">
            {translate('How Agentic Payments Work')}
          </h2>
          <h6 className="eyebrow mb-3">
            {translate('The Agentic Payment Loop')}
          </h6>
        </div>
        <p className="col-sm-8 p-0 mb-10">
          {translate(
            'Every agent-initiated payment follows the same deterministic loop. The XRP Ledger guarantees a binary outcome every time — no polling, no retry logic, no stuck transactions.'
          )}
        </p>

        {/* Diagram: dark/light variants via <picture> */}
        <div className="mb-10">
          <picture>
            <source
              srcSet={require('./static/img/agentic-payment-loop-dark.svg')}
              media="(prefers-color-scheme: dark)"
            />
            <img
              src={require('./static/img/agentic-payment-loop-light.svg')}
              alt="The Agentic Payment Loop: five steps — Trigger, Decision, Transaction, XRP Ledger Validation (tesSUCCESS or clean expiry), and Logging."
              className="mw-100"
            />
          </picture>
        </div>

        {/* Step-by-step breakdown */}
        <div className="row row-cols-1 row-cols-md-5 card-deck mt-6">
          {howItWorksSteps.map((step) => (
            <div className="card" key={step.id}>
              <div className="card-body">
                <p className="eyebrow mb-2">{step.number}</p>
                <h4 className="card-title h5">{translate(step.title)}</h4>
                <p className="card-text">{translate(step.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEE IT FIRST ─────────────────────────────────────────────────── */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h2 className="h3 h2-sm">
            {translate('See It First')}
          </h2>
          <h6 className="eyebrow mb-3">
            {translate('Agent Prompts → On-Chain Results')}
          </h6>
        </div>
        <p className="col-sm-8 p-0 mb-10">
          {translate(
            'A capable agent with the XRPL skill installed can execute payments from a plain-language instruction. Here is what that looks like in practice.'
          )}
        </p>

        <div className="row row-cols-1 row-cols-lg-2 card-deck">
          {seeItFirstCards.map((card) => (
            <div className="card" key={card.id}>
              <div className="card-body">
                <p className="chip-green mb-6 d-inline-block small">
                  {translate(card.eyebrow)}
                </p>
                <h5 className="card-title h6 text-muted mb-4">
                  {translate('Prompt')}
                </h5>
                <p className="card-text font-italic mb-6">
                  "{translate(card.prompt)}"
                </p>
                <h5 className="card-title h6 text-muted mb-4">
                  {translate('Result')}
                </h5>
                <pre className="code-block p-4 br-8 mb-4">
                  <code>{card.response}</code>
                </pre>
                <p className="card-text small text-muted">
                  {translate(card.note)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── REQUIREMENTS ─────────────────────────────────────────────────── */}
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
          <h2 className="h3 h2-sm">
            {translate('What an Agent Needs')}
          </h2>
          <h6 className="eyebrow mb-3">
            {translate('Requirements')}
          </h6>
        </div>
        <p className="col-sm-8 p-0 mb-10">
          {translate(
            'An agent that can transact on the XRP Ledger needs five things. The first three are universal; the last two are specific to AI-native workflows and make the difference between an agent that works once and one that works reliably at scale.'
          )}
        </p>

        <div className="row row-cols-1 row-cols-lg-3 card-deck">
          {requirementCards.map((card, idx) => {
            const inner = (
              <div className="card-body">
                <h4 className="card-title h5">{translate(card.title)}</h4>
                <p className="card-text">{translate(card.description)}</p>
              </div>
            );
            return card.href ? (
              <Link className="card" to={card.href} key={card.title + idx}>
                {inner}
                <div className="card-footer">&nbsp;</div>
              </Link>
            ) : (
              <div className="card" key={card.title + idx}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="container-new py-26">
        <div className="col-lg-6 offset-lg-3 p-8-sm p-10-until-sm br-8 cta-card">
          <img
            src={require('./static/img/backgrounds/cta-home-purple.svg')}
            className="d-none-sm cta cta-top-left"
            alt=""
            aria-hidden="true"
          />
          <img
            src={require('./static/img/backgrounds/cta-home-green.svg')}
            className="cta cta-bottom-right"
            alt=""
            aria-hidden="true"
          />
          <div className="z-index-1 position-relative">
            <h2 className="h4 mb-8-sm mb-10-until-sm">
              {translate('Build your first agentic payment in minutes')}
            </h2>
            <p className="mb-10">
              {translate(
                'The XRPL AI Starter Kit includes a Claude Skills file, an MCP documentation server, and a step-by-step tutorial. Connect your agent to the XRP Ledger Testnet and send your first transaction today.'
              )}
            </p>
            <Link
              className="btn btn-primary btn-arrow"
              to="/docs/tutorials/get-started-with-llms/"
            >
              {translate('Start the Tutorial')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from '@redocly/theme/components/Link/Link';

export const frontmatter = {
  seo: {
    title: 'Agentic Transactions on the XRP Ledger — Autonomous Blockchain Payments & Financial Automation',
    description:
      'Learn how AI agents discover, set up, and execute agentic transactions on the XRP Ledger. Deterministic finality, predictable fees, and RLUSD stablecoin rails provide purpose-built infrastructure for autonomous financial automation — with a Claude Skills file, MCP server, and step-by-step starter kit.',
  },
};

// ── Why XRPL ──────────────────────────────────────────────────────────────────
// iconClass drives the tinted circle background (dark + light rules below).
// accentColor is the small dot overlaid on the icon circle.
const whyCards = [
  {
    id: 'finality',
    title: 'Deterministic Finality',
    description:
      'Every transaction either confirms with tesSUCCESS or expires cleanly — no hanging states, no retry loops. Agents know the outcome in 3–5 seconds and can move on.',
    image: require('../../static/img/icons/performance.svg'),
    imageLight: require('../../static/img/icons/lightmode/performance.svg'),
    iconClass: 'icon-circle-blue',
    accentColor: '#19A3FF',
  },
  {
    id: 'costs',
    title: 'Predictable Transaction Costs',
    description:
      'Transaction costs are tiny and stable — fractions of a cent. Agents can plan and budget autonomously without worrying about gas spikes disrupting operations.',
    image: require('../../static/img/icons/low-cost.svg'),
    imageLight: require('../../static/img/icons/lightmode/low-cost.svg'),
    iconClass: 'icon-circle-green',
    accentColor: '#32E685',
  },
  {
    id: 'multicurrency',
    title: 'Native Multi-Currency & DEX',
    description:
      'Send XRP, RLUSD, or any issued token. The built-in DEX enables atomic cross-currency settlement without bridges or third-party swap contracts.',
    image: require('../../static/img/icons/nft.svg'),
    imageLight: require('../../static/img/icons/lightmode/nft.svg'),
    iconClass: 'icon-circle-orange',
    accentColor: '#FF6719',
  },
  {
    id: 'uptime',
    title: 'Proven Reliability',
    description:
      'The XRP Ledger has been processing transactions since 2012. With over a decade of production history, it provides the battle-tested infrastructure agents need for high-stakes financial automation.',
    image: require('../../static/img/icons/reliability.svg'),
    imageLight: require('../../static/img/icons/lightmode/reliability.svg'),
    iconClass: 'icon-circle-purple',
    accentColor: '#9A52FF',
  },
  {
    id: 'no-smart-contracts',
    title: 'No Smart Contract Risk',
    description:
      'Core payment and escrow logic lives at the protocol layer — not in user-deployed contracts. There is no bytecode to audit, no upgrade risk, and no re-entrancy vulnerability.',
    image: require('../../static/img/icons/public.svg'),
    imageLight: require('../../static/img/icons/lightmode/public.svg'),
    iconClass: 'icon-circle-pink',
    accentColor: '#FF198B',
  },
  {
    id: 'compliance',
    title: 'Compliance-Friendly Controls',
    description:
      'DepositAuth, multi-sig, escrow with time locks, SourceTag for agent attribution, and the Memo field for audit trails are all built in — ready for institutional workflows.',
    image: require('../../static/img/icons/streamlined.svg'),
    imageLight: require('../../static/img/icons/lightmode/streamlined.svg'),
    iconClass: 'icon-circle-yellow',
    accentColor: '#FAFF19',
  },
];

// ── See it first — two example cards ─────────────────────────────────────────
const seeItFirstCards = [
  {
    id: 'xrp-payment',
    eyebrow: 'XRP · Simplest path',
    eyebrowClass: 'chip-green',
    prompt: 'Send 10 XRP from the operations wallet to rDestinationAddress. Log the transaction hash.',
    response: `→ Payment confirmed.\nHash: A1B2C3D4E5F6...\nAmount: 10 XRP\nStatus: tesSUCCESS`,
    note: 'Settles in 3–5 seconds. No gas estimation.',
  },
  {
    id: 'rlusd-payment',
    eyebrow: 'RLUSD · Dollar-denominated',
    eyebrowClass: 'chip-blue',
    prompt:
      'Pay 250 RLUSD from the operations wallet to rAcmeCorpWalletAddress. Log the transaction hash to the audit trail.',
    response: `→ Payment confirmed.\nHash: B2C3D4E5F6A1...\nAmount: 250 RLUSD\nStatus: tesSUCCESS`,
    note: 'Same finality guarantee. RLUSD is a Ripple-issued USD stablecoin on the XRP Ledger.',
  },
];

// ── Requirements card-deck ────────────────────────────────────────────────────
const requirementCards = [
  {
    number: '01',
    title: 'A Wallet',
    description:
      'An XRPL account with a funded balance. On Testnet, use the faucet. In production, generate a key pair and store it securely in a KMS or HSM.',
  },
  {
    number: '02',
    title: 'Network Access',
    description:
      'A connection to an XRPL node via JSON-RPC or WebSocket. Public Testnet endpoints are available at altnet.rippletest.net.',
  },
  {
    number: '03',
    title: 'A Transaction Library',
    description:
      'xrpl-py (Python) or xrpl.js (JavaScript/TypeScript) handle serialization, signing, and submission. No raw RPC calls required.',
  },
  {
    number: '04',
    title: 'Machine-Readable Docs',
    description:
      'The XRPL Docs MCP Server exposes the full developer documentation as tool-callable context, so your LLM always has accurate, up-to-date reference material.',
    href: 'https://context7.com/websites/xrpl',
  },
  {
    number: '05',
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

      {/* ── Per-page styles: icon circles + chip-blue (dark & light modes) ── */}
      <style>{`
        /* Icon circle base */
        .benefit-icon-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .benefit-icon-wrap img {
          width: 28px;
          height: 28px;
        }
        /* Accent dot */
        .benefit-icon-wrap::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          top: 0px;
          right: -1px;
        }

        /* Dark mode icon circle backgrounds */
        .icon-circle-blue   { background-color: #0D2040; }
        .icon-circle-blue::after   { background-color: #19A3FF; }
        .icon-circle-green  { background-color: #0D2A18; }
        .icon-circle-green::after  { background-color: #32E685; }
        .icon-circle-orange { background-color: #2A1400; }
        .icon-circle-orange::after { background-color: #FF6719; }
        .icon-circle-purple { background-color: #1E0A40; }
        .icon-circle-purple::after { background-color: #9A52FF; }
        .icon-circle-pink   { background-color: #2A0018; }
        .icon-circle-pink::after   { background-color: #FF198B; }
        .icon-circle-yellow { background-color: #262200; }
        .icon-circle-yellow::after { background-color: #FAFF19; }

        /* Light mode icon circle backgrounds */
        html.light .icon-circle-blue   { background-color: #EBF5FF; }
        html.light .icon-circle-green  { background-color: #EDFAF3; }
        html.light .icon-circle-orange { background-color: #FFF1E8; }
        html.light .icon-circle-purple { background-color: #F3EEFF; }
        html.light .icon-circle-pink   { background-color: #FFEBF4; }
        html.light .icon-circle-yellow { background-color: #FFFBE6; }

        /* chip-blue variant (mirrors chip-green structure) */
        .chip-blue {
          background-color: #0a1e40;
          color: #7cc8ff;
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        html.light .chip-blue {
          background-color: #d6eeff;
          color: #0055aa;
        }

        /* Requirement card: number badge */
        .req-number {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          color: #84f0b6;
        }
        html.light .req-number {
          color: #145c35;
        }

        /* Requirement card: linked variant gets a purple accent border */
        .card.req-linked {
          border-color: rgba(154, 82, 255, 0.5) !important;
        }
        html.light .card.req-linked {
          border-color: rgba(124, 31, 255, 0.4) !important;
        }

        /* Requirement card footer arrow for linked cards */
        .req-arrow {
          color: #9a52ff;
          font-size: 1rem;
          line-height: 1;
        }
        html.light .req-arrow {
          color: #7c1fff;
        }

        /* Agentic payment loop diagram — swap to dark SVG in dark mode */
        html:not(.light) .agentic-loop-diagram {
          content: url(${require('../../static/img/xrpl-agentic-payment-loop.svg')});
        }

        /* Benefit cards: 3-col grid */
        .benefit-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 991px) {
          .benefit-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 575px) {
          .benefit-card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="container-new pb-26-until-sm mt-10 mb-10-sm text-center">
        <div className="col-lg-8 offset-lg-2">
          <div className="chip-green mb-8 d-inline-block">
            {translate('XRPL AI Starter Kit')}
          </div>
          <h1 className="mb-10">
            {translate('Agentic Transactions')}
          </h1>
          <p className="mb-10 longform">
            {translate(
              'AI agents can discover, set up, and execute financial transactions autonomously. The XRP Ledger provides the infrastructure they need: deterministic finality, predictable costs, native multi-currency support, and compliance-ready controls — all without smart contract risk.'
            )}
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              className="btn btn-primary btn-arrow"
              to="/docs/agents/getting-started-with-agentic-transactions/"
            >
              {translate('Get Started')}
            </Link>
            <Link
              className="btn btn-outline-secondary"
              to="/docs/agents/agentic-payments-x402/"
            >
              {translate('Agentic Payments with x402')}
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
      <section className="container-new py-26">
        <div className="d-flex flex-column-reverse col-sm-8 p-0 mb-10">
          <h2 className="h3 h2-sm">
            {translate('What Makes XRPL Agent-Ready')}
          </h2>
          <h6 className="eyebrow mb-3">
            {translate('Purpose-Built for Autonomous Finance')}
          </h6>
        </div>

        <div className="benefit-card-grid">
          {whyCards.map((card) => (
            <div className="card" key={card.id}>
              <div className="card-body">
                {/* Icon circle with tinted background + accent dot */}
                <div className={`benefit-icon-wrap ${card.iconClass} mb-6`}>
                  <picture>
                    <source
                      srcSet={card.image}
                      media="(prefers-color-scheme: dark)"
                    />
                    <img src={card.imageLight} alt="" aria-hidden="true" />
                  </picture>
                </div>
                <h4 className="card-title h5">{translate(card.title)}</h4>
                <p className="card-text">{translate(card.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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

        <img
          src={require('../../static/img/xrpl-agentic-payment-loop-light.svg')}
          alt="The Agentic Payment Loop: five steps — Trigger, Decision, Transaction, XRP Ledger Validation (tesSUCCESS or clean expiry), and Logging."
          className="mw-100 agentic-loop-diagram"
        />
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
                {/* Eyebrow chip — green for XRP, blue for RLUSD */}
                <p className={`${card.eyebrowClass} mb-6`}>
                  {translate(card.eyebrow)}
                </p>
                <h5 className="card-title h6 text-muted mb-2">
                  {translate('Prompt')}
                </h5>
                <p className="card-text font-italic mb-6">
                  "{translate(card.prompt)}"
                </p>
                <h5 className="card-title h6 text-muted mb-2">
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
            const isLinked = !!card.href;
            const inner = (
              <div className="card-body">
                <p className="req-number">{card.number}</p>
                <h4 className="card-title h5">{translate(card.title)}</h4>
                <p className="card-text">{translate(card.description)}</p>
              </div>
            );
            return isLinked ? (
              <Link
                className="card req-linked"
                to={card.href}
                key={card.title + idx}
              >
                {inner}
                <div className="card-footer">
                  <span className="req-arrow">→</span>
                </div>
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
            src={require('../../static/img/backgrounds/cta-home-purple.svg')}
            className="d-none-sm cta cta-top-left"
            alt=""
            aria-hidden="true"
          />
          <img
            src={require('../../static/img/backgrounds/cta-home-green.svg')}
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
              to="/docs/agents/getting-started-with-agentic-transactions/"
            >
              {translate('Start the Tutorial')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
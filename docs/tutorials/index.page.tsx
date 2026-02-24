import { useThemeHooks } from "@redocly/theme/core/hooks"
import { Link } from "@redocly/theme/components/Link/Link"

export const frontmatter = {
  seo: {
    title: "Tutorials",
    description:
      "Learn how to get started building on the XRP Ledger with these helpful crypto wallet and blockchain tutorials for developers.",
  },
}

const langIcons: Record<string, { src: string; alt: string }> = {
  javascript: { src: "/img/logos/javascript.svg", alt: "JavaScript" },
  python: { src: "/img/logos/python.svg", alt: "Python" },
  java: { src: "/img/logos/java.svg", alt: "Java" },
  go: { src: "/img/logos/golang.svg", alt: "Go" },
  php: { src: "/img/logos/php.svg", alt: "PHP" },
  http: { src: "/img/logos/globe.svg", alt: "HTTP / WebSocket" },
  xrpl: { src: "/img/logos/xrp-mark.svg", alt: "XRP Ledger" },
}

// Type for the tutorial languages map from the plugin
type TutorialLanguagesMap = Record<string, string[]>

interface Tutorial {
  title: string
  body?: string
  path: string
  icon?: string // Single language icon (for single-language tutorials)
}

interface TutorialSection {
  id: string
  title: string
  description: string
  tutorials: Tutorial[]
}

// Get Started tutorials -----------------
const getStartedTutorials: Tutorial[] = [
  {
    title: "JavaScript",
    body: "Using the xrpl.js client library.",
    path: "/docs/tutorials/get-started/get-started-javascript/",
    icon: "javascript",
  },
  {
    title: "Python",
    body: "Using xrpl.py, a pure Python library.",
    path: "/docs/tutorials/get-started/get-started-python/",
    icon: "python",
  },
  {
    title: "Go",
    body: "Using xrpl-go, a pure Go library.",
    path: "/docs/tutorials/get-started/get-started-go/",
    icon: "go",
  },
  {
    title: "Java",
    body: "Using xrpl4j, a pure Java library.",
    path: "/docs/tutorials/get-started/get-started-java/",
    icon: "java",
  },
  {
    title: "PHP",
    body: "Using the XRPL_PHP client library.",
    path: "/docs/tutorials/get-started/get-started-php/",
    icon: "php",
  },
  {
    title: "HTTP & WebSocket APIs",
    body: "Access the XRP Ledger directly through the APIs of its core server.",
    path: "/docs/tutorials/get-started/get-started-http-websocket-apis/",
    icon: "http",
  },
]

// Other tutorial sections -----------------
// Languages are auto-detected from the markdown files by the tutorial-languages plugin.
// Only specify `icon` for single-language tutorials without tabs.
const sections: TutorialSection[] = [
  {
    id: "tokens",
    title: "Tokens",
    description: "Create and manage tokens on the XRP Ledger.",
    tutorials: [
      {
        title: "Issue a Multi-Purpose Token",
        body: "Issue new tokens using the v2 fungible token standard.",
        path: "/docs/tutorials/tokens/mpts/issue-a-multi-purpose-token/",
      },
      {
        title: "Issue a Fungible Token",
        body: "Issue new tokens using the v1 fungible token standard.",
        path: "/docs/tutorials/tokens/fungible-tokens/issue-a-fungible-token/",
      },
      {
        title: "Mint and Burn NFTs Using JavaScript",
        body: "Create new NFTs, retrieve existing tokens, and burn the ones you no longer need.",
        path: "/docs/tutorials/tokens/nfts/mint-and-burn-nfts-js/",
        icon: "javascript",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Transfer XRP and issued currencies using various payment types.",
    tutorials: [
      {
        title: "Send XRP",
        body: "Send a direct XRP payment to another account.",
        path: "/docs/tutorials/payments/send-xrp/",
      },
      {
        title: "Sending MPTs in JavaScript",
        body: "Send a Multi-Purpose Token (MPT) to another account with the JavaScript SDK.",
        path: "/docs/tutorials/tokens/mpts/sending-mpts-in-javascript/",
        icon: "javascript",
      },
      {
        title: "Create Trust Line and Send Currency in JavaScript",
        body: "Set up trust lines and send issued currencies with the JavaScript SDK.",
        path: "/docs/tutorials/payments/create-trust-line-send-currency-in-javascript/",
        icon: "javascript",
      },
      {
        title: "Create Trust Line and Send Currency in Python",
        body: "Set up trust lines and send issued currencies with the Python SDK.",
        path: "/docs/tutorials/payments/create-trust-line-send-currency-in-python/",
        icon: "python",
      },
      {
        title: "Send a Conditional Escrow",
        body: "Send an escrow that can be released when a specific crypto-condition is fulfilled.",
        path: "/docs/tutorials/payments/send-a-conditional-escrow/",
      },
      {
        title: "Send a Timed Escrow",
        body: "Send an escrow whose only condition for release is that a specific time has passed.",
        path: "/docs/tutorials/payments/send-a-timed-escrow/",
      },
    ],
  },
  {
    id: "defi",
    title: "DeFi",
    description: "Trade, provide liquidity, and lend using native XRP Ledger DeFi features.",
    tutorials: [
      {
        title: "Create an Automated Market Maker",
        body: "Set up an AMM for a token pair and provide liquidity.",
        path: "/docs/tutorials/defi/dex/create-an-automated-market-maker/",
      },
      {
        title: "Trade in the Decentralized Exchange",
        body: "Buy and sell tokens in the Decentralized Exchange (DEX).",
        path: "/docs/tutorials/defi/dex/trade-in-the-decentralized-exchange/",
      },
      {
        title: "Create a Loan Broker",
        body: "Set up a loan broker to create and manage loans.",
        path: "/docs/tutorials/defi/lending/use-the-lending-protocol/create-a-loan-broker/",
      },
      {
        title: "Create a Loan",
        body: "Create a loan on the XRP Ledger.",
        path: "/docs/tutorials/defi/lending/use-the-lending-protocol/create-a-loan/",
      },
      {
        title: "Create a Single Asset Vault",
        body: "Create a single asset vault on the XRP Ledger.",
        path: "/docs/tutorials/defi/lending/use-single-asset-vaults/create-a-single-asset-vault/",
      },
      {
        title: "Deposit into a Vault",
        body: "Deposit assets into a vault and receive shares.",
        path: "/docs/tutorials/defi/lending/use-single-asset-vaults/deposit-into-a-vault/",
      },
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Learn recommended patterns for building reliable, secure applications on the XRP Ledger.",
    tutorials: [
      {
        title: "API Usage",
        body: "Best practices for using XRP Ledger APIs.",
        path: "/docs/tutorials/best-practices/api-usage/",
      },
      {
        title: "Use Tickets",
        body: "Use tickets to send transactions out of the normal order.",
        path: "/docs/tutorials/best-practices/transaction-sending/use-tickets/",
      },
      {
        title: "Send a Single Account Batch Transaction",
        body: "Group multiple transactions together and execute them as a single atomic operation.",
        path: "/docs/tutorials/best-practices/transaction-sending/send-a-single-account-batch-transaction/",
      },
      {
        title: "Assign a Regular Key Pair",
        body: "Assign a regular key pair for signing transactions.",
        path: "/docs/tutorials/best-practices/key-management/assign-a-regular-key-pair/",
      },
      {
        title: "Set Up Multi-Signing",
        body: "Configure multi-signing for enhanced security.",
        path: "/docs/tutorials/best-practices/key-management/set-up-multi-signing/",
      },
      {
        title: "Send a Multi-Signed Transaction",
        body: "Send a transaction with multiple signatures.",
        path: "/docs/tutorials/best-practices/key-management/send-a-multi-signed-transaction/",
      },
    ],
  },
  {
    id: "sample-apps",
    title: "Sample Apps",
    description: "Build complete, end-to-end applications like wallets and credential services.",
    tutorials: [
      {
        title: "Build a Browser Wallet in JavaScript",
        body: "Build a browser wallet for the XRP Ledger using JavaScript and various libraries.",
        path: "/docs/tutorials/sample-apps/build-a-browser-wallet-in-javascript/",
        icon: "javascript",
      },
      {
        title: "Build a Desktop Wallet in JavaScript",
        body: "Build a desktop wallet for the XRP Ledger using JavaScript, the Electron Framework, and various libraries.",
        path: "/docs/tutorials/sample-apps/build-a-desktop-wallet-in-javascript/",
        icon: "javascript",
      },
      {
        title: "Build a Desktop Wallet in Python",
        body: "Build a desktop wallet for the XRP Ledger using Python and various libraries.",
        path: "/docs/tutorials/sample-apps/build-a-desktop-wallet-in-python/",
        icon: "python",
      },
      {
        title: "Credential Issuing Service in JavaScript",
        body: "Build a credential issuing service using the JavaScript SDK.",
        path: "/docs/tutorials/sample-apps/credential-issuing-service-in-javascript/",
        icon: "javascript",
      },
      {
        title: "Credential Issuing Service in Python",
        body: "Build a credential issuing service using the Python SDK.",
        path: "/docs/tutorials/sample-apps/credential-issuing-service-in-python/",
        icon: "python",
      },
    ],
  },
]

function TutorialCard({
  tutorial,
  detectedLanguages,
  showFooter = false,
  translate,
}: {
  tutorial: Tutorial
  detectedLanguages?: string[]
  showFooter?: boolean
  translate: (text: string) => string
}) {
  // Get icons: manual icon takes priority, then auto-detected languages, then XRPL fallback
  const icons = tutorial.icon && langIcons[tutorial.icon]
      ? [langIcons[tutorial.icon]]
      : detectedLanguages && detectedLanguages.length > 0
        ? detectedLanguages.map((lang) => langIcons[lang]).filter(Boolean)
        : [langIcons.xrpl]

  return (
    <Link to={tutorial.path} className="card">
      <div className="card-header d-flex align-items-center flex-wrap">
        {icons.map((icon, idx) => (
          <span className="circled-logo" key={idx}>
            <img src={icon.src} alt={icon.alt} />
          </span>
        ))}
      </div>
      <div className="card-body">
        <h4 className="card-title h5">{translate(tutorial.title)}</h4>
        {tutorial.body && <p className="card-text">{translate(tutorial.body)}</p>}
      </div>
      {showFooter && <div className="card-footer"></div>}
    </Link>
  )
}

export default function TutorialsIndex() {
  const { useTranslate, usePageSharedData } = useThemeHooks()
  const { translate } = useTranslate()

  // Get auto-detected languages from the plugin (maps tutorial paths to language arrays).
  const tutorialLanguages = usePageSharedData<TutorialLanguagesMap>("tutorial-languages") || {}

  return (
    <main className="landing page-tutorials landing-builtin-bg">
      <section className="container-new py-26">
        <div className="col-lg-8 mx-auto text-lg-center">
          <div className="d-flex flex-column-reverse">
            <h1 className="mb-0">
              {translate("Crypto Wallet and Blockchain Development Tutorials")}
            </h1>
            <h6 className="eyebrow mb-3">{translate("Tutorials")}</h6>
          </div>
          {/* Table of Contents */}
          <nav className="mt-4">
            <ul className="page-toc no-sideline d-flex flex-wrap justify-content-center gap-2 mb-0">
              <li><a href="#get-started">{translate("Get Started with SDKs")}</a></li>
              {sections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}>{translate(section.title)}</a></li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Get Started */}
      <section className="container-new pt-10 pb-20" id="get-started">
        <div className="col-12 col-xl-8 p-0">
          <h3 className="h4 mb-3">{translate("Get Started with SDKs")}</h3>
          <p className="mb-4">
            {translate("These tutorials walk you through the basics of building a very simple XRP Ledger-connected application using your favorite programming language.")}
          </p>
        </div>
        <div className="row tutorial-cards">
          {getStartedTutorials.map((tutorial, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 mb-5">
              <TutorialCard tutorial={tutorial} showFooter translate={translate} />
            </div>
          ))}
        </div>
      </section>

      {/* Other Tutorials */}
      {sections.map((section) => (
        <section className="container-new pt-10 pb-10" key={section.id} id={section.id}>
          <div className="col-12 col-xl-8 p-0">
            <h3 className="h4 mb-3">{translate(section.title)}</h3>
            <p className="mb-4">{translate(section.description)}</p>
          </div>
          <div className="row tutorial-cards">
            {section.tutorials.slice(0, 6).map((tutorial, idx) => (
              <div key={idx} className="col-lg-4 col-md-6 mb-5">
                <TutorialCard
                  tutorial={tutorial}
                  detectedLanguages={tutorialLanguages[tutorial.path]}
                  translate={translate}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}

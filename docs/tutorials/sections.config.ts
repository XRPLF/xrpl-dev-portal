// External community contribution - manually curated with author/repo/demo info
export interface PinnedExternalTutorial {
  title: string
  description: string
  author: { name: string; url: string }
  github: string
  url?: string
}

// Pinned tutorial entry:
// - string: internal path (uses frontmatter title/description)
// - object with `path`: internal path with optional description override
export type PinnedTutorial = string | { path: string; description?: string }

// ── Section configuration -----------------------------------------------------------
// Categories and their titles are auto-detected by the tutorial-metadata plugin.
// Use the config to customize the category titles, add descriptions, change the default category order, and pin tutorials.
export const sectionConfig: Record<string, {
  title?: string
  description?: string
  pinned?: PinnedTutorial[]
  community?: {
    description?: string
    items: PinnedExternalTutorial[]
  }
  showFooter?: boolean
}> = {
  "whats-new": {
    title: "What's New",
    description: "Recently added/updated tutorials to help you build on the XRP Ledger.",
  },
  "get-started": {
    showFooter: true,
    title: "Get Started with SDKs",
    description: "These tutorials walk you through the basics of building a very simple XRP Ledger-connected application using your favorite programming language.",
    pinned: [
      { path: "/docs/tutorials/get-started/get-started-javascript/", description: "Using the xrpl.js client library." },
      { path: "/docs/tutorials/get-started/get-started-python/", description: "Using xrpl.py, a pure Python library." },
      { path: "/docs/tutorials/get-started/get-started-go/", description: "Using xrpl-go, a pure Go library." },
      { path: "/docs/tutorials/get-started/get-started-java/", description: "Using xrpl4j, a pure Java library." },
      { path: "/docs/tutorials/get-started/get-started-php/", description: "Using the XRPL_PHP client library." },
      { path: "/docs/tutorials/get-started/get-started-http-websocket-apis/", description: "Access the XRP Ledger directly through the APIs of its core server." },
    ],
  },
  "tokens": {
    description: "Create and manage tokens on the XRP Ledger.",
    pinned: [
      { path: "/docs/tutorials/tokens/mpts/issue-a-multi-purpose-token/", description: "Issue new tokens using the v2 fungible token standard." },
      { path: "/docs/tutorials/tokens/fungible-tokens/issue-a-fungible-token/", description: "Issue new tokens using the v1 fungible token standard." },
      { path: "/docs/tutorials/tokens/nfts/mint-and-burn-nfts-js/", description: "Create new NFTs, retrieve existing tokens, and burn the ones you no longer need." },
    ],
  },
  "payments": {
    description: "Transfer XRP and issued currencies using various payment types.",
    pinned: [
      "/docs/tutorials/payments/send-xrp/",
      "/docs/tutorials/payments/send-an-mpt/",
      "/docs/tutorials/payments/create-trust-line-send-currency-in-javascript/",
      "/docs/tutorials/payments/send-a-conditional-escrow/",
      "/docs/tutorials/payments/send-a-timed-escrow/",
    ],
  },
  "defi": {
    description: "Trade, provide liquidity, and lend using native XRP Ledger DeFi features.",
    pinned: [
      "/docs/tutorials/defi/dex/create-an-automated-market-maker/",
      "/docs/tutorials/defi/dex/trade-in-the-decentralized-exchange/",
      "/docs/tutorials/defi/lending/use-the-lending-protocol/create-a-loan/",
      "/docs/tutorials/defi/lending/use-single-asset-vaults/create-a-single-asset-vault/",
    ],
  },
  "best-practices": {
    description: "Learn recommended patterns for building reliable, secure applications on the XRP Ledger.",
    pinned: [
      "/docs/tutorials/best-practices/api-usage/",
    ],
  },
  "compliance-features": {
    title: "Compliance",
    description: "Implement compliance controls like destination tags, credentials, and permissioned domains.",
  },
  "programmability": {
    description: "Set up cross-chain bridges and submit interoperability transactions.",
  },
  "advanced-developer-topics": {
    description: "Explore advanced topics like WebSocket monitoring and testing Devnet features.",
  },
  "sample-apps": {
    description: "Build complete, end-to-end applications like wallets and credential services.",
    community: {
      description: "Learn from community-built sample apps, intended for testing and educational purposes. These apps are not necessarily audited or maintained by xrpl.org.",
      items: [
        {
          title: "XRPL Lending Protocol Demo",
          description: "A full-stack web application that demonstrates the end-to-end flow of the Lending Protocol and Single Asset Vaults.",
          author: { name: "Aaditya-T", url: "https://github.com/Aaditya-T" },
          github: "https://github.com/Aaditya-T/lending_test",
          url: "https://lending-test-lovat.vercel.app/",
        },
        {
          title: "Lending Protocol & SAV Reference App",
          description: "A Next.js lending platform template with dashboards for brokers, depositors, and borrowers.",
          author: { name: "Max", url: "https://github.com/krkmu" },
          github: "https://github.com/RippleDevRel/xls-lending-sav-DAP",
          url: "https://lending.xls-demo.com/",
        }
      ],
    },
  },
}

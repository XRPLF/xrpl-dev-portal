---
seo:
    description: Learn how to get started building on the XRP Ledger with these helpful crypto wallet and blockchain tutorials for developers.
---
# Crypto Wallet and Blockchain Development Tutorials

The XRP Ledger tutorials walk you through the steps to learn and get started with the XRP Ledger and to use the ledger for advanced use cases.

{% tutorial-category title="Get Started" description="These tutorials walk you through the basics of building a very simple XRP Ledger-connected application using your favorite programming language." tutorials=[
  { "title": "JavaScript", "body": "Using the xrpl.js client library.", "path": "get-started/get-started-javascript" },
  { "title": "Python", "body": "Using xrpl.py, a pure Python library.", "path": "get-started/get-started-python" },
  { "title": "Java", "body": "Using xrpl4j, a pure Java library.", "path": "get-started/get-started-java" },
  { "title": "Go", "body": "Using xrpl-go, a pure Go library.", "path": "get-started/get-started-go" },
  { "title": "PHP", "body": "Using the XRPL_PHP client library.", "path": "get-started/get-started-php" },
  { "title": "HTTP / WebSocket APIs", "body": "Using HTTP or WebSocket APIs directly.", "path": "get-started/get-started-http-websocket-apis" }
] /%}

---

{% tutorial-category title="Tokens" description="Create and manage tokens on the XRP Ledger." tutorials=[
  { "title": "Issue a Multi-Purpose Token", "body": "Issue tokens using the v2 fungible token standard, Multi-Purpose Tokens (MPTs).", "path": "tokens/mpts/issue-a-multi-purpose-token", "languages": ["javascript", "python"] },
  { "title": "Issue a Fungible Token", "body": "Issue tokens using the v1 fungible token standard, trust lines.", "path": "tokens/fungible-tokens/issue-a-fungible-token", "languages": ["javascript", "python", "java"] },
  { "title": "Mint and Burn NFTs", "body": "Mint new Non-fungible Tokens (NFTs).", "links": [{ "language": "javascript", "path": "tokens/nfts/mint-and-burn-nfts-js" }, { "language": "python", "path": "tokens/nfts/mint-and-burn-nfts-py" }]}
]
/%}

{% tutorial-category title="Payments" description="Send XRP and issued currencies using various payment methods." tutorials=[
  { "title": "Send XRP", "body": "Send a direct XRP payment to an account on the XRP Ledger.", "path": "payments/send-xrp", "languages": ["javascript", "python", "java", "go", "php"] },
  { "title": "Create Trust Line", "body": "Set up trust lines and send issued currencies.", "links": [{ "language": "javascript", "path": "payments/create-trust-line-send-currency-in-javascript" }, { "language": "python", "path": "payments/create-trust-line-send-currency-in-python" }] },
  { "title": "Send a Conditional Escrow", "body": "Create escrows that release based on conditions.", "path": "payments/send-a-conditional-escrow", "languages": ["javascript", "python"] },
  { "title": "Send a Timed Escrow", "body": "Create time-based escrows.", "path": "payments/send-a-timed-escrow", "languages": ["javascript", "python"] },
  { "title": "Look up Escrows", "body": "Find and view existing escrows.", "path": "payments/look-up-escrows", "languages": ["javascript", "python"] }
] /%}

{% tutorial-category title="DeFi" description="Build decentralized finance applications using the DEX, AMMs, and lending protocols." tutorials=[
  { "title": "Create an AMM", "body": "Provide liquidity with an Automated Market Maker.", "path": "defi/dex/create-an-automated-market-maker" },
  { "title": "Trade in the DEX", "body": "Make trades in the decentralized exchange.", "path": "defi/dex/trade-in-the-decentralized-exchange", "languages": ["javascript", "python"] },
  { "title": "Create a Loan", "body": "Set up a loan.", "path": "defi/lending/use-the-lending-protocol/create-a-loan" },
  { "title": "Manage a Loan", "body": "Manage a loan on the XRPL.", "path": "defi/lending/use-the-lending-protocol/manage-a-loan" },
  { "title": "Create a Single Asset Vault", "body": "Create a vault for single asset lending.", "path": "defi/lending/use-single-asset-vaults/create-a-single-asset-vault" },
  { "title": "Deposit into a Vault", "body": "Add assets to an existing vault.", "path": "defi/lending/use-single-asset-vaults/deposit-into-a-vault" }
] /%}

{% tutorial-category title="Best Practices" description="Learn recommended patterns for key management, transaction handling, and account security." tutorials=[
  { "title": "Use Tickets", "body": "Submit transactions out of sequence.", "path": "best-practices/transaction-sending/use-tickets" },
  { "title": "Send a Batch Transaction", "body": "Execute multiple operations atomically.", "path": "best-practices/transaction-sending/send-a-single-account-batch-transaction" },
  { "title": "Assign a Regular Key Pair", "body": "Add a secondary signing key to your account.", "path": "best-practices/key-management/assign-a-regular-key-pair", "languages": ["javascript", "python"] },
  { "title": "Set Up Multi-Signing", "body": "Require multiple signatures for transactions.", "path": "best-practices/key-management/set-up-multi-signing", "languages": ["javascript", "python"] },
  { "title": "Send a Multi-Signed Transaction", "body": "Submit a transaction with multiple signatures.", "path": "best-practices/key-management/send-a-multi-signed-transaction", "languages": ["javascript", "python"] }
] /%}

{% tutorial-category title="Sample Apps" description="Build complete applications like wallets and credential services using the XRP Ledger." tutorials=[
  { "title": "Browser Wallet", "body": "Build a graphical browser wallet for the XRPL.", "path": "sample-apps/build-a-browser-wallet-in-javascript" },
  { "title": "Desktop Wallet", "body": "Create a desktop wallet application.", "links": [{ "language": "javascript", "path": "sample-apps/build-a-desktop-wallet-in-javascript" }, { "language": "python", "path": "sample-apps/build-a-desktop-wallet-in-python" }] },
  { "title": "Credential Issuing Service", "body": "Build a credential issuing service.", "links": [{ "language": "javascript", "path": "sample-apps/credential-issuing-service-in-javascript" }, { "language": "python", "path": "sample-apps/credential-issuing-service-in-python" }] }
] /%}

import type { NavItem, SubmenuItemBase, SubmenuItemWithChildren, SubmenuItem, NetworkSubmenuSection } from '../types';

// Alert Banner Configuration
export const alertBanner = {
  show: false,
  message: "APEX 2025",
  button: "REGISTER",
  link: "https://www.xrpledgerapex.com/?utm_source=xrplwebsite&utm_medium=direct&utm_campaign=xrpl-event-ho-xrplapex-glb-2025-q1_xrplwebsite_ari_arp_bf_rsvp&utm_content=cta_btn_english_pencilbanner"
};

// Main navigation items
export const navItems: NavItem[] = [
  { label: "Develop", labelTranslationKey: "navbar.develop", href: "/develop", hasSubmenu: true },
  { label: "Use Cases", labelTranslationKey: "navbar.usecases", href: "/docs/use-cases", hasSubmenu: true },
  { label: "Community", labelTranslationKey: "navbar.community", href: "/community", hasSubmenu: true },
  { label: "Network", labelTranslationKey: "navbar.network", href: "/resources", hasSubmenu: true },
];

// Develop submenu data structure
export const developSubmenuData: {
  left: SubmenuItemBase[];
  right: SubmenuItemWithChildren[];
} = {
  left: [
    { label: "Developer's Home", labelTranslationKey: "navbar.develop.home", href: "/develop", icon: "dev_home" },
    { label: "Learn", labelTranslationKey: "navbar.develop.learn", href: "https://learn.xrpl.org", icon: "learn" },
    { label: "Code Samples", labelTranslationKey: "navbar.develop.code-samples", href: "/resources/code-samples", icon: "code_samples" },
  ],
  right: [
    {
      label: "Docs",
      labelTranslationKey: "navbar.develop.docs",
      href: "/docs",
      icon: "docs",
      children: [
        { label: "API Reference", labelTranslationKey: "navbar.develop.docs.api-reference", href: "/docs/references" },
        { label: "Tutorials", labelTranslationKey: "navbar.develop.docs.tutorials", href: "/docs/tutorials" },
        { label: "Concepts", labelTranslationKey: "navbar.develop.docs.concepts", href: "/docs/concepts" },
        { label: "Infrastructure", labelTranslationKey: "navbar.develop.docs.infrastructure", href: "/docs/infrastructure" },
      ],
    },
    {
      label: "Client Libraries",
      labelTranslationKey: "navbar.develop.client-libraries",
      href: "/docs/tutorials",
      icon: "client_lib",
      children: [
        { label: "JavaScript", labelTranslationKey: "navbar.develop.client-libraries.javascript", href: "/docs/tutorials/get-started/get-started-javascript" },
        { label: "Python", labelTranslationKey: "navbar.develop.client-libraries.python", href: "/docs/tutorials/get-started/get-started-python" },
        { label: "PHP", labelTranslationKey: "navbar.develop.client-libraries.php", href: "/docs/tutorials/get-started/get-started-php" },
        { label: "Go", labelTranslationKey: "navbar.develop.client-libraries.go", href: "/docs/tutorials/get-started/get-started-go" },
      ],
    },
  ],
};

// Use Cases submenu data structure
export const useCasesSubmenuData: {
  left: SubmenuItemWithChildren[];
  right: SubmenuItemWithChildren[];
} = {
  left: [
    {
      label: "Payments",
      labelTranslationKey: "navbar.usecases.payments",
      href: "/docs/use-cases/payments",
      icon: "payments",
      children: [
        { label: "Direct XRP Payments", labelTranslationKey: "navbar.usecases.payments.direct-xrp-payments", href: "/docs/concepts/payment-types/direct-xrp-payments" },
        { label: "Cross-currency Payments", labelTranslationKey: "navbar.usecases.payments.cross-currency-payments", href: "/docs/concepts/payment-types/cross-currency-payments" },
        { label: "Escrow", labelTranslationKey: "navbar.usecases.payments.escrow", href: "/docs/concepts/payment-types/escrow" },
        { label: "Checks", labelTranslationKey: "navbar.usecases.payments.checks", href: "/docs/concepts/payment-types/checks" },
      ],
    },
    {
      label: "Tokenization",
      labelTranslationKey: "navbar.usecases.tokenization",
      href: "/docs/use-cases/tokenization",
      icon: "tokenization",
      children: [
        { label: "Stablecoin", labelTranslationKey: "navbar.usecases.tokenization.stablecoin", href: "/docs/use-cases/tokenization/stablecoin-issuer" },
        { label: "NFT", labelTranslationKey: "navbar.usecases.tokenization.nft", href: "/docs/use-cases/tokenization/nft-mkt-overview" },
      ],
    },
  ],
  right: [
    {
      label: "Credit",
      labelTranslationKey: "navbar.usecases.credit",
      href: "/docs/use-cases/credit",
      icon: "credit",
      children: [
        { label: "Lending", labelTranslationKey: "navbar.usecases.credit.lending", href: "/docs/use-cases/credit/lending" },
        { label: "Collateralization", labelTranslationKey: "navbar.usecases.credit.collateralization", href: "/docs/use-cases/credit/collateralization" },
        { label: "Sustainability", labelTranslationKey: "navbar.usecases.credit.sustainability", href: "/docs/use-cases/credit/sustainability" },
      ],
    },
    {
      label: "Trading",
      labelTranslationKey: "navbar.usecases.trading",
      href: "/docs/use-cases/trading",
      icon: "trading",
      children: [
        { label: "DEX", labelTranslationKey: "navbar.usecases.trading.dex", href: "/docs/concepts/tokens/decentralized-exchange" },
        { label: "Permissioned Trading", labelTranslationKey: "navbar.usecases.trading.permissioned-trading", href: "/docs/concepts/tokens/decentralized-exchange/permissioned-dexes" },
        { label: "AMM", labelTranslationKey: "navbar.usecases.trading.amm", href: "/docs/concepts/tokens/decentralized-exchange" },
      ],
    },
  ],
};

// Community submenu data structure
export const communitySubmenuData: {
  left: SubmenuItem[];
  right: SubmenuItem[];
} = {
  left: [
    {
      label: "Community",
      labelTranslationKey: "navbar.community.community",
      href: "/community",
      icon: "community",
      children: [
        { label: "Events", labelTranslationKey: "navbar.community.events", href: "/community/events" },
        { label: "Blog", labelTranslationKey: "navbar.community.blog", href: "/blog" },
      ],
    },
    { label: "Funding", labelTranslationKey: "navbar.community.funding", href: "/community/developer-funding", icon: "funding" },
  ],
  right: [
    {
      label: "Contribute",
      labelTranslationKey: "navbar.community.contribute",
      href: "/resources/contribute-code",
      icon: "contribute",
      children: [
        { label: "Bug Bounty", labelTranslationKey: "navbar.community.contribute.bug-bounty", href: "/blog/2020/rippled-1.5.0#bug-bounties-and-responsible-disclosures" },
        { label: "Research", labelTranslationKey: "navbar.community.contribute.research", href: "https://xls.xrpl.org/" },
      ],
    },
    { label: "Ecosystem Map", labelTranslationKey: "navbar.community.ecosystem-map", href: "/about/uses", icon: "ecosystem" },
  ],
};

// Network submenu data
export const networkSubmenuData: NetworkSubmenuSection[] = [
  {
    label: "Resources",
    labelTranslationKey: "navbar.network.resources",
    href: "/resources",
    icon: "resources",
    children: [
      { label: "About", labelTranslationKey: "navbar.network.resources.about", href: "/about/history" },
      { label: "XRPL Brand Kit", labelTranslationKey: "navbar.network.resources.brand-kit", href: "/XRPL_Brand_Kit.zip" },
    ],
    patternColor: 'lilac',
  },
  {
    label: "Insights",
    labelTranslationKey: "navbar.network.insights",
    href: "https://livenet.xrpl.org",
    icon: "insights",
    children: [
      { label: "Explorer", labelTranslationKey: "navbar.network.insights.explorer", href: "https://livenet.xrpl.org" },
      { label: "Amendment Voting Status", labelTranslationKey: "navbar.network.insights.amendment-voting-status", href: "https://xrpl.org/resources/known-amendments" },
    ],
    patternColor: 'green',
  },
];


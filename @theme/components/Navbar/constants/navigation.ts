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
  { label: "Develop", labelTranslationKey: "navbar.develop", href: "/docs", hasSubmenu: true },
  { label: "Use Cases", labelTranslationKey: "navbar.usecases", href: "/about/uses", hasSubmenu: true },
  { label: "Community", labelTranslationKey: "navbar.community", href: "/community", hasSubmenu: true },
  { label: "Network", labelTranslationKey: "navbar.network", href: "/docs/concepts/networks-and-servers", hasSubmenu: true },
];

// Develop submenu data structure
export const developSubmenuData: {
  left: SubmenuItemBase[];
  right: SubmenuItemWithChildren[];
} = {
  left: [
    { label: "Developer's Home", href: "/docs", icon: "dev_home" },
    { label: "Learn", href: "/docs/tutorials", icon: "learn" },
    { label: "Code Samples", href: "/_code-samples", icon: "code_samples" },
  ],
  right: [
    {
      label: "Docs",
      href: "/docs",
      icon: "docs",
      children: [
        { label: "API Reference", href: "/docs/references" },
        { label: "Tutorials", href: "/docs/tutorials" },
        { label: "Concepts", href: "/docs/concepts" },
        { label: "Infrastructure", href: "/docs/infrastructure" },
      ],
    },
    {
      label: "Client Libraries",
      href: "/docs/references/client-libraries",
      icon: "client_lib",
      children: [
        { label: "JavaScript", href: "/docs/references/xrpljs" },
        { label: "Python", href: "/docs/references/xrpl-py" },
        { label: "PHP", href: "/docs/references/xrpl-php" },
        { label: "Go", href: "/docs/references/xrpl-go" },
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
      href: "/about/uses/payments",
      icon: "payments",
      children: [
        { label: "Direct XRP Payments", href: "/about/uses/direct-xrp-payments" },
        { label: "Cross-currency Payments", href: "/about/uses/cross-currency-payments" },
        { label: "Escrow", href: "/about/uses/escrow" },
        { label: "Checks", href: "/about/uses/checks" },
      ],
    },
    {
      label: "Tokenization",
      href: "/about/uses/tokenization",
      icon: "tokenization",
      children: [
        { label: "Stablecoin", href: "/about/uses/stablecoin" },
        { label: "NFT", href: "/about/uses/nft" },
      ],
    },
  ],
  right: [
    {
      label: "Credit",
      href: "/about/uses/credit",
      icon: "credit",
      children: [
        { label: "Lending", href: "/about/uses/lending" },
        { label: "Collateralization", href: "/about/uses/collateralization" },
        { label: "Sustainability", href: "/about/uses/sustainability" },
      ],
    },
    {
      label: "Trading",
      href: "/about/uses/trading",
      icon: "trading",
      children: [
        { label: "DEX", href: "/about/uses/dex" },
        { label: "Permissioned Trading", href: "/about/uses/permissioned-trading" },
        { label: "AMM", href: "/about/uses/amm" },
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
      href: "/community",
      icon: "community",
      children: [
        { label: "Events", href: "/community/events" },
        { label: "News", href: "/blog", active: true },
        { label: "Blog", href: "/blog" },
        { label: "Marketplace", href: "/community/marketplace" },
        { label: "Partner Connect", href: "/community/partner-connect" },
      ],
    },
    { label: "Funding", href: "/community/developer-funding", icon: "code_samples" },
  ],
  right: [
    {
      label: "Contribute",
      href: "/resources/contribute-documentation",
      icon: "client_lib",
      children: [
        { label: "Ecosystem Map", href: "/community/ecosystem-map" },
        { label: "Bug Bounty", href: "/community/bug-bounty" },
        { label: "Research", href: "/community/research" },
      ],
    },
    { label: "Creators", href: "/community/ambassadors", icon: "learn" },
  ],
};

// Network submenu data
export const networkSubmenuData: NetworkSubmenuSection[] = [
  {
    label: "Resources",
    href: "/docs/concepts/networks-and-servers",
    icon: "resources",
    children: [
      { label: "Validators", href: "/docs/concepts/networks-and-servers/validators" },
      { label: "Governance", href: "/docs/concepts/networks-and-servers/governance", active: true },
      { label: "XRPL Roadmap", href: "/docs/concepts/networks-and-servers/xrpl-roadmap" },
    ],
    patternColor: 'lilac',
  },
  {
    label: "Insights",
    href: "/docs/concepts/networks-and-servers/insights",
    icon: "insights",
    children: [
      { label: "Explorer", href: "https://livenet.xrpl.org" },
      { label: "Data Dashboard", href: "/docs/concepts/networks-and-servers/data-dashboard" },
      { label: "Amendment Voting Status", href: "/docs/concepts/networks-and-servers/amendments" },
    ],
    patternColor: 'green',
  },
];


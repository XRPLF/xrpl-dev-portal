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
  { label: "Use Cases", labelTranslationKey: "navbar.usecases", href: "/use-cases", hasSubmenu: true },
  { label: "Community", labelTranslationKey: "navbar.community", href: "/community", hasSubmenu: true },
  { label: "Network", labelTranslationKey: "navbar.network", href: "/resources", hasSubmenu: true },
];

// Develop submenu data structure
export const developSubmenuData: {
  left: SubmenuItemBase[];
  right: SubmenuItemWithChildren[];
} = {
  left: [
    { label: "Developer's Home", href: "/develop", icon: "dev_home" },
    { label: "Learn", href: "https://learn.xrpl.org", icon: "learn" },
    { label: "Code Samples", href: "/resources/code-samples", icon: "code_samples" },
  ],
  right: [
    {
      label: "Docs",
      href: "/docs",
      icon: "docs",
      children: [
        { label: "API Reference", href: "/references" },
        { label: "Tutorials", href: "/docs/tutorials" },
        { label: "Concepts", href: "/concepts" },
        { label: "Infrastructure", href: "/docs/infrastructure" },
      ],
    },
    {
      label: "Client Libraries",
      href: "#",
      icon: "client_lib",
      children: [
        { label: "JavaScript", href: "#" },
        { label: "Python", href: "#" },
        { label: "PHP", href: "#" },
        { label: "Go", href: "#" },
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
      href: "/use-cases/payments",
      icon: "payments",
      children: [
        { label: "Direct XRP Payments", href: "/use-cases/payments/direct-xrp-payments" },
        { label: "Cross-currency Payments", href: "/use-cases/payments/cross-currency-payments" },
        { label: "Escrow", href: "/use-cases/payments/escrow" },
        { label: "Checks", href: "/use-cases/payments/checks" },
      ],
    },
    {
      label: "Tokenization",
      href: "/use-cases/tokenization",
      icon: "tokenization",
      children: [
        { label: "Stablecoin", href: "/use-cases/tokenization/stablecoin" },
        { label: "NFT", href: "/use-cases/tokenization/nft" },
      ],
    },
  ],
  right: [
    {
      label: "Credit",
      href: "/use-cases/credit",
      icon: "credit",
      children: [
        { label: "Lending", href: "/use-cases/credit/lending" },
        { label: "Collateralization", href: "/use-cases/credit/collateralization" },
        { label: "Sustainability", href: "/use-cases/credit/sustainability" },
      ],
    },
    {
      label: "Trading",
      href: "/use-cases/trading",
      icon: "trading",
      children: [
        { label: "DEX", href: "/use-cases/trading/dex" },
        { label: "Permissioned Trading", href: "/use-cases/trading/permissioned-trading" },
        { label: "AMM", href: "/use-cases/trading/amm" },
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
        { label: "Blog", href: "/blog" },
      ],
    },
    { label: "Funding", href: "/community/developer-funding", icon: "code_samples" },
  ],
  right: [
    {
      label: "Contribute",
      href: "/community/contribute",
      icon: "client_lib",
      children: [
        { label: "Bug Bounty", href: "/blog/2020/rippled-1.5.0#bug-bounties-and-responsible-disclosures" },
        { label: "Research", href: "https://xls.xrpl.org/" },
      ],
    },
    { label: "Ecosystem Map", href: "/about/uses", icon: "learn" },
  ],
};

// Network submenu data
export const networkSubmenuData: NetworkSubmenuSection[] = [
  {
    label: "Resources",
    href: "/resources",
    icon: "resources",
    children: [
      { label: "About", href: "/about/history" },
      { label: "XRPL Brand Kit", href: "/community/brand-kit" },
    ],
    patternColor: 'lilac',
  },
  {
    label: "Insights",
    href: "/insights",
    icon: "insights",
    children: [
      { label: "Explorer", href: "https://livenet.xrpl.org" },
      { label: "Amendment Voting Status", href: "https://xrpl.org/resources/known-amendments" },
    ],
    patternColor: 'green',
  },
];


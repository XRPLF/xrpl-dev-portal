// Navbar icon imports

// Main navbar icons
export { default as xrpSymbolBlack } from "../../../../static/img/navbar/xrp-symbol-black.svg";
export { default as xrpLogotypeBlack } from "../../../../static/img/navbar/xrp-logotype-black.svg";
export { default as xrpLedgerNav } from "../../../../static/img/navbar/xrp-ledger-nav.svg";
export { default as searchIcon } from "../../../../static/img/navbar/search-icon.svg";
export { default as modeToggleIcon } from "../../../../static/img/navbar/mode-toggle.svg";
export { default as globeIcon } from "../../../../static/img/navbar/globe-icon.svg";
export { default as chevronDown } from "../../../../static/img/navbar/chevron-down.svg";
export { default as hamburgerIcon } from "../../../../static/img/navbar/hamburger-icon.svg";
export { default as arrowUpRight } from "../../../../static/img/icons/arrow-up-right-custom.svg";

// Wallet icons for submenu
export { default as greenWallet } from "../../../../static/img/navbar/green-wallet.svg";
export { default as lilacWallet } from "../../../../static/img/navbar/lilac-wallet.svg";
export { default as yellowWallet } from "../../../../static/img/navbar/yellow-wallet.svg";
export { default as pinkWallet } from "../../../../static/img/navbar/pink-wallet.svg";
export { default as blueWallet } from "../../../../static/img/navbar/blue-wallet.svg";

// Develop submenu icons
export { default as devHomeIcon } from "../../../../static/img/navbar/dev_home.svg";
export { default as learnIcon } from "../../../../static/img/navbar/learn.svg";
export { default as codeSamplesIcon } from "../../../../static/img/navbar/code_samples.svg";
export { default as docsIcon } from "../../../../static/img/navbar/docs.svg";
export { default as clientLibIcon } from "../../../../static/img/navbar/client_lib.svg";

// Use Cases submenu icons
export { default as paymentsIcon } from "../../../../static/img/navbar/payments.svg";
export { default as tokenizationIcon } from "../../../../static/img/navbar/tokenization.svg";
export { default as creditIcon } from "../../../../static/img/navbar/credit.svg";
export { default as tradingIcon } from "../../../../static/img/navbar/trading.svg";

// Community submenu icons
export { default as communityIcon } from "../../../../static/img/navbar/community.svg";

// Network submenu icons
export { default as insightsIcon } from "../../../../static/img/navbar/insights.svg";
export { default as resourcesIcon } from "../../../../static/img/navbar/resources.svg";

// Network submenu pattern images (used for both light and dark mode)
export { default as resourcesIconPattern } from "../../../../static/img/navbar/resources-icon.svg";
export { default as insightsIconPattern } from "../../../../static/img/navbar/insights-icon.svg";

// Wallet icon mapping for dynamic icon lookup
import greenWallet from "../../../../static/img/navbar/green-wallet.svg";
import lilacWallet from "../../../../static/img/navbar/lilac-wallet.svg";
import yellowWallet from "../../../../static/img/navbar/yellow-wallet.svg";
import pinkWallet from "../../../../static/img/navbar/pink-wallet.svg";
import blueWallet from "../../../../static/img/navbar/blue-wallet.svg";
import devHomeIcon from "../../../../static/img/navbar/dev_home.svg";
import learnIcon from "../../../../static/img/navbar/learn.svg";
import codeSamplesIcon from "../../../../static/img/navbar/code_samples.svg";
import docsIcon from "../../../../static/img/navbar/docs.svg";
import clientLibIcon from "../../../../static/img/navbar/client_lib.svg";
import paymentsIcon from "../../../../static/img/navbar/payments.svg";
import tokenizationIcon from "../../../../static/img/navbar/tokenization.svg";
import creditIcon from "../../../../static/img/navbar/credit.svg";
import tradingIcon from "../../../../static/img/navbar/trading.svg";
import communityIcon from "../../../../static/img/navbar/community.svg";
import insightsIcon from "../../../../static/img/navbar/insights.svg";
import resourcesIcon from "../../../../static/img/navbar/resources.svg";

export const walletIcons: Record<string, string> = {
  green: greenWallet,
  lilac: lilacWallet,
  yellow: yellowWallet,
  pink: pinkWallet,
  blue: blueWallet,
  dev_home: devHomeIcon,
  learn: learnIcon,
  code_samples: codeSamplesIcon,
  docs: docsIcon,
  client_lib: clientLibIcon,
  payments: paymentsIcon,
  tokenization: tokenizationIcon,
  credit: creditIcon,
  trading: tradingIcon,
  community: communityIcon,
  insights: insightsIcon,
  resources: resourcesIcon,
};


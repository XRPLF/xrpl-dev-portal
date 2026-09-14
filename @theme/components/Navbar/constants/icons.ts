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

// Network submenu pattern images (used for both light and dark mode)
export { default as resourcesIconPattern } from "../../../../static/img/navbar/resources-icon.svg";
export { default as insightsIconPattern } from "../../../../static/img/navbar/insights-icon.svg";

// Submenu icons - imported once, exported individually and used in navIcons mapping
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
import fundingIcon from "../../../../static/img/navbar/funding.svg";
import contributeIcon from "../../../../static/img/navbar/contribute.svg";
import ecosystemIcon from "../../../../static/img/navbar/ecosystem.svg";
import insightsIcon from "../../../../static/img/navbar/insights.svg";
import resourcesIcon from "../../../../static/img/navbar/resources.svg";

// Re-export submenu icons for direct imports
export default {
  devHomeIcon,
  learnIcon,
  codeSamplesIcon,
  docsIcon,
  clientLibIcon,
  paymentsIcon,
  tokenizationIcon,
  creditIcon,
  tradingIcon,
  communityIcon,
  fundingIcon,
  contributeIcon,
  ecosystemIcon,
  insightsIcon,
  resourcesIcon,
};

// Dynamic icon lookup for navbar submenus
export const navIcons: Record<string, string> = {
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
  contribute: contributeIcon,
  insights: insightsIcon,
  resources: resourcesIcon,
  ecosystem: ecosystemIcon,
  funding: fundingIcon,
};

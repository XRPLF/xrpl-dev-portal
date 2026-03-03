import * as React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import numLight from "../static/js/ecosystem/numbers-animation-light.json";
import numDark from "../static/js/ecosystem/numbers-animation.json";
import arrow from "../static/js/ecosystem/arrow-animation.json";

export const frontmatter = {
  seo: {
    title: 'Use Cases & Featured Projects',
    description: "Here's how the XRP Ledger is used to power innovative technology across the payments and public blockchain landscape.",
  }
};

import { useLottie } from "lottie-react";
import { useThemeFromClassList } from "../@theme/helpers";

const logos = {
  infrastructure: [
    "xrp-ledger",
    "gatehub",
    "towolabs",
    "xrpscan",
    "xrp-toolkit",
    "bithomp",
    "onthedex",
  ],
  developer_tooling: ["cryptum", "evernode", "threezy", "tokenize"],
  interoperability: ["multichain"],
  wallet: ["crossmark", "edge", "gem-wallet", "xumm", "joey-wallet", "bifrost-wallet", "bitget-wallet"],
  nfts: [
    "aesthetes",
    "audiotarky",
    "nftmaster",
    "peerkat",
    "sologenic_dex",
    "xrp-cafe",
    "xrp-oval",
  ],
  exchanges: ["sologenic_dex", "xpmarket", 'orchestra-finance','moai-finance', 'first-ledger-bot'],
  gaming: ["forte", "ledger-city", "futureverse", 'zerpmon'],
  security: ["anchain"],
  payments: ["ripple", "supermojo"],
  cbdc: ["ripple"],
  sustainability: ["carbonland-trust"],
  custody: ["gatehub", "bitgo"],
};
const cardsData = [
  {
    id: "aesthetes",
    title: "Aesthetes",
    description:
      "Aesthetes is a bridge between fine art and blockchain, enabling everyone, around the world, to buy and sell with just a click for fractional ownership of international physical art.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://aesthetes.art/",
  },
  {
    id: "anchain-ai",
    title: "Anchain.AI",
    description:
      "AnChain.AI offers AI-powered intelligence enhancing blockchain security, risk, and compliance strategies.",
    category_id: "security",
    category_name: "Security",
    link: "https://anchain.ai",
  },
  {
    id: "audiotarky",
    title: "Audiotarky",
    description:
      "Audiotarky is a new music streaming platform that prioritises artists and privacy over algorithms and shareholders.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://www.audiotarky.com/",
  },
  {
    id: "bitgo",
    title: "BitGo",
    description:
      "BitGo provides custodial and non-custodial asset holdings for digital assets including XRP. BitGo's enterprise-level security empowers businesses to integrate digital currencies like XRP into new and existing financial systems.",
    category_id: "custody",
    category_name: "Custody",
    link: "https://www.bitgo.com/",
  },
  {
    id: "forte",
    title: "Forte",
    description:
      "Forte offers an unprecedented set of easy-to-use tools and services for game developers to integrate blockchain technology into their games, to unlock new economic and creative opportunities for gamers across the world.",
    category_id: "gaming",
    category_name: "Gaming",
    link: "https://forte.io",
  },
  {
    id: "futureverse",
    title: "Futureverse",
    description:
      "Revolutionary AI + metaverse technologies that enable open, scalable, and interoperable apps, games, and experiences.",
    category_id: "gaming",
    category_name: "Gaming",
    link: "https://www.futureverse.com/",
  },
  {
    id: "zerpmon",
    title: "Zerpmon",
    description:
      "Zerpmon is an original collection of digital collectible creatures that live on the XRPL, with each Zerpmon being a completely unique 1/1. Train and level-up your Zerpmon by taking them on Missions, then Battle other Trainers for XRP, NFTs, massive Tournament prizes, and the glory that comes with becoming the very best.",
    category_id: "gaming",
    category_name: "Gaming",
    link: "https://www.zerpmon.world/",
  },
  {
    id: "gatehub",
    title: "Gatehub",
    description:
      "Gatehub XRP Ledger Markets is an explorer to track Gatehub's inssuances on the XRP Ledger.",
    category_id: "custody",
    category_name: "Custody",
    link: "https://gatehub.net/markets",
  },
  {
    id: "bithomp",
    title: "Bithomp",
    description:
      "Bithomp is an XRPL explorer and toolkit, used by many cryptocurrency exchanges. Bithomp was launched in 2015 with a mission to build the most user-friendly XRPL explorer.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://bithomp.com/",
  },
  {
    id: "bitpay",
    title: "bitpay",
    description:
      "BitPay builds powerful, enterprise-grade tools for accepting and spending cryptocurrencies, including XRP.",
    category_id: "payments",
    category_name: "Payments",
    link: "https://bitpay.com/",
  },
  {
    id: "carbonland-trust",
    title: "Carbonland Trust",
    description:
      "Carbonland Trust offers transparent nature-based carbon credits, and inclusive access to voluntary carbon markets for landowners and corporations alike. ",
    category_id: "sustainability",
    category_name: "Carbon Markets/Sustainability",
    link: "https://www.carbonlandtrust.com/",
  },
  {
    id: "cryptum",
    title: "Cryptum",
    description:
      "Cryptum is an API/SDK platform for integrating the XRP Ledger with any application.",
    category_id: "developer_tooling",
    category_name: "Developer Tooling",
    link: "https://blockforce.in/products/cryptum",
  },
  {
    id: "evernode",
    title: "Evernode",
    description:
      "Evernode proposes a permissionless, flexible, scalable Layer 2 smart contract network built from the XRP Ledger.",
    category_id: "developer_tooling",
    category_name: "Developer Tooling",
    link: "https://evernode.org/",
  },
  {
    id: "gatehub",
    title: "Gatehub",
    description:
      "Gatehub XRP Ledger Markets is an explorer to track Gatehub's inssuances on the XRP Ledger.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://gatehub.net/markets",
  },
  {
    id: "gem-wallet",
    title: "Gem Wallet",
    description:
      "GemWallet is a web extension that enables users to make fast payments on the XRP Ledger via a browser. It's a safer alternative to copying and pasting private keys for use with web applications.",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://gemwallet.app/",
  },
  {
    id: "ledger-city",
    title: "Ledger City",
    description:
      "Ledger City is a crypto real estate game powered by the XRP Ledger.",
    category_id: "gaming",
    category_name: "Gaming",
    link: "https://ledgercitygame.com/",
  },
  {
    id: "multichain",
    title: "Multichain",
    description:
      "Multichain is the ultimate Router for web3. It is an infrastructure developed for arbitrary cross-chain interactions.",
    category_id: "interoperability",
    category_name: "Interoperability",
    link: "https://multichain.org/",
  },
  {
    id: "nft-master",
    title: "NFT Master",
    description:
      "NFT Master is an NFT marketplace where creators can buy, mint and sell NFTs.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://nftmaster.com/",
  },
  {
    id: "onthedex",
    title: "OnTheDex",
    description:
      "OnTheDex is a quality source of information for aggregator sites to take live feeds of XRPL token activity.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://onthedex.live/",
  },
  {
    id: "onxrp",
    title: "onXRP",
    description:
      "onXRP is an NFT marketplace where creators can buy, mint and sell NFTs built by the XPUNKs.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://onxrp.com/about/",
  },
  {
    id: "peerkat",
    title: "Peerkat",
    description:
      "Peerkat is an NFT services and tooling provider for the XRPL community.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://peerkat.io/",
  },
  {
    id: "Crossmark",
    title: "Crossmark",
    description:
      "Crossmark is a browser extension wallet built for interacting with the XRP Ledger.",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://github.com/crossmarkio",
  },
  {
    id: "joey-wallet",
    title: "Joey Wallet",
    description:
      "Joey Wallet is a secure, self-custody cryptocurrency wallet and gateway to Web3 decentralized applications (dApps) on the XRP Ledger (XRPL).",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://joeywallet.xyz/",
  },
  {
    id: "Edge",
    title: "Edge",
    description:
      "Edge is a secure, easy, and private way to use, store, trade, and exchange crypto assets. Edge ensures sure you're always in control of your money and information while also providing the tools necessary to protect yourself from others and your own mistakes. Edge has rich functionality, a battle-tested security architecture, and the industry's best customer support.",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://edge.app/ripple-wallet/",
  },
  {
    id: "ripples-cbdc-platform",
    title: "Ripple's CBDC Platform",
    description:
      "Ripple's Central Bank Digital Currency (CBDC) solution enables banks to mint, manage, transact and redeem currency to easily manage the full CBDC lifecycle. Each solution is built on a private ledger that is based upon XRP Ledger technology.",
    category_id: "cbdcs",
    category_name: "CBDC",
    link: "https://ripple.com/solutions/central-bank-digital-currency/",
  },
  {
    id: "ripples-on-demand-liquidity",
    title: "Ripple's On-Demand Liquidity",
    description:
      "Ripple powers real-time, low-cost cross-border payment settlement  by using XRP as a bridge currency between two fiat currencies.",
    category_id: "payments",
    category_name: "Payments",
    link: "https://ripple.com/",
  },
  {
    id: "sologenic-dex",
    title: "Sologenic DEX",
    description:
      "Sologenic DEX is a popular decentralized exchange on the XRP Ledger made by Sologenic.",
    category_id: "exchanges",
    category_name: "Exchanges",
    link: "https://sologenic.org/",
  },
  {
    id: "orchestra-finance",
    title: "Orchestra Finance",
    description:
      "Orchestra Finance is a first-in-class AMM DEX on the XRP Ledger(XRPL). We provide the quintessential AMM experience, with low fees, speedy transactions, and a user-friendly interface.",
    category_id: "exchanges",
    category_name: "Exchanges",
    link: "https://orchestra.finance/",
  },
  {
    id: "moai-finance",
    title: "Moai Finance",
    description:
      "Moai Finance is an innovative multi-chain DEX and cross-chain DEX aggregator, strategically positioned within the XRPL ecosystem to harness its untapped liquidity across various side-chains. ",
    category_id: "exchanges",
    category_name: "Exchanges",
    link: "https://moai-finance.xyz/",
  },
  {
    id: "first-ledger-bot",
    title: "First Ledger Bot",
    description:
      "First Ledger is the fastest way to trade on the xrpl. This tool allows you to trade with speed within a couple of clicks.",
    category_id: "exchanges",
    category_name: "Exchanges",
    link: "https://firstledger.net/",
  },
  {
    id: "sologenic-nft",
    title: "Sologenic NFT",
    description: "Sologenic NFT is an NFT marketplace designed by Sologenic.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://sologenic.org/nfts/marketplace?network=mainnet",
  },
  {
    id: "towo-labs",
    title: "Towo Labs",
    description:
      "Towo Labs was founded in 2019, to develop XRP Ledger and Interledger infrastructures and make non-custodial crypto management easier.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://towolabs.com/",
  },
  {
    id: "x-tokenize",
    title: "X-tokenize",
    description:
      "X-Tokenize is a command line tool to simplify the process of creating, managing and distributing issued currencies and eventually NFTs on the XRPL.",
    category_id: "developer_tooling",
    category_name: "Developer Tooling",
    link: "https://x-tokenize.com/",
  },
  {
    id: "threezy",
    title: "3ZY",
    description:
      "3ZY develops SaaS solutions that combine web2 and web3 technologies with marketing to enhance the user experience for newcomers in the market, making it easier for them to purchase, stay secure, and engage in trustless decentralized finance and transactions.",
    category_id: "developer_tooling",
    category_name: "Developer Tooling",
    link: "https://3zyconnect.com/",
  },
  {
    id: "xp-market",
    title: "XP Market",
    description:
      "XP Market is a price-tracking website for cryptoassets on the XRPL coupled with a decentralized exchange.",
    category_id: "exchanges",
    category_name: "Exchanges",
    link: "https://xpmarket.com/",
  },
  {
    id: "xrp-cafe",
    title: "XRP Cafe",
    description:
      "XRP Cafe is an NFT marketplace built by the community that aims to be the easiest way to build, sell and mint NFTs.",
    category_id: "nfts",
    category_name: "NFTs",
    link: "https://xrp.cafe/",
  },
  {
    id: "xrp-toolkit",
    title: "XRP Toolkit",
    description:
      "XRP Toolkit is a platform for managing crypto assets and trading on the XRP Ledger's decentralized exchange.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://www.xrptoolkit.com/",
  },
  {
    id: "xrpl-rosetta",
    title: "XRPL Rosetta",
    description:
      "XRPL Rosetta explores fiat data on XRPL through visualization.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://threexrp.dev/",
  },
  {
    id: "xrpl-org-ledger-explorer",
    title: "XRPL.org Ledger Explorer",
    description:
      "XRPL.org's Ledger Explorer is a block explorer of the XRP Ledger.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://livenet.xrpl.org/",
  },
  {
    id: "xrpscan",
    title: "XRPScan",
    description:
      "XRPSCAN is an explorer and analytics platform for the XRP Ledger. We provide a clean and simple way to look up accounts, ledgers and transactions.",
    category_id: "infrastructure",
    category_name: "Infrastructure",
    link: "https://xrpscan.com/",
  },
  {
    id: "xumm-wallet",
    title: "Xaman",
    description:
      "Xaman is a non custodial wallet with superpower for the XRP Ledger.",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://xaman.app/#team",
  },
  {
    id: "bifrost-wallet",
    title: "Bifrost Wallet",
    description:
      "Bifrost Wallet is a secure, independently audited self-custodial wallet for the XRP Ledger with multi-chain support. Purpose-built for XRPFi: a wallet where your XRP works for you and earns yield.",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://bifrostwallet.com/",
  },
  {
    id: "bitget-wallet",
    title: "Bitget Wallet",
    description:
      "Bitget Wallet is a non-custodial wallet designed to make crypto simple and secure for everyone.",
    category_id: "wallet",
    category_name: "Wallet",
    link: "https://web3.bitget.com/",
  },
];

const featured_categories = {
  infrastructure: "Infrastructure",
  developer_tooling: "Developer Tooling",
};

const other_categories = {
  interoperability: "Interoperability",
  wallet: "Wallet",
  nfts: "NFTs",
  exchanges: "Exchanges",
  gaming: "Gaming",
  security: "Security",
  payments: "Payments",
  sustainability: "Sustainability",
  cbdcs: "CBDCs",
  custody: "Custody",
};

const uses = [
  {
    id: "infrastructure",
    title: "Infrastructure",
    number: 7,
    description:
      "Build and operate components or systems that help the functionality of the XRP Ledger, such as Nodes, dev tools, storage, security and more."
  },

  {
    id: "developer_tooling",
    title: "Developer Tooling",
    number: 4,
    description:
      "Developers can leverage open-source libraries, SDKs and more to help build their project and access essential XRP Ledger functionality."
  },
  {
    id: "interoperability",
    title: "Interoperability",
    number: 1,
    description:
      "Developers and node operators can build and run custom sidechains while leveraging the XRPL's lean and efficient feature set."
  },
  {
    id: "wallet",
    title: "Wallet",
    number: 7,
    description:
      "Build digital wallets to store passwords and interact with various blockchains to send and receive digital assets, including XRP."
  },
  {
    id: "nfts",
    title: "NFTs",
    number: 7,
    description:
      "XRPL supports the issuance of IOUs that represent a currency of any value, as well as non-fungible tokens (NFTs)."
  },
  {
    id: "exchanges",
    title: "Exchanges",
    number: 5,
    description:
      "Build sophisticated exchanges where users can invest and trade crypto and assets such as stocks, ETFs, and commodities."
  },
  {
    id: "gaming",
    title: "Gaming",
    number: 4,
    description:
      "The XRPL supports gaming at high speed given its reliable throughput, low fees, and sidechain interoperability."
  },
  {
    id: "security",
    title: "Security",
    number: 1,
    description:
      "Build services and tools that help prevent and combat fraudulent activity with the XRPL."
  },

  {
    id: "payments",
    title: "Payments",
    number: 2,
    description:
      "Leverage the efficiency and speed of the XRP Ledger to move value all over the globe."
  },

  {
    id: "cbdc",
    title: "CBDC",
    number: 1,
    description:
      "A private version of the XRP Ledger provides Central Banks a secure, controlled, and flexible solution to issue and manage Central Bank Issued Digital Currencies (CBDCs)."
  },

  {
    id: "sustainability",
    title: "Sustainability",
    number: 1,
    description:
      "Use the XRP Ledger to tokenize carbon offsets as non-fungible tokens (NFTs)."
  },

  {
    id: "custody",
    title: "Custody",
    number: 2,
    description:
      "Use the XRP Ledger to build crypto custody and securely hold, store and use your assets."
  },
];

export default function Uses() {
  const theme = useThemeFromClassList(["dark", "light"]);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [displayModal, setDisplayModal] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const defaultSelectedCategories = new Set(Object.keys(featured_categories));

  const [selectedCategories, setSelectedCategories] = React.useState(
    defaultSelectedCategories
  );
  const [cards, setCards] = React.useState(cardsData);

  const toggleCategory = (category) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(category)) {
      newSelectedCategories.delete(category);
    } else {
      newSelectedCategories.add(category);
    }
    setSelectedCategories(newSelectedCategories);
  };

  const filteredCards = cards.filter((card) =>
    selectedCategories.has(card.category_id)
  );
  const featuredCount = Array.from(selectedCategories).filter((category) =>
    featured_categories.hasOwnProperty(category)
  ).length;
  const otherCount = Array.from(selectedCategories).filter((category) =>
    other_categories.hasOwnProperty(category)
  ).length;

  const modalRef = React.useRef(null); // Create a reference
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setDisplayModal(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, displayModal]);

  const handleArrowClick = (direction) => {
    let newIndex = currentIndex;
    if (direction === "left" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex < uses.length - 1) {
      newIndex = currentIndex + 1;
    }
    setModalData(uses[newIndex]);
    setCurrentIndex(newIndex);
  };

  React.useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        setDisplayModal(false);
      }
    };

    if (displayModal) {
      window.addEventListener("keydown", closeOnEscape);
    }

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [displayModal]);

  const options = React.useMemo(() => {
    return {
      animationData: theme === "dark" ? numDark : numLight,
      loop: false,
    };
  }, [theme]);
  const [modalData, setModalData] = React.useState({
    id: "",
    title: "",
    description: "",
    number: ""
  });
  const { View } = useLottie(options);

  //arrow
  const optionsArrow = React.useMemo(() => {
    return {
      animationData: arrow,
      loop: true,
    };
  }, [theme]);

  const arrowView = useLottie(optionsArrow);
  const arrowAnimation = arrowView.View;
  const UpdateModalContent = ({ id, title, description, logos }) => {
    const logoArray = logos[id] || [];
    const createLogoElement = (logoClassName, title, id) => {
      return (
        <div key={logoClassName} className={`logo-item ${logoClassName}`}>
        </div>
      );
    };

    const renderLogoRows = () => {
      if (logoArray.length === 0) return null;

      let topRow = [];
      let bottomRow = [];
      let bottomRowStyle = {};

      if (logoArray.length === 7) {
        topRow = logoArray.slice(0, 4);
        bottomRow = logoArray.slice(4);
      } else if (logoArray.length === 6) {
        topRow = logoArray.slice(0, 3);
        bottomRow = logoArray.slice(3);
      } else if (logoArray.length === 5) {
        topRow = logoArray.slice(0, 3);
        bottomRow = logoArray.slice(3);
        bottomRowStyle = { justifyContent: "center" };
      } else if (logoArray.length === 4) {
        topRow = logoArray.slice(0, 2);
        bottomRow = logoArray.slice(2);
        bottomRowStyle = { justifyContent: "center" };
      } else {
        topRow = logoArray;
      }

      return (
        <>
          <div className="top-row">
            {topRow.map((logoClassName) =>
              createLogoElement(logoClassName, title, id)
            )}
          </div>
          {bottomRow.length > 0 && (
            <div className="bottom-row" style={bottomRowStyle}>
              {bottomRow.map((logoClassName) =>
                createLogoElement(logoClassName, title, id)
              )}
            </div>
          )}
        </>
      );
    };

    return (
      <>
        <div className="arrows-container" id="arrows-container">
          {currentIndex !== 0 && (
            <button
              className="arrow-button left-arrow"
              id="leftArrow"
              style={{ position: "absolute", left: "0" }}
              onClick={() => handleArrowClick("left")}
            >
              <img alt="left arrow" />
            </button>
          )}
          {currentIndex !== uses.length - 1 && (
            <button
              className="arrow-button right-arrow"
              id="rightArrow"
              style={{ position: "absolute", right: "0" }}
              onClick={() => handleArrowClick("right")}
            >
              <img alt="right arrow" />
            </button>
          )}
        </div>
        <div className="content-section">
          <img
            className="section-image"
            alt="section image"
            width={40}
            height={40}
            id={id}
          />
        </div>
        <div className="content-section">
          <p className="section-text-title">{translate(title)}</p>
        </div>
        <div className="content-section">
          <p className="section-text-description">{translate(description)}</p>
        </div>
        <div className="content-section">
          <hr className="section-separator" />
        </div>
        <div className="content-section">
          <div className="section-logos px-5">{renderLogoRows()}</div>
        </div>
      </>
    );
  };
  return (
    <div className="landing page-uses landing-builtin-bg">
      <div>
        <div className="overflow-hidden">
          <section className="container-new py-26 text-lg-center">
            <div className="p-3 col-lg-8 mx-lg-auto">
              <div className="d-flex flex-column-reverse">
                <h1 className="mb-0">
                  {translate("Powering Innovative Use Cases and Projects")}
                </h1>
                <h6 className="eyebrow mb-3">{translate("XRPL Ecosystem")}</h6>
              </div>
            </div>
          </section>
          <section className="container-new py-26">
            <div className="col-lg-5 p-3">
              <div className="d-flex flex-column-reverse">
                <div className="d-flex justify-content-start align-items-center">
                  <div className="arrow-animation" id="arrowAnimation">
                    {arrowAnimation}
                  </div>
                  <span className="explore-projects">
                    {translate('Explore Featured Projects')}
                  </span>
                </div>
                <p className="text-sm">
                  {translate(
                    "The XRPL has a rich ecosystem with many contributors globally. Explore the community of developers, validators, and partners."
                  )}
                </p>
                <h6 className="eyebrow mb-3">
                  {translate("Introducing the XRPL Ecosystem")}
                </h6>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-2 p-5 d-flex">
              <div className="mb-4 pb-3 numbers-animation">{View}</div>
              <div className="apps-built">
                {translate('about.uses.apps-build-1', 'Apps/exchanges ')}<br />
                {translate('about.uses.apps-build-2', 'built on the ')}<br />
                {translate('about.uses.apps-build-3', 'XRPL')}
              </div>
            </div>
            <ul
              className="card-grid use-cases-grid ls-none mt-4 pt-lg-2"
              id="use-case-card-grid"
            >
              {uses.map((use, index) => (
                <li
                  key={use.id}
                  className="col use-case-circle ls-none p-3 open-modal"
                  data-id={use.id}
                  data-title={use.title}
                  data-description={use.description}
                  data-number={use.number}
                  onClick={() => {
                    setModalData(use);
                    setDisplayModal(true);
                    setCurrentIndex(index);
                  }}
                >
                  <div className="circle-content">
                    <img className="circle-img" id={use.id} alt="use-logos" />
                    <p className="circle-text">{translate(use.title)}</p>
                    <div className="pill-box">
                      <span className="pill-number">{use.number}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <div
            className={`modal modal-uses ${modalData?.id} ${displayModal ? "d-block" : ""}`}
            id="myModal"
          >
            <div
              ref={modalRef} // Attach the reference to the modal
              className="modal-content-uses"
            >
              <UpdateModalContent
                id={modalData?.id}
                title={modalData?.title}
                description={modalData?.description}
                logos={logos}
              />
            </div>
          </div>
          <section className="join-xrpl-section py-26">
            <div className="colorful-join-text-wrapper">
              <span className="colorful-join-text">
                {translate('Join the XRPL Ecosystem and showcase your XRPL project, application, or product. Get featured on the Developer Reflections blog or Ecosystem page.')}
              </span>
              <div className="mt-10">
                <a
                  target="_blank"
                  className="btn btn-primary btn-arrow"
                  href="https://xrplresources.org/developer-spotlight"
                >
                  {translate("Submit Your Project")}
                </a>
              </div>
            </div>
          </section>
          <section className="container-new py-26">
            <div className="col-12 col-lg-8 col-xl-6 p-3 mb-5">
              <div className="d-flex flex-column-reverse">
                <h3 className="h4 h2-sm">
                  {translate("about.uses.businesses.h3part1","Businesses and developers")}
                  <br className="until-sm" />
                  {translate("about.uses.businesses.h3part2", "rely on the XRP Ledger")}
                </h3>
                <h6 className="eyebrow mb-3">
                  {translate("Solving Real-World Problems")}
                </h6>
              </div>
              <p className="mb-0 longform mt-8-until-sm mt-3 ">
                {translate(
                  "With intentional innovations, tools and documentation that accelerate development and minimize time to market, XRP Ledger is used to create solutions across an expansive range of industries and use cases."
                )}
              </p>
            </div>
            <a
              className="btn d-block d-lg-none"
              data-toggle="modal"
              data-target="#categoryFilterModal"
            >
              <span className="mr-3">
                <img
                  src={require("../static/img/uses/usecase-filter.svg")}
                  alt="Filter button"
                />
              </span>
              {translate("Filter by Categories")}
              <span className="ml-3 total_count category_count">2</span>
            </a>
            {/* Start company cards */}
            <div className="row col-12 m-0 p-0 mt-4 pt-2">
              <div className="left col-3 m-0 p-0 mt-2 d-none d-lg-block">
                {/* Side bar Desktop.  */}
                <div className="p-3 category_sidebar">
                  <form>
                    <p className="category-header mb-4">
                      {translate("Featured Categories")}{" "}
                      <span
                        id="featured_count_old"
                        className="featured_count category_count"
                      >
                        {featuredCount}
                      </span>
                    </p>
                    {Object.keys(featured_categories).map((item) => (
                      <div
                        key={item}
                        className="cat_checkbox category-checkbox pb-2"
                      >
                        <input
                          className={`events-filter input_${item}`}
                          type="checkbox"
                          name="categories"
                          id={`input_${item}`}
                          defaultValue={`${item}`}
                          onChange={() => toggleCategory(item)}
                          defaultChecked
                        />
                        <label
                          className="font-weight-bold"
                          htmlFor={`input_${item}`}
                        >
                          {translate(featured_categories[item])}
                        </label>
                      </div>
                    ))}
                    <p className="category-header pt-5 mt-3 mb-4">
                      {translate("Other Categories")}{" "}
                      <span
                        id="other_count_old"
                        className="other_count category_count"
                      >
                        {otherCount}
                      </span>
                    </p>
                    {Object.keys(other_categories).map((item) => (
                      <div
                        key={item}
                        className="cat_checkbox category-checkbox pb-2"
                      >
                        <input
                          className={`events-filter input_${item}`}
                          type="checkbox"
                          name="categories"
                          id={`input_${item}`}
                          onChange={() => toggleCategory(item)}
                        />
                        <label htmlFor={`input_${item}`}>
                          {translate(other_categories[item])}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
                {/* End sidebar desktop */}
              </div>
              {/* cards */}
              <div
                className="right row col row-cols-lg-2 m-2 p-0"
                id="use_case_companies_list"
              >
                {filteredCards.map((card) => (
                  <a
                    key={card.id}
                    className={`card-uses category_${card.category_id}`}
                    href={card.link}
                    target="_blank"
                    id={card.id}
                  >
                    <div className="card-body row">
                      <span className="w-100 mb-3 pb-3">
                        <img
                          className="mw-100 biz-logo"
                          alt={`${card.title}|default${card.id}`}
                        />
                      </span>
                      <h4 className="card-title h6">{card.title}</h4>
                      <p className="card-text">{translate(card.description)}</p>
                      <div className="align-self-end">
                        <span className={`label label-use-${card.category_id}`}>
                          {translate(card.category_name)}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {/* end cards */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';

export const frontmatter = {
  seo: {
    title: 'Dev Tools',
    description: "Use these tools to explore, build, and test XRP Ledger technology.",
  }
};

const explorers_tools = [
  {
    id: "xrp-explorer",
    title: "XRPL Explorer",
    description:
      "View validations of new ledger versions in real-time, or chart the location of servers in the XRP Ledger.",
    href: "https://livenet.xrpl.org",
    img: require("../../static/img/dev-tools/explorer.png"),
  },
  {
    id: "bithomp-explorer",
    title: "Bithomp Explorer",
    description:
      "Explore public ledger data including accounts' transaction history and known names.",
    href: "https://bithomp.com/",
    img: require("../../static/img/dev-tools/bithomp.png"),
  },
  {
    id: "xrpscan",
    title: "XRPScan",
    description:
      "Explore ledger activity, view amendment voting in real-time, and get account information. API access is also available.",
    href: "https://xrpscan.com/",
    img: require("../../static/img/dev-tools/xrpscan.png"),
  },
  {
    id: "token-list",
    title: "Token List",
    description:
      "See all tokens issued in the XRP Ledger and use preset tools to issue custom tokens at the click of a button.",
    href: "https://xrpl.services/tokens",
    img: require("../../static/img/dev-tools/tokenlist.png"),
  },
];

const api_access_tools = [
  {
    id: "websocket",
    title: "WebSocket Tool",
    description:
      "Send sample requests and get responses from the rippled API.",
    href: "/resources/dev-tools/websocket-api-tool",
    img: require("../../static/img/dev-tools/websocket-tool.png"),
  },
  {
    id: "rpc",
    title: "RPC Tool",
    description:
      "Print raw information about an XRP Ledger account, transaction, or ledger.",
    href: "/resources/dev-tools/rpc-tool",
    img: require("../../static/img/dev-tools/rpc-tool.png"),
  },
  {
    id: "technical-explorer",
    title: "Technical Explorer",
    description: "Browse API objects from the ledger with real-time updates.",
    href: "https://explorer.xrplf.org/",
    img: require("../../static/img/dev-tools/technical-explorer.png"),
  },
  {
    id: "faucets",
    title: "Faucets",
    description:
      "Get credentials and test-XRP for XRP Ledger Testnet or Devnet.",
    href: "/resources/dev-tools/xrp-faucets",
    img: require("../../static/img/dev-tools/faucets.png"),
  },
  {
    id: "trasaction-sender",
    title: "Transaction Sender",
    description:
      "Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address.",
    href: "/resources/dev-tools/tx-sender",
    img: require("../../static/img/dev-tools/transaction-sender.png"),
  },
];

const other = [
  {
    id: "domain",
    title: "Domain Verification Checker",
    description: "Verify your validator's domain.",
    href: "/resources/dev-tools/domain-verifier",
    img: require("../../static/img/dev-tools/domain-checker.png"),
  },
  {
    id: "xrp-ledger",
    title: "xrp-ledger.toml Checker",
    description: "Verify that your xrp-ledger.toml file is set up properly.",
    href: "/resources/dev-tools/xrp-ledger-toml-checker",
    img: require("../../static/img/dev-tools/toml-checker.png"),
  },
  {
    id: "binary-visualizer",
    title: "Binary Visualizer",
    description:
      "Parse the XRP Ledger's native binary format with a visual representation breaking down the raw structure into its parts.",
    href: "https://richardah.github.io/xrpl-binary-visualizer/",
    img: require("../../static/img/dev-tools/binary-visualizer.png"),
  },
  {
    id: "token-metadata-lookup",
    title: "Token Metadata Lookup",
    description:
      "Query known information about any token issued on the XRP Ledger.",
    href: "https://xrplmeta.org/",
    img: require("../../static/img/dev-tools/token-metadata.png"),
  },
];

export default function DevTools() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <article className="page-dev-tools pt-3 p-md-3">
      <div>
        <section className="py-20">
          <div className="mx-auto text-lg-left">
            <div className="d-flex flex-column-reverse">
              <p className="mb-0">
                {translate(
                  "Use the developer tools to test, explore, and validate XRP Ledger API requests and behavior."
                )}
              </p>
              <h3 className="eyebrow mb-3"> {translate("Dev Tools")}</h3>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="mx-auto text-lg-left">
            <div className="sticky">
              <ul className="nav nav-tabs pb-15" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active dev-tools-tab"
                    id="explorers-tab"
                    data-toggle="tab"
                    data-target="#explorers"
                    role="tab"
                    aria-controls="explorers"
                    aria-selected="true"
                  >
                    {translate("Explorers")}
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link  dev-tools-tab"
                    id="api-access-tab"
                    data-toggle="tab"
                    data-target="#api-access"
                    role="tab"
                    aria-controls="api-access"
                    aria-selected="false"
                  >
                    {translate("API Access")}
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link  dev-tools-tab"
                    id="other-tab"
                    data-toggle="tab"
                    data-target="#other"
                    role="tab"
                    aria-controls="other"
                    aria-selected="false"
                  >
                    {translate("Other")}
                  </button>
                </li>
              </ul>
            </div>
            <div className="tab-content pt-20">
              <div
                className="tab-pane show active"
                id="explorers"
                role="tabpanel"
                aria-labelledby="explorers-tab"
              >
                <h4> {translate("Explorers")}</h4>
                <div className="row row-cols-1 row-cols-lg-3 card-deck">
                  {explorers_tools.map((card) => (
                    <a
                      className="card"
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={card.id}
                      key={card.id}
                    >
                      {card.img && (
                        <img src={card.img} alt={`${card.title} Screenshot`} />
                      )}
                      <div className="card-body">
                        <h4 className="card-title h5">{translate(card.title)}</h4>
                        <p className="card-text">{translate(card.description)}</p>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </a>
                  ))}
                </div>
              </div>
              <div
                className="tab-pane"
                id="api-access"
                role="tabpanel"
                aria-labelledby="api-access-tab"
              >
                <h4> {translate("API Access")}</h4>
                <div className="row row-cols-1 row-cols-lg-3 card-deck">
                  {api_access_tools.map((card) => (
                    <a
                      className="card"
                      href={card.href}
                      target="_blank"
                      id={card.id}
                      key={card.id}
                    >
                      {
                        card.img && (
                          <img src={card.img} alt={card.title + " Screenshot"} />
                        )
                      }
                      <div className="card-body">
                        <h4 className="card-title h5">{translate(card.title)}</h4>
                        <p className="card-text">{translate(card.description)}</p>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </a>
                  ))}
                </div>
              </div>
              <div
                className="tab-pane"
                id="other"
                role="tabpanel"
                aria-labelledby="other-tab"
              >
                <h4> {translate("Other")}</h4>
                <div className="row row-cols-1 row-cols-lg-3 card-deck">
                  {other.map((card) => (
                    <a
                      className="card"
                      href={card.href}
                      target="_blank"
                      id={card.id}
                      key={card.id}
                    >
                      {
                        card.img && (
                          <img src={card.img} alt={card.title + " Screenshot"} />
                        )
                      }
                      <div className="card-body">
                        <h4 className="card-title h5">{translate(card.title)}</h4>
                        <p className="card-text">{translate(card.description)}</p>
                      </div>
                      <div className="card-footer">&nbsp;</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-new py-10 px-0">
          <div className="col-lg-12 p-6-sm p-10-until-sm br-8 cta-card">
            <img
              alt="purple waves"
              src={require("../../static/img/backgrounds/cta-home-purple.svg")}
              className="d-none-sm cta cta-top-left"
            />
            <img
              alt="green waves"
              src={require("../../static/img/backgrounds/cta-home-green.svg")}
              className="cta cta-bottom-right"
            />
            <div className="z-index-1 position-relative">
              <h2 className="h4 mb-8-sm mb-10-until-sm">
                {translate("Have an Idea For a Tool?")}
              </h2>
              <p className="mb-10">
                {translate(
                  "Contribute to the XRP Ledger community by submitting your idea for a tool or open a pull request if you've developed a tool."
                )}
              </p>
              <a
                className="btn btn-primary btn-arrow-out"
                href="https://github.com/XRPLF/xrpl-dev-portal/"
              >
                {translate("Open a pull Request")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

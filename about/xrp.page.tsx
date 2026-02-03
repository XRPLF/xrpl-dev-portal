import * as React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import briefcaseIcon from "../static/img/icons/briefcase.svg";
import userIcon from "../static/img/icons/user.svg";
export const frontmatter = {
  seo: {
    title: "XRP Overview",
    description: "Learn more about XRP Ledger’s native digital asset, XRP.",
  },
};

const links = [
  { hash: "#about-xrp", text: "About XRP" },
  { hash: "#xrp-trading", text: "XRP in Trading" },
  { hash: "#ripple", text: "Ripple vs. XRP" },
  { hash: "#wallets", text: "XRP Wallets" },
  { hash: "#exchanges", text: "XRP Exchanges" },
];

const softwallets = [
  { href: "https://bifrostwallet.com/", id: "wallet-bifrost", alt: "Bifrost Wallet" },
  { href: "https://xaman.app/", id: "wallet-xumm", alt: "Xaman" },
  { href: "https://trustwallet.com/", id: "wallet-trust", alt: "Trust Wallet" },
  {
    href: "https://gatehub.net/",
    id: "wallet-gatehub",
    alt: "Gatehub",
    imgclasses: "invertible-img",
  },
  { href: "https://gemwallet.app/", id: "wallet-gem", alt: "Gem Wallet" },
  { href: "https://coin.space/", id: "wallet-coin", alt: "Coin Space" },
  { href: "https://crossmark.io/", id: "wallet-crossmark", alt: "Crossmark Wallet" },
  { href: "https://joeywallet.xyz/", id: "wallet-joey", alt: "Joey Wallet" },
];

const hardwallets = [
  {
    href: "https://www.ledger.com/",
    id: "wallet-ledger",
    alt: "Ledger",
    imgclasses: "invertible-img",
  },
  { href: "https://keyst.one/", id: "wallet-keystone", alt: "Keystone" },
  {
    href: "https://dcentwallet.com/?lang=en",
    id: "wallet-dcent",
    alt: "Dcent",
  },
  {
    href: "https://trezor.io/",
    id: "wallet-trezor",
    alt: "Trezor",
    imgclasses: "invertible-img",
  },
];

const exchanges = [
  { href: "https://www.bitstamp.net/", id: "exch-bitstamp", alt: "Bitstamp" },
  { href: "https://www.kraken.com/", id: "exch-kraken", alt: "Kraken" },
  { href: "https://cex.io/", id: "exch-cex-io", alt: "Cex.io" },
  { href: "https://www.liquid.com/", id: "exch-liquid", alt: "Liquid" },
  { href: "https://www.lmax.com/", id: "exch-lmax", alt: "LMAX" },
  { href: "https://www.bitfinex.com/", id: "exch-bitfinex", alt: "Bitfinex" },
  {
    href: "https://www.etoro.com/crypto/exchange/",
    id: "exch-etoro",
    alt: "eToro",
  },
  {
    href: "https://currency.com",
    id: "exch-currency-com",
    alt: "Currency.com",
  },
  { href: "https://bittrex.com/", id: "exch-bittrex", alt: "Bittrex" },
];

export default function XrpOverview() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [activeSection, setActiveSection] = React.useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "about-xrp",
        "xrp-trading",
        "ripple",
        "wallets",
        "exchanges",
      ];
      let currentSection = null;

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            currentSection = id;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const totalCols = Math.max(softwallets.length, hardwallets.length) + 1;
  return (
    <div className="landing">
      <div>
        <div className="position-relative">
          <img
            alt="blue waves"
            src={require("../static/img/backgrounds/xrp-overview-blue.svg")}
            className="landing-bg"
            id="xrp-overview-blue"
          />
        </div>
        <section className="py-26 text-center">
          <div className="col-lg-5 mx-auto text-center">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("Your Questions About XRP, Answered")}
              </h1>
              <h6 className="eyebrow mb-3">{translate("XRP Overview")}</h6>
            </div>
          </div>
        </section>
        <section className="container-new my-20">
          <div className="card-grid card-grid-1x2">
            <div className="d-none-sm mt-lg-0">
              <ul className="page-toc no-sideline p-0 sticky-top floating-nav">
                {links.map((link) => (
                  <li
                    key={link.hash}
                    className={`nav-item ${
                      activeSection === link.hash.substring(1) ? "active" : ""
                    }`}
                  >
                    <a
                      className={`sidelinks nav-link ${
                        activeSection === link.hash.substring(1) ? "active" : ""
                      }`}
                      href={link.hash}
                    >
                      {translate(link.text)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col mt-lg-0">
              <div className="link-section pb-26" id="about-xrp">
                <h2 className="h4 h2-sm mb-8">{translate("What Is XRP?")}</h2>
                <h5 className="longform mb-10">
                  {translate(
                    "about.xrp.what-is-xrp.ppart1",
                    "XRP is a digital asset that’s native to the XRP Ledger—an open-source, permissionless and decentralized ",
                  )}
                  <a
                    href="https://www.distributedagreement.com/2018/09/24/what-is-a-blockchain/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {translate("about.xrp.what-is-xrp.ppart2", "blockchain technology.")}
                  </a>
                  {translate("about.xrp.what-is-xrp.ppart3", " ")}
                </h5>

                <p className="mb-6">
                  {translate(
                    "Created in 2012 specifically for payments, XRP can settle transactions on the ledger in 3-5 seconds. It was built to be a better Bitcoin—faster, cheaper and greener than any other digital asset."
                  )}
                </p>
                <div className="overflow-x-xs">
                  <table className="mb-10 landing-table">
                    <thead>
                      <tr>
                        <th>
                          <h6>{translate("Benefits")}</h6>
                        </th>
                        <th>
                          <h6>{translate("XRP")}</h6>
                        </th>
                        <th>
                          <h6>{translate("Bitcoin")}</h6>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{translate("Fast")}</td>
                        <td>{translate("3-5 seconds to settle")}</td>
                        <td>{translate("500 seconds to settle")}</td>
                      </tr>
                      <tr>
                        <td>{translate("Low-Cost")}</td>
                        <td>{translate("$0.0002/tx")}</td>
                        <td>{translate("$0.50/tx")}</td>
                      </tr>
                      <tr>
                        <td>{translate("Scalable")}</td>
                        <td>{translate("1,500 tx per second")}</td>
                        <td>{translate("3 tx per second")}</td>
                      </tr>
                      <tr>
                        <td>{translate("Sustainable")}</td>
                        <td>
                          {translate(
                            "Environmentally sustainable (negligible energy consumption)"
                          )}
                        </td>
                        <td>
                          {translate("0.3% of global energy consumption")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mb-10">
                  {translate(
                    "XRP can be sent directly without needing a central intermediary, making it a convenient instrument in bridging two different currencies quickly and efficiently. It is freely exchanged on the open market and used in the real world for enabling cross-border payments and microtransactions."
                  )}
                </p>
                <div className="card-grid card-grid-2xN mb-10">
                  <div>
                    <img
                      alt="briefcase"
                      className="mw-100 mb-2 invertible-img"
                      src={briefcaseIcon}
                    />
                    <h6 className="fs-4-5">
                      {translate("Financial Institutions")}
                    </h6>
                    <p className="">
                      {translate(
                        "Leverage XRP as a bridge currency to facilitate faster, more affordable cross-border payments around the world."
                      )}
                    </p>
                  </div>
                  <div>
                    <img
                      alt="user"
                      className="mw-100 mb-2 invertible-img"
                      src={userIcon}
                    />
                    <h6 className="fs-4-5">
                      {translate("Individual Consumers")}
                    </h6>
                    <p>
                      {translate(
                        "Use XRP to move different currencies around the world."
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-10 p-10 br-8 cta-card position-relative">
                  <img
                    alt="magenta waves"
                    src={require("../static/img/backgrounds/cta-xrp-overview-magenta.svg")}
                    className="cta cta-bottom-right"
                  />
                  <div className="z-index-1 position-relative">
                    <h2 className="h4 mb-10-until-sm mb-8-sm">
                      {translate(
                        "The XRP Ledger is built for business."
                      )}
                    </h2>
                    <p className="mb-10">
                      {translate(
                        "The only major L-1 blockchain that’s built for business and designed specifically to power finance use cases and applications at scale. Powerful enough to bootstrap a new economy, the XRP Ledger (XRPL) is fast, scalable, and sustainable."
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-26 link-section" id="xrp-trading">
                <h2 className="h4 h2-sm mb-8">
                  {translate("How Is XRP Used in Trading?")}
                </h2>
                <h5 className="longform mb-10">
                  {translate(
                    "XRP is traded on more than 100 markets and exchanges worldwide."
                  )}
                </h5>
                <p className="mb-6">
                  {translate(
                      "about.xrp.xrp-in-trading.ppart1",
                    "XRP’s low transaction fees, reliability and high-speed enable traders to use the digital asset as high-speed, cost-efficient and reliable collateral across trading venues—"
                  )}
                  <a
                    href="https://ripple.com/insights/xrp-a-preferred-base-currency-for-arbitrage-trading/"
                    target="_blank"
                  >
                    {translate("about.xrp.xrp-in-trading.ppart2","seizing arbitrage opportunities")}
                  </a>
                  {translate(
                      "about.xrp.xrp-in-trading.ppart3",
                    ", servicing margin calls and managing general trading inventory in real time."
                  )}
                </p>

                <p>
                  {translate(
                    "Because of the properties inherent to XRP and the ecosystem around it, traders worldwide are able to shift collateral, bridge currencies and switch from one crypto into another nearly instantly, across any exchange on the planet."
                  )}
                </p>
              </div>
              <div className="py-26 link-section" id="ripple">
                <h2 className="h4 h2-sm mb-8">
                  {translate(
                    "What Is the Relationship Between Ripple and XRP?"
                  )}
                </h2>
                <h5 className="longform mb-10">
                  <a href="https://ripple.com" target="_blank">
                    {translate("Ripple")}
                  </a>
                  {translate(
                    " is a technology company that makes it easier to build a high-performance, global payments business. XRP is a digital asset independent of this."
                  )}
                </h5>

                <p>
                  {translate(
                    "There is a finite amount of XRP. All XRP is already in existence today—no more than the original 100 billion can be created. The XRPL founders gifted 80 billion XRP, the platform’s native currency, to Ripple. To provide predictability to the XRP supply, Ripple has locked 55 billion XRP (55% of the total possible supply) into a series of escrows using the XRP Ledger itself. The XRPL's transaction processing rules, enforced by the consensus protocol, control the release of the XRP."
                  )}
                </p>
                <div className="mt-10 p-10 br-8 cta-card position-relative">
                  <img
                    alt="green waves"
                    src={require("../static/img/backgrounds/cta-xrp-overview-green-2.svg")}
                    className="landing-bg cta cta-bottom-right"
                  />
                  <div className="z-index-1 position-relative">
                    <h3 className="h4">
                      {translate("about.xrp.ripple-escrow.ppart1","As of ")}
                      <span className="stat-highlight" id="ripple-escrow-as-of">
                        {translate("about.xrp.ripple-escrow.ppart2","October 2024")}
                      </span>
                      {translate("about.xrp.ripple-escrow.ppart3"," ")}
                      <br />
                      <span className="d-inline-flex">
                        <img
                          id="xrp-mark-overview"
                          className="mw-100 invertible-img mr-2"
                          src={require("../static/img/logos/xrp-mark.svg")}
                          alt="XRP Logo Mark"
                        />
                        <span
                          className="numbers stat-highlight"
                          id="ripple-escrow-amount"
                        >
                          {translate("38B")}
                        </span>
                      </span>
                      <br />
                      {translate("XRP remains in escrow")}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="link-section py-26" id="wallets">
                <h2 className="h4 h2-sm mb-8">
                  {translate("What Wallets Support XRP?")}
                </h2>
                <h5 className="longform mb-10">
                  {translate(
                    "Digital wallets are pieces of software that allow people to send, receive, and store cryptocurrencies, including XRP. There are two types of digital wallets: hardware and software."
                  )}
                </h5>
                <ul className={`nav nav-grid-lg cols-of-${totalCols}`} id="wallets">
                  <li className="nav-item nav-grid-head">
                    <h6 className="fs-4-5">{translate("Software Wallets")}</h6>
                  </li>
                  {softwallets.map((wallet) => (
                    <li key={wallet.id} className="nav-item">
                      <a
                        className="nav-link external-link"
                        href={wallet.href}
                        target="_blank"
                      >
                        <img
                          className={`mw-100 ${
                            !!wallet?.imgclasses && wallet.imgclasses
                          }`}
                          id={wallet.id}
                          alt={wallet.alt}
                        />
                      </a>
                    </li>
                  ))}
                  <li className="nav-item nav-grid-head">
                    <h6 className="fs-4-5">{translate("Hardware Wallets")}</h6>
                  </li>
                  {hardwallets.map((wallet) => (
                    <li className="nav-item" key={wallet.id}>
                      <a
                        className="nav-link external-link"
                        href={wallet.href}
                        target="_blank"
                      >
                        <img
                          className={`mw-100 ${
                            !!wallet.imgclasses && wallet.imgclasses
                          }`}
                          id={wallet.id}
                          alt={wallet.alt}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="fs-3 mt-10">
                  {translate(
                    "Disclaimer: This information is drawn from other sources on the internet.  XRPL.org does not endorse or recommend any exchanges or make any representations with respect to exchanges or the purchase or sale of digital assets more generally. It’s advisable to conduct your own due diligence before relying on any third party or third-party technology, and providers may vary significantly in their compliance, data security, and privacy practices."
                  )}
                </p>
              </div>
              <div className="py-26 link-section" id="exchanges">
                <h2 className="h4 h2-sm mb-8">
                  {translate("What Exchanges Support XRP?")}
                </h2>
                <h5 className="longform mb-10">
                  {translate(
                    "Exchanges are where people trade currencies. XRP is traded on more than 100 markets and exchanges worldwide."
                  )}
                </h5>
                <p className="mb-10">
                  {translate(
                    "There are different types of exchanges that vary depending on the type of market (spot, futures, options, swaps), and the type of security model (custodial, non-custodial)."
                  )}
                </p>
                <div className="card-grid card-grid-2xN mb-10">
                  <div>
                    <h6 className="fs-4-5">{translate("Spot Exchanges")}</h6>
                    <p className="mb-0">
                      {translate(
                        "Spot exchanges allow people to buy and sell cryptocurrencies at current (spot) market rates."
                      )}
                    </p>
                  </div>
                  <div>
                    <h6 className="fs-4-5">
                      {translate("Futures, Options and Swap Exchanges")}
                    </h6>
                    <p className="mb-0">
                      {translate(
                        "Futures, options and swap exchanges allow people to buy and sell standardized contracts of cryptocurrency market rates in the future."
                      )}
                    </p>
                  </div>
                  <div>
                    <h6 className="fs-4-5">
                      {translate("Custodial Exchanges")}
                    </h6>
                    <p className="mb-0">
                      {translate(
                        "Custodial exchanges manage a user’s private keys, and publish centralized order books of buyers and sellers."
                      )}
                    </p>
                  </div>
                  <div>
                    <h6 className="fs-4-5">
                      {translate("Non-Custodial Exchanges")}
                    </h6>
                    <p className="mb-0">
                      {translate(
                        "Non-custodial exchanges, also known as decentralized exchanges, do not manage a user’s private keys, and publish decentralized order books of buyers and sellers on a blockchain."
                      )}
                    </p>
                  </div>
                </div>
                <h6>
                  {translate("Top Exchanges, according to CryptoCompare")}
                </h6>
                <ul
                  className="nav nav-grid-lg cols-of-5 mb-10"
                  id="top-exchanges"
                >
                  {exchanges.map((exch, i) => (
                    <li className="nav-item" key={exch.id}>
                      <a
                        className="nav-link external-link"
                        href={exch.href}
                        target="_blank"
                      >
                        <span className="longform mr-3">{i+1}</span>
                        <img className="mw-100" id={exch.id} alt={exch.alt} />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="fs-3 mt-10 mb-0">
                  {translate(
                    "Disclaimer: This information is drawn from other sources on the internet.  XRPL.org does not endorse or recommend any exchanges or make any representations with respect to exchanges or the purchase or sale of digital assets more generally. It’s advisable to conduct your own due diligence before relying on any third party or third-party technology, and providers may vary significantly in their compliance, data security, and privacy practices."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

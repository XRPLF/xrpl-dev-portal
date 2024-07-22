import * as React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from '@redocly/theme/components/Link/Link';

export const frontmatter = {
  seo: {
    title: 'XRPL Overview',
    description: "An introduction to the key benefits and features of the XRP Ledger, a public blockchain driven by the XRPL developer community.",
  }
};

const faqs = [
  {
    question: "Is XRPL a private blockchain, owned by Ripple?",
    answer:
      "No, the XRP Ledger is a decentralized, public blockchain. Any changes that would impact transaction processing or consensus need to be approved by at least 80%% of the network. Ripple is a contributor to the network, but its rights are the same as those of other contributors. In terms of validation, there are 150+ validators on the network with 35+ on the Unique Node List (see “What are Unique Node Lists (UNLs)?” in the Full FAQ) — Ripple runs 1 of these nodes.",
  },
  {
    question: "Isn’t Proof of Work the best validation mechanism?",
    answer:
      "Proof of Work (PoW) was the first mechanism to solve the double spend problem without requiring a trusted 3rd party. However the XRP Ledger’s consensus mechanism solves the same problem in a far faster, cheaper and more energy efficient way.",
  },
  {
    question: "How can a blockchain be sustainable?",
    answer:
      "It’s been widely reported that Bitcoin’s energy consumption, as of 2021, is equivalent to that used by Argentina, with much of the electricity Bitcoin miners use coming from polluting sources. The XRP Ledger confirms transactions through a “consensus” mechanism - which does not waste energy like proof of work does - and leverages carbon offsets to be <a href='https://ripple.com/ripple-press/ripple-leads-sustainability-agenda-to-achieve-carbon-neutrality-by-2030/' target='_blank'>one of the first truly carbon neutral blockchains</a>.",
  },
];

export default function XrplOverview() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [videoOne, setVideoOne] = React.useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState("");
  const modalRef = React.useRef(null);

  // Close modal on outside click
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setCurrentVideoUrl("");
    }
  };

  // Close modal on escape key press
  const handleEscapeKeyPress = (event) => {
    if (event.key === "Escape") {
      setCurrentVideoUrl("");
    }
  };

  React.useEffect(() => {
    // Add event listeners
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKeyPress);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts
  return (
    <div className="landing">
      <div className="overflow-hidden">
        <div
          id="video-overlay"
          className={`${!!currentVideoUrl?.length && "d-block"}`}
        />
        <div id="video" className={`${!!currentVideoUrl?.length && "d-block"}`}>
          <div id="videoWrapper" ref={modalRef}>
            <iframe
              id="player"
              width={853}
              height={480}
              src={currentVideoUrl}
              frameBorder={0}
              allowFullScreen
            />
          </div>
        </div>
        <div className="position-relative">
          <img
            alt="purple waves"
            src={require("../static/img/backgrounds/xrpl-overview-purple.svg")}
            className="landing-bg"
            id="xrpl-overview-purple"
          />
        </div>
        <section className="py-26 text-center">
          <div className="col-lg-5 mx-auto text-center">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("about.index.h1part1", "The Business ")}
                <br className="until-sm" />
                {translate("about.index.h1part2", " of Impact")}
              </h1>
              <h6 className="eyebrow mb-3">
                {translate("XRPL Today, XRPL Tomorrow")}
              </h6>
            </div>
          </div>
        </section>
        <div className="position-relative d-none-sm">
          <img
            alt="orange waves"
            src={require("../static/img/backgrounds/xrpl-overview-orange.svg")}
            id="xrpl-overview-orange"
          />
        </div>
        <section className="container-new py-26">
          <div className="card-grid card-grid-2xN">
            <div className="col">
              <div className="d-flex flex-column-reverse">
                <h2 className="h4 h2-sm mb-8">
                  {translate("How the XRP Ledger works")}
                </h2>
                <h6 className="eyebrow mb-3">
                  {translate("XRP Ledger Basics")}
                </h6>
              </div>
              <h5 className="longform mb-10">
                {translate(
                  "The XRP Ledger is a decentralized public blockchain built for business."
                )}
              </h5>
              <p className="mb-4">
                {translate(
                  "The peer-to-peer network that manages the ledger is open to everyone. The XRP Ledger is maintained by software engineers, server operators, users, and businesses–a global community working to solve problems and create real-world value."
                )}
              </p>
              <div className="d-none d-lg-block">
                <Link className="btn btn-primary btn-arrow" to="/docs">
                  {translate("Read Technical Docs")}
                </Link>{" "}
                <a
                  className="ml-4 video-external-link"
                  target="_blank"
                  href="https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi"
                >
                  {translate("Watch Explainer Videos")}
                </a>
              </div>
            </div>
            <div className="col">
              {videoOne ? (
                <iframe
                  id="video1"
                  width={560}
                  height={315}
                  src="https://www.youtube.com/embed/sVTybJ3cNyo"
                  title="Intro to the XRP Ledger"
                  frameBorder={0}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a onClick={() => setVideoOne(!videoOne)} id="playvideo">
                  <img
                    alt="XRPL logo with play button surrounded with image bubbles of various people"
                    src={require("../static/img/overview/video_explainer_intro@2x.png")}
                    id="xrpl-overview-video-intro"
                    className="w-100 video-image"
                  />
                </a>
              )}
              <div className="text-center d-lg-none">
                <Link className="btn btn-primary btn-arrow mt-5 mb-4" to="docs">
                  {translate("Read Technical Docs")}
                </Link>{" "}
                <a
                  className="ml-4 video-external-link"
                  target="_blank"
                  href="https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi"
                >
                  {translate("Watch Explainer Videos")}
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="card-grid card-grid-2xN">
            <div className="col">
              <div className="d-flex flex-column-reverse">
                <h2 className="h4 h2-sm mb-8">
                  {translate("How the Consensus Protocol works")}
                </h2>
                <h6 className="eyebrow mb-3">{translate("Consensus")}</h6>
              </div>
              <h5 className="longform mb-10">
                {`${translate(
                  "about.index.consensus.h5part1",
                  "To uphold performance, XRPL uses a consensus protocol. Designated servers called "
                )}`}
                <Link to="/docs/infrastructure/configuration/server-modes/run-rippled-as-a-validator">{translate("about.index.consensus.h5part2", "validators")}</Link>
                {`${translate(
                  "about.index.consensus.h5part3",
                  ", which anyone can operate, come to an agreement on the order and outcome of XRP transactions every three to five seconds."
                )}`}
              </h5>

              <p className="mb-6">
                {translate(
                  "All servers in the network process each transaction according to the same rules, and any transaction that follows the protocol is confirmed right away. All transactions are public, and strong cryptography guarantees the integrity of the system."
                )}
              </p>
              <p className="mb-0">
                {translate('about.index.consensus.ppart1', 'Currently, over 120 ')}
                <a href="https://livenet.xrpl.org/network/validators" target="_blank">{translate('about.index.consensus.ppart2', 'validators')}</a>
                   {translate('about.index.consensus.ppart3', ' are active on the ledger, operated by universities, exchanges, businesses, and individuals. As the validator pool grows, the consensus protocol ensures decentralization of the blockchain over time.')}
              </p>
            </div>
            <div className="col mb-16-sm">
              <img
                className="mw-100"
                id="validator-graphic"
                alt="(Graphic: Validators in Consensus)"
              />
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-6-sm p-10-until-sm br-8 cta-card">
            <img
              alt="green waves"
              src={require("../static/img/backgrounds/cta-xrpl-overview-green.svg")}
              className="cta cta-bottom-right"
            />
            <div className="z-index-1 position-relative">
              <h2 className="h4 mb-10-until-sm mb-8-sm">
                {translate("A Sustainable Blockchain")}
              </h2>
              <p className="mb-10">
                {translate(
                  "Unlike most other blockchains, the XRP Ledger requires no mining and uses negligible energy, key to long-term growth and stability."
                )}
              </p>
              <a className="btn btn-primary btn-arrow" href="impact">
                {translate("Learn More")}
              </a>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="card-grid card-grid-2xN">
            <div className="col">
              <div className="d-flex flex-column-reverse">
                <h4 className="h4 h2-sm mb-8">
                  {translate("Building with confidence on ")}
                  <br className="until-sm" />
                  {translate("proven technology")}
                </h4>
                <h6 className="eyebrow mb-3">{translate("XRPL Today")}</h6>
              </div>
              <h5 className="longform mb-10">
                {translate(
                  "With 10+ years of error-free functioning and enterprise companies as champions, XRPL has established reliability."
                )}
              </h5>
              <p className="mb-10">
                {translate(
                  "With the XRPL, these developers are building innovative blockchain projects and applications across use cases including tokenization of assets, online gaming, asset custody, NFTs, and DeFi."
                )}
              </p>
              <a className="btn btn-primary btn-arrow mb-10-sm" href="uses">
                {translate("Explore More")}
              </a>
            </div>
            <div className="col mb-0">
              <div className="d-flex flex-column-reverse">
                <h4 className="h4 h2-sm mb-8">
                  {translate("Creating new value for long-term growth")}
                </h4>
                <h6 className="eyebrow mb-3">{translate("XRPL Tomorrow")}</h6>
              </div>
              <h5 className="longform mb-10">
                {translate(
                  "As a community-led blockchain built for business, XRPL attracts companies and developers driven to solve real problems and generate real value–now and into the future."
                )}
              </h5>
              <p className="mb-0">
                {translate(
                  "Significant investment in development, along with low transaction costs and energy usage, is fueling growth and opening up a wide variety of use cases at scale."
                )}
              </p>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse col-xl-6 mb-lg-4 pl-0 ">
            <h2 className="h4 h2-sm">
              {translate(
                "Watch the explainer video series to learn more about the XRP Ledger"
              )}
            </h2>
            <h6 className="eyebrow mb-3">{translate("Tune In")}</h6>
          </div>
          <div className="row row-cols-1 row-cols-lg-3 d-flex justify-content-between w-100 mx-0 mx-md-n3 mt-md-5">
            <div className="px-md-3 pt-5 pt-md-0">
              <a
                onClick={() =>
                  setCurrentVideoUrl(
                    "https://www.youtube.com/embed/k6VqEkqRTmk?rel=0&showinfo=0&autoplay=1"
                  )
                }
                className="btn1"
              >
                <img
                  alt="Two Monitors with person image bubbles inside, facing each other with a play button in between"
                  src={require("../static/img/overview/video_explainer_consensus@2x.png")}
                  id="xrpl-overview-video-consensus"
                  className="w-100 video-image"
                />
              </a>
              <div className="mt-2">
                <h4 className="video-title mt-3 mb-0">
                  {translate("The Consensus Mechanism")}
                </h4>
              </div>
            </div>
            <div className="px-md-3 pt-5 pt-md-0">
              <a
                onClick={() =>
                  setCurrentVideoUrl(
                    "https://www.youtube.com/embed/JjaVDXPqnbA?rel=0&showinfo=0&autoplay=1"
                  )
                }
                className="btn1"
              >
                <img
                  alt="graphlike background with play button in center"
                  src={require("../static/img/overview/video_explainer_nodes@2x.png")}
                  id="xrpl-overview-video-nodes"
                  className="w-100 video-image"
                />
              </a>
              <div className="mt-2">
                <h4 className="video-title mt-3 mb-0">
                  {translate("Nodes and Validators")}
                </h4>
              </div>
            </div>
            <div className="px-md-3 pt-5 pt-md-0">
              <a
                onClick={() =>
                  setCurrentVideoUrl(
                    "https://www.youtube.com/embed/WsmldDNGQ9s?rel=0&showinfo=0&autoplay=1"
                  )
                }
                className="btn1"
              >
                <img
                  alt="A globe graph with a play button in center"
                  src={require("../static/img/overview/video_explainer_sustainability@2x.png")}
                  id="xrpl-overview-video-sustainability"
                  className="w-100 video-image"
                />
              </a>
              <div className="mt-2">
                <h4 className="video-title mt-3 mb-0">
                  {translate("Sustainability of the XRP Ledger")}
                </h4>
              </div>
            </div>
          </div>
          <div className="pt-5 w-100">
            <a
              className="btn btn-primary btn-arrow"
              target="_blank"
              href="https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg"
            >
              {translate("Watch Full Series on YouTube")}
            </a>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-6-sm p-10-until-sm br-8 cta-card">
            <img
              alt="orange waves"
              src={require("../static/img/backgrounds/cta-xrpl-overview-orange.svg")}
              className="cta cta-bottom-right"
            />
            <div className="z-index-1 position-relative">
              <h4 className="h4 mb-10-until-sm mb-8-sm">
                {translate("Tomorrow’s Blockchain Starts With You")}
              </h4>
              <p className="mb-10">
                {`${translate(
                  "about.index.tomorrow.ppart1",
                  "XRP Ledger’s innovation relies on the shared community experience of builders like you. If you’re ready to start your next big blockchain project, explore the XRPL now and consider applying for funding on your next"
                )}`}
                <Link to="/community/developer-funding">
                  {translate("about.index.tomorrow.ppart2", " blockchain project")}
                </Link>
                {translate("about.index.tomorrow.ppart3", ".")}
              </p>

              <a
                className="btn btn-primary btn-arrow"
                href="https://xrplgrants.org/"
                target="_blank"
              >
                {translate("Explore XRPL Developer Funding")}
              </a>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div
            className="col-md-6 offset-md-3 w-100 pl-0 pr-0 mini-faq"
            id="minifaq-accordion"
          >
            {faqs.map((faq, index) => (
              <div className="q-wrapper" key={index}>
                <a
                  href={`#heading${index + 1}`}
                  className="expander collapsed"
                  data-toggle="collapse"
                  data-target={`#answer${index + 1}`}
                  aria-expanded="false"
                  aria-controls={`answer${index + 1}`}
                >
                  <h4 id={`heading${index + 1}`}>
                    {translate(faq.question)}
                    <span className="chevron">
                      <span />
                      <span />
                    </span>
                  </h4>
                </a>
                <div
                  id={`answer${index + 1}`}
                  className="answer-wrapper collapse"
                  aria-labelledby={`heading${index + 1}`}
                >
                  <p dangerouslySetInnerHTML={{ __html: translate(faq.answer) }} />
                </div>
              </div>
            ))}
            <center>
              <a className="btn btn-primary btn-arrow mt-20" href="faq">
                {translate("View Full FAQ")}
              </a>
            </center>
          </div>
        </section>
      </div>
    </div>
  );
}

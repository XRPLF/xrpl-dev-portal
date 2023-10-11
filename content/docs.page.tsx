import * as React from 'react';
import { useTranslate } from '@portal/hooks';

const recommendedPages = [
      {
        "description": "rippled API Reference",
        "link": "./manage-the-rippled-server.html",
      },
      {
        "description": "XRP Faucet",
        "link": "./xrp-testnet-faucet.html",
      },
      {
        "description": "Getting Started with Python",
        "link": "./get-started-using-python.html#get-started-using-python",
      },
      {
        "description": "Websocket API Tool",
        "link": "./websocket-api-tool.html",
      },
      { "description": "XRP Ledger Explorer", "link": "https://livenet.xrpl.org" },
  ] ;

const useCases = [
    {
      "title": "On-Chain Finance",
      "id": "on-chain-finance-use-cases",
      "imgClass": "wallet-illustration",
      "subItems": [
        {
          "description": "Trade on the decentralized exchange",
          "link": "./trade-in-the-decentralized-exchange.html",
        },
        {
          "description": "Make payments",
          "link": "./send-xrp.html",
        },
        {
          "description": "Use specialized payment types",
          "link": "./use-specialized-payment-types.html"
        }
      ],
    },
    {
      "title": "Tokens",
      "id": "token-use-cases",
      "imgClass": "token-illustration",
      "subItems": [
        {
          "description": "Non-fungible Tokens",
          "link": "./non-fungible-tokens.html",
        },
        {
          "description": "Issue a stablecoin",
          "link": "./issue-a-fungible-token.html",
        },
        {
          "description": "Assign an authorized minter",
          "link": "./assign-an-authorized-minter-using-javascript.html",
        },
      ],
    },
    {
      "title": "Payments",
      "id": "payments-use-cases",
      "imgClass": "connections-illustration",
      "subItems": [
        {
          "description": "Peer to peer payments",
          "link": "./direct-xrp-payments.html",
        },
        {
          "description": "Cross-currency payments",
          "link": "./cross-currency-payments.html",
        },
        {
          "description": "Escrows",
          "link": "./escrow.html",
        },
      ],
    },
  ]
  ;

const test = "./assets/img/backgrounds/docs-intro-to-XRP-ledger@2x.png";

const target= {prefix: ''}; // TODO: fixme

export default function Docs() {
  const { translate } = useTranslate();

  return (
    <div className="landing page-docs page-docs-index landing-builtin-bg overflow-hidden styled-page">
      <div>
    <section className="text-center title-space">
        <div className="col-lg-9 mx-auto text-center">
            <div className="d-flex flex-column-reverse">
                <h1 className>{translate("XRP Ledger Developer Resources")}</h1>
                <h6 className="eyebrow mb-3">{translate("Documentation")}</h6>
            </div>
        </div>
    </section>
    {'{'}# Macros #{'}'}
    $$ macro primaryButton(href, text, isArrowUp) $$
    $$ if isArrowUp $$
    <a className="btn btn-primary btn-arrow-out" id="$$href$$-button" href="$$href$$">$$ text $$</a>
    $$ else $$
    <a className="btn btn-primary btn-arrow" id="$$href$$-button" href="$$href$$">$$ text $$</a>
    $$ endif $$
    $$ endmacro $$
    $$ macro flatCard(href, title, description, linkText, imgClass) $$
    <a href="$$href$$" className="card flat-card float-up-on-hover">
        <img className="mb-2 $$imgClass$$" alt="$$title$$" />
        <h5 className="row">
            <div className="nav-link">$$ title $$</div>
        </h5>
        <p className="row faded-text flat-card-padding">
            $$ description $$
        </p>
        <div className="col align-button-on-bottom">
            <div className="btn btn-primary btn-arrow" id="$$href$$-button">$$ linkText $$</div>
        </div>
    </a>
    $$ endmacro $$
    $$ macro videoCard(url, title, src)$$
    <div className="col float-up-on-hover">
        <a href="$$url$$" id="playvideo" className="btn1" data-url="$$url$$">
            <img alt="$$title$$" className="get-started-img video-image" id="$$title$$" src={require("$$src$$")} />
            <h6 className="pt-3">$$ title $$</h6>
        </a>
    </div>
    $$ endmacro $$
    $$ macro useCasesCard(subItems, title, imgClass, id) $$
    <div className="col">
        <img className="use-cases-img img-fluid mb-2 shadow $$imgClass$$" alt="$$title$$" id="$$id$$" />
        <h5 className="mt-4">$$title$$ </h5>
        <ul className="nav flex-column">
             { subItems.map(item => (
            <li className="nav-item"><a href={item.link} className="nav-link">{item.description}</a>
                )) }
            </li></ul>
    </div>
    $$ endmacro $$
    $$ macro devToolsCard(link, title, description) $$
    <a href="$$ link $$" className="col dev-tools-link">
        <h6 className="btn-arrow">$$ title $$</h6>
        <p> $$ description $$</p>
    </a>
    $$ endmacro $$
    $$
    set intermediateVideos = [
    {'{'}
    "src": "./assets/img/backgrounds/docs-advanced-payment-features@2x.png",
    "title": _("Advanced Payment Features"),
    "url": "https://www.youtube.com/embed/e2Iwsk37LMk?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    {'{'}
    "src": "./assets/img/backgrounds/docs-governance@2x.png",
    "title": _("Governance and the Amendment Process"),
    "url": "https://www.youtube.com/embed/4GbRdanHoR4?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    {'{'}
    "src": "./assets/img/backgrounds/docs-sidechains@2x.png",
    "title": _("Federated Sidechains"),
    "url": "https://www.youtube.com/embed/NhH4LM8NxgY?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    ]
    $$
    $$
    set getStartedVideos = [
    {'{'}
    "src": "./assets/img/backgrounds/docs-intro-to-XRP-ledger@2x.png",
    "title": _("Intro to XRP Ledger"),
    "url": "https://www.youtube.com/embed/sVTybJ3cNyo?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    {'{'}
    "src": "./assets/img/backgrounds/docs-accounts@2x.png",
    "title": _("Accounts"),
    "url": "https://www.youtube.com/embed/eO8jE6PftX8?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    {'{'}
    "src": "./assets/img/backgrounds/docs-decentralized-exchange@2x.png",
    "title": _("Decentralized Exchange"),
    "url": "https://www.youtube.com/embed/VWNrHBDfXvA?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    {'{'}
    "src": "./assets/img/backgrounds/docs-tokenization@2x.png",
    "title": _("Tokenization"),
    "url": "https://www.youtube.com/embed/Oj4cWOiWf4A?rel=0&amp;showinfo=0&amp;autoplay=1",
    {'}'},
    ]
    $$
    $$
    set devTools = [
    {'{'}
    "title": _("Faucets"),
    "link": "./xrp-testnet-faucet.html",
    "description":
    _("Get credentials and test-XRP for XRP Ledger Testnet or Devnet."),
    {'}'},
    {'{'}
    "title": _("WebSocket Tool"),
    "link": "./websocket-api-tool.html",
    "description":
    _("Send sample requests and get responses from the rippled API."),
    {'}'},
    {'{'}
    "title": _("XRP Ledger Explorer"),
    "link": "https://livenet.xrpl.org",
    "description":
    _("View validations of new ledger versions in real-time, chart the location of servers in the XRP Ledger."),
    {'}'},
    {'{'}
    "title": _("Transaction Sender"),
    "link": "./tx-sender.html",
    "description":
    _("Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address."),
    {'}'},
    ]
    $$
    <section className="container-new ">
        <div className="nav card-grid flat-card-grid card-grid-3xN">
            <div className="col">
                $$ flatCard("./concepts.html", 
                _("Concepts"), 
                _("Learn the \"what\" and the \"why\" behind fundamental aspects of the XRP Ledger."), 
                _("Read the Docs"),
                "concepts-doc-illustration") $$
            </div>
            <div className="col">
                $$ flatCard("./tutorials.html", 
                _("Tutorials"), 
                _("Get step-by-step guidance to perform common tasks with the XRP Ledger."), 
                _("View Tutorials"),
                "tutorial-illustration") $$
            </div>
            <div className="col">
                $$ flatCard("./references.html", 
                _("References"), 
                _("Look up reference documentation for the XRP Ledger protocol, API methods, and more."), 
                _("View References"),
                "ref-book-illustration") $$
            </div>
        </div>
    </section>
    <section className="container-new">
        <h4 className="pb-4">{translate("Use Cases")}</h4>
        <div className="card-grid card-grid-3xN use-cases">
             { useCases.map(useCase => (
            $$ useCasesCard(useCase.subItems, useCase.title, useCase.imgClass, useCase.id)$$
            )) }
        </div>
    </section>
    <section className="container-new ">
        <h4 className="pb-4">{translate("Getting Started")}</h4>
        <div className="card-grid card-grid-2xN quickstart-card">
            <div className="col">
                <a href="./send-payments-using-javascript.html" className="card float-up-on-hover">
                    <h5 className="mt-7">{translate("Quickstart to XRP Ledger")}</h5>
                    <p className="mb-8 mt-4">
                        {translate("An introduction to fundamental aspects of the XRP Ledger.")}
                    </p>
                    <div className="dg-lg-block mb-3">
                        <div className="btn btn-primary btn-arrow get-started-button">
                            {translate("Get Started")}
                        </div>
                    </div>
                    <img alt="quick-start" id="quick-start-img" className="quickstart-image" />
                </a>
            </div>
            <div className="col">
                <div className="card-grid card-grid-2xN video-grid">
                     { getStartedVideos.map(video => (
                    $$ videoCard(video.url, video.title, video.src) $$
                    )) }
                </div>
                <div className="align-button-on-bottom">
                    $$ primaryButton("https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi", _("Watch Full Series"), true) $$
                </div>
            </div>
        </div>
    </section>
    <section className="container-new ">
        <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">{translate("Interact with the XRP Ledger in a language of your choice")}</h3>
            <h6 className="eyebrow mb-3">{translate("Explore SDKs")}</h6>
        </div>
        <div className="card-grid card-grid-2xN">
            <div className="col">
                <div className="card-grid langs-cards card-grid-2xN mt-10" id="langs-cards">
                    <div className="col langs">
                        <a href="./get-started-using-javascript.html">
                            <img alt="Javascript Logo" src={require("./assets/img/logos/javascript.svg")} className="circled-logo" />
                            <h5 className="btn-arrow">{translate("Javascript")}</h5>
                        </a>
                    </div>
                    <div className="col langs">
                        <a href="./get-started-using-python.html">
                            <img alt="Python Logo" src={require("./assets/img/logos/python.svg")} className="circled-logo" />
                            <h5 className="btn-arrow">{translate("Python")}</h5>
                        </a>
                    </div>
                    <div className="col langs">
                        <a href="./get-started-using-java.html">
                            <img alt="Java Logo" src={require("./assets/img/logos/java.svg")} className="circled-logo" />
                            <h5 className="btn-arrow">{translate("Java")}</h5>
                        </a>
                    </div>
                </div>
            </div>
            <div className="col center-image">
                <img className="img-fluid sdk-img" />
            </div>
        </div>
    </section>
    <section className="container-new ">
        <h4 className="pb-4">{translate("Intermediate Learning Sources")}</h4>
        <div className="card-grid card-grid-3xN">
             { intermediateVideos.map(video => (
            $$ videoCard(video.url, video.title, video.src) $$
            )) }
        </div>
    </section>
    <section className="container-new ">
        <div className="card-grid card-grid-2xN">
            <div className="col d-flex align-items-center justify-content-center">
                <img className="dev-tools-img" />
            </div>
            <div className="col explore-links">
                <div className="d-flex flex-column-reverse w-100">
                    <h4 className="mb-10">{translate("Explore, Test, Verify")}</h4>
                    <h6 className="mb-3">{translate("Explore Dev Tools")}</h6>
                </div>
                <p className="mb-20">
                    {translate("Use these web-based tools to assist during all stages of development, from getting your first payment to testing your implementation for best practices.")}
                </p>
                <div className="card-grid card-grid-2xN">
                     { devTools.map(card => (
                    $$ devToolsCard(card.link, card.title, card.description) $$
                    )) }
                </div>
                $$ primaryButton("./dev-tools.html", "View All tools", false) $$
            </div>
        </div>
    </section>
    <section className="container-new " id="docs-browse-by">
        <div className="row card-grid card-grid-2xN">
            <div className="col" id="popular-topics">
                <h2 className="h4">{translate("Browse By Recommended Pages")}</h2>
                <ul className="nav flex-column">
                     { recommendedPages.map(page => (
                    <li className="nav-item"><a href={page.link} className="nav-link">{page.description}</a>
                        )) }
                    </li></ul>
            </div>{/*/#popular-topics*/}
            <div className="col">
                <div className="card cta-card p-8-sm p-10-until-sm br-8">
                    <img src={require("./img/backgrounds/cta-home-purple.svg")} className="d-none-sm cta cta-top-left" />
                    <img src={require("./img/backgrounds/cta-home-green.svg")} className="cta cta-bottom-right" />
                    <div className="z-index-1 position-relative">
                        <h2 className="h4 mb-8-sm mb-10-until-sm">{translate("Get Free Test XRP")}</h2>
                        <p className="mb-10">{translate("Connect to the XRP Ledger Testnet network to develop and test your apps built on the XRP Ledger, without risking real money or impacting production XRP Ledger users.")}</p>
                        <a className="btn btn-primary btn-arrow" href="xrp-testnet-faucet.html">{translate("Generate Testnet Credentials")}</a>
                    </div>
                </div>
            </div>
        </div>
    </section>{/* Browse by recommended and Generate Testnet Credentials */}
    <section className="container-new">
        <a href="./docs-index.html" className="btn-arrow arrow-purple documentation-index mr-auto">{translate("See full documentation index")}</a>
    </section>
</div>

    </div>
  )
}

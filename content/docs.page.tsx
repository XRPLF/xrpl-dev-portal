import * as React from 'react';
import { useTranslate } from '@portal/hooks';

const recommendedPages = [
  {
    description: 'rippled API Reference',
    link: './manage-the-rippled-server.html',
  },
  {
    description: 'XRP Faucet',
    link: '../dev-tools/xrp-faucets',
  },
  {
    description: 'Getting Started with Python',
    link: './get-started-using-python.html#get-started-using-python',
  },
  {
    description: 'Websocket API Tool',
    link: './websocket-api-tool.html',
  },
  { description: 'XRP Ledger Explorer', link: 'https://livenet.xrpl.org' },
];

const useCases = [
  {
    title: 'On-Chain Finance',
    id: 'on-chain-finance-use-cases',
    imgClass: 'wallet-illustration',
    subItems: [
      {
        description: 'Trade on the decentralized exchange',
        link: './trade-in-the-decentralized-exchange.html',
      },
      {
        description: 'Make payments',
        link: './send-xrp.html',
      },
      {
        description: 'Use specialized payment types',
        link: './use-specialized-payment-types.html',
      },
    ],
  },
  {
    title: 'Tokens',
    id: 'token-use-cases',
    imgClass: 'token-illustration',
    subItems: [
      {
        description: 'Non-fungible Tokens',
        link: './non-fungible-tokens.html',
      },
      {
        description: 'Issue a stablecoin',
        link: './issue-a-fungible-token.html',
      },
      {
        description: 'Assign an authorized minter',
        link: './assign-an-authorized-minter-using-javascript.html',
      },
    ],
  },
  {
    title: 'Payments',
    id: 'payments-use-cases',
    imgClass: 'connections-illustration',
    subItems: [
      {
        description: 'Peer to peer payments',
        link: './direct-xrp-payments.html',
      },
      {
        description: 'Cross-currency payments',
        link: './cross-currency-payments.html',
      },
      {
        description: 'Escrows',
        link: './escrow.html',
      },
    ],
  },
];
const intermediateVideos = [
  {
    src: require('./static/img/backgrounds/docs-advanced-payment-features@2x.png'),
    title: 'Advanced Payment Features',
    url: 'https://www.youtube.com/embed/e2Iwsk37LMk?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
  {
    src: require('./static/img/backgrounds/docs-governance@2x.png'),
    title: 'Governance and the Amendment Process',
    url: 'https://www.youtube.com/embed/4GbRdanHoR4?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
  {
    src: require('./static/img/backgrounds/docs-sidechains@2x.png'),
    title: 'Federated Sidechains',
    url: 'https://www.youtube.com/embed/NhH4LM8NxgY?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
];
const getStartedVideos = [
  {
    src: require('./static/img/backgrounds/docs-intro-to-XRP-ledger@2x.png'),
    title: 'Intro to XRP Ledger',
    url: 'https://www.youtube.com/embed/sVTybJ3cNyo?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
  {
    src: require('./static/img/backgrounds/docs-accounts@2x.png'),
    title: 'Accounts',
    url: 'https://www.youtube.com/embed/eO8jE6PftX8?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
  {
    src: require('./static/img/backgrounds/docs-decentralized-exchange@2x.png'),
    title: 'Decentralized Exchange',
    url: 'https://www.youtube.com/embed/VWNrHBDfXvA?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
  {
    src: require('./static/img/backgrounds/docs-tokenization@2x.png'),
    title: 'Tokenization',
    url: 'https://www.youtube.com/embed/Oj4cWOiWf4A?rel=0&amp;showinfo=0&amp;autoplay=1',
  },
];

const devTools = [
  {
    title: 'Faucets',
    link: '../dev-tools/xrp-faucets',
    description: 'Get credentials and test-XRP for XRP Ledger Testnet or Devnet.',
  },
  {
    title: 'WebSocket Tool',
    link: './websocket-api-tool.html',
    description: 'Send sample requests and get responses from the rippled API.',
  },
  {
    title: 'XRP Ledger Explorer',
    link: 'https://livenet.xrpl.org',
    description:
      'View validations of new ledger versions in real-time, chart the location of servers in the XRP Ledger.',
  },
  {
    title: 'Transaction Sender',
    link: './tx-sender.html',
    description:
      'Test how your code handles various XRP Ledger transactions by sending them over the Testnet to the address.',
  },
];
const test = './assets/img/backgrounds/docs-intro-to-XRP-ledger@2x.png';

const target = { prefix: '' }; // TODO: fixme

function UseCasesCard(props: {
  useCase: {
    id: string;
    title: string;
    imgClass: string;
    subItems: { description: string; link: string }[];
  };
}) {
  const { useCase } = props;
  return (
    <div className="col">
      <img className={'use-cases-img img-fluid mb-2 shadow ' + useCase.imgClass} alt={useCase.title} id={useCase.id} />
      <h5 className="mt-4">{useCase.title}</h5>
      <ul className="nav flex-column">
        {useCase.subItems.map(item => (
          <li key={item.link} className="nav-item">
            <a href={item.link} className="nav-link">
              {item.description}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlatCard(props: { href: string; title: string; description: string; linkText: string; imgClass }) {
  const { title, description, linkText, href, imgClass } = props;
  return (
    <a href={href} className="card flat-card float-up-on-hover">
      <img className={'mb-2 ' + imgClass} alt={title} />
      <h5 className="row">
        <div className="nav-link">{title}</div>
      </h5>
      <p className="row faded-text flat-card-padding">{description}</p>
      <div className="col align-button-on-bottom">
        <div className="btn btn-primary btn-arrow" id={href + '-button'}>
          {linkText}
        </div>
      </div>
    </a>
  );
}

function VideoCard(props: { url: string; title: string; src: string }) {
  const { url, title, src } = props;
  return (
    <div className="col float-up-on-hover">
      <a href={url} id="playvideo" className="btn1" data-url={url}>
        <img alt={title} className="get-started-img video-image" id={title} src={src} />
        <h6 className="pt-3">{title}</h6>
      </a>
    </div>
  );
}

function DevToolCard(props: { link: string; title: string; description: string }) {
  const { translate } = useTranslate();
  const { link, title, description } = props;
  return (
    <a href={link} className="col dev-tools-link">
      <h6 className="btn-arrow">{translate(title)}</h6>
      <p> {translate(description)}</p>
    </a>
  );
}

function PrimaryButton(props: { href: string; text: string; isArrowUp: boolean }) {
  const { href, text, isArrowUp } = props;
  return (
    <a className={`btn btn-primary ${isArrowUp ? 'btn-arrow-out' : 'btn-arrow'}`} id={href + '-button'} href="{href}">
      {text}
    </a>
  );
}

export default function Docs() {
  const { translate } = useTranslate();

  return (
    <div className="landing page-docs page-docs-index landing-builtin-bg overflow-hidden styled-page">
      <div>
        <section className="text-center title-space">
          <div className="col-lg-9 mx-auto text-center">
            <div className="d-flex flex-column-reverse">
              <h1>{translate('XRP Ledger Developer Resources')}</h1>
              <h6 className="eyebrow mb-3">{translate('Documentation')}</h6>
            </div>
          </div>
        </section>

        <section className="container-new ">
          <div className="nav card-grid flat-card-grid card-grid-3xN">
            <div className="col">
              <FlatCard
                href="./concepts.html"
                title={translate('Concepts')}
                description={translate('Learn the "what" and the "why" behind fundamental aspects of the XRP Ledger.')}
                linkText={translate('Read the Docs')}
                imgClass="concepts-doc-illustration"
              />
            </div>
            <div className="col">
              <FlatCard
                href="./tutorials.html"
                title={translate('Tutorials')}
                description={translate('Get step-by-step guidance to perform common tasks with the XRP Ledger.')}
                linkText={translate('View Tutorials')}
                imgClass="tutorial-illustration"
              />
            </div>
            <div className="col">
              <FlatCard
                href="./references.html"
                title={translate('References')}
                description={translate(
                  'Look up reference documentation for the XRP Ledger protocol, API methods, and more.'
                )}
                linkText={translate('View References')}
                imgClass="ref-book-illustration"
              />
            </div>
          </div>
        </section>
        <section className="container-new">
          <h4 className="pb-4">{translate('Use Cases')}</h4>
          <div className="card-grid card-grid-3xN use-cases">
            {useCases.map(useCase => (
              <UseCasesCard useCase={useCase} />
            ))}
          </div>
        </section>
        <section className="container-new ">
          <h4 className="pb-4">{translate('Getting Started')}</h4>
          <div className="card-grid card-grid-2xN quickstart-card">
            <div className="col">
              <a href="./send-payments-using-javascript.html" className="card float-up-on-hover">
                <h5 className="mt-7">{translate('Quickstart to XRP Ledger')}</h5>
                <p className="mb-8 mt-4">{translate('An introduction to fundamental aspects of the XRP Ledger.')}</p>
                <div className="dg-lg-block mb-3">
                  <div className="btn btn-primary btn-arrow get-started-button">{translate('Get Started')}</div>
                </div>
                <img alt="quick-start" id="quick-start-img" className="quickstart-image" />
              </a>
            </div>
            <div className="col">
              <div className="card-grid card-grid-2xN video-grid">
                {getStartedVideos.map(video => (
                  <VideoCard url={video.url} title={translate(video.title)} src={video.src} />
                ))}
              </div>
              <div className="align-button-on-bottom">
                <PrimaryButton
                  href="https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZtJ_JdTvSum2qMTsedWkNi"
                  text={translate('Watch Full Series')}
                  isArrowUp={true}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="container-new ">
          <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">{translate('Interact with the XRP Ledger in a language of your choice')}</h3>
            <h6 className="eyebrow mb-3">{translate('Explore SDKs')}</h6>
          </div>
          <div className="card-grid card-grid-2xN">
            <div className="col">
              <div className="card-grid langs-cards card-grid-2xN mt-10" id="langs-cards">
                <div className="col langs">
                  <a href="./get-started-using-javascript.html">
                    <img
                      alt="Javascript Logo"
                      src={require('./static/img/logos/javascript.svg')}
                      className="circled-logo"
                    />
                    <h5 className="btn-arrow">{translate('Javascript')}</h5>
                  </a>
                </div>
                <div className="col langs">
                  <a href="./get-started-using-python.html">
                    <img alt="Python Logo" src={require('./static/img/logos/python.svg')} className="circled-logo" />
                    <h5 className="btn-arrow">{translate('Python')}</h5>
                  </a>
                </div>
                <div className="col langs">
                  <a href="./get-started-using-java.html">
                    <img alt="Java Logo" src={require('./static/img/logos/java.svg')} className="circled-logo" />
                    <h5 className="btn-arrow">{translate('Java')}</h5>
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
          <h4 className="pb-4">{translate('Intermediate Learning Sources')}</h4>
          <div className="card-grid card-grid-3xN">
            {intermediateVideos.map(video => (
              <VideoCard url={video.url} title={translate(video.title)} src={video.src} />
            ))}
          </div>
        </section>
        <section className="container-new ">
          <div className="card-grid card-grid-2xN">
            <div className="col d-flex align-items-center justify-content-center">
              <img className="dev-tools-img" />
            </div>
            <div className="col explore-links">
              <div className="d-flex flex-column-reverse w-100">
                <h4 className="mb-10">{translate('Explore, Test, Verify')}</h4>
                <h6 className="mb-3">{translate('Explore Dev Tools')}</h6>
              </div>
              <p className="mb-20">
                {translate(
                  'Use these web-based tools to assist during all stages of development, from getting your first payment to testing your implementation for best practices.'
                )}
              </p>
              <div className="card-grid card-grid-2xN">
                {devTools.map(card => (
                  <DevToolCard
                    link={card.link}
                    title={translate(card.title)}
                    description={translate(card.description)}
                  />
                ))}
              </div>
              <PrimaryButton href="./dev-tools.html" text={translate('View All tools')} isArrowUp={false} />
            </div>
          </div>
        </section>
        <section className="container-new " id="docs-browse-by">
          <div className="row card-grid card-grid-2xN">
            <div className="col" id="popular-topics">
              <h2 className="h4">{translate('Browse By Recommended Pages')}</h2>
              <ul className="nav flex-column">
                {recommendedPages.map(page => (
                  <li className="nav-item">
                    <a href={page.link} className="nav-link">
                      {translate(page.description)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col">
              <div className="card cta-card p-8-sm p-10-until-sm br-8">
                <img src={require('./static/img/backgrounds/cta-home-purple.svg')} className="d-none-sm cta cta-top-left" />
                <img src={require('./static/img/backgrounds/cta-home-green.svg')} className="cta cta-bottom-right" />
                <div className="z-index-1 position-relative">
                  <h2 className="h4 mb-8-sm mb-10-until-sm">{translate('Get Free Test XRP')}</h2>
                  <p className="mb-10">
                    {translate(
                      'Connect to the XRP Ledger Testnet network to develop and test your apps built on the XRP Ledger, without risking real money or impacting production XRP Ledger users.'
                    )}
                  </p>
                  <a className="btn btn-primary btn-arrow" href="../dev-tools/xrp-faucets">
                    {translate('Generate Testnet Credentials')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-new">
          <a href="./docs-index.html" className="btn-arrow arrow-purple documentation-index mr-auto">
            {translate('See full documentation index')}
          </a>
        </section>
      </div>
    </div>
  );
}

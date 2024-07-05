import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from '@redocly/theme/components/Link/Link';

export const frontmatter = {
  seo: {
    title: 'XRP Ledger Home | XRPL.org',
    description: "XRPL.org is a community-driven site for the XRP Ledger (XRPL), an open-source, public blockchain. Gain access to technical documentation, reference materials, and blockchain ledger tools.",
  }
};

const cards = [
  {
    id: 'public',
    title: 'Public and Decentralized',
    description: 'Open source, open to anyone to build on, maintained by the community',
  },
  {
    id: 'streamlined',
    title: 'Streamlined Development',
    description: 'Intentional innovations, tools and documentation reduce time to market',
  },
  { id: 'performance', title: 'High Performance', description: 'Thousands of transactions settled in seconds' },
  {
    id: 'low-cost',
    title: 'Low Cost',
    description: <>
      At fractions of a penny per transaction, costs are inexpensive enough to enable a wide variety of <a href='/about/uses'>blockchain use cases</a>
    </>
  },
  {
    id: 'community',
    title: 'Motivated Community',
    description: 'Companies, developers, validators, and users work together to make the XRP Ledger better every day',
  },
  {
    id: 'reliability',
    title: 'Proven Reliability',
    description: '10+ years of error-free, uninterrupted performance over more than 63 million ledgers',
  },
];

const cards2 = [
  {
    href: '/docs/concepts/tokens/decentralized-exchange/',
    title: 'Decentralized Exchange',
    description:
      'A high-performance decentralized peer-to-peer multi-currency exchange built directly into the blockchain',
  },
  {
    href: '/docs/concepts/payment-types/cross-currency-payments/',
    title: 'Cross-Currency Payments',
    description: 'Atomically settle multi-hop payments that cross currency or national boundaries with ease',
  },
  {
    href: '/docs/concepts/payment-types/payment-channels/',
    title: "Payment Channels",
    description: 'Batched micropayments with unlimited speed, secured with XRP',
  },
  {
    href: '/docs/concepts/accounts/multi-signing/',
    title: 'Multi-Signing',
    description: 'Flexible options for custody and security of on-ledger accounts',
  },
  {
    href: '/docs/concepts/tokens/',
    title: 'Tokens',
    description:
      'All currencies other than XRP can be represented in the XRP Ledger as tokens',
  },
];

const cards3 = [
  {
    href: '/docs/',
    title: 'Documentation',
    description: 'Access everything you need to get started working with the XRPL',
  },
  { href: '/docs/tutorials', title: 'Guided Tutorials', description: 'Follow step-by-step guides for frequent tasks' },
  { href: '/docs/concepts', title: 'XRPL Fundamentals', description: 'Read about the XRPL’s foundational concepts' },
  {
    href: '/docs/references/client-libraries/',
    title: 'Choose a Language',
    description: 'Find tools, documentation, and sample code in Python, Java, Javascript, or use HTTP APIs',
  },
  { href: '/about/uses', title: 'Get Inspired', description: 'See what your peers have built on the XRPL' },
];

const features = [
  {
    chip: 'In Development',
    title: 'Smart Contracts',
    description:
    <>
      Hooks are small, efficient WebAssembly modules designed specifically for the XRPL. Check out the <a href='https://hooks-testnet.xrpl-labs.com/' target='_blank'>hooks amendment and public testnet</a> that enable smart contract functionality.
    </>,
    href: 'https://hooks-testnet.xrpl-labs.com/',
  },
  {
    chip: 'Enabled',
    title: 'Automated Market Makers',
    description: "Smart contracts to provide liquidity and earn passive income from facilitating currency exchange, complementary with the order-book DEX already built into the XRPL.",
    href: '/docs/concepts/tokens/decentralized-exchange/automated-market-makers/',
  },
];

export default function Index() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing page-home">
      <div className="overflow-hidden">
        <section className="container-new pb-26-until-sm mt-10 mb-10-sm text-center">
          <div className="w-100">
            <img id="home-hero-graphic" alt="(stylized X graphic surrounded by a diverse mix of people)" width="856" height="469" />
          </div>
          <div className="col-lg-6 mx-auto text-center pl-0 pr-0">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-10">
                {translate('home.hero.h1part1', 'The Blockchain')}
                <br className="until-sm" />
                {translate('home.hero.h1part2', 'Built for Business')}
              </h1>
              <h6 className="eyebrow mb-3">{translate('XRPL | XRP Ledger')}</h6>
            </div>
            <Link to="/docs" className="btn btn-primary btn-arrow">
              {translate('Start Building')}
            </Link>
          </div>
        </section>
        <div className="position-relative d-none-sm">
          <img src={require('./static/img/backgrounds/home-purple.svg')} id="home-purple" />
          <img src={require('./static/img/backgrounds/home-green.svg')} id="home-green" />
        </div>
        <section className="container-new py-26">
          <div className="col-lg-6 offset-lg-3 pl-0-sm pr-0-sm p-8-sm p-10-until-sm">
            <h2 className="h4 mb-8 h2-sm">{translate('The XRP Ledger: The Blockchain Built for Business')}</h2>
            <h6 className="longform mb-10">
              {translate(
                'The XRP Ledger (XRPL) is a decentralized, public blockchain led by a global community of businesses and developers looking to solve problems and create value.'
              )}
            </h6>
            <p className="mb-0">
              {translate(
                'Proven reliable over more than a decade of error-free functioning, the XRPL offers streamlined development, low transaction costs, high performance, and sustainability. So you can build with confidence–and move your most critical projects forward.'
              )}
            </p>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">{translate('Why developers choose the XRP Ledger')}</h3>
            <h6 className="eyebrow mb-3">{translate('Benefits')}</h6>
          </div>
          <ul className="mt-10 card-grid card-grid-3xN" id="benefits-list">
            {cards.map(card => (
              <li className="col ls-none" key={card.id}>
                <img id={card.id} alt={card.title + ' Icon'} />
                <h4 className="mt-3 mb-0 h5">{translate(card.title)}</h4>
                <p className="mt-6-until-sm mt-3 mb-0">
                  {typeof card.description === 'string' ? translate(card.description) : card.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">
              {translate(
                'Activate the proven potential of the XRP Ledger and find a trusted foundation for your next innovation'
              )}
            </h3>
            <h6 className="eyebrow mb-3">{translate('Powerful Features')}</h6>
          </div>
          <div className="row row-cols-1 row-cols-lg-3 card-deck mt-10" id="advanced-features">
            {cards2.map((card, idx) => (
              <Link className="card" to={card.href} key={card.href + idx}>
                <div className="card-body">
                  <h4 className="card-title h5">{translate(card.title)}</h4>
                  <p className="card-text">{translate(card.description)}</p>
                </div>
                <div className="card-footer">&nbsp;</div>
              </Link>
            ))}
          </div>
        </section>
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">{translate('Choose a path, and bring your project to life on the XRP Ledger')}</h3>
            <h6 className="eyebrow mb-3">{translate('Where to Start')}</h6>
          </div>
          <div className="row row-cols-1 row-cols-lg-3 card-deck mt-10" id="get-started">
            {cards3.map((card, idx) => (
              <Link className="card" to={card.href} key={card.href + idx}>
                <div className="card-body">
                  <h4 className="card-title h5">{translate(card.title)}</h4>
                  <p className="card-text">{translate(card.description)}</p>
                </div>
                <div className="card-footer">&nbsp;</div>
              </Link>
            ))}
          </div>
        </section>
        <section className="container-new py-26">
          <div className="col-lg-6 offset-lg-3 p-6-sm p-10-until-sm br-8 cta-card">
            <img src={require('./static/img/backgrounds/cta-home-purple.svg')} className="d-none-sm cta cta-top-left" />
            <img src={require('./static/img/backgrounds/cta-home-green.svg')} className="cta cta-bottom-right" />
            <div className="z-index-1 position-relative">
              <h2 className="h4 mb-8-sm mb-10-until-sm">{translate('Our Shared Vision for XRPL’s Future')}</h2>
              <p className="mb-10">
                {translate(
                  "Together, we're building the greenest infrastructure to drive blockchain innovation that doesn't sacrifice utility or performance, to bring the developer community's vision to life."
                )}
              </p>
              <Link className="btn btn-primary btn-arrow" to="/about/">
                {translate('Learn More')}
              </Link>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">
              {translate('Explore what the community is building to enable new features and use cases on XRPL')}
            </h3>
            <h6 className="eyebrow mb-3">{translate('Preview New Features')}</h6>
          </div>
          <ul className="mt-10 card-grid card-grid-3xN">
            {features.map(feat => (
              <li className="col ls-none pt-2" key={feat.href}>
                <Link className="label chip-green" to={feat.href}>
                  {translate(feat.chip)}
                </Link>
                <h4 className="mt-3 mb-0 h5">{translate(feat.title)}</h4>
                <p className="mt-6-until-sm mt-3 mb-0">
                  {typeof feat.description === 'string' ? translate(feat.description) : feat.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-8-sm p-10-until-sm br-8 cta-card">
            <img alt="" src={require('./static/img/backgrounds/cta-home-magenta.svg')} className="cta cta-bottom-right" />
            <div className="z-index-1 position-relative">
              <div className="d-flex flex-column-reverse">
                <h2 className="h4 mb-8-sm mb-10-until-sm">
                  {translate('Join the Community ')}
                  <br className="until-sm" />
                  {translate(' at XRPL.org')}
                </h2>
              </div>
              <p className="mb-10">
                {translate('Connect at XRPL.org, a community by and for the developers ')}
                <br className="until-sm" />
                {translate(' and entrepeneurs who rely on the XRPL.')}
              </p>
              <Link className="btn btn-primary btn-arrow" to="/community">
                {translate('Get Involved')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

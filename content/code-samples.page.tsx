import * as React from 'react';
import { usePageSharedData, useTranslate } from '@portal/hooks';

const langIcons = {
  cli: require('./static/img/logos/cli.svg'),
  go: require('./static/img/logos/golang.svg'),
  java: require('./static/img/logos/java.svg'),
  js: require('./static/img/logos/javascript.svg'),
  py: require('./static/img/logos/python.svg'),
  http: require('./static/img/logos/globe.svg'),
};
const target = {
  github_forkurl: 'https://github.com/XRPLF/xrpl-dev-portal',
  github_branch: 'master',
};

export default function CodeSamples() {
  const { translate } = useTranslate();
  const { codeSamples, langs } = usePageSharedData<any>('code-samples');

  return (
    <div className="landing page-community">
      <div className="">
        <section className="py-26">
          <div className="col-lg-8 mx-auto text-lg-center">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">{translate('Start Building with Example Code')}</h1>
              <h6 className="eyebrow mb-3">{translate('Code Samples')}</h6>
            </div>
            <a className="mt-12 btn btn-primary btn-arrow">Submit Code Samples</a>
          </div>
        </section>
        <div className="position-relative d-none-sm">
          <img
            alt="default-alt-text"
            src={require('./img/backgrounds/xrpl-overview-orange.svg')}
            id="xrpl-overview-orange"
          />
        </div>
        <section className="container-new py-26">
          <div className="d-flex flex-column col-sm-8 p-0">
            <h3 className="h4 h2-sm">
              {translate('Browse sample code for building common use cases on the XRP Ledger')}
            </h3>
          </div>
          <div className="row col-12  card-deck mt-10" id="code-samples-deck">
            <div className="row col-md-12 px-0" id="code_samples_list">
              {codeSamples.map(card => (
                <a
                  className={`card cardtest col-12 col-lg-5 ${card.langs.join(' ')}`}
                  href={target.github_forkurl + `/tree/${target.github_branch}/${card.href}`}
                >
                  <div className="card-header">
                    {card.langs.map(lang => (
                      <span className="circled-logo">
                        <img alt={lang} src={langIcons[lang]} />
                      </span>
                    ))}
                  </div>
                  <div className="card-body">
                    <h4 className="card-title h5">{card.title}</h4>
                    <p className="card-text">{card.description}</p>
                  </div>
                  <div className="card-footer">&nbsp;</div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div>
            <div className="d-flex flex-column">
              <h3 className="h4 h2-sm pb-4">{translate('Contribute Code Samples')}</h3>
              <h6 className="eyebrow mb-20">
                {translate('Help the XRPL community by submitting your<br /> own code samples')}
              </h6>
            </div>
            <div className="row pl-4">
              <div className=" col-lg-3 pl-4 pl-lg-0 pr-4 contribute  dot contribute_1">
                <span className="dot" />
                <h5 className="pb-4 pt-md-5">Fork and clone</h5>
                <p className="pb-4">
                  Fork the <a href="https://github.com/XRPLF/xrpl-dev-portal">xrpl-dev-portal repo</a>. Using git, clone
                  the fork to your computer.
                </p>
              </div>
              <div className=" col-lg-3 pl-4 pl-lg-0 pr-4 contribute  dot contribute_2">
                <span className="dot" />
                <h5 className="pb-4 pt-md-5">Add to folder</h5>
                <p className="pb-4">
                  Add your sample code to the <code>content/_code-samples/</code> folder. Be sure to include a{' '}
                  <code>README.md</code> that summarizes what it does and anything else people should know about it.
                </p>
              </div>
              <div className=" col-lg-3 pl-4 pl-lg-0 pr-4 contribute  dot contribute_3">
                <span className="dot" />
                <h5 className="pb-4 pt-md-5">Commit and push</h5>
                <p className="pb-4">Commit your changes and push them to your fork on GitHub.</p>
              </div>
              <div className=" col-lg-3 pl-4 pl-lg-0 pr-2 contribute  dot contribute_4 mb-4">
                <span className="dot" />
                <h5 className="pb-4 pt-md-5">Open a pull request</h5>
                <p className="pb-0 mb-0">
                  Open a pull request to the original repo. Maintainers will review your submission and suggest changes
                  if necessary. If the code sample is helpful, it'll be merged and added to XRPL.org!
                </p>
              </div>
            </div>
            <a className="mt-12 btn btn-primary btn-arrow">Submit Code Samples</a>
          </div>
        </section>
      </div>
    </div>
  );
}

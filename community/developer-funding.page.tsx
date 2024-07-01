import * as React from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from '@redocly/theme/components/Link/Link';

export const frontmatter = {
  seo: {
    title: 'Developer Funding',
    description: "If you’re a software developer or team looking to build your next project or venture on the XRP Ledger (XRPL), there are a number of opportunities to fund your next innovation.",
  }
};

false;

const target = { prefix: "" }; // TODO: fixme

export default function Funding() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing page-funding">
      <div>
        <div className="position-relative d-none-sm">
          <img
            alt="purple waves"
            src={require("../static/img/backgrounds/funding-purple.svg")}
            className="position-absolute"
            style={{ top: 0, right: 0 }}
          />
        </div>
        <section className="container-new py-26 text-lg-center">
          <div className="p-0 col-lg-6 mx-lg-auto">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("XRPL Developer Funding Programs")}
              </h1>
              <h6 className="eyebrow mb-3">{translate("Project Resources")}</h6>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="p-0 col-lg-6 mx-lg-auto" style={{ maxWidth: 520 }}>
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0 h4 h2-sm">
                {translate(
                  "Explore funding opportunities for developers and teams"
                )}
              </h1>
              <h6 className="eyebrow mb-3">{translate("Funding Overview")}</h6>
            </div>
            <p className="mt-3 py-3 p-0 longform">
              {translate(
                "If you’re a software developer or team looking to build your next project or venture on the XRP Ledger (XRPL), there are a number of opportunities to fund your next innovation."
              )}
            </p>
          </div>
        </section>
        {/* Hackathons */}
        <section className="container-new py-26">
          {/* flex. Col for mobile. Row for large. on large align content to the center  */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div
              className="order-1 order-lg-2 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0"
              style={{ maxWidth: 520 }}
            >
              <div className="d-flex flex-column-reverse p-lg-3">
                <h3 className="h4 h2-sm">{translate("XRPL Hackathons")}</h3>
                <h6 className="eyebrow mb-3">{translate("Join an Event")}</h6>
              </div>
              <p className="p-lg-3 mb-2 longform">
                {translate(
                  "Hackathons are open to all developers to explore and invent a project on the XRP Ledger. Visit the events page for updates on upcoming hackathons."
                )}
              </p>
              <div className="d-none d-lg-block p-lg-3">
                <Link className="btn btn-primary btn-arrow" to="/community/events">
                  {translate("See Upcoming Events")}
                </Link>
              </div>
            </div>
            <div className="order-2 order-lg-1 col-lg-6 px-0">
              <div className="row align-items-center m-0 funding-list">
                {/* funding list */}
                <div className="col-12 col-lg-6 p-0">
                  <div className="px-lg-3 pb-3">
                    <img alt="user" id="funding-01" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Best for")}</h6>
                      <p>
                        {translate(
                          "Software developers and teams building directly on the XRP Ledger"
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="book" id="funding-02" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Required")}</h6>
                      <p>{translate("Some coding experience")}</p>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-lg-5">
                    <img alt="arrow" id="funding-03" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Level")}</h6>
                      <p>{translate("XRPL beginner to advanced developers")}</p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="dollar sign" id="funding-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Funding Levels")}</h6>
                      <p>{translate("Prize money and awards")}</p>
                    </div>
                  </div>
                </div>
                {/* end col 1 */}
                {/* Show on large */}
                <div className="col-12 col-lg-6 p-0 d-none d-lg-block">
                  <div className="px-lg-3 pb-3 pt-5 mt-5">
                    <div className="pt-1 mt-3">
                      <img alt="book" id="funding-02" />
                      <div className="pt-3">
                        <h6 className="mb-3">{translate("Required")}</h6>
                        <p>{translate("Some coding experience")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-5">
                    <img alt="dollar sign" id="funding-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Funding Levels")}</h6>
                      <p>{translate("Prize money and awards")}</p>
                    </div>
                  </div>
                </div>
                {/* end col 2 */}
              </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3">
              <Link className="btn btn-primary btn-arrow" to="/community/events">
                {translate("See Upcoming Events")}
              </Link>
            </div>
          </div>
        </section>
        {/* Eligibility */}
        <section className="container-new py-26">
          {/* flex. Col for mobile. Row for large. on large align content to the center  */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center mr-lg-4">
            <div className="order-1  mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0 p-lg-3">
              <div className="d-flex flex-column-reverse py-lg-3">
                <h3 className="h4 h2-sm">{translate("XRPL Grants")}</h3>
                <h6 className="eyebrow mb-3">
                  {translate("Fund Your Project")}
                </h6>
              </div>
              <p className="py-lg-3 mb-2 longform" style={{ maxWidth: 520 }}>
                {translate(
                  "Developer grants for projects that contribute to the growing XRP Ledger community."
                )}
              </p>
              <div className="mt-4 pt-3" style={{ maxWidth: 520 }}>
                <span className="h6" style={{ fontSize: "1rem" }}>
                  {translate("Past awardees include:")}
                </span>
                <div className="mb-4 py-3" id="xrplGrantsDark" />
              </div>
              <div className="d-none d-lg-block py-lg-3">
                <a
                  className="btn btn-primary btn-arrow-out"
                  target="_blank"
                  href="https://xrplgrants.org/"
                >
                  {translate("Visit XRPL Grants")}
                </a>
              </div>
            </div>
            <div className="order-2 col-lg-6 px-0 pl-lg-3">
              <div className="row align-items-center m-0 funding-list">
                {/* funding list */}
                <div className="col-12 col-lg-6 p-0">
                  <div className="px-lg-3 pb-3">
                    <img alt="user" id="funding-01" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Best for")}</h6>
                      <p>
                        {translate(
                          "Software developers, teams, and start-ups building directly on the XRP Ledger"
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="book" id="funding-02" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Required")}</h6>
                      <p>
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Coding experience")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Github repository")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Project narrative/description")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("At least one developer on the core team")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Budget and milestones")}
                      </p>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-lg-5">
                    <img alt="arrow" id="funding-03" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Level")}</h6>
                      <p>
                        {translate("XRPL intermediate to advanced developers")}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="dollar sign" id="funding-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Funding Levels")}</h6>
                      <p>{translate("$10,000 - $200,000")}</p>
                    </div>
                  </div>
                </div>
                {/* end col 1 */}
                {/* Show on large */}
                <div className="col-12 col-lg-6 p-0 d-none d-lg-block">
                  <div className="px-lg-3 pb-3 pt-5 mt-5">
                    <div className="pt-1 mt-3">
                      <img alt="book" id="funding-02" />
                      <div className="pt-3">
                        <h6 className="mb-3">{translate("Required")}</h6>
                        <p>
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Coding experience")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Github repository")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Project narrative/description")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("At least one developer on the core team")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Budget and milestones")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-5">
                    <img alt="dollar sign" id="funding-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Funding Levels")}</h6>
                      <p>{translate("$10,000 - $200,000")}</p>
                    </div>
                  </div>
                </div>
                {/* end col 2 */}
              </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3">
              <a
                className="btn btn-primary btn-arrow-out"
                target="_blank"
                href="https://xrplgrants.org/"
              >
                {translate("Visit XRPL Grants")}
              </a>
            </div>
          </div>
        </section>
        {/* Accelerator */}
        <section className="container-new py-26">
          {/* flex. Col for mobile. Row for large. on large align content to the center  */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div
              className="order-1 order-lg-2 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0"
              style={{ maxWidth: 520 }}
            >
              <div className="d-flex flex-column-reverse p-lg-3">
                <h3 className="h4 h2-sm">{translate("XRPL Accelerator")}</h3>
                <h6 className="eyebrow mb-3">
                  {translate("Advance your project")}
                </h6>
              </div>
              <p className="p-lg-3 mb-2 longform">
                {translate(
                  "12-week program for entrepreneurs building on the XRP Ledger to scale their projects into thriving businesses."
                )}
              </p>
              <div className="d-none d-lg-block p-lg-3">
                <a
                  className="btn btn-primary btn-arrow"
                  href="https://xrplaccelerator.org/"
                >
                  {translate("View XRPL Accelerator")}
                </a>
              </div>
            </div>
            <div className="order-2 order-lg-1 col-lg-6 px-0">
              <div className="row align-items-center m-0 funding-list">
                {/* funding list */}
                <div className="col-12 col-lg-6 p-0">
                  <div className="px-lg-3 pb-3">
                    <img alt="user" id="funding-01" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Best for")}</h6>
                      <p>
                        {translate(
                          "Start-ups building scalable products on XRPL that can capture a large market opportunity"
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="book" id="funding-02" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Required")}</h6>
                      <p>
                        <span style={{ color: "#7919FF" }}>•</span>{" "}
                        {translate("Strong founding team")}
                        <br />
                        <span style={{ color: "#7919FF" }}>•</span>{" "}
                        {translate("Bold, ambitious vision")}
                        <br />
                        <span style={{ color: "#7919FF" }}>•</span>{" "}
                        {translate("Ideally an MVP and monetization strategy")}
                      </p>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-lg-5">
                    <img alt="arrow" id="funding-03" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Level")}</h6>
                      <p>
                        <span style={{ color: "#7919FF" }}>•</span>{" "}
                        {translate("XRPL advanced developers")}
                        <br />
                        <span style={{ color: "#7919FF" }}>•</span>{" "}
                        {translate("Business acumen")}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="dollar sign" id="funding-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Funding Levels")}</h6>
                      <p>
                        {translate(
                          "$50,000 (grant) + pitch for venture funding"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* end col 1 */}
                {/* Show on large */}
                <div className="col-12 col-lg-6 p-0 d-none d-lg-block">
                  <div className="px-lg-3 pb-3 pt-5 mt-5">
                    <div className="pt-1 mt-3">
                      <img alt="book" id="funding-02" />
                      <div className="pt-3">
                        <h6 className="mb-3">{translate("Required")}</h6>
                        <p>
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Strong founding team")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate("Bold, ambitious vision")}
                          <br />
                          <span style={{ color: "#7919FF" }}>•</span>{" "}
                          {translate(
                            "Ideally an MVP and monetization strategy"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-5">
                    <img alt="dollar sign" id="funding-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Funding Levels")}</h6>
                      <p>
                        {translate(
                          "$50,000 (grant) + pitch for venture funding"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* end col 2 */}
              </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3">
              <a
                className="btn btn-primary btn-arrow"
                href="https://xrplaccelerator.org/"
              >
                {translate("View XRPL Accelerator")}
              </a>
            </div>
          </div>
        </section>
        <div className="position-relative d-none-sm">
          <img
            alt="orange waves"
            src={require("../static/img/backgrounds/funding-orange.svg")}
            id="funding-orange"
          />
        </div>
      </div>
    </div>
  );
}

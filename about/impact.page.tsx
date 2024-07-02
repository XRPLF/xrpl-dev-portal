import React, { useState } from "react";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import mapDark from "../static/js/impact/mapDark.json";
import mapLight from "../static/js/impact/mapLight.json";
import { useLottie } from "lottie-react";
import { useThemeFromClassList } from "../@theme/helpers";
import { Link } from "@redocly/theme/components/Link/Link";

export const frontmatter = {
  seo: {
    title: "Impact",
    description:
      "Learn how the XRP Ledger helps move money around the world faster, cheaper and more sustainably than any other currency available today.",
  },
};

export default function Impact() {
  const theme = useThemeFromClassList(["dark", "light"]);
  const [videoVisible, setVideoVisible] = useState(false); // State to control visibility
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const handleVideoClick = () => {
    setVideoVisible(true); // Show the iframe
  };
  const options = React.useMemo(() => {
    return {
      animationData: theme === "dark" ? mapDark : mapLight,
      loop: true,
    };
  }, [theme]);
  const { View } = useLottie(options);
  return (
    <div className="landing page-impact">
      <div className="overflow-hidden">
        <div className="position-relative d-none-sm">
          <img
            alt="purple waves"
            src={require("../static/img/backgrounds/community-purple.svg")}
            className="landing-bg"
            id="impact-purple"
          />
        </div>
        <section className="container-new py-26 text-lg-center">
          <div className="p-0 col-lg-8 mx-lg-auto">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("Today’s Value, Tomorrow’s Vision")}
              </h1>
              <h6 className="eyebrow mb-3">
                {translate("XRPL Today, XRPL Tomorrow")}
              </h6>
            </div>
          </div>
        </section>
        <div className="position-relative d-none-sm">
          <img
            alt="green waves"
            src={require("../static/img/backgrounds/home-green.svg")}
            id="impact-green"
          />
        </div>
        {/* World map */}
        <section className="container-new py-10">
          <div className="col-sm-10 col-lg-6 offset-md-3 p-10-until-sm pl-0-sm pr-0-sm">
            <h6 className="eyebrow mb-3">
              {translate("Building for the Future")}
            </h6>
            <h2 className="h4 h2-sm mb-8">
              {translate("Consensus protocol is efficient and sustainable")}
            </h2>
            <h5 className="longform mb-10">
              {translate(
                "For more than 272 million migrants worldwide, sending and receiving money across borders is expensive, unreliable and complex."
              )}
            </h5>
            <p className="mb-6">
              {`${translate(
                "about.impact.feature.ppart1",
                "Open and decentralized, blockchain and crypto are seeing an increase in adoption across the financial services industry, from retail and institutional investment to "
              )}`}
              <Link to="/about/uses">{translate("about.impact.feature.ppart2", "commercial use cases ")}</Link>
              {`${translate("about.impact.feature.ppart3", "like CBDCs, NFTs, and cross-border payments.")}`}
            </p>
          </div>
          <div>
            {/* Large */}
            <div className="col d-none d-lg-block align-self-center">
              {View}
            </div>
          </div>
        </section>
        {/* Video sidebar */}
        <section className="container-new py-26">
          <div className="mt-10 card-grid card-grid-2xN">
            <div className="col">
              <iframe
                style={{ display: videoVisible ? "block" : "none" }} // Use state to control display
                width={560}
                height={315}
                src="https://www.youtube.com/embed/WsmldDNGQ9s?autoplay=1&mute=1"
                title="What makes the XRPL sustainable?"
                frameBorder={0}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Only show the link if the video is not visible */}
              {!videoVisible && (
                <a onClick={handleVideoClick} id="playvideo">
                  <img
                    alt="Preview of man speaking with a play button"
                    src={require("../static/img/impact/video_sustainable@2x.png")}
                    id="xrpl-overview-video-intro"
                    className="w-100 video-image"
                  />
                </a>
              )}
            </div>
            <div className="col ls-none mb-16-sm">
              <h6 className="eyebrow mb-3">
                {translate("A Sustainable Future")}
              </h6>
              <h2 className="h4 h2-sm mb-8">
                {translate("What makes the XRPL sustainable?")}
              </h2>
              <h5 className="longform mb-10">
                {translate(
                  "XRPL’s unique consensus mechanism is eco-friendly—it does not require mining to settle transactions. This results in efficiency without sacrificing security, decentralization, or scalability."
                )}
              </h5>
              <p>
                {translate(
                  "The trivial amount of energy it does consume is then neutralized with carbon credits through EW Zero, an open-source blockchain decarbonization tool."
                )}
              </p>
            </div>
          </div>
        </section>
        {/* Card */}
        <section className="container-new py-26">
          <div className="col-md-6 offset-md-3 p-6-sm p-10-until-sm br-8 cta-card">
            <img
              alt="purple waves"
              src={require("../static/img/backgrounds/cta-community-purple.svg")}
              className="cta cta-top-left"
            />
            <img
              alt="green waves"
              src={require("../static/img/backgrounds/cta-calculator-green.svg")}
              className="cta cta-bottom-right"
            />
            <div className="z-index-1 position-relative">
              <div className="d-flex flex-column-reverse">
                <h2 className="h4 h2-sm mb-10-until-sm mb-8-sm">
                  {translate(
                    "Featured companies & projects running on the XRP Ledger."
                  )}
                </h2>
                <h6 className="eyebrow mb-3">
                  {translate("Sustainable Projects")}
                </h6>
              </div>
              <p className="mb-10">
                {translate(
                  "Learn more about companies and developers who are using the XRP Ledger to solve interesting problems efficiently and sustainably."
                )}
              </p>
              <Link to="/about/uses" className="btn btn-primary btn-arrow">
                {translate("See More")}
              </Link>
            </div>
          </div>
        </section>
        {/* Connect */}
        <section className="container-new py-26">
          {/* flex. Col for mobile. Row for large. on large align content to the center  */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center mr-lg-4">
            <div className="order-1  mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0 p-lg-3">
              <div className="d-flex flex-column-reverse py-lg-3">
                <h3 className="h4 h2-sm">
                  {translate(
                    "How can businesses and developers connect and contribute?"
                  )}
                </h3>
              </div>
              <p className="py-lg-3 mb-2 longform" style={{ maxWidth: 520 }}>
                {translate(
                  "If you want to advance business with sustainable solutions to real-world problems, you’re invited to join the global, growing XRPL community. Here are some ways to get involved:"
                )}
              </p>
              <div className="d-none d-lg-block py-lg-3">
                <Link className="btn btn-primary btn-arrow" to="/resources/contribute-code">
                  {translate("Join the Community")}
                </Link>
              </div>
            </div>
            <div className="order-2 col-lg-6 px-0 pl-lg-3">
              <div className="row align-items-center m-0 connect-list">
                {/* connect list */}
                <div className="col-12 col-lg-6 p-0 pr-3">
                  <div className="px-lg-3 pb-3">
                    <img alt="piece of paper" id="connect-01" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Blog")}</h6>
                      <p>
                        {`${translate("about.impact.blog.ppart1", "Check out the ")}`}
                        <Link to="/blog">
                          {translate("about.impact.blog.ppart2", "XRPL dev blog ")}
                        </Link>
                        {`${translate(
                          "about.impact.blog.ppart3", 
                          "to stay up-to-date on the latest innovations and developments in the XRPL community."
                        )}`}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="piece of paper" id="connect-02" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Events")}</h6>
                      <p>
                        {`${translate("about.impact.events.ppart1", "Attend ")}`}
                        <Link to="/community/events">
                          {translate("about.impact.events.ppart2", "meetups, hackathons, and conferences ")}
                        </Link>
                        {`${translate(
                          "about.impact.events.ppart3",
                          "to meet other members of the community."
                        )}`}
                      </p>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-lg-5">
                    <img alt="github" id="connect-03" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Code")}</h6>
                      <p>
                        {`${translate("about.impact.code.ppart1", "View the ")}`}
                        <a
                          href="https://github.com/XRPLF/xrpl-dev-portal/"
                          target="_blank"
                        >
                          {translate("about.impact.code.ppart2", "Github repositories ")}
                        </a>
                        {`${translate(
                          "about.impact.code.ppart3",
                          "to find blockchain projects to see how you can contribute."
                        )}`}
                      </p>
                    </div>
                  </div>
                  {/* Hide on large */}
                  <div className="px-lg-3 pb-3 d-lg-none">
                    <img alt="chat bubbles" id="connect-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Connect")}</h6>
                      <p>
                        {translate(
                          "about.impact.connect.ppart1",
                          "Join the conversation on social media using #XRPLCommunity."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* end col 1 */}
                {/* Show on large */}
                <div className="col-12 col-lg-6 p-0  pr-3 d-none d-lg-block">
                  <div className="px-lg-3 pb-3 pt-5 mt-5">
                    <div className="pt-1 mt-3">
                      <img alt="calendar" id="connect-02" />
                      <div className="pt-3">
                        <h6 className="mb-3">{translate("Events")}</h6>
                        <p>
                          {`${translate("about.impact.events.ppart1", "Attend ")}`}
                          <Link to="/community/events">
                            {translate("about.impact.events.ppart2", "meetups, hackathons, and conferences ")}
                          </Link>
                          {`${translate(
                            "about.impact.events.ppart3",
                            "to meet other members of the community."
                          )}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-lg-3 pb-3 pt-5">
                    <img alt="chat bubbles" id="connect-04" />
                    <div className="pt-3">
                      <h6 className="mb-3">{translate("Connect")}</h6>
                      <p>
                        {translate(
                          "about.impact.connect.ppart1",
                          "Join the conversation on social media using #XRPLCommunity."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {/* end col 2 */}
              </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3">
              <Link
                className="btn btn-primary btn-arrow"
                target="_blank"
                to="/resources/contribute-code"
              >
                {translate("Join the Community")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

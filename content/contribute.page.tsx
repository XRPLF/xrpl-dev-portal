import * as React from "react";
import { useTranslate } from "@portal/hooks";
import NetworkNodeLight from "./static/js/community/NetworkNodeLight.json";
import GrantsDark from "./static/js/community/XRPLGrantsDark.json";
import CareersDark from "./static/js/community/CareersDark.json";
import { useLottie } from "lottie-react";
import { useThemeFromClassList } from "./@theme/helpers";

// This page still needs typeform integration and animations
const platforms = [
  { name: "Twitter", id: "twitter", link: "https://twitter.com/XRPLF/" },
  { name: "Discord", id: "discord", link: "https://xrpldevs.org" },
  {
    name: "YouTube",
    id: "youtube",
    link: "https://www.youtube.com/channel/UC6zTJdNCBI-TKMt5ubNc_Gg",
  },
  {
    name: "GitHub",
    id: "github",
    link: "https://github.com/XRPLF/xrpl-dev-portal",
    imgclasses: "invertible-img",
  },
  {
    name: "Stack Overflow",
    id: "stack-overflow",
    link: "https://stackoverflow.com/questions/tagged/xrp",
  },
];

const contributeLedger = [
  {
    href: "the-rippled-server",
    title: "The Rippled Server",
    desc: "Learn about the core servers that power the XRP Ledger",
  },
  {
    href: "run-rippled-as-a-validator",
    title: "Join UNL",
    desc: "Have your server vote on the consensus ledger",
  },
  {
    href: "install-rippled",
    title: "Install & Configure",
    desc: "Install and update the rippled server.",
  },
  {
    href: "troubleshoot-the-rippled-server",
    title: "Troubleshooting",
    desc: "Troubleshoot all kinds of problems with the rippled server.",
  },
];

export default function Contribute() {
  const { translate } = useTranslate();
  //Network Node lg
  const options = {
    animationData: NetworkNodeLight,
    loop: true,
  };
  const NetNodeLg = useLottie(options);
  const NetNodeLgView = NetNodeLg.View;
  //Network Node sm
  const NetNodeSm = useLottie(options);
  const NetNodeSmView = NetNodeSm.View;

  // Grants lg
  const grantsOptions = {
    animationData: GrantsDark,
    loop: true,
  };
  const grantsAnimationLg = useLottie(grantsOptions);
  const GrantsDarkAnimationLg = grantsAnimationLg.View;
  // Grants Sm
  const grantsAnimationSm = useLottie(grantsOptions);
  const GrantsDarkAnimationSm = grantsAnimationSm.View;
  //Careers lg
  const careersOptions = {
    animationData: CareersDark,
    loop: true,
  };
  const carDarkLg = useLottie(careersOptions);
  const CareersDarkLg = carDarkLg.View;
  //Careers sm
  const carDarkSm = useLottie(careersOptions);
  const CareersDarkSm = carDarkSm.View;

  return (
    <div className="landing page-community">
      <div>
        <section className="text-center" id="community-heading">
          <div className="d-lg-block d-none">
            <img
              alt="People sitting at a conference"
              className="parallax one"
              width="220px"
              height="160px"
              src={require("./static/img/community/community-one@2x.png")}
            />
            <img
              alt="Person speaking at a conference"
              className="parallax two"
              width="120px"
              height="160px"
              src={require("./static/img/community/community-two@2x.png")}
            />
            <img
              alt="Person sitting and speaking"
              className="parallax three"
              width="102px"
              height="102px"
              src={require("./static/img/community/community-three@2x.png")}
            />
            <img
              alt="People chatting"
              className="parallax four"
              width="120px"
              height="160px"
              src={require("./static/img/community/community-four@2x.png")}
            />
            <img
              alt="Person speaking at Apex"
              className="parallax five"
              width="216px"
              height="160px"
              src={require("./static/img/community/community-five@2x.png")}
            />
          </div>
          <div className="col-lg-6 mx-auto text-left text-md-center">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("Open for Business, ")}
                <br className="until-sm" />
                {translate("Driven to Innovate")}
              </h1>
              <h6 className="eyebrow mb-3">
                {translate("The XRPL Community")}
              </h6>
            </div>
          </div>
        </section>
        {/* Join conversation */}
        <section className="container-new" id="find-us-on-platforms">
          <div className="d-flex flex-column-reverse col-sm-8 p-0">
            <h3 className="h4 h2-sm">
              {translate("Find the community on the platforms below")}
            </h3>
            <h6 className="eyebrow mb-3">
              {translate("Join the Conversation")}
            </h6>
          </div>
          <div className="row row-cols-2 row-cols-lg-4 card-deck">
            {platforms.map((plat) => (
              <a className="card mb-10" href={plat.link} target="_blank">
                <div className="card-body">
                  <div className="circled-logo">
                    <img
                      id={`platform-${plat.id}`}
                      alt="(logo)"
                      className={plat?.imgclasses || ""}
                    />
                  </div>
                  <h4 className="card-title h5">{plat.name}</h4>
                </div>
                <div className="card-footer">&nbsp;</div>
              </a>
            ))}
          </div>
        </section>
        {/* Contribute */}
        <section className="container-new" id="run-a-network-node">
          <div className="card-grid card-grid-2xN">
            <div className="col d-none d-lg-block align-self-center">
              {NetNodeLgView}
            </div>
            <div className="col pt-lg-5">
              <div className="d-flex flex-column-reverse mb-8 pl-0">
                <h2 className="h4 h2-sm">
                  {translate("Run an XRP Ledger network node")}
                </h2>
                <h6 className="eyebrow mb-3">
                  {translate("Contribute to Consensus")}
                </h6>
              </div>
              <div className="col d-lg-none d-block">{NetNodeSmView}</div>
              <div className="pt-2 pt-lg-5 card-grid card-grid-2xN text-cards">
                {contributeLedger.map((cc) => (
                  <div key={cc.href} className="text-card">
                    <a className="btn-arrow" href={cc.href}>
                      {cc.title}
                    </a>
                    <p className="mt-3 mb-0">{cc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Grants */}
        <section className="container-new" id="xrpl-grants">
          <div className="card-grid card-grid-2xN">
            <div className="col pr-2">
              <div className="d-flex flex-column-reverse">
                <h2 className="h4 h2-sm">
                  {translate("Apply for funding to build your XRPL project")}
                </h2>
                <h6 className="eyebrow mb-3">{translate("XRPL Grants")}</h6>
              </div>
              <p className="mb-lg-3 py-lg-4 pt-4 mb-0">
                {translate(
                  "The XRPL Grants program funds select open-source projects that solve problems and grow the XRP Ledger community."
                )}
              </p>
              <div className="d-lg-block d-none">
                {GrantsDarkAnimationLg}
                <a
                  className="btn btn-primary btn-arrow"
                  target="_blank"
                  href="https://xrplgrants.org/"
                >
                  {translate("Apply for a Grant")}
                </a>
              </div>
            </div>
            <div className="col">
              <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                <h6 className="eyebrow mb-2">
                  {translate("Awarded in a single grant")}
                </h6>
                <img
                  alt="$10K - $200K"
                  src={require("./static/img/community/community-grants-1.svg")}
                />
              </div>
              <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                <h6 className="eyebrow mb-2">
                  {translate("Distributed to grant recipients")}
                </h6>
                <img
                  alt="$6.0M"
                  src={require("./static/img/community/community-grants-2.svg")}
                />
              </div>
              <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                <h6 className="eyebrow mb-2">
                  {translate("Open-source projects funded ")}
                </h6>
                <img
                  alt="50+"
                  src={require("./static/img/community/community-grants-3.svg")}
                />
              </div>
              <div className="d-lg-none d-block mt-4 pt-3">
                {GrantsDarkAnimationSm}
                <a
                  className="btn btn-primary btn-arrow"
                  target="_blank"
                  href="https://xrplgrants.org/"
                >
                  {translate("Learn More")}
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Blog */}
        <section className="container-new" id="xrpl-blog">
          <div className="card-grid card-grid-2xN align-items-lg-center">
            <div className="col pr-2 d-lg-block d-none">
              <img
                alt="Bubbles with people inside"
                src={require("./static/img/community/community-blog@2x.png")}
                className="w-100 blog-graphic"
              />
            </div>
            <div className="col">
              <div className="d-flex flex-column-reverse mb-lg-2 pl-0">
                <h2 className="h4 h2-sm">
                  {translate(
                    "Showcase your XRPL project, application or product"
                  )}
                </h2>
                <h6 className="eyebrow mb-3">
                  {translate("XRPL Community Spotlight")}
                </h6>
              </div>
              <p className="mb-3 py-4">
                {translate(
                  'Get featured on the Developer Reflections blog or <a href="uses.html">Blockchain Use Cases</a> page, and explore XRPL community highlights.'
                )}
              </p>
              <div className="d-lg-none d-block">
                <img
                  alt="Bubbles with people inside"
                  src={require("./static/img/community/community-blog@2x.png")}
                  className="w-100 blog-graphic"
                />
              </div>
              <div className="text-lg-left text-center">
                <a
                  className="btn btn-primary btn-arrow mb-4 mb-md-0"
                  data-tf-popup="ssHZA7Ly"
                  data-tf-iframe-props="title=Developer Reflections"
                  data-tf-medium="snippet"
                >
                  {translate("Submit Your Projects")}
                </a>
                <a
                  className="ml-lg-4 video-external-link"
                  target="_blank"
                  href="https://xrpl.org/blog/"
                >
                  {translate("Read the Blog")}
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Events */}
        <section className="container-new" id="xrpl-events">
          <div className="card-grid card-grid-2xN ">
            <div className="col pr-2 d-lg-block d-none">
              {/* Large. 3 image in col */}
              <div className="d-flex flex-row h-100">
                <div className=" pr-1 mr-3 align-self-start">
                  <img
                    alt="People standing at Apex"
                    src={require("./static/img/community/community-events-apex-small@2x.png")}
                    className="w-100"
                  />
                  <p className="bold text-light mt-3">
                    {translate("Welcome to Apex 2021")}
                  </p>
                </div>
                <div className=" px-1 mx-3 align-self-center">
                  <img
                    alt="People standing in a circle"
                    src={require("./static/img/community/community-events-meetup-small@2x.png")}
                    className="w-100"
                  />
                  <p className="bold text-light mt-3">
                    {translate("XRPL Community Meetup")}
                  </p>
                </div>
                <div className=" pl-1 ml-3 align-self-end">
                  <img
                    alt="Blue and pink card"
                    src={require("./static/img/community/community-events-hackathon-small@2x.png")}
                    className="w-100"
                  />
                  <p className="bold text-light mt-3">
                    {translate("XRPL Hackathon 2022")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col pt-5">
              <div className="d-flex flex-column-reverse mb-lg-2 pl-0">
                <h2 className="h4 h2-sm">
                  {translate(
                    "Check out global events across the XRPL community"
                  )}
                </h2>
                <h6 className="eyebrow mb-3">{translate("XRPL Events")}</h6>
              </div>
              <p className="mb-3 py-4">
                {translate(
                  "Meet the XRPL community at meetups, hackathons, conferences, and more across global regions."
                )}
              </p>
              {/* Mobile. 3 inline images.  */}
              <div className="col pr-2 d-lg-none d-block">
                <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                  <img
                    alt="People standing at Apex"
                    src={require("./static/img/community/community-events-apex@2x.png")}
                    className="w-100"
                  />
                  <h6 className="mt-3">{translate("Welcome to Apex 2021")}</h6>
                </div>
                <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                  <img
                    alt="People standing in a circle"
                    src={require("./static/img/community/community-events-meetup@2x.png")}
                    className="w-100"
                  />
                  <h6 className="mt-3">{translate("XRPL Community Meetup")}</h6>
                </div>
                <div className="mb-4 pb-3 mb-lg-3 pb-lg-5">
                  <img
                    alt="Blue and pink card"
                    src={require("./static/img/community/community-events-hackathon@2x.png")}
                    className="w-100"
                  />
                  <h6 className="mt-3">{translate("XRPL Hackathon 2022")}</h6>
                </div>
              </div>
              <div>
                <a
                  className="btn btn-primary btn-arrow"
                  target="_blank"
                  href="/events.html"
                >
                  {translate("View All Events")}
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Careers */}
        <section className="container-new" id="xrpl-careers">
          <div className="card-grid card-grid-2xN">
            <div className="col pr-2 d-lg-block d-none">{CareersDarkLg}</div>
            <div className="col pt-5">
              <div className="d-flex flex-column-reverse mb-lg-2 pl-0">
                <h2 className="h4 h2-sm">
                  {translate(
                    "Discover your next career opportunity in the XRPL community"
                  )}
                </h2>
                <h6 className="eyebrow mb-3">{translate("XRPL Careers")}</h6>
              </div>
              <p className="mb-3 py-4">
                {translate(
                  "Teams across the XRPL community are looking for talented individuals to help build their next innovation."
                )}
              </p>
              <div className="d-lg-none d-block">{CareersDarkSm}</div>
              <div className="d-lg-block">
                <a
                  className="btn btn-primary btn-arrow"
                  target="_blank"
                  href="https://jobs.xrpl.org/jobs"
                >
                  {translate("View Open Roles")}
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* XRPL Design Assets */}
        <section className="container-new" id="xrpl-design-assets">
          <div className="card-grid card-grid-2xN ">
            <div className="col pt-5">
              <div className="d-flex flex-column-reverse mb-lg-2 pl-0">
                <h2 className="h4 h2-sm">
                  {translate("Review guidelines for using XRPL design assets")}
                </h2>
                <h6 className="eyebrow mb-3">{translate("XRPL Assets")}</h6>
              </div>
              <p className="mb-3 py-4">
                {translate(
                  "Just like the technology itself, XRPL assets are open source and available for anyone to use. Check out this helpful framework for using XRPL visuals. "
                )}
              </p>
              <div className="col pr-2 d-lg-none d-block mb-4 pb-3 mb-lg-3">
                <div className=" pr-1 mr-3">
                  <img
                    alt="Preview of xrpl community design assets webpages"
                    src={require("./static/img/community/community-design-assets.png")}
                    className="w-100"
                  />
                </div>
              </div>
              <div>
                <a
                  className="btn btn-primary btn-arrow"
                  target="_blank"
                  href="https://github.com/XRPLF/xrpl-dev-portal/raw/master/content/XRPL_Logo_Kit.zip"
                >
                  {translate("Download the PDF and Assets")}
                </a>
              </div>
            </div>
            <div className="col pr-2 d-lg-block d-none">
              <div className=" pr-1 mr-3">
                <img
                  alt="Preview of xrpl community design assets webpages"
                  src={require("./static/img/community/community-design-assets.png")}
                  className="w-100"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="container-new">
          <div className="col-md-6 offset-md-3 p-6-sm p-10-until-sm br-8 cta-card">
            <img
              alt="default-alt-text"
              src={require("./img/backgrounds/cta-community-purple.svg")}
              className="d-none-sm cta cta-top-left"
            />
            <img
              alt="default-alt-text"
              src={require("./img/backgrounds/cta-community-green.svg")}
              className="cta cta-bottom-right"
            />
            <div className="z-index-1 position-relative">
              <div className="d-flex flex-column-reverse">
                <h2 className="h4 mb-10-until-sm mb-8-sm">
                  {translate(
                    "A community-driven resource for all things XRPL.org"
                  )}
                </h2>
                <h5 className="eyebrow mb-3">
                  {translate("Contribute to XRPL.org")}
                </h5>
              </div>
              <p className="mb-10">
                {translate(
                  "Thank you for your interest in contributing to XRPL.org. This website was created as an XRPL community resource and is meant to be a living, breathing source of truth for XRP Ledger resources. This portal is open-source and anyone can suggest changes."
                )}
              </p>
              <a
                className="btn btn-primary btn-arrow"
                href="https://github.com/XRPLF/xrpl-dev-portal/blob/master/CONTRIBUTING.md"
                target="_blank"
              >
                {translate("Read Contributor Guidelines")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

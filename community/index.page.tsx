import React, { useState, useEffect } from "react";
import moment from "moment";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import base_events from "../static/JSON/events.json";
import contentful_events from "../static/JSON/contentful-events.json";
import { Link } from "@redocly/theme/components/Link/Link";
const allEvents = base_events.concat(contentful_events)
const findNearestUpcomingEvent = (events) => {
  let nearestEvent = null;
  let nearestDateDiff = Infinity;
  let index = 0;
  events.forEach((event, i) => {
    const eventStartDate = moment(event.start_date, "MMMM DD, YYYY");
    const currentDate = moment();
    const diff = eventStartDate.diff(currentDate, "days");

    if (diff >= 0 && diff < nearestDateDiff) {
      nearestEvent = event;
      nearestDateDiff = diff;
      index = i;
    }
  });

  return { nearestEvent, nearestDateDiff, index };
};

const XrplEventsAndCarouselSection = ({ events }) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate(); 
  // State variables for the nearest event
  const [nearestEventInfo, setNearestEventInfo] = useState({
    nearestEvent: null,
    nearestDateDiff: null,
    index: 0,
  });

  // State for the current index in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const { nearestEvent, nearestDateDiff, index } = findNearestUpcomingEvent(events);
    setNearestEventInfo({ nearestEvent, nearestDateDiff, index });
    setCurrentIndex(index);
  }, [events]);

  const updateCarousel = () => {
    const prevEvent = events[currentIndex - 1] || null;
    const currentEvent = events[currentIndex];
    const nextEvent = events[currentIndex + 1] || null;

    return {
      prevEvent,
      currentEvent,
      nextEvent,
    };
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const { prevEvent, currentEvent, nextEvent } = updateCarousel();

  return (
    <>
      <section className="xrpl-events-section">
        <div className="header-div">
          <div className="header">
            <h6 className="events-text">{translate("XRPL Events")}</h6>
            <h4 className="events-text">
              {translate(
                "community.index.event.h4part1",
                "Check out global events hosted "
              )}
              <br className="d-none-sm" />
              {translate(
                "community.index.event.h4part2",
                "by the XRPL community"
              )}
            </h4>
          </div>
          <p className="description">
            {translate(
              "Meet the XRPL community at meetups, hackathons, blockchain conferences, and more across global regions."
            )}
          </p>
          <Link
            className="cd-none-sm btn btn-primary btn-arrow view-all-events-btn"
            target="_blank"
            to="/community/events"
          >
            {translate("View All Events")}
          </Link>
        </div>
        {!!nearestEventInfo.nearestEvent && (
          <div className="upcoming-event" id="upcoming-events-section">
            <p className="upcoming-label">{translate("UPCOMING EVENT")}</p>
            <div id="days-count" className="days-count">
              {nearestEventInfo.nearestDateDiff}
            </div>
            <div className="days-word">{translate("days")}</div>
            <div className="num-separator"></div>
            <h5 id="upcoming-event-name" className="event-name">
              {translate(nearestEventInfo.nearestEvent?.name)}
            </h5>
            <p className="mb-2 event-details d-flex icon">
              <span className="icon-location"></span>
              <span id="upcoming-event-date">
                {nearestEventInfo.nearestEvent?.date}
              </span>
            </p>
            <p className="event-location d-flex icon">
              <span className="icon-date" id="upcoming-event-location"></span>
              <span id="location-tag">
                {nearestEventInfo.nearestEvent?.location}
              </span>
            </p>
          </div>
        )}
        <Link
          target="_blank"
          className="cd-none-lg btn btn-primary btn-arrow view-all-events-btn"
          to="/community/events"
        >
          {translate("View All Events")}
        </Link>
      </section>

      <section className="carousel">
        <div className="image-container">
          <img
            id="left-image"
            alt="Left Event Image"
            src={prevEvent ? (prevEvent.image.startsWith('https://') ? prevEvent.image : `/img/events/${prevEvent.image}`) : ""}
            style={{ visibility: prevEvent ? "visible" : "hidden" }}
          />
          <div className="center-image-wrapper">
            <img
              id="center-image"
              alt="Featured Event Image"
              src={currentEvent ? (currentEvent.image.startsWith('https://') ? currentEvent.image : `/img/events/${currentEvent.image}`) : ""}
              onClick={() =>
                currentEvent && window.open(currentEvent.link, "_blank")
              }
            />
            <div className="event-info">
              <span className="name">
                {currentEvent ? currentEvent.name : ""}
              </span>
              <div className="flex-align">
                <span className="icon-location"></span>
                <span>{currentEvent ? currentEvent.location : ""}</span>
              </div>
              <div className="flex-align">
                <span className="icon-date"></span>
                <span>{currentEvent ? currentEvent.date : ""}</span>
              </div>
            </div>
          </div>
          <img
            id="right-image"
            alt="Right Event Image"
            src={nextEvent ? (nextEvent.image.startsWith('https://') ? nextEvent.image : `/img/events/${nextEvent.image}`) : ""}
            style={{ visibility: nextEvent ? "visible" : "hidden" }}
          />
        </div>

        <div className="arrow-wrapper">
          <button className="arrow-button left-arrow" onClick={handlePrev}>
            <img alt="left arrow" />
          </button>
          <button className="arrow-button right-arrow" onClick={handleNext}>
            <img alt="right arrow" />
          </button>
        </div>
      </section>
    </>
  );
};

const CommunityPage: React.FC = () => {
  const events = allEvents.filter((event) => event.community)
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  return (
    <div className="no-sidebar landing page-community">
      {/* Community Heading Section */}
      <section
        className="text-center"
        id="community-heading"
        style={{ position: "relative" }}
      >
        <div className="d-lg-block d-none">
          <img
            alt="People sitting at a conference"
            className="parallax one"
            width="152px"
            height="102px"
            src={require("../static/img/community/community-one.png")}
          />
          <img
            alt="Person speaking at a conference"
            className="parallax two"
            src={require("../static/img/community/community-two.png")}
          />
          <img
            alt="Person sitting and speaking"
            className="parallax three"
            src={require("../static/img/community/community-three.png")}
          />
          <img
            alt="People chatting"
            className="parallax four"
            width="120px"
            height="160px"
            src={require("../static/img/community/community-four.png")}
          />
          <img
            alt="Person speaking at Apex"
            className="parallax five"
            src={require("../static/img/community/community-five.png")}
          />
        </div>

        <div className="mx-auto text-left col-lg-6 text-md-center hero-title">
          <div className="d-flex flex-column-reverse align-items-center sm-align-items-start">
            <img
              src={require("../static/img/icons/arrow-down.svg")}
              className="bounce-arrow"
              alt="Down Arrow"
            />
            <h1 className="mb-0 main-title">
              {translate("community.index.h1part1", "A Global Blockchain")}
              <br className="until-sm" />
              {translate("community.index.h1part2", "Community of ")}
              <span className="builders-wrap">
                {translate("community.index.h1part3", "Builders")}
              </span>
              <br className="until-sm" />
              {translate("community.index.h1part4", "and Innovators")}
            </h1>
            <h6 className="mb-3 eyebrow">{translate("XRPL Community")}</h6>
          </div>
        </div>
      </section>
      {/* Community Table Section */}
      <section id="community-table" className="hot-topics">
        <h6 className="eyebrow-convo">{translate("Join the Conversation")}</h6>
        <h4>{translate("Hot Topics Happening Now")}</h4>
        <table>
          <tbody>
            <tr>
              <td className="td-img">
                <img className="discord-icon" alt="discord icon" />
              </td>
              <td>
                {translate(
                  "AMA with Edge Wallet: Learn more about Edge Wallet and how they are building on the XRP Ledger."
                )}
              </td>
              <td>
                <a
                  href="https://discord.com/channels/886050993802985492/950893687313940582/1162480612209332345"
                  target="_blank"
                  className="text-external-link"
                >
                  <span className="external-link-contribute"></span>
                </a>
              </td>
            </tr>
            <tr>
              <td className="td-img">
                <img className="twitter-icon" alt="twitter icon" />
              </td>
              <td>
                {translate(
                  "Clawback: A newly proposed feature that adds to the XRP Ledger's token asset control capabilities."
                )}
              </td>
              <td>
                <a
                  href="https://x.com/RippleXDev/status/1708889238471950610?s=20"
                  target="_blank"
                  className="text-external-link"
                >
                  <span className="external-link-contribute"></span>
                </a>
              </td>
            </tr>
            <tr>
              <td className="td-img">
                <img className="youtube-icon" alt="youtube icon" />
              </td>
              <td>
                {translate(
                  "APEX 2023: View keynote sessions from the annual developer summit where developers, contributors, and thought leaders come together to learn, build, and celebrate all things XRP Ledger."
                )}
              </td>
              <td>
                <a
                  href="https://www.youtube.com/playlist?list=PLJQ55Tj1hIVZBdGc33An5Is6IFMxw3D7u"
                  target="_blank"
                  className="text-external-link"
                >
                  <span className="external-link-contribute"></span>
                </a>
              </td>
            </tr>
            <tr className="final-tr">
              <td className="td-img">
                <img className="xrpl-icon" alt="xrpl icon" />
              </td>
              <td>
                {translate(
                  "Deep Dive into XRPL DeFi Course: Learn about the inner workings of decentralized finance including safety and security, auto-bridging, pathfinding, liquidity pools, and more."
                )}
              </td>
              <td>
                <a
                  href="https://learn.xrpl.org/course/deep-dive-into-xrpl-defi/"
                  target="_blank"
                  className="text-external-link"
                >
                  <span className="external-link-contribute"></span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      {/* XRPL Events Carousel Section */}
      <XrplEventsAndCarouselSection events={events} />
      {/* Community Funding Section */}
      <section className="community-funding">
        <Link
          target="_blank"
          className="cd-none-lg btn btn-primary btn-arrow view-all-events-btn get-funding-btn"
          to="/community/developer-funding/"
        >
          {translate("Get Funding")}
        </Link>
        <div className="stats">
          <div className="stacked-stats">
            <div className="stat">
              <span className="small-text">
                {translate("funding been awarded")}
              </span>
              <div id="staticImage" className="number gradient-num">
                <span className="surround-gradient">$</span>
                13
                <span className="surround-gradient">M+</span>
              </div>
              <div className="ml-8 stat-separator"></div>
            </div>
            <div className="stat">
              <span className="small-text">
                {translate("teams awarded globally")}
              </span>
              <div className="number gradient-num-two">
                120<span className="surround-gradient-two">+</span>
              </div>
              <div className="ml-14 stat-separator"></div>
            </div>
          </div>
          <div className="stat">
            <span className="small-text">
              {translate("countries represented")}
            </span>
            <div className="number gradient-num-three">
              28<span className="surround-gradient-three">+</span>
            </div>
            <div className="ml-19 stat-separator"></div>
          </div>
        </div>
        <div className="funding-section">
          <span className="funding-text">
            {translate("XRPL Developer Funding")}
          </span>
          <h2>
            {translate("Funding Opportunities for Blockchain Businesses")}
          </h2>
          <p>
            {translate(
              "If you're a software developer or team looking to build your next blockchain business on the XRP Ledger (XRPL), numerous funding opportunities like grants and hackathons await your innovation."
            )}
          </p>
          <Link
            className="cd-none-sm btn btn-primary btn-arrow view-all-events-btn"
            target="_blank"
            to="/community/developer-funding/"
          >
            {translate("Get Funding")}
          </Link>
        </div>
      </section>
      {/* Community Spotlight Wrapper */}
      <section className="community-spotlight-wrapper">
        <div className="community-spotlight">
          <h6 className="funding-text">
            {translate("XRPL Community Spotlight")}
          </h6>
          <h2 className="spotlight-subtitle">
            {translate(
              "Showcase your blockchain project, application, or product"
            )}
          </h2>
          <p className="spotlight-description">
            {translate(
              "Get featured on the Developer Reflections blog or Ecosystem page, and amplify your innovation within the blockchain community."
            )}
          </p>
          <a
            target="_blank"
            className="w-222 btn btn-primary btn-arrow view-all-events-btn"
            data-tf-popup="ssHZA7Ly"
            data-tf-iframe-props="title=Developer Reflections"
            data-tf-medium="snippet"
            href="#submit-your-project"
          >
            {translate("Submit Your Project")}
          </a>
        </div>

        <div className="projects-wrapper">
          <div className="project-card top-left">
            <div className="card-image">
              <img
                className="middle-image"
                src={require("../static/img/community/blockdaemon.png")}
                alt="Blockdaemon"
              />
            </div>
            <div className="card-details">
              <h6 className="project-title">Blockdaemon</h6>
              <p className="project-description">
                {translate(
                  "Your go-to independent blockchain infrastructure provider, offering secure and scalable blockchain services, including wallets, nodes, staking, protocols, and integrations for developers and institutions alike."
                )}
              </p>
              <a
                href="https://xrpl.org/blog/2023/blockdaemon.html"
                target="_blank"
                className="view-project external-link"
              >
                {translate("View Project")}
              </a>
            </div>
          </div>
          <div className="project-card bottom-right">
            <div className="card-image">
              <img
                className="middle-image-two"
                src={require("../static/img/community/xrp-cafe.png")}
                alt="XRPCafe"
              />
            </div>
            <div className="card-details">
              <h6 className="project-title">XRPCafe</h6>
              <p className="project-description">
                {translate(
                  "A premier NFT marketplace dedicated to fostering mass adoption of the XRP Ledger."
                )}
              </p>
              <a
                href="https://xrpl.org/blog/2023/xrpcafe.html"
                target="_blank"
                className="view-project external-link"
              >
                {translate("View Project")}
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Bottom Cards Section 2 cards */}
      <section className="bottom-cards-section bug-bounty">
        <div className="com-card">
          <img
            className="top-right-img bug-bounty-card-bg"
            alt="Top Right Image"
          />
          <div className="card-content">
            <h6 className="card-title">
              {translate("RippleX Bug Bounty Program")}
            </h6>
            <h6 className="card-subtitle">
              {translate("Contribute to the XRP Ledger's")}
              <br />
              Security
            </h6>
            <p className="card-description">
              {translate(
                "RippleX’s Bug Bounty, part of Ripple's 1 Billion XRP pledge, strengthens XRP Ledger security and supports its ecosystem."
              )}
              <p className="card-description">
                {translate(
                  "Use this program to report bugs in RippleX/rippled. Send a detailed report of a qualifying bug to "
                )}
                <a href="mailto:bugs@ripple.com">bugs@ripple.com</a>
                {translate(" and use the ")}
                <a href="https://ripple.com/files/bug-bounty.asc">
                  Public Key.
                </a>
              </p>
            </p>
            <div className="card-links">
              <Link
                className="com-card-link"
                target="_blank"
                to="https://medium.com/ripplexdev/highlighting-the-ripplex-bug-bounty-program-545ea787f900"
              >
                {translate("Learn more")}
              </Link>
            </div>
          </div>
        </div>
        <div className="com-card">
          <img
            className="bottom-right-img bug-bounty-card-bg-2"
            alt="Bottom Right Image"
          />
          <div className="card-content">
            <h6 className="card-title">{translate("Report a Scam")}</h6>
            <h6 className="card-subtitle pr-bt28">
              {translate("Report Scams to Safeguard Our Community")}
            </h6>
            <p className="card-description">
              {translate(
                "In an evolving industry where trust and security are critical, scams continue to impede progress in crypto and blockchain. Help mitigate scammers by reporting scams."
              )}
            </p>
            <div className="card-links">
              <Link
                target="_blank"
                className="com-card-link"
                to="/community/report-a-scam/"
              >
                {translate("Report a Scam")}
              </Link>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Bottom Cards Section */}
      <section className="bottom-cards-section">
        <div className="com-card">
          <img className="top-left-img" alt="Top Left Image" />
          <div className="card-content">
            <h6 className="card-title">
              {translate("Contribute to Consensus")}
            </h6>
            <h6 className="card-subtitle">
              {translate("Run an XRP Ledger network node")}
            </h6>
            <p className="card-description">
              {translate(
                "Thank you for your interest in contributing to XRP Ledger."
              )}
            </p>
            <div className="card-links">
              <Link
                className="com-card-link"
                target="_blank"
                to="/docs/concepts/networks-and-servers/"
              >
                {translate("Networks and Servers")}
              </Link>
              <Link
                className="com-card-link"
                target="_blank"
                to="/docs/infrastructure/configuration/server-modes/run-rippled-as-a-validator/"
              >
                {translate("Join UNL")}
              </Link>
              <Link
                className="com-card-link"
                target="_blank"
                to="/docs/infrastructure/installation/"
              >
                {translate("Install & Configure")}
              </Link>
              <Link
                className="com-card-link"
                target="_blank"
                to="/docs/infrastructure/troubleshooting/"
              >
                {translate("Troubleshooting")}
              </Link>
            </div>
          </div>
        </div>
        <div className="com-card">
          <img className="bottom-right-img" alt="Bottom Right Image" />
          <div className="card-content">
            <h6 className="card-title">{translate("XRPL Careers")}</h6>
            <h6 className="card-subtitle pr-bt16">
              {translate(
                "Discover your next career opportunity in the XRPL community"
              )}
            </h6>
            <p className="card-description">
              {translate(
                "Teams across the XRPL community are looking for talented individuals to help build their next innovation."
              )}
            </p>
            <div className="card-links">
              <a
                className="com-card-link"
                target="_blank"
                href="https://jobs.xrpl.org/jobs"
              >
                {translate("View Open Roles")}
              </a>
            </div>
          </div>
        </div>
        <div className="com-card">
          <img className="top-right-img" alt="Top Right Image" />
          <div className="card-content">
            <h6 className="card-title">
              {translate("Contribute to XRPL.org")}
            </h6>
            <h6 className="card-subtitle">
              {translate(
                "A Community-Driven Resource for All Things XRP Ledger"
              )}
            </h6>
            <p className="card-description">
              {translate(
                "Contribute to XRPL.org, the go-to resource for XRP Ledger. This open-source portal welcomes contributions from anyone for suggested changes."
              )}
            </p>
            <div className="card-links">
              <Link
                className="com-card-link"
                target="_blank"
                to="/resources/contribute-documentation/"
              >
                {translate("Read Contributor Guidelines")}
              </Link>
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
};

export default CommunityPage;

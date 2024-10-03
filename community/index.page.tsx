import React, { useState } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import moment from "moment";
import { Link } from "@redocly/theme/components/Link/Link";

const infoSession = require("../static/img/events/InfoSessions.png");

export const frontmatter = {
  seo: {
    title: "Community",
    description:
      "The XRP Ledger (XRPL) is a community-driven public blockchain. Here’s how you can get involved.",
  },
};
const amaImage = require("../static/img/events/AMAs.png");
const hackathon = require("../static/img/events/Hackathons.png");
const conference = require("../static/img/events/Conference.png");
const zone = require("../static/img/events/XRPLZone.png");
const brazil = require("../static/img/events/event-meetup-brazil.png");
const korea = require("../static/img/events/SouthKoreaMeetup.png");
const infoSession2 = require("../static/img/events/xrpl-builder-office-hours-02.png");
const infoSession3 = require("../static/img/events/xrpl-builder-office-hours-03.png");
const infoSession4 = require("../static/img/events/xrpl-builder-office-hours-04.png");
const findNearestUpcomingEvent = (events) => {
  let nearestEvent = null;
  let nearestDateDiff = Infinity;
  let index;
  events.forEach((event, i) => {
    const eventStartDate = moment(event.start_date, "MMMM DD, YYYY");
    const currentDate = moment();
    const diff = eventStartDate.diff(currentDate, "days");

    if (diff >= 0 && diff < nearestDateDiff) {
      nearestEvent = event;
      nearestDateDiff = diff;
      index = i
    }
  });

  return { nearestEvent, nearestDateDiff, index };
};

const events = [
  {
    name: "New Horizon: Innovate Without Limits: New Horizons Await",
    description:
      "Join our EVM-compatible chain launch for a chance to win $50,000 in prizes! Unleash your creativity in DeFi and NFTs, with judging criteria focused on novelty, impact, and community engagement.",
    type: "hackathon",
    link: "https://newhorizon.devpost.com/",
    location: "Virtual",
    date: "October 19, 2023 - December 22, 2023",
    image: hackathon,
    end_date: "December 22, 2023",
    start_date: "October 19, 2023",
  },
  {
    name: "XRPL Community Report Launch Party",
    description:
      "Celebrate the XRPL Community Report launch at 7pm! Join blockchain enthusiasts, connect with experts, and discover opportunities in the XRP Ledger ecosystem. Limited space available, so register now for a night of celebration and networking!",
    type: "meetup",
    link: "https://www.eventbrite.fr/e/billets-xrpl-community-report-launch-party-753788370307",
    location: "Paris, France",
    date: "November 28, 7pm - 9pm",
    image: require("../static/img/events/paris.png"),
    end_date: "November 28, 2023",
    start_date: "November 28, 2023",
  },
  {
    name: "XRPL Grants Info Session: Decentralized Exchange (DEX) Focused",
    description:
      "Watch the recorded information session and Q&A on applying to XRPL Grants Wave 7. This session will provide a general overview of the XRPL Grants application for Wave 7, with a focus on Decentralized Exchange (DEX) projects.",
    type: "info-session",
    link: "https://www.youtube.com/watch?v=BbGu0QC5WEE",
    location: "Virtual - Zoom",
    date: "September 06, 2023",
    image: infoSession,
    end_date: "September 06, 2023",
    start_date: "September 06, 2023",
  },
  {
    name: "XRPL Developers Reddit AMA: Real World Assets",
    description:
      "Join us for a live chat on Reddit and learn more about how developers are building real world assets with confidence on the XRP Ledger.",
    type: "ama",
    link: "https://xrplresources.org/rwa-ama?utm_source=web&utm_medium=web&utm_campaign=bwc",
    location: "Virtual - Reddit",
    date: "October 17, 2023",
    image: amaImage,
    end_date: "October 17, 2023",
    start_date: "October 17, 2023",
  },
  {
    name: "XRP Ledger Zone ETHDenver",
    description:
      "XRPL Zone: your all-in-one location for creating and collaborating on XRP Ledger (XRPL) projects. Details coming soon!",
    type: "zone",
    link: "http://xrplzone-ethdenver.splashthat.com",
    location: "Denver, Colorado",
    date: "February 27, 2024",
    image: zone,
    end_date: "February 27, 2024",
    start_date: "February 27, 2024",
  },
  {
    name: "XRPL Developers Discord AMA: Apex 2024",
    description:
      "Join the DevRel team at Ripple to learn more about APEX 2024.",
    type: "ama",
    link: "https://discord.gg/gszzRTxV?event=1215341725825110089",
    location: "XRPL Developers Discord",
    date: "March 13, 2024 13:00 EST",
    image: amaImage,
    start_date: "March 13, 2024",
    end_date: "March 13, 2024",
  },
  {
    name: "Paris Blockchain Week",
    description:
      "Paris Blockchain Week is Europe's biggest blockchain & digital assets event that covers all aspects of blockchain technology.",
    type: "conference",
    link: "https://www.parisblockchainweek.com/",
    location: "Paris, France",
    date: "April 9 - 12, 2024",
    image: conference,
    end_date: "April 12, 2024",
    start_date: "April 9, 2024",
  },
  {
    name: "Consensus",
    description:
      "Join us at Consensus! This event is the world's largest, longest-running and most influential gathering that brings together all sides of the cryptocurrency, blockchain and Web3 community.",
    type: "conference",
    link: "https://consensus.coindesk.com/?utm_campaign=&utm_content=c24&utm_medium=sponsored&utm_source=XRPLEventsPage%20&utm_term=organic",
    location: "Austin, Texas",
    date: "May 29 - June 1, 2024",
    image: conference,
    end_date: "June 1, 2024",
    start_date: "May 29, 2024",
  },
  {
    name: "EasyA Ripple Hackathon",
    description:
      "Join the XRPL community at the Ripple x EasyA Hackathon in Amsterdam, where startups can compete for a $20,000 prize and a chance to present at the prestigious APEX Conference alongside industry leaders. Secure your spot now! ",
    type: "hackathon",
    link: "https://www.eventbrite.co.uk/e/easya-x-ripple-apex-hackathon-win-20000-tickets-882724261027?aff=oddtdtcreator",
    location: "Amsterdam",
    date: "June 8 - 9, 2024",
    image: hackathon,
    start_date: "June 8, 2024",
    end_date: "June 9, 2024",
  },
  {
    name: "APEX 2024: The XRPL Developer Summit",
    description:
      "Apex XRPL Developer Summit is the annual event where developers, contributors, and thought leaders come together to learn, build, share, network, and celebrate all things XRP Ledger.",
    type: "conference",
    link: "http://apexdevsummit.com",
    location: "Amsterdam",
    date: "June 11 - 13, 2024",
    image: conference,
    end_date: "June 13, 2024",
    start_date: "June 11, 2024",
  },
  {
    name: "SwissHacks",
    description:
      "Transform Fintech with XRPL at SwissHacks 2024! Prototype and collaborate with fellow builders to reinvent finance for a brighter future",
    type: "hackathon",
    link: "https://airtable.com/app61tk91vkuwKhGx/pagCN29Br8RdxTvp7/form",
    location: "Zurich",
    date: "June 28 - 30, 2024",
    image: hackathon,
    start_date: "June 28, 2024",
    end_date: "June 30, 2024",
  },
  {
    name: "XRPL Meetup Blockchain Rio",
    description:
      "Get ready to kick off Blockchain Rio with a bang at the XRP Ledger Dev Meetup!  ​Hosted by the the XRP Ledger team, this warm-up event is the perfect chance for devs and builders to connect, share ideas, and get hyped for the main event. Expect a night filled with great conversations, delicious drinks, and the vibrant energy of Rio de Janeiro.  ​Don't miss out on this fantastic opportunity to network and have a blast with fellow tech enthusiasts. See you there!",
    type: "meetup",
    link: "https://lu.ma/4uxpkd11",
    location: "Rio de Janeiro",
    date: "July 23, 2024",
    image: brazil,
    start_date: "July 23, 2024",
    end_date: "July 23, 2024",
  },
  {
    name: "XRPL Builder Office Hours",
    description:
      "XRPL Builder Office Hours is an open forum hosted monthly by Developer Advocates to answer technical and business questions from community members.",
    type: "info-session",
    link: "https://ripple.zoom.us/meeting/register/tJMscOCsrDoiHNUN6hZLpFVR69OcfG9rXtIA#/registration",
    location: "Virtual - Zoom",
    date: "August 23, 2024",
    image: infoSession,
    start_date: "August 23, 2024",
    end_date: "August 23, 2024",
  },
  {
    name: "XRP Ledger Hackathon Seoul 2024",
    description:
      "Calling all developers in Korea or attending Korea Blockchain Week! Join us for an exclusive pre-KBW meetup in Gangnam, Seoul! Be part of an exciting opportunity to collaborate with fellow builders leveraging the XRP Ledger. Don’t miss this chance to connect with industry peers, explore local funding initiatives, and fuel your projects with new insights just before the main KBW event!",
    type: "hackathon",
    link: "https://lu.ma/1viq6evg",
    location: "Seoul, South Korea",
    date: "August 31 - September 1, 2024",
    image: hackathon,
    start_date: "August 31, 2024",
    end_date: "September 1, 2024",
  },
  {
    name: "XRPL Zone Seoul",
    description:
      "Join us at XRPL Zone Seoul where developers, corporates, fintechs, banks, VCs, academia, and the XRP community come together under one roof for the biggest XRPL event in South Korea!",
    type: "zone",
    link: "https://ripple.swoogo.com/xrpl-zone-seoul",
    location: "Seongdong-su, Seoul",
    date: "September 4, 2024",
    image: require('../static/img/events/event-meetup-zone-day.png'),
    start_date: "September 4, 2024",
    end_date: "September 4, 2024",
  },
  {
    name: "XRPL Zone Seoul After Hours",
    description:
      "Celebrate with the XRP Community during Korea Blockchain Week! Don't miss this opportunity to mingle with the vibrant XRP community, visionary XRPL developers, trailblazing innovators, and influential investors.",
    type: "meetup",
    link: "https://lu.ma/mbg067j3",
    location: "Seongdong-su, Seoul",
    date: "September 4, 2024",
    image: require('../static/img/events/event-meetup-zone-night.png'),
    start_date: "September 4, 2024",
    end_date: "September 4, 2024",
  },
  {
    name: "XRP Community Day Tokyo",
    description:
      "Join senior execs from Ripple, prominent Japanese institutions, and the XRP community for a day of inspiration, networking and insights.",
    type: "meetup",
    link: "https://events.xrplresources.org/toyko-community-2024",
    location: "Shinagawa, Tokyo",
    date: "September 6, 2024",
    image: require('../static/img/events/event-meetup-tokyo-day.png'),
    start_date: "September 6, 2024",
    end_date: "September 6, 2024",
  },
  {
    name: "XRP Community Night Tokyo",
    description:
      "​Celebrate with the XRP Community in Tokyo! Don't miss this opportunity to mingle with the vibrant XRP community, visionary developers, trailblazing innovators, and influential VCs.",
    type: "meetup",
    link: "https://lu.ma/84do37p7",
    location: "Shinagawa, Tokyo",
    date: "September 6, 2024",
    image: require('../static/img/events/event-meetup-tokyo-night.png'),
    start_date: "September 6, 2024",
    end_date: "September 6, 2024",
  },
  {
    name: "Chicago XRP Ledger Meet Up",
    description:
      "Hey Chicago XRP Ledger community! We’re hosting a meetup soon—come hang out, share ideas, and talk all things XRPL. Would love to see you there!",
    type: "meetup",
    link: "https://lu.ma/74dulzff",
    location: "Chicago, IL",
    date: "September 12, 2024",
    image: require('../static/img/events/chicago-meetup.png'),
    start_date: "September 12, 2024",
    end_date: "September 12, 2024",
  },
  {
    name: "San Francisco XRP Ledger Meet Up",
    description:
      "Hello San Francisco XRP Ledger community! We're hosting a meetup soon with a focus on ZK research. Excited to see you soon!",
    type: "meetup",
    link: "https://lu.ma/evdklm4r",
    location: "San Francisco, California",
    date: "September 26, 2024",
    image: require('../static/img/events/sf-meetup.jpg'),
    start_date: "September 26, 2024",
    end_date: "September 26, 2024",
  },
  {
    name: "XRPL Builder Office Hours",
    description:
      "XRPL Builder Office Hours is an open forum hosted monthly by Developer Advocates to answer technical and business questions from community members.",
    type: "info",
    link: "https://ripple.zoom.us/meeting/register/tJMscOCsrDoiHNUN6hZLpFVR69OcfG9rXtIA",
    location: "Virtual - Zoom",
    date: "September 27, 2024",
    image: infoSession2,
    start_date: "September 27, 2024",
    end_date: "September 27, 2024",
  },
  {
    name: "AI Fund - XRPL Grants Info Session",
    description:
      "Join our info session to learn about our new XRPL Grants' AI Fund, designed to support innovative projects that leverage artificial intelligence in the XRPL ecosystem.",
    type: "info",
    link: "https://ripple.zoom.us/webinar/register/WN__SNDW7LTSM29h5NIpvXFvg#/registration",
    location: "Virtual - Zoom",
    date: "October 2, 2024",
    image: infoSession,
    start_date: "October 2, 2024",
    end_date: "October 2, 2024",
  },
  {
    name: "XRPL Builder Office Hours",
    description:
      "XRPL Builder Office Hours is an open forum hosted monthly by Developer Advocates to answer technical and business questions from community members.",
    type: "info",
    link: "https://ripple.zoom.us/meeting/register/tJMscOCsrDoiHNUN6hZLpFVR69OcfG9rXtIA",
    location: "Virtual - Zoom",
    date: "October 25, 2024",
    image: infoSession3,
    start_date: "October 25, 2024",
    end_date: "October 25, 2024",
  },
  {
    name: "XRPL Builder Office Hours",
    description:
      "XRPL Builder Office Hours is an open forum hosted monthly by Developer Advocates to answer technical and business questions from community members.",
    type: "info",
    link: "https://ripple.zoom.us/meeting/register/tJMscOCsrDoiHNUN6hZLpFVR69OcfG9rXtIA",
    location: "Virtual - Zoom",
    date: "November 22, 2024",
    image: infoSession4,
    start_date: "November 22, 2024",
    end_date: "November 22, 2024",
  }
];
const { nearestDateDiff, nearestEvent, index } = findNearestUpcomingEvent(events);
const XrplEventsAndCarouselSection = ({ events }) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [currentIndex, setCurrentIndex] = useState(index); // use nearest event's index as init state
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
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(currentIndex + 1);
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
        {!!nearestEvent && (
          <div className="upcoming-event" id="upcoming-events-section">
            <p className="upcoming-label">{translate("UPCOMING EVENT")}</p>
            <div id="days-count" className="days-count">
              {nearestDateDiff}
            </div>
            <div className="days-word">{translate("days")}</div>
            <div className="num-separator"></div>
            <h5 id="upcoming-event-name" className="event-name">
              {translate(nearestEvent?.name)}
            </h5>
            <p className="mb-2 event-details d-flex icon">
              <span className="icon-location"></span>
              <span id="upcoming-event-date">{nearestEvent?.date}</span>
            </p>
            <p className="event-location d-flex icon">
              <span className="icon-date" id="upcoming-event-location"></span>
              <span id="location-tag">{nearestEvent?.location}</span>
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
            src={prevEvent ? prevEvent.image : ""}
            style={{ visibility: prevEvent ? "visible" : "hidden" }}
          />
          <div className="center-image-wrapper">
            <img
              id="center-image"
              alt="Featured Event Image"
              src={currentEvent ? currentEvent.image : ""}
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
            src={nextEvent ? nextEvent.image : ""}
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
          <img className="top-right-img bug-bounty-card-bg" alt="Top Right Image" />
          <div className="card-content">
            <h6 className="card-title">
              {translate("RippleX Bug Bounty Program")}
            </h6>
            <h6 className="card-subtitle">
              {translate(
                "Contribute to the XRP Ledger's"
              )}
              <br/>
              Security
            </h6>
            <p className="card-description">
              {translate(
                "RippleX’s Bug Bounty, part of Ripple's 1 Billion XRP pledge, strengthens XRP Ledger security and supports its ecosystem."
              )}
              <p className="card-description">
                {
                  translate("Use this program to report bugs in RippleX/rippled. Send a detailed report of a qualifying bug to ")
                }
              <a href="mailto:bugs@ripple.com">bugs@ripple.com</a>
              {
                translate(" and use the ")
              }
              <a href="https://ripple.com/files/bug-bounty.asc">Public Key.</a>
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
          <img className="bottom-right-img bug-bounty-card-bg-2" alt="Bottom Right Image" />
          <div className="card-content">
            <h6 className="card-title">{translate("Report a Scam")}</h6>
            <h6 className="card-subtitle pr-bt28">
              {translate(
                "Report Scams to Safeguard Our Community"
              )}
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

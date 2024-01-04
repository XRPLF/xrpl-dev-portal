import React, { useEffect, useState } from "react";
import { useTranslate } from "@portal/hooks";

const CommunityPage: React.FC = () => {
  const { translate } = useTranslate();
  const [closestEvent, setClosestEvent] = useState(null);
  const [minDaysDiff, setMinDaysDiff] = useState(Infinity);

  useEffect(() => {
    const events = [];

    const parseDate = (dateString: string) => {
      const [monthDay, year] = dateString.split(", ");
      const [month, day] = monthDay.split(" ");
      const months: { [key: string]: number } = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
      };
      return new Date(parseInt(year), months[month], parseInt(day));
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach((event) => {
      const eventEndDate = parseDate(event.start_date);
      const diffTime = eventEndDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < minDaysDiff) {
        setClosestEvent(event);
        setMinDaysDiff(diffDays);
      }
    });
  }, []);

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
              src={require(".../static/img/icons/arrow-down.svg")}
              className="bounce-arrow"
              alt="Down Arrow"
            />
            <h1 className="mb-0 main-title">
              {translate("A Global Blockchain")}
              <br className="until-sm" />
              {translate("Community of")}
              <span className="builders-wrap">Builders</span>
              <br className="until-sm" />
              {translate("and Innovators")}
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
          {/* Table Rows */}
          {/* Repeat similar structure for each row */}
        </table>
      </section>

      {/* XRPL Events Section */}
      <section className="xrpl-events-section">
        {/* ... */}
        <div className="upcoming-event" id="upcoming-events-section">
          <p className="upcoming-label">{translate("UPCOMING EVENT")}</p>
          {closestEvent && (
            <>
              <div id="days-count" className="days-count">
                {minDaysDiff}
              </div>
              <div className="days-word">{translate("days")}</div>
              <div className="num-separator"></div>
              <h5 id="upcoming-event-name" className="event-name">
                {translate(closestEvent.name)}
              </h5>
              <p className="mb-2 event-details d-flex icon">
                <span className="icon-location"></span>
                <span id="upcoming-event-date">{closestEvent.date}</span>
              </p>
              <p className="event-location d-flex icon">
                <span className="icon-date" id="upcoming-event-location"></span>
                <span id="location-tag">{closestEvent.location}</span>
              </p>
            </>
          )}
        </div>
        {/* ... */}
      </section>

      {/* Carousel Section */}
      <section className="carousel">{/* ... */}</section>

      {/* Community Funding Section */}
      <section className="community-funding">{/* ... */}</section>

      {/* Community Spotlight Wrapper */}
      <section className="community-spotlight-wrapper">{/* ... */}</section>

      {/* Bottom Cards Section */}
      <section className="bottom-cards-section">{/* ... */}</section>
    </div>
  );
};

export default CommunityPage;

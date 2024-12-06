import { useState, useMemo } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import events from "../static/JSON/events.json";

const moment = require("moment");
export const frontmatter = {
  seo: {
    title: "Events",
    description:
      "Find the XRPL Community around the world and join these events to see what's happening.",
  },
};
export const sortEvents = (arr, asc = true) => {
  return arr.sort((a, b) => {
    const dateA = moment(a.end_date, "MMMM D, YYYY");
    const dateB = moment(b.end_date, "MMMM D, YYYY");
    return asc ? dateB.diff(dateA) : dateA.diff(dateB); // Returns a negative value if dateA is before dateB, positive if after, and 0 if the same
  });
};
function categorizeDates(arr) {
  const past = [];
  const upcoming = [];
  const today = moment().startOf("day"); // set the time to midnight

  arr.forEach((obj) => {
    const endDate = moment(obj.end_date, "MMMM D, YYYY"); // parse the 'end_date' string into a moment object
    if (endDate.isBefore(today)) {
      obj.type = `${obj.type}-past`;
      past.push(obj);
    } else {
      obj.type = `${obj.type}-upcoming`;
      upcoming.push(obj);
    }
  });

  return { past: sortEvents(past), upcoming: sortEvents(upcoming, false) };
}

export default function Events() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const { past, upcoming } = useMemo(() => categorizeDates(events), []);

  const [upcomingFilters, setUpcomingFilters] = useState({
    conference: true,
    meetup: true,
    hackathon: true,
    ama: true,
    cc: true,
    zone: true,
    info: true,
  });

  const [pastFilters, setPastFilters] = useState({
    conference: true,
    meetup: true,
    hackathon: true,
    ama: true,
    cc: true,
    zone: true,
    info: true,
  });

  const filteredUpcoming = useMemo(() => {
    return upcoming.filter(
      (event) => upcomingFilters[event.type.split("-")[0]] !== false
    );
  }, [upcoming, upcomingFilters]);

  const filteredPast = useMemo(() => {
    return past.filter(
      (event) => pastFilters[event.type.split("-")[0]] !== false
    );
  }, [past, pastFilters]);

  const handleUpcomingFilterChange = (event) => {
    const { name, checked } = event.target;
    setUpcomingFilters((prevFilters) => ({
      ...prevFilters,
      [name.replace("-upcoming", "")]: checked,
    }));
  };

  const handlePastFilterChange = (event) => {
    const { name, checked } = event.target;
    setPastFilters((prevFilters) => ({
      ...prevFilters,
      [name.replace("-past", "")]: checked,
    }));
  };

  return (
    <div className="landing page-events">
      <div>
        <div className="position-relative d-none-sm">
          <img
            alt="orange waves"
            src={require("../static/img/backgrounds/events-orange.svg")}
            id="events-orange"
          />
        </div>
        <section className="text-center py-26">
          <div className="mx-auto text-center col-lg-5">
            <div className="d-flex flex-column-reverse">
              <h1 className="mb-0">
                {translate("Find the XRPL Community Around the World")}
              </h1>
              <h6 className="mb-3 eyebrow">{translate("Events")}</h6>
            </div>
          </div>
        </section>
        <section className="container-new py-26">
          <div className="event-hero card-grid card-grid-2xN">
            <div className="pr-2 col">
              <img
                alt="xrp ledger events hero"
                src={require("../static/img/events/apex-hero.png")}
                className="w-100"
              />
            </div>
            <div className="pt-5 pr-2 col">
              <div className="d-flex flex-column-reverse">
                <h2 className="mb-8 h4 h2-sm">
                  {translate("XRPL Ledger Apex 2025")}
                </h2>
                <h6 className="mb-3 eyebrow">{translate("Save the Date")}</h6>
              </div>
              <p className="mb-4">
                {translate(
                  "XRP Ledger Apex, hosted by Ripple is the largest annual summit on the XRPL calendar. It unites developers, businesses, fintechs, VCs and the wider community."
                )}
              </p>
              <div className=" my-3 event-small-gray">
                {translate("Location: Singapore")}
              </div>
              <div className="py-2 my-3 event-small-gray">
                {translate("June 10 - 12, 2025")}
              </div>
              <div className="d-lg-block">
                <a
                  className="btn btn-primary btn-arrow-out"
                  target="_blank"
                  href="https://www.xrpledgerapex.com/"
                >
                  {translate("Learn More")}
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Upcoming Events */}
        <section className="container-new py-26" id="upcoming-events">
          <div className="p-0 pb-2 mb-4 d-flex flex-column-reverse col-lg-6 pr-lg-5">
            <h3 className="h4 h2-sm">
              {translate(
                "Check out meetups, hackathons, and other events hosted by the XRPL Community"
              )}
            </h3>
            <h6 className="mb-3 eyebrow">{translate("Upcoming Events")}</h6>
          </div>
          <div className="filter row col-12 mt-lg-5 d-flex flex-column">
            <h6 className="mb-3">{translate("Filter By:")}</h6>
            <div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="conference"
                  id="conference-upcoming"
                  name="conference-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters.conference}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="conference-upcoming">
                  {translate("Conference")}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="meetup"
                  id="meetup-upcoming"
                  name="meetup-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters.meetup}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="meetup-upcoming">{translate("Meetups")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="hackathon"
                  id="hackathon-upcoming"
                  name="hackathon-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters.hackathon}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="hackathon-upcoming">
                  {translate("Hackathons")}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="ama"
                  id="ama-upcoming"
                  name="ama-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters.ama}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="ama-upcoming">{translate("AMAs")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="cc"
                  id="cc-upcoming"
                  name="cc-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters.cc}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="cc-upcoming">
                  {translate("Community Calls")}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="zone"
                  id="zone-upcoming"
                  name="zone-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters.zone}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="zone-upcoming">{translate("XRPL Zone")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="info"
                  id="info-upcoming"
                  name="info-upcoming"
                  type="checkbox"
                  className="events-filter"
                  checked={upcomingFilters["info"]}
                  onChange={handleUpcomingFilterChange}
                />
                <label htmlFor="info-upcoming">
                  {translate("Info Session")}
                </label>
              </div>
            </div>
          </div>
          {/* # Available Types - conference, hackathon, ama, cc, zone, meetup, info  */}
          <div className="mt-2 row row-cols-1 row-cols-lg-3 card-deck">
            {filteredUpcoming.map((event, i) => (
                <a
                  key={event.name + i}
                  className={`event-card ${event.type}`}
                  href={event.link}
                  style={{}}
                  target="_blank"
                >
                  <div
                    className="event-card-header"
                    style={{
                      backgroundImage: `url(/img/events/${event.image})`,
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className="event-card-title">
                      {translate(event.name)}
                    </div>
                  </div>
                  <div className="event-card-body">
                    <p>{translate(event.description)}</p>
                  </div>
                  <div className="mt-lg-auto event-card-footer d-flex flex-column">
                    <span className="mb-2 d-flex icon icon-location">
                      {event.location}
                    </span>
                    <span className="d-flex icon icon-date">{event.date}</span>
                  </div>
                </a>
              )
            )}
          </div>
        </section>
        {/* Past Events */}
        <section className="container-new pt-26" id="past-events">
          <div className="p-0 pb-2 mb-4 d-flex flex-column-reverse col-lg-6 pr-lg-5">
            <h3 className="h4 h2-sm">
              {translate("Explore past community-hosted events")}
            </h3>
            <h6 className="mb-3 eyebrow">{translate("Past Events")}</h6>
          </div>
          <div className="filter row col-12 mt-lg-5 d-flex flex-column">
            <h6 className="mb-3">{translate("Filter By:")}</h6>
            <div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="conference"
                  id="conference-past"
                  name="conference-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters.conference}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="conference-past">
                  {translate("Conference")}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="meetup"
                  id="meetup-past"
                  name="meetup-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters.meetup}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="meetup-past">{translate("Meetups")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="hackathon"
                  id="hackathon-past"
                  name="hackathon-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters.hackathon}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="hackathon-past">
                  {translate("Hackathons")}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="ama"
                  id="ama-past"
                  name="ama-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters.ama}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="ama-past">{translate("AMAs")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="cc"
                  id="cc-past"
                  name="cc-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters.cc}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="cc-past">{translate("Community Calls")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="zone"
                  id="zone-past"
                  name="zone-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters.zone}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="zone-past">{translate("XRPL Zone")}</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  defaultValue="info"
                  id="info-past"
                  name="info-past"
                  type="checkbox"
                  className="events-filter"
                  checked={pastFilters["info"]}
                  onChange={handlePastFilterChange}
                />
                <label htmlFor="info-past">{translate("Info Session")}</label>
              </div>
            </div>
          </div>
          <div className="mt-2 mb-0 row row-cols-1 row-cols-lg-3 card-deck ">
            {filteredPast.map((event, i) => (
              <a
                key={event.name + i}
                className="event-card {event.type}"
                href={event.link}
                target="_blank"
              >
                <div
                  className="event-card-header"
                  style={{
                    backgroundImage: `url(/img/events/${event.image})`,
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="event-card-title">
                    {translate(event.name)}
                  </div>
                </div>
                <div className="event-card-body">
                  <p>{translate(event.description)}</p>
                </div>
                <div className="mt-lg-auto event-card-footer d-flex flex-column">
                  <span className="mb-2 d-flex icon icon-location">
                    {event.location}
                  </span>
                  <span className="d-flex icon icon-date">{event.date}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

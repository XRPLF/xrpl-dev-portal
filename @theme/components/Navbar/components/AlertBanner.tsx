import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import moment from "moment-timezone";
import { arrowUpRight } from "../constants/icons";

interface AlertBannerProps {
  message: string;
  button: string;
  link: string;
  show: boolean;
}

/**
 * Alert Banner Component.
 * Displays a promotional banner at the top of the page.
 */
export function AlertBanner({ message, button, link, show }: AlertBannerProps) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const bannerRef = React.useRef<HTMLAnchorElement>(null);
  // Use null initial state to avoid hydration mismatch - server and client both render null initially
  const [displayDate, setDisplayDate] = React.useState<string | null>(null);

  React.useEffect(() => {
    const calculateCountdown = () => {
      const target = moment.tz('2025-06-11 08:00:00', 'Asia/Singapore');
      const now = moment();
      const daysUntil = target.diff(now, 'days');

      let newDisplayDate = "JUNE 10-12";
      if (daysUntil > 0) {
        newDisplayDate = daysUntil === 1 ? 'IN 1 DAY' : `IN ${daysUntil} DAYS`;
      } else if (daysUntil === 0) {
        const hoursUntil = target.diff(now, 'hours');
        newDisplayDate = hoursUntil > 0 ? 'TODAY' : "JUNE 10-12";
      }

      setDisplayDate(newDisplayDate);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    
    const handleMouseEnter = () => {
      banner.classList.add("has-hover");
    };
    
    banner.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      banner.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!show) return null;

  return (
    <a
      href={link}
      target="_blank"
      ref={bannerRef}
      className="top-banner fixed-top web-banner"
      rel="noopener noreferrer"
      aria-label="Get Tickets for the APEX 2025 Event"
    >
      <div className="banner-event-details">
        <div className="event-info">{translate(message)}</div>
        <div className="event-date">{displayDate ?? "JUNE 10-12"}</div>
      </div>
      <div className="banner-button">
        <div className="button-text">{translate(button)}</div>
        <img className="button-icon" src={arrowUpRight} alt="Get Tickets Icon" />
      </div>
    </a>
  );
}


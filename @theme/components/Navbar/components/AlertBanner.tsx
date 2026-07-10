import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
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
      aria-label={translate("Get Tickets for the APEX 2025 Event")}
    >
      <div className="banner-event-details">
        <div className="event-info">{translate(message)}</div>
        <div className="event-date">{translate("JUNE 10-12")}</div>
      </div>
      <div className="banner-button">
        <div className="button-text">{translate(button)}</div>
        <img className="button-icon" src={arrowUpRight} alt="" />
      </div>
    </a>
  );
}


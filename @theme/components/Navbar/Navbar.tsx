import * as React from "react";
import { useThemeConfig, useThemeHooks } from "@redocly/theme/core/hooks";
import { LanguagePicker } from "@redocly/theme/components/LanguagePicker/LanguagePicker";
import { slugify } from "../../helpers";
import { Link } from "@redocly/theme/components/Link/Link";
import { ColorModeSwitcher } from "@redocly/theme/components/ColorModeSwitcher/ColorModeSwitcher";
import { Search } from "@redocly/theme/components/Search/Search";
import arrowUpRight from "../../../static/img/icons/arrow-up-right-custom.svg";
import moment from "moment-timezone";

// @ts-ignore

const alertBanner = {
  show: false,
  message: "APEX 2025",
  button: "REGISTER",
  link: "https://www.xrpledgerapex.com/?utm_source=xrplwebsite&utm_medium=direct&utm_campaign=xrpl-event-ho-xrplapex-glb-2025-q1_xrplwebsite_ari_arp_bf_rsvp&utm_content=cta_btn_english_pencilbanner"
};

export function AlertBanner({ message, button, link, show }) {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const bannerRef = React.useRef(null);
  const [displayDate, setDisplayDate] = React.useState("JUNE 10-12");

  React.useEffect(() => {
    const calculateCountdown = () => {
      // Calculate days until June 11, 2025 8AM Singapore time
      // This will automatically adjust for the user's timezone
      const target = moment.tz('2025-06-11 08:00:00', 'Asia/Singapore');
      const now = moment();
      const daysUntil = target.diff(now, 'days');

      // Show countdown if event is in the future, otherwise show the provided date
      let newDisplayDate = "JUNE 10-12";
      if (daysUntil > 0) {
        newDisplayDate = daysUntil === 1 ? 'IN 1 DAY' : `IN ${daysUntil} DAYS`;
      } else if (daysUntil === 0) {
        // Check if it's today
        const hoursUntil = target.diff(now, 'hours');
        newDisplayDate = hoursUntil > 0 ? 'TODAY' : "JUNE 10-12";
      }

      setDisplayDate(newDisplayDate);
    };

    // Calculate immediately
    calculateCountdown();

    // Update every hour
    const interval = setInterval(calculateCountdown, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    const handleMouseEnter = () => {
      banner.classList.add("has-hover");
    };
    // Attach the event listener
    banner.addEventListener("mouseenter", handleMouseEnter);
    // Clean up the event listener on unmount
    return () => {
      banner.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (show) {
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
          <div className="event-date">{displayDate}</div>
        </div>
        <div className="banner-button">
          <div className="button-text">{translate(button)}</div>
          <img
            className="button-icon"
            src={arrowUpRight}
            alt="Get Tickets Icon"
          />
        </div>
      </a>
    );
  }
  return null;
}
export function Navbar(props) {
  // const [isOpen, setIsOpen] = useMobileMenu(false);
  const themeConfig = useThemeConfig();
  const { useL10n } = useThemeHooks();
  const { changeLanguage } = useL10n();
  const menu = themeConfig.navbar?.items;
  const logo = themeConfig.logo;

  const { href, altText, items } = props;
  const pathPrefix = "";

  const navItems = menu.map((item, index) => {
    if (item.type === "group") {
      return (
        <NavDropdown
          key={index}
          label={item.label}
          labelTranslationKey={item.labelTranslationKey}
          items={item.items}
          pathPrefix={pathPrefix}
        />
      );
    } else {
      return (
        <NavItem key={index}>
          <Link to={item.link} className="nav-link">
            {item.label}
          </Link>
        </NavItem>
      );
    }
  });

  React.useEffect(() => {
    // Turns out jQuery is necessary for firing events on Bootstrap v4
    // dropdowns. These events set classes so that the search bar and other
    // submenus collapse on mobile when you expand one submenu.
    const dds = $("#topnav-pages .dropdown");
    const top_main_nav = document.querySelector("#top-main-nav");
    dds.on("show.bs.dropdown", (evt) => {
      top_main_nav.classList.add("submenu-expanded");
    });
    dds.on("hidden.bs.dropdown", (evt) => {
      top_main_nav.classList.remove("submenu-expanded");
    });
    // Close navbar on .dropdown-item click
    const toggleNavbar = () => {
      const navbarToggler = document.querySelector(".navbar-toggler");
      const isNavbarCollapsed =
        navbarToggler.getAttribute("aria-expanded") === "true";
      if (isNavbarCollapsed) {
        navbarToggler?.click(); // Simulate click to toggle navbar
      }
    };

    const dropdownItems = document.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      item.addEventListener("click", toggleNavbar);
    });

    // Cleanup function to remove event listeners
    return () => {
      dropdownItems.forEach((item) => {
        item.removeEventListener("click", toggleNavbar);
      });
    };
  }, []);

  return (
    <>
      <AlertBanner {...alertBanner} />
      <NavWrapper belowAlertBanner={alertBanner.show}>
        <LogoBlock to={href} img={logo} alt={altText} />
        <NavControls>
          <MobileMenuIcon />
        </NavControls>
        <TopNavCollapsible>
          <NavItems>
            {navItems}
            <div id="topnav-search" className="nav-item search">
              <Search className="topnav-search" />
            </div>
            <div id="topnav-language" className="nav-item">
              <LanguagePicker
                onChangeLanguage={changeLanguage}
                onlyIcon
                alignment="end"
              />
            </div>
            <div id="topnav-theme" className="nav-item">
              <ColorModeSwitcher />
            </div>
          </NavItems>
        </TopNavCollapsible>
      </NavWrapper>
    </>
  );
}

export function TopNavCollapsible({ children }) {
  return (
    <div
      className="collapse navbar-collapse justify-content-between"
      id="top-main-nav"
    >
      {children}
    </div>
  );
}

export function NavDropdown(props) {
  const { label, items, pathPrefix, labelTranslationKey } = props;
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const dropdownGroups = items.map((item, index) => {
    if (item.items) {
      const groupLinks = item.items.map((item2, index2) => {
        const cls2 = item2.external
          ? "dropdown-item external-link"
          : "dropdown-item";
        let item2_href = item2.link;
        if (item2_href && !item2_href.match(/^https?:/)) {
          item2_href = pathPrefix + item2_href;
        }
        //conditional specific for brand kit
        if (item2.link === "/XRPL_Brand_Kit.zip") {
          return (
            <a key={index2} href="/XRPL_Brand_Kit.zip" className={cls2}>
              {translate(item2.labelTranslationKey, item2.label)}
            </a>
          );
        }
        return (
          <Link key={index2} className={cls2} to={item2_href}>
            {translate(item2.labelTranslationKey, item2.label)}
          </Link>
        );
      });

      const clnm = "navcol col-for-" + slugify(item.label);

      return (
        <div key={index} className={clnm}>
          <h5 className="dropdown-item">
            {translate(item.labelTranslationKey, item.label)}
          </h5>
          {groupLinks}
        </div>
      );
    } else if (item.icon) {
      const hero_id = "dropdown-hero-for-" + slugify(label);
      const img_alt = item.label + " icon";

      let hero_href = item.link;
      if (hero_href && !hero_href.match(/^https?:/)) {
        hero_href = pathPrefix + hero_href;
      }
      const splitlabel = item.label.split(" || ");
      let splittranslationkey = ["", ""];
      if (item.labelTranslationKey) {
        splittranslationkey = item.labelTranslationKey.split(" || ");
      }
      const newlabel = translate(splittranslationkey[0], splitlabel[0]);
      const description = translate(splittranslationkey[1], splitlabel[1]); // splitlabel[1] might be undefined, that's ok

      return (
        <Link
          key={index}
          className="dropdown-item dropdown-hero"
          id={hero_id}
          to={hero_href}
        >
          <img id={item.hero} alt={img_alt} src={item.icon} />
          <div className="dropdown-hero-text">
            <h4>{newlabel}</h4>
            <p>{description}</p>
          </div>
        </Link>
      );
    } else {
      const cls = item.external
        ? "dropdown-item ungrouped external-link"
        : "dropdown-item ungrouped";
      let item_href = item.link;
      if (item_href && !item_href.match(/^https?:/)) {
        item_href = pathPrefix + item_href;
      }
      return (
        <Link key={index} className={cls} to={item_href}>
          {translate(item.labelTranslationKey, item.label)}
        </Link>
      );
    }
  });

  const toggler_id = "topnav_" + slugify(label);
  const dd_id = "topnav_dd_" + slugify(label);

  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id={toggler_id}
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span>{translate(labelTranslationKey, label)}</span>
      </a>
      <div className="dropdown-menu" aria-labelledby={toggler_id} id={dd_id}>
        {dropdownGroups}
      </div>
    </li>
  );
}

export function NavWrapper(props) {
  return (
    <nav
      className="top-nav navbar navbar-expand-lg navbar-dark fixed-top"
      style={props.belowAlertBanner ? { marginTop: "52px" } : {}}
    >
      {props.children}
    </nav>
  );
}

export function NavControls(props) {
  return (
    <button
      className="navbar-toggler collapsed"
      type="button"
      data-toggle="collapse"
      data-target="#top-main-nav"
      aria-controls="navbarHolder"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      {props.children}
    </button>
  );
}

export function MobileMenuIcon() {
  return (
    <span className="navbar-toggler-icon">
      <div></div>
    </span>
  );
}

export function GetStartedButton() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <Link
      className="btn btn-primary"
      to={"/docs/tutorials"}
      style={{ height: "38px", paddingTop: "11px" }}
    >
      {translate("Get Started")}
    </Link>
  );
}

export function NavItems(props) {
  return (
    <ul className="nav navbar-nav" id="topnav-pages">
      {props.children}
    </ul>
  );
}

export function NavItem(props) {
  return <li className="nav-item">{props.children}</li>;
}

export function LogoBlock(props) {
  const { to, img, altText } = props;
  return (
    <Link className="navbar-brand" to="/">
      <img className="logo" alt={"XRP LEDGER"} height="40" src="data:," />
    </Link>
  );
}

export class ThemeToggle extends React.Component {
  auto_update_theme() {
    const upc = window.localStorage.getItem("user-prefers-color");
    let theme = "dark"; // Default to dark theme
    if (!upc) {
      // User hasn't saved a preference specifically for this site; check
      // the browser-level preferences.
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
      ) {
        theme = "light";
      }
    } else {
      // Follow user's saved setting.
      theme = upc == "light" ? "light" : "dark";
    }
    const disable_theme = theme == "dark" ? "light" : "dark";
    document.documentElement.classList.add(theme);
    document.documentElement.classList.remove(disable_theme);
  }

  user_choose_theme() {
    const new_theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    window.localStorage.setItem("user-prefers-color", new_theme);
    document.body.style.transition = "background-color .2s ease";
    const disable_theme = new_theme == "dark" ? "light" : "dark";
    document.documentElement.classList.add(new_theme);
    document.documentElement.classList.remove(disable_theme);
  }

  render() {
    return (
      <div className="nav-item" id="topnav-theme">
        <form className="form-inline">
          <div
            className="custom-control custom-theme-toggle form-inline-item"
            title=""
            data-toggle="tooltip"
            data-placement="left"
            data-original-title="Toggle Dark Mode"
          >
            <input
              type="checkbox"
              className="custom-control-input"
              id="css-toggle-btn"
              onClick={this.user_choose_theme}
            />
            <label className="custom-control-label" htmlFor="css-toggle-btn">
              <span className="d-lg-none">Light/Dark Theme</span>
            </label>
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.auto_update_theme();
  }
}

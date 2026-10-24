import * as React from "react";
import { createPortal } from "react-dom";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import Button from "shared/components/Button";
import { Link } from "shared/components/Link";
import clsx from "clsx";
import {
  MaterialArrowDownwardIcon,
  XrplArrowInternalLinkIcon,
} from "shared/components/Icons";
import numLight from "../static/js/ecosystem/numbers-animation-light.json";
import numDark from "../static/js/ecosystem/numbers-animation.json";
import ecosystem from "../@theme/data/ecosystem-projects.json";

export const frontmatter = {
  seo: {
    title: 'Use Cases & Featured Projects',
    description: "Here's how the XRP Ledger is used to power innovative technology across the payments and public blockchain landscape.",
  }
};

import { useLottie } from "lottie-react";
import { useThemeFromClassList } from "../@theme/helpers";

type Project = {
  slug: string;
  name: string;
  description: string;
  url: string;
  logo: string | null;
  logoOnDark?: boolean;
  categories: string[];
};

// From the XRPL Commons ecosystem map. Refresh with tools/fetch-ecosystem-map.py
const cardsData: Project[] = ecosystem.projects;

const categoryCounts = cardsData.reduce<Record<string, number>>((counts, card) => {
  card.categories.forEach((category) => {
    counts[category] = (counts[category] || 0) + 1;
  });
  return counts;
}, {});

// Shown first in each category's popup; the rest follow alphabetically.
const spotlight: string[] = ecosystem.spotlight;

function popupLogos(category: string) {
  const rank = (card: Project) => {
    const index = spotlight.indexOf(card.slug);
    return index === -1 ? spotlight.length : index;
  };
  return cardsData
    .filter((card) => card.logo && card.categories.includes(category))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, 7);
}

// The hero counter is a Lottie "slot machine": each digit is a text column of
// 0-9 that scrolls up behind a mask and stops on its digit. Rebuild it so it
// lands on the number of projects listed on this page.
const DIGIT_HEIGHT = 191.95; // one row of a digit column, in animation units
const PLUS_OFFSET = 79.507; // the "+" sits this far right of the last column
const COUNTER_WIDTH = 218; // width of .numbers-animation at four digits

function counterAnimation(base, count: number) {
  const data = JSON.parse(JSON.stringify(base));
  const digits = String(count).split("").map(Number);
  const columns = data.layers
    .filter((layer) => layer.ty === 5 && /^0+$/.test(layer.nm))
    .sort((a, b) => a.nm.length - b.nm.length);
  if (digits.length > columns.length) {
    return base;
  }
  columns.forEach((layer, i) => {
    if (i >= digits.length) {
      // Drop the unused column and the mask layer just above it.
      data.layers.splice(data.layers.indexOf(layer) - 1, 2);
      return;
    }
    layer.t.d.k[0].s.t = [...Array(10).keys(), ...Array(digits[i] + 1).keys()].join("\r");
    const [start, end] = layer.ks.p.k;
    const distance = -DIGIT_HEIGHT * (10 + digits[i]);
    end.s = [start.s[0], start.s[1] + distance, 0];
    start.to = [0, distance / 6, 0];
    start.ti = [0, -distance / 6, 0];
  });
  const plus = data.layers.find((layer) => layer.nm === "+");
  const plusGap = base.w - plus.ks.p.k[0];
  plus.ks.p.k[0] = columns[digits.length - 1].ks.p.k[0].s[0] + PLUS_OFFSET;
  data.w = Math.ceil(plus.ks.p.k[0] + plusGap);
  return data;
}

const counterDark = counterAnimation(numDark, cardsData.length);
const counterLight = counterAnimation(numLight, cardsData.length);

const featured_categories = {
  infrastructure: "Infrastructure",
  developer_tooling: "Developer Tooling",
};

const other_categories = {
  interoperability: "Interoperability",
  wallet: "Wallet",
  nfts: "NFTs",
  exchanges: "Exchanges",
  gaming: "Gaming",
  security: "Security",
  payments: "Payments",
  sustainability: "Sustainability",
  cbdc: "CBDC",
  custody: "Custody",
};

const category_names = { ...featured_categories, ...other_categories };

const uses = [
  {
    id: "infrastructure",
    title: "Infrastructure",
    description:
      "Build and operate components or systems that help the functionality of the XRP Ledger, such as Nodes, dev tools, storage, security and more."
  },

  {
    id: "developer_tooling",
    title: "Developer Tooling",
    description:
      "Developers can leverage open-source libraries, SDKs and more to help build their project and access essential XRP Ledger functionality."
  },
  {
    id: "interoperability",
    title: "Interoperability",
    description:
      "Developers and node operators can build and run custom sidechains while leveraging the XRPL's lean and efficient feature set."
  },
  {
    id: "wallet",
    title: "Wallet",
    description:
      "Build digital wallets to store passwords and interact with various blockchains to send and receive digital assets, including XRP."
  },
  {
    id: "nfts",
    title: "NFTs",
    description:
      "XRPL supports the issuance of IOUs that represent a currency of any value, as well as non-fungible tokens (NFTs)."
  },
  {
    id: "exchanges",
    title: "Exchanges",
    description:
      "Build sophisticated exchanges where users can invest and trade crypto and assets such as stocks, ETFs, and commodities."
  },
  {
    id: "gaming",
    title: "Gaming",
    description:
      "The XRPL supports gaming at high speed given its reliable throughput, low fees, and sidechain interoperability."
  },
  {
    id: "security",
    title: "Security",
    description:
      "Build services and tools that help prevent and combat fraudulent activity with the XRPL."
  },

  {
    id: "payments",
    title: "Payments",
    description:
      "Leverage the efficiency and speed of the XRP Ledger to move value all over the globe."
  },

  {
    id: "cbdc",
    title: "CBDC",
    description:
      "A private version of the XRP Ledger provides Central Banks a secure, controlled, and flexible solution to issue and manage Central Bank Issued Digital Currencies (CBDCs)."
  },

  {
    id: "sustainability",
    title: "Sustainability",
    description:
      "Use the XRP Ledger to tokenize carbon offsets as non-fungible tokens (NFTs)."
  },

  {
    id: "custody",
    title: "Custody",
    description:
      "Use the XRP Ledger to build crypto custody and securely hold, store and use your assets."
  },
];

function CategoryFilterForm({
  idPrefix,
  featuredCount,
  otherCount,
  selectedCategories,
  toggleCategory,
  translate,
}: {
  idPrefix: string;
  featuredCount: number;
  otherCount: number;
  selectedCategories: Set<string>;
  toggleCategory: (category: string) => void;
  translate: (key: string, defaultValue?: string) => string;
}) {
  return (
    <form>
      <p className="category-header mb-4">
        {translate("Featured Categories")}{" "}
        <span className="featured_count category_count">{featuredCount}</span>
      </p>
      {Object.keys(featured_categories).map((item) => (
        <div key={item} className="cat_checkbox category-checkbox pb-2">
          <input
            className={`events-filter input_${item}`}
            type="checkbox"
            name="categories"
            id={`${idPrefix}_${item}`}
            value={item}
            onChange={() => toggleCategory(item)}
            checked={selectedCategories.has(item)}
          />
          <label className="font-weight-bold" htmlFor={`${idPrefix}_${item}`}>
            {translate(featured_categories[item])}
          </label>
        </div>
      ))}
      <p className="category-header pt-5 mt-3 mb-4">
        {translate("Other Categories")}{" "}
        <span className="other_count category_count">{otherCount}</span>
      </p>
      {Object.keys(other_categories).map((item) => (
        <div key={item} className="cat_checkbox category-checkbox pb-2">
          <input
            className={`events-filter input_${item}`}
            type="checkbox"
            name="categories"
            id={`${idPrefix}_${item}`}
            value={item}
            onChange={() => toggleCategory(item)}
            checked={selectedCategories.has(item)}
          />
          <label htmlFor={`${idPrefix}_${item}`}>
            {translate(other_categories[item])}
          </label>
        </div>
      ))}
    </form>
  );
}

export default function Uses() {
  const theme = useThemeFromClassList(["dark", "light"]);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [displayModal, setDisplayModal] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [modalPortalTarget, setModalPortalTarget] = React.useState<HTMLElement | null>(null);
  const [filterModalOpen, setFilterModalOpen] = React.useState(false);
  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  const categoryFilterModalRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setModalPortalTarget(document.body);
  }, []);
  React.useEffect(() => {
    const modal = categoryFilterModalRef.current;
    if (!modal) {
      return;
    }
    const stripAriaHidden = () => {
      modal.removeAttribute("aria-hidden");
    };
    const returnFocusToOpener = () => {
      const active = document.activeElement;
      if (active instanceof HTMLElement && modal.contains(active)) {
        active.blur();
      }
      filterButtonRef.current?.focus();
    };
    const onShow = () => {
      stripAriaHidden();
      modal.removeAttribute("inert");
      setFilterModalOpen(true);
    };
    const onHide = () => {
      returnFocusToOpener();
    };
    const onHidden = () => {
      returnFocusToOpener();
      stripAriaHidden();
      modal.setAttribute("inert", "");
      setFilterModalOpen(false);
    };
    stripAriaHidden();
    const observer = new MutationObserver(stripAriaHidden);
    observer.observe(modal, { attributes: true, attributeFilter: ["aria-hidden"] });
    modal.addEventListener("show.bs.modal", onShow);
    modal.addEventListener("hide.bs.modal", onHide);
    modal.addEventListener("hidden.bs.modal", onHidden);
    return () => {
      observer.disconnect();
      modal.removeEventListener("show.bs.modal", onShow);
      modal.removeEventListener("hide.bs.modal", onHide);
      modal.removeEventListener("hidden.bs.modal", onHidden);
    };
  }, [modalPortalTarget]);
  const defaultSelectedCategories = new Set(Object.keys(featured_categories));

  const [selectedCategories, setSelectedCategories] = React.useState(
    defaultSelectedCategories
  );
  const [cards, setCards] = React.useState(cardsData);

  const toggleCategory = (category) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(category)) {
      newSelectedCategories.delete(category);
    } else {
      newSelectedCategories.add(category);
    }
    setSelectedCategories(newSelectedCategories);
  };

  const filteredCards = cards.filter((card) =>
    card.categories.some((category) => selectedCategories.has(category))
  );
  const featuredCount = Array.from(selectedCategories).filter((category) =>
    featured_categories.hasOwnProperty(category)
  ).length;
  const otherCount = Array.from(selectedCategories).filter((category) =>
    other_categories.hasOwnProperty(category)
  ).length;

  const modalRef = React.useRef(null); // Create a reference
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setDisplayModal(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, displayModal]);

  const handleArrowClick = (direction) => {
    let newIndex = currentIndex;
    if (direction === "left" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === "right" && currentIndex < uses.length - 1) {
      newIndex = currentIndex + 1;
    }
    setModalData(uses[newIndex]);
    setCurrentIndex(newIndex);
  };

  React.useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        setDisplayModal(false);
      }
    };

    if (displayModal) {
      window.addEventListener("keydown", closeOnEscape);
    }

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [displayModal]);

  const options = React.useMemo(() => {
    return {
      animationData: theme === "dark" ? counterDark : counterLight,
      loop: false,
    };
  }, [theme]);
  const [modalData, setModalData] = React.useState({
    id: "",
    title: "",
    description: "",
  });
  const { View } = useLottie(options);

  const UpdateModalContent = ({ id, title, description }) => {
    const logoArray = popupLogos(id);
    const createLogoElement = (project: Project) => {
      return (
        <span
          key={project.slug}
          className={clsx("logo-item", project.logoOnDark && "logo-item--dark")}
        >
          <img src={project.logo} alt={project.name} loading="lazy" />
        </span>
      );
    };

    const renderLogoRows = () => {
      if (logoArray.length === 0) return null;

      let topRow = [];
      let bottomRow = [];
      let bottomRowStyle = {};

      if (logoArray.length === 7) {
        topRow = logoArray.slice(0, 4);
        bottomRow = logoArray.slice(4);
      } else if (logoArray.length === 6) {
        topRow = logoArray.slice(0, 3);
        bottomRow = logoArray.slice(3);
      } else if (logoArray.length === 5) {
        topRow = logoArray.slice(0, 3);
        bottomRow = logoArray.slice(3);
        bottomRowStyle = { justifyContent: "center" };
      } else if (logoArray.length === 4) {
        topRow = logoArray.slice(0, 2);
        bottomRow = logoArray.slice(2);
        bottomRowStyle = { justifyContent: "center" };
      } else {
        topRow = logoArray;
      }

      return (
        <>
          <div className="top-row">
            {topRow.map((project) => createLogoElement(project))}
          </div>
          {bottomRow.length > 0 && (
            <div className="bottom-row" style={bottomRowStyle}>
              {bottomRow.map((project) => createLogoElement(project))}
            </div>
          )}
        </>
      );
    };

    return (
      <>
        <div className="arrows-container" id="arrows-container">
          {currentIndex !== 0 && (
            <button
              className="arrow-button left-arrow"
              id="leftArrow"
              style={{ position: "absolute", left: "0" }}
              onClick={() => handleArrowClick("left")}
            >
              <img alt="left arrow" />
            </button>
          )}
          {currentIndex !== uses.length - 1 && (
            <button
              className="arrow-button right-arrow"
              id="rightArrow"
              style={{ position: "absolute", right: "0" }}
              onClick={() => handleArrowClick("right")}
            >
              <img alt="right arrow" />
            </button>
          )}
        </div>
        <div className="content-section">
          <img
            className="section-image"
            alt="section image"
            width={40}
            height={40}
            id={id}
          />
        </div>
        <div className="content-section">
          <p className="section-text-title">{translate(title)}</p>
        </div>
        <div className="content-section">
          <p className="section-text-description">{translate(description)}</p>
        </div>
        <div className="content-section">
          <hr className="section-separator" />
        </div>
        <div className="content-section">
          <div className="section-logos px-5">{renderLogoRows()}</div>
        </div>
      </>
    );
  };
  return (
    <div className="landing page-uses landing-builtin-bg">
      <div>
        <div className="overflow-hidden">
          <section className="container-new py-26 text-lg-center">
            <div className="p-3 col-lg-8 mx-lg-auto">
              <div className="d-flex flex-column-reverse">
                <h1 className="mb-0">
                  {translate("Powering Innovative Use Cases and Projects")}
                </h1>
                <h6 className="eyebrow mb-3">{translate("XRPL Ecosystem")}</h6>
              </div>
            </div>
          </section>
          <section className="container-new py-26">
            <div className="col-lg-5 p-3">
              <div className="d-flex flex-column-reverse">
                <div className="d-flex justify-content-start align-items-center">
                  <Link
                    href="#use_case_companies_list"
                    intention="neutral"
                    variation="standalone"
                    size="lg"
                  >
                    {translate('Explore Featured Projects')}
                    <MaterialArrowDownwardIcon />
                  </Link>
                </div>
                <p className="text-sm">
                  {translate(
                    "The XRPL has a rich ecosystem with many contributors globally. Explore the community of developers, validators, and partners."
                  )}
                </p>
                <h6 className="eyebrow mb-3">
                  {translate("Introducing the XRPL Ecosystem")}
                </h6>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-2 p-5 d-flex">
              <div
                className="mb-4 pb-3 numbers-animation"
                style={{ width: (COUNTER_WIDTH * counterDark.w) / numDark.w }}
              >
                {View}
              </div>
              <div className="apps-built">
                {translate('about.uses.apps-build-1', 'Apps/exchanges ')}<br />
                {translate('about.uses.apps-build-2', 'built on the ')}<br />
                {translate('about.uses.apps-build-3', 'XRPL')}
              </div>
            </div>
            <ul
              className="card-grid use-cases-grid ls-none mt-4 pt-lg-2"
              id="use-case-card-grid"
            >
              {uses.map((use, index) => (
                <li key={use.id} className="col ls-none p-3 use-case-circle-parent">
                  <button
                    type="button"
                    className="use-case-circle open-modal"
                    data-id={use.id}
                    data-title={use.title}
                    data-description={use.description}
                    data-number={categoryCounts[use.id] || 0}
                    aria-haspopup="dialog"
                    onClick={() => {
                      setModalData(use);
                      setDisplayModal(true);
                      setCurrentIndex(index);
                    }}
                  >
                    <div className="circle-content">
                      <img className="circle-img" id={use.id} alt="" />
                      <p className="circle-text">{translate(use.title)}</p>
                      <div className="pill-box">
                        <span className="pill-number">{categoryCounts[use.id] || 0}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <div
            className={`modal modal-uses ${modalData?.id} ${displayModal ? "d-block" : ""}`}
            id="myModal"
          >
            <div
              ref={modalRef} // Attach the reference to the modal
              className="modal-content-uses"
            >
              <UpdateModalContent
                id={modalData?.id}
                title={modalData?.title}
                description={modalData?.description}
              />
            </div>
          </div>
          <section className="join-xrpl-section py-26">
            <div className="colorful-join-text-wrapper">
              <span className="colorful-join-text">
                {translate('Join the XRPL Ecosystem and showcase your XRPL project, application, or product. Get featured on the Developer Reflections blog.')}
              </span>
              <div className="mt-10">
                <Button
                  intention="neutral"
                  emphasis="strong"
                  target="_blank"
                  href="https://xrplresources.org/developer-spotlight"
                  iconEnd={<XrplArrowInternalLinkIcon />}
                >
                  {translate("Submit Your Project")}
                </Button>
              </div>
            </div>
          </section>
          <section className="container-new py-26">
            <div className="col-12 col-lg-8 col-xl-6 p-3 mb-5">
              <div className="d-flex flex-column-reverse">
                <h3 className="h4 h2-sm">
                  {translate("about.uses.businesses.h3part1","Businesses and developers")}
                  <br className="until-sm" />
                  {translate("about.uses.businesses.h3part2", "rely on the XRP Ledger")}
                </h3>
                <h6 className="eyebrow mb-3">
                  {translate("Solving Real-World Problems")}
                </h6>
              </div>
              <p className="mb-0 longform mt-8-until-sm mt-3 ">
                {translate(
                  "With intentional innovations, tools and documentation that accelerate development and minimize time to market, XRP Ledger is used to create solutions across an expansive range of industries and use cases."
                )}
              </p>
              <p className="mb-0 mt-3">
                {translate("about.uses.source-1", "Listings come from the ")}
                <Link href="https://map.xrpl-commons.org" target="_blank">
                  {translate("about.uses.source-2", "XRPL Commons ecosystem map")}
                </Link>
                {translate("about.uses.source-3", ", where you can add or update a project.")}
              </p>
            </div>
            <button
              ref={filterButtonRef}
              type="button"
              className="btn d-block d-lg-none"
              data-bs-toggle="modal"
              data-bs-target="#categoryFilterModal"
              aria-haspopup="dialog"
              aria-controls="categoryFilterModal"
              aria-expanded={filterModalOpen}
            >
              <span className="me-3">
                <svg
                  className="category-filter-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <line x1="4" y1="6.375" x2="20" y2="6.375" stroke="currentColor"/>
                  <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor"/>
                  <line x1="4" y1="17.75" x2="20" y2="17.75" stroke="currentColor"/>
                  <rect x="9.5" y="10.25" width="3.5" height="3.5" rx="0.5" fill="white" stroke="currentColor"/>
                  <rect x="13.625" y="16" width="3.5" height="3.5" rx="0.5" fill="white" stroke="currentColor"/>
                  <rect x="14.375" y="4.5" width="3.5" height="3.5" rx="0.5" fill="white" stroke="currentColor"/>
                </svg>
              </span>
              {translate("Filter by Categories")}
              <span className="ms-3 total_count category_count">
                {selectedCategories.size}
              </span>
            </button>
            {modalPortalTarget &&
              createPortal(
                <div className="page-uses" style={{ display: "contents" }}>
                  <div
                    ref={categoryFilterModalRef}
                    className="modal fade"
                    id="categoryFilterModal"
                    tabIndex={-1}
                    role="dialog"
                    aria-modal={filterModalOpen}
                    aria-labelledby="categoryFilterModalLabel"
                    inert={!filterModalOpen}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body">
                          <h2 id="categoryFilterModalLabel" className="visually-hidden">
                            {translate("Filter by Categories")}
                          </h2>
                          <div className="p-3">
                            <CategoryFilterForm
                              idPrefix="input_mobile"
                              featuredCount={featuredCount}
                              otherCount={otherCount}
                              selectedCategories={selectedCategories}
                              toggleCategory={toggleCategory}
                              translate={translate}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                    <Button type="button" data-bs-dismiss="modal">
                      {translate("Apply")}
                    </Button>
                    <Button
                      type="button"
                      intention="neutral"
                      emphasis="subtle"
                      data-bs-dismiss="modal"
                    >
                      {translate("Cancel")}
                    </Button>
                  </div>
                      </div>
                    </div>
                  </div>
                </div>,
                modalPortalTarget
              )}
            {/* Start company cards */}
            <div className="row col-12 m-0 p-0 mt-4 pt-2">
              <div className="left col-3 m-0 p-0 mt-2 d-none d-lg-block">
                {/* Side bar Desktop.  */}
                <div className="p-3 category_sidebar">
                  <CategoryFilterForm
                    idPrefix="input"
                    featuredCount={featuredCount}
                    otherCount={otherCount}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    translate={translate}
                  />
                </div>
                {/* End sidebar desktop */}
              </div>
              {/* cards */}
              <div
                className="right row col row-cols-lg-2 m-2 p-0"
                id="use_case_companies_list"
              >
                {filteredCards.map((card) => (
                  <a
                    key={card.slug}
                    className="card-uses"
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="card-body d-flex flex-column">
                      <span
                        className={clsx("biz-logo-frame mb-4", card.logoOnDark && "biz-logo-frame--dark")}
                      >
                        {card.logo ? (
                          <img className="biz-logo" src={card.logo} alt="" loading="lazy" />
                        ) : (
                          <span className="biz-logo-name" aria-hidden="true">{card.name}</span>
                        )}
                      </span>
                      <h4 className="card-title h6">{card.name}</h4>
                      <p className="card-text">{card.description}</p>
                      <div className="mt-auto d-flex flex-wrap gap-2">
                        {card.categories.map((category) => (
                          <span key={category} className={`label label-use-${category}`}>
                            {translate(category_names[category])}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {/* end cards */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

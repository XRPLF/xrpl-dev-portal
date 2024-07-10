import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Link } from "@redocly/theme/components/Link/Link";
import moment from "moment";

export const frontmatter = {
  seo: {
    title: "XRP Ledger Community Blog",
    description: "Browse the XRP Ledger Community Blog.",
  },
};

const target = { prefix: "" }; // TODO: fixme

const categories = {
  general: "General",
  release_notes: "Release Notes",
  advisories: "Advisories",
  amendments: "Amendments",
  development: "Development",
  developer_reflections: "Developer Reflections",
  features: "Features",
  security: "Security",
};

export default function Index() {
  const { useTranslate, usePageSharedData } = useThemeHooks();
  const { translate } = useTranslate();
  const { blogPosts } = usePageSharedData<any>("blog-posts");

  const heroPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);
  const defaultSelectedCategories = new Set(Object.keys(categories));

  const [selectedCategories, setSelectedCategories] = useState(
    defaultSelectedCategories
  );

  const [cards, setCards] = useState(otherPosts);

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
    selectedCategories.has(card.category_id)
  );

  const [open, setOpen] = useState(false);

  return (
    <div className="landing dev-blog">
      <div className="justify-content-center align-items-lg-center">
        <div className="position-relative d-none-sm">
          <img
            alt="background purple waves"
            src={require("../static/img/backgrounds/home-purple.svg")}
            id="blog-purple"
          />
        </div>
        <section className="py-lg-5 text-center mt-lg-5">
          <div className="mx-auto text-center col-lg-5">
            <div className="d-flex flex-column">
              <h6 className="eyebrow mb-3">{translate("XRPL Community")}</h6>
              <h1 className="mb-3">{translate("XRPL Blog")}</h1>
            </div>
          </div>
        </section>

        {/* Banner */}
        <section className="container-new">
          <div className="row justify-content-center align-items-lg-center">
            {/* Banner Image */}
            <div className="image-container">
              <img
                alt="blog hero"
                src={require("../static/img/blog/blog-hero.svg")}
                className="w-100"
              />
            </div>
            {/* Text */}
            <div className="col">
              <div className="text-bg">
                <h4 className="mb-3 eyebrow text-uppercase font-weight-light">
                  <span className="post-date pb-2">
                    {moment(heroPost.date).format(translate("blog.banner.date.part1","MMM"))}
                  </span>
                  {translate("blog.banner.date.part2", " ")}
                  {moment(heroPost.date).format(translate("blog.banner.date.part3","DD YYYY"))}
                </h4>
                <div className="pb-8">
                  <div
                    className={`d-inline-block mb-2 label blog-category-${heroPost.category_id}`}
                  >
                    {translate(`${heroPost.category}`)}
                  </div>
                </div>
                <h4 className="mb-8 h2-sm font-weight-bold">
                  <Link to={`/blog/${heroPost.link}`}>
                    {translate(`${heroPost.title}`)}
                  </Link>
                </h4>
                <p className="mb-4">{translate(`${heroPost.description}`)}</p>
                <div className="d-lg-block">
                  <Link
                    className="btn btn-primary btn-arrow"
                    to={`/blog/${heroPost.link}`}
                  >
                    {translate("Read More")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Blog Posts*/}
        <section className="container-new py-26">
          <div className="row w-100 mx-auto px-2">
            <div className="col-lg-4 m-0 p-0 mt-2">
              {/* Filters Desktop*/}
              <div className="p-3 category_sidebar d-none d-lg-block">
                <p className="mb-2 category-header">{translate("Filter by Category:")}</p>
                <div className="d-flex flex-column p-3">
                  {Object.keys(categories).map((item) => (
                    <div key={item} className="category-checkbox pb-2">
                      <input
                        className={`blog-filter input_${item}`}
                        type="checkbox"
                        name="categories"
                        id={`input_${item}`}
                        defaultValue={`${item}`}
                        onChange={() => toggleCategory(item)}
                        defaultChecked
                      />
                      <label
                        className="font-weight-bold"
                        htmlFor={`input_${item}`}
                      >
                        {translate(categories[item])}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* End Desktop Filters */}
              {/* Filters Mobile */}
              <div className="col d-flex flex-column p-0 d-lg-none mb-4">
                <p className="mb-2 category-header">{translate("Filter by:")}</p>
                <div className="dropdown">
                  <button
                    className="dropdown-btn"
                    onClick={() => setOpen((open) => !open)}
                  >
                    {translate("Category")}
                    <img alt="dropdown arrow" />
                  </button>
                  {open && (
                    <div
                      className="dropdown-content d-flex flex-column mt-2"
                      aria-labelledby="blog-dropdown-button"
                    >
                      {Object.keys(categories).map((item, i) => (
                        <div key={item + i} className="category-checkbox pl-2 pb-2">
                          <input
                            className={`blog-filter input_${item}`}
                            type="checkbox"
                            name="categories"
                            id={`input_${item}`}
                            defaultValue={`${item}`}
                            onChange={() => toggleCategory(item)}
                            defaultChecked
                          />
                          <label
                            className="font-weight-bold"
                            htmlFor={`input_${item}`}
                          >
                            {translate(categories[item])}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* End Filters Mobile */}
            </div>
            {/* Cards */}
            <div className="row col row-cols-lg-2 m-0 p-0">
              {filteredCards.map((card, i) => (
                <div
                  key={card.title + i}
                  className={`${card.category_id} pb-5 px-lg-4`}
                  id={card.title + i}
                >
                  <div className="mb-4" id="category-list">
                    <img
                      alt="card block"
                      id={`${card.category_id}`}
                      className="mb-4"
                    />
                    <div
                      className={`d-inline-block label blog-category-${card.category_id}`}
                    >
                      {translate(card.category)}
                    </div>
                  </div>
                  <div>
                    <p id="card-date" className="mb-0">
                      {moment(card.date).format(translate("blog.card.date","MMM DD, YYYY"))}
                      { card.author ? ` by ${card.author}` : ""}
                    </p>
                    <h5 className="mb-2-sm h3-sm">
                      <Link to={`/blog/${card.link}`}>
                      {translate(card.title)}
                      </Link>
                    </h5>
                  </div>
                  <div className="d-lg-block">
                    <p className="line-clamp">{translate(card.description)}</p>
                  </div>
                  <div className="d-lg-block">
                    <Link
                      className="btn btn-primary btn-arrow"
                      to={`/blog/${card.link}`}
                    >
                      {translate("Read More")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

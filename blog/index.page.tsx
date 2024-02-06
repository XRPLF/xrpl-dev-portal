import * as React from "react";
import { useState } from "react";
import { useTranslate, usePageSharedData } from "@portal/hooks";
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
  gateway_bulletins: "Gateway Bulletins",
  features: "Features",
  security: "Security",
};

export default function Index() {
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
                alt="default-alt-text"
                src={require("../static/img/blog/blog-hero.svg")}
                className="w-100"
              />
            </div>
            {/* Text */}
            <div className="col">
              <div className="text-bg">
                <h4 className="mb-3 eyebrow text-uppercase font-weight-light">
                  <span
                    style={{
                      textDecoration: "overline solid #32E685 10%",
                      paddingBottom: "4px",
                    }}
                  >
                    {translate(`${moment(heroPost.date).format("MMM")}`)}
                  </span>
                  {translate(` ${moment(heroPost.date).format("DD YYYY")}`)}
                </h4>
                <div className="pb-8">
                  <p
                    id={`${heroPost.category_id}-badge`}
                    className="category-badge"
                  >
                    {translate(`${heroPost.category}`)}
                  </p>
                </div>
                <h4 className="mb-8 h2-sm font-weight-bold">
                  {translate(`${heroPost.title}`)}
                </h4>
                <p className="mb-4">{translate(`${heroPost.description}`)}</p>
                <div className="d-lg-block">
                  <a
                    className="btn btn-primary btn-arrow"
                    href={`${heroPost.link}`}
                  >
                    {translate("Read More")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Blog Posts*/}
        <section className="container-new py-26">
          <div className="row col-12 m-0 p-0 mt-4 pt-2">
            <div className="left col-3 m-0 p-0 mt-2 d-none d-lg-block">
              {/* Filters Desktop*/}
              <div className="p-3 category_sidebar">
                <p className="mb-3 category-header">Filter by Category:</p>
                <div className="d-flex flex-column p-3">
                  {Object.keys(categories).map((item) => (
                    <div
                      key={item}
                      className="cat_checkbox category-checkbox pb-2"
                    >
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
            </div>
            {/* Cards */}
            <div className="right row col row-cols-lg-2 m-0 p-0">
              {filteredCards.map((card, i) => (
                <div
                  key={card.title + i}
                  className={`${card.category_id} col-sm pb-5 px-lg-4`}
                  id={card.title + i}
                >
                  <div className="mb-4" id="category-list">
                    <img
                      alt="default-alt-text"
                      id={`${card.category_id}`}
                      className="w-100 mb-4"
                    />
                    <p
                      id={`${card.category_id}-badge`}
                      className="category-badge mb-5"
                    >
                      {translate(card.category)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p id="card-date" className="mb-0">
                      {moment(translate(card.date)).format("MMM DD, YYYY")}
                    </p>
                    <h5 className="mb-2-sm h3-sm">{translate(card.title)}</h5>
                  </div>
                  <div className="d-lg-block">
                    <p className="line-clamp">{translate(card.description)}</p>
                  </div>
                  <div className="d-lg-block">
                    <a
                      className="btn btn-primary btn-arrow"
                      href={`${card.link}`}
                    >
                      {translate("Read More")}
                    </a>
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

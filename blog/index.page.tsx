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
  none: "Other",
};

export default function Index() {
  const { translate } = useTranslate();
  const { blogPosts } = usePageSharedData<any>('blog-posts');
  for (const blog of blogPosts) {
    console.log(blog)
  }

  const defaultSelectedCategories = new Set(Object.keys(categories));

  const [selectedCategories, setSelectedCategories] = useState(
    defaultSelectedCategories
  );
  const [cards, setCards] = useState(blogPosts);

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
      <div className="mt-20">
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
              <h1 className="mb-0">{translate("XRPL Blog")}</h1>
            </div>
          </div>
        </section>
        {/* Latest Blog Post */}
        <section className="container-new py-16">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center mt-20">
            {/* Banner Image */}
            <div className="mb-2-sm">
              <img
                alt="default-alt-text"
                src={require("../static/img/blog/blog-hero.svg")}
                className="w-100 d-none-sm"
              />
            </div>
            {/* Text */}
            <div className="col justify-content-center px-lg-5 w-100">
              <div className="d-flex flex-column">
                <h4 className="mb-3 eyebrow text-uppercase font-weight-light">
                  <span
                    style={{
                      textDecoration: "overline solid #32E685 10%",
                      paddingBottom: "4px",
                    }}
                  >
                    {translate(`${moment(blogPosts[0].date).format("MMM")}`)}
                  </span>
                  {translate(` ${moment(blogPosts[0].date).format("DD YYYY")}`)}
                </h4>
                <div className="pb-8">
                  <p
                    className="badge badge-success w-full rounded-pill py-1 px-4 border"
                    style={{
                      background: "#145C35",
                      color: "#32E685",
                      borderColor: "#32E685 !important",
                    }}
                  >
                    {translate(`${blogPosts[0].category}`)}
                  </p>
                </div>
                <h2 className="mb-8 h4 h2-sm font-weight-bold">
                  {translate(`${blogPosts[0].title}`)}
                </h2>
              </div>
              <p className="mb-4">{translate(`${blogPosts[0].description}`)}</p>
              <div className="d-lg-block">
                <a
                  className="btn btn-primary btn-arrow"
                  href={`${blogPosts[0].link}`}
                >
                  {translate("Read More")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other Blog Posts*/}
        <section className="container-new py-26">
          <div className="row col-12 m-0 p-0 mt-4 pt-2">
            {/* Filters  */}
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
                      {categories[item]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Cards */}
            <div className="row col row-cols-lg-2 m-0 p-0">
              <div></div>
              {filteredCards.map((card, i) => (
                <a
                  key={card.title + i}
                  className={`event-card ${card.category_id}`}
                  href={card.link}
                  id={card.title + i}
                >
                  <div
                    className="event-card-header"
                    style={{
                      background: require("../static/img/events/Hackathons.png"),
                    }}
                  >
                    <div className="event-card-title">{translate(card.title)}</div>
                  </div>
                  <div className="event-card-body">
                    <p>{translate(card.description)}</p>
                  </div>
                  <div className="mt-lg-auto event-card-footer d-flex flex-column">
                    <span className="d-flex icon icon-date">{translate(card.date.toString())}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

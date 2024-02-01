import * as React from "react";
import { useTranslate } from "@portal/hooks";

export const frontmatter = {
  seo: {
    title: "XRP Ledger Community Blog",
    description: "Browse the XRP Ledger Community Blog.",
  },
};

const target = { prefix: "" }; // TODO: fixme

export default function Index() {
  const { translate } = useTranslate();

  return (
    <div className="landing">
      <div>
        <div className="position-relative d-none-sm">
          <img
            alt="background purple waves"
            src={require("../img/backgrounds/home-purple.svg")}
            className="position-absolute mt-20"
          />
        </div>
        <section className="py-26 text-center">
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
            <div className="mb-2">
              <img
                alt="default-alt-text"
                src={require("../static/img/blog/blog-hero.svg")}
                className="w-100"
              />
            </div>
            {/* Text */}
            <div className="col justify-content-center w-100 blog-hero-background">
              <div className="d-flex flex-column">
                <h4 className="mb-3 eyebrow text-uppercase font-weight-light">
                  <span
                    style={{
                      textDecoration: "overline solid #32E685 10%",
                      paddingBottom: "4px",
                    }}
                  >
                    {translate("Jan")}
                  </span>
                  {translate(" 09 2024")}
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
                    {translate("Release Notes")}
                  </p>
                </div>
                <h2 className="mb-8 h4 h2-sm font-weight-bold">
                  {translate("Introducing XRP Ledger version 2.0.1")}
                </h2>
              </div>
              <p className="mb-4">
                {translate(
                  "Lorem ipsum dolor sit amet consectetur. Justo sed lectus integer elit amet nibh hac in. In vitae mauris lectus in fringilla. Lorem nulla urna eget ipsum. Potenti fames nec est tincidunt vel praesent. Et at velit id purus consequat ut. Nulla sed mi amet morbi amet. A scelerisque proin mi purus. Pellentesque morbi ipsum gravida iaculis mi. Pellentesque malesuada neque pharetra sed. Curabitur nibh facilisi ut ac varius ut duis. Pretium turpis maecenas elementu..."
                )}
              </p>
              <div className="d-lg-block">
                <a
                  className="btn btn-primary btn-arrow"
                  href="blog/rippled-2.0.0/"
                >
                  {translate("Read More")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blogs and Filters */}
        <section className="container-new py-26">
          <p>SECTION</p>
        </section>
      </div>
    </div>
  );
}

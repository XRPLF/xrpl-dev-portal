import { useThemeHooks } from "@redocly/theme/core/hooks";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import { LinkTextDirectory } from "shared/sections/LinkTextDirectory/LinkTextDirectory";
import { CardsFeatured } from "shared/sections/CardsFeatured/CardsFeatured";
import { FeatureTwoColumn } from "shared/sections/FeatureTwoColumn/FeatureTwoColumn";

export const frontmatter = {
  seo: {
    title: "XRPL Community",
    description:
      "Build. Connect. Contribute. Wherever you are in your journey, the blockchain community is here to support, collaborate, and grow with you.",
  },
};

const HUBSPOT_NEWSLETTER_FORM =
  "https://share.hsforms.com/18zNvJDR4QbObGPLDh3n5Bw4vgrs";

export default function Community() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing">
      <HeaderHeroSplitMedia
        title={translate("Build. Connect. Contribute.")}
        subtitle={translate(
          "Wherever you are in your journey, the blockchain community is here to support, collaborate, and grow with you."
        )}
        primaryCta={{
          label: translate("Get Started Now"),
          href: HUBSPOT_NEWSLETTER_FORM,
        }}
        media={{
          src: require("../static/img/bds-2026/community-hero-media.jpg"),
          alt: translate("Build. Connect. Contribute."),
        }}
      />

      <LinkTextDirectory
        heading={translate("Join the Conversation")}
        description={translate(
          "Wherever you are in your journey, the blockchain community is here to support, collaborate, and grow with you."
        )}
        cards={[
          {
            heading: translate("Join the Discord"),
            description: translate(
              "The heart of XRPL developer conversation. Get support, share progress, and meet fellow builders."
            ),
            buttons: [
              {
                label: translate("Join Now"),
                href: "https://discord.com/invite/xrpl",
              },
            ],
          },
          {
            heading: translate("Subscribe to the Newsletter"),
            description: translate(
              "Monthly updates on key projects, proposals, and events."
            ),
            buttons: [
              {
                label: translate("Subscribe Now"),
                href: HUBSPOT_NEWSLETTER_FORM,
              },
            ],
          },
          {
            heading: translate("Follow XRPLF/ on X"),
            description: translate(
              "Stay on top of the latest ecosystem news, releases, and highlights."
            ),
            buttons: [
              {
                label: translate("Follow Now"),
                href: "https://x.com/XRPLF",
              },
            ],
          },
          {
            heading: translate("Meet the Community"),
            description: translate(
              "Whether you’re running an XRPL-focused workshop or meetup, or want the latest on upcoming crypto community events!"
            ),
            buttons: [
              {
                label: translate("Meet Now"),
                href: "https://xrpl.org/community/events",
              },
            ],
          },
        ]}
      />

      <CardsFeatured
        heading={translate(
          "Discover projects, tooling, and contributors building on XRPL."
        )}
        description=""
        cards={[
          {
            image: require("../static/img/bds-2026/community-feature-media-1.jpg"),
            imageAlt: translate("XRPL Developer Reflections"),
            title: translate("XRPL Developer Reflections"),
            subtitle: translate(
              "Submit your project or tool and get visibility and feedback from the broader blockchain community!"
            ),
            buttonLabel: translate("Submit Project"),
            href: "https://xrpl.org/blog",
          },
          {
            image: require("../static/img/bds-2026/community-feature-media-2.jpg"),
            imageAlt: translate("Moments Revisited"),
            title: translate("Moments Revisited"),
            subtitle: translate(
              "Catch up on moments from Apex, developer demos, and community AMAs."
            ),
            buttonLabel: translate("Events"),
            href: "https://xrpl.org/community/events",
          },
          {
            image: require("../static/img/bds-2026/community-feature-media-3.jpg"),
            imageAlt: translate("XRPL Learning Portal"),
            title: translate("XRPL Learning Portal"),
            subtitle: translate(
              "Begin your learning journey with tutorials, courses and gamified experiences."
            ),
            buttonLabel: translate("Learning Portal"),
            href: "https://learn.xrpl.org/",
          },
        ]}
      />

      <FeatureTwoColumn
        color="yellow"
        arrange="right"
        title={translate("Join the Community")}
        description={translate(
          "Join our community and stay connected. Get the latest updates, insights, and opportunities — delivered straight to your inbox."
        )}
        links={[
          {
            label: translate("Sign Up to Newsletter"),
            href: HUBSPOT_NEWSLETTER_FORM,
          },
        ]}
        media={{
          src: require("../static/img/bds-2026/community-feature-media-4.jpg"),
          alt: translate("Join the Community"),
        }}
      />
    </div>
  );
}

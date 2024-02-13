import * as React from 'react';
import styled from 'styled-components';
import { useThemeConfig } from '@theme/hooks/useThemeConfig';
import { useTranslate } from '@portal/hooks';
import { useLocation } from 'react-router-dom'; 

export function BlogFooter(props) {
    const themeConfig = useThemeConfig();
    const { pathname } = useLocation();
    const { translate } = useTranslate();

    // Provide different footer links for the Blog site.
    if (pathname.includes("blog")) {
      themeConfig.footer.items = [
        {
          label: translate("Learn"),
          type: "group",
          items: [
            {
              type: "link",
              fsPath: "about/index.page.tsx",
              label: translate("Overview"),
              link: "/about/",
            },
            {
              type: "link",
              fsPath: "about/uses.page.tsx",
              label: translate("Uses"),
              link: "/about/uses",
            },
            {
              type: "link",
              fsPath: "about/history.page.tsx",
              label: translate("History"),
              link: "/about/history",
            },
            {
              type: "link",
              fsPath: "about/impact.page.tsx",
              label: translate("Impact"),
              link: "/about/impact",
            },
            {
              type: "link",
              fsPath: "about/impact.page.tsx",
              label: translate("Carbon Calculator"),
              link: "/about/impact",
            },
          ],
        },
        {
          label: translate("Explore"),
          type: "group",
          items: [
            {
              type: "link",
              fsPath: "/docs/introduction/crypto-wallets.md",
              label: translate("Wallets"),
              link: "/docs/introduction/crypto-wallets",
            },
            {
              type: "link",
              fsPath: "about/xrp.page.tsx",
              label: translate("Exchanges"),
              link: "/about/xrp",
            },
            {
              type: "link",
              fsPath: "about/uses.page.tsx",
              label: translate("Businesses"),
              link: "/about/uses",
            },
            {
              type: "link",
              fsPath: "",
              label: translate("Ledger Explorer"),
              link: "https://livenet.xrpl.org/",
            },
          ],
        },
        {
          label: translate("Build"),
          type: "group",
          items: [
            {
              type: "link",
              fsPath: "/docs/tutorials/index.md",
              label: translate("Get Started"),
              link: "/docs/tutorials",
            },
            {
              type: "link",
              fsPath: "/docs/index.page.tsx",
              label: translate("Docs"),
              link: "/docs/",
            },
            {
              type: "link",
              fsPath: "/resources/dev-tools/index.page.tsx",
              label: translate("Dev Tools"),
              link: "/resources/dev-tools/",
            },
            {
              type: "link",
              fsPath: "/blog/index.page.tsx",
              label: translate("Dev Blog"),
              link: "/blog/",
            },
          ],
        },
        {
          label: translate("Contribute"),
          type: "group",
          items: [
            {
              type: "link",
              fsPath: "/resources/contribute-code/index.md",
              label: translate("How to Contribute"),
              link: "/resources/contribute-code",
            },
            {
              type: "link",
              fsPath: "",
              label: translate("XRPL on Github"),
              link: "https://github.com/XRPLF/xrpl-dev-portal",
              external: true,
            },
          ],
        },
      ];
    }

    // NOTE: We don't render anything because we only want to change the footer data, 
    // but the design should remain the same.
    return null;
}

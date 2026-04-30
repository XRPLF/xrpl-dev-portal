import { useMemo } from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";

import type { StandardCardPropsWithoutVariant } from "shared/components/StandardCard";
import { BdsLink } from "shared/components/Link";
import { StandardCardGroupSection } from "shared/sections/StandardCardGroupSection/StandardCardGroupSection";

export function HomeBeginJourneySection() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  const cards = useMemo<readonly StandardCardPropsWithoutVariant[]>(
    () => [
      {
        headline: translate("Documentation"),
        children: translate(
          "Access the documentation you need to get started working with the XRPL.",
        ),
        callsToAction: [
          { children: translate(" Documentation"), href: "/docs" },
        ] as const,
      },
      {
        headline: translate("Guided Tutorials"),
        children: translate(
          "Follow step-by-step tutorials for frequent tasks.",
        ),
        callsToAction: [
          { children: translate("Start Tutorials"), href: "/tutorials" },
        ] as const,
      },
      {
        headline: translate("XRPL Fundamentals"),
        children: translate(
          "Read about the XRPL's foundational concepts.",
        ),
        callsToAction: [
          {
            children: translate("Foundational Concepts"),
            href: "/fundamentals",
          },
        ] as const,
      },
      {
        headline: translate("Client Libraries"),
        children: (
          <span>
            Find tools, documentation, and sample code in{" "}
            <BdsLink
              variant="inline"
              href="/docs/tutorials/get-started/get-started-python"
            >
              Python
            </BdsLink>
            ,{" "}
            <BdsLink
              variant="inline"
              href="/docs/tutorials/get-started/get-started-java"
            >
              Java
            </BdsLink>
            ,{" "}
            <BdsLink
              variant="inline"
              href="/docs/tutorials/get-started/get-started-javascript?environment=Node"
            >
              JavaScript
            </BdsLink>
            , or use
            <BdsLink
              variant="inline"
              href="/docs/tutorials/get-started/get-started-http-websocket-apis"
            >
              HTTP APIs
            </BdsLink>
            .
          </span>
        ),
        callsToAction: [
          {
            children: translate("Explore Client Libraries"),
            href: "/docs/references/client-libraries",
          },
        ] as const,
      },
      {
        headline: translate("Get Inspired"),
        children: translate(
          "See what your peers have built on the XRPL.",
        ),
        callsToAction: [
          {
            children: translate("Built on the XRPL"),
            href: "/showcase",
          },
        ] as const,
      },
      {
        headline: translate("XRPL Learning Portal"),
        children: (
          <span>
            Start with the basics and then learn about{" "}
            <BdsLink variant="inline" href="/docs/use-cases/defi">
              DeFi
            </BdsLink>
            ,{" "}
            <BdsLink variant="inline" href="/docs/use-cases/tokenization">
              tokenization
            </BdsLink>
            ,{" "}
            <BdsLink
              variant="inline"
              href="/docs/concepts/tokens/decentralized-exchange"
            >
              DEX
            </BdsLink>{" "}
            trading, or how to issue stablecoins.
          </span>
        ),
        callsToAction: [
          {
            children: translate("Learn Now"),
            href: "/introduction",
          },
        ] as const,
      },
    ],
    [translate],
  );

  return (
    <StandardCardGroupSection
      variant="blue"
      headline={translate("Begin Your Journey")}
      description={translate(
        "XRPL delivers immediate value: faster, cheaper settlement with broad access and full-stack flexibility. XRPL is built for the evolving financial system.",
      )}
      cards={cards}
    />
  );
}

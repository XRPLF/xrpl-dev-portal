import * as React from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router";
import { useThemeHooks } from "@redocly/theme/core/hooks";
import { Button } from "shared/components/Button";
import {
  XrplArrowExternalLinkIcon,
  XrplArrowInternalLinkIcon,
} from "shared/components/Icons";
import { Link } from "shared/components/Link";
import { PageGrid } from "shared/components/PageGrid/page-grid";
import { PageWrapper } from "shared/components/PageWrapper";
import { PanelStack, type PanelStackPanel } from "shared/patterns/PanelStack";
import { SectionHeader } from "shared/patterns/SectionHeader";
import { HeaderHeroSplitMedia } from "shared/sections/HeaderHeroSplitMedia/HeaderHeroSplitMedia";
import {
  StandardCardGroupSection,
  type StandardCardPropsWithoutVariant,
} from "shared/sections/StandardCardGroupSection/StandardCardGroupSection";
import {
  PersonaPicker,
  type PersonaPickerHandle,
} from "./funding-hub/PersonaPicker";
import {
  FUNDING_ORGANIZATIONS,
  FUNDING_PERSONAS,
  FUNDING_PROGRAMS,
  FUNDING_STAGE_ORDER,
  type FundingOrganization,
  type FundingOrganizationId,
  type FundingPersonaId,
  type FundingProgram,
} from "./funding-hub/funding-data";

export const frontmatter = {
  seo: {
    title: "Developer Funding",
    description:
      "Find grants, accelerators, incubators, training, and rewards for building on the XRP Ledger, from across the ecosystem, in one place.",
  },
};

const PAGE_PATH = "/community/developer-funding";

/** Query parameter that deep-links to a persona, for example ?for=student */
const PERSONA_PARAM = "for";

const FINDER_ID = "find-your-program";

function isPersonaId(value: string | null): value is FundingPersonaId {
  return FUNDING_PERSONAS.some((persona) => persona.id === value);
}

function isExternal(url: string): boolean {
  return !url.startsWith("/");
}

/**
 * Orders programs along the builder journey (learn, build, launch, grow).
 * For a persona, programs where it is the primary audience come first within
 * each stage. Array.prototype.sort is stable, so data order breaks ties.
 */
function orderPrograms(
  programs: readonly FundingProgram[],
  personaId: FundingPersonaId | null
): FundingProgram[] {
  return [...programs].sort((a, b) => {
    const byStage =
      FUNDING_STAGE_ORDER.indexOf(a.stage) - FUNDING_STAGE_ORDER.indexOf(b.stage);
    if (byStage !== 0 || !personaId) {
      return byStage;
    }
    return a.personas.indexOf(personaId) - b.personas.indexOf(personaId);
  });
}

function programsFor(personaId: FundingPersonaId | null): FundingProgram[] {
  const matching = personaId
    ? FUNDING_PROGRAMS.filter((program) => program.personas.includes(personaId))
    : FUNDING_PROGRAMS;
  return orderPrograms(matching, personaId);
}

function findOrganization(id: FundingOrganizationId) {
  return FUNDING_ORGANIZATIONS.find((entry) => entry.id === id);
}

/**
 * An organization's logo as published. White-only logos sit on the
 * organization's brand color; dark logos sit directly on the card.
 */
function OrganizationLogo({
  organization,
  alt,
  size,
}: {
  organization: FundingOrganization;
  alt: string;
  size: "card" | "panel";
}) {
  if (!organization.logo) {
    return null;
  }
  return (
    <span
      className={clsx(
        "funding-hub-logo",
        size === "panel" && "funding-hub-logo--panel",
        organization.logoBackground && "funding-hub-logo--on-brand"
      )}
      style={
        organization.logoBackground
          ? { backgroundColor: organization.logoBackground }
          : undefined
      }
    >
      <img className="funding-hub-logo__image" src={organization.logo} alt={alt} />
    </span>
  );
}

export default function DeveloperFunding() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const pickerRef = React.useRef<PersonaPickerHandle>(null);

  const [personaId, setPersonaId] = React.useState<FundingPersonaId | null>(
    null
  );
  // Only announce changes the visitor makes, not the initial ?for= read
  const [hasInteracted, setHasInteracted] = React.useState(false);

  // The URL is the source of truth. Reading it in an effect keeps the server
  // render unfiltered, so every program is in the static HTML.
  React.useEffect(() => {
    const value = new URLSearchParams(search).get(PERSONA_PARAM);
    setPersonaId(isPersonaId(value) ? value : null);
  }, [search]);

  const choosePersona = (next: FundingPersonaId | null) => {
    setHasInteracted(true);
    setPersonaId(next);
    const params = new URLSearchParams(search);
    if (next) {
      params.set(PERSONA_PARAM, next);
    } else {
      params.delete(PERSONA_PARAM);
    }
    const query = params.toString();
    navigate(
      { search: query ? `?${query}` : "", hash },
      { replace: true, preventScrollReset: true }
    );
  };

  const showAllPrograms = () => {
    // The button disappears once the filter clears, so move focus first to
    // the tile that becomes the picker's tab stop
    pickerRef.current?.focus(0);
    choosePersona(null);
  };

  const countLabel = (count: number) =>
    count === 1
      ? translate("1 program")
      : translate("{{count}} programs", { count });

  const persona = FUNDING_PERSONAS.find((entry) => entry.id === personaId);
  const visiblePrograms = programsFor(personaId);

  const personaOptions = FUNDING_PERSONAS.map((entry) => ({
    id: entry.id,
    title: translate(entry.title),
    description: translate(entry.description),
    icon: entry.icon,
    countLabel: countLabel(programsFor(entry.id).length),
  }));

  const externalLinkLabel = (label: string, name: string) =>
    translate("{{label}}: {{name}} (opens in a new tab)", { label, name });

  const programCards: StandardCardPropsWithoutVariant[] = visiblePrograms.map(
    (program) => {
      const organization = findOrganization(program.organizationId);
      const name = translate(program.name);
      // Partner programs name their operator in text; everything else shows
      // the organization's logo when it has one.
      const showLogo = !program.operator && Boolean(organization?.logo);
      const operatorText = program.operator
        ? translate(program.operator)
        : organization
          ? translate(program.organizationLabel ?? organization.name)
          : "";
      const showName =
        Boolean(organization?.showNameWithLogo) && !program.hideOrganizationName;
      const details = [
        translate(program.type),
        program.location ? translate(program.location) : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const primaryLabel = translate(program.ctaLabel ?? "Learn More");
      const primary = isExternal(program.url)
        ? {
            children: primaryLabel,
            href: program.url,
            target: "_blank" as const,
            iconEnd: <XrplArrowExternalLinkIcon />,
            "aria-label": externalLinkLabel(primaryLabel, name),
          }
        : {
            children: primaryLabel,
            href: program.url,
            iconEnd: <XrplArrowInternalLinkIcon />,
            "aria-label": translate("{{label}}: {{name}}", {
              label: primaryLabel,
              name,
            }),
          };

      const secondaryLabel = program.secondaryCta
        ? translate(program.secondaryCta.label)
        : "";
      const secondary = program.secondaryCta
        ? {
            children: secondaryLabel,
            href: program.secondaryCta.url,
            target: "_blank" as const,
            iconEnd: <XrplArrowExternalLinkIcon />,
            "aria-label": externalLinkLabel(secondaryLabel, name),
          }
        : undefined;

      return {
        headline: name,
        children: (
          <>
            <span className="funding-hub-card__org label-r">
              {showLogo && organization ? (
                <>
                  <OrganizationLogo
                    organization={organization}
                    alt={operatorText}
                    size="card"
                  />
                  {showName && <span aria-hidden="true">{operatorText}</span>}
                </>
              ) : (
                <span>{operatorText}</span>
              )}
            </span>
            <span className="funding-hub-card__meta label-r">{details}</span>
            <span className="funding-hub-card__summary">
              {translate(program.summary)}
            </span>
          </>
        ),
        callsToAction: (secondary
          ? [primary, secondary]
          : [primary]) as StandardCardPropsWithoutVariant["callsToAction"],
      };
    }
  );

  const statusText = persona
    ? translate("Showing {{shown}} of {{total}} programs for {{audience}}", {
        shown: visiblePrograms.length,
        total: FUNDING_PROGRAMS.length,
        audience: translate(persona.audience),
      })
    : translate("Not sure where you fit? All programs are listed below.");

  const organizationPanels: PanelStackPanel[] = FUNDING_ORGANIZATIONS.filter(
    (organization) => organization.image
  ).map((organization) => ({
    id: organization.id,
    features: [
      {
        title: (
          <>
            <OrganizationLogo organization={organization} alt="" size="panel" />
            {translate(organization.fullName ?? organization.name)}
          </>
        ),
        description: (
          <>
            {translate(organization.description)}
            <ul className="funding-hub-panel-links">
              {FUNDING_PROGRAMS.filter(
                (program) => program.organizationId === organization.id
              ).map((program) => (
                <li key={program.id}>
                  <span aria-hidden="true">→ </span>
                  <Link
                    href={program.url}
                    target={isExternal(program.url) ? "_blank" : undefined}
                    intention="neutral"
                  >
                    {translate(program.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ),
      },
    ],
    buttons: [
      {
        label: translate("Visit {{name}}", {
          name: translate(organization.name),
        }),
        href: organization.url,
      },
    ],
    imageSrc: organization.image as string,
    imageAlt: translate(organization.fullName ?? organization.name),
  }));

  // Keep the persona in the hero link so the URL stays shareable
  const finderHref = `${PAGE_PATH}${
    personaId ? `?${PERSONA_PARAM}=${personaId}` : ""
  }#${FINDER_ID}`;

  return (
    <PageWrapper className="landing">
      <HeaderHeroSplitMedia
        title={translate("Bring Your Vision to Life")}
        subtitle={translate(
          "Grants, accelerators, incubators, training, and rewards from across the XRP Ledger ecosystem, in one place. Choose your profile to see where to start."
        )}
        primaryCta={{
          label: translate("Find Your Program"),
          href: finderHref,
        }}
        media={{
          src: require("../static/img/bds-2026/community-developer-funding-hero-media.jpg"),
          alt: translate("Bring Your Vision to Life"),
        }}
      />

      <section
        id={FINDER_ID}
        className="funding-hub"
        aria-label={translate("Find your program")}
      >
        <PageGrid>
          <SectionHeader
            heading={translate("Find the Right Program for You")}
            description={translate(
              "Choose the profile that fits you best to see the programs built for it. Each organization runs its own programs on its own schedule."
            )}
          />
          <PageGrid.Row>
            <PageGrid.Col span={12} className="funding-hub__picker">
              <PersonaPicker
                ref={pickerRef}
                label={translate("Choose your profile")}
                options={personaOptions}
                selectedId={personaId}
                onSelect={(id) => choosePersona(id as FundingPersonaId)}
              />
              <div className="funding-hub__status">
                <p className="body-r" aria-live={hasInteracted ? "polite" : "off"}>
                  {statusText}
                </p>
                {persona && (
                  <Button
                    intention="neutral"
                    emphasis="subtle"
                    onClick={showAllPrograms}
                  >
                    {translate("Show All Programs")}
                  </Button>
                )}
              </div>
            </PageGrid.Col>
          </PageGrid.Row>
        </PageGrid>
      </section>

      <StandardCardGroupSection
        id="funding-programs"
        className="funding-hub-results"
        variant="neutral"
        headline={translate(persona ? persona.resultsHeading : "All Programs")}
        description={translate(
          persona
            ? persona.resultsDescription
            : "Grants, accelerators, incubators, training, and rewards for XRPL builders from across the ecosystem. Pick a profile above to narrow the list."
        )}
        cards={programCards}
      />

      <PanelStack
        heading={translate("Explore by Organization")}
        description={translate(
          "Each organization runs its own programs and applications. Go straight to the source to learn more."
        )}
        slides={organizationPanels}
        background="yellow"
      />
    </PageWrapper>
  );
}

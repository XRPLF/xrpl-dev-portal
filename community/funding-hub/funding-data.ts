/**
 * Programs listed on the funding hub (/community/funding).
 *
 * xrpl.org does not run any of these programs. Every entry links out to the
 * operator's own page, which is where people apply.
 *
 * To add an organization (for example XRP Asia):
 * 1. Add it to FUNDING_ORGANIZATIONS.
 * 2. Add its programs to FUNDING_PROGRAMS, listing the personas each one
 *    serves (primary audience first).
 * The persona tiles, counts and results pick it up without component changes.
 *
 * Rules for entries:
 * - Only list programs that have a public, working page from the operator.
 *   Prefer a program page; use the operator's official announcement or recap
 *   only when no program page exists. Check every url before merging.
 * - Keep each summary to one plain sentence.
 * - Don't state application status or dates. Programs open and close on their
 *   own schedules; the operator's page is the source of truth.
 *
 * All strings are English source text; the page passes them through
 * translate() at render time.
 *
 * Last verified against each operator's page: 2026-10-02.
 */

export type FundingPersonaId =
  | "student"
  | "researcher"
  | "developer"
  | "founder"
  | "business";

/** Where a program sits on the builder journey, used to order results */
export type FundingStage = "learn" | "build" | "launch" | "grow";

/** Every organization id. Add new organizations here first. */
export type FundingOrganizationId = "ripplex" | "xrpl-commons";

export interface FundingPersona {
  id: FundingPersonaId;
  /** Tile title */
  title: string;
  /** One line on the tile */
  description: string;
  /** Heading above the filtered programs */
  resultsHeading: string;
  /** Description above the filtered programs */
  resultsDescription: string;
  /** Plural audience for the status line, for example "students" */
  audience: string;
  icon: string;
}

export interface FundingOrganization {
  id: FundingOrganizationId;
  /** Short name used in card meta lines and buttons */
  name: string;
  /** Full name for the organization overview, if different */
  fullName?: string;
  /** One or two sentences for the organization overview */
  description: string;
  url: string;
  /** Overview image. Organizations without one are left out of the overview. */
  image?: string;
  /**
   * Official logo, shown on program cards and in the overview. Use the file
   * exactly as the organization publishes it; don't redraw or recolor it.
   */
  logo?: string;
  /**
   * For logos published in white only: the organization's brand color to
   * place the logo on. Omit for logos in dark ink.
   */
  logoBackground?: string;
  /** Show the short name next to the logo, when the logo doesn't spell it */
  showNameWithLogo?: boolean;
  /**
   * Program links for the organization overview, in headed groups. Omit to
   * list the organization's programs grouped by stage.
   */
  programGroups?: FundingProgramGroup[];
}

/**
 * A link in an overview group: a program from FUNDING_PROGRAMS by id, with an
 * optional label, or a program that isn't listed there.
 */
export type FundingProgramLink =
  | { programId: string; label?: string }
  | { name: string; url: string };

export interface FundingProgramGroup {
  heading: string;
  links: FundingProgramLink[];
}

export interface FundingProgram {
  id: string;
  name: string;
  organizationId: FundingOrganizationId;
  /** Who runs it, when that differs from the organization (partner programs) */
  operator?: string;
  /** Name shown next to the organization logo instead of its short name */
  organizationLabel?: string;
  /** Show the logo without a name, when the logo already spells it */
  hideOrganizationName?: boolean;
  /** Short label such as "Grant" or "Accelerator" */
  type: string;
  summary: string;
  /** Personas this program serves, primary audience first */
  personas: FundingPersonaId[];
  stage: FundingStage;
  /** Format or place, for example "Online" */
  location?: string;
  url: string;
  /** Button label. Defaults to "Learn More". */
  ctaLabel?: string;
  /** Optional second link, for a closely related resource */
  secondaryCta?: { label: string; url: string };
}

export const FUNDING_STAGE_ORDER: readonly FundingStage[] = [
  "learn",
  "build",
  "launch",
  "grow",
];

export const FUNDING_PERSONAS: readonly FundingPersona[] = [
  {
    id: "student",
    title: "Student",
    description:
      "Learning to build on XRPL, joining hackathons, or starting a project at university.",
    resultsHeading: "Programs for Students",
    audience: "students",
    resultsDescription:
      "Start with courses, training, and hackathons, then take your project further with university programs.",
    icon: require("../../static/img/icons/2026/black/graduation-cap.svg"),
  },
  {
    id: "researcher",
    title: "Researcher",
    description:
      "Studying blockchain, digital assets, or payments at a university or research lab.",
    resultsHeading: "Programs for Researchers",
    audience: "researchers",
    resultsDescription:
      "Research support, university partnerships, courses, and contests for academic work on blockchain and digital assets.",
    icon: require("../../static/img/icons/2026/black/research-flask.svg"),
  },
  {
    id: "developer",
    title: "Developer",
    description:
      "Writing code, tools, or open-source software for the XRP Ledger.",
    resultsHeading: "Programs for Developers",
    audience: "developers",
    resultsDescription:
      "Courses and protocol training, hackathons, grants, and rewards for open-source and security work.",
    icon: require("../../static/img/icons/2026/black/onchain-metadata.svg"),
  },
  {
    id: "founder",
    title: "Founder",
    description:
      "Building a startup and looking for funding, mentors, and a path to market.",
    resultsHeading: "Programs for Founders",
    audience: "founders",
    resultsDescription:
      "Grants, incubators, and accelerators that take a project from first build to launch and growth.",
    icon: require("../../static/img/icons/2026/black/Launch-Your-First-Project.svg"),
  },
  {
    id: "business",
    title: "Business",
    description:
      "An established company or fintech bringing a product to the XRP Ledger.",
    resultsHeading: "Programs for Businesses",
    audience: "businesses",
    resultsDescription:
      "Support for companies bringing financial products and integrations to the XRP Ledger.",
    icon: require("../../static/img/icons/2026/black/delegated-token-management.svg"),
  },
];

export const FUNDING_ORGANIZATIONS: readonly FundingOrganization[] = [
  {
    id: "ripplex",
    name: "Ripple",
    fullName: "RippleX Ecosystem Programs",
    description:
      "Ripple's programs for fintech teams building on XRPL: grants, accelerators with venture partners, hackathons, security bounties, and the FinTech Builder Program.",
    // Ripple has announced a dedicated XRPL funding hub. When it launches,
    // update this url and the RippleX program urls below.
    url: "https://ripple.com/",
    image: require("../../static/img/bds-2026/community-developer-funding-carousel-1.jpg"),
    // Ripple publishes no RippleX logo for light backgrounds; this is the
    // Ripple logo exactly as the ripple.com header shows it (2026-10-02).
    logo: require("../../static/img/logos/ripple-color.svg"),
    showNameWithLogo: true,
    programGroups: [
      {
        heading: "University Blockchain Research Initiative (UBRI)",
        links: [
          {
            programId: "student-builder-residency",
            label: "UBRI's Student Builder Residency",
          },
          {
            programId: "udax",
            label: "UBRI's University Digital Asset Xcelerator (UDAX)",
          },
        ],
      },
      {
        heading: "Bug Bounties",
        links: [{ programId: "ripple-bug-bounty" }],
      },
      {
        heading: "RippleX Ecosystem Growth Programs",
        links: [
          { programId: "ripplex-ecosystem-programs" },
          { programId: "fintech-program", label: "FinTech Program" },
        ],
      },
      {
        // Partner-run accelerators, listed here only rather than as program
        // cards. Tenity publishes one SFIIP page per cohort year; update it.
        heading: "Accelerator Program partners",
        links: [
          {
            name: "Hong Kong Financial Innovation Program (HFIP)",
            url: "https://brinc.io/xrpl-program",
          },
          {
            name: "Singapore Financial Infrastructure Innovation Program (SFIIP)",
            url: "https://www.tenity.com/program/sfiip-2026/",
          },
          { name: "FENASBAC Next", url: "https://next.fenasbac.io/" },
        ],
      },
    ],
  },
  {
    id: "xrpl-commons",
    name: "XRPL Commons",
    description:
      "The builder hub for XRPL: education, acceleration, and funding to launch and grow.",
    url: "https://www.xrpl-commons.org/",
    image: require("../../static/img/bds-2026/community-developer-funding-carousel-3.jpg"),
    // XRPL Commons publishes its current logo in white only (site header and
    // footer, 2026-10-02), so it sits on their navy rather than being recolored.
    logo: require("../../static/img/logos/xrpl-commons-white.svg"),
    logoBackground: "#000637",
  },
];

export const FUNDING_PROGRAMS: readonly FundingProgram[] = [
  // --- XRPL Commons -------------------------------------------------------
  {
    id: "xrpl-academy",
    name: "XRPL Academy",
    organizationId: "xrpl-commons",
    type: "Education",
    summary:
      "The XRPL Commons learning platform, with self-paced and cohort journeys for developers, entrepreneurs, and teachers.",
    personas: ["student", "developer", "founder", "researcher"],
    stage: "learn",
    location: "Online",
    url: "https://academy.xrpl-commons.org/",
  },
  {
    id: "commons-developer-training",
    name: "Building on the XRP Ledger",
    organizationId: "xrpl-commons",
    type: "Training",
    summary:
      "A free two-day training program for developers who want to start building on the XRP Ledger.",
    personas: ["developer", "student"],
    stage: "learn",
    location: "Online and in person",
    url: "https://www.xrpl-commons.org/build/training",
  },
  {
    id: "core-dev-online-bootcamp",
    name: "Core Dev Online Bootcamp",
    organizationId: "xrpl-commons",
    type: "Training",
    summary:
      "A self-paced course on the XRP Ledger's core protocol for intermediate and advanced C++ developers, with a certificate.",
    personas: ["developer"],
    stage: "learn",
    location: "Online, self-paced",
    url: "https://www.xrpl-commons.org/build/core-dev-online-bootcamp",
  },
  {
    id: "commons-hackathons",
    name: "XRPL Commons Hackathons",
    organizationId: "xrpl-commons",
    type: "Hackathon",
    summary:
      "In-person hackathons run by XRPL Commons, where teams build projects on the XRP Ledger.",
    personas: ["developer", "student", "founder"],
    stage: "build",
    location: "In person",
    url: "https://www.xrpl-commons.org/build/hackathons",
  },
  {
    id: "glow",
    name: "Glow",
    organizationId: "xrpl-commons",
    type: "Retroactive rewards",
    summary:
      "Rewards for completed open-source XRPL work such as tooling, documentation, standards, and protocol contributions.",
    personas: ["developer"],
    stage: "build",
    location: "Online",
    url: "https://glow.xrpl-commons.org/",
  },
  {
    id: "the-aquarium",
    name: "The Aquarium",
    organizationId: "xrpl-commons",
    type: "Incubator",
    summary:
      "An incubator for pre-seed and seed teams with an MVP on XRPL; graduates can apply for milestone-based grants.",
    personas: ["founder"],
    stage: "launch",
    location: "Online",
    url: "https://www.xrpl-commons.org/the-aquarium",
  },
  {
    // No dedicated grants page yet; the announcement describes the tracks.
    id: "commons-grants-program",
    name: "XRPL Commons Grants Program",
    organizationId: "xrpl-commons",
    type: "Grants",
    summary:
      "Funding across three tracks: Early stage direct grants, Glow, Make Waves (Buildathon)",
    personas: ["founder", "developer"],
    stage: "launch",
    url: "https://www.xrpl-commons.org/newsroom/introducing-the-xrpl-commons-grants-program",
    ctaLabel: "Read the Announcement",
  },
  {
    // Only public page is RippleX's recap of Cohort 3.0 (spring 2026); no
    // application page. Swap in a program page if UBRI publishes one.
    id: "student-builder-residency",
    name: "Student Builder Residency",
    organizationId: "ripplex",
    organizationLabel: "UBRI",
    type: "Residency",
    summary:
      "A UBRI residency where university students build and ship XRP Ledger projects with mentors, run in cohorts.",
    personas: ["student"],
    stage: "build",
    url: "https://student-builder-residency.notion.site/",
    ctaLabel: "Read About the Residency",
  },
  {
    id: "udax",
    name: "University Digital Asset Xcelerator (UDAX)",
    organizationId: "ripplex",
    organizationLabel: "UBRI",
    type: "Accelerator",
    summary:
      "A cohort accelerator from UBRI and partner universities, including UC Berkeley, FGV, and Oxford, open to founders building on XRPL.",
    personas: ["founder", "student"],
    stage: "launch",
    url: "https://ripple.com/insights/ripple-and-uc-berkeley-launch-the-university-digital-asset-xcelerator-udax-to-supercharge-the-xrp-ecosystem/",
  },

  // --- RippleX ------------------------------------------------------------
  // Several urls below are on xrplgrants.org; see the note in FUNDING_ORGANIZATIONS.
  {
    id: "ripple-bug-bounty",
    name: "Ripple Bug Bounty Programs",
    organizationId: "ripplex",
    hideOrganizationName: true,
    type: "Bug bounty",
    summary:
      "Invitation-based security bounties on Bugcrowd for the XRP Ledger, RLUSD, the XRPL EVM sidechain, and Ripple's own systems.",
    personas: ["developer"],
    stage: "build",
    location: "Online, by invitation",
    url: "https://ripple.com/legal/bug-bounty/",
  },
  {
    // Ripple's single intake for its ecosystem programs, including grants.
    id: "ripplex-ecosystem-programs",
    name: "RippleX Ecosystem Programs",
    organizationId: "ripplex",
    type: "Incentives and support",
    summary:
      "Accelerators, integration support, and milestone-based incentive funding for FinTech start-ups building on the XRPL. Currently available by invitation only.",
    personas: ["founder", "business", "developer"],
    stage: "launch",
    url: "https://xrplgrants.org/",
  },
  {
    // Announced February 2026 with no program page yet; the announcement is
    // a placeholder until Ripple publishes one.
    id: "fintech-program",
    name: "FinTech Program",
    organizationId: "ripplex",
    type: "FinTech program",
    summary:
      "Ripple's program for startups building institutional-grade financial apps. Launching soon.",
    personas: ["business", "founder"],
    stage: "grow",
    url: "https://ripple.com/insights/supporting-innovation-on-the-xrp-ledger/",
    ctaLabel: "Read the Announcement",
  },
];

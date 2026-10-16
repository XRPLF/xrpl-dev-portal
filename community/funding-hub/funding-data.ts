/**
 * Programs listed on the developer funding hub (/community/developer-funding).
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
export type FundingOrganizationId = "ripplex" | "ubri" | "xrpl-commons";

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
    name: "RippleX",
    fullName: "RippleX Ecosystem Programs",
    description:
      "Ripple's programs for teams building on XRPL: grants, accelerators with venture partners, hackathons, security bounties, and the FinTech Builder Program.",
    // Ripple has announced a dedicated XRPL funding hub. When it launches,
    // update this url and the RippleX program urls below.
    url: "https://xrplgrants.org/",
    image: require("../../static/img/bds-2026/community-developer-funding-carousel-1.jpg"),
    // Ripple publishes no RippleX logo for light backgrounds; this is the
    // Ripple logo exactly as the ripple.com header shows it (2026-10-02).
    logo: require("../../static/img/logos/ripple-color.svg"),
    showNameWithLogo: true,
  },
  {
    id: "ubri",
    name: "UBRI",
    fullName: "University Blockchain Research Initiative (UBRI)",
    description:
      "Ripple's university program, supporting blockchain research, technical development, and innovation at universities around the world.",
    url: "https://ripple.com/impact/ubri/",
    image: require("../../static/img/bds-2026/community-developer-funding-carousel-2.jpg"),
    // UBRI has no logo of its own; ripple.com/impact/ubri uses the Ripple logo.
    logo: require("../../static/img/logos/ripple-color.svg"),
    showNameWithLogo: true,
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
    name: "XRPL Hackathons",
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
      "Funding across three tracks: Glow, building on XRPL (including The Aquarium and Early Stage Grants), and Strategic Integrations.",
    personas: ["founder", "developer"],
    stage: "launch",
    url: "https://www.xrpl-commons.org/newsroom/introducing-the-xrpl-commons-grants-program",
    ctaLabel: "Read the Announcement",
  },
  {
    id: "commons-strategic-integrations",
    name: "Strategic Integrations",
    organizationId: "xrpl-commons",
    type: "Integration support",
    summary:
      "Technical and go-to-market support for proven teams with users on other chains that want to integrate the XRP Ledger.",
    personas: ["business"],
    stage: "grow",
    url: "https://www.xrpl-commons.org/newsroom/introducing-the-xrpl-commons-grants-program",
    ctaLabel: "Read the Announcement",
  },
  {
    id: "commons-adopt",
    name: "Adopt",
    organizationId: "xrpl-commons",
    type: "Advisory",
    summary:
      "XRPL Commons advisory for corporates and institutions, from discovery workshops to proofs of concept and scaling.",
    personas: ["business"],
    stage: "grow",
    url: "https://www.xrpl-commons.org/adopt",
  },
  {
    id: "doctorblock",
    name: "DoctorBlock",
    organizationId: "xrpl-commons",
    type: "Contest",
    summary:
      "A three-minute science communication contest for doctoral students and recent PhDs researching blockchain.",
    personas: ["researcher"],
    stage: "learn",
    location: "Final in Paris",
    url: "https://www.xrpl-commons.org/learn/doctorblock",
  },
  {
    id: "commons-university-partnerships",
    name: "University Partnerships",
    organizationId: "xrpl-commons",
    type: "Partnership",
    summary:
      "XRPL Commons works with universities on blockchain courses, teacher training, and research collaborations.",
    personas: ["researcher"],
    stage: "learn",
    url: "https://www.xrpl-commons.org/learn/university-partnerships",
  },

  // --- UBRI ---------------------------------------------------------------
  {
    id: "ubri",
    name: "University Blockchain Research Initiative",
    organizationId: "ubri",
    type: "University program",
    summary:
      "Ripple's partnership with more than 60 universities for blockchain research, courses, and student projects, reached through partner universities.",
    personas: ["researcher", "student"],
    stage: "learn",
    url: "https://ripple.com/impact/ubri/",
    secondaryCta: {
      // Paper database from UBRI partner universities, hosted by XRPL Commons
      label: "Browse the Research Corpus",
      url: "https://www.xrpl-commons.org/learn/ubri-research-database",
    },
  },
  {
    // Only public page is RippleX's recap of Cohort 3.0 (spring 2026); no
    // application page. Swap in a program page if UBRI publishes one.
    id: "student-builder-residency",
    name: "Student Builder Residency",
    organizationId: "ubri",
    type: "Residency",
    summary:
      "A UBRI residency where university students build and ship XRP Ledger projects with mentors, run in cohorts.",
    personas: ["student"],
    stage: "build",
    url: "https://dev.to/ripplexdev/ubri-student-builder-residency-cohort-30-a-new-frontier-for-high-impact-xrpl-innovation-3j18",
    ctaLabel: "Read About the Residency",
  },
  {
    id: "udax",
    name: "University Digital Asset Xcelerator (UDAX)",
    organizationId: "ubri",
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
    // Ripple co-hosts or sponsors these event by event (for example with
    // XRPL Commons, UBRI, or local partners), so link the evergreen events page.
    id: "ripplex-hackathons",
    name: "Hackathons and Builder Competitions",
    organizationId: "ripplex",
    type: "Hackathon",
    summary:
      "Ripple co-hosts and sponsors XRPL hackathons and builder competitions around the world, often with UBRI, XRPL Commons, and local partners.",
    personas: ["developer", "student", "founder"],
    stage: "build",
    location: "In person, worldwide",
    url: "/community/events",
    ctaLabel: "See Upcoming Events",
  },
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
    type: "Grants and support",
    summary:
      "Ripple's single application for grants, accelerator programs, technical mentorship, product integrations, and partnerships for XRPL projects.",
    personas: ["founder", "business", "developer"],
    stage: "launch",
    url: "https://submit.xrplgrants.org/submit",
  },
  {
    id: "xrpl-accelerator",
    name: "XRPL Accelerator",
    organizationId: "ripplex",
    type: "Accelerator",
    summary:
      "Ripple's accelerator for startups with an MVP on the XRP Ledger, run with partners such as Tenity and Fenasbac, with milestone-based grant funding.",
    personas: ["founder", "business"],
    stage: "grow",
    url: "https://xrplgrants.org/accelerator",
  },
  {
    id: "brinc-hfip",
    name: "Hong Kong Financial Innovation Program",
    organizationId: "ripplex",
    operator: "Brinc with Ripple",
    type: "Accelerator",
    summary:
      "A 12-week program led by Brinc with Ripple for startups building financial applications on XRPL, with a Demo Day in Hong Kong.",
    personas: ["founder"],
    stage: "grow",
    location: "Online, Demo Day in Hong Kong",
    url: "https://brinc.io/xrpl-program",
  },
  {
    // Tenity publishes one page per cohort year; update the url each year.
    id: "tenity-sfiip",
    name: "Singapore Financial Infrastructure Innovation Program",
    organizationId: "ripplex",
    operator: "Tenity with Ripple",
    type: "Accelerator",
    summary:
      "A six-week program by Tenity and Ripple for companies building institutional-grade financial products on the XRP Ledger.",
    personas: ["founder", "business"],
    stage: "grow",
    location: "Online, Demo Day in Singapore",
    url: "https://www.tenity.com/program/sfiip-2026/",
  },
  {
    // Portuguese-language site. Ripple and Mercado Bitcoin are listed as
    // maintainers of the current edition.
    id: "fenasbac-next",
    name: "Next",
    organizationId: "ripplex",
    operator: "Fenasbac with Ripple",
    type: "Accelerator",
    summary:
      "A fintech accelerator in Brazil run by Fenasbac, with Ripple among its maintainers, for startups building financial products.",
    personas: ["founder", "business"],
    stage: "grow",
    location: "Brazil, in Portuguese",
    url: "https://next.fenasbac.io/",
  },
  {
    // Announced February 2026 with no program page yet; the announcement is
    // a placeholder until Ripple publishes one.
    id: "fintech-builder-program",
    name: "FinTech Builder Program",
    organizationId: "ripplex",
    type: "Builder program",
    summary:
      "Ripple's program for startups building institutional-grade financial apps, spanning accelerators, regional startup competitions, and builder awards.",
    personas: ["business", "founder"],
    stage: "grow",
    url: "https://ripple.com/insights/supporting-innovation-on-the-xrp-ledger/",
    ctaLabel: "Read the Announcement",
  },
];

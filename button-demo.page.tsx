import * as React from "react";
import { Button } from "./shared/components/Button";
import type {
  ButtonEmphasis,
  ButtonSurface,
} from "./shared/components/Button";
import {
  XrplArrowInternalLinkIcon,
  XrplArrowExternalLinkIcon,
  LoaderIcon,
  PlusIcon,
  MaterialArrowBackIcon,
  MaterialArrowDownwardIcon,
  MaterialArrowForwardIcon,
  MaterialArrowUpwardIcon,
  MaterialDownloadIcon,
  MaterialKeyboardArrowDownIcon,
  MaterialKeyboardArrowLeftIcon,
  MaterialKeyboardArrowRightIcon,
  MaterialKeyboardArrowUpIcon,
  MaterialNorthEastIcon,
  MaterialNorthWestIcon,
  MaterialSaveAltIcon,
  MaterialSouthEastIcon,
  MaterialSouthWestIcon,
} from "./shared/components/Icons";

export const frontmatter = {
  seo: {
    title: "Button",
    description:
      "Reference page for the XRPL Button: every valid styling combination, every state, on every surface.",
  },
  // Internal reference page, not real site content — keep it out of site search
  // and out of sitemap.xml, which filters on this same flag.
  excludeFromSearch: true,
};

/**
 * Reference page for shared/components/Button.
 *
 * Linked from nowhere and not in sidebars.yaml. Deliberately NOT in
 * redocly.yaml's `ignore` list, for the same reason as /icon-demo: an ignored
 * page cannot be looked at while the component is being worked on.
 *
 * ---------------------------------------------------------------------------
 * Why this page exists
 * ---------------------------------------------------------------------------
 * The nine content pages that render Button exercise almost none of it. Between
 * them they show `strong` heavily, `standard` exactly once, `neutral` on one
 * page, and `loading`, `inactive` and `disabled` not at all. Every state below
 * is therefore unreachable from real content — the only way to see a disabled
 * button, or the neutral group, is here.
 *
 * Two hazards this page is built to expose, both of which have bitten:
 *
 *   1. Buttons with `href` render as <a>, and anything styling `a` in an
 *      ancestor can repaint them. The component defends with a doubled class,
 *      and that defence has silently vanished from a production build before.
 *      Every row therefore includes an anchor-rendered button.
 *
 *   2. `on-saturated` is mode-invariant. Its block must look identical with the
 *      site in light and in dark; if it flips, the group is bound wrong.
 *
 * Deliberately excludes ButtonGroup. Group layout, gaps and the flush edge are
 * that component's concern, and mixing them in here would make it unclear which
 * component owned a given behaviour.
 */

type Emphasis = "strong" | "standard" | "subtle";
const EMPHASES: Emphasis[] = ["strong", "standard", "subtle"];

/**
 * The five groups that have tokens. `neutral` + `on-saturated` is absent
 * because it does not exist — nothing on a solid brand block is neutral
 * coloured — and the props are a union, so writing it is a type error rather
 * than a runtime surprise.
 */
const GROUPS = [
  { intention: "brand", context: "on-theme" },
  { intention: "neutral", context: "on-theme" },
  { intention: "brand", context: "on-inverse" },
  { intention: "neutral", context: "on-inverse" },
  { intention: "brand", context: "on-saturated" },
] as const;

const SURFACES = [
  {
    context: "on-theme",
    className: "btnd-surface btnd-surface--theme",
    title: "on-theme",
    blurb: "The ordinary page background. The default; do not call it out.",
  },
  {
    context: "on-inverse",
    className: "btnd-surface btnd-surface--inverse",
    title: "on-inverse",
    blurb: "A block inverted against the mode — dark in light, light in dark.",
  },
  {
    context: "on-saturated",
    className: "btnd-surface btnd-surface--saturated",
    title: "on-saturated",
    blurb:
      "A solid brand-green block. Mode-invariant: these values do not change.",
  },
] as const;

const ICONS = [
  ["XrplArrowInternalLinkIcon", XrplArrowInternalLinkIcon],
  ["XrplArrowExternalLinkIcon", XrplArrowExternalLinkIcon],
  ["LoaderIcon", LoaderIcon],
  ["PlusIcon", PlusIcon],
  ["MaterialArrowBackIcon", MaterialArrowBackIcon],
  ["MaterialArrowForwardIcon", MaterialArrowForwardIcon],
  ["MaterialArrowUpwardIcon", MaterialArrowUpwardIcon],
  ["MaterialArrowDownwardIcon", MaterialArrowDownwardIcon],
  ["MaterialNorthWestIcon", MaterialNorthWestIcon],
  ["MaterialNorthEastIcon", MaterialNorthEastIcon],
  ["MaterialSouthWestIcon", MaterialSouthWestIcon],
  ["MaterialSouthEastIcon", MaterialSouthEastIcon],
  ["MaterialKeyboardArrowUpIcon", MaterialKeyboardArrowUpIcon],
  ["MaterialKeyboardArrowDownIcon", MaterialKeyboardArrowDownIcon],
  ["MaterialKeyboardArrowLeftIcon", MaterialKeyboardArrowLeftIcon],
  ["MaterialKeyboardArrowRightIcon", MaterialKeyboardArrowRightIcon],
  ["MaterialSaveAltIcon", MaterialSaveAltIcon],
  ["MaterialDownloadIcon", MaterialDownloadIcon],
] as const;

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="btnd-row">
    <div className="btnd-row__label">{label}</div>
    <div className="btnd-row__items">{children}</div>
  </div>
);

export default function ButtonDemo() {
  return (
    <div className="btnd">
      <h1>Button</h1>
      <p className="btnd-lede">
        <code>import {"{ Button }"}</code> from{" "}
        <code>shared/components/Button</code>. Appearance is three axes —{" "}
        <code>intention</code> × <code>context</code> × <code>emphasis</code> —
        bound straight to the token groups. Geometry never varies: padding,
        the 40px minimums and the 1px border are identical on every one of them.
      </p>

      {/* --------------------------------------------------------------- */}
      <h2>Every valid combination</h2>
      <p>
        Fifteen combinations — five groups times three emphases — each resting,
        loading, inactive, disabled, and rendered as a link. Hover any of them
        for the engaged treatment, which <code>hover</code>,{" "}
        <code>pressed</code> and <code>loading</code> all share.
      </p>

      {SURFACES.map((surface) => (
        <div key={surface.context} className={surface.className}>
          <div className="btnd-surface__head">
            <code>context=&quot;{surface.title}&quot;</code>
            <span>{surface.blurb}</span>
          </div>

          {GROUPS.filter((g) => g.context === surface.context).map((group) =>
            EMPHASES.map((emphasis) => {
              const props = {
                intention: group.intention,
                context: group.context,
                emphasis,
                iconEnd: <XrplArrowInternalLinkIcon />,
                // GROUPS is a flat list, so intention and context arrive as
                // independent literals. ButtonSurface is the correlated pair —
                // casting to it, rather than to the whole prop type, keeps the
                // spread valid against both members of the href union.
              } as ButtonSurface & {
                emphasis: ButtonEmphasis;
                iconEnd: React.ReactNode;
              };

              return (
                <Row
                  key={`${group.intention}-${emphasis}`}
                  label={`${group.intention} · ${emphasis}`}
                >
                  <Button {...props}>Rest</Button>
                  <Button {...props} loading>
                    Loading
                  </Button>
                  <Button {...props} inactive>
                    Inactive
                  </Button>
                  <Button {...props} disabled>
                    Disabled
                  </Button>
                  <Button {...props} href="/docs">
                    As a link
                  </Button>
                </Row>
              );
            })
          )}
        </div>
      ))}

      <p className="btnd-note">
        <strong>Loading, inactive and disabled look alike on purpose.</strong>{" "}
        Tab through a row to tell them apart: inactive stays in the tab order
        and disabled does not. Loading and inactive both suppress activation.
        Collapsing inactive into disabled would take it out of the tab order,
        and a screen-reader user could then no longer find it.
      </p>

      <p className="btnd-note">
        <strong>The &ldquo;As a link&rdquo; column is a regression test.</strong>{" "}
        Those render <code>&lt;a&gt;</code>, and any ancestor styling its own
        anchors will repaint them unless the component out-specifies it. If one
        of them ever picks up a link colour or an unexpected underline, that
        defence has been lost.
      </p>

      <p className="btnd-note">
        <strong>Check the green block in both modes.</strong>{" "}
        <code>on-saturated</code> is mode-invariant — toggle the site&rsquo;s
        light/dark control and nothing inside it should change. The other two
        blocks are expected to swap.
      </p>

      {/* --------------------------------------------------------------- */}
      <h2>Icons</h2>
      <p>
        Both icon slots are opt-in: a Button with neither prop renders its label
        alone, with no reserved space where an icon would have gone. Icons are
        decorative and <code>aria-hidden</code>, so a button whose only content
        is an icon must carry its own accessible name.
      </p>

      <div className="btnd-panel">
        <Row label="no icons">
          <Button>Get started</Button>
        </Row>
        <Row label="iconEnd">
          <Button iconEnd={<XrplArrowInternalLinkIcon />}>Get started</Button>
        </Row>
        <Row label="iconStart">
          <Button iconStart={<PlusIcon />}>Add a token</Button>
        </Row>
        <Row label="both">
          <Button
            iconStart={<MaterialDownloadIcon />}
            iconEnd={<XrplArrowInternalLinkIcon />}
          >
            Download
          </Button>
        </Row>
        <Row label="loading replaces iconEnd">
          <Button loading iconEnd={<XrplArrowInternalLinkIcon />}>
            Submitting
          </Button>
        </Row>
      </div>

      <p>
        Every icon in the set, as <code>iconEnd</code>. Only the two XRPL link
        arrows move on hover — the rest receive the same signal and ignore it,
        which is the icon contract working rather than a gap.
      </p>

      <div className="btnd-icon-grid">
        {ICONS.map(([name, Icon]) => (
          <Button key={name} iconEnd={<Icon />}>
            {name.replace(/Icon$/, "")}
          </Button>
        ))}
      </div>

      {/* --------------------------------------------------------------- */}
      <h2>Geometry</h2>
      <p>
        Shared by every group, emphasis and state: <code>0.5rem 1rem</code>{" "}
        padding, a 40px minimum height and width, a 9999px radius, and a 1px
        border on all of them — including the ones whose stroke resolves
        transparent, so a button does not change size when its emphasis does.
      </p>

      <div className="btnd-panel">
        <Row label="all three emphases">
          <Button emphasis="strong" iconEnd={<XrplArrowInternalLinkIcon />}>
            Strong
          </Button>
          <Button emphasis="standard" iconEnd={<XrplArrowInternalLinkIcon />}>
            Standard
          </Button>
          <Button emphasis="subtle" iconEnd={<XrplArrowInternalLinkIcon />}>
            Subtle
          </Button>
        </Row>
        <Row label="shortest possible label">
          <Button>OK</Button>
          <Button>1</Button>
        </Row>
        <Row label="long label">
          <Button iconEnd={<XrplArrowInternalLinkIcon />}>
            A label long enough to show that the button never wraps
          </Button>
        </Row>
      </div>

      <p className="btnd-note">
        The 40px minimum is a physical touch target and does{" "}
        <strong>not</strong> scale with font size — text scales, targets do not.
        The single-character button above is the one to measure.
      </p>

      {/* --------------------------------------------------------------- */}
      <h2>Via SCSS mixins</h2>
      <p>You can also use the SCSS mixins to apply button styles. This is how we apply it across existing interactive blocks in markdown without risking breaking changes. This implementation does not support icons, but these call sites are not specced to use icons.</p>
      <p>
        <code>.interactive-block .btn.btn-primary {`{ @include bds-button(neutral, strong, on-theme); }`}</code>
      </p>
      <p className="btn-panel interactive-block">
        <button id="confirm-balances-button" className="btn btn-primary">Confirm Balances</button>
      </p>
    </div>
  );
}

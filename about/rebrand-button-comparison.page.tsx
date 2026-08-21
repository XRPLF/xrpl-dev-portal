import * as React from "react";
import { Button } from "../shared/components/Button";
import { RebrandButton } from "../shared/components/RebrandButton";
import {
  XrplArrowInternalLinkIcon,
  XrplArrowExternalLinkIcon,
  LoaderIcon,
  PlusIcon,
  MaterialArrowUpwardIcon,
  MaterialArrowDownwardIcon,
  MaterialArrowBackIcon,
  MaterialArrowForwardIcon,
  MaterialNorthWestIcon,
  MaterialNorthEastIcon,
  MaterialSouthWestIcon,
  MaterialSouthEastIcon,
  MaterialKeyboardArrowUpIcon,
  MaterialKeyboardArrowDownIcon,
  MaterialKeyboardArrowLeftIcon,
  MaterialKeyboardArrowRightIcon,
  MaterialSaveAltIcon,
  MaterialDownloadIcon,
} from "../shared/components/Icons";

export const frontmatter = {
  seo: {
    title: "RebrandButton vs Button",
    description:
      "Development harness comparing the current Button with RebrandButton, built from the Figma-derived specification.",
  },
};

/**
 * Development harness. Not linked from sidebars.yaml — it exists to put the two
 * button implementations next to each other under identical conditions.
 *
 * Toggle the site's light/dark control to check both modes; every surface below
 * is specified in both.
 */

/**
 * Every icon component in shared/components/Icons, in one list.
 * Four are XRPL's own; the remaining fourteen are Google Material.
 */
const ALL_ICONS = [
  ["XrplArrowInternalLinkIcon", XrplArrowInternalLinkIcon],
  ["XrplArrowExternalLinkIcon", XrplArrowExternalLinkIcon],
  ["LoaderIcon", LoaderIcon],
  ["PlusIcon", PlusIcon],
  ["MaterialArrowUpwardIcon", MaterialArrowUpwardIcon],
  ["MaterialArrowDownwardIcon", MaterialArrowDownwardIcon],
  ["MaterialArrowBackIcon", MaterialArrowBackIcon],
  ["MaterialArrowForwardIcon", MaterialArrowForwardIcon],
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

type Emphasis = "strong" | "standard" | "subtle";
const EMPHASES: Emphasis[] = ["strong", "standard", "subtle"];

/** The five groups that have tokens. neutral + on-saturated is absent. */
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
    className: "rbx-surface rbx-surface--theme",
    title: "on-theme",
    blurb: "The ordinary page background. The default; do not call it out.",
  },
  {
    context: "on-inverse",
    className: "rbx-surface rbx-surface--inverse",
    title: "on-inverse",
    blurb: "A block inverted against the mode — dark in light, light in dark.",
  },
  {
    context: "on-saturated",
    className: "rbx-surface rbx-surface--saturated",
    title: "on-saturated",
    blurb:
      "A solid brand-green block. Mode-invariant: these values do not change.",
  },
] as const;

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="rbx-row">
    <div className="rbx-row__label">{label}</div>
    <div className="rbx-row__items">{children}</div>
  </div>
);

export default function RebrandButtonComparison() {
  const [advance, setAdvance] = React.useState(false);

  return (
    <div className="rbx">
      <header className="rbx-header">
        <h1>RebrandButton vs Button</h1>
        <p>
          The current <code>Button</code> next to <code>RebrandButton</code>,
          which is built from the Figma-derived specification in{" "}
          <code>pd-xrpl-developer-docs</code>. Toggle the site&rsquo;s
          light/dark control to check both modes — every value below is
          specified in both, and several of them swap.
        </p>
        <p className="rbx-note">
          Development harness. Not in <code>sidebars.yaml</code>, not published
          navigation.
        </p>
      </header>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h2>1. Side by side, default props</h2>
        <p>
          Both components with no styling props at all. The current Button
          defaults to <code>primary</code>/<code>green</code>; RebrandButton
          defaults to <code>brand</code>/<code>on-theme</code>/
          <code>strong</code>.
        </p>
        <div className="rbx-pair">
          <div>
            <div className="rbx-caption">Button (current)</div>
            <Button>Get started</Button>
          </div>
          <div>
            <div className="rbx-caption">RebrandButton (spec)</div>
            <RebrandButton>Get started</RebrandButton>
          </div>
        </div>
        <p className="rbx-note">
          Hover both. The rise animation is carried over unchanged. The
          difference is the arrow: the current Button animates its padding and
          gap, so the button reflows. RebrandButton keeps the spec&rsquo;s fixed
          geometry — the arrow&rsquo;s tail retracts to nothing and the head
          slides forward, both entirely inside the SVG&rsquo;s own viewBox, so
          the icon&rsquo;s box never changes.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h2>2. Every valid combination</h2>
        <p>
          Fifteen styling combinations — five groups times three emphases — each
          shown resting, loading, inactive and disabled. Hover any of them for
          the engaged treatment.
        </p>

        {SURFACES.map((surface) => (
          <div key={surface.context} className={surface.className}>
            <div className="rbx-surface__head">
              <code>context=&quot;{surface.title}&quot;</code>
              <span>{surface.blurb}</span>
            </div>

            {GROUPS.filter((g) => g.context === surface.context).map((group) =>
              EMPHASES.map((emphasis) => {
                const props = {
                  intention: group.intention,
                  context: group.context,
                  emphasis,
                } as React.ComponentProps<typeof RebrandButton>;

                return (
                  <Row
                    key={`${group.intention}-${emphasis}`}
                    label={`${group.intention} · ${emphasis}`}
                  >
                    <RebrandButton {...props}>Rest</RebrandButton>
                    <RebrandButton {...props} loading>
                      Loading
                    </RebrandButton>
                    <RebrandButton {...props} inactive>
                      Inactive
                    </RebrandButton>
                    <RebrandButton {...props} disabled>
                      Disabled
                    </RebrandButton>
                    <RebrandButton {...props} href="/docs">
                      As a link
                    </RebrandButton>
                  </Row>
                );
              })
            )}
          </div>
        ))}

        <p className="rbx-note">
          <strong>Loading, inactive and disabled look alike on purpose.</strong>{" "}
          Tab through a row to tell them apart: inactive stays in the tab order
          and disabled does not. Loading and inactive both suppress activation.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h2>3. The icon outside a button</h2>
        <p>
          The requirement the spec cares about: the arrow self-contains its
          animation, works anywhere, and is driven by whatever context it lands
          in. Its entire contract is one custom property,{" "}
          <code>--bds-icon-engaged</code>, which names the container&rsquo;s
          state rather than the icon&rsquo;s behaviour — so the same signal
          drives any icon carrying <code>.bds-icon</code>.
        </p>

        <Row label="In running text">
          <span className="rbx-inline">
            Inline beside a label <XrplArrowInternalLinkIcon /> — static,
            because nothing sets the property.
          </span>
        </Row>

        <Row label="Inheriting colour">
          <span className="rbx-inline" style={{ color: "#d919ff" }}>
            Container sets color <XrplArrowInternalLinkIcon />
          </span>
          <span className="rbx-inline" style={{ color: "#0179e7" }}>
            and the icon follows <XrplArrowInternalLinkIcon />
          </span>
        </Row>

        <Row label="Driven by a hovered card">
          <div className="rbx-card">
            <span className="rbx-inline">
              A card, not a button <XrplArrowInternalLinkIcon />
            </span>
            <div className="rbx-caption">
              .rbx-card:hover .rbx-inline &#123; @include bds-icon-engaged;
              &#125; — on the span, because that is where the icon is.
            </div>
          </div>
        </Row>

        <Row label="…and it stops at the nested button">
          <div className="rbx-card">
            <span className="rbx-inline">
              The card&rsquo;s own arrow moves <XrplArrowInternalLinkIcon />
            </span>
            <RebrandButton>this one does not</RebrandButton>
            <div className="rbx-caption">
              Hover the card: only the arrow above moves. The mixin emits
              <code> &gt; .bds-icon</code>, so it reaches one level and stops.
              The button&rsquo;s arrow is deeper — inside its own{" "}
              <code>.rb-btn__icon</code> — so it answers to the button alone.
              Hover the button itself to see it move.
            </div>
          </div>
        </Row>

        <Row label="Internal, full sweep">
          <span className="rbx-sweep">
            {[0, 0.25, 0.5, 0.75, 1].map((a) => (
              <XrplArrowInternalLinkIcon
                key={a}
                style={{ "--bds-icon-engaged": a } as React.CSSProperties}
              />
            ))}
          </span>
        </Row>

        <Row label="External, full sweep">
          <span className="rbx-sweep">
            {[0, 0.25, 0.5, 0.75, 1].map((a) => (
              <XrplArrowExternalLinkIcon
                key={a}
                style={{ "--bds-icon-engaged": a } as React.CSSProperties}
              />
            ))}
          </span>
        </Row>

        <Row label="Scope, and the guard">
          <div className="rbx-broad">
            <span className="rbx-inline">
              A container setting it broadly <XrplArrowInternalLinkIcon />
            </span>
            <span className="rbx-inline">
              reaches none of these <XrplArrowExternalLinkIcon />
            </span>
            <RebrandButton>…and not this button</RebrandButton>
            <div className="rbx-caption">
              .rbx-broad &#123; --bds-icon-engaged: 1; &#125; — setting it on
              the container is the naive way, and every icon declares its own
              rest value, so nothing here moves. A trigger has to reach the icon
              element itself, which is what the mixin&rsquo;s
              <code> &gt; .bds-icon</code> does.
            </div>
          </div>
        </Row>

        <Row label="Driven by state, not hover">
          <label className="rbx-toggle">
            <input
              type="checkbox"
              checked={advance}
              onChange={(e) => setAdvance(e.target.checked)}
            />
            <span>
              Engage via the <code>engaged</code> prop{" "}
              <XrplArrowInternalLinkIcon engaged={advance || undefined} />
            </span>
          </label>
        </Row>

        <Row label="The loader needs no trigger">
          <span className="rbx-inline rbx-loader-lg">
            <LoaderIcon /> Spinning on its own, outside any button
          </span>
          <span className="rbx-inline rbx-loader-lg" style={{ color: "#d919ff" }}>
            <LoaderIcon /> and still inheriting colour
          </span>
        </Row>

        <p className="rbx-note">
          The spinner is the one icon that drives itself: eight discrete 45&deg;
          stops, counter-clockwise, so each tick lands exactly where its
          neighbour was. Watch a single tick — it should never sit between
          positions.
        </p>

        <p className="rbx-note">
          The colour test is the one a screenshot cannot do: an icon that
          inherits and one that hardcodes the same value are pixel-identical.
          Change the container&rsquo;s <code>color</code> and confirm the icon
          follows.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h2>4. Current Button, for reference</h2>
        <p>
          The component being compared against, across its own axes.
        </p>
        {(["primary", "secondary", "tertiary"] as const).map((variant) => (
          <Row key={variant} label={`${variant} · green`}>
            <Button variant={variant}>Rest</Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Button variant={variant} showIcon={false}>
              No icon
            </Button>
            <Button variant={variant} href="/docs">
              As a link
            </Button>
          </Row>
        ))}
        {(["primary", "secondary", "tertiary"] as const).map((variant) => (
          <Row key={`${variant}-black`} label={`${variant} · black`}>
            <Button variant={variant} color="black">
              Rest
            </Button>
            <Button variant={variant} color="black" disabled>
              Disabled
            </Button>
          </Row>
        ))}
      </section>

      {/* ------------------------------------------------------------------ */}
      <section>
        <h2>5. Every icon, in a button</h2>
        <p>
          All eighteen icon components passed to <code>iconEnd</code>, one
          colour so nothing but the icon varies. Four are XRPL&rsquo;s own; the
          other fourteen are Google Material, added under the Apache License
          2.0 &mdash; each of those component headers names the exact upstream
          file and commit it came from, and the licence entry is in the
          repository root <code>LICENSE</code>.
        </p>
        <p className="rbx-note">
          Hover across the row. Every icon takes the engaged colour, and the
          background rises behind all of them &mdash; but only the two XRPL
          link arrows move. All eighteen receive{" "}
          <code>--bds-icon-engaged</code> identically; the other sixteen have
          no stylesheet that reads it, so they ignore it. That is the contract
          working, not a gap: the button says only that it is engaged, and each
          icon decides whether that means anything. The loader is the odd one
          out &mdash; it drives itself, so it spins without being asked.
        </p>
        <div className="rbx-icon-btns">
          {ALL_ICONS.map(([name, Icon]) => (
            <RebrandButton key={name} iconEnd={<Icon />} iconStart={<Icon />}>
              {name}
            </RebrandButton>
          ))}
        </div>
      </section>
    </div>
  );
}


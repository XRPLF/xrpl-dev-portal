import * as React from "react";
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
    title: "Icon set",
    description:
      "Reference page for the XRPL icon set: every icon, how they size, and how a container engages the ones that move.",
  },
  // Internal reference page, not real site content — keep it out of site search
  // and out of sitemap.xml, which filters on this same flag.
  excludeFromSearch: true,
};

/**
 * Reference page for shared/components/Icons.
 *
 * The page ships but is linked from nowhere — not in sidebars.yaml, not
 * reachable by navigation. `excludeFromSearch` in its frontmatter keeps it out
 * of site search and, through the same flag, out of sitemap.xml.
 *
 * It is deliberately NOT in the `ignore` list in redocly.yaml, so that it stays
 * reachable while working on the icons. Ignoring it instead is a reasonable
 * call to make later; check first what that does to `realm develop`, since the
 * icons cannot be worked on through a page that does not render.
 *
 * Its styling is not stripped from the bundle either. Doing that is possible —
 * a PurgeCSS blocklist on the class prefix works — but it makes the page's
 * appearance depend on which CSS build ran last, and static/css is a committed
 * file. Anyone checking out the branch then gets an unstyled page with no
 * obvious cause. A few KB of unused rules is the cheaper of the two.
 *
 * Deliberately contains no buttons: a button is only one kind of container,
 * and nothing here should read as button behaviour.
 *
 * ---------------------------------------------------------------------------
 * The gotchas — kept here rather than on the page, which stays short
 * ---------------------------------------------------------------------------
 * The contract itself is in shared/components/Icons/shared.scss. What bites:
 *
 *   1. The mixin emits `> .bds-icon`. Include it on the element the icon
 *      actually sits in, which is not always the element carrying the state.
 *      The card demo below is the case people get wrong: the state is on the
 *      card, the icon is in the footer, so the mixin goes on the footer.
 *      Putting it on `.icond-card:hover` emits a selector that matches
 *      nothing, and the icon sits still with no error anywhere.
 *
 *   2. Icons inside a nested component are out of reach, by design — they are
 *      more than one level down. If one needs to move, that component has to
 *      expose the state itself.
 *
 *   3. Never set --bds-icon-engaged on a container. The rest value declared
 *      on `.bds-icon` sits on the icon element itself, so an inherited value
 *      loses to it and the rule is inert. That guard is what stops one
 *      container engaging every arrow beneath it, including arrows belonging
 *      to components it does not own.
 *
 *   4. Do not flatten an animated arrow to a single path. Head and tail are
 *      separate elements so the tail can retract; a flattened replacement
 *      renders correctly and silently loses the animation.
 *
 *   5. Nothing here changes layout. Every moving part is inside the SVG and
 *      the <svg> is never transformed, so an icon occupies the same box
 *      whether it is moving or still.
 *
 *   6. Icons are aria-hidden. A control whose only content is an icon must
 *      carry its own accessible name.
 */

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

/**
 * Sizes the ramp runs at. Everything below 24 renders the artwork at less than
 * one user unit per CSS pixel, which is where a motion expressed in the wrong
 * units would come apart.
 */
const SIZES = [12, 14, 16, 20, 24, 32, 48, 96];

const RAMPS = [
  ["Internal arrow", XrplArrowInternalLinkIcon],
  ["External arrow", XrplArrowExternalLinkIcon],
] as const;

const GUARDS = [
  ["Sets the property directly (doesn't work)", "icond-guard-wrong", "--bds-icon-engaged: 1;"],
  ["Uses the mixin", "icond-guard-right", "@include bds-icon-engaged;"],
] as const;

export default function IconDemo() {
  const [engaged, setEngaged] = React.useState(false);
  // The React-state demo drives itself. Sharing `engaged` with the size ramp
  // left it with no control of its own, several sections away from the only
  // button that moved it, which read as broken.
  const [open, setOpen] = React.useState(false);

  return (
    <div className="icond">
      <h1>Icon set</h1>
      <p className="icond-lede">
        <code>import {"{ XrplArrowInternalLinkIcon }"}</code> from{" "}
        <code>shared/components/Icons</code>. Every icon renders at{" "}
        <code>1em</code> in <code>currentColor</code>, so its container sets
        both size and colour.
      </p>

      {/* --------------------------------------------------------------- */}
      <h2>The set</h2>
      <div className="icond-gallery">
        {ICONS.map(([name, Icon]) => (
          <div className="icond-gallery__item" key={name}>
            <Icon />
            <span className="icond-gallery__item__name">{name}</span>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------------- */}
      <h2>Sizes</h2>
      <p>
        Motion is expressed in viewBox user units, so it scales with the icon.
        Each box is outlined: the artwork moves inside it, the box never changes
        size, and nothing may spill past the outline.
      </p>

      <div className="icond-controls">
        <button
          type="button"
          className="icond-toggle"
          aria-pressed={engaged}
          onClick={() => setEngaged((v) => !v)}
        >
          {engaged ? "Release" : "Engage"}
        </button>
        <span className="icond-note">Engages every size at once.</span>
      </div>

      <div className="icond-panel">
        {RAMPS.map(([label, Icon]) => (
          <div className="icond-ramp-group" key={label}>
            <span className="icond-caption">{label}</span>
            <div className="icond-ramp">
              {SIZES.map((size) => (
                <div className="icond-ramp__step" key={size}>
                  <div className="icond-ramp__box" style={{ fontSize: size }}>
                    <Icon engaged={engaged} />
                  </div>
                  <span className="icond-ramp__step__label">{size}px</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------------- */}
      <h2 id="engaging-an-icon">Engaging an icon</h2>
      <p>
        The container names its own state; what "engaged" means is the icon's
        business. The mixin emits <code>&gt; .bds-icon</code>, so it belongs on
        the icon's own parent — which is not always the element carrying the
        state.
      </p>

      <div className="icond-consumers">
        <div className="icond-demo">
          <span className="icond-caption">Direct child</span>
          <div className="icond-panel">
            <a className="icond-link" href="#engaging-an-icon">
              Read the documentation <XrplArrowInternalLinkIcon />
            </a>
          </div>
          <pre className="icond-code">{`.icond-link:hover,
.icond-link:focus-visible {
  @include bds-icon-engaged;
}`}</pre>
        </div>

        <div className="icond-demo">
          <span className="icond-caption">Icon deeper than the state</span>
          <div className="icond-panel">
            <div className="icond-card" tabIndex={0}>
              <div className="icond-card__title">Tokenization</div>
              <div className="icond-card__footer">
                Learn more <XrplArrowInternalLinkIcon />
              </div>
            </div>
          </div>
          <pre className="icond-code">{`.icond-card {
  // on the footer, not the card
  &:hover &__footer {
    @include bds-icon-engaged;
  }
}`}</pre>
        </div>

        <div className="icond-demo">
          <span className="icond-caption">From React state (click me)</span>
          {/* The state is React's, not a CSS pseudo-class, so there is nothing
              for the mixin to hang off — the `engaged` prop is the way in.
              The whole panel is the control. */}
          <button
            type="button"
            className="icond-panel icond-clickable"
            aria-pressed={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="icond-clickable__row">
              <span>{open ? "Engaged" : "Not engaged"}</span>
              <XrplArrowInternalLinkIcon engaged={open} />
            </span>
          </button>
          <pre className="icond-code">{`<XrplArrowInternalLinkIcon
  engaged={open} />`}</pre>
        </div>
      </div>

      <h3>The guard</h3>
      <p>
        Setting <code>--bds-icon-engaged</code> on a container is inert — the
        rest value sits on the icon itself, so an inherited value loses to it.
        That is what stops one container engaging every icon beneath it. Hover
        both: only the second moves, and neither reaches the nested icon.
      </p>

      <div className="icond-consumers">
        {GUARDS.map(([label, cls, decl]) => (
          <div className="icond-demo" key={cls}>
            <span className="icond-caption">{label}</span>
            <div className={`icond-guard__demo ${cls}`}>
              <XrplArrowInternalLinkIcon />
              <div className="icond-guard__nested">
                nested <XrplArrowInternalLinkIcon />
              </div>
            </div>
            <pre className="icond-code">{`.${cls}:hover {\n  ${decl}\n}`}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

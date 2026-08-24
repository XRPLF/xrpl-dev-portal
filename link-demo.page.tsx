import React, { useEffect, useState } from "react";
import { Link } from "shared/components/Link";
import type { LinkIntention, LinkContext, LinkSize } from "shared/components/Link";

export const frontmatter = {
  seo: {
    title: "Link component reference | XRPL.org",
  },
  // Internal reference page, not real site content -- keep it out of sitemap.xml.
  excludeFromSearch: true,
};

type Group = {
  key: string;
  label: string;
  intention: LinkIntention;
  context: LinkContext;
  panelClassName?: string;
};

// The five navigation.link.* color groups from the BDS Link spec
// (~/dev/pd-xrpl-developer-docs/components/link.json). neutral+on-saturated
// is intentionally absent -- there's no such group, and Link's own types
// make that combination a compile error.
const GROUPS: Group[] = [
  { key: "brand", label: "brand · on-theme", intention: "brand", context: "on-theme" },
  { key: "neutral", label: "neutral · on-theme", intention: "neutral", context: "on-theme" },
  {
    key: "brand-on-inverse",
    label: "brand · on-inverse",
    intention: "brand",
    context: "on-inverse",
    panelClassName: "link-demo__panel--inverse",
  },
  {
    key: "neutral-on-inverse",
    label: "neutral · on-inverse",
    intention: "neutral",
    context: "on-inverse",
    panelClassName: "link-demo__panel--inverse",
  },
  {
    key: "brand-on-saturated",
    label: "brand · on-saturated",
    intention: "brand",
    context: "on-saturated",
    panelClassName: "link-demo__panel--saturated",
  },
];

const SIZES: { size: LinkSize; fontSize: number }[] = [
  { size: "sm", fontSize: 12 },
  { size: "md", fontSize: 16 },
  { size: "lg", fontSize: 20 },
];

function GroupSection({
  group,
  demoHref,
}: {
  group: Group;
  demoHref: (id: string) => string;
}) {
  const table = (
    <table className="link-demo__table">
      <thead>
        <tr>
          <th>size</th>
          <th>inline</th>
          <th>standalone</th>
          <th>standalone + icon</th>
        </tr>
      </thead>
      <tbody>
        {SIZES.map(({ size, fontSize }) => (
          <tr key={size}>
            <td>
              <code>{size}</code>
            </td>
            <td>
              <div className="link-demo__cell">
                {/* inline has no font-size of its own -- it inherits from
                    whatever paragraph it sits in, so the wrapping <p> here
                    is what actually sets the size, not the size prop. */}
                <p style={{ fontSize, margin: 0 }}>
                  Read the{" "}
                  <Link
                    href={demoHref(`${group.key}-${size}-inline`)}
                    intention={group.intention}
                    context={group.context}
                    variation="inline"
                    size={size}
                  >
                    documentation
                  </Link>{" "}
                  for more.
                </p>
                <span className="link-demo__caption">
                  variation=inline · inherits {fontSize}px from parent
                </span>
              </div>
            </td>
            <td>
              <div className="link-demo__cell">
                <Link
                  href={demoHref(`${group.key}-${size}-standalone`)}
                  intention={group.intention}
                  context={group.context}
                  variation="standalone"
                  size={size}
                >
                  View docs
                </Link>
                <span className="link-demo__caption">variation=standalone</span>
              </div>
            </td>
            <td>
              <div className="link-demo__cell">
                <Link
                  href={demoHref(`${group.key}-${size}-standalone-icon`)}
                  intention={group.intention}
                  context={group.context}
                  variation="standalone"
                  size={size}
                  iconEnd
                >
                  View docs
                </Link>
                <span className="link-demo__caption">variation=standalone iconEnd</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className="link-demo__group">
      <h2 className="link-demo__group-title">{group.label}</h2>
      <p className="link-demo__group-note">
        <code>
          intention=&quot;{group.intention}&quot; context=&quot;{group.context}&quot;
        </code>
      </p>
      {group.panelClassName ? <div className={group.panelClassName}>{table}</div> : table}
    </section>
  );
}

// A fresh value each time -- never in this browser's history. Combined with a
// per-link id (below) to give every demo link its OWN distinct href, so
// clicking one only visits that one -- not every link on the page, which is
// what a single shared href would do (:visited is keyed by URL, and browsers
// don't distinguish "the same URL, but a different <a>"). Regenerating the
// nonce (the reset button) points every link at a brand-new, unvisited
// fragment at once, which is the only way to "un-visit" a link: browsers
// don't expose any API to remove a URL from :visited history, and they
// intentionally block scripts from reading it, so the sole lever available
// here is making each link point somewhere that's never been visited.
function freshNonce(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function LinkDemoPage() {
  // Starts as a fixed, non-random value so server and client render the same
  // markup on the first pass -- generating the real (random) nonce here
  // instead would mismatch between the server's render and the client's,
  // since each would call Date.now()/Math.random() independently. The real
  // nonce is assigned client-side only, after mount, via the effect below.
  const [nonce, setNonce] = useState("initial");

  useEffect(() => {
    setNonce(freshNonce());
  }, []);

  // id should be stable and unique per link (e.g. "brand-sm-inline") so the
  // same link keeps the same href across re-renders that don't touch nonce.
  const demoHref = (id: string) => `#demo-${nonce}-${id}`;

  return (
    <div className="link-demo">
      <h1>Link component reference</h1>
      <div className="link-demo__intro">
        <p>
          Every <code>intention</code>/<code>context</code> color group from the BDS Link spec, at
          every <code>size</code>, as <code>inline</code> and <code>standalone</code> (with and
          without the trailing icon). Toggle light/dark mode with the switch in the nav to check
          both.
        </p>
        <p>
          Hover a link to see its hover state. Every link below points to its own unique
          fragment, generated fresh on load, so they all start <strong>unvisited</strong> --
          click one (or tab to it and press Enter) to see just that link&apos;s <code>:visited</code>{" "}
          color, without affecting the others. Use the button below to point every link at a
          brand-new, never-visited fragment again, undoing whichever ones you&apos;ve clicked,
          without needing a new incognito window. Tab through the page to check focus rings.
        </p>
        <button
          type="button"
          className="link-demo__reset-btn"
          onClick={() => setNonce(freshNonce())}
        >
          Reset demo links (undo :visited)
        </button>
      </div>

      {GROUPS.map((group) => (
        <GroupSection key={group.key} group={group} demoHref={demoHref} />
      ))}

      <section className="link-demo__group">
        <h2 className="link-demo__group-title">generic &lt;a&gt; fallback</h2>
        <p className="link-demo__group-note">
          <code>styles/_content.scss</code> -- any link that isn&apos;t the <code>Link</code>{" "}
          component, inside markdown article content (raw HTML <code>&lt;a&gt;</code>, or a tag
          component like <code>{"{% child-pages %}"}</code>). Matches{" "}
          <code>intention=&quot;neutral&quot; context=&quot;on-theme&quot;</code>, no size axis of
          its own -- also inherits from its paragraph.
        </p>
        <div data-component-name="Markdown/Markdown">
          <article>
            {SIZES.map(({ size, fontSize }) => (
              <p key={size} style={{ fontSize }}>
                Read the <a href={demoHref(`generic-${size}`)}>documentation</a> for more.{" "}
                <span className="link-demo__caption">
                  ({size}, inherits {fontSize}px)
                </span>
              </p>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}

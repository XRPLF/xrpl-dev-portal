import React from "react";
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

function GroupSection({ group }: { group: Group }) {
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
                  <Link href="#" intention={group.intention} context={group.context} variation="inline" size={size}>
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
                <Link href="#" intention={group.intention} context={group.context} variation="standalone" size={size}>
                  View docs
                </Link>
                <span className="link-demo__caption">variation=standalone</span>
              </div>
            </td>
            <td>
              <div className="link-demo__cell">
                <Link
                  href="#"
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

export default function LinkDemoPage() {
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
          Hover a link to see its hover state. <code>:visited</code> can&apos;t be demoed here --
          every link below points to <code>#</code>, and browsers only apply <code>:visited</code>{" "}
          to URLs you&apos;ve actually visited. Tab through the page to check focus rings.
        </p>
      </div>

      {GROUPS.map((group) => (
        <GroupSection key={group.key} group={group} />
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
                Read the <a href="#">documentation</a> for more.{" "}
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

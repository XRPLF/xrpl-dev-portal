import * as React from "react";
import {
  PageGrid,
  PageGridRow,
  PageGridCol,
} from "shared/components/PageGrid/page-grid";
import FeaturedVideoHero from "shared/patterns/FeaturedVideoHero/FeaturedVideoHero";

export const frontmatter = {
  seo: {
    title: "FeaturedVideoHero Pattern Showcase",
    description:
      "Interactive showcase of the FeaturedVideoHero pattern with video hero, CTAs, and responsive behavior.",
  },
};

const DemoCaption = ({
  title,
  description,
  code,
}: {
  title: string;
  description?: string;
  code?: string;
}) => (
  <div className="mb-6">
    <h3 className="h4 mb-4">{title}</h3>
    {description && <p className="mb-6">{description}</p>}
    {code && (
      <div
        className="mb-6 p-4 bg-light br-4 text-black"
        style={{
          fontFamily: "monospace",
          fontSize: "14px",
          overflow: "auto",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#000" }}>
          {code}
        </pre>
      </div>
    )}
  </div>
);

const placeholderVideo =
  "https://cdn.sanity.io/files/ior4a5y3/production/6e2fcba46e3f045a5570c86fd5d20d5ba93d6aad.mp4";

export default function FeaturedVideoHeroShowcase() {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      console.log("FeaturedVideoHero video element:", videoRef.current);
    }
  }, []);

  return (
    <div className="landing">
      <PageGrid className="py-26">
        <PageGridRow>
          <PageGridCol>
            <div className="text-center mb-26">
              <h6 className="eyebrow mb-3">Pattern Showcase</h6>
              <h1 className="h2 mb-4">FeaturedVideoHero Pattern</h1>
              <p className="longform">
                A page-level hero pattern featuring a headline, optional
                subtitle, call-to-action buttons, and a featured video. The
                video uses native HTML video element props and is displayed in a
                responsive two-column layout with content on the left and video
                on the right.
              </p>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Basic Usage */}
        <PageGridRow>
          <PageGridCol>
            <DemoCaption
              title="Basic Usage with Video"
              description="The simplest implementation with a headline, subtitle, primary CTA, and video. This example assigns a ref to the video element and logs it to the console on mount."
              code={`const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  if (videoRef.current) {
    console.log("FeaturedVideoHero video element:", videoRef.current);
  }
}, []);

<FeaturedVideoHero
  headline="Build on XRPL"
  subtitle={
    <>
      <p>Issue, manage, and trade real-world assets without needing to build smart contracts.</p>
      <p>XRP Ledger's built-in functionality and compliance-enabling features allow asset tokenization without additional layers of complexity.</p>
    </>
  }
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  videoElement={{
    ref: videoRef,
    src: "/video/intro.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
      <FeaturedVideoHero
        headline="Build on XRPL"
        subtitle={
          <>
            <p>
              Issue, manage, and trade real-world assets without needing to
              build smart contracts.
            </p>
            <p>
              XRP Ledger's built-in functionality and compliance-enabling
              features allow asset tokenization without additional layers of
              complexity.
            </p>
          </>
        }
        callsToAction={[{ children: "Get Started", href: "/docs" }]}
        videoElement={{
          ref: videoRef,
          src: placeholderVideo,
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
        }}
      />
      <PageGrid className="py-26">
        {/* Primary + Secondary CTA */}
        <PageGridRow>
          <PageGridCol>
            <DemoCaption
              title="Primary and Secondary CTAs"
              description="Include both primary and secondary call-to-action buttons."
              code={`<FeaturedVideoHero
  headline="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build tokenization solutions."
  callsToAction={[
    { children: "Get Started", href: "/docs" },
    { children: "Learn More", href: "/about" }
  ]}
  videoElement={{
    src: "/video/tokenization.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
      <FeaturedVideoHero
        headline="Real-world asset tokenization"
        subtitle="Learn how to issue crypto tokens and build tokenization solutions."
        callsToAction={[
          { children: "Get Started", href: "/docs" },
          { children: "Learn More", href: "/about" },
        ]}
        videoElement={{
          src: placeholderVideo,
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
        }}
      />
      <PageGrid className="py-26">
        {/* Video with extended props */}
        <PageGridRow>
          <PageGridCol>
            <DemoCaption
              title="Extended Video Props"
              description="Use native video element props for controls, preload, poster, etc."
              code={`<FeaturedVideoHero
  headline="Watch and Learn"
  subtitle="Explore our video tutorials and guides."
  callsToAction={[
    { children: "Watch Tutorials", href: "/tutorials" }
  ]}
  videoElement={{
    src: "/video/intro.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true,
    controls: true,
    preload: "metadata"
  }}
/>`}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
      <FeaturedVideoHero
        headline="Watch and Learn"
        subtitle="Explore our video tutorials and guides."
        callsToAction={[{ children: "Watch Tutorials", href: "/tutorials" }]}
        videoElement={{
          src: placeholderVideo,
          autoPlay: false,
          loop: true,
          muted: true,
          playsInline: true,
          controls: true,
          preload: "metadata",
        }}
      />
      <PageGrid className="py-26">
        {/* Validation Examples */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Validation Examples</h2>
              <p className="mb-6">
                The component includes development-time validation that logs
                warnings to the console when required props (headline,
                videoElement) are missing. The component will return null and
                not render when validation fails. The callsToAction prop is
                optional; when provided, at least one non-empty CTA is needed to
                show the CTA section.
              </p>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Primary CTA Only */}
        <PageGridRow>
          <PageGridCol>
            <DemoCaption
              title="Primary CTA Only (No Secondary)"
              description="The secondary CTA is optional. When omitted, only the primary CTA button is displayed."
              code={`<FeaturedVideoHero
  headline="Single Call to Action"
  subtitle="Focus on one primary action for better conversion."
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  videoElement={{
    src: "/video/intro.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
      <FeaturedVideoHero
        headline="Single Call to Action"
        subtitle="Focus on one primary action for better conversion."
        callsToAction={[{ children: "Get Started", href: "/docs" }]}
        videoElement={{
          src: placeholderVideo,
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
        }}
      />
      <PageGrid className="py-26">
        {/* Without subtitle */}
        <PageGridRow>
          <PageGridCol>
            <DemoCaption
              title="Without Subtitle"
              description="Subtitle is optional. The component renders without a subtitle section when omitted."
              code={`<FeaturedVideoHero
  headline="Headline Only"
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  videoElement={{
    src: "/video/intro.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
            />
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
      <FeaturedVideoHero
        headline="Headline Only"
        callsToAction={[{ children: "Get Started", href: "/docs" }]}
        videoElement={{
          src: placeholderVideo,
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
        }}
      />
      <PageGrid className="py-26">
        {/* Props Documentation */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Props Documentation</h2>

              <h4 className="h5 mb-4">FeaturedVideoHeroProps</h4>
              <div className="mb-6">
                <ul>
                  <li>
                    <code>headline</code> (required) -{" "}
                    <code>React.ReactNode</code> - Hero headline text
                  </li>
                  <li>
                    <code>subtitle</code> (optional) -{" "}
                    <code>React.ReactNode</code> - Hero subtitle text
                  </li>
                  <li>
                    <code>callsToAction</code> (optional) -{" "}
                    <code>DesignConstrainedCallsToActions</code> - Array with
                    primary CTA and optional secondary CTA. Omit or pass
                    empty/non-rendering CTAs to hide the CTA section.
                  </li>
                  <li>
                    <code>videoElement</code> (required) - Native{" "}
                    <code>&lt;video&gt;</code> element props (e.g. src,
                    autoPlay, loop, muted, playsInline, controls, preload,
                    poster)
                  </li>
                  <li>
                    <code>className</code> (optional) - <code>string</code> -
                    Additional CSS classes for the header element
                  </li>
                  <li>
                    All standard HTML <code>&lt;header&gt;</code> attributes are
                    supported
                  </li>
                </ul>
              </div>

              <h4 className="h5 mb-4">Button Props (callsToAction)</h4>
              <p className="mb-4">
                The <code>callsToAction</code> prop accepts design-constrained
                Button props; <code>variant</code> and <code>color</code> are
                set by the component:
              </p>
              <ul>
                <li>
                  Primary CTA: <code>variant="primary"</code>,{" "}
                  <code>color="green"</code>
                </li>
                <li>
                  Secondary CTA: <code>variant="tertiary"</code>,{" "}
                  <code>color="green"</code>
                </li>
                <li>
                  All other Button props are supported (e.g.,{" "}
                  <code>children</code>, <code>href</code>, <code>onClick</code>
                  , etc.)
                </li>
              </ul>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Code Examples */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Code Examples</h2>

              <h4 className="h5 mb-4">Import</h4>
              <div
                className="p-4 bg-light br-4 mb-6"
                style={{ fontFamily: "monospace", fontSize: "14px" }}
              >
                <pre style={{ margin: 0, color: "#000" }}>
                  {`import { FeaturedVideoHero } from "shared/patterns/FeaturedVideoHero";`}
                </pre>
              </div>

              <h4 className="h5 mb-4">Basic Example</h4>
              <div
                className="p-4 bg-light br-4 mb-6"
                style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  overflow: "auto",
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                }}
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {`<FeaturedVideoHero
  headline="Build on XRPL"
  subtitle={
    <>
      <p>Issue, manage, and trade real-world assets without needing to build smart contracts.</p>
      <p>XRP Ledger's built-in functionality and compliance-enabling features allow asset tokenization without additional layers of complexity.</p>
    </>
  }
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  videoElement={{
    src: "/video/intro.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
                </pre>
              </div>

              <h4 className="h5 mb-4">With Secondary CTA</h4>
              <div
                className="p-4 bg-light br-4 mb-6"
                style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  overflow: "auto",
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                }}
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {`<FeaturedVideoHero
  headline="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build solutions."
  callsToAction={[
    { children: "Get Started", href: "/docs" },
    { children: "Learn More", href: "/about" }
  ]}
  videoElement={{
    src: "/video/tokenization.mp4",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
                </pre>
              </div>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Best Practices */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Best Practices</h2>
              <ul>
                <li>
                  <strong>Video format:</strong> Use MP4 with H.264 for broad
                  compatibility. Keep file sizes reasonable for fast loading.
                </li>
                <li>
                  <strong>Autoplay:</strong> Use <code>muted</code> and{" "}
                  <code>playsInline</code> with <code>autoPlay</code> for
                  reliable autoplay on mobile.
                </li>
                <li>
                  <strong>CTAs:</strong> Keep CTA text concise and
                  action-oriented. Primary CTA should be the main action.
                </li>
                <li>
                  <strong>Headlines:</strong> Keep headlines concise and
                  impactful. Use the subtitle for additional context.
                </li>
                <li>
                  <strong>Responsive design:</strong> The layout stacks on
                  smaller screens; test across breakpoints to ensure video and
                  content display correctly.
                </li>
              </ul>
            </div>
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
    </div>
  );
}

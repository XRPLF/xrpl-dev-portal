import * as React from "react";
import {
  PageGrid,
  PageGridRow,
  PageGridCol,
} from "shared/components/PageGrid/page-grid";
import HeaderHeroPrimaryMedia from "shared/patterns/HeaderHeroPrimaryMedia/HeaderHeroPrimaryMedia";

export const frontmatter = {
  seo: {
    title: "HeaderHeroPrimaryMedia Pattern Showcase",
    description:
      "Interactive showcase of the HeaderHeroPrimaryMedia pattern with all variants, media types, and responsive behavior.",
  },
};

// Demo component for code examples
const CodeDemo = ({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description?: string;
  code?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-26">
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
    <div
      style={{
        border: "1px dashed #ccc",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      {children}
    </div>
  </div>
);

// Sample placeholder images
const placeholderImage =
  "https://cdn.sanity.io/images/ior4a5y3/production/6e150606bc0a051a83b90aa830cc32854cc3f7df-2928x1920.jpg";
const placeholderVideo =
  "https://cdn.sanity.io/files/ior4a5y3/production/6e2fcba46e3f045a5570c86fd5d20d5ba93d6aad.mp4";

// Sample custom animation component
const SampleAnimation = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0069ff",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    }}
  >
    Custom Animation Element
  </div>
);

export default function HeaderHeroPrimaryMediaShowcase() {
  return (
    <div className="landing">
      <PageGrid className="py-26">
        <PageGridRow>
          <PageGridCol>
            <div className="text-center mb-26">
              <h6 className="eyebrow mb-3">Pattern Showcase</h6>
              <h1 className="h2 mb-4">HeaderHeroPrimaryMedia Pattern</h1>
              <p className="longform">
                A page-level hero pattern featuring a headline, subtitle,
                call-to-action buttons, and a primary media element. The media
                supports images, videos, or custom React elements, all
                constrained to maintain a 9:16 aspect ratio with object-fit:
                cover.
              </p>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Basic Usage */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Basic Usage with Image Media"
              description="The simplest implementation with an image, headline, subtitle, and primary CTA."
              code={`<HeaderHeroPrimaryMedia
  headline="Build on XRPL"
  subtitle="Start developing today with our comprehensive developer tools and APIs."
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  media={{
    type: "image",
    src: "/img/hero.png",
    alt: "XRPL Development"
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Build on XRPL"
                subtitle="Start developing today with our comprehensive developer tools and APIs."
                callsToAction={[{ children: "Get Started", href: "/docs" }]}
                media={{
                  type: "image",
                  src: placeholderImage,
                  alt: "XRPL Development",
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Primary + Secondary CTA */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Primary and Secondary CTAs"
              description="Include both primary and secondary call-to-action buttons."
              code={`<HeaderHeroPrimaryMedia
  headline="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build tokenization solutions."
  callsToAction={[
    { children: "Get Started", href: "/docs" },
    { children: "Learn More", href: "/about" }
  ]}
  media={{
    type: "image",
    src: "/img/tokenization.png",
    alt: "Tokenization"
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Real-world asset tokenization"
                subtitle="Learn how to issue crypto tokens and build tokenization solutions."
                callsToAction={[
                  { children: "Get Started", href: "/docs" },
                  { children: "Learn More", href: "/about" },
                ]}
                media={{
                  type: "image",
                  src: placeholderImage,
                  alt: "Tokenization",
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Video Media */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Video Media"
              description="Use video elements with native video props support. The video will maintain the 9:16 aspect ratio and object-fit: cover."
              code={`<HeaderHeroPrimaryMedia
  headline="Watch and Learn"
  subtitle="Explore our video tutorials and guides."
  callsToAction={[
    { children: "Watch Tutorials", href: "/tutorials" }
  ]}
  media={{
    type: "video",
    src: "/video/intro.mp4",
    alt: "Introduction video",
    autoPlay: true,
    loop: true,
    muted: true,
    playsInline: true
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Watch and Learn"
                subtitle="Explore our video tutorials and guides."
                callsToAction={[
                  { children: "Watch Tutorials", href: "/tutorials" },
                ]}
                media={{
                  type: "video",
                  src: placeholderVideo,
                  alt: "Introduction video",
                  autoPlay: true,
                  loop: true,
                  muted: true,
                  playsInline: true,
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Custom Element Media */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Custom Element Media"
              description="Use custom React elements for animations, interactive components, or any custom media type."
              code={`<HeaderHeroPrimaryMedia
  headline="Interactive Experience"
  subtitle="Engage with our custom interactive media."
  callsToAction={[
    { children: "Explore", href: "/interactive" }
  ]}
  media={{
    type: "custom",
    element: <MyAnimationComponent />
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Interactive Experience"
                subtitle="Engage with our custom interactive media."
                callsToAction={[{ children: "Explore", href: "/interactive" }]}
                media={{
                  type: "custom",
                  element: <SampleAnimation />,
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Extended Image Props */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Extended Image Props"
              description="Leverage native img element props like loading, crossOrigin, etc. className and style are omitted from img props and only available on the container."
              code={`<HeaderHeroPrimaryMedia
  headline="Optimized Images"
  subtitle="Use native image attributes for performance and security."
  callsToAction={[
    { children: "View Gallery", href: "/gallery" }
  ]}
  media={{
    type: "image",
    src: "/img/gallery.jpg",
    alt: "Image gallery",
    loading: "lazy",
    crossOrigin: "anonymous",
    decoding: "async"
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Optimized Images"
                subtitle="Use native image attributes for performance and security."
                callsToAction={[{ children: "View Gallery", href: "/gallery" }]}
                media={{
                  type: "image",
                  src: placeholderImage,
                  alt: "Image gallery",
                  loading: "lazy",
                  decoding: "async",
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Extended Video Props */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Extended Video Props"
              description="Use native video element props for controls, preload, poster, etc."
              code={`<HeaderHeroPrimaryMedia
  headline="Video Content"
  subtitle="Rich video experiences with full control."
  callsToAction={[
    { children: "Watch Now", href: "/videos" }
  ]}
  media={{
    type: "video",
    src: "/video/demo.mp4",
    alt: "Demo video",
    controls: true,
    preload: "metadata",
    poster: "/img/video-poster.jpg"
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Video Content"
                subtitle="Rich video experiences with full control."
                callsToAction={[{ children: "Watch Now", href: "/videos" }]}
                media={{
                  type: "video",
                  src: placeholderVideo,
                  alt: "Demo video",
                  controls: true,
                  preload: "metadata",
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Missing Optional Fields - Validation Examples */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Validation Examples</h2>
              <p className="mb-6">
                The component includes development-time validation that logs
                warnings to the console when required props are missing. The
                component will still render, but you'll see warnings in the
                browser console.
              </p>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Missing Subtitle */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Missing Subtitle (Warning Example)"
              description="When subtitle is missing, a warning will be logged to the console. The component still renders but the subtitle area will be empty."
              code={`<HeaderHeroPrimaryMedia
  headline="Build on XRPL"
  subtitle={undefined}
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  media={{
    type: "image",
    src: "/img/hero.png",
    alt: "XRPL Development"
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Build on XRPL"
                subtitle={undefined as any}
                callsToAction={[{ children: "Get Started", href: "/docs" }]}
                media={{
                  type: "image",
                  src: placeholderImage,
                  alt: "XRPL Development",
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Missing Secondary CTA */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Primary CTA Only (No Secondary)"
              description="The secondary CTA is optional. When omitted, only the primary CTA button is displayed. This is the recommended pattern when you want a single, focused call-to-action."
              code={`<HeaderHeroPrimaryMedia
  headline="Single Call to Action"
  subtitle="Focus on one primary action for better conversion."
  callsToAction={[
    { children: "Get Started", href: "/docs" }
    // No secondary CTA - this is valid
  ]}
  media={{
    type: "image",
    src: "/img/hero.png",
    alt: "Single CTA example"
  }}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Single Call to Action"
                subtitle="Focus on one primary action for better conversion."
                callsToAction={[{ children: "Get Started", href: "/docs" }]}
                media={{
                  type: "image",
                  src: placeholderImage,
                  alt: "Single CTA example",
                }}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Missing Media */}
        <PageGridRow>
          <PageGridCol>
            <CodeDemo
              title="Missing Media (Warning Example)"
              description="When media is missing, a warning will be logged to the console. The component still renders but the media section will not be displayed."
              code={`<HeaderHeroPrimaryMedia
  headline="Content Without Media"
  subtitle="Sometimes you may want to focus purely on the content without media."
  callsToAction={[
    { children: "Learn More", href: "/about" }
  ]}
  media={undefined}
/>`}
            >
              <HeaderHeroPrimaryMedia
                headline="Content Without Media"
                subtitle="Sometimes you may want to focus purely on the content without media."
                callsToAction={[{ children: "Learn More", href: "/about" }]}
                media={undefined as any}
              />
            </CodeDemo>
          </PageGridCol>
        </PageGridRow>

        {/* Design Constraints */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Design Constraints</h2>
              <p className="mb-6">
                The HeaderHeroPrimaryMedia pattern enforces specific design
                requirements to maintain visual consistency across all
                implementations:
              </p>
              <ul className="mb-6">
                <li>
                  <strong>Aspect Ratio:</strong> All media maintains a 9:16
                  aspect ratio (portrait orientation)
                </li>
                <li>
                  <strong>Object Fit:</strong> Media uses{" "}
                  <code>object-fit: cover</code> to fill the container while
                  maintaining aspect ratio
                </li>
                <li>
                  <strong>Responsive Behavior:</strong> The media container
                  adapts responsively while maintaining the aspect ratio
                  constraint
                </li>
                <li>
                  <strong>Type Safety:</strong> TypeScript ensures proper media
                  type discrimination and prop validation
                </li>
              </ul>
              <div
                className="p-4 bg-light br-4"
                style={{ fontFamily: "monospace", fontSize: "14px" }}
              >
                <pre style={{ margin: 0, color: "#000" }}>
                  {`.bds-header-hero-primary-media__media-container {
  width: 100%;
  aspect-ratio: 9 / 16; /* Design requirement */
  overflow: hidden;
}

.bds-header-hero-primary-media__media-element {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures media covers container */
  object-position: center;
}`}
                </pre>
              </div>
            </div>
          </PageGridCol>
        </PageGridRow>

        {/* Props Documentation */}
        <PageGridRow>
          <PageGridCol>
            <div className="mb-26">
              <h2 className="h3 mb-6">Props Documentation</h2>

              <h4 className="h5 mb-4">HeaderHeroPrimaryMediaProps</h4>
              <div className="mb-6">
                <ul>
                  <li>
                    <code>headline</code> (required) -{" "}
                    <code>React.ReactNode</code> - Hero headline text
                  </li>
                  <li>
                    <code>subtitle</code> (required) -{" "}
                    <code>React.ReactNode</code> - Hero subtitle text
                  </li>
                  <li>
                    <code>callsToAction</code> (required) -{" "}
                    <code>[ButtonProps, ButtonProps?]</code> - Array with
                    primary CTA (required) and optional secondary CTA
                  </li>
                  <li>
                    <code>media</code> (required) - <code>HeaderHeroMedia</code>{" "}
                    - Media element (image, video, or custom)
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

              <h4 className="h5 mb-4">HeaderHeroMedia Types</h4>
              <div className="mb-6">
                <h5 className="h6 mb-3">ImageMediaProps</h5>
                <ul className="mb-4">
                  <li>
                    <code>type: "image"</code> (required)
                  </li>
                  <li>
                    <code>src: string</code> (required) - Image source URL
                  </li>
                  <li>
                    <code>alt: string</code> (required) - Alt text for
                    accessibility
                  </li>
                  <li>
                    All native <code>&lt;img&gt;</code> props except{" "}
                    <code>className</code> and <code>style</code>
                  </li>
                </ul>

                <h5 className="h6 mb-3">VideoMediaProps</h5>
                <ul className="mb-4">
                  <li>
                    <code>type: "video"</code> (required)
                  </li>
                  <li>
                    <code>src: string</code> (required) - Video source URL
                  </li>
                  <li>
                    <code>alt?: string</code> (optional) - Alt text for
                    accessibility
                  </li>
                  <li>
                    All native <code>&lt;video&gt;</code> props except{" "}
                    <code>className</code> and <code>style</code>
                  </li>
                </ul>

                <h5 className="h6 mb-3">CustomMediaProps</h5>
                <ul>
                  <li>
                    <code>type: "custom"</code> (required)
                  </li>
                  <li>
                    <code>element: React.ReactElement</code> (required) - Custom
                    React element to render
                  </li>
                </ul>
              </div>

              <h4 className="h5 mb-4">Button Props (callsToAction)</h4>
              <p className="mb-4">
                The <code>callsToAction</code> prop accepts Button component
                props, but <code>variant</code> and <code>color</code> are
                automatically set:
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
                  {`import HeaderHeroPrimaryMedia from "shared/patterns/HeaderHeroPrimaryMedia/HeaderHeroPrimaryMedia";`}
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
                  {`<HeaderHeroPrimaryMedia
  headline="Build on XRPL"
  subtitle="Start developing today with our comprehensive developer tools."
  callsToAction={[
    { children: "Get Started", href: "/docs" }
  ]}
  media={{
    type: "image",
    src: "/img/hero.png",
    alt: "XRPL Development"
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
                  {`<HeaderHeroPrimaryMedia
  headline="Real-world asset tokenization"
  subtitle="Learn how to issue crypto tokens and build solutions."
  callsToAction={[
    { children: "Get Started", href: "/docs" },
    { children: "Learn More", href: "/about" }
  ]}
  media={{
    type: "image",
    src: "/img/tokenization.png",
    alt: "Tokenization"
  }}
/>`}
                </pre>
              </div>

              <h4 className="h5 mb-4">Video Media</h4>
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
                  {`<HeaderHeroPrimaryMedia
  headline="Watch and Learn"
  subtitle="Explore our video tutorials."
  callsToAction={[
    { children: "Watch Tutorials", href: "/tutorials" }
  ]}
  media={{
    type: "video",
    src: "/video/intro.mp4",
    alt: "Introduction video",
    autoPlay: true,
    loop: true,
    muted: true
  }}
/>`}
                </pre>
              </div>

              <h4 className="h5 mb-4">Custom Element</h4>
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
                  {`<HeaderHeroPrimaryMedia
  headline="Interactive Experience"
  subtitle="Engage with custom media."
  callsToAction={[
    { children: "Explore", href: "/interactive" }
  ]}
  media={{
    type: "custom",
    element: <MyAnimationComponent />
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
                  <strong>Media Selection:</strong> Choose media that works well
                  in a 9:16 portrait aspect ratio. Images and videos will be
                  cropped to fit.
                </li>
                <li>
                  <strong>Alt Text:</strong> Always provide meaningful alt text
                  for images. For videos, use the <code>alt</code> prop for
                  accessibility.
                </li>
                <li>
                  <strong>Performance:</strong> Use <code>loading="lazy"</code>{" "}
                  for images below the fold, and optimize video file sizes.
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
                  <strong>Type Safety:</strong> Leverage TypeScript's
                  discriminated unions for type-safe media selection.
                </li>
                <li>
                  <strong>Responsive Design:</strong> Test your implementation
                  across all breakpoints to ensure media displays correctly.
                </li>
              </ul>
            </div>
          </PageGridCol>
        </PageGridRow>
      </PageGrid>
    </div>
  );
}

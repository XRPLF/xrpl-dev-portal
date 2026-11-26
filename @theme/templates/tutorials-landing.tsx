import { DocumentationLayout } from '@redocly/theme/layouts/DocumentationLayout';

/**
 * Page template for docs/tutorials/index.md. Keeps the docs sidebar and
 * breadcrumbs but drops the Markdown article wrapper and its column width, so
 * the {% tutorials-landing /%} tag renders edge to edge like a React page.
 */
export default function TutorialsLandingTemplate({ pageProps, children }) {
  return (
    <DocumentationLayout {...pageProps} className="tutorials-landing-layout">
      {children}
    </DocumentationLayout>
  );
}

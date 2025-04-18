import React from 'react';
import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';
import { DocumentationLayout } from '@redocly/theme/layouts/DocumentationLayout';

function PostInfo(data) {
    return (
        <div className="blog-post-info">
            Publication date: {data.date}
        </div>
    )
}

export default function BlogPost({ pageProps, children }) {
  return (
    <DocumentationLayout tableOfContent={null} feedback={null}>
      <PostInfo data={pageProps.frontmatter} />
      <MarkdownWrapper>{children}</MarkdownWrapper>
    </DocumentationLayout>
  );
}

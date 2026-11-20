import { Markdown } from '@redocly/theme/components/Markdown/Markdown';
import { DocumentationLayout } from '@redocly/theme/layouts/DocumentationLayout';
import { TableOfContent } from '@redocly/theme/components/TableOfContent/TableOfContent';
import { PageActionsContext } from '@redocly/theme/core/contexts';
import styled from 'styled-components';

const LayoutWrapper = styled.div`
display: flex;
flex: 1;
width: 100%;
`;

function PostInfo(data) {
    return (
        <div className="blog-post-info">
            Publication date: {data.data.date}
        </div>
    )
}

export default function BlogPost({ pageProps, children }) {
  return (
    <LayoutWrapper>
      <DocumentationLayout {...pageProps}>
        <PostInfo data={pageProps.frontmatter} />
        <PageActionsContext.Provider value={true}>
          <Markdown>{children}</Markdown>
        </PageActionsContext.Provider>
      </DocumentationLayout>
      <TableOfContent {...pageProps} />
    </LayoutWrapper>
  );
}

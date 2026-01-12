import { Markdown } from '@redocly/theme/components/Markdown/Markdown'
import { DocumentationLayout } from '@redocly/theme/layouts/DocumentationLayout'
import { TableOfContent } from '@redocly/theme/components/TableOfContent/TableOfContent'
import styled from 'styled-components'

const LayoutWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`

function PostInfo(data) {
  return <div className="blog-post-info">Publication date: {data.data.date}</div>
}

export default function BlogPost({ pageProps, children }) {
  return (
    <LayoutWrapper>
      <DocumentationLayout {...pageProps}>
        <PostInfo data={pageProps.frontmatter} />
        <Markdown>{children}</Markdown>
      </DocumentationLayout>
      <TableOfContent {...pageProps} />
    </LayoutWrapper>
  )
}

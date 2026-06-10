// Create a link to xrpld source code. Release branch is defined in .env

import type { Node } from '@markdoc/markdoc'
import { Link } from '@redocly/theme/components/Link/Link'

const XRPLD_REPO = 'https://github.com/XRPLF/rippled'

function buildSourceHref(path: string, release: string): string {
  const treeblob = path.indexOf('.') >= 0 ? 'blob' : 'tree'
  const cleanPath = path.replace(/^\//, '')
  return `${XRPLD_REPO}/${treeblob}/${release}/${cleanPath}`
}

// sourceLinkForLlms for LLM .md export
// SourceLink for rendered page link
export function sourceLinkForLlms(node: Node): string {
  const release = process.env.PUBLIC_XRPLD_RELEASE || ''
  return `[Source] ${buildSourceHref(node.attributes.path, release)}`
}

export default function SourceLink(props: {
  path: string
  xrpld_release: string
}) {
  const href = buildSourceHref(props.path, props.xrpld_release)

  return <Link to={href} className="source-link">[Source]</Link>
}

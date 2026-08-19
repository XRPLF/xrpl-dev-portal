// Create a link to xrpld source code.
// URL built from base repo + PUBLIC_XRPLD_RELEASE in .env + given path.
// - Default (no `name`): a [Source] link with `source-link` class styling.
// - With `name`: same URL, but `name` link text and no class styling.

import type { Node } from '@markdoc/markdoc'
import { Link } from '@redocly/theme/components/Link/Link'

const XRPLD_REPO = 'https://github.com/XRPLF/rippled'

function buildSourceHref(path: string, release: string): string {
  const treeblob = path.indexOf('.') >= 0 ? 'blob' : 'tree'
  const cleanPath = path.replace(/^\//, '')
  return `${XRPLD_REPO}/${treeblob}/${release}/${cleanPath}`
}

// Markdown link output for LLM export.
export function sourceLinkForLlms(node: Node): string {
  const release = process.env.PUBLIC_XRPLD_RELEASE || ''
  const href = buildSourceHref(node.attributes.path, release)
  const { name } = node.attributes
  return name ? `[${name}](${href})` : `[Source](${href})`
}

export default function SourceLink(props: {
  path: string
  xrpld_release: string
  name?: string
}) {
  const href = buildSourceHref(props.path, props.xrpld_release)

  // Custom link text, no source-link styling.
  if (props.name) {
    return <Link to={href}>{props.name}</Link>
  }

  // [Source] link with right-aligned styling.
  return <Link to={href} className="source-link">[Source]</Link>
}

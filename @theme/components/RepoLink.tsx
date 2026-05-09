// Create a link into the source code repository for this project.
// This is supposed to adjust so that PR builds use the branch+fork of the PR,
// but that part wasn't implemented for Redocly builds.

import * as React from 'react'
import dynamicReact from '@markdoc/markdoc/dist/react'
import { Link } from '@redocly/theme/components/Link/Link'

export default function RepoLink(props: {
  children: React.ReactNode
  path: string
  github_fork: string
  github_branch: string
  source: boolean
}) {
  const treeblob = props.path.indexOf(".") >= 0 ? "blob/" : "tree/"
  const sep = props.github_fork[-1] == "/" ? "" : "/"
  const href = props.github_fork+sep+treeblob+props.github_branch+"/"+props.path

  return (
    <Link to={href} className={props.source ? "source-link" : undefined}>{dynamicReact(props.children, React, {})}</Link>
  )
}

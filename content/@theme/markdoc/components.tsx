import * as React from 'react';
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react';
import { Link } from '@portal/Link';

export function RepoLink(props: {
        children: React.ReactNode;
        path: string;
        github_fork: string;
        github_branch: string
    }) {
    const treeblob = props.path.indexOf(".") >= 0 ? "blob/" : "tree/"
    const sep = props.github_fork[-1] == "/" ? "" : "/"
    const href = props.github_fork+sep+treeblob+props.github_branch+"/"+props.path

    return (
        <Link to={href}>{dynamicReact(props.children, React, {})}</Link>
    )
}
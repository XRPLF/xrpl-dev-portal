import * as React from 'react';
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react';
import { usePageSharedData } from '@portal/hooks';
import { Link } from '@portal/Link';

export function IndexPageItems() {
    const data = usePageSharedData('index-page-items') as any[];
    return (
        <div className="children-display">
            <ul>
              {data.map((item: any) => (
                <li className="level-1">
                  <Link to={item.slug}>{item.title}</Link>
                  <p className='class="blurb child-blurb'>{item.blurb}</p>
                </li>
              ))}
            </ul>
        </div>
    );
}

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

export function CodePageName(props: {
    name: string;
}) {
    return (
        <code>{props.name}</code>
    )
}
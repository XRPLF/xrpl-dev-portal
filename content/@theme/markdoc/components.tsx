import * as React from 'react';
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react';
import { Link } from '@portal/Link';

export function RepoLink(props: { children: React.ReactNode; path: string }) {
    const href = "https://github.com/XRPLF/xrpl-dev-portal/tree/master/"+path

    return (
        <Link to={href}>{dynamicReact(props.children, React, {})}</Link>
    )
}
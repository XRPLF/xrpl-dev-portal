import * as React from 'react';
import dynamicReact from '@markdoc/markdoc/dist/react';
import { Link } from '@redocly/theme/components/Link/Link';

export interface XRPLCardProps {
    title: string,
    href: string,
    body?: string,
    image?: string,
    imageAlt?: string,
    external: boolean,
}

export function XRPLCard(props: XRPLCardProps) {
    return (
        <Link className="card float-up-on-hover" to={props.href} >
            <div className="card-body">
              { props.image && (
                <div className="card-icon-container">
                    <img src={props.image} alt={props.imageAlt} />
                </div>
              )}
              <h4 className="card-title h5">{props.title}</h4>
              { props.body && (
                <p className="card-text">{props.body}</p>
              )}
            </div>
            <div className="card-footer">&nbsp;</div>
        </Link>
    )
}

export function CardGrid(props) {
    const gridClass = `card-grid card-grid-${props.layout}`
    return (
        <div id={props.id} className={gridClass}>{dynamicReact(props.children, React, {})}</div>
    )
}

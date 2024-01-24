import * as React from 'react';
import dynamicReact from '@markdoc/markdoc/dist/react';


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
        <a className="card float-up-on-hover" href={props.href} >
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
        </a>
    )
}

export function CardGrid(props) {
    const gridClass = `card-grid card-grid-${props.layout}`
    return (
        <div id={props.id} className={gridClass}>{dynamicReact(props.children, React, {})}</div>
    )
}

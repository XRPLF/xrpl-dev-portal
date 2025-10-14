import * as React from 'react';
import dynamicReact from '@markdoc/markdoc/dist/react'
import { useThemeHooks } from '@redocly/theme/core/hooks'
import { Link } from '@redocly/theme/components/Link/Link'
import { NotEnabled } from '@theme/markdoc/components';

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

export function NavCard(props: {
  label: string
}) {
  const { usePageSharedData } = useThemeHooks()
  const data = usePageSharedData('index-page-items') as any[]
  //console.log(data)//TODO:remove
  const matchingPages = data.filter((page) => {return page.labels?.includes(props.label)})
  console.log(matchingPages)
  return (
    <div className="card nav-card">
      <h3 className="card-title">{props.label}</h3>
      <ul className="nav">
        {matchingPages?.map((page: any) => (
          <li className="nav-item" key={page.slug}>
            <Link className="nav-link" to={page.slug}>{
                page.status === "not_enabled" ? (<>
                  <NotEnabled />
                  {" "}
                </>) : ""
              }{page.title}</Link>
            <p className="blurb child-blurb">{page.seo?.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CardGrid(props) {
    const gridClass = `card-grid card-grid-${props.layout}`
    return (
        <div id={props.id} className={gridClass}>{dynamicReact(props.children, React, {})}</div>
    )
}

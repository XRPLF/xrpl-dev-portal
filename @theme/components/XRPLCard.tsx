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

export function LabelGrid(props: {
  category: string
}) {
  const { usePageSharedData } = useThemeHooks()
  const data = usePageSharedData('index-page-items') as any[]
  const matchingPages = data.filter((page) => {return page.category === props.category})
  const labelsInCategory = []
  const unlabeled = []
  for (const page of matchingPages) {
    if (page.labels) {
      for (const label of page.labels) {
        if (!labelsInCategory.includes(label)) {
          labelsInCategory.push(label)
        }
      }
    } else {
      unlabeled.push(page)
    }
  }
  labelsInCategory.sort()
  return (
    <div className="card-grid card-grid-2xN">
      {labelsInCategory.map( (label) => (
          RawNavCard(label, matchingPages.filter((page) => {return page.labels?.includes(label)})
        ) )
      )}
      { unlabeled.length ? (
        RawNavCard("Unlabeled", unlabeled)
      ) : ""}
    </div>
  )
}


function RawNavCard(label: string, pages: any[]) {
  return (
    <div className="card nav-card" key={label}>
      <h3 className="card-title">{label}</h3>
      <ul className="nav">
        {pages?.map((page: any) => (
          <li className="nav-item" key={page.slug}>
            <Link className="nav-link" to={page.slug}>{
                page.status === "not_enabled" ? (<>
                  <NotEnabled />
                  {" "}
                </>) : ""
              }{page.title}</Link>
            {
              // To add page descriptions to the cards, uncomment:
              //<p className="blurb child-blurb">{page.seo?.description}</p>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}

export function NavCard(props: {
  label: string
}) {
  const { usePageSharedData } = useThemeHooks()
  const data = usePageSharedData('index-page-items') as any[]
  const matchingPages = data.filter((page) => {return page.labels?.includes(props.label)})

  return RawNavCard(props.label, matchingPages)
}

export function CardGrid(props) {
    const gridClass = `card-grid card-grid-${props.layout}`
    return (
        <div id={props.id} className={gridClass}>{dynamicReact(props.children, React, {})}</div>
    )
}

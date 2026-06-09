// Component for {% child-pages /%} markdoc tag.
// Return a list of children of the current page.

import { useThemeHooks } from '@redocly/theme/core/hooks'
import { Link } from '@redocly/theme/components/Link/Link'
import NotEnabled from './NotEnabled'

export default function ChildPages() {
  const { usePageSharedData } = useThemeHooks()
  const data = usePageSharedData('index-page-items') as any[]
  return (
    <div className="children-display">
      <ul>
        {data?.map((item: any) => (
          <li className="level-1" key={item.slug}>
            <Link to={item.slug}>{item.title}</Link>
              {
                item.status === "not_enabled" ? (<NotEnabled />) : ""
              }
            <p className="blurb child-blurb">{item.seo?.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Component for {% tx-category %} Markdoc tag. Shows a list (table?) of child pages
// with the matching labels in the frontmatter.
// Requires the index-pages Redocly plugin to get child page data.

import { useThemeHooks } from '@redocly/theme/core/hooks'
import { Link } from '@redocly/theme/components/Link/Link'
import { AmendmentDisclaimer } from './Amendments'

interface TxCategoryProps {
  name: string,
}

export function TxCategory(props: TxCategoryProps) {
  const { usePageSharedData } = useThemeHooks()
  const data = usePageSharedData('index-page-items') as any[]
  const matchingItems = data?.filter( (page) => {
    if (page.labels && page.labels.includes(props.name)) {
      return true
    }
    return false
  })

  return (
    <div className="tx-type-list">
      {
        matchingItems?.map((item: any) => (
          <TxTypeLink key={item.slug} page={item} />
        ))
      }
    </div>
  )
}

const txIcons = {
  "create": require('../../static/img/tx-icons/TransactionCreateIcon.svg'),
  "modify": require('../../static/img/tx-icons/TransactionModifyIcon.svg'),
  "finish": require('../../static/img/tx-icons/TransactionFinishIcon.svg'),
  "cancel": require('../../static/img/tx-icons/TransactionCancelIcon.svg'),
  "send": require('../../static/img/tx-icons/TransactionSendIcon.svg'),
  "other": require('../../static/img/tx-icons/TransactionUnknownIcon.svg'),
}

function TxTypeLink(props: {page: any}) {
  const page = props.page
  let txIcon = txIcons["other"]
  if (page.txIcon && txIcons[page.txIcon.toLowerCase()]) {
    txIcon = txIcons[page.txIcon]
  }
  return (
    <div className="tx-type">
      <Link to={page.slug} className="tx-title"><img className="tx-type-icon" src={txIcon} alt="" /> {page.title}</Link>
      {
        page.requiredAmendment && 
        <div className="required-amendment">
          Requires: <AmendmentDisclaimer name={page.requiredAmendment} compact={true} mode="" />
        </div>
      }
      {
        page.seo?.description &&
        <div className="tx-desc">{page.seo.description}</div>
      }
    </div>
  )
}

// Component for {% not-enabled /%} markdoc tag. Shows a flask icon with a 
// tooltip so you can indicate that a feature is not enabled on the 
// XRP Ledger Mainnet. Legacy usage, mostly; prefer {% amendment-disclaimer %}
// for most cases.

import { useThemeHooks } from '@redocly/theme/core/hooks'

export default function NotEnabled() {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  return (
    <span className="status not_enabled" title={translate("This feature is not currently enabled on the production XRP Ledger.")}><i className="fa fa-flask"></i></span>
  )
}

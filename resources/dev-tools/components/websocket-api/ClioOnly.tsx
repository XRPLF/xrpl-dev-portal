import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Icon } from "shared/components/Icon/Icon";

export function ClioOnlyIcon () {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  return (
      <span
        className="status clio_only"
        title={translate("resources.dev-tools.websocket-api.clio-only-tooltip", "This method is only available from the Clio server.")}
      >
        <Icon name="exclamation-circle" />
      </span>
  )
}

export function ClioOnlyNotice() {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  return (
    <span className="clio-only-notice"
    >
      <ClioOnlyIcon />
      {translate("resources.dev-tools.websocket-api.clio-only-badge", " Clio only")}
    </span>
  )
}

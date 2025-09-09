import { useThemeHooks } from '@redocly/theme/core/hooks';

export function ClioOnlyIcon () {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  return (
      <span
        className="status clio_only"
        title={translate("This method is only available from the Clio server.")}
      >
        <i className="fa fa-exclamation-circle"></i>
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
      {translate(" Clio only")}
    </span>
  )
}

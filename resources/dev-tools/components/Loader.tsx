import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';

export const Loader = () => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <img className="throbber" src="/img/xrp-loader-96.png" alt={translate("(loading)")} />

}

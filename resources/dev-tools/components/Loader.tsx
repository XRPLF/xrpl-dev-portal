import * as React from 'react';
import { useTranslate } from "@portal/hooks";

export const Loader = () => {
  const { translate } = useTranslate();

  return <img className="throbber" src="/img/xrp-loader-96.png" alt={translate("(loading)")} />

}

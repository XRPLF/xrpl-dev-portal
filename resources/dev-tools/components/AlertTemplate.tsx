import clsx from 'clsx'
import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
  
const alertStyle = {
  position: "relative",
  margin: "0px",
  zIndex: "9999",
}
  
function typeToClass(type: string): string {
  if(type === "error") {
    return "alert-danger"
  } else if(type === "success") {
    return "alert-success"
  } else if(type === "info") {
    return "alert-info"
  } else {
    return ""
  }
}

interface AlertTemplateProps {
  message: string
  options: {
    type: string
  }
  style: any
  close: any // Callback to close the alert early
}
  
export default function AlertTemplate ({ message, options, style, close }: AlertTemplateProps): React.JSX.Element {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate()
  return(
    <div className={clsx("bootstrap-growl alert alert-dismissible", typeToClass(options.type))} style={{ ...alertStyle, ...style }}>
      <button className="close" data-dismiss="alert" type="button" onClick={close}>
        <span aria-hidden="true">×</span>
        <span className="sr-only">{translate("Close")}</span>
      </button>
      {message}
    </div>
  )
}

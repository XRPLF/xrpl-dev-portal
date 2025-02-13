import * as React from "react";
import { useThemeHooks } from "@redocly/theme/core/hooks";

const alertStyle: React.CSSProperties = {
  position: "relative",
  margin: "0px",
  zIndex: 9999,
};
interface AlertTemplateProps {
  message: string;
  link: string;
  button: string;
  show: boolean;
}

export default function AlertTemplate({
  message,
  link,
  button,
  show,
}: AlertTemplateProps): React.JSX.Element {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  if (!show) return null;
  return (
    <div
      className={`web-banner`}
      style={{ ...alertStyle }}
    >
      <div className="banner-content">
        <div className="event-info">{translate(message)}</div>
        <button
          onClick={() => window.open(link, "_blank")}
          className="ticket-button"
        >
          <span className="button-text">{translate(button)}</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/7f21b7559e5f46cebba4373859bcb6b5/bb74a0f169c7bf5ebfe70eabaef024556dd89f9a3e47a03da76851b4f66dab43?apiKey=7f21b7559e5f46cebba4373859bcb6b5&"
            alt=""
            className="button-icon"
          />
        </button>
      </div>
    </div>
  );
  // return(
  //   <div className={clsx("bootstrap-growl alert alert-dismissible", typeToClass(options.type))} style={{ ...alertStyle, ...style }}>
  //     <button className="close" data-dismiss="alert" type="button" onClick={close}>
  //       <span aria-hidden="true">×</span>
  //       <span className="sr-only">{translate("Close")}</span>
  //     </button>
  //     {message}
  //   </div>
  // )
}

import { useThemeHooks } from '@redocly/theme/core/hooks';
import { ReactElement, useState } from 'react';
import JsonView from 'react18-json-view'

interface RPCResponseGroupProps {
  response: any
  anchor: ReactElement
  customExpanded?: number,
  customExpandedText?: string
}

export const RPCResponseGroup = ({ response, anchor, customExpanded, customExpandedText }: RPCResponseGroupProps) => {
  const [expanded, setExpanded] = useState<number | false>(1)

  return <div className="group group-tx">
    <h3>{anchor}</h3>
    <RPCResponseGroupExpanders customExpanded={customExpanded} customExpandedText={customExpandedText} setExpanded={setExpanded} />
    <JsonView
      src={response}
      collapsed={expanded}
      collapseStringsAfterLength={100}
      enableClipboard={false}
    />
    <RPCResponseGroupExpanders customExpanded={customExpanded} customExpandedText={customExpandedText} setExpanded={setExpanded} />
  </div>
}

const RPCResponseGroupExpanders = ({ customExpanded, customExpandedText, setExpanded }) => {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return <ul className="nav nav-pills">
    {customExpanded && customExpandedText && (
      <li className="nav-item">
        <a className="nav-link" onClick={() => setExpanded(customExpanded)}>
          {customExpandedText}
        </a>
      </li>
    )}
    <li className="nav-item">
      <a className="nav-link" onClick={() => setExpanded(false)}>{translate("expand all")}</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" onClick={() => setExpanded(1)}>
        {translate("collapse all")}
      </a>
    </li>
  </ul>
}

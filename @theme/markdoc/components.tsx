import * as React from 'react'
import { useLocation } from 'react-router-dom'
// @ts-ignore
import dynamicReact from '@markdoc/markdoc/dist/react'
import { Link } from '@redocly/theme/components/Link/Link'
import { useThemeHooks } from '@redocly/theme/core/hooks'
import { idify } from '../helpers'
import { Button } from '@redocly/theme/components/Button/Button'

export { default as XRPLoader } from '../components/XRPLoader'
export { XRPLCard, CardGrid } from '../components/XRPLCard'
export { AmendmentsTable, AmendmentDisclaimer, Badge } from '../components/Amendments'

export function IndexPageItems() {
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

export function InteractiveBlock(props: {
  children: React.ReactNode
  label: string
  steps: string[]
}) {
  const stepId = idify(props.label)
  const { pathname } = useLocation()

  return (
    // add key={pathname} to ensure old step state gets rerendered on page navigation
    <div className="interactive-block" id={'interactive-' + stepId}  key={pathname}>
      <div className="interactive-block-inner">
        <div className="breadcrumbs-wrap">
          <ul
            className="breadcrumb tutorial-step-crumbs"
            id={'bc-ul-' + stepId}
            data-steplabel={props.label}
            data-stepid={stepId}
          >
            {props.steps?.map((step, idx) => {
              const iterStepId = idify(step).toLowerCase()
              let className = `breadcrumb-item bc-${iterStepId}`
              if (idx > 0) className += ' disabled'
              if (iterStepId === stepId) className += ' current'
              return (
                <li className={className} key={iterStepId}>
                  <a href={`#interactive-${iterStepId}`}>{step}</a>
                </li>
                )
            })}
          </ul>
        </div>
        <div className="interactive-block-ui">{dynamicReact(props.children, React, {})}</div>
      </div>
    </div>
  )
}

export function RepoLink(props: {
  children: React.ReactNode
  path: string
  github_fork: string
  github_branch: string
}) {
  const treeblob = props.path.indexOf(".") >= 0 ? "blob/" : "tree/"
  const sep = props.github_fork[-1] == "/" ? "" : "/"
  const href = props.github_fork+sep+treeblob+props.github_branch+"/"+props.path

  return (
    <Link to={href}>{dynamicReact(props.children, React, {})}</Link>
  )
}

export function CodePageName(props: {
  name: string
}) {
    return (
        <code>{props.name}</code>
    )
}

type TryItServer = 's1' | 's2' | 'xrplcluster' | 'testnet' | 'devnet' | 'testnet-clio' | 'devnet-clio'

export function TryIt(props: {
  method: string,
  server?: TryItServer
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  let use_server = ""
  if (props.server == "s1") {
    use_server = "?server=wss%3A%2F%2Fs1.ripple.com%2F"
  } else if (props.server == "s2") {
    use_server = "?server=wss%3A%2F%2Fs2.ripple.com%2F"
  } else if (props.server == "xrplcluster") {
    use_server = "?server=wss%3A%2F%2Fxrplcluster.com%2F"
  } else if (props.server == 'devnet') {
    use_server = "?server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'testnet') {
    use_server = "?server=wss%3A%2F%2Fs.altnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'testnet-clio') {
    use_server = "?server=wss%3A%2F%2Fclio.altnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'devnet-clio') {
    use_server = "?server=wss%3A%2F%2Fclio.devnet.rippletest.net%3A51233%2F"
  }
  const to_path = `/resources/dev-tools/websocket-api-tool${use_server}#${props.method}`
  return (
    <Link style={{marginBottom: "1rem", textDecoration: "none"}} className="btn btn-primary btn-arrow" to={to_path} target="_blank" role="button">{translate("component.tryit", "Try it!")}</Link>
  )
}

export function TxExample(props: {
  txid: string,
  server?: TryItServer
}) {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  let use_server = ""
  if (props.server == "s1") {
    use_server = "&server=wss%3A%2F%2Fs1.ripple.com%2F"
  } else if (props.server == "s2") {
    use_server = "&server=wss%3A%2F%2Fs2.ripple.com%2F"
  } else if (props.server == "xrplcluster") {
    use_server = "&server=wss%3A%2F%2Fxrplcluster.com%2F"
  } else if (props.server == 'devnet') {
    use_server = "&server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F"
  } else if (props.server == 'testnet') {
    use_server = "&server=wss%3A%2F%2Fs.altnet.rippletest.net%3A51233%2F"
  }
  
  const ws_req = `req=%7B%22id%22%3A%22example_tx_lookup%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22${props.txid}%22%2C%22binary%22%3Afalse%2C%22api_version%22%3A2%7D`
  const to_path = `/resources/dev-tools/websocket-api-tool?${ws_req}${use_server}`
  return (
    <Link style={{marginBottom: "1rem", textDecoration: "none"}} className="btn btn-primary btn-arrow" to={to_path} target="_blank" role="button">{translate("component.queryexampletx", "Query example transaction")}</Link>
  )
}

export function NotEnabled() {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  return (
    <span className="status not_enabled" title={translate("This feature is not currently enabled on the production XRP Ledger.")}><i className="fa fa-flask"></i></span>
  )
}

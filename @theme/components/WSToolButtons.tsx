import { useThemeHooks } from '@redocly/theme/core/hooks'
import Button from 'shared/components/Button'
import { XrplArrowInternalLinkIcon } from 'shared/components/Icons'

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
      <Button
        intention="neutral"
        emphasis="standard"
        href={to_path}
        target="_blank"
        iconEnd={<XrplArrowInternalLinkIcon />}
        className={"mb-3"}
      >
        {translate("component.tryit", "Try it!")}
      </Button>
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
      <Button
        intention="neutral"
        emphasis="standard"
        href={to_path}
        target="_blank"
        iconEnd={<XrplArrowInternalLinkIcon />}
        className={"mb-3"}
      >
        {translate("component.queryexampletx", "Query example transaction")}
      </Button>
  )
}

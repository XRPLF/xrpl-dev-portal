import { useThemeHooks } from "@redocly/theme/core/hooks"
import { useId } from "react"
import { Link } from "shared/components/Link"
import CopyableUrl from "../../CopyableUrl"
import { NETWORK_PANEL, NETWORKS } from "../model"

/** Public server URLs for Mainnet and Testnet, with links to the full list and the faucets */
export function NetworkPanel() {
  const { useTranslate } = useThemeHooks()
  const { translate } = useTranslate()
  const headingId = useId()
  return (
    <aside className="tutorials-network" aria-labelledby={headingId}>
      <h2 id={headingId} className="tutorials-network__label label-r">{translate(NETWORK_PANEL.title)}</h2>
      <dl className="tutorials-network__list">
        {NETWORKS.map((network) => (
          <div className="tutorials-network__group" key={network.id}>
            <dt className="tutorials-network__net label-r">{translate(network.name)}</dt>
            <dd className="tutorials-network__urls">
              <span className="tutorials-network__proto">{translate("WebSocket")}</span>
              <CopyableUrl url={network.ws} translate={translate} />
              <span className="tutorials-network__proto">{translate("JSON-RPC")}</span>
              <CopyableUrl url={network.rpc} translate={translate} />
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <Link href={NETWORK_PANEL.allServers.href} intention="neutral" variation="standalone" size="sm" iconEnd>
          {translate(NETWORK_PANEL.allServers.label)}
        </Link>
      </div>
      <div className="tutorials-network__faucet">
        <Link href={NETWORK_PANEL.faucet.href} intention="brand" variation="standalone" iconEnd>
          {translate(NETWORK_PANEL.faucet.label)}
        </Link>
      </div>
    </aside>
  )
}

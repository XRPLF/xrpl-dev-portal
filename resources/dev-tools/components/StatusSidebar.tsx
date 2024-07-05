import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { clsx } from 'clsx'

import { type Wallet } from 'xrpl'

export function StatusSidebar({
    balance,
    sendingWallet, 
    connectionReady, 
    txHistory
}:
{
    balance: number,
    sendingWallet: Wallet | undefined,
    connectionReady: boolean,
    txHistory: React.JSX.Element[],
}) {
    const { useTranslate } = useThemeHooks();
    const { translate } = useTranslate();

    return (<aside className="right-sidebar col-lg-6 order-lg-4">
        <div id="connection-status" className="card">
            <div className="card-header">
                <h4>{translate("Status")}</h4>
            </div>
            <div className="card-body">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item" id="connection-status-label">{translate("XRP Testnet:")}</li>
                    <li className={clsx("list-group-item", (connectionReady ? 'active' : 'disabled'))} id="connection-status-item">{connectionReady ? translate("Connected") : translate("Not Connected")}</li>
                    <li className="list-group-item" id="sending-address-label">{translate("Sending Address:")}</li>
                    <li className="list-group-item disabled sending-address-item">{sendingWallet ? sendingWallet.address : translate("(None)")}</li>
                    <li className="list-group-item" id="balance-label">{translate("Testnet XRP Available:")}</li>
                    <li className="list-group-item disabled" id="balance-item">{balance ? translate(balance.toString()) : translate("(None)")}</li>
                </ul>
                <div id="tx-sender-history">
                    <h5 className="m-3">{translate("Transaction History")}</h5>
                    <ul className="list-group list-group-flush">
                        {txHistory}
                    </ul>
                </div>
            </div>
        </div>
    </aside>)
}

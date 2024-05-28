import * as React from 'react';
import { useState } from 'react'
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { clsx } from 'clsx'

import { type Transaction, type Wallet } from 'xrpl'

import { SubmitConstData, submitAndUpdateUI, canSendTransaction } from '../utils';


export interface TransactionButtonProps {
    submitConstData: SubmitConstData,
    connectionReady: boolean,
    transaction: Transaction,
    sendingWallet: Wallet | undefined
    id: string, // Used to set all ids within component
    content: {
        buttonText: string,
        units: string, // Displays after the input number
        longerDescription: React.JSX.Element // JSX allows for embedding links within the longer description
        buttonTitle?: string // Only used while loading bar is activated
    },
    inputSettings?: {
        defaultValue: number, // Should NOT be a dynamic number
        setInputValue: React.Dispatch<React.SetStateAction<number>>, 
        min: number,
        max: number,
    },
    loadingBar?: {
        id: string,
        widthPercent: number,
        description: string,
        defaultOn: boolean,
    },
    checkBox?: {
        setCheckValue: React.Dispatch<React.SetStateAction<boolean>>,
        defaultValue: boolean,
        description: string,
    }
    customOnClick?: Function
}

function shouldDisableButton(
    connectionReady: boolean,
    sendingWallet: Wallet | undefined,
    waitingForTransaction: boolean,
    loadingBar?: {
        widthPercent: number
    }
): boolean {
    return !canSendTransaction(connectionReady, sendingWallet?.address) 
    || waitingForTransaction 
    || (!!(loadingBar?.widthPercent) && loadingBar.widthPercent < 100)
}

export function TransactionButton({
    id,
    submitConstData,
    connectionReady,
    transaction,
    sendingWallet,
    content,
    inputSettings,
    loadingBar,
    checkBox,
    customOnClick
}: TransactionButtonProps ) {
    const { useTranslate } = useThemeHooks()
    const { translate } = useTranslate()

    const [waitingForTransaction, setWaitingForTransaction] = useState(false)

    return (
    <div>
        <div className="form-group" id={id}>

            {/* Optional loading bar - Used for Partial Payments setup and EscrowFinish wait time */}
            {loadingBar?.id && <div className="progress mb-1" id={loadingBar?.id ?? ""}>
                <div className={
                    clsx("progress-bar progress-bar-striped w-0", 
                        (loadingBar?.widthPercent < 100 && loadingBar?.widthPercent > 0) && "progress-bar-animated")}
                    style={{width: (Math.min(loadingBar?.widthPercent + (loadingBar?.defaultOn ? 1 : 0), 100)).toString() + "%",
                    display: (loadingBar?.widthPercent >= 100) ? 'none' : ''}}>
                        &nbsp;
                </div>
                {(loadingBar?.widthPercent < 100 && loadingBar?.widthPercent > 0 || (loadingBar.defaultOn && loadingBar?.widthPercent === 0)) 
                    && <small className="justify-content-center d-flex position-absolute w-100">
                        {translate(loadingBar?.description)}
                    </small>}
            </div>}

            <div className="input-group mb-3">
                
                {/* Loading icon for when transaction is being submitted */}
                <div className="input-group-prepend">
                    <span className="input-group-text loader" style={{display: waitingForTransaction ? '' : 'none'}}>
                        <img className="throbber" src="/img/xrp-loader-96.png" alt={translate("(loading)")} />
                    </span>
                </div>

                <button className={clsx("btn btn-primary form-control needs-connection", 
                    (shouldDisableButton(connectionReady, sendingWallet, waitingForTransaction, loadingBar) && "disabled"))} 
                    type="button" id={id + "_btn"} 
                    disabled={shouldDisableButton(connectionReady, sendingWallet, waitingForTransaction, loadingBar)}
                    onClick={async () => {
                        setWaitingForTransaction(true)
                        customOnClick ? await customOnClick() : await submitAndUpdateUI(submitConstData, sendingWallet!, transaction)
                        setWaitingForTransaction(false)
                    }}
                    title={(loadingBar && (loadingBar.widthPercent > 0 && loadingBar.widthPercent < 100)) ? translate(content.buttonTitle) : ""}
                >
                    {translate(content.buttonText)}
                </button>

                {inputSettings &&
                    <input id={id + "_amount"} className="form-control" type="number" 
                        aria-describedby={id + "amount_help"} 
                        defaultValue={inputSettings?.defaultValue} 
                        min={inputSettings?.min} 
                        max={inputSettings?.max}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            // Enforce min / max values
                            let { value, min, max } = event.target;
                            const newValue = Math.max(Number(min), Math.min(Number(max), Number(value)));
                            // Share the value so other logic can update based on it
                            inputSettings?.setInputValue(newValue)
                        }
                    } />}

                {inputSettings && <div className="input-group-append">
                        <span className="input-group-text" id={id + "_help"}>
                            {translate(content.units)}
                        </span>
                    </div>
                }
                
                {/* Used for Escrow */}
                {checkBox && <span className="input-group-text">
                    (
                    <input type="checkbox" 
                        id={id + "_checkbox"} 
                        defaultValue={checkBox.defaultValue ? 1 : 0}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => checkBox.setCheckValue(event.target.checked)} />
                    <label className="form-check-label" htmlFor={id + "_checkbox"}>
                        {translate(checkBox.description)}
                    </label>)
                </span>}
            </div>

            <small className="form-text text-muted">
                {content.longerDescription}
            </small>

        </div>
        <hr />
    </div>)
}

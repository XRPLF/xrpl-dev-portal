import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { useState } from 'react'
import { clsx } from 'clsx'
import { TxResponse, type Client, type Transaction, type TransactionMetadata, type Wallet } from 'xrpl'

import AlertTemplate from './alert-template';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { useAlert } from 'react-alert'


// TODO:
// - Change all links that previously went to tx-sender.html to dev-tools/tx-sender
//   - Top nav, homepage, ctrl + shift + F for tx-sender in a link
// - Add this to the sidebar
// - Figure out how this code is dynamic (the js files) and then translate that over in a React-like way
//   - Specifically, look at `tx-sender.js`
// - Add the proper top-level divs to match what's live (Currently has an empty classname Div as the main wrapper)
// - Componentize the repeated sections

// Refactoring:
// - Standardize the use of `client` instead of `api`
// - Most of these "ids" aren't necessary for our css - we can do better (and simplify parameters as a result!

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

// All unchanging information needed to submit & log data
interface SubmitConstData {
    api: Client, 
    setBalance: React.Dispatch<React.SetStateAction<number>>, 
    setTxHistory: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>,
    alert,
}

// Helpers
function isoTimeToRippleTime(isoSeconds: number) {
    const RIPPLE_EPOCH_DIFF = 0x386d4380
    return Math.round(isoSeconds / 1000) - RIPPLE_EPOCH_DIFF
}

function errorNotif(alert, msg: string) {
    console.log(msg)
    alert.error(msg)
}

function successNotif(alert, msg) {
    console.log(msg)
    alert.show(msg, { type: 'success' })
}

// TODO: I appear to have broken this with my latest refactor, not sure how. (Probably with submit_and_notify syntax)
// It gets to the 1% trigger (animation starts after init button) - but it does not actually progress to 20%
async function setUpForPartialPayments
    (
    api: Client,
    sendingWallet: Wallet,
    setPpIssuerWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>, 
    setPpWidthPercent: React.Dispatch<React.SetStateAction<number>>,
    ppCurrencyCode: string, 
    ) {
    console.debug("Starting partial payment setup...")
 
    // Causing loader to appear because no longer 0%
    setPpWidthPercent(1)
    let ppIssuerWallet;

    // 1. Get a funded address to use as issuer
    try {
        ppIssuerWallet = (await api.fundWallet()).wallet
        setPpIssuerWallet(ppIssuerWallet)
    } catch(error) {
        console.log("Error getting issuer address for partial payments:", error)
        return
    }

    setPpWidthPercent(20)
    
    // 2. Set Default Ripple on issuer
    let resp: TxResponse = await api.submitAndWait({
        TransactionType: "AccountSet",
        Account: ppIssuerWallet.address,
        SetFlag: 8 // asfDefaultRipple
    }, { wallet: ppIssuerWallet })
    if (resp === undefined) {
        console.log("Couldn't set Default Ripple for partial payment issuer")
        return
    }
    setPpWidthPercent(40)
    
    // 3. Make a trust line from sending address to issuer
    resp = await api.submitAndWait({
        TransactionType: "TrustSet",
        Account: sendingWallet.address,
        LimitAmount: {
            currency: ppCurrencyCode,
            value: "1000000000", // arbitrarily, 1 billion fake currency
            issuer: ppIssuerWallet.address
        }
    }, { wallet: sendingWallet })
    if (resp === undefined) {
        console.log("Error making trust line to partial payment issuer")
        return
    }
    setPpWidthPercent(60)
    
        // 4. Issue fake currency to main sending address
    resp = await api.submitAndWait({
        TransactionType: "Payment",
        Account: ppIssuerWallet.address,
        Destination: sendingWallet.address,
        Amount: {
            currency: ppCurrencyCode,
            value: "1000000000",
            issuer: ppIssuerWallet.address
        }
    }, { wallet: ppIssuerWallet })
    if (resp === undefined) {
        console.log("Error sending fake currency from partial payment issuer")
        return
    }
    setPpWidthPercent(80)
    
    // 5. Place offer to buy issued currency for XRP
    // When sending the partial payment, the sender consumes their own offer (!)
    // so they end up paying themselves issued currency then delivering XRP.
    resp = await api.submitAndWait({
        TransactionType: "OfferCreate",
        Account: sendingWallet.address,
        TakerGets: "1000000000000000", // 1 billion XRP
        TakerPays: {
            currency: ppCurrencyCode,
            value: "1000000000",
            issuer: ppIssuerWallet.address
        }
    }, { wallet: sendingWallet })
    if (resp === undefined) {
        console.log("Error placing order to enable partial payments")
        return
    }
    setPpWidthPercent(100)

    // Done. Enable "Send Partial Payment" button
    console.log("Done getting ready to send partial payments.")
}

async function onClickCreateEscrow(
    submitConstData: SubmitConstData,
    sendingWallet: Wallet, 
    destinationAddress: string, 
    duration_seconds: number, 
    setEscrowWidthPercent: React.Dispatch<React.SetStateAction<number>>, 
    release_auto: boolean) {
    if (Number.isNaN(duration_seconds) || duration_seconds < 1) {
        errorNotif(submitConstData.alert, "Error: Escrow duration must be a positive number of seconds")
        return
    }

    const finish_after = isoTimeToRippleTime(new Date().getTime()) + duration_seconds

    const escrowcreate_tx_data = await submit_and_notify(submitConstData, sendingWallet, {
        TransactionType: "EscrowCreate",
        Account: sendingWallet.address,
        Destination: destinationAddress,
        Amount: "1000000",
        FinishAfter: finish_after
      })

    if (escrowcreate_tx_data && release_auto) {
        // Wait until there's a ledger with a close time > FinishAfter
        // to submit the EscrowFinish
        setEscrowWidthPercent(1)

        const { api } = submitConstData

        let latest_close_time = -1
        while (latest_close_time <= finish_after) {
            const seconds_left = (finish_after - isoTimeToRippleTime(new Date().getTime()))

            setEscrowWidthPercent(Math.min(99, Math.max(0, (1-(seconds_left / duration_seconds)) * 100)))

            if (seconds_left <= 0) {
                // System time has advanced past FinishAfter. But is there a new
                //  enough validated ledger?
                latest_close_time = (await api.request({
                    command: "ledger",
                    "ledger_index": "validated"}
                )).result.ledger.close_time
            }
            // Update the progress bar & check again in 1 second.
            await timeout(1000)
        }
        setEscrowWidthPercent(0)
  
        // Now submit the EscrowFinish
        // Future feature: submit from a different sender, just to prove that
        // escrows can be finished by a third party
        await submit_and_notify(submitConstData, sendingWallet, {
          Account: sendingWallet.address,
          TransactionType: "EscrowFinish",
          Owner: sendingWallet.address,
          OfferSequence: escrowcreate_tx_data.result.Sequence
        })
      }

      // Reset in case they click the button again
      setEscrowWidthPercent(0) 
}

function logTx(tx, hash, finalResult, setTxHistory: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>) {
    let classes
    let icon
    const txLink = "https://testnet.xrpl.org/transactions/" + hash
    if (finalResult === "tesSUCCESS") {
      classes = "text-muted"
      icon = <i className="fa fa-check-circle"></i>
    } else {
      classes = "list-group-item-danger"
      icon = <i className="fa fa-times-circle"></i>
    }
    const li = <li key={hash} className={clsx("list-group-item fade-in p-1", classes)}>{icon} {tx}: <a href={txLink} target="_blank" className="external-link">{hash}</a></li>

    setTxHistory((prevState) => [li].concat(prevState))
}

function timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function TransactionButton({
    submitConstData,
    connectionReady,
    transaction,
    sendingWallet,
    ids,
    content,
    inputSettings,
    loadingBar,
    checkBox,
    customOnClick
}: {
    submitConstData: SubmitConstData,
    connectionReady: boolean,
    transaction: Transaction,
    sendingWallet: Wallet | undefined
    ids: {
        formId: string, // Helper text for this form has an id which appends _help to this.
        buttonId: string,
        inputId: string,
    },
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
}) {
    const { translate } = useTranslate()

    const [waitingForTransaction, setWaitingForTransaction] = useState(false)

    return (
    <div>
        <div className="form-group" id={ids.formId}>
            {/* Optional loading bar - Used for partial payments as an example - TODO: Maybe split into own component? */}
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
                <div className="input-group-prepend">
                    <span className="input-group-text loader" style={{display: waitingForTransaction ? '' : 'none'}}>
                        <img className="throbber" src="/img/xrp-loader-96.png" alt={translate("(loading)")} />
                    </span>
                </div>
                <button className={clsx("btn btn-primary form-control needs-connection", 
                    ((!canSendTransaction(connectionReady, sendingWallet?.address) 
                        || waitingForTransaction 
                        || (loadingBar?.widthPercent && loadingBar.widthPercent < 100)) && "disabled"))} 
                    type="button" id={ids.buttonId} 
                    disabled={(!canSendTransaction(connectionReady, sendingWallet?.address) 
                        || waitingForTransaction
                        || (loadingBar?.widthPercent && loadingBar.widthPercent < 100))}
                    onClick={async () => {
                        setWaitingForTransaction(true)
                        customOnClick ? await customOnClick() : await submit_and_notify(submitConstData, sendingWallet!, transaction)
                        setWaitingForTransaction(false)
                    }}
                    title={(loadingBar && (loadingBar.widthPercent > 0 && loadingBar.widthPercent < 100)) ? translate(content.buttonTitle) : ""}
                >
                    {translate(content.buttonText)}
                </button>
                {/* If there are no input settings, we don't need the form, or the units */}
                {inputSettings &&
                    <input id={ids.inputId} className="form-control" type="number" 
                        aria-describedby={ids.inputId + "_help"} 
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
                        <span className="input-group-text" id={ids.formId + "_help"}>
                            {translate(content.units)}
                        </span>
                    </div>
                }
                {checkBox && <span className="input-group-text">
                    (
                    <input type="checkbox" 
                        id={ids.formId + "_checkbox"} 
                        defaultValue={checkBox.defaultValue ? 1 : 0}
                        onChange={(event) => checkBox.setCheckValue(event.target.checked)} />
                    <label className="form-check-label" htmlFor={ids.formId + "_checkbox"}>
                        {translate(checkBox.description)}
                    </label>)
                </span>}
                {/* Future feature: Optional custom destination tag */}
            </div>
            <small className="form-text text-muted">
                {content.longerDescription}
            </small>
        </div>
        <hr />
    </div>)
}

// TODO: Make sure all calls to this function specify the wallet used!
async function submit_and_notify(
    submitConstData: SubmitConstData,
    sendingWallet: Wallet,
    tx_object: Transaction,
    silent: boolean = false) {

    const { api, setBalance, setTxHistory } = submitConstData

    let prepared;
    try {
      // Auto-fill fields like Fee and Sequence
      prepared = await api.autofill(tx_object)
      console.debug("Prepared:", prepared)
    } catch(error) {
      console.log(error)
      if (!silent) {
        errorNotif(alert, "Error preparing tx: "+error)
      }
      return
    }

    try {
      const {tx_blob, hash} = sendingWallet.sign(prepared)
      const final_result_data = await api.submitAndWait(tx_blob)
      console.log("final_result_data is", final_result_data)
      let final_result = (final_result_data.result.meta as TransactionMetadata).TransactionResult
      if (!silent) {
        if (final_result === "tesSUCCESS") {
          successNotif(submitConstData.alert, `${tx_object.TransactionType} tx succeeded (hash: ${hash})`)
        } else {
          errorNotif(submitConstData.alert, `${tx_object.TransactionType} tx failed with code ${final_result}
                      (hash: ${hash})`)
        }
        logTx(tx_object.TransactionType, hash, final_result, setTxHistory)
      }

      setBalance(parseFloat(await api.getXrpBalance(sendingWallet.address)))
      return final_result_data
    } catch (error) {
      console.log(error)
      if (!silent) {
        errorNotif(submitConstData.alert, `Error signing & submitting ${tx_object.TransactionType} tx: ${error}`)
      }

      setBalance(parseFloat(await api.getXrpBalance(sendingWallet.address)))
      return
    }
  }

function canSendTransaction(connectionReady, sendingAddress) {
    return connectionReady && sendingAddress
}

function StatusSidebar({
    balance,
    sendingWallet, 
    connectionReady, 
    txHistory
}:
{
    balance: number,
    sendingWallet: Wallet,
    connectionReady: boolean,
    txHistory: React.JSX.Element[],
}) {
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

async function onInitClick(
    existingApi: Client, 
    alert,
    setApi: React.Dispatch<React.SetStateAction<Client | undefined>>, 
    setBalance: React.Dispatch<React.SetStateAction<number>>, 
    setSendingWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>, 
    setIsInitEnabled: React.Dispatch<React.SetStateAction<boolean>>, 
    setConnectionReady: React.Dispatch<React.SetStateAction<boolean>>,
    setPpIssuerWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>,
    setPpWidthPercent: React.Dispatch<React.SetStateAction<number>>,
    ppCurrencyCode: string,
    ): Promise<void> {
    
    if(existingApi) {
        console.log("Already initializing!")
        return
    }

    console.log("Connecting to Testnet WebSocket...")
    // @ts-expect-error - xrpl is imported via a script tag. TODO: Replace with real import once xrpl.js 3.0 is released.
    const api = new xrpl.Client(TESTNET_URL)
    api.on('connected', () => {
        setConnectionReady(true)
    })

    api.on('disconnected', (code) => {
        setConnectionReady(false)
    })
    setApi(api)
    await api.connect()

    console.debug("Getting a sending address from the faucet...")
    try {
      const fundResponse = await api.fundWallet()
      const sendingWallet = fundResponse.wallet
      setSendingWallet(sendingWallet)
      // @ts-expect-error - xrpl is imported via a script tag. TODO: Replace with real import once xrpl.js 3.0 is released.
      setBalance(xrpl.dropsToXrp(fundResponse.balance))
      setIsInitEnabled(false)
      await setUpForPartialPayments(
        api, 
        sendingWallet, 
        setPpIssuerWallet, 
        setPpWidthPercent, 
        ppCurrencyCode,  
      )  
    } catch(error) {
      console.error(error)
      errorNotif(alert, "There was an error with the XRP Ledger Testnet Faucet. Reload this page to try again.")
      return
    }
}

function onDestinationAddressChange(event, setDestinationAddress, setIsValidDestinationAddress) {
    const newAddress = event.target.value
    setDestinationAddress(newAddress)
    // @ts-expect-error - xrpl is guaranteed to be defined by the time this field is changed.
    setIsValidDestinationAddress(xrpl.isValidAddress(newAddress))
}

function TxSenderBody() {
    const { translate } = useTranslate();

    const [api, setApi] = useState<Client | undefined>(undefined)

    const alert = useAlert()

    // Sidebar variables
    const [balance, setBalance] = useState(0)
    const [sendingWallet, setSendingWallet] = useState<Wallet | undefined>(undefined)
    const [connectionReady, setConnectionReady] = useState(false)
    const [txHistory, setTxHistory] = useState([])

    // Used when submitting transactions to trace all transactions in the UI
    const submitConstData = {
        api,
        setBalance,
        setTxHistory,
        alert, 
    }

    // TODO: setDestinationAddress when input changes :)
    const defaultDestinationAddress = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    const [destinationAddress, setDestinationAddress] = useState(defaultDestinationAddress)
    const [isValidDestinationAddress, setIsValidDestinationAddress] = useState(true)
    
    const [isInitEnabled, setIsInitEnabled] = useState(true)

    // Partial Payment variables
    const [ppWidthPercent, setPpWidthPercent] = useState(0)
    const [ppIssuerWallet, setPpIssuerWallet] = useState<Wallet | undefined>(undefined)
    const ppCurrencyCode = "BAR"
    

    // Payment button variables
    const defaultDropsToSend = 100000
    const [dropsToSendForPayment, setDropsToSendForPayment] = useState(defaultDropsToSend)

    // Escrow variables
    const defaultFinishAfter = 60
    const [finishAfter, setFinishAfter] = useState(defaultFinishAfter)
    const [finishEscrowAutomatically, setFinishEscrowAutomatically] = useState(false)
    const [escrowWidthPercent, setEscrowWidthPercent] = useState(0)

    // Payment Channel variables
    const defaultPaymentChannelAmount = 100000
    const [paymentChannelAmount, setPaymentChannelAmount] = useState(defaultPaymentChannelAmount)

    // Issued Currency / Trust Line Variables
    const trustCurrencyCode = "FOO"

    const defaultIssueAmount = 100
    const [issueAmount, setIssueAmount] = useState(defaultIssueAmount)

    const defaultTrustLimit = 100000
    const [trustLimit, setTrustLimit] = useState(defaultTrustLimit)
    

    return (
        <div className="row">
            {/* TODO: Once xrpl.js 3.0 is released, replace this with a direct xrpl.js import */}
            <script src="https://unpkg.com/xrpl@2.5.0-beta.0/build/xrpl-latest-min.js" async />
            <StatusSidebar balance={balance} sendingWallet={sendingWallet} connectionReady={connectionReady} txHistory={txHistory}/>
            <main className="main col-md-7 col-lg-6 order-md-3 page-tx-sender" role="main" id="main_content_body">
                <section className="container-fluid pt-3 p-md-3">
                    <h1>{translate("Transaction Sender")}</h1>
                    <div className="content">
                        <p>{translate("This tool sends transactions to the ")}
                            <a href="dev-tools/xrp-faucets">{translate("XRP Testnet")}</a>
                            {translate(" address of your choice so you can test how you monitor and respond to incoming transactions.")}
                        </p>
                        <form>
                            <div className="form-group">
                                <button className={clsx("btn btn-primary form-control", isInitEnabled ? "" : "disabled")} 
                                    type="button" id="init_button" 
                                    onClick={() => {
                                        onInitClick(
                                            api!, 
                                            alert,
                                            setApi, 
                                            setBalance, 
                                            setSendingWallet, 
                                            setIsInitEnabled, 
                                            setConnectionReady,
                                            setPpIssuerWallet,
                                            setPpWidthPercent,
                                            ppCurrencyCode,
                                        )
                                    }}
                                    disabled={!isInitEnabled}
                                    title={isInitEnabled ? "" : "done"}>
                                    {translate("Initialize")}   
                                </button>
                                {!isInitEnabled && (<div>&nbsp;<i className="fa fa-check-circle"></i></div>)}

                                <small className="form-text text-muted">
                                    {translate("Set up the necessary Testnet XRP addresses to send test payments.")}
                                </small>
                            </div>{/*/.form-group*/}
                            <div className="form-group">
                                <label htmlFor="destination_address">
                                    {translate("Destination Address")}
                                </label>
                                <input type="text" className={clsx("form-control", 
                                    // Defaults to not having "is-valid" / "is-invalid" classes
                                    (destinationAddress !== defaultDestinationAddress) && (isValidDestinationAddress ? "is-valid" : "is-invalid"))}
                                    id="destination_address" 
                                    onChange={(event) => onDestinationAddressChange(event, setDestinationAddress, setIsValidDestinationAddress)}
                                    aria-describedby="destination_address_help" defaultValue={destinationAddress} />
                                <small id="destination_address_help" className="form-text text-muted">
                                    {translate("Send transactions to this XRP Testnet address")}
                                </small>
                            </div>
                            <p className={clsx("devportal-callout caution", !(isValidDestinationAddress && destinationAddress[0] === 'X') && "collapse")}
                                id="x-address-warning">
                                <strong>{translate("Caution:")}</strong>
                                {translate(" This X-address is intended for use on Mainnet. Testnet X-addresses have a \"T\" prefix instead.")}
                            </p>
                            <h3>{translate("Send Transaction")}</h3>
                            {/* Send Payment  */}
                            <TransactionButton 
                                submitConstData={submitConstData}
                                connectionReady={connectionReady}
                                sendingWallet={sendingWallet}
                                transaction={
                                {
                                    TransactionType: "Payment",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: dropsToSendForPayment.toString()
                                }}
                                ids={{
                                    formId: "send_xrp_payment",
                                    buttonId: "send_xrp_payment_btn",
                                    inputId: "send_xrp_payment_amount",
                                }}
                                content=
                                {{
                                    buttonText: "Send XRP Payment",
                                    units: "drops of XRP",
                                    longerDescription: (<div>{translate("Send a ")}<a href="send-xrp.html">{translate("simple XRP-to-XRP payment")}</a>{translate(".")}</div>),
                                }}
                                inputSettings={
                                {
                                    defaultValue: defaultDropsToSend,
                                    setInputValue: setDropsToSendForPayment,
                                    min: 1,
                                    max: 10000000000,
                                }}
                            />
                            {/* Partial Payments */}
                            <TransactionButton 
                                submitConstData={submitConstData}
                                connectionReady={connectionReady}
                                sendingWallet={sendingWallet}
                                transaction={
                                {
                                    TransactionType: "Payment",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: "1000000000000000", // 1 billion XRP
                                    SendMax: {
                                        value: (Math.random()*.01).toPrecision(15), // random very small amount
                                        currency: ppCurrencyCode,
                                        issuer: ppIssuerWallet?.address
                                    },
                                    Flags: 0x00020000 // tfPartialPayment
                                }}
                                ids={{
                                    formId: "send_partial_payment",
                                    buttonId: "send_partial_payment_btn",
                                    inputId: "send_partial_payment_amount",
                                }}
                                content=
                                {{
                                    buttonText: "Send Partial Payment",
                                    units: "drops of XRP",
                                    longerDescription: <div>{translate("Deliver a small amount of XRP with a large ")}
                                    <code>{translate("Amount")}</code>{translate(" value, to test your handling of ")}
                                    <a href="partial-payments.html">{translate("partial payments")}</a>{translate(".")}</div>,
                                    buttonTitle: "(Please wait for partial payments setup to finish)",
                                }}
                                loadingBar={{
                                    id: "pp_progress",
                                    widthPercent: ppWidthPercent,
                                    description: "(Getting ready to send partial payments)",
                                    defaultOn: true,
                                }}
                            />
                            {/* Escrow */}
                            <TransactionButton
                                submitConstData={submitConstData}
                                connectionReady={connectionReady}
                                sendingWallet={sendingWallet}
                                transaction={
                                {
                                    TransactionType: "EscrowCreate",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: "1000000",
                                    FinishAfter:  isoTimeToRippleTime(new Date().getTime()) + finishAfter
                                }}
                                ids={{
                                    formId: "create_escrow",
                                    buttonId: "create_escrow_btn",
                                    inputId: "create_escrow_duration_seconds",
                                }}
                                content=
                                {{
                                    buttonText: translate("Create Escrow"),
                                    units: translate("seconds"),
                                    longerDescription: (<div>{translate("Create a ")}<a href="escrow.html">{translate("time-based escrow")}</a>
                                    {translate(" of 1 XRP for the specified number of seconds.")}</div>),
                                }}
                                inputSettings={
                                {
                                    defaultValue: defaultFinishAfter,
                                    setInputValue: setFinishAfter,
                                    min: 5,
                                    max: 10000,
                                }}
                                loadingBar={{
                                    id: "escrow_progress",
                                    widthPercent: escrowWidthPercent,
                                    description: translate("(Waiting to release Escrow when it's ready)"),
                                    defaultOn: false,
                                }}
                                checkBox={{
                                    setCheckValue: setFinishEscrowAutomatically,
                                    defaultValue: finishEscrowAutomatically,
                                    description: translate("Finish automatically"),
                                }}
                                customOnClick={() => onClickCreateEscrow(
                                    submitConstData, 
                                    sendingWallet, 
                                    destinationAddress, 
                                    finishAfter, 
                                    setEscrowWidthPercent, 
                                    finishEscrowAutomatically)}
                            />
                            {/* Payment Channels 
                                
                                - Future feature: figure out channel ID and enable a button that creates
                                valid claims for the given payment channel to help test redeeming 
                            */}
                            <TransactionButton
                                submitConstData={submitConstData}
                                connectionReady={connectionReady}
                                sendingWallet={sendingWallet}
                                transaction={{
                                    TransactionType: "PaymentChannelCreate",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: paymentChannelAmount.toString(),
                                    SettleDelay: 30,
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    PublicKey: sendingWallet?.publicKey
                                }}
                                ids={{
                                    formId: "create_payment_channel",
                                    buttonId: "create_payment_channel_btn",
                                    inputId: "create_payment_channel_amount",
                                }}
                                content={{
                                    buttonText: translate("Create Payment Channel"),
                                    units: translate("drops of XRP"),
                                    longerDescription: (<div>{translate("Create a ")}<a href="payment-channels.html">{translate("payment channel")}</a>
                                    {translate(" and fund it with the specified amount of XRP.")}</div>),
                                }}
                                inputSettings={
                                {
                                    defaultValue: defaultPaymentChannelAmount,
                                    setInputValue: setPaymentChannelAmount,
                                    min: 1,
                                    max: 10000000000,
                                }}
                            />
                            {/* Send Issued Currency */}
                                {/* TODO: Add ability to configure custom currency codes */}
                                <TransactionButton
                                submitConstData={submitConstData}
                                connectionReady={connectionReady}
                                sendingWallet={sendingWallet}
                                transaction={
                                    {
                                    TransactionType: "Payment",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: {
                                        currency: trustCurrencyCode,
                                        value: issueAmount?.toString(),
                                        // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                        issuer: sendingWallet?.address
                                    }
                                }}
                                ids={{
                                    formId: "send_issued_currency",
                                    buttonId: "send_issued_currency_btn",
                                    inputId: "send_issued_currency_amount",
                                }}
                                content={{
                                    buttonText: translate("Send Issued Currency"),
                                    units: translate(trustCurrencyCode),
                                    longerDescription: (<div>{translate("Your destination address needs a ")}
                                    <a href="trust-lines-and-issuing.html">{translate("trust line")}</a>{translate(" to ")}
                                    <span className="sending-address-item">{translate("(the test sender)")}</span>
                                    {translate(" for the currency in question. Otherwise, you'll get tecPATH_DRY.")}</div>),
                                }}
                                inputSettings={
                                {
                                    defaultValue: defaultIssueAmount,
                                    setInputValue: setIssueAmount,
                                    min: 1,
                                    max: 10000000000,
                                }}
                            />
                            {/* Create Trust Line */}
                            <TransactionButton
                                submitConstData={submitConstData}
                                connectionReady={connectionReady}
                                sendingWallet={sendingWallet}
                                transaction={
                                    {
                                    TransactionType: "TrustSet",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    LimitAmount: {
                                        currency: trustCurrencyCode,
                                        value: trustLimit.toString(),
                                        issuer: destinationAddress
                                    }
                                }}
                                ids={{
                                    formId: "trust_for",
                                    buttonId: "trust_for_btn",
                                    inputId: "trust_for_amount",
                                }}
                                content={{
                                    buttonText: translate("Trust for"),
                                    units: translate(trustCurrencyCode),
                                    longerDescription: (<div>{translate("The test sender creates a ")}
                                    <a href="trust-lines-and-issuing.html">{translate("trust line")}</a>
                                    {translate(" to your account for the given currency.")}</div>),
                                }}
                                inputSettings={
                                {
                                    defaultValue: defaultTrustLimit,
                                    setInputValue: setTrustLimit,
                                    min: 1,
                                    max: 10000000000,
                                }}
                            />
                        </form>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default function TxSender() {
    // Wrapper to allow for dynamic alerts when transactions complete

    const alertOptions = {
        position: positions.BOTTOM_RIGHT,
        timeout: 7000,
        offset: '8px',
        transition: transitions.FADE
    }

    return (
        <AlertProvider template={AlertTemplate} {...alertOptions}>
            <TxSenderBody/>
        </AlertProvider>
    )
}
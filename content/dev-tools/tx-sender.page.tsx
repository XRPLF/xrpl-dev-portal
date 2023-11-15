import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { useState } from 'react'
import { clsx } from 'clsx'
import { type Client, type Transaction, type TransactionMetadata, type Wallet } from 'xrpl'

// TODO:
// - Change all links that previously went to tx-sender.html to dev-tools/tx-sender
//   - Top nav, homepage, ctrl + shift + F for tx-sender in a link
// - Add this to the sidebar
// - Figure out how this code is dynamic (the js files) and then translate that over in a React-like way
//   - Specifically, look at `tx-sender.js`
// - Add the proper top-level divs to match what's live (Currently has an empty classname Div as the main wrapper)
// - Componentize the repeated sections

// - Standardize the use of `client` instead of `api`

// Helpers
function isoTimeToRippleTime(isoSeconds: number) {
    const RIPPLE_EPOCH_DIFF = 0x386d4380
    return Math.round(isoSeconds / 1000) - RIPPLE_EPOCH_DIFF
}

function errorNotif(msg) {
    alert(msg) // TODO: Replace this with a modern version of what's at the top of tx-sender.js
}

function successNotif(msg) {
    alert(msg) // TODO: Replace this with a modern version of what's at the top of tx-sender.js
}

function setUpForPartialPayments() {
    console.log("TODO - Implement setUpForPartialPayments! (see tx-sender.js for details)")
}

function logTx(tx, hash, finalResult) {
    console.log("TODO - Implement logTx with the code at the top of tx-sender.js")
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: Migrate this function
// async function on_click_send_partial_payment(event) {
//     const destination_address = $("#destination_address").val()
//     $("#send_partial_payment .loader").show()
//     $("#send_partial_payment button").prop("disabled","disabled")

//     await submit_and_notify({
//       TransactionType: "Payment",
//       Account: sending_wallet.address,
//       Destination: destination_address,
//       Amount: "1000000000000000", // 1 billion XRP
//       SendMax: {
//         value: (Math.random()*.01).toPrecision(15), // random very small amount
//         currency: pp_sending_currency,
//         issuer: pp_issuer_wallet.address
//       },
//       Flags: xrpl.PaymentFlags.tfPartialPayment
//     })
//     $("#send_partial_payment .loader").hide()
//     $("#send_partial_payment button").prop("disabled",false)
//   }
//   $("#send_partial_payment button").click(on_click_send_partial_payment)


function TransactionButton({
    api,
    setBalance,
    connectionReady,
    transaction,
    sendingWallet,
    ids,
    content,
    inputSettings,
}: {
    api: Client,
    setBalance: React.Dispatch<React.SetStateAction<number>>,
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
    },
    inputSettings: {
        defaultValue: number, // Should NOT be a dynamic number
        setInputValue: React.Dispatch<React.SetStateAction<number>>, 
        min: number,
        max: number,
        expectInt: boolean, // Otherwise expects float - ex. For issued currency amounts.
    }
}) {
    const { translate } = useTranslate()

    const [waitingForTransaction, setWaitingForTransaction] = useState(false)

    return (
    <div>
        <div className="form-group" id={ids.formId}>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text loader" style={{display: waitingForTransaction ? '' : 'none'}}>
                        <img className="throbber" src="/img/xrp-loader-96.png" alt={translate("(loading)")} />
                    </span>
                </div>
                <button className={clsx("btn btn-primary form-control needs-connection", 
                    ((!canSendTransaction(connectionReady, sendingWallet?.address) || waitingForTransaction) && "disabled"))} 
                    type="button" id={ids.buttonId} disabled={(!canSendTransaction(connectionReady, sendingWallet?.address) || waitingForTransaction)}
                    onClick={async () => {
                        setWaitingForTransaction(true)
                        await submit_and_notify(api, sendingWallet!, setBalance, transaction)
                        setWaitingForTransaction(false)
                    }}
                    >
                        {translate(content.buttonText)}
                </button>
                <input id={ids.inputId} className="form-control" type="number" 
                    aria-describedby={ids.inputId + "_help"} defaultValue={inputSettings.defaultValue} min={1} max={inputSettings.max}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        inputSettings.setInputValue(inputSettings.expectInt ? parseInt(e.target.value) : parseFloat(e.target.value))
                } />
                <div className="input-group-append">
                    <span className="input-group-text" id={ids.formId + "_help"}>
                        {translate(content.units)}
                    </span>
                </div>
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
async function submit_and_notify(api: Client, sendingWallet: Wallet, setBalance, tx_object: Transaction, silent: boolean = false) {
    let prepared;
    try {
      // Auto-fill fields like Fee and Sequence
      prepared = await api.autofill(tx_object)
      console.debug("Prepared:", prepared)
    } catch(error) {
      console.log(error)
      if (!silent) {
        errorNotif("Error preparing tx: "+error)
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
          successNotif(`${tx_object.TransactionType} tx succeeded (hash: ${hash})`)
        } else {
          errorNotif(`${tx_object.TransactionType} tx failed w/ code ${final_result}
                      (hash: ${hash})`)
        }
        logTx(tx_object.TransactionType, hash, final_result)
      }

      setBalance(await api.getXrpBalance(sendingWallet.address))
      return final_result_data
    } catch (error) {
      console.log(error)
      if (!silent) {
        errorNotif(`Error signing & submitting ${tx_object.TransactionType} tx: ${error}`)
      }

      setBalance(await api.getXrpBalance(sendingWallet.address))
      return
    }
  }

function canSendTransaction(connectionReady, sendingAddress) {
    return connectionReady && sendingAddress
}

function StatusSidebar(
    {balance, sendingWallet, connectionReady, txHistory}) {
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
                    <ul className="list-group list-group-flush"></ul>
                    {/* TODO: This has a lot of detailed formatting */}
                    {txHistory}
                </div>
            </div>
        </div>
    </aside>)
}

async function onInitClick(
    existingApi: Client, 
    setApi: React.Dispatch<React.SetStateAction<Client | undefined>>, 
    setBalance: React.Dispatch<React.SetStateAction<number>>, 
    setSendingWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>, 
    setIsInitEnabled: React.Dispatch<React.SetStateAction<boolean>>, 
    setConnectionReady: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
    
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
      const fund_response = await api.fundWallet()
      setSendingWallet(fund_response.wallet)
      // @ts-expect-error - xrpl is imported via a script tag. TODO: Replace with real import once xrpl.js 3.0 is released.
      setBalance(xrpl.dropsToXrp(fund_response.balance))
    } catch(error) {
      console.error(error)
      errorNotif("There was an error with the XRP Ledger Testnet Faucet. Reload this page to try again.")
      return
    }

    setIsInitEnabled(false)
    setUpForPartialPayments()
}

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

export default function TxSender() {
    const { translate } = useTranslate();

    const [api, setApi] = useState<Client | undefined>(undefined)

    // Sidebar variables
    const [balance, setBalance] = useState(0)
    const [sendingWallet, setSendingWallet] = useState<Wallet | undefined>(undefined)
    const [connectionReady, setConnectionReady] = useState(false)
    const [txHistory, setTxHistory] = useState([])

    // TODO: setDestinationAddress when input changes :)
    const [destinationAddress, setDestinationAddress] = useState("rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe")
    
    const [isInitEnabled, setIsInitEnabled] = useState(true)

    // Payment button variables
    const defaultDropsToSend = 100000
    const [dropsToSendForPayment, setDropsToSendForPayment] = useState(defaultDropsToSend)

    // Escrow variables
    const defaultFinishAfter = 60
    const [finishAfter, setFinishAfter] = useState(defaultFinishAfter)

    // Payment Channel variables
    const defaultPaymentChannelAmount = 100000
    const [paymentChannelAmount, setPaymentChannelAmount] = useState(defaultPaymentChannelAmount)

    
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
                                    onInitClick(api!, setApi, setBalance, setSendingWallet, setIsInitEnabled, setConnectionReady)
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
                            {/* TODO: Assign className `is-valid` if destinationAddress passes xrpl.isValidAddress, and set className
                                is-invalid if it does not. For some reason can't import xrpl at this part of the code. */}
                            <input type="text" className="form-control" id="destination_address" 
                                aria-describedby="destination_address_help" defaultValue={destinationAddress} />
                            <small id="destination_address_help" className="form-text text-muted">
                                {translate("Send transactions to this XRP Testnet address")}
                            </small>
                        </div>
                        <p className="devportal-callout caution collapse" 
                            // TODO: Enable this warning if it's a valid address AND starts with 'X' (xrpl can't be imported here seemingly...)
                            // (!(typeof xrpl !== undefined && xrpl?.isValidAddress(destinationAddress) || destinationAddress[0] === "X")) && "hidden")} 
                            id="x-address-warning">
                            <strong>{translate("Caution:")}</strong>
                            {translate(" This X-address is intended for use on Mainnet. Testnet addresses have a \"T\" prefix instead.")}
                        </p>
                        <h3>{translate("Send Transaction")}</h3>
                        <TransactionButton 
                            api={api!}
                            setBalance={setBalance}
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
                                expectInt: true,
                            }}
                        />
                        <div className="form-group" id="send_partial_payment">
                            <div className="progress mb-1" id="pp_progress">
                                <div className="progress-bar progress-bar-striped w-0">&nbsp;</div>
                                <small className="justify-content-center d-flex position-absolute w-100">
                                    {translate("(Getting ready to send partial payments)")}
                                </small>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text loader" style={{display: 'none'}}>
                                        <img className="throbber" alt="(loading)" src="/img/xrp-loader-96.png" />
                                    </span>
                                </div>
                                <button className="btn btn-primary form-control" 
                                    type="button" id="send_partial_payment_btn" disabled={true} 
                                    title={translate("(Please wait for partial payments setup to finish)")}>
                                        {translate("Send Partial Payment")}
                                </button>
                            </div>
                            <small className="form-text text-muted">
                                {translate("Deliver a small amount of XRP with a large ")}
                                <code>{translate("Amount")}</code>{translate(" value, to test your handling of ")}
                                <a href="partial-payments.html">{translate("partial payments")}</a>{translate(".")}
                            </small>
                        </div>{/* /.form group for partial payment */}
                        <hr />
                        {/* Escrow */}
                        <TransactionButton
                            api={api!}
                            setBalance={setBalance}
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
                                expectInt: true,
                            }}
                            // TODO: Add Checkbox
                            /*
                                <span className="input-group-text">
                                    (
                                    <input type="checkbox" id="create_escrow_release_automatically" defaultValue={1} />
                                    <label className="form-check-label" htmlFor="create_escrow_release_automatically">
                                        {translate("Finish automatically")}
                                    </label>)
                                </span>

                                and down after the "small" - some explainer text which appears during it

                                <div className="progress mb-1" style={{display: 'none'}} id="escrow_progress">
                                    <div className="progress-bar progress-bar-striped w-0">&nbsp;</div>
                                    <small className="justify-content-center d-flex position-absolute w-100">
                                        {translate("(Waiting to release Escrow when it's ready)")}
                                    </small>
                                </div>
                            */
                            // TODO: Add logic to automatically finish the escrow
                            // TODO: Add the loading bar logic
                        />
                        {/* <div className="form-group" id="create_escrow">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text loader" style={{display: 'none'}}>
                                        <img className="throbber" alt={translate("(loading)")} src="/img/xrp-loader-96.png" />
                                    </span>
                                </div>
                                <button className={clsx("btn btn-primary form-control needs-connection", 
                                    (!canSendTransaction(connectionReady, sendingWallet?.address) && "disabled"))}
                                    type="button" id="create_escrow_btn" disabled={!canSendTransaction(connectionReady, sendingWallet?.address)}>
                                        {translate("Create Escrow")}
                                </button>
                                <input className="form-control" type="number" defaultValue={60} min={5} max={10000} id="create_escrow_duration_seconds" />
                                <div className="input-group-append">
                                    <span className="input-group-text">
                                        {translate("seconds")}
                                    </span>
                                </div>
                                <span className="input-group-text">
                                    (
                                    <input type="checkbox" id="create_escrow_release_automatically" defaultValue={1} />
                                    <label className="form-check-label" htmlFor="create_escrow_release_automatically">
                                        {translate("Finish automatically")}
                                    </label>)
                                </span>
                            </div>
                            <small className="form-text text-muted">
                                {translate("Create a ")}<a href="escrow.html">{translate("time-based escrow")}</a>
                                {translate(" of 1 XRP for the specified number of seconds.")}
                            </small>
                            <div className="progress mb-1" style={{display: 'none'}} id="escrow_progress">
                                <div className="progress-bar progress-bar-striped w-0">&nbsp;</div>
                                <small className="justify-content-center d-flex position-absolute w-100">
                                    {translate("(Waiting to release Escrow when it's ready)")}
                                </small>
                            </div>
                        </div>/.form group for create escrow */}
                        {/* Payment Channels */}
                        {/*     
                            // Future feature: figure out channel ID and enable a button that creates
                            //   valid claims for the given payment channel to help test redeeming 
                        */}
                        <TransactionButton
                            api={api!}
                            setBalance={setBalance}
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
                                buttonId: "create_payment_channel_buttons",
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
                                expectInt: true,
                            }}
                        />
                        <div className="form-group" id="send_issued_currency">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text loader" style={{display: 'none'}}>
                                        <img className="throbber" alt="(loading)" src="/img/xrp-loader-96.png" />
                                    </span>
                                </div>
                                <button className={clsx("btn btn-primary form-control needs-connection", (!canSendTransaction(connectionReady, sendingWallet?.address) && "disabled"))} 
                                    type="button" id="send_issued_currency_btn" disabled={!canSendTransaction(connectionReady, sendingWallet?.address)}>
                                    {translate("Send Issued Currency")}
                                </button>
                                <input id="send_issued_currency_amount" className="form-control" type="text" defaultValue={100} />
                                {/* Note: HTML limits "number" inputs to IEEE 764 double precision, which isn't enough for the full range of issued currency amounts */}
                                <div className="input-group-append">
                                    {/* TODO: custom currency codes */}
                                    <span className="input-group-text" id="send_issued_currency_code">FOO</span>
                                </div>
                            </div>
                            <small className="form-text text-muted">
                                {translate("Your destination address needs a ")}
                                <a href="trust-lines-and-issuing.html">{translate("trust line")}</a>{translate(" to ")}
                                <span className="sending-address-item">{translate("(the test sender)")}</span>
                                {translate(" for the currency in question. Otherwise, you'll get tecPATH_DRY.")}
                            </small>
                        </div>{/* /.form group for issued currency payment */}
                        <hr />
                        <div className="form-group" id="trust_for">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text loader" style={{display: 'none'}}>
                                    <img className="throbber" alt="(loading)" src="/img/xrp-loader-96.png" /></span>
                                </div>
                                <button className={clsx("btn btn-primary form-control needs-connection", 
                                    (!canSendTransaction(connectionReady, sendingWallet?.address) && "disabled"))}
                                    type="button" id="trust_for_btn" disabled={!canSendTransaction(connectionReady, sendingWallet?.address)}>
                                        {translate("Trust for")}
                                </button>
                                <input id="trust_for_amount" className="form-control disabled" type="number" defaultValue={100000} />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="trust_for_currency_code">{translate("FOO")}</span>
                                </div>
                            </div>
                            <small className="form-text text-muted">{translate("The test sender creates a ")}
                                <a href="trust-lines-and-issuing.html">{translate("trust line")}</a>
                                {translate(" to your account for the given currency.")}
                            </small>
                        </div>{/* /.form group for create trust line */}
                    </form>
                </div>
            </section>
        </main>
    </div>
    )
}

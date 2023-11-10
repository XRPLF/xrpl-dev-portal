import * as React from 'react';
import { useTranslate } from '@portal/hooks';
import { useState } from 'react'
import { clsx } from 'clsx'

// TODO:
// - Change all links that previously went to tx-sender.html to dev-tools/tx-sender
//   - Top nav, homepage, ctrl + shift + F for tx-sender in a link
// - Add this to the sidebar
// - Figure out how this code is dynamic (the js files) and then translate that over in a React-like way
//   - Specifically, look at `tx-sender.js` and `submit-and-verify2.js` (Note submit-and-verify2 is not loading on the main page currently! 404)
// - Add the proper top-level divs to match what's live (Currently has an empty classname Div as the main wrapper)
// - Componentize the repeated sections

function canSendTransaction(connectionReady, sendingAddress) {
    return connectionReady && sendingAddress
}

function StatusSidebar({balance, sendingWallet, connectionReady, txHistory}) {
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

function errorNotif(msg) {
    alert(msg) // TODO: Replace this with a modern version of what's at the top of tx-sender.js
}

function setUpForPartialPayments() {
    console.log("TODO - Implement setUpForPartialPayments! (see tx-sender.js for details)")
}

async function onInitClick(existingApi, setApi, setBalance, setSendingWallet, setIsInitEnabled, setConnectionReady) {
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

    const [api, setApi] = useState(undefined)

    // Sidebar variables
    const [balance, setBalance] = useState(0)
    const [sendingWallet, setSendingWallet] = useState(undefined)
    const [connectionReady, setConnectionReady] = useState(false)
    const [txHistory, setTxHistory] = useState([])

    const [isInitEnabled, setIsInitEnabled] = useState(true)

    
    return (
    <div className="row">
        {/* TODO: Once xrpl.js 3.0 is released, replace this with a direct xrpl.js import */}
        <script src="https://unpkg.com/xrpl@2.5.0-beta.0/build/xrpl-latest-min.js" async />
        <StatusSidebar balance={balance} sendingWallet={sendingWallet} connectionReady={connectionReady} txHistory={txHistory}/>
        <main className="main col-md-7 col-lg-6 order-md-3" role="main" id="main_content_body">
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
                                onClick={() => onInitClick(api, setApi, setBalance, setSendingWallet, setIsInitEnabled, setConnectionReady)}
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
                            <label htmlFor="destination_address">{translate("Destination Address")}</label>
                            <input type="text" className="form-control" id="destination_address" 
                                aria-describedby="destination_address_help" defaultValue="rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe" />
                            <small id="destination_address_help" className="form-text text-muted">
                                {translate("Send transactions to this XRP Testnet address")}
                            </small>
                        </div>
                        <p className="devportal-callout caution collapse" id="x-address-warning">
                            <strong>{translate("Caution:")}</strong>
                            {translate(" This X-address is intended for use on Mainnet. Testnet addresses have a \"T\" prefix instead.")}
                        </p>
                        <h3>{translate("Send Transaction")}</h3>
                        <div className="form-group" id="send_xrp_payment">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text loader" style={{display: 'none'}}>
                                        <img className="throbber" src="/img/xrp-loader-96.png" alt={translate("(loading)")} />
                                    </span>
                                </div>
                                <button className={clsx("btn btn-primary form-control needs-connection", 
                                    (!canSendTransaction(connectionReady, sendingWallet?.address) && "disabled"))} 
                                    type="button" id="send_xrp_payment_btn" disabled={!canSendTransaction(connectionReady, sendingWallet?.address)}>
                                        {translate("Send XRP Payment")}
                                </button>
                                <input id="send_xrp_payment_amount" className="form-control" type="number" 
                                    aria-describedby="send_xrp_payment_amount_help" defaultValue={100000} min={1} max={10000000000} />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="send_xrp_payment_amount_help">
                                        {translate("drops of XRP")}
                                    </span>
                                </div>
                                {/* Future feature: Optional custom destination tag */}
                            </div>
                            <small className="form-text text-muted">{translate("Send a ")}
                                <a href="send-xrp.html">{translate("simple XRP-to-XRP payment")}</a>{translate(".")}
                            </small>
                        </div>{/* /#send_xrp_payment */}
                        <hr />
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
                        <div className="form-group" id="create_escrow">
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
                        </div>{/* /.form group for create escrow */}
                        <hr />
                        <div className="form-group" id="create_payment_channel">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text loader" style={{display: 'none'}}>
                                        <img className="throbber" alt="(loading)" src="/img/xrp-loader-96.png" />
                                    </span>
                                </div>
                                {/* TODO: Componentize these buttons? (Just change name?) */}
                                <button className={clsx("btn btn-primary form-control needs-connection", 
                                    (!canSendTransaction(connectionReady, sendingWallet?.address) && "disabled"))} 
                                    type="button" id="create_payment_channel_btn" disabled={!canSendTransaction(connectionReady, sendingWallet?.address)}>
                                        {translate("Create Payment Channel")}
                                </button>
                                <input id="create_payment_channel_amount" className="form-control" 
                                    type="number" aria-describedby="create_payment_channel_amount_help" 
                                    defaultValue={100000} min={1} max={10000000000} />
                                <div className="input-group-append">
                                    <span className="input-group-text" id="create_payment_channel_amount_help">
                                        {translate("drops of XRP")}
                                    </span>
                                </div>
                            </div>
                            <small className="form-text text-muted">
                                {translate("Create a ")}<a href="payment-channels.html">{translate("payment channel")}</a>
                                {translate(" and fund it with the specified amount of XRP.")}
                            </small>
                        </div>{/* /.form group for create paychan */}
                        <hr />
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
                                {translate("Your destination address needs a")}
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

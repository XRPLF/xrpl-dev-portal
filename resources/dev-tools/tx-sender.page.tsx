import * as React from 'react';
import { useState } from 'react'
import { useThemeHooks } from '@redocly/theme/core/hooks';

import AlertTemplate from './components/AlertTemplate';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import { useAlert } from 'react-alert'

import { isoTimeToRippleTime, type Client, type Wallet } from 'xrpl'

import { errorNotif, SubmitConstData, timeout, submitAndUpdateUI } from './utils';

import { InitButton } from './components/InitButton';
import { DestinationAddressInput } from './components/DestinationAddressInput';
import { StatusSidebar } from './components/StatusSidebar';
import { TransactionButton } from './components/TransactionButton';

export const frontmatter = {
  seo: {
    title: 'Transaction Sender',
    description: "Send test transactions to the account of your choice to test how your software handles them.",
  }
};

async function onClickCreateEscrow(
    submitConstData: SubmitConstData,
    sendingWallet: Wallet | undefined, 
    destinationAddress: string, 
    durationSeconds: number, 
    setEscrowWidthPercent: React.Dispatch<React.SetStateAction<number>>, 
    alsoSendEscrowFinish: boolean) {
    if (Number.isNaN(durationSeconds) || durationSeconds < 1) {
        errorNotif(submitConstData.alert, "Error: Escrow duration must be a positive number of seconds")
        return
    }

    // This should never happen
    if(sendingWallet === undefined) {
        errorNotif(submitConstData.alert, "Error: No sending wallet specified, so unable to submit EscrowCreate")
        return
    }

    const finishAfter = isoTimeToRippleTime(new Date()) + durationSeconds

    const escrowCreateResponse = await submitAndUpdateUI(submitConstData, sendingWallet, {
        TransactionType: "EscrowCreate",
        Account: sendingWallet.address,
        Destination: destinationAddress,
        Amount: "1000000",
        FinishAfter: finishAfter
      })

    if (escrowCreateResponse && alsoSendEscrowFinish) {
        // Wait until there's a ledger with a close time > FinishAfter
        // to submit the EscrowFinish
        setEscrowWidthPercent(1)

        const { client } = submitConstData

        let latestCloseTime = -1
        while (latestCloseTime <= finishAfter) {
            const secondsLeft = (finishAfter - isoTimeToRippleTime(new Date()))

            setEscrowWidthPercent(Math.min(99, Math.max(0, (1-(secondsLeft / durationSeconds)) * 100)))

            if (secondsLeft <= 0) {
                // System time has advanced past FinishAfter. But is there a new
                //  enough validated ledger?
                latestCloseTime = (await client.request({
                    command: "ledger",
                    "ledger_index": "validated"}
                )).result.ledger.close_time
            }
            // Update the progress bar & check again in 1 second.
            await timeout(1000)
        }
        setEscrowWidthPercent(0)

        if(escrowCreateResponse.result.Sequence === undefined) {
            
            errorNotif(submitConstData.alert, 
                "Error: Unable to get the sequence number from EscrowCreate, so cannot submit an EscrowFinish transaction.")
            
            console.error(`EscrowCreate did not return a sequence number. 
            This may be because we were unable to look up the transaction in a validated ledger. 
            The EscrowCreate response was ${escrowCreateResponse}`)

        } else {
            
            // Now submit the EscrowFinish
            // Future feature: submit from a different sender, just to prove that
            // escrows can be finished by a third party
            await submitAndUpdateUI(submitConstData, sendingWallet, {
                Account: sendingWallet.address,
                TransactionType: "EscrowFinish",
                Owner: sendingWallet.address,
                OfferSequence: escrowCreateResponse.result.Sequence
            })
        }
    }

    // Reset in case they click the button again
    setEscrowWidthPercent(0)
}

function TxSenderBody(): React.JSX.Element {
    const { useTranslate } = useThemeHooks();
    const { translate } = useTranslate();

    const [client, setClient] = useState<Client | undefined>(undefined)

    const alert = useAlert()

    // Sidebar variables
    const [balance, setBalance] = useState(0)
    const [sendingWallet, setSendingWallet] = useState<Wallet | undefined>(undefined)
    const [connectionReady, setConnectionReady] = useState(false)
    const [txHistory, setTxHistory] = useState([])

    // Used when submitting transactions to trace all transactions in the UI
    // We cast here since client may be undefined to begin with, but will never be undefined
    // When actually used since all buttons / transactions are disallowed before the Inititalization
    // function where Client is defined. (This saves us many unnecessary type assertions later on)
    const submitConstData = {
        client,
        setBalance,
        setTxHistory,
        alert, 
    } as SubmitConstData

    // Manage the destinationAddress
    const defaultDestinationAddress = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    const [destinationAddress, setDestinationAddress] = useState(defaultDestinationAddress)
    
    const [isInitEnabled, setIsInitEnabled] = useState(true)

    // Partial Payment variables
    const [ppWidthPercent, setPpWidthPercent] = useState(0)
    const [ppIssuerWallet, setPpIssuerWallet] = useState<Wallet | undefined>(undefined)
    const ppCurrencyCode = "BAR"
    const partialPaymentParams = { 
        setPpIssuerWallet,
        setPpWidthPercent,
        ppCurrencyCode,
    }

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

    const commonTxButtonParams = {
        submitConstData,
        connectionReady,
        sendingWallet
    }
    
    return (
        <div className="row">            
            <StatusSidebar balance={balance} sendingWallet={sendingWallet} connectionReady={connectionReady} txHistory={txHistory}/>
            
            <main className="main col-md-7 col-lg-6 order-md-3 page-tx-sender" role="main" id="main_content_body">
                <section className="container-fluid pt-3 p-md-3">
                    <h1>{translate("Transaction Sender")}</h1>
                    <div className="content">
                        <p>{translate("resources.dev-tool.tx-sender.content.part1", "This tool sends transactions to the ")}
                            <a href="../xrp-faucets">{translate("XRP Testnet")}</a>
                            {translate("resources.dev-tool.tx-sender.content.part2", " address of your choice so you can test how you monitor and respond to incoming transactions.")}
                        </p>
                        <form>
                            <InitButton 
                                isInitEnabled={isInitEnabled}
                                toInit={{
                                    existingClient: client,
                                    alert,
                                    setClient,
                                    setBalance,
                                    setSendingWallet,
                                    setIsInitEnabled,
                                    setConnectionReady,
                                    partialPaymentParams
                            }}/>

                            <DestinationAddressInput 
                                {...{defaultDestinationAddress, 
                                destinationAddress, 
                                setDestinationAddress,
                                }}/>

                            <h3>{translate("Send Transaction")}</h3>
                            
                            {/* Send Payment  */}
                            <TransactionButton 
                                id="send_xrp_payment"
                                {...commonTxButtonParams}
                                transaction={
                                {
                                    TransactionType: "Payment",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: dropsToSendForPayment.toString()
                                }}
                                content=
                                {{
                                    buttonText: "Send XRP Payment",
                                    units: "drops of XRP",
                                    longerDescription: (<div>{translate("resources.dev-tool.tx-sender.send-xrp-desc.part1", "Send a ")}<a href="send-xrp.html">{translate("resources.dev-tool.tx-sender.send-xrp-desc.part2", "simple XRP-to-XRP payment")}</a>{translate("resources.dev-tool.tx-sender.send-xrp-desc.part3", ".")}</div>),
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
                                id="send_partial_payment"
                                {...commonTxButtonParams}
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
                                        // @ts-expect-error - ppIssuerWallet is guaranteed to be defined by the time this button is clicked.
                                        issuer: ppIssuerWallet?.address
                                    },
                                    Flags: 0x00020000 // tfPartialPayment
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
                                id="create_escrow"
                                {...commonTxButtonParams}
                                transaction={
                                {
                                    TransactionType: "EscrowCreate",
                                    // @ts-expect-error - sendingWallet is guaranteed to be defined by the time this button is clicked.
                                    Account: sendingWallet?.address,
                                    Destination: destinationAddress,
                                    Amount: "1000000",
                                    FinishAfter:  isoTimeToRippleTime(new Date()) + finishAfter
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
                                id="create_payment_channel"
                                {...commonTxButtonParams}
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
                            {/* Future feature: Add ability to configure custom currency codes */}
                            <TransactionButton
                                id="send_issued_currency"
                                {...commonTxButtonParams}
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
                                id="trust_for"
                                {...commonTxButtonParams}
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

// Wrapper to allow for dynamic alerts when transactions complete
export default function TxSender(): React.JSX.Element {
    
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

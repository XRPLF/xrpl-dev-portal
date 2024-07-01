import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { clsx } from 'clsx'

import { Client, type Wallet, type TxResponse, dropsToXrp } from 'xrpl'
import { errorNotif, TESTNET_URL } from '../utils'


export interface InitializationProps {
    existingClient: Client | undefined, 
    alert, // From useAlert()
    setClient: React.Dispatch<React.SetStateAction<Client | undefined>>, 
    setBalance: React.Dispatch<React.SetStateAction<number>>, 
    setSendingWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>, 
    setIsInitEnabled: React.Dispatch<React.SetStateAction<boolean>>, 
    setConnectionReady: React.Dispatch<React.SetStateAction<boolean>>,
    partialPaymentParams: {
        setPpIssuerWallet: React.Dispatch<React.SetStateAction<Wallet | undefined>>,
        setPpWidthPercent: React.Dispatch<React.SetStateAction<number>>,
        ppCurrencyCode: string
    }
}

async function setUpForPartialPayments
    (
    client: Client,
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
        ppIssuerWallet = (await client.fundWallet()).wallet
        setPpIssuerWallet(ppIssuerWallet)
    } catch(error) {
        console.log("Error getting issuer address for partial payments:", error)
        return
    }

    setPpWidthPercent(20)
    
    // 2. Set Default Ripple on issuer
    let resp: TxResponse = await client.submitAndWait({
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
    resp = await client.submitAndWait({
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
    resp = await client.submitAndWait({
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
    resp = await client.submitAndWait({
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

async function onInitClick(
    props: InitializationProps
    ): Promise<void> {
    
    const {   
        existingClient,
        alert, // From useAlert()
        setClient, 
        setBalance, 
        setSendingWallet, 
        setIsInitEnabled, 
        setConnectionReady,
        partialPaymentParams
    } = {...props}
        
    if(existingClient) {
        console.log("Already initializing!")
        return
    }

    console.log("Connecting to Testnet WebSocket...")
    const client = new Client(TESTNET_URL)
    client.on('connected', () => {
        setConnectionReady(true)
    })

    client.on('disconnected', (code) => {
        setConnectionReady(false)
    })
    setClient(client)
    await client.connect()

    console.debug("Getting a sending address from the faucet...")
    try {
      const fundResponse = await client.fundWallet()
      const sendingWallet = fundResponse.wallet
      setSendingWallet(sendingWallet)
      // Using Number(...) can result in loss of precision since Number is smaller than the precision of XRP,
      // but this shouldn't affect the learning tool as that much XRP is not given to any test account.
      setBalance(Number(dropsToXrp(fundResponse.balance)))
      setIsInitEnabled(false)
      await setUpForPartialPayments(
        client, 
        sendingWallet, 
        partialPaymentParams.setPpIssuerWallet, 
        partialPaymentParams.setPpWidthPercent, 
        partialPaymentParams.ppCurrencyCode,  
      )  
    } catch(error) {
      console.error(error)
      errorNotif(alert, "There was an error with the XRP Ledger Testnet Faucet. Reload this page to try again.")
      return
    }
}

export function InitButton({
    isInitEnabled,
    toInit
}: {
    isInitEnabled: boolean,
    toInit: InitializationProps
}): React.JSX.Element {
    const { useTranslate } = useThemeHooks();
    const { translate } = useTranslate()

    return (<div className="form-group">
        <button className={clsx("btn btn-primary form-control", isInitEnabled ? "" : "disabled")} 
            type="button" id="init_button" 
            onClick={() => {
                onInitClick(
                    toInit,
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
    </div>)
}

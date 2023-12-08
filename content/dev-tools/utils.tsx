import * as React from 'react'
import { type Client, type Wallet, type Transaction, type TransactionMetadata, type TxResponse, SubmittableTransaction } from 'xrpl'
import { clsx } from 'clsx'


export const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

export function timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Displaying transaction data
export function errorNotif(alert: any, msg: string): void {
    console.log(msg)
    alert.error(msg)
}

export function successNotif(alert: any, msg: string): void {
    console.log(msg)
    alert.show(msg, { type: 'success' })
}

export function logTx(txName: string, hash: string, finalResult: string, setTxHistory: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>) {
    let classes
    let icon
    const txLink = "https://testnet.xrpl.org/transactions/" + hash
    if (finalResult === "tesSUCCESS") {
      classes = "text-muted"
      icon = <i className="fa fa-check-circle"/>
    } else {
      classes = "list-group-item-danger"
      icon = <i className="fa fa-times-circle"/>
    }
    const li = <li key={hash} className={clsx("list-group-item fade-in p-1", classes)}>
      {icon} {txName}: <a href={txLink} target="_blank" className="external-link">{hash}</a>
    </li>

    setTxHistory((prevState) => [li].concat(prevState))
}

// All unchanging information needed to submit & log data
export interface SubmitConstData {
    client: Client, 
    setBalance: React.Dispatch<React.SetStateAction<number>>, 
    setTxHistory: React.Dispatch<React.SetStateAction<React.JSX.Element[]>>,
    alert: any,
}

export async function submitAndUpdateUI(
    submitConstData: SubmitConstData,
    sendingWallet: Wallet,
    tx: SubmittableTransaction,
    silent: boolean = false): Promise<TxResponse<Transaction> | undefined> {

    const { client, setBalance, setTxHistory } = submitConstData

    let prepared;
    try {
      // Auto-fill fields like Fee and Sequence
      prepared = await client.autofill(tx)
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
      const result = await client.submitAndWait(tx_blob)
      console.log("The result of submitAndWait is ", result)
      let finalResult = (result.result.meta as TransactionMetadata).TransactionResult
      if (!silent) {
        if (finalResult === "tesSUCCESS") {
          successNotif(submitConstData.alert, `${tx.TransactionType} tx succeeded (hash: ${hash})`)
        } else {
          errorNotif(submitConstData.alert, `${tx.TransactionType} tx failed with code ${finalResult}
                      (hash: ${hash})`)
        }
        logTx(tx.TransactionType, hash, finalResult, setTxHistory)
      }

      setBalance(await client.getXrpBalance(sendingWallet.address))
      return result
    } catch (error) {
      console.log(error)
      if (!silent) {
        errorNotif(submitConstData.alert, `Error signing & submitting ${tx.TransactionType} tx: ${error}`)
      }

      setBalance(await client.getXrpBalance(sendingWallet.address))
      return
    }
  }

export function canSendTransaction(connectionReady: boolean, sendingAddress: string | undefined): boolean {
    return connectionReady && !!sendingAddress
}

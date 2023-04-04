const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const xrpl = require("xrpl")
const { prepareReserve, prepareAccountData, prepareLedgerData} = require('./library/3_helpers')

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

let reserveBaseXrp = null, reserveIncrementXrp = null

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'view', '3_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '3_account.html'))

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    ipcMain.on('address-entered', async (event, address) =>  {

        let reserve = null

        const client = new xrpl.Client(TESTNET_URL)

        await client.connect()

        await client.request({
            "command": "subscribe",
            "streams": ["ledger"],
            "accounts": [address]
        })

        client.on("ledgerClosed", async (rawLedgerData) => {
            reserve = prepareReserve(rawLedgerData)
            const ledger = prepareLedgerData(rawLedgerData)
            appWindow.webContents.send('update-ledger-data', ledger)
        })

        // Wait for transaction on subscribed account and re-request account data
        client.on("transaction", async (transaction) => {
            const accountInfoRequest = {
                "command": "account_info",
                "account": address,
                "ledger_index": transaction.ledger_index
            }
            const accountInfoResponse = await client.request(accountInfoRequest)
            const accountData = prepareAccountData(accountInfoResponse.result.account_data, reserve)
            appWindow.webContents.send('update-account-data', accountData)
        })

        // Initial Account Request
        const accountInfoResponse = await client.request({
            "command": "account_info",
            "account": address,
            "ledger_index": "current"
        })
        const accountData = prepareAccountData(accountInfoResponse.result.account_data)
        appWindow.webContents.send('update-account-data', accountData)
    })
}

app.whenReady().then(main)
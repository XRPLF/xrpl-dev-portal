const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const xrpl = require("xrpl")
const { prepareAccountData, prepareLedgerData} = require('../library/3_helpers')
const { prepareTxData } = require('../library/4_helpers')

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'view', 'preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', 'template.html'))

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    ipcMain.on('address-entered', async (event, address) => {

        const client = new xrpl.Client(TESTNET_URL)

        await client.connect()

        // Reference: https://xrpl.org/subscribe.html
        await client.request({
            "command": "subscribe",
            "streams": ["ledger"],
            "accounts": [address]
        })

        // Reference: https://xrpl.org/subscribe.html#ledger-stream
        client.on("ledgerClosed", async (rawLedgerData) => {
            const ledger = prepareLedgerData(rawLedgerData)
            appWindow.webContents.send('update-ledger-data', ledger)
        })

        // Wait for transaction on subscribed account and re-request account data
        client.on("transaction", async (transaction) => {
            // Reference: https://xrpl.org/account_info.html
            const accountInfoRequest = {
                "command": "account_info",
                "account": address,
                "ledger_index": transaction.ledger_index
            }

            const accountInfoResponse = await client.request(accountInfoRequest)
            const accountData = prepareAccountData(accountInfoResponse.result.account_data)
            appWindow.webContents.send('update-account-data', accountData)

            const transactions = prepareTxData([{tx: transaction.transaction}])
            appWindow.webContents.send('update-transaction-data', transactions)
        })

        // Initial Account Request -> Get account details on startup
        // Reference: https://xrpl.org/account_info.html
        const accountInfoResponse = await client.request({
            "command": "account_info",
            "account": address,
            "ledger_index": "current"
        })
        const accountData = prepareAccountData(accountInfoResponse.result.account_data)
        appWindow.webContents.send('update-account-data', accountData)

        // Initial Transaction Request -> List account transactions on startup
        // Reference: https://xrpl.org/account_tx.html
        const txResponse = await client.request({
            "command": "account_tx",
            "account": address
        })
        const transactions = prepareTxData(txResponse.result.transactions)
        appWindow.webContents.send('update-transaction-data', transactions)
    })
}

app.whenReady().then(main)

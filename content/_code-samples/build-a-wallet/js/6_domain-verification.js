const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const xrpl = require("xrpl")
const { sendXrp } = require('./library/5_helpers')
const { verify } = require('./library/6_helpers')

const testnetUrl = "wss://s.altnet.rippletest.net:51233"

let reserveBaseXrp = null
let reserveIncrementXrp = null
let client = null
let wallet = null

const fixedAddress = 'rn95xwUymaMyzAKnZUGuynjZ6qk9RzV4Q7'
const fixedSeed = 'sEdSMHvzzWCLSuh2BiTgQihfyARVAKw'

const prepareAccountData = (rawAccountData) => {
    const numOwners = rawAccountData.OwnerCount || 0

    let xrpReserve = null
    if (reserveBaseXrp && reserveIncrementXrp) {
        //TODO: Decimal?
        xrpReserve = reserveBaseXrp + (reserveIncrementXrp * numOwners)
    }

    return {
        classicAddress: rawAccountData.Account,
        xAddress: xrpl.classicAddressToXAddress(rawAccountData.Account, false, true),
        xrpBalance: xrpl.dropsToXrp(rawAccountData.Balance),
        xrpReserve: xrpReserve
    }
}

const prepareLedgerData = (ledger) => {
    reserveBaseXrp = xrpl.dropsToXrp(ledger.reserve_base)
    reserveIncrementXrp = xrpl.dropsToXrp(ledger.reserve_inc)

    return ledger
}

const prepareTxData = (transactions) => {
    return transactions.map(transaction => ({
        confirmed: transaction.tx.date,
        type: transaction.tx.TransactionType,
        from: transaction.tx.Account,
        to: transaction.tx.Destination,
        value: xrpl.dropsToXrp(transaction.tx.Amount),
        hash: transaction.tx.hash
    }))
}

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'view', '6_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '6_domain-verification.html'))

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    wallet = xrpl.Wallet.fromSeed(fixedSeed)

    client = new xrpl.Client(testnetUrl)

    await client.connect()

    await client.request({
        "command": "subscribe",
        "streams": ["ledger"],
        "accounts": [fixedAddress]
    })

    //
    client.on("ledgerClosed", async (ledger) => {
        const ledgerData = prepareLedgerData(ledger)
        appWindow.webContents.send('update-ledger-data', ledgerData)
    })

    // Wait for transaction on subscribed account and re-request account data
    client.on("transaction", async (transaction) => {
        const accountInfoRequest = {
            "command": "account_info",
            "account": fixedAddress,
            "ledger_index": transaction.ledger_index
        }

        const accountInfoResponse = await client.request(accountInfoRequest)
        const accountData = prepareAccountData(accountInfoResponse.result.account_data)
        appWindow.webContents.send('update-account-data', accountData)

        const transactions = prepareTxData([{tx: transaction.transaction}])
        appWindow.webContents.send('update-transaction-data', transactions)
    })

    // This is a temporary hack to dodge a possible race condition
    setTimeout(async function() {
        // Initial Account Request -> get account details
        const accountInfoResponse = await client.request({
            "command": "account_info",
            "account": fixedAddress,
            "ledger_index": "current"
        })
        const accountData = prepareAccountData(accountInfoResponse.result.account_data)
        appWindow.webContents.send('update-account-data', accountData)

        // Initial Transaction Request -> list transactions on startup
        const txResponse = await client.request({
            "command": "account_tx",
            "account": fixedAddress
        })
        const transactions = prepareTxData(txResponse.result.transactions)
        appWindow.webContents.send('update-transaction-data', transactions)
    }, 600)

    ipcMain.on('send-xrp-action', (event, paymentData) => {
        sendXrp(paymentData, client, wallet).then((result) => {
            console.log(result)
            appWindow.webContents.send('send-xrp-transaction-finish', result)
        })
    })

    ipcMain.on('destination-account-change', (event, destinationAccount) => {
        verify(destinationAccount, client).then((result) => {
            appWindow.webContents.send('update-domain-verification-data', result)
        })
    })
}

app.whenReady().then(() => {
    main()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
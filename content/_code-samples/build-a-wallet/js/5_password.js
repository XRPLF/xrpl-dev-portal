const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const xrpl = require("xrpl")

const testnetUrl = "wss://s.altnet.rippletest.net:51233"

let reserveBaseXrp = null, reserveIncrementXrp = null

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

const subscribe = async (client, wallet, appWindow) => {
    await client.request({
        "command": "subscribe",
        "streams": ["ledger"],
        "accounts": [wallet.address]
    })

    client.on("ledgerClosed", async (ledger) => {
        const ledgerData = prepareLedgerData(ledger)
        appWindow.webContents.send('update-ledger-data', ledgerData)
    })

    // Wait for transaction on subscribed account and re-request account data
    client.on("transaction", async (transaction) => {
        const accountInfoRequest = {
            "command": "account_info",
            "account": wallet.address,
            "ledger_index": transaction.ledger_index
        }

        const accountInfoResponse = await client.request(accountInfoRequest)
        const accountData = prepareAccountData(accountInfoResponse.result.account_data)
        appWindow.webContents.send('update-account-data', accountData)

        const transactions = prepareTxData([{tx: transaction.transaction}])
        appWindow.webContents.send('update-transaction-data', transactions)
    })
}

const initialize = async (client, wallet, appWindow) => {
    // Initial Account Request -> get account details
    const accountInfoResponse = await client.request({
        "command": "account_info",
        "account": wallet.address,
        "ledger_index": "current"
    })
    const accountData = prepareAccountData(accountInfoResponse.result.account_data)
    appWindow.webContents.send('update-account-data', accountData)

    // Initial Transaction Request -> list transactions on startup
    const txResponse = await client.request({
        "command": "account_tx",
        "account": wallet.address
    })
    const transactions = prepareTxData(txResponse.result.transactions)
    appWindow.webContents.send('update-transaction-data', transactions)
}

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '5_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '5_password.html'))

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    ipcMain.on('seed-entered', async (event, seed) => {

        const wallet = xrpl.Wallet.fromSeed(seed)

        const client = new xrpl.Client(testnetUrl)

        await client.connect()

        await subscribe(client, wallet, appWindow)

        await initialize(client, wallet, appWindow)

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
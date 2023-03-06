const { app, BrowserWindow } = require('electron')
const path = require('path')
const xrpl = require("xrpl")

const testnetUrl = "wss://s.altnet.rippletest.net:51233"

let reserveBaseXrp = null, reserveIncrementXrp = null

const fixedAddress = 'rn95xwUymaMyzAKnZUGuynjZ6qk9RzV4Q7' // Operational Account Alex

const prepareLedgerData = (ledger) => {
    reserveBaseXrp = xrpl.dropsToXrp(ledger.reserve_base)
    reserveIncrementXrp = xrpl.dropsToXrp(ledger.reserve_inc)

    return ledger
}

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
const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '3_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '3_account.html'))

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    const client = new xrpl.Client(testnetUrl)

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
    })

    // Initial Account Request
    const accountInfoResponse = await client.request({
        "command": "account_info",
        "account": fixedAddress,
        "ledger_index": "current"
    })
    const accountData = prepareAccountData(accountInfoResponse.result.account_data)
    appWindow.webContents.send('update-account-data', accountData)


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
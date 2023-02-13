const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const xrpl = require("xrpl")

let reserveBaseXrp = null
let reserveIncrementXrp = null
let client = null
let wallet = null

/*
    sAdress = r9jEyy3nrB8D7uRc5w2k3tizKQ1q8cpeHU
    sSeed = sEd7wF135qqruYYYyPm6ZLCjNTGSxRr
    oAddress = rn95xwUymaMyzAKnZUGuynjZ6qk9RzV4Q7
    oSeed = sEdSMHvzzWCLSuh2BiTgQihfyARVAKw

 */
const fixedAddress = 'rn95xwUymaMyzAKnZUGuynjZ6qk9RzV4Q7' // Operational Account Alex
const fixedSeed = 'sEd7wF135qqruYYYyPm6ZLCjNTGSxRr' // Operational Account Alex

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
    }));
}

const sendXrp = async (paymentData) => {
    const paymentTx = {
        "TransactionType": "Payment",
        "Account": "r9jEyy3nrB8D7uRc5w2k3tizKQ1q8cpeHU",
        "Amount": xrpl.xrpToDrops(paymentData.amount),
        "Destination": paymentData.address,
        "DestinationTag": paymentData.destinationTag
    }

    const preparedTx = await client.autofill(paymentTx)

    console.log(preparedTx)

    const signedTx = wallet.sign(preparedTx)

    const txResponse = await client.submitAndWait(signedTx.tx_blob)
}

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'view', '5_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '5_send_xrp.html'));

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    wallet = xrpl.Wallet.fromSeed(fixedSeed)

    client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

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

    ipcMain.on('testSendXrp', (event, paymentData) => {
        sendXrp(paymentData);
    })
}

app.whenReady().then(() => {
    main()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
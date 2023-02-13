const async = require('async');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const xrpl = require("xrpl")

const getValidatedLedgerData = async (client) => {
    const ledgerRequest = {
        "command": "ledger",
        "ledger_index": "validated"
    }
    const ledgerResponse = client.request(ledgerRequest)

    return (await ledgerResponse).result
}

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '2_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '2_async.html'));

    return appWindow
}

const main = async () => {
    const appWindow = createWindow()

    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

    await client.connect()

    async.forever(
        function(next) {
            getValidatedLedgerData(client).then((value) => {
                appWindow.webContents.send('update-ledger-data', value)
            })

            setTimeout(function() {
                next();
            }, 2500)
        },
        function(err) {
            // if next is called with a value in its first parameter, it will appear
            // in here as 'err', and execution will stop.
        }
    )
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
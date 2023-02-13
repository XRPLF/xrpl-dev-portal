const { app, BrowserWindow } = require('electron');

const path = require('path');
const xrpl = require("xrpl")

const getValidatedLedgerIndex = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")

    await client.connect()

    const ledgerRequest = {
        "command": "ledger",
        "ledger_index": "validated"
    }

    const ledgerResponse = client.request(ledgerRequest)

    await client.disconnect()

    return (await ledgerResponse).result.ledger_index
}

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '1_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '1_hello.html'));

    getValidatedLedgerIndex().then((value) => {
        appWindow.webContents.send('update-ledger-index', value)
    })

};

app.whenReady().then(() => {
    createWindow();

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
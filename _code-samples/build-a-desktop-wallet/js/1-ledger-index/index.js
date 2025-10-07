const { app, BrowserWindow } = require('electron')

const path = require('path')
// Ledger index code additions - start
const xrpl = require('xrpl')

const TESTNET_URL = 'wss://s.altnet.rippletest.net:51233'

/**
 * Create a WebSocket client, connect to the XRPL, and fetch the latest ledger index.
 *
 * @returns {Promise<number>}
 */
const getValidatedLedgerIndex = async () => {
    const client = new xrpl.Client(TESTNET_URL)
    await client.connect()
    // Reference: https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/ledger-methods/ledger
    const ledgerRequest = {
        "command": "ledger",
        "ledger_index": "validated"
    }
    const ledgerResponse = await client.request(ledgerRequest)
    await client.disconnect()
    return ledgerResponse.result.ledger_index
}
// Ledger index code additions - end

/**
 * Main function: create application window, preload the code to communicate
 * between the renderer Process and the main Process, load a layout,
 * and perform the main logic.
 */
const createWindow = () => {
    // Create the application window
    const appWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'view', 'preload.js'),
        },
    })

    // Load a layout
    appWindow.loadFile(path.join(__dirname, 'view', 'template.html'))
    return appWindow
}

// Here we have to wait for the application to signal that it is ready
// to execute our code. In this case we create a main window, query
// the ledger for its latest index and submit the result to the main
// window where it will be displayed
app.whenReady().then(() => {

    const appWindow = createWindow()

    getValidatedLedgerIndex().then((value) => {
        appWindow.webContents.send('update-ledger-index', value)
    })
})

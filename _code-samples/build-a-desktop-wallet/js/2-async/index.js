const { app, BrowserWindow } = require('electron')
const path = require('path')
const xrpl = require("xrpl")

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

/**
 * This function creates our application window
 *
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
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

// Step 2 changes - main whenReady function - start
/**
 * Create an XRPL client, subscribe to 'ledger' events, and broadcast those by
 * dispatching an 'update-ledger-data' event to the frontend.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
    const appWindow = createWindow()

    const client = new xrpl.Client(TESTNET_URL)

    await client.connect()

    // Subscribe client to 'ledger' events
    // Reference: https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/subscription-methods/subscribe
    await client.request({
        "command": "subscribe",
        "streams": ["ledger"]
    })

    // Dispatch 'update-ledger-data' event
    client.on("ledgerClosed", async (ledger) => {
        appWindow.webContents.send('update-ledger-data', ledger)
    })
}

app.whenReady().then(main)
// Step 2 changes - main whenReady function - end

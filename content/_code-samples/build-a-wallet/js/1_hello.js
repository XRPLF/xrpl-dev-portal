const { app, BrowserWindow } = require('electron')

const path = require('path')
const xrpl = require("xrpl")

const testnetUrl = "wss://s.altnet.rippletest.net:51233"

/**
 * This function creates a WebService client, which connects to the XRPL and fetches the latest ledger index.
 *
 * @returns {Promise<number>}
 */
const getValidatedLedgerIndex = async () => {
    const client = new xrpl.Client(testnetUrl)

    await client.connect()

    const ledgerRequest = {
        "command": "ledger",
        "ledger_index": "validated"
    }

    const ledgerResponse = client.request(ledgerRequest)

    await client.disconnect()

    return (await ledgerResponse).result.ledger_index
}

/**
 * This is our main function, it creates our application window, preloads the code we will need to communicate
 * between the renderer Process and the main Process, loads a layout and performs the main logic
 */
const createWindow = () => {

    // Creates the application window
    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '1_preload.js'),
        },
    })

    // Loads a layout
    appWindow.loadFile(path.join(__dirname, 'view', '1_hello.html'))

    // Performs main logic (display latest validated ledger index)
    getValidatedLedgerIndex().then((value) => {
        appWindow.webContents.send('update-ledger-index', value)
    })

}

// For purposes of this tutorial we can safely ignore the following code

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
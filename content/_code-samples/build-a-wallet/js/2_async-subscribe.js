const { app, BrowserWindow } = require('electron')
const path = require('path')
const xrpl = require("xrpl")

const testnetUrl = "wss://s.altnet.rippletest.net:51233"

/**
 * This function creates our application window
 *
 * @returns {Electron.CrossProcessExports.BrowserWindow}
 */
const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '2_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '2_async.html'))

    return appWindow
}

/**
 * This function creates a XRPL client, subscribes to 'ledger' events from the XRPL and broadcasts those by
 * dispatching the 'update-ledger-data' event which will be picked up by the frontend
 *
 * @returns {Promise<void>}
 */
const main = async () => {
    const appWindow = createWindow()

    const client = new xrpl.Client(testnetUrl)

    await client.connect()

    // Subscribe client to 'ledger' event on the XRPL
    await client.request({
        "command": "subscribe",
        "streams": ["ledger"]
    })

    // Dispatch 'update-ledger-data' event locally
    client.on("ledgerClosed", async (ledger) => {
        appWindow.webContents.send('update-ledger-data', ledger)
    })
}

// For purposes of this tutorial we can safely ignore the following code

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
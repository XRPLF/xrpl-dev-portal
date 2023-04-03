const async = require('async')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const xrpl = require("xrpl")

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

/**
 * This function sends a ledger-request and returns the response
 *
 * @param client
 * @returns {Promise<*>}
 */
const getValidatedLedgerData = async (client) => {
    const ledgerRequest = {
        "command": "ledger",
        "ledger_index": "validated"
    }
    const ledgerResponse = client.request(ledgerRequest)

    return (await ledgerResponse).result
}

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
 * This function creates a XRPL client, continuously polls the XRPL with a ledger-request and broadcasts
 * the result by dispatching the 'update-ledger-data' event which will be picked up by the frontend
 *
 * @returns {Promise<void>}
 */
const main = async () => {
    const appWindow = createWindow()

    const client = new xrpl.Client(TESTNET_URL)

    await client.connect()

    async.forever(
        function(next) {
            getValidatedLedgerData(client).then((value) => {
                appWindow.webContents.send('update-ledger-data', value)
            })

            setTimeout(function() {
                next()
            }, 2500)
        },
        function(err) {
            // if next is called with a value in its first parameter, it will appear
            // in here as 'err', and execution will stop.
        }
    )
}
const { app, BrowserWindow } = require('electron')
const path = require('path')
const xrpl = require("xrpl")

const testnetUrl = "wss://s.altnet.rippletest.net:51233"

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

const main = async () => {
    const appWindow = createWindow()

    const client = new xrpl.Client(testnetUrl)

    await client.connect()

    await client.request({
        "command": "subscribe",
        "streams": ["ledger"]
    })

    client.on("ledgerClosed", async (ledger) => {
        appWindow.webContents.send('update-ledger-data', ledger)
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
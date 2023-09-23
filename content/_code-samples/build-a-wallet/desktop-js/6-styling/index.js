const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')
const xrpl = require("xrpl")
const { initialize, subscribe, saveSaltedSeed, loadSaltedSeed } = require('../library/5_helpers')

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

const WALLET_DIR = '../Wallet'

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

const main = async () => {
    const appWindow = createWindow()

    // Create Wallet directory in case it does not exist yet
    if (!fs.existsSync(path.join(__dirname, WALLET_DIR))) {
        fs.mkdirSync(path.join(__dirname, WALLET_DIR));
    }

    let seed = null;

    ipcMain.on('seed-entered', async (event, providedSeed) => {
        seed = providedSeed
        appWindow.webContents.send('open-password-dialog')
    })

    ipcMain.on('password-entered', async (event, password) => {
        if (!fs.existsSync(path.join(__dirname, WALLET_DIR , 'seed.txt'))) {
            saveSaltedSeed(WALLET_DIR, seed, password)
        } else {
            try {
                seed = loadSaltedSeed(WALLET_DIR, password)
            } catch (error) {
                appWindow.webContents.send('open-password-dialog', true)
                return
            }
        }

        const wallet = xrpl.Wallet.fromSeed(seed)

        const client = new xrpl.Client(TESTNET_URL)

        await client.connect()

        await subscribe(client, wallet, appWindow)

        await initialize(client, wallet, appWindow)
    })

    ipcMain.on('request-seed-change', (event) => {
        fs.rmSync(path.join(__dirname, WALLET_DIR , 'seed.txt'))
        fs.rmSync(path.join(__dirname, WALLET_DIR , 'salt.txt'))
        appWindow.webContents.send('open-seed-dialog')
    })

    // We have to wait for the application frontend to be ready, otherwise
    // we might run into a race condition and the ope-dialog events
    // get triggered before the callbacks are attached
    appWindow.once('ready-to-show', () => {
        // If there is no seed present yet, ask for it, otherwise query for the password
        // for the seed that has been saved
        if (!fs.existsSync(path.join(__dirname, WALLET_DIR, 'seed.txt'))) {
            appWindow.webContents.send('open-seed-dialog')
        } else {
            appWindow.webContents.send('open-password-dialog')
        }
    })
}

app.whenReady().then(main)

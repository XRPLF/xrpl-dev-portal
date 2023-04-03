const {app, BrowserWindow, ipcMain} = require('electron')
const crypto = require("crypto")
const fs = require('fs')
const fernet = require("fernet");
const path = require('path')
const xrpl = require("xrpl")

const TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

const WALLET_DIR = 'Wallet'

let reserveBaseXrp = null, reserveIncrementXrp = null

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
    }))
}

const subscribe = async (client, wallet, appWindow) => {
    await client.request({
        "command": "subscribe",
        "streams": ["ledger"],
        "accounts": [wallet.address]
    })

    client.on("ledgerClosed", async (ledger) => {
        const ledgerData = prepareLedgerData(ledger)
        appWindow.webContents.send('update-ledger-data', ledgerData)
    })

    // Wait for transaction on subscribed account and re-request account data
    client.on("transaction", async (transaction) => {
        const accountInfoRequest = {
            "command": "account_info",
            "account": wallet.address,
            "ledger_index": transaction.ledger_index
        }

        const accountInfoResponse = await client.request(accountInfoRequest)
        const accountData = prepareAccountData(accountInfoResponse.result.account_data)
        appWindow.webContents.send('update-account-data', accountData)

        const transactions = prepareTxData([{tx: transaction.transaction}])
        appWindow.webContents.send('update-transaction-data', transactions)
    })
}

const initialize = async (client, wallet, appWindow) => {
    // Initial Account Request -> get account details
    const accountInfoResponse = await client.request({
        "command": "account_info",
        "account": wallet.address,
        "ledger_index": "current"
    })
    const accountData = prepareAccountData(accountInfoResponse.result.account_data)
    appWindow.webContents.send('update-account-data', accountData)

    // Initial Transaction Request -> list transactions on startup
    const txResponse = await client.request({
        "command": "account_tx",
        "account": wallet.address
    })
    const transactions = prepareTxData(txResponse.result.transactions)
    appWindow.webContents.send('update-transaction-data', transactions)
}

const createWindow = () => {

    const appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'view', '5_preload.js'),
        },
    })

    appWindow.loadFile(path.join(__dirname, 'view', '5_password.html'))

    return appWindow
}

/**
 *
 * @param seed
 * @param password
 */
const saveSaltedSeed = (seed, password)=> {
    const salt = crypto.randomBytes(20).toString('hex')

    fs.writeFileSync(path.join(__dirname, WALLET_DIR , 'salt.txt'), salt);

    // Hashing salted password using Password-Based Key Derivation Function 2
    const derivedKey = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256')

    // Generate a Fernet secret we can use for symmetric encryption
    const secret = new fernet.Secret(derivedKey.toString('base64'));

    // Generate encryption token with secret, time and initialization vector
    // In a real-world use case we would have current time and a random IV,
    // but for demo purposes being deterministic is just fine
    const token = new fernet.Token({
        secret: secret,
        time: Date.parse(1),
        iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    })

    const privateKey = token.encode(seed)

    fs.writeFileSync(path.join(__dirname, WALLET_DIR , 'seed.txt'), privateKey)
}

const loadSaltedSeed = (password) => {
    const salt = fs.readFileSync(path.join(__dirname, WALLET_DIR , 'salt.txt')).toString()

    const encodedSeed = fs.readFileSync(path.join(__dirname, WALLET_DIR , 'seed.txt')).toString()

    // Hashing salted password using Password-Based Key Derivation Function 2
    const derivedKey = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256')

    // Generate a Fernet secret we can use for symmetric encryption
    const secret = new fernet.Secret(derivedKey.toString('base64'));

    // Generate decryption token
    const token = new fernet.Token({
        secret: secret,
        token: encodedSeed,
        ttl: 0
    })

    return token.decode();
}


const main = async () => {
    const appWindow = createWindow()

    if (!fs.existsSync(WALLET_DIR )) {
        // Create Wallet directory in case it does not exist yet
        fs.mkdirSync(path.join(__dirname, WALLET_DIR ));
    }

    let seed = null;

    //
    ipcMain.on('seed-entered', async (event, providedSeed) => {
        seed = providedSeed
        appWindow.webContents.send('open-password-dialog')
    })

    ipcMain.on('password-entered', async (event, password) => {
        if (!fs.existsSync(path.join(__dirname, WALLET_DIR , 'seed.txt'))) {
            saveSaltedSeed(seed, password)
        } else {
            seed = loadSaltedSeed(password)
        }

        const wallet = xrpl.Wallet.fromSeed(seed)

        const client = new xrpl.Client(TESTNET_URL)

        await client.connect()

        await subscribe(client, wallet, appWindow)

        await initialize(client, wallet, appWindow)

    })

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
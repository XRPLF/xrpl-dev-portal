const {prepareReserve, prepareAccountData, prepareLedgerData} = require("./3_helpers");
const {prepareTxData} = require("./4_helpers");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const fernet = require("fernet");

/**
 * Fetches some initial data to be displayed on application startup
 *
 * @param client
 * @param wallet
 * @param appWindow
 * @returns {Promise<void>}
 */
const initialize = async (client, wallet, appWindow) => {
    // Reference: https://xrpl.org/account_info.html
    const accountInfoResponse = await client.request({
        "command": "account_info",
        "account": wallet.address,
        "ledger_index": "current"
    })
    const accountData = prepareAccountData(accountInfoResponse.result.account_data)
    appWindow.webContents.send('update-account-data', accountData)

    // Reference: https://xrpl.org/account_tx.html
    const txResponse = await client.request({
        "command": "account_tx",
        "account": wallet.address
    })
    const transactions = prepareTxData(txResponse.result.transactions)
    appWindow.webContents.send('update-transaction-data', transactions)
}

/**
 * Handles the subscriptions to ledger events and the internal routing of the responses
 *
 * @param client
 * @param wallet
 * @param appWindow
 * @returns {Promise<void>}
 */
const subscribe = async (client, wallet, appWindow) => {

    let reserve = null

    // Reference: https://xrpl.org/subscribe.html
    await client.request({
        "command": "subscribe",
        "streams": ["ledger"],
        "accounts": [wallet.address]
    })

    // Reference: https://xrpl.org/subscribe.html#ledger-stream
    client.on("ledgerClosed", async (rawLedgerData) => {
        reserve = prepareReserve(rawLedgerData)
        const ledger = prepareLedgerData(rawLedgerData)
        appWindow.webContents.send('update-ledger-data', ledger)
    })

    // Wait for transaction on subscribed account and re-request account data
    client.on("transaction", async (transaction) => {
        // Reference: https://xrpl.org/account_info.html
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

/**
 * Saves the wallet seed using proper cryptographic functions
 *
 * @param WALLET_DIR
 * @param seed
 * @param password
 */
const saveSaltedSeed = (WALLET_DIR, seed, password)=> {
    const salt = crypto.randomBytes(20).toString('hex')

    fs.writeFileSync(path.join(__dirname, WALLET_DIR, 'salt.txt'), salt);

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

    fs.writeFileSync(path.join(__dirname, WALLET_DIR, 'seed.txt'), privateKey)
}

/**
 * Loads the plaintext value of the encrypted seed
 *
 * @param WALLET_DIR
 * @param password
 * @returns {*}
 */
const loadSaltedSeed = (WALLET_DIR, password) => {
    const salt = fs.readFileSync(path.join(__dirname, WALLET_DIR, 'salt.txt')).toString()

    const encodedSeed = fs.readFileSync(path.join(__dirname, WALLET_DIR, 'seed.txt')).toString()

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

module.exports = { initialize, subscribe, saveSaltedSeed, loadSaltedSeed }

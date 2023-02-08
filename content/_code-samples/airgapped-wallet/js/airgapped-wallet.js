const crypto = require("crypto")
const fs = require('fs')
const fernet = require("fernet");
const open = require('open');
const path = require('path')
const prompt = require('prompt')
const { generateSeed, deriveAddress, deriveKeypair } = require("ripple-keypairs/dist/")
const QRCode = require('qrcode')
const xrpl = require('xrpl')

const demoAccountSeed = 'sskwYQmxT7SA37ceRaGXA5PhQYrDS'
const demoAccountAddress = 'rEDd3Wy76Ta1WqfDP2DcnBKHu31SpSiUQrS'

const demoDestinationSeed = 'sEdVokfq7fVXXjZTii2WhtpqGbJni6s'
const demoDestinationAddress = 'rBgNowfkmPczhMjHRYnBPsuSodDHWHQLdj'

const FEE = '12'
const LEDGER_OFFSET = 300
const WALLET_DIR = 'Wallet'

/**
 * Generates a new (unfunded) wallet
 *
 * @returns {{address: *, seed: *}}
 */
createWallet = function () {
    const seed = generateSeed()
    const {publicKey, privateKey} = deriveKeypair(seed)
    const address = deriveAddress(publicKey)

    console.log(
        "XRP Wallet Credentials " +
        "Wallet Address: " + address +
        "Seed: " + seed
    )

    return {address, seed}
}

/**
 * Signs transaction and returns signed transaction blob in QR code
 *
 * @param xrpAmount
 * @param destination
 * @param ledgerSequence
 * @param walletSequence
 * @param password
 * @returns {Promise<void>}
 */
signTransaction = async function (xrpAmount, destination, ledgerSequence, walletSequence, password) {

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
    const seed = token.decode();

    const wallet = xrpl.Wallet.fromSeed(seed)

    const paymentTx = {
        'TransactionType': 'Payment',
        'Account': wallet.classicAddress,
        'Amount': xrpl.xrpToDrops(xrpAmount),
        'Destination': destination
    }

    // Normally we would fetch certain needed values like Fee,
    // LastLedgerSequence snd programmatically, like so:
    //
    // const preparedTx = await client.autofill(paymentTx)
    //
    // But since this is an airgapped wallet without internet
    // connection, we have to do it manually:
    //
    // paymentTx.Sequence is set in setNextValidSequenceNumber() via sugar/autofill
    // paymentTx.LastLedgerSequence is set in setLatestValidatedLedgerSequence() via sugar/autofill
    // paymentTx.Fee is set in getFeeXrp() via sugar/getFeeXrp

    paymentTx.Sequence = walletSequence
    paymentTx.LastLedgerSequence = ledgerSequence + LEDGER_OFFSET
    paymentTx.Fee = FEE

    const signedTx = wallet.sign(paymentTx)

    fs.writeFileSync(path.join(__dirname, WALLET_DIR , 'tx_blob.txt'), signedTx.tx_blob)
    QRCode.toFile(path.join(__dirname, WALLET_DIR , 'tx_blob.png'), signedTx.tx_blob)

    open(path.join(__dirname, WALLET_DIR , 'tx_blob.png'))
}

main = async function () {

    if (!fs.existsSync(WALLET_DIR )) {
        // Create Wallet directory in case it does not exist yet
        fs.mkdirSync(path.join(__dirname, WALLET_DIR ));
    }

    if (!fs.existsSync(path.join(__dirname, WALLET_DIR , 'address.txt'))) {
        // Generate a new (unfunded) Wallet
        const {address, seed} = createWallet()

        prompt.start();

        const {password} = await prompt.get([{
            name: 'password',
            description: 'Creating a brand new Wallet, please enter a new password \n Enter Password:',
            type: 'string',
            required: true
        }])

        prompt.stop();

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
        fs.writeFileSync(path.join(__dirname, WALLET_DIR , 'address.txt'), address)
        QRCode.toFile(path.join(__dirname, WALLET_DIR , 'address.png'), address)

        console.log(''
            + 'Finished generating an account.\n'
            + 'Wallet Address: ' + address + '\n'
            + 'Please scan the QR code on your phone and use https://test.bithomp.com/faucet/ to fund the account.\n'
            + 'After that, you\'re able to sign transactions and transmit them to Machine 2 (online machine).')

        return
    }

    prompt.start();

    console.log(''
        + '1. Transact XRP.\n'
        + '2. Generate an XRP wallet (read only)\n'
        + '3. Showcase XRP Wallet Address (QR Code)\n'
        + '4. Exit')

    const {menu} = await prompt.get([{
        name: 'menu',
        description: 'Enter Index:',
        type: 'integer',
        required: true
    }])

    if (menu === 1) {
        const {
            password,
            xrpAmount,
            destinationAddress,
            accountSequence,
            ledgerSequence
        } = await prompt.get([{
            name: 'password',
            description: 'Enter Password',
            type: 'string',
            required: true
        }, {
            name: 'xrpAmount',
            description: 'Enter XRP To Send',
            type: 'number',
            required: true
        }, {
            name: 'destinationAddress',
            description: 'If you just want to try it out, you can use the faucet account rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe. Enter Destination',
            type: 'string',
            required: true
        }, {
            name: 'accountSequence',
            description: 'Look up the \'Next Sequence\' for the account using test.bithomp.com and enter it',
            type: 'integer',
            required: true
        }, {
            name: 'ledgerSequence',
            description: 'Look up the latest ledger sequence on testnet.xrpl.org and enter it below!',
            type: 'integer',
            required: true
        }])

        await signTransaction(xrpAmount, destinationAddress, ledgerSequence, accountSequence, password)
    } else if (menu === 2) {
        const {address, seed} = createWallet()
        console.log('Generated readonly Wallet (address: ' + address + ' seed: ' + seed + ')')
    } else if (menu === 3) {
        const address = fs.readFileSync(path.join(__dirname, WALLET_DIR , 'address.txt')).toString()
        console.log('Wallet Address: ' + address)
        open(path.join(__dirname, WALLET_DIR , 'address.png'))
    } else {
        return
    }

    prompt.stop();
}

main()
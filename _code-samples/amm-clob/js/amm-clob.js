if (typeof module !== "undefined") {
    // Use var here because const/let are block-scoped to the if statement.
    var xrpl = require('xrpl')
  }

const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
client.connect()

let aliceWallet = null
let bobWallet = null
let issuerWallet = null

let aliceWalletBalance = null
let bobWalletBalance = null

// Add an event listener to the startButton
document.addEventListener("DOMContentLoaded", function() {
    startButton.addEventListener("click", start)
    aCreateOfferButton.addEventListener("click", aliceCreateOffer)
    bCreateOfferButton.addEventListener("click", bobCreateOffer)
});

// Function to get Alice and Bob balances

async function getBalances() {
    aliceWalletBalance = await client.getBalances(aliceWallet.address)
    bobWalletBalance = await client.getBalances(bobWallet.address)

    aliceWalletField.value = `${aliceWalletBalance[0].value} XRP / ${aliceWalletBalance[1].value} USD`
    bobWalletField.value = `${bobWalletBalance[0].value} XRP / ${bobWalletBalance[1].value} USD`
}

// Function to update AMM

async function ammInfoUpdate() {
    const ammInfo = await client.request({
        "command": "amm_info",
        "asset": {
          "currency": "XRP"
        },
        "asset2": {
          "currency": "USD",
          "issuer": issuerWallet.address
        },
        "ledger_index": "validated"
    })

    ammInfoField.value = JSON.stringify(ammInfo.result.amm, null, 2)
}

// Function to update Alice and Bobs offers

async function updateOffers() {
    const aliceOffers = await client.request({
        "command": "account_offers",
        "account": aliceWallet.address
    })

    if ( aliceOffers.result.offers == "" ) {
        aliceOffersField.value = `No offers.`
    } else {
        aliceOffersField.value = `${JSON.stringify(aliceOffers.result.offers, null, 2)}`
    }

    const bobOffers = await client.request({
        "command": "account_offers",
        "account": bobWallet.address
    })
    
    if ( bobOffers.result.offers == "" ) {
        bobOffersField.value = `No offers.`
    } else {
        bobOffersField.value = `${JSON.stringify(bobOffers.result.offers, null, 2)}`
    }   
}

// Function to set up test harness
async function start() {
    
    // Fund wallets and wait for each to complete
    startButton.textContent = "Loading wallets...";
    
    const issuerStart = client.fundWallet()
    const ammStart = client.fundWallet()
    const aliceStart = client.fundWallet()
    const bobStart = client.fundWallet()

    const [issuerResult, ammResult, aliceResult, bobResult] = await Promise.all([issuerStart, ammStart, aliceStart, bobStart])

    issuerWallet = issuerResult.wallet
    const ammWallet = ammResult.wallet
    aliceWallet = aliceResult.wallet
    bobWallet = bobResult.wallet

    // Set up account settings
    startButton.textContent = "Setting up account settings...";

    const issuerSetRipple = client.submitAndWait({
        "TransactionType": "AccountSet",
        "Account": issuerWallet.address,
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
    }, {autofill: true, wallet: issuerWallet})

    const ammSetTrust = client.submitAndWait({
        "TransactionType": "TrustSet",
        "Account": ammWallet.address,
        "LimitAmount": {
            "currency": "USD",
            "issuer": issuerWallet.address,
            "value": "10000"
        }
    }, {autofill: true, wallet: ammWallet})

    const aliceSetTrust = client.submitAndWait({
        "TransactionType": "TrustSet",
        "Account": aliceWallet.address,
        "LimitAmount": {
            "currency": "USD",
            "issuer": issuerWallet.address,
            "value": "10000"
        }
    }, {autofill: true, wallet: aliceWallet})

    const bobSetTrust = client.submitAndWait({
        "TransactionType": "TrustSet",
        "Account": bobWallet.address,
        "LimitAmount": {
            "currency": "USD",
            "issuer": issuerWallet.address,
            "value": "10000"
        }
    }, {autofill: true, wallet: bobWallet})

    await Promise.all([issuerSetRipple, ammSetTrust, aliceSetTrust, bobSetTrust])

    // Send USD token
    startButton.textContent = "Sending USD...";

    const issuerAccountInfo = await client.request({
        "command": "account_info",
        "account": issuerWallet.address
    })

    let sequence = issuerAccountInfo.result.account_data.Sequence

    const ammUSD = client.submitAndWait({
        "TransactionType": "Payment",
        "Account": issuerWallet.address,
        "Amount": {
          "currency": "USD",
          "value": "1000",
          "issuer": issuerWallet.address
        },
        "Destination": ammWallet.address,
        "Sequence": sequence ++
    }, {autofill: true, wallet: issuerWallet})

    const aliceUSD = client.submitAndWait({
        "TransactionType": "Payment",
        "Account": issuerWallet.address,
        "Amount": {
          "currency": "USD",
          "value": "1000",
          "issuer": issuerWallet.address
        },
        "Destination": aliceWallet.address,
        "Sequence": sequence ++
    }, {autofill: true, wallet: issuerWallet})

    const bobUSD = client.submitAndWait({
        "TransactionType": "Payment",
        "Account": issuerWallet.address,
        "Amount": {
          "currency": "USD",
          "value": "1000",
          "issuer": issuerWallet.address
        },
        "Destination": bobWallet.address,
        "Sequence": sequence ++
    }, {autofill: true, wallet: issuerWallet})

    await Promise.all([ammUSD, aliceUSD, bobUSD])

    // Update Alice and Bob's XRP and USD balances

    getBalances()

    // Set up AMM
    startButton.textContent = "Creating AMM...";

    await client.submitAndWait({
        "TransactionType": "AMMCreate",
        "Account": ammWallet.address,
        "Amount": "50000000", // XRP as drops
        "Amount2": {
          "currency": "USD",
          "issuer": issuerWallet.address,
          "value": "500"
        },
        "TradingFee": 500 // 0.5%
      }, {autofill: true, wallet: ammWallet})

    // Update AMM
    ammInfoUpdate()

    startButton.textContent = "Ready (Click to Restart)";

}


// Submit Alice Offers
async function aliceCreateOffer() {

    aCreateOfferButton.textContent = "Creating Offer..."

    try {
        let aliceTakerGets = null
        let aliceTakerPays = null

        if ( aliceTakerGetsCurrency.value == 'XRP' ) {
            aliceTakerGets = xrpl.xrpToDrops(aliceTakerGetsAmount.value)
        } else {
            aliceTakerGets = {
                "currency": "USD",
                "issuer": issuerWallet.address,
                "value": aliceTakerGetsAmount.value
            }
        }

        if ( aliceTakerPaysCurrency.value == 'XRP' ) {
            aliceTakerPays = xrpl.xrpToDrops(aliceTakerPaysAmount.value)
        } else {
            aliceTakerPays = {
                "currency": "USD",
                "issuer": issuerWallet.address,
                "value": aliceTakerPaysAmount.value
            }
        }

        await client.submitAndWait({
            "TransactionType": "OfferCreate",
            "Account": aliceWallet.address,
            "TakerGets": aliceTakerGets, 
            "TakerPays": aliceTakerPays
        }, {autofill: true, wallet: aliceWallet})

        updateOffers()
        getBalances()
        ammInfoUpdate()

    } catch (error) {
        aliceOffersField.value = `${error.message}`
    }

    aCreateOfferButton.textContent = "Create Another Offer"
}

// Submit Bob Offers
async function bobCreateOffer() {

    bCreateOfferButton.textContent = "Creating Offer..."

    try {
        let bobTakerGets = null
        let bobTakerPays = null

        if ( bobTakerGetsCurrency.value == 'XRP' ) {
            bobTakerGets = xrpl.xrpToDrops(bobTakerGetsAmount.value)
        } else {
            bobTakerGets = {
                "currency": "USD",
                "issuer": issuerWallet.address,
                "value": bobTakerGetsAmount.value
            }
        }

        if ( bobTakerPaysCurrency.value == 'XRP' ) {
            bobTakerPays = xrpl.xrpToDrops(bobTakerPaysAmount.value)
        } else {
            bobTakerPays = {
                "currency": "USD",
                "issuer": issuerWallet.address,
                "value": bobTakerPaysAmount.value
            }
        }

        await client.submitAndWait({
            "TransactionType": "OfferCreate",
            "Account": bobWallet.address,
            "TakerGets": bobTakerGets, 
            "TakerPays": bobTakerPays
        }, {autofill: true, wallet: bobWallet})

        updateOffers()
        getBalances()
        ammInfoUpdate()

    } catch (error) {
        bobOffersField.value = `${error.message}`
    }

    bCreateOfferButton.textContent = "Create Another Offer"
}
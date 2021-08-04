// Example credentials
let hot_address = "rMCcNuTcajgw7YTgBy1sys3b89QqjUrMpH"
let hot_secret = "sn3nxiW7v8KXzPzAqzyHXbSSKNuN9"
let cold_address = ""
let cold_secret = ""

// Connect ---------------------------------------------------------------------
// ripple = require('ripple-lib') // For Node.js. In browsers, use <script>.
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()
api.on('connected', async () => {

  // Get credentials from the Testnet Faucet -----------------------------------
  // This doesn't technically need to happen after you call api.connect() but
  // it's convenient to do here.
  async function get_faucet_address() {
    const faucet_url = "https://faucet.altnet.rippletest.net/accounts"
    const faucet_options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: '{}'
    }
    const response = await fetch(faucet_url, faucet_options)
    if (!response.ok) {
      throw `Faucet returned an error: ${data.error}`
    }
    const data = await response.json()
    return data
  }

  const hot_data = await get_faucet_address()
  hot_address = hot_data.account.address
  hot_secret = hot_data.account.secret

  const cold_data = await get_faucet_address()
  cold_address = cold_data.account.address
  cold_secret = cold_data.account.secret

  console.log("Waiting until we have a validated starting sequence number...")
  // If you go too soon, the funding transaction might slip back a ledger and
  // then your starting Sequence number will be off. This is mostly relevant
  // when you want to use a Testnet account right after getting a reply from
  // the faucet.
  while (true) {
    try {
      await api.request("account_info", {account: address, ledger_index: "validated"})
      break
    } catch(e) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Prepare AccountSet transaction for the issuer (cold address)
  const cold_settings_tx = {
    "Account": cold_address,
    "TransferFee": 0,
    "TickSize": 5,
    "SetFlag": 8 // enable Default Ripple
    //"Flags": (api.txFlags.AccountSet.DisallowXRP |
    //          api.txFlags.AccountSet.RequireDestTag)
  }

  const prepared_cst = await api.prepareTransaction(cold_settings_tx, {maxLedgerVersionOffset: 10})

  







}) // End of api.on.('connected')

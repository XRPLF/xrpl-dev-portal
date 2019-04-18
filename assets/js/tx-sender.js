const set_up_tx_sender = async function() {
  FAUCET_URL = "https://faucet.altnet.rippletest.net/accounts"
  TESTNET_URL = "wss://s.altnet.rippletest.net:51233"

  let sending_address = ""
  let sending_secret = ""
  let xrp_balance = 0

  console.debug("Getting a sending address from the faucet...")

  faucet_response = function(data) {
    sending_address = data.account.address
    sending_secret = data.account.secret
    xrp_balance = Number(data.balance) // Faucet only delivers ~10,000 XRP,
                                       // so this won't go over JavaScript's
                                       // 64-bit double precision

    $("#balance-item").text(xrp_balance) + " drops"
    $(".sending-address-item").text(sending_address)
  }

  // TEMP: reuse same address for testing
  faucet_response({account:{address:"r6f2viHtMjNSfERbZmXXkJnMmkBAN6d9X", secret:"spyTc4y4GAQwBfQHCxiJ1Xd2mmnM2"},balance:10000})

  // POST-TEMP: Version that actually uses the faucet on every run:
  // $.ajax({
  //   url: FAUCET_URL,
  //   type: 'POST',
  //   dataType: 'json',
  //   success: faucet_response,
  //   error: function() {
  //     alert("There was an error with the XRP Ledger Test Net Faucet. Reload this page to try again.");
  //   }
  // })
  //

  api = new ripple.RippleAPI({server: TESTNET_URL})
  api.on('connected', () => {
    $("#connection-status-item").text("Connected")
    $("#connection-status-item").removeClass("disabled").addClass("active")
  })
  api.on('disconnected', (code) => {
    $("#connection-status-item").text("Not connected")
    $("#connection-status-item").removeClass("active").addClass("disabled")
  })
  console.log("Connecting to Test Net WebSocket...")
  api.connect()


}

$(document).ready( function() {
  console.log("doc ready!")
  set_up_tx_sender()
} )

async function wait_for_seq(network_url, address) {
  const api = new xrpl.Client(network_url)
  await api.connect()
  let response;
  while (true) {
    try {
      response = await api.request({
        command: "account_info",
        account: address,
        ledger_index: "validated"
      })
      break
    } catch(e) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  console.log(response)
  $("#sequence").html('<h3>Sequence Number</h3> '+response.result.account_data.Sequence)
  api.disconnect()
}


function rippleTestNetCredentials(url, altnet_name) {

  const credentials = $('#your-credentials')
  const address = $('#address')
  const secret = $('#secret')
  const balance = $('#balance')
  const sequence = $('#sequence')
  const loader = $('#loader')

  //reset the fields initially and for re-generation
  credentials.hide()
  address.html('')
  secret.html('')
  balance.html('')
  sequence.html('')
  loader.css('display', 'inline')


  //call the alt-net and get key generations
  $.ajax({
    url: url,
    type: 'POST',
    dataType: 'json',
    success: function(data) {
      //hide the loader and show results
      loader.hide();
      credentials.hide().html('<h2>Your '+altnet_name+' Credentials</h2>').fadeIn('fast')
      address.hide().html('<h3>Address</h3> ' +
        data.account.address).fadeIn('fast')
      secret.hide().html('<h3>Secret</h3> ' +
        data.account.secret).fadeIn('fast')
      balance.hide().html('<h3>Balance</h3> ' +
        Number(data.balance).toLocaleString('en') + ' XRP').fadeIn('fast')
      sequence.html('<h3>Sequence</h3> <img class="throbber" src="assets/img/xrp-loader-96.png"> Waiting...').fadeIn('fast')
      if (altnet_name=="Testnet") {
        wait_for_seq("wss://s.altnet.rippletest.net:51233", data.account.address)
      } else if (altnet_name=="NFT-Devnet") {
        wait_for_seq("wss://xls20-sandbox.rippletest.net:51233", data.account.address)
      } else {
        wait_for_seq("wss://s.devnet.rippletest.net:51233", data.account.address)
      }

    },
    error: function() {
      loader.hide();
      alert("There was an error with the "+altnet_name+" faucet. Please try again.");
    }
  })
}

$(document).ready(function() {
  function testnet_click(evt) {
    rippleTestNetCredentials("https://faucet.altnet.rippletest.net/accounts",
      "Testnet")
  }
  function devnet_click(evt) {
    rippleTestNetCredentials("https://faucet.devnet.rippletest.net/accounts",
      "Devnet")
  }
  function nftnet_click(evt) {
    rippleTestNetCredentials("https://faucet-nft.ripple.com/accounts",
      "NFT-Devnet")
  }

  $('#testnet-creds-button').click(testnet_click)
  $('#devnet-creds-button').click(devnet_click)
  $('#nftnet-creds-button').click(nftnet_click)
})

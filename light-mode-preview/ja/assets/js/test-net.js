function rippleTestNetCredentials(url, altnet_name) {

  const credentials = $('#your-credentials')
  const address = $('#address')
  const secret = $('#secret')
  const balance = $('#balance')
  const loader = $('#loader')

  //reset the fields initially and for re-generation
  credentials.hide()
  address.html('')
  secret.html('')
  balance.html('')
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

  $('#testnet-creds-button').click(testnet_click)
  $('#devnet-creds-button').click(devnet_click)
})

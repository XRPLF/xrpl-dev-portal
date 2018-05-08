function rippleTestNetCredentials() {

  var credentials = $('#your-credentials');
  var address = $('#address');
  var secret = $('#secret');
  var balance = $('#balance');
  var loader = $('#loader');

  //reset the fields initially and for re-generation
  credentials.hide();
  address.html('');
  secret.html('');
  balance.html('');
  loader.css('display', 'inline');


  //call the alt-net and get key generations
  $.ajax({
    url: "https://faucet.altnet.rippletest.net/accounts",
    type: 'POST',
    dataType: 'json',
    success: function(data) {
      //hide the loader and show results
      loader.hide();
      credentials.hide().html('<h2>Your Credentials</h2>').fadeIn('fast');
      address.hide().html('<h3>Address</h3> ' + data.account.address).fadeIn('fast');
      secret.hide().html('<h3>Secret</h3> ' + data.account.secret).fadeIn('fast');
      balance.hide().html('<h3>Balance</h3> ' + Number(data.balance).toLocaleString('en') + ' XRP').fadeIn('fast');
    },
    error: function() {
      loader.hide();
      alert("There was an error with the Ripple Test Net, please try again.");
    }
  });
}

$(document).ready(function() {
  $('#generate-creds-button').click(rippleTestNetCredentials);
});

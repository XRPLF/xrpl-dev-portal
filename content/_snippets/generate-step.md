{% if faucet_url is undefined %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% endif %}

{{ start_step("Generate") }}
<button id="generate-creds-button" class="btn btn-primary">Generate credentials</button>
<div id='loader-generate' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png"> Generating Keys...</div>
<div id='address'></div>
<div id='secret'></div>
<div id='balance'></div>
<div id="populate-creds-status"></div>
{{ end_step() }}
<script type="application/javascript">
$(document).ready( () => {

  $("#generate-creds-button").click( () => {
    // Wipe existing results
    $("#address").html("")
    $("#secret").html("")
    $("#balance").html("")
    $("#populate-creds-status").html("")

    $("#loader-generate").show()

    $.ajax({
      url: "{{faucet_url}}",
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        $("#loader-generate").hide()
        $("#address").hide().html("<strong>Address:</strong> " +
          '<span id="use-address">' +
          data.account.address
          + "</span>").show()
        $("#secret").hide().html('<strong>Secret:</strong> ' +
          '<span id="use-secret">' +
          data.account.secret +
          "</span>").show()
        $("#balance").hide().html('<strong>Balance:</strong> ' +
          Number(data.balance).toLocaleString('en') +
          ' XRP').show()

        // Automatically populate examples with these credentials...
        // Set sender address
        $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
          let eltext = $(this).text()
          $(this).text( eltext.replace(EXAMPLE_ADDR, data.account.address) )
        })

        // Set sender secret
        $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
          let eltext = $(this).text()
          $(this).text( eltext.replace(EXAMPLE_SECRET, data.account.secret) )
        })

        $("#populate-creds-status").text("Populated this page's examples with these credentials.")

        complete_step("Generate")

      },
      error: function() {
        $("#loader-generate").hide();
        $("#populate-creds-status").html(
          `<p class="devportal-callout warning"><strong>Error:</strong>
          There was an error connecting to the test network Faucet. Please
          try again.</p>`)
        return;
      }
    })
  })

  const EXAMPLE_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const EXAMPLE_SECRET = "s████████████████████████████"

})
</script>

**Caution:** Ripple provides the [Testnet and Devnet](parallel-networks.html) for testing purposes only, and sometimes resets the state of these test networks along with all balances. As a precaution, Ripple recommends **not** using the same addresses on Testnet/Devnet and Mainnet.

{% if faucet_url is undefined %}
  {% set faucet_url = "https://faucet.altnet.rippletest.net/accounts" %}
{% endif %}

{{ start_step("Generate") }}
<button id="generate-creds-button" class="btn btn-primary">暗号鍵を作成する</button>
<div id='loader-0' style="display: none;"><img class='throbber' src="assets/img/xrp-loader-96.png">暗号鍵を作成しています…</div>
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
        $("#address").hide().html("<strong>アドレス:</strong> " +
          '<span id="use-address">' +
          data.account.address
          + "</span>").show()
        $("#secret").hide().html('<strong>シード:</strong> ' +
          '<span id="use-secret">' +
          data.account.secret +
          "</span>").show()
        $("#balance").hide().html('<strong>残高:</strong> ' +
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

        $("#populate-creds-status").text("このページの例にこのアドレスとシードを入力しました。")

        complete_step("Generate")

      },
      error: function() {
        $("#loader-generate").hide();
        $("#populate-creds-status").html(
          `<p class="devportal-callout warning"><strong>エラー:</strong>
          テストネットワークFaucetにエラーが発生しました。もう一度試してください。`);
      }
    })
  })

  const EXAMPLE_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  const EXAMPLE_SECRET = "s████████████████████████████"

})
</script>

**注意:** Rippleは[TestnetとDevnet](parallel-networks.html)をテストの目的でのみ運用しており、その状態とすべての残高を定期的にリセットしています。予防措置として、Testnet、DevnetとMainnetで同じアドレスを使用**しない**ことをお勧めします。

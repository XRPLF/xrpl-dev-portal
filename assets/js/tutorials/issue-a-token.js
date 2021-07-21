// Variant setup for generate creds button from interactive-tutorial.js.
// This version generates two sets of creds, one for the issuer and one for
// the hot wallet / receiver

const EXAMPLE_COLD_ADDR = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
const EXAMPLE_COLD_SECRET = "sIss█████████████████████████"
function setup_2x_generate_step() {

  $("#generate-2x-creds-button").click( async (event) => {
    const block = $(event.target).closest(".interactive-block")
    block.find(".output-area").html("")
    block.find(".loader").show()
    // Get faucet URL (Testnet/Devnet/etc.)
    const faucet_url = $("#generate-2x-creds-button").data("fauceturl")

    try {
      const data = await call_faucet(faucet_url)
      const data2 = await call_faucet(faucet_url)

      block.find(".loader").hide()
      block.find(".output-area").html(`<div class="row">
        <div class="col-xl-6 p-3">
          <div><strong>${tl("Cold Address:")}</strong>
          <span id="cold-use-address">${data.account.address}</span></div>
          <div><strong>${tl("Cold Secret:")}</strong>
          <span id="cold-use-secret">${data.account.secret}</span></div>
          <strong>${tl("XRP Balance:")}</strong>
          ${Number(data.balance).toLocaleString(current_locale)} XRP
        </div>
        <div class="col-xl-6 p-3">
          <div><strong>${tl("Hot Address:")}</strong>
          <span id="hot-use-address">${data2.account.address}</span></div>
          <div><strong>${tl("Hot Secret:")}</strong>
          <span id="hot-use-secret">${data2.account.secret}</span></div>
          <strong>${tl("XRP Balance:")}</strong>
          ${Number(data2.balance).toLocaleString(current_locale)} XRP
        </div>
      </div>`)

      // TODO: Automatically populate all examples in the page with the
      // generated credentials...
      // $("code span:contains('"+EXAMPLE_ADDR+"')").each( function() {
      //   let eltext = $(this).text()
      //   $(this).text( eltext.replace(EXAMPLE_ADDR, data.account.address) )
      // })
      // $("code span:contains('"+EXAMPLE_SECRET+"')").each( function() {
      //   let eltext = $(this).text()
      //   $(this).text( eltext.replace(EXAMPLE_SECRET, data.account.secret) )
      // })
      //
      // block.find(".output-area").append(`<p>${tl("Populated this page's examples with these credentials.")}</p>`)

      complete_step("Generate")

    } catch(err) {
      block.find(".loader").hide()
      block.find(".output-area").html(
        `<p class="devportal-callout warning"><strong>${tl("Error:")}</strong>
        ${tl("There was an error connecting to the Faucet. Please try again.")}
        </p>`)
      return
    }
  })
}



$(document).ready(() => {
  setup_2x_generate_step()
})
